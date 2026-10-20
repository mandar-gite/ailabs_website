---
title: "Private LLMs and the DPDP Act: What an Indian Business Owner Needs to Decide Before May 2027"
seoTitle: "Private LLM and the DPDP Act: A Guide for Owners"
description: "The DPDP Rules' core duties start in May 2027. Here's how pasting customer data into public AI tools creates risk, and when a private LLM is the simpler answer."
pubDate: 2026-10-20
author: "Mandar Gite"
category: "Guide"
tags: ["DPDP", "private-LLM", "data-protection", "self-hosted-AI", "India"]
featured: false
draft: false
faq:
  - question: "Is it illegal to use ChatGPT with customer data under the DPDP Act?"
    answer: "No. The Act allows personal data to be processed outside India unless the government restricts a specific country. You remain responsible for that data, though: you need a lawful basis to process it, a contract with the AI provider, reasonable security safeguards, and the ability to erase it when asked."
  - question: "When do the DPDP Rules apply to my business?"
    answer: "The Rules were notified on 13 November 2025. Consent Manager registration starts in November 2026. The core duties for most businesses (notice, consent, data principal rights, security safeguards, breach reporting) start in May 2027."
  - question: "What is the maximum DPDP penalty?"
    answer: "Up to Rs 250 crore for failing to take reasonable security safeguards that leads to a personal data breach. Other violations carry their own caps."
  - question: "What is a private LLM?"
    answer: "An open-source language model running on hardware you control: your own server or your own cloud account. Prompts and documents stay inside your infrastructure, and no third party trains on them."
  - question: "Does a private LLM make my business DPDP compliant?"
    answer: "It removes one risk: personal data leaving your control through a third-party AI tool. You still need consent and notice flows, access controls, retention rules and a breach plan. Get a lawyer to review your specific case."
---

*The core DPDP duties start in May 2027. Your team is probably pasting customer data into a chatbot today.*

---

Ask any accounts team in India how they use AI right now. Somebody's pasting a supplier ledger into ChatGPT to reconcile it. Somebody else uploads a customer complaint, with phone number and address, to draft a reply.

It works. It also means personal data about your customers is sitting on someone else's servers, under someone else's retention policy, and you can't easily prove where it went.

Until now that was a vague worry. The Digital Personal Data Protection (DPDP) Act changes that, with a date attached.

## The DPDP timeline, in plain dates

The DPDP Act was passed in 2023. The Rules that make it enforceable were notified on **13 November 2025**, with a phased start:

| Date | What starts |
|------|-------------|
| 13 Nov 2025 | Definitions and the Data Protection Board |
| 13 Nov 2026 | Consent Manager registration |
| May 2027 | Core duties: notice, consent, rights of individuals, security safeguards, breach reporting, cross-border rules |

So you have roughly 7 months left before the obligations that touch daily operations kick in.

The penalty that gets quoted most is **up to Rs 250 crore** for failing to take reasonable security safeguards that leads to a breach. A small firm won't get the maximum. But "we didn't know where our AI tool kept the data" is a weak position to argue from.

## What the Act actually asks of you

Under DPDP, if your business decides why and how personal data gets processed, you're a **Data Fiduciary**. That covers every business that holds customer names, phone numbers, PAN, addresses, call recordings or employee records. Which is every business.

Any AI service you send that data to becomes your **Data Processor**. The Act holds you responsible for what happens to it there. You need to:

- process data only for a purpose the person was told about, and agreed to (or one the Act allows without consent);
- have a valid contract with every processor;
- take reasonable security safeguards to prevent a breach;
- erase data once the purpose is served, or when the person withdraws consent;
- report a breach to the Data Protection Board and to every affected person.

Now picture the ledger that got pasted into a chatbot in March. Can you erase it? Can you say which provider, which region, which retention setting? For a lot of businesses, the honest answer is "no idea."

## Public AI tools: allowed, but you carry the risk

Using ChatGPT, Gemini or Claude with personal data isn't banned. Section 16 of the Act lets data go abroad unless the government blocks a specific country. No country is blocked today.

The risk sits in 3 places:

1. **Free and personal accounts.** Staff on a personal login sit outside any business contract. Depending on the plan and the settings, their prompts may be kept and used for training.
2. **No audit trail.** You can't list what was sent, by whom, or when. That makes erasure requests and breach reports hard to answer.
3. **Future restrictions.** If a country gets added to the restricted list, every workflow built on a provider hosted there has to move.

Enterprise plans fix some of this with data-processing agreements and no-training terms. They're a reasonable choice for lots of tasks. The trade-off is cost per seat, and you're still trusting a contract for data you can't see.

## What a private LLM changes

A private LLM is an open-source model (Llama, Qwen, Mistral and similar families) running on hardware you control. That can be a server in your office or a GPU machine in your own cloud account, in an Indian region if you want.

The prompt, the documents and the answers never leave that machine. There's no third-party processor for the AI step, so there's no processor contract to chase, no unknown retention policy and no question about where the data sits.

It also makes the DPDP basics easier to show:

- **Erasure** means deleting files and rows you can point at.
- **Audit** means logging every request on your own system.
- **Access control** plugs into the logins you already run.
- **Breach scope** is limited to infrastructure you already secure.

The models are good enough for most back-office work now. A 7 to 14 billion parameter model, quantized, runs on a single 24GB GPU. That's enough to summarise documents, pull fields out of invoices, classify tickets and answer questions over your own files.

(I've trained models on a $300, 12GB consumer GPU, [and written up the results](/blog/autoresearch_2026-04-14/). Inference is far lighter than training.)

## Where a private LLM is the wrong call

It costs money and attention. You own the hardware or the cloud bill, and someone has to keep it patched.

The largest public models still beat a 14B model at open-ended reasoning and long, creative writing. If your use case is marketing copy with no personal data in it, a public tool is fine.

A sensible split for most businesses:

- **Personal or confidential data** (customer records, call recordings, payroll, contracts): private model.
- **Public or anonymised data** (blog drafts, generic research): whatever tool your team likes.

## A 5-step plan before May 2027

1. **List where AI touches personal data today.** Ask each team what they paste, upload or connect. You'll find more than you expect.
2. **Sort by risk.** Customer and employee identifiers first, then financial records, then everything else.
3. **Move the high-risk workflows first.** Either onto an enterprise AI plan with a proper contract, or onto a private model.
4. **Write the retention rule down.** How long prompts, uploads and outputs are kept, and who can delete them.
5. **Test one workflow end to end.** Pick the one with the most personal data and prove you can answer "where did this record go?"

## How we approach it

At 72° AI LABS we build AI systems on open-source models that run in the client's cloud or on-prem. The client owns the models, the data and the infrastructure, with no subscription and no lock-in.

[DocIntel](/projects/docintel/), our document question-answering system, is built this way: retrieval and generation over private documents, with nothing sent to an outside API.

Every engagement starts with a 1-week discovery, at no cost. We map where personal data meets your workflows and pick the one worth fixing first. A proof of concept on your real data follows in 2 to 3 weeks. See the [practice areas](/solutions/) for the kinds of systems we build.

If your team is pasting customer data into a chatbot today, [book a discovery call](/#contact). May 2027 is closer than it looks.

*This post covers the DPDP Act and Rules as notified up to October 2026. It's a business guide. Check your specific situation with a lawyer.*
