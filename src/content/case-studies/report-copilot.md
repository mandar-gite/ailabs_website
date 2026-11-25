---
title: "State teams pull their own reports, and teachers' names stay masked until an approver signs off"
seoTitle: "NGO reporting with data masking under DPDP"
description: "NGO reporting on a data-masking warehouse: state teams pull their own reports, and names are released only after a recorded approval, ready for the DPDP Act."
pubDate: 2026-11-25
project: "report-copilot"
draft: false
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Education NGO | Programme reports for state teams | A report portal on a masked data warehouse | Reports on request, names released only on approval |

## Background

The NGO's state teams keep volunteer teachers teaching. They phone teachers, run quizzes and plan campaigns, and every campaign starts from a report: which districts are active, which teachers have gone quiet. The data behind those reports holds teachers' names and phone numbers, and details of schools and children.

## The problem

Every report was built by hand, and only 3 people could build them.

## The client

A national education NGO that trains volunteer teachers to teach English in rural India.

## The challenge

The data sat in 2 places: the programme's app database and a set of Google Sheets. Each standard report meant someone running Python scripts by hand. With 3 people able to do it, state teams waited their turn.

Speed was half of it. The calling teams need names and phone numbers, and the same data holds children's details. India's DPDP Act was coming into force. Leaving each analyst to decide who could see a name was a risk the NGO wouldn't take.

## The solution

We built a data warehouse that masks personal details as the data arrives, and a portal on top of it. A state lead picks a report for their state, and gets a PDF. 7 standard reports, each with a version for every one of 11 states: 77 reports that used to be built by hand.

The main choice was to keep reports fixed. Nobody types a free-form question and gets AI-written SQL back; every report is a tested script, checked against the NGO's existing Power BI figures. That limits what a manager can ask without us, and it means the same question gives the same number every time.

Reports show codes in place of names. When a calling team needs real names, they file a disclosure request with a reason. A named approver for that state reviews it. The identified list comes only after that approval, and every request and decision is kept.

## The impact

State teams get their own reports. A state lead picks a report for their state and gets the PDF without waiting, where the request used to queue for 1 of 3 people. It frees the 3 people who rebuilt the same reports by hand, week after week, for deeper analysis of the programme data.

Calling teams still get the names they need, and only after the state's approver signs off. The NGO can show who asked for which names, why, and who approved it. That's the kind of record it needs as it prepares for the DPDP Act.

The data stays in the NGO's own cloud project in India. Names in Devanagari script can't be released yet; that's the next fix.

**Want to know how it's built?** The technical detail is on the [Report Copilot project page](/projects/report-copilot/).

## A takeaway for us all

When the same question has to give the same number every time, fixed and tested reports serve more people with less risk. Mask personal details the moment the data arrives, and release them only through a recorded approval.

## Here's what you can do

- List the reports your team rebuilds by hand every week, and who's able to build them.
- Mark the columns that hold personal details.
- Decide who approves a request for names, and keep a record of every request.
- Check the new figures against the numbers your team already trusts before you switch.

**Next step:** Start with a free 1-week Discovery on your own data.

