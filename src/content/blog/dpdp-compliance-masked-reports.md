---
title: "Getting ready for DPDP: how an education NGO keeps teachers' names masked until a data officer signs off"
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

A state team at an education NGO needs a list of teachers who've gone quiet, with phone numbers, so they can call them this week. The same tables hold children's details. Who gets to pull that list, and who decides?

Until this year, many organisations answered that with "whoever runs the report". India's Digital Personal Data Protection (DPDP) Act puts a date on a better answer.

## DPDP compliance in 3 dates

| Date | What starts |
|---|---|
| 13 Nov 2025 | The DPDP Rules are notified, and the Data Protection Board is set up |
| 13 Nov 2026 | Consent Manager registration |
| 13 May 2027 | The core duties: notice, consent, security safeguards, breach reporting, retention and erasure |

The full text is in the [DPDP Rules, 2025 on MeitY's site (PDF)](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf).

That leaves under 6 months. If your organisation decides why and how personal data gets used, the Act calls you a **Data Fiduciary**, and the duties are yours. NGOs included. The highest penalty, up to ₹250 crore, is for failing to take reasonable security safeguards that leads to a breach.

Most of those duties come down to 2 questions you should be able to answer on any day: who can see a person's name, and how would you prove it?

Here's how one NGO answered them. Swap teachers for customers or employees, and it's the same problem.

## The benefit: state teams pull their own reports, and names stay masked

The NGO trains volunteer teachers to teach English in rural India. Its state teams keep those teachers going: they phone them, run quizzes and plan campaigns. Every campaign starts from a report, such as which districts are active and which teachers have gone quiet.

There are 7 standard reports, and each one has a version for every one of 11 states: 77 reports in all. Every one used to be built by hand, by 1 of 3 people who could run the Python scripts behind them. State teams waited their turn.

Now all 77 are automated. A state lead picks a report for their state in a portal, and gets a PDF. The reports show codes where names used to be. When a calling team needs real names, it asks, and the state's data officer has to approve before any name leaves the system.

## The approach: mask on arrival, release names on approval

The hard part was that speed and control pull in opposite directions. Letting state teams serve themselves means more people near the data. The data holds teachers' phone numbers and details of children, and the Act sets stricter rules for children's data.

We made 4 choices.

**Mask the data as it arrives.** Names and phone numbers are swapped for tokens the moment the data lands in the NGO's warehouse. Rule 6 of the DPDP Rules names masking and virtual tokens among the security safeguards, and asks for logs that show who accessed personal data. Analysts and reports work on masked data from the start, so nobody sees a name by accident on the way to a chart.

![A state report titled Teachers to call this week, with each teacher shown as a code such as T-4F7A, phone numbers hidden, and a stamp reading Names released only on approval](/images/blog/dpdp-masked-report.jpg)

**Keep the reports fixed.** All 77 come from 7 report scripts, run per state. Each one is tested and checked against the figures the NGO already trusted in Power BI. Nobody types a free-form question and gets AI-written SQL back. That limits what a manager can ask without us, and it means the same question gives the same number every time.

**Put a named approver on every release of names.** A calling team files a disclosure request with a reason. It goes to the data officer for that state, or to a standby officer when that officer is away. The portal produces a list with real names on it (an identified list) only after that approval. Every request and every decision is kept.

![Disclosure flow: a calling team requests names with a reason, the state data officer or a standby approves, and only then is an identified list released, with the request and decision kept on record](/images/blog/dpdp-disclosure-flow.png)

**Never reverse a token.** The identified list comes from a separate, restricted table that the masking step fills at load time, and only the disclosure step can read it. The system has no code that turns a token back into a name, so there's no shortcut around the approval to build.

## Care: inside the NGO's own cloud, with nothing switched off

The data stays in the NGO's own cloud project, in an Indian region. No language model runs in production; the reports are plain, tested code.

The NGO's existing reports kept running the whole time, and Power BI stayed in place as the cross-check. The 3 people who built the reports by hand now spend that time on deeper analysis of the programme.

## Why it worked here

The NGO has taken up new tools from day one: WhatsApp, then low-cost tech, and now AI. It paid for this work from its own reserves, choosing to invest in its own systems.

Its team brought the problems and put the methods to work. A member of that team now runs the portal day to day.

## What this setup helps the NGO show

On its own, the setup gives the NGO evidence for some of the duties that start in May 2027:

- **Security safeguards:** personal data is masked by default, and access to names is narrow and logged.
- **Purpose:** every release of names carries a stated reason and a named officer's approval.
- **Breach response:** if something goes wrong, the record shows who held names, and which ones.
- **Requests from data principals (the people whose data it holds):** the NGO can answer "who has seen my number?" from the record.

Notice and consent for teachers, retention and erasure rules, and a breach plan are still the NGO's own work, with legal advice. Software can carry a policy out; the organisation has to write it.

## 5 steps to copy for your own data

1. **List every report that carries a name or phone number.** Include the spreadsheets people email each other.
2. **Ask which of them need names at all.** Most reports need counts, areas and dates.
3. **Mask where data enters.** Masking at report time means somebody has already seen the plaintext.
4. **Name an approver (and a standby) for every release of names, and keep the record.** The record is what you'll show the Board.
5. **Fix your report set.** Check each report against numbers you already trust, before anyone relies on it.

If your reports carry names and phone numbers, start with a [free 1-week Discovery](/discovery-brief/): we map where personal data flows through your reports and pick the one to fix first. A 2-3 week proof of concept on your own data follows, against a target we agree up front. [Talk to us](/#contact).

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
