---
title: "A global company's security reviewers get every supplier clause checked against their own policy"
seoTitle: "AI contract review against security policy"
navTitle: "Supplier contracts checked against cybersecurity policy"
description: "AI contract review for a global energy and automation company: every supplier clause checked against 133 security and data protection obligations."
pubDate: 2026-11-26
project: "contract-risk-radar"
draft: false
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Energy and automation | Security review of supplier contracts | Clause-by-clause checks against 133 policy obligations | Reviewers start from flagged clauses, each tied to the rule it touches |

## Background

A large company signs contracts with hundreds of suppliers, and each one has to meet its security and data protection rules. The people who know those rules best are the few reviewers every contract waits for.

## The problem

Reviewers read each contract line by line and tried to remember which rule every clause touched. A clause that quietly weakens a rule and slips through leaves the company exposed for the life of the contract.

## The client

A global energy and automation company, with security and procurement reviewers checking supplier contracts against the company's own policy library.

## The challenge

The rules sit in 3 policy documents: terms and conditions, security rules and a data protection agreement. Together they hold 133 separate obligations, and a single supplier contract can run to nearly 200 clauses. Checking every clause against every obligation by hand is the job nobody has time to do fully.

A general AI tool doesn't know the company's policy, and it can't explain its call the way a reviewer has to. The reviewers also had a history of past decisions on real clauses, and any tool needed to learn from those.

## The solution

We built a pipeline in 3 layers. The policy library is read once and turned into a checklist of 133 obligations. A new contract is split into clauses, and each clause is checked against each obligation. Every flagged clause gets a status (Present, Weakened, Contradicted or Absent) and a suggested verdict (Accept, Modify, Replace, Reject or Escalate).

The main choice was how much to let the system say. Each clause is matched to the closest past reviewer decisions, and a contract is never matched against its own past review. Replacement wording appears only where a past decision supports it and the system is confident. When it isn't sure, it escalates to a person.

## The impact

Reviewers start from a list of flagged clauses on real supplier contracts, each with the obligation behind it, in place of a blank read of the whole contract. The reviewer keeps the final call on every clause.

Every run on the same contract gives the same findings, so a review can be repeated and audited. It's built to sharpen its matches as more past reviews are added.

The models run on a dedicated virtual machine with a GPU that the company contracts, so its contracts are checked on its own infrastructure. Only its security team can see the contracts and findings. The client owns what we build.

**Want to know how it's built?** The technical detail is on the [Contract Risk Radar project page](/projects/contract-risk-radar/).

## A takeaway for us all

The most useful thing an AI reviewer can say is "I'm not sure". Tie every flag to the rule behind it, learn from the decisions your experts already made, and send the unclear cases back to them.

## Here's what you can do

- List the policy documents a contract has to meet, and count the obligations in them.
- Gather past reviews where a person accepted, changed or rejected a clause, with their reasons.
- Decide which verdicts a tool may suggest, and which always go to a person.
- Time how long one full contract review takes today.

**Next step:** Start with a free 1-week Discovery on your own contracts and policies.
