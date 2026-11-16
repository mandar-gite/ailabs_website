---
title: "The ₹250 crore question: Who has access to your data?"
seoTitle: "DPDP compliance: masking names in reports"
description: "DPDP's core duties start on 13 May 2027. How an education NGO masks personal data on arrival and releases names only after a data officer signs off."
pubDate: 2026-11-14
author: "Mandar Gite"
category: "Data Privacy"
tags: ["DPDP", "data protection", "compliance", "NGO", "reporting"]
featured: false
draft: false
image: "/og-dpdp-compliance.jpg"
faq:
  - question: "When do the DPDP core duties start?"
    answer: "On 13 May 2027. From then, notice, consent, security safeguards, breach reporting, and retention and erasure apply to Data Fiduciaries."
  - question: "Is the DPDP Act in force?"
    answer: "In part. The Rules were notified and the Data Protection Board was set up on 13 Nov 2025. Consent Manager registration opened on 13 Nov 2026. The core duties start on 13 May 2027."
  - question: "What is a Data Fiduciary under the DPDP Act?"
    answer: "Any person or organisation that decides why and how personal data gets used, NGOs included. The Act's duties fall on the Data Fiduciary."
  - question: "Who is a data principal?"
    answer: "The person the personal data is about. For the NGO in this article, that's its teachers, and the children whose details sit in the same tables (for a child, the Act counts the parents or guardian as the data principal too)."
  - question: "What is the highest penalty under the DPDP Act?"
    answer: "Up to ₹250 crore, for failing to take reasonable security safeguards that leads to a breach."
---

Under India's Digital Personal Data Protection (DPDP) Act, an organisation can face a penalty of up to ₹250 crore for failing to take reasonable security safeguards, leading to a personal data breach.

If your organisation decides why and how personal data is used, the Act calls you a **Data Fiduciary**. The responsibilities are yours. NGOs included.

The core duties are scheduled to come into effect on 13 May 2027.

One education NGO decided to get ready early. What we found in its reporting process is something many organisations might recognise.

## Every report started on a laptop

The NGO trains volunteer teachers to teach English in rural India.

Its state teams keep the programme moving. They call teachers, run quizzes and plan campaigns. To decide what needs attention, they rely on reports. Which teachers have gone quiet this month? Who needs a follow-up?

There are 77 standard reports across 11 states.

Here's how one used to get made.

Someone downloaded the full dataset into Excel on their personal laptop. Built the report. Then emailed it to the state team or a donor.

That dataset contained teachers' phone numbers and details of children.

Every report created another copy of personal data. On another laptop. In another inbox.

The process was also slow. Just 3 people were responsible for preparing all 77 reports manually. State teams had to wait for their turn.

The organisation had a reporting problem. It also had a data protection problem.

We decided to address both.

## Names stay masked until someone says yes

We moved the reporting process into the NGO's own protected cloud environment.

The data stays in one place. Teams can access their reports whenever they need them. Nobody needs to download the full dataset to prepare a report.

But the biggest change happens the moment data enters the system.

**Names are replaced with codes.**

Every teacher's name and phone number is swapped for a code, such as T-4F7A. Reports and charts work with these codes. Someone preparing a report can see the information they need without seeing the identity behind it.

Rule 6 of the DPDP Rules includes measures such as masking and virtual tokens among the security safeguards it describes.

![A state report titled Teachers to call this week, with each teacher shown as a code such as T-4F7A, phone numbers hidden, and a stamp reading Names released only on approval](/images/blog/dpdp-masked-report.jpg)

**Every state gets its own reports.**

A state lead opens a web page, selects a report for their state and downloads a PDF.

All 77 reports are now generated automatically. Before anyone started relying on them, we checked each one against figures the NGO already trusted. The same inputs produce the same numbers every time.

**Real names need a real person's approval.**

Sometimes a team needs to call a teacher. It then requests the relevant names and explains why they're needed.

The state data officer, or a designated standby when that officer is away, approves or rejects the request.

Only after approval does the system produce an identified list containing names and phone numbers.

Every request and every decision is recorded.

![Disclosure flow: a calling team requests names with a reason, the state data officer or a standby approves, and only then is an identified list released, with the request and decision kept on record](/images/blog/dpdp-disclosure-flow.png)

**And there's no back door.**

Real names sit in a separate, restricted store. Only the approval process can access it. Nothing in the system turns a code back into a name.

The idea is simple: people should be able to do their work without routinely seeing personal information they don't need.

## Safer data. Faster reports.

Data protection often sounds like more approvals, more restrictions and more waiting.

Here, it went the other way.

Reports that once had to be prepared manually are now available on demand. State teams no longer have to wait for someone to build them. Personal information doesn't routinely land on individual laptops.

And the 3 people who previously spent their time preparing reports can now focus on deeper analysis of the programme.

The organisation has better control over personal information and a more efficient reporting process.

That's a useful outcome. The two don't have to work against each other.

## The old reports never stopped

There was one more thing we had to get right.

The NGO already had reports and Power BI dashboards that its teams trusted. Introducing a new system couldn't mean stopping the work or asking everyone to start from scratch.

So the existing reports continued to run. The Power BI dashboards stayed in place as a cross-check while the new system was built and tested.

The data is stored in India. And there's no AI model reading it during day-to-day reporting. The reports are generated using conventional, tested code.

We think that's worth pointing out.

Technology should follow the problem. This organisation needed better reporting, better control over personal information and a more efficient process. It didn't need an AI model to do those particular jobs.

Knowing what technology to use is important. Knowing what not to use is just as important.

## Ready for more than the law asks?

The new system gives the NGO practical controls that are relevant to its DPDP Act compliance.

**Security safeguards:** Personal data is masked by default. Access to real names is restricted and recorded.

**Purpose:** Every request to release names has a stated reason and requires an authorised person's approval.

**Access records:** The organisation can see who requested access and who approved it.

**Breach response:** If something goes wrong, the record shows who had names, and which ones.

**Questions from teachers:** If a teacher asks "who has seen my number?", the organisation can answer from the record.

These controls also give the organisation something useful beyond compliance. If a teacher or donor asks how personal information is handled, the organisation has a record it can refer to.

It also gets faster reporting, fewer copies of personal data on laptops and a process that its own team can operate.

<div class="takeaway">

## A takeaway for us all

The NGO has a history of adopting new tools early, from WhatsApp to low-cost technology and now AI.

It also chose to fund this work from its own reserves, investing in systems it could own and use.

Its team brought the operational knowledge and identified the problems. A member of the team now manages the portal day to day.

Starting early gave the organisation time to test all 77 reports against figures it already trusted, well before the May 2027 deadline.

That's one advantage of getting started early: you have time to find what doesn't work, fix it and build confidence in the system before it becomes essential.

</div>

<div class="callout">

## Here's what you can do

You don't have to begin by rebuilding every system in your organisation.

Start with the reports. They can show quite a bit about how personal data moves through your business.

1. **Find every report that carries personal data.** Include spreadsheets, email attachments and files people download onto their laptops.
2. **Ask whether each report really needs names.** Most reports need counts, locations and dates. They may not need someone's identity.
3. **Mask names when the data enters the system.** If you mask them only when a report is generated, people may already have seen the original information.
4. **Decide who can approve access to real identities.** Name an authorised person and a standby. Record every request, its purpose and the decision.
5. **Test your reports before automating them.** Check the numbers against information you already trust. Automation is useful only when people can rely on what it produces.

</div>

## The ₹250 crore question is worth asking now

Where does personal data go after it enters your organisation?

Who sees it? Who needs it? Where does it get copied? And can you demonstrate that access is controlled?

These are good questions to start with, whether you're working towards being DPDP-compliant or simply trying to manage your organisation's information better.

At 72° AI LABS, we begin with a [1-week Discovery, free of charge](/discovery-brief/). We map how data moves through your organisation, identify the problems and agree on one worth addressing.

We then build a paid proof of concept (PoC), typically over 2-3 weeks. It's a small proof against a target we agree up front, using your own data. The client owns what we build. [Talk to us](/#contact).

You don't have to fix everything at once. Start with one problem. Understand it properly. Then build something that works.

## DPDP compliance: 3 dates to know

| Date | What happens |
|---|---|
| 13 November 2025 | The DPDP Rules were notified and the Data Protection Board was set up |
| 13 November 2026 | Registration of Consent Managers is scheduled to begin |
| 13 May 2027 | Core duties are scheduled to take effect, covering notice, consent, security safeguards, breach reporting, retention and erasure |

The Act provides for penalties of up to ₹250 crore for failure to take reasonable security safeguards leading to a personal data breach.

Read the [DPDP Rules, 2025 published by MeitY](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) for the notified provisions.

This article reflects the DPDP Act and Rules as notified up to November 2026. The applicability of specific obligations and the steps required by an organisation depend on its circumstances. Organisations should seek appropriate legal advice for their own compliance requirements.

## Frequently asked questions about DPDP compliance

**When do the DPDP core duties start?**
On 13 May 2027. From then, notice, consent, security safeguards, breach reporting, and retention and erasure apply to Data Fiduciaries.

**Is the DPDP Act in force?**
In part. The Rules were notified and the Data Protection Board was set up on 13 Nov 2025. Consent Manager registration opened on 13 Nov 2026. The core duties start on 13 May 2027.

**What is a Data Fiduciary under the DPDP Act?**
Any person or organisation that decides why and how personal data gets used, NGOs included. The Act's duties fall on the Data Fiduciary.

**Who is a data principal?**
The person the personal data is about. For the NGO in this article, that's its teachers, and the children whose details sit in the same tables (for a child, the Act counts the parents or guardian as the data principal too).

**What is the highest penalty under the DPDP Act?**
Up to ₹250 crore, for failing to take reasonable security safeguards that leads to a breach.
