---
title: "An NGO's calling team gets every Hindi call scored against its script, with the transcript line behind each score"
seoTitle: "Hindi call scoring for an NGO's calling team"
description: "How an education NGO's managers see what's said on its Hindi outreach calls, with every score tied to the transcript line behind it."
pubDate: 2026-11-25
project: "callmind"
draft: true  # flip to false after Mandar signs off
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Education NGO | Quality checks on outreach calls | Hindi call transcription and script scoring | Every score traceable to the line that was said |

## Background

The NGO's volunteer teachers need regular nudging to keep teaching, so a calling team phones them in Hindi, campaign by campaign, from a script. Many callers are in their first job.

## The problem

Managers couldn't see what was said on these calls. Supervisors spot-checked a handful, and feedback reached a caller weeks later, after hundreds more calls.

## The client

A national education NGO that trains volunteer teachers to teach English in rural India.

## The challenge

The call records grow with every campaign. Listening to even a fair share by hand would take a team, and it was the job every supervisor put off.

The calls are hard for software too. They're in Hindi, often over a weak line, with 2 people talking over each other. Most of what a caller must say is a single word or a short phrase, which is easy to miss and easy to match by accident.

## The solution

We built a pipeline that turns a campaign's recordings into a scored audit. Each call is transcribed in Hindi. Each campaign script becomes a list of rules: what the caller must say, and what they mustn't.

The main choice was who writes the rules. An AI model drafts them from the script, and a campaign manager at the NGO approves each one before any call is scored. Rules are versioned, and every change is logged. Simple rules run as fixed checks; a model scores the rest. Every score links to the timestamped line in the transcript, so a supervisor can check it in seconds.

## The impact

Managers can see what's said on the calls, campaign by campaign, and every score points to the transcript line behind it. A supervisor checks a score in seconds, without replaying the call. Scoring is rolling out campaign by campaign, with the NGO's own reviewers setting the bar each rule has to meet.

**Want to know how it's built?** The technical detail is on the [CallMind project page](/projects/callmind/).

## A takeaway for us all

An AI score is only useful if a person can check it quickly. Tie every score to the evidence behind it, and let the people who own the script approve the rules.

## Here's what you can do

- Pick 1 campaign and write down the 5 things a caller must say.
- Count how many calls a supervisor actually reviews in a week.
- Decide who approves a rule before it scores anyone.
- Ask how long feedback takes to reach a caller today.

**Next step:** Start with a free 1-week Discovery on your own call recordings.

