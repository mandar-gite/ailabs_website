---
title: "An MBA college's faculty check a draft exam paper against the university's rules before moderation"
seoTitle: "AI question paper checker for MBA colleges"
navTitle: "Question papers checked against university rules"
description: "An AI question paper checker for MBA colleges under the University of Mumbai, with every finding tied to the rule behind it."
pubDate: 2026-11-26
project: "gradeqp"
draft: false
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Higher education | Checking draft question papers | Rule checks plus AI judgement, with every finding cited | Setters see which rule a paper breaks before moderation does |

## Background

Every paper an affiliated college sets has to follow its university's paper-setting rules: total marks, exam length, how many questions, which ones are compulsory, and a course-outcome tag on every part. Faculty set these papers on top of their teaching, usually close to a deadline.

## The problem

Faculty checked their own papers by eye. A mistake surfaced late, at moderation or in the exam hall, when fixing it costs the most.

## The client

An MBA college affiliated to the University of Mumbai, setting MMS Semester I papers. This was a proof of concept.

## The challenge

The rules are spread across the university scheme, the course syllabus and the paper templates. Some are exact, like the marks total. Others need reading for meaning, like whether a question really tests the course outcome it's tagged with.

Papers arrive as Word files, PDFs and sometimes scans, each formatted a little differently. And "attempt any 4 of 5" papers print more marks than a student can score, so a simple total check marks a correct paper as wrong.

## The solution

GradeQP reads the draft, pulls out its structure (header, questions, sub-parts, marks and tags), and picks the rulebook for that course from the header. Exact rules run as plain code checks. Rules that need judgement run as AI checks, in parallel. The total check counts the compulsory marks plus the best N optional ones, so a compliant pick-N paper passes.

The main choice was to fail closed. If a mandatory rule can't run, the verdict is "Could not fully verify", never "Ready". If the course matches no rulebook, the setter picks one, and nothing is graded against a guess. Academic judgement stays with the faculty member: the tool cites the rule behind every finding, and they decide.

## The impact

The setter gets a verdict (Ready, Needs changes, or Could not fully verify) with each finding tied to its rule. For a Word upload, they get their own file back with comments on the questions that need a change.

The proof of concept covers 10 MMS Semester I subjects. It's built so each new course or university is a rulebook file in the same format.

**Want to know how it's built?** The technical detail is on the [GradeQP project page](/projects/gradeqp/).

## A takeaway for us all

Use code where the rule is exact and AI only where it needs reading for meaning. When the system can't check something, it should say so plainly, so nobody trusts a "Ready" it didn't earn.

## Here's what you can do

- Write down your paper-setting rules in one place, and mark which are exact and which need judgement.
- Pull last term's papers and count how many were sent back at moderation, and why.
- Decide who signs off when a tool says "Could not fully verify".
- Start with 1 course and its template before you scale.

**Next step:** Start with a free 1-week Discovery on your own papers and rulebook.
