---
title: "Stop paying again for reasoning you've already done"
seoTitle: "LLM cost optimization: reuse solved reasoning"
description: "LLM cost optimization past prompt caching: CPU-ARC and 4 related papers compile a solved method into something cheap to run, and every reuse needs a check."
pubDate: 2026-11-24
author: "Mandar Gite"
category: "AI Engineering"
tags: ["LLM costs", "reasoning caching", "CPU-ARC", "AI agents", "small models"]
featured: false
draft: true  # flip to false after Mandar and Ajay sign off
image: "/og-cpu-arc-reasoning.jpg"
faq:
  - question: "What is CPU-ARC?"
    answer: "A method from NVIDIA researchers that turns a large model's solved reasoning into small Python programs. A small model then runs those programs on a CPU for similar new problems."
  - question: "How is reasoning caching different from prompt caching?"
    answer: "Prompt caching reuses the start of a prompt, so you don't pay for it twice. Reasoning caching reuses the method that solved a problem, so it still works when the wording or the numbers change."
  - question: "When is it worth caching a method?"
    answer: "When the same method applies to many cases with different inputs, and you can write down checks for the output. Open-ended work, or work where tools and data keep changing, usually isn't a fit."
  - question: "What can go wrong with a cache hit?"
    answer: "It can match a problem that only looks similar, serve an answer that's gone stale, or repeat a wrong answer many times. Check each hit for correctness, freshness and who can write to the cache."
---

*Want the engineering detail? Read [how CPU-ARC works, from the inside](/blog/cpu-arc-reasoning-caching-technical/).*

Most teams pay a large model to think through every question from scratch, even when they've solved that kind of problem many times before. I think that's the wrong default.

For LLM cost optimization, the most useful thing to cache is the method itself, provided you can check that each reuse is still correct, current and safe.

## What we cache today

Most production stacks cache 2 things. Token prefixes, so a long system prompt isn't paid for twice. And sometimes a finished answer, served again when a new query looks similar.

Both are worth having. Neither helps when the wording changes, the numbers in the problem change, or an agent meets a familiar task in a slightly new setting.

In those cases the valuable thing to reuse is the method: how the problem was broken down, which checks ran, which tools were called, and in what order.

## Compile the method once, run it cheaply

In November 2026, Peter Belcak and colleagues at NVIDIA published CPU-ARC, a technical report that takes this idea a long way.

A capable source model works a problem once. A builder model turns that reasoning into semantic functions: small Python programs whose inputs and outputs are described in plain language.

For a new request, the system uses embedding similarity to find a matching entry point. That means matching the request to a stored method by similarity in meaning.

On a hit, it runs the compiled program on the CPU, with light help from a small target model. In the reported runs, that's a fine-tuned Llama 3.2 1B. A miss, or an error when invoking the program, falls back to the source model.

An optional last step compiles the lookup itself into ordinary Python, so the whole cache can ship as a standalone module.

## The savings come with a building cost

Frontier reasoning costs real money and real time, and both now shape how systems get built. A program that runs mostly on a CPU with a 1B model sits at a very different point on that curve.

Using March 2026 API prices, the authors report:

- **Accuracy:** the cache matches or beats the source model on 7 of its 8 benchmarks, with GSM8K the exception. On AIME 2025, it scores 93.3% against the source's 83.3%.
- **Running cost:** a cached answer costs 16.3x less than the source on GSM8K, and 291.1x less on AIME 2025.
- **Building cost:** compiling the cache costs 12.1x to 83.7x a single source solve.
- **Rewording:** at least 90.8% of reworded and re-numbered problems still pass.

Those are the authors' figures, on their benchmarks, at dated prices. I wouldn't turn them into a promise about your workload.

The shape of the result is worth taking seriously, though. If the method is stable, paying once to compile it and then running it cheaply can beat paying a frontier model to think the same thoughts again.

## A field is forming around this idea

CPU-ARC is a strong example, and other groups are working on the same move.

- **SkillCompiler** (Yang and colleagues) compiles the well-specified parts of an agent skill into validated programs and leaves the messy rest to a language model. They report up to 32.33% better task performance across 5 benchmarks and 6 model families.
- **StepCache** (Nouri) reuses the ordered steps of an earlier solution, checks them, and patches only the steps that fail. It skips reuse when the change is semantic. In a CPU-only micro-benchmark on maths and JSON variants, mean latency fell from 2.13 s to 0.67 s, and correctness rose from 72.5% to 100% under its own checks.
- **Agentic Plan Caching** (Zhang, Wornow, Wan and Olukotun) stores and adapts plan templates for agents. They report average cost down 50.31% and latency down 27.28%, with performance held.
- **Reason Wide, Not Deep** (Singh and colleagues) distils a short plain-language skill from earlier work and puts it in a cheaper, non-reasoning model's system prompt. For GPT-5.4-mini on held-out tasks, it recovers 55% to 100%+ of the gap to a reasoning model, with 2.7x to 6x fewer output tokens. Deep search still wins in some domains, including telecom and SpreadsheetBench.

You can't rank these in a single "times cheaper" column. They were measured on different suites, with different executors.

The shared idea: spread the cost of solving a method across the cases that can reuse it.

## Where it can go wrong

A cache hit can still be wrong, stale or unsafe.

Semantic caches already show the failure modes. A stored wrong answer gets served many times over. Similarity search can be fooled or poisoned. A hit goes stale once the world or the tools change.

A compiled program inherits all of that. Its entry point is still found by embedding similarity. Its builder still has to trust the source model's reasoning. And if the program can call tools, a bad compile lasts longer than a bad answer.

Building the cache costs money too, which is why the CPU-ARC authors report it on its own line. You need enough valid hits, while the method stays current, to recover that cost.

A last practical limit: as of 24 Nov 2026, the paper links no code, weights or logs, so nobody outside NVIDIA can reproduce the headline table yet.

## What this means for your LLM costs

Start by asking whether you have a stable method at all.

If the work applies the same method to new cases, with checks you can write down, compiling or caching that method deserves a design review. A small model running on a CPU is part of the appeal. [Assistants that answer people from your own material](/solutions/#ai-assistants) are a common place to look, because they get the same kinds of question again and again.

If the work is open-ended, or the tools and data shift under you, a prefix cache and a well-written skill may be the better buy. "Reason Wide, Not Deep" is a good reminder to compile only when it pays.

<div class="takeaway">

## A takeaway for us all

The default is still to pay a large model to reason from scratch. The better default is to reuse the method when it's stable, run it as cheaply as you safely can, and treat every cache hit as a claim you check.

</div>

<div class="callout">

## Here's what you can do

- List the tasks your team or your agents repeat. Mark the ones where the method stays the same and only the inputs change.
- For each hit, ask 4 questions. Is it the same problem, or only a nearby one? Is the answer still right? Is the knowledge or tool still current? Who's allowed to write to the cache?
- Cost a new cache as an addition to the prefix caching you already run.
- Keep 2 lines in the budget: the cost to build the cache, and the cost to run it. Recover the first from valid hits on the second.

</div>

## References

1. Peter Belcak, Greg Heinrich, Saurav Muralidharan, Shizhe Diao and Pavlo Molchanov. "CPU-ARC: Agentic Reasoning Caching for on-CPU Reasoning Reuse." arXiv:2611.09891, 2026. <https://arxiv.org/abs/2611.09891>
2. Chengyu Yang, Yunxiang Zheng, Zongzheng Li, Jiamei Li, Boxun Lan, Xiaoyu Liu, Xiaoyu Zhang, Xiaohong Chen and Ming Hu. "Compile Away Uncertainty: Self-Evolving Agent Skills via Programmatic Compilation." arXiv:2610.39508, 2026. <https://arxiv.org/abs/2610.39508>
3. Azam Nouri. "StepCache: Step-Level Reuse with Lightweight Verification and Selective Patching for LLM Serving." arXiv:2603.28795, 2026. <https://arxiv.org/abs/2603.28795>
4. Qizheng Zhang, Michael Wornow, Gerry Wan and Kunle Olukotun. "Agentic Plan Caching: Test-Time Memory for Fast and Cost-Efficient LLM Agents." arXiv:2506.14852, 2025. <https://arxiv.org/abs/2506.14852>
5. Agamdeep Singh, Srishti Gautam, Priyanshu Gupta, Nikita Mehrotra, Tanmay Bakshi and Sumit Gulwani. "Reason Wide, Not Deep: Amortizing the Reasoning Premium into Distilled Skills." arXiv:2608.07885, 2026. <https://arxiv.org/abs/2608.07885>
