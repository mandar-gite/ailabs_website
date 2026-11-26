---
title: "Know who gets paid first when the company is sold, with every term tied to its source"
seoTitle: "Liquidation preference analysis with AI"
navTitle: "Liquidation preferences tied to their sources"
description: "Liquidation preference terms read from Delaware charters and Indian articles of association, each tied to its source sentence and confirmed by a person."
pubDate: 2026-11-26
project: "valent"
draft: false
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Venture finance | Cap table and liquidation waterfall work | Preference terms read from the charter, each tied to its source sentence | Every payout runs only on terms a person has confirmed |

## Background

When a startup is sold, its charter decides who gets paid first: which investors rank ahead, how much they take back, and whether they convert to common shares. Those terms sit in long legal documents, often behind definitions in other clauses.

## The problem

Someone has to read the charter, find every preference term and match it to the shareholdings before anyone can say what each class receives. Get one seniority rank wrong and money moves between investor classes.

## Why we built it

We built Valent for the people who answer "who gets paid first?": investor-side analysts, company counsel and valuation advisers. It reads US certificates of incorporation and Indian articles of association, because that's where the answer starts.

## The challenge

The terms are scattered. A preference amount often sits behind a defined term in a different clause, and Indian articles add lakh grouping and paise decimals that are easy to misread. Some filings arrive as text PDFs, some as government XFA forms, some as scans.

AI models get seniority and equal-ranking terms wrong, and they vary between runs. Any tool that let a model decide the waterfall on its own would be fast and untrustworthy.

## The solution

Valent splits each document into numbered clauses and follows defined terms across them. The model proposes each preference term with the exact quote it came from. A check looks for that quote in the source, and a value whose quote isn't there never moves on. A reviewer then confirms or corrects every term, including the seniority rank, on a review screen.

The payout engine runs only on confirmed terms. For each exit value, it tries every combination of investors converting or taking their preference, and returns the stable outcome. A simulator shows what each class receives at any exit value you set.

## The impact

A person reviewing a waterfall starts from proposed terms, each tied to the sentence it came from, in place of a blank read of the charter. Nothing unverified reaches a payout.

The Delaware path runs end to end, from charter to payout. The Indian path reads and cites preference terms from articles of association, and it's built to compute payouts once the shareholdings are added.

**Want to know how it's built?** The technical detail is on the [Valent project page](/projects/valent/).

## A takeaway for us all

When a wrong number moves real money, let the model propose and a person confirm. Make every figure point back to the sentence it came from, and stop the run when it can't.

## Here's what you can do

- List the documents your cap table depends on, and where each preference term lives.
- Check whether every figure in your current waterfall can be traced to a clause.
- Decide who confirms the seniority rank before any model output is used.
- Test your waterfall at 3 exit values and see if the totals reconcile.

**Next step:** Start with a free 1-week Discovery on your own charter and cap table.
