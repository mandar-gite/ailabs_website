---
title: "A due-diligence firm's analysts start from a filled report, at 2,000+ MCA documents a month"
seoTitle: "MCA filings to due-diligence reports"
description: "Intelligent document processing for MCA filings: a Mumbai due-diligence firm's analysts start from a filled report, at 2,000+ documents a month."
pubDate: 2026-11-25
project: "docintel"
draft: true  # flip to false after Mandar signs off
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Regulatory due diligence | Reading MCA filings for investor reports | A document system that fills the firm's own report | 2,000+ documents a month, run by the firm's team |

## Background

Before a private equity fund, an AIF or an NBFC puts money into a company, it wants to know who it's dealing with. Who are the promoters, who sits on the board, and which other companies are they tied to? Much of that answer sits in filings with the Ministry of Corporate Affairs (MCA), spread across every company in the group.

## The problem

The firm's analysts read those filings by hand and copied the details into each investor report. If that stays the way it is, every new mandate adds more reading hours, and a missed detail goes straight into a report an investor relies on.

## The client

A Mumbai regulatory due-diligence firm that investigates companies for PE firms, AIFs and NBFCs. Its work covers regulatory checks, criminal background checks, litigation searches, desktop studies and media analysis.

## The challenge

Every company in a group comes with its own stack of MCA filings: annual returns, balance sheets, incorporation papers and director filings (AOC-4, MGT-7, DIR-12 and more). Each form type has 200+ fields that might matter.

The filings arrive in 3 shapes. Some are fillable forms with the data sitting in fields. Some are digital PDFs with selectable text. Some are scans, which are really photographs of paper.

An analyst opened each file, found the details, copied them out and built the report the investor reads. The firm described that work as tedious, error-prone and expensive in hours. It used no AI anywhere in it, and a general-purpose tool wouldn't know which of the 200+ fields matter or where they go in the firm's report.

## The solution

We started with a proof of concept on a batch of the firm's own filings. Its team reviewed the output, asked hard questions about accuracy and edge cases, and then asked us to build it for production.

The hard part was the mix of formats, so the first choice was to sort every document by form type and pick the method field by field. Fillable forms hold their data in named fields, and the system reads those directly. Scans go through text recognition, and a language model pulls out only the details the report needs from messy or free-text pages. The system reads all of a company's filings in one run, and it's built to check them against each other, so a mismatch in one filing shows up against the rest. Then it builds the firm's report: a Word document plus 2 Excel sheets, one for financials and one for shareholding.

## The impact

The analysts start from a filled report in the format they already use, and the firm's own team runs the system. It handles 2,000+ MCA documents a month. The firm's analysts review every report before it goes to the investor.

It went from proof of concept to production in 3 months, and the analysts kept their report format, so nobody learned a new tool to read the output. OCR and the language model run on cloud GPU servers set up for this work.

**Want to know how it's built?** The technical detail is on the [DocIntel project page](/projects/docintel/).

## A takeaway for us all

Many "unstructured" documents are more structured than they look. A government form already has its fields named. The value comes from noticing which parts are easy, handling those simply, and saving the expensive tools for the parts that are genuinely messy.

## Here's what you can do

- Count the documents your team reads each month, and the fields they copy out of them.
- Sort them by shape: fillable forms, digital PDFs and scans. The mix tells you how hard the job is.
- Find the report or spreadsheet those fields end up in. That template is the target.
- Ask who checks the final output today. They'll be the people who check the system's output tomorrow.

**Next step:** Start with a free 1-week Discovery on your own documents.

