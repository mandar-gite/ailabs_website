---
title: "Reasoning caching, from the inside: how CPU-ARC compiles a solved method"
seoTitle: "Reasoning caching: how CPU-ARC works"
description: "How CPU-ARC turns a solved reasoning trace into CPU-run programs, what its numbers say, when the build cost pays back, and how a cache hit fails."
pubDate: 2026-11-24
author: "Mandar Gite"
category: "AI Engineering"
tags: ["reasoning caching", "CPU-ARC", "LLM inference", "semantic caching", "AI agents"]
featured: false
draft: true  # flip to false after Mandar and Ajay sign off
image: "/og-cpu-arc-reasoning.jpg"
faq:
  - question: "How does CPU-ARC find a cached method?"
    answer: "It embeds the request and compares it against a registry of entry points by cosine similarity. A close enough match runs the compiled function; anything else goes to the source model."
  - question: "Why does a 1B model work here?"
    answer: "The compiled function carries the method. The small model only extracts inputs and fills language gaps, which is a much smaller job than reasoning from scratch."
  - question: "How many hits does a reasoning cache need to pay back?"
    answer: "Divide the build cost (as a multiple of one source solve) by 1 − 1/r, where r is the per-answer savings ratio. On the paper's figures that's 90 hits on GSM8K and 13 on AIME 2025, before misses and wrong hits."
  - question: "Can I run CPU-ARC today?"
    answer: "The paper doesn't link a release. As of 24 Nov 2026 it lists no code, weights or logs."
---

*This is the engineering edition. For the short version, read [stop paying again for reasoning you've already done](/blog/cpu-arc-reasoning-reuse/).*

Most LLM stacks cache 2 things: the prompt prefix and, sometimes, a finished answer keyed by embedding similarity. Both break the moment the numbers in a problem change.

CPU-ARC caches a third thing: the method. This post walks through how it does that, what the paper reports, and what you'd need to check before building something like it.

## The architecture

CPU-ARC (Belcak, Heinrich, Muralidharan, Diao and Molchanov at NVIDIA, arXiv:2611.09891, submitted 6 Nov 2026) splits the work across 3 roles.

1. **Source model.** A capable model solves the problem once and leaves a reasoning trace.
2. **Builder model.** It turns that trace into semantic functions: Python callables that take a context object and describe their inputs and outputs in natural language.
3. **Target model.** A small model, a fine-tuned Llama 3.2 1B in the reported runs, helps run those functions on the CPU. (The paper's early runs used Claude Haiku 4.5 as the target.)

In the reported runs, Claude Opus 4.5 plays both source and builder (section 3.4).

At request time:

1. The request is embedded and compared against an entry-point registry by cosine similarity. The threshold is configurable; the paper doesn't publish the value it used.
2. On a hit, the target model extracts each parameter from the request, guided by the stored descriptions. Then the root function runs. The glue between steps is code; the target only handles elementary language calls such as classification, extraction and conversion.
3. On a miss, or if invocation raises an error, the request goes to the source model.

Inside the functions, a few primitives do the work (section 2.1). `load(ctx, "<description>")` finds an input by its plain-language description. `do()` calls another semantic function by description. `narrate()` leaves a readable trace. `lm()` makes an elementary model call. The context is a stack of vector-store memory layers, and lookups inside it use EmbeddingGemma (about 300M parameters) on a FAISS flat index (section 3.4).

An optional finalisation step compiles all of that into a self-contained Python module: `do()` becomes a direct call and `load()` becomes a named parameter, so no embedding engine or vector store is needed (section 2.2.3). 2 things stay: the `lm()` and extraction calls still need a model, and a compiled network is frozen, so any change means recompiling.

To make the idea concrete, here's our own sketch in the style of those primitives. It's illustrative, written for this post, and not code from the paper.

```python
# Illustrative only: our sketch of a semantic function in the paper's style.
def compound_interest(ctx):
    p = load(ctx, "the principal amount", d_type=float)
    r = load(ctx, "the annual interest rate, in per cent", d_type=float)
    t = load(ctx, "the number of years", d_type=float)
    n = load(ctx, "compounding periods per year", d_type=int)
    narrate("Apply A = P(1 + r/n)^(nt) and round to 2 decimals.")
    return {"the final amount, rounded to 2 decimals": round(p * (1 + r / 100 / n) ** (n * t), 2)}
```

The method lives in the code. The small model only has to pull the principal, the rate and the rest out of a reworded question.

## Inside the build

The builder works in 5 phases (section 2.2.1): it isolates the inputs and outputs, decomposes the trace, recognises the parameters (a generic template, the values and their valid ranges), plans the granularity, and implements the functions in an agentic loop.

Each candidate is checked before it's registered. A syntax and static check comes first. Then the function runs on the original parameters, and an LM judge compares its output with the matching part of the source trace. Failures go back to the builder with the errors and critiques. The root function then gets 2 more tests: correctness against the transcript and the golden answer, and an extraction round trip, where the target pulls the parameters out of the raw input again.

The 1B target was fine-tuned on about 20% of real usage logs from the benchmark runs, plus a synthetic set about 10 times larger written by the source model (section 2.2.4).

## What the paper reports

All figures below are the authors', from section 3.6 and table 2, using March 2026 API prices.

| Measure | Result |
|---|---|
| Accuracy against the source model | Matches or beats it on 7 of 8 benchmarks; GSM8K is the exception |
| AIME 2025 accuracy | 93.3% for the cache, against 83.3% for the source |
| Cost per answer, cache against source | 16.3x cheaper on GSM8K, 291.1x cheaper on AIME 2025 |
| Cost to build the cache | 12.1x to 83.7x the cost of a single source solve |
| Perturbation pass rate | At least 90.8% across phrasal, parametric and combined rewrites |

Per benchmark, source accuracy against cache accuracy (table 2):

| Benchmark | Source | Cache |
|---|---|---|
| MATH-500 | 98.6% | 98.8% |
| AIME 2024 | 100% | 100% |
| AIME 2025 | 83.3% | 93.3% |
| AIME 2026 | 90.0% | 96.7% |
| GPQA Diamond | 83.8% | 83.8% |
| GSM8K | 98.5% | 98.0% |
| MMLU-Pro | 88.0% | 89.0% |
| SciBench | 85.2% | 88.2% |

The perturbation tests run only on problems the cache already answers correctly (section 3.2). A phrasal rewrite keeps the parameters and changes the wording; a parametric rewrite keeps the wording and changes the values; a combined rewrite does both. A committee of 2 models must agree that each rewrite is valid.

2 cautions before you quote these:

- 2 of the 8 benchmarks (GSM8K and MMLU-Pro) sit outside maths and science, so "maths and science benchmarks" overstates the suite.
- As of 24 Nov 2026, the paper links no code, weights or logs. Nobody outside NVIDIA can reproduce table 2 yet.

## When does the build cost pay back?

The paper gives the answer for its own suite: about 13 hits on AIME 2025 and about 90 on GSM8K (section 3.6). Here's the formula, so you can rerun it with your numbers.

Let the source model's cost per solve be *S*. Then:

- Building the cache costs *k × S*.
- A cache hit costs *S / r*, where *r* is the savings ratio.
- Each hit saves *S − S / r*.

The number of hits that repays the build is:

```
hits = k / (1 − 1/r)
```

On the paper's 2 extremes:

| Benchmark | Build cost *k* | Savings *r* | Hits to repay |
|---|---|---|---|
| GSM8K | 83.7 | 16.3 | 83.7 / 0.9387 = 89.2, so 90 hits |
| AIME 2025 | 12.1 | 291.1 | 12.1 / 0.9966 = 12.14, so 13 hits |

The model leaves 3 things out, and each makes the real number worse:

- **Misses.** A miss pays the full source cost plus the lookup.
- **Wrong hits.** A hit that returns a wrong answer costs whatever that error costs you downstream.
- **Rebuilds.** When the method or a tool changes, *k* is paid again.

So the cheap case is a hard, stable, high-volume method: few hits repay the build, and the method doesn't drift.

## The neighbouring work

4 other papers make related bets. They measure different things on different suites, so read this as a map of approaches.

| Approach | What it reuses | How it checks a reuse | Reported result |
|---|---|---|---|
| **SkillCompiler** (Yang and colleagues, arXiv:2610.39508) | Well-specified parts of an agent skill, compiled into validated programs; an LLM handles the rest | Program validation | Up to 32.33% better task performance across 5 benchmarks and 6 model families |
| **StepCache** (Nouri, arXiv:2603.28795) | Ordered steps of an earlier solution | Checks each step, patches the ones that fail, skips reuse on a semantic change | CPU-only micro-benchmark on maths and JSON variants: mean latency 2.13 s to 0.67 s; correctness 72.5% to 100% under its own checks |
| **Agentic Plan Caching** (Zhang, Wornow, Wan and Olukotun, arXiv:2506.14852) | Plan templates for agents, adapted per task | Not described in the abstract | Average cost down 50.31%, latency down 27.28%, with performance held |
| **Reason Wide, Not Deep** (Singh and colleagues, arXiv:2608.07885) | A compact natural-language skill distilled from earlier trajectories, placed in a non-reasoning model's system prompt | No per-request check described; the skill sits in the prompt | For GPT-5.4-mini on held-out tasks, 55% to 100%+ of the reasoning gap recovered, with 2.7x to 6x fewer output tokens; deep search still wins in telecom and SpreadsheetBench |

The spread matters. StepCache verifies every reuse. Reason Wide, Not Deep describes no per-request check and still recovers most of the gap. CPU-ARC sits in between: a hit runs compiled code, and only an invocation error triggers the fallback.

## How a cache hit fails

Semantic caches have known failure modes, and a compiled method inherits all of them.

| Failure | What happens | A control to design in |
|---|---|---|
| False match | Cosine similarity matches a request that only looks like a cached problem | A similarity threshold tuned on held-out near-misses, plus an output check before the answer is used |
| Poisoning | Someone gets a wrong method into the registry, and it's served many times over | Restrict who and what can write entries; review new entries before they go live |
| Staleness | A tool, an API or a rule changes, and the compiled method is now wrong | Version each entry against the tools and data it depends on; expire it when they change |
| Bad compile | The builder trusts a flawed source trace; with tool access, the error repeats on every hit | The paper's LM-judge and round-trip checks are a start; add tests on fresh variants before an entry goes live |
| Silent drift | Hit rate stays high while answer quality falls | Sample hits, rerun them on the source model, and track agreement over time |

The perturbation pass rate (90.8% at worst) is the paper's evidence on the first row. It covers their rewrites on their benchmarks. Your near-misses will look different.

<div class="takeaway">

## A takeaway for us all

Caching the method is a real lever when the method is stable and the volume is high. The engineering work is in the controls around a hit: matching, checking, versioning and access.

</div>

<div class="callout">

## Here's what you can do

- List the tasks your system repeats, and mark the ones where only the inputs change.
- For each candidate, write the output check before you write the cache. If you can't write the check, don't cache the method.
- Run the break-even formula with your own *k*, *r* and expected hit volume, then add your miss rate.
- Version every entry against the tools and data it calls, and expire it when they change.
- Sample hits in production and rerun them on the full model, so drift shows up before users see it.

</div>

## References

1. Peter Belcak, Greg Heinrich, Saurav Muralidharan, Shizhe Diao and Pavlo Molchanov. "CPU-ARC: Agentic Reasoning Caching for on-CPU Reasoning Reuse." arXiv:2611.09891, 2026. <https://arxiv.org/abs/2611.09891>
2. Chengyu Yang, Yunxiang Zheng, Zongzheng Li, Jiamei Li, Boxun Lan, Xiaoyu Liu, Xiaoyu Zhang, Xiaohong Chen and Ming Hu. "Compile Away Uncertainty: Self-Evolving Agent Skills via Programmatic Compilation." arXiv:2610.39508, 2026. <https://arxiv.org/abs/2610.39508>
3. Azam Nouri. "StepCache: Step-Level Reuse with Lightweight Verification and Selective Patching for LLM Serving." arXiv:2603.28795, 2026. <https://arxiv.org/abs/2603.28795>
4. Qizheng Zhang, Michael Wornow, Gerry Wan and Kunle Olukotun. "Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents." arXiv:2506.14852, 2025. <https://arxiv.org/abs/2506.14852>
5. Agamdeep Singh, Srishti Gautam, Priyanshu Gupta, Nikita Mehrotra, Tanmay Bakshi and Sumit Gulwani. "Reason Wide, Not Deep: Amortizing the Reasoning Premium into Distilled Skills." arXiv:2608.07885, 2026. <https://arxiv.org/abs/2608.07885>
