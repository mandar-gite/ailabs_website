---
title: "A night watch that names the animal on a farmer's plot"
seoTitle: "AI wildlife detection for crop protection"
navTitle: "Night alerts for crop-raiding animals"
description: "Camera-based wildlife detection for farm plots in Maharashtra: deer, monkey and wild boar raise an alert, and every other animal stays silent."
pubDate: 2026-11-26
project: "farm-wildlife-alerts"
draft: false
---

| Industry | Use case | Solution | Impact |
|---|---|---|---|
| Agriculture | Night-time crop protection from wild animals | Camera images checked by a species model, with alerts on the animals that matter | Built to wake the farmer for deer, monkey and wild boar, and stay quiet for the rest |

## Background

Farmers lose crops to wild animals, much of it at night. Many still keep watch from a machan, the raised platform the project is named after, and a family can only stay up so many nights.

## The problem

A farmer can't watch the whole plot all night, and a raid found at dawn is already a lost crop. Across Maharashtra, Forest Department data counts 637,992 crop-damage compensation cases from 2020 to 2024 (Gokhale Institute of Politics and Economics, Pune, 2025).

## The client

Farmers whose plots border wild land in Maharashtra, starting with a pilot plot there. We're building this with a partner as a separate venture.

## The challenge

An alert is only useful if the farmer trusts it. Wake them for every dog, cow or peacock and they'll switch it off within a week. Miss the wild boar and the crop is gone.

Night is the hard part. Public night images of these animals are scarce, and in the dark, cattle and nilgai can look like deer. Off-the-shelf wildlife models are trained on camera-trap archives from other continents, with different animals and different light.

## The solution

Each new image or video goes through a motion check, then an animal detector that crops every animal in the frame. A species model sorts each crop into 11 classes. Deer, monkey and wild boar raise an alert, with the frame attached. Livestock, dogs, peafowl, people and the rest stay silent. A deer named as a monkey still raises the alert, because the farmer acts either way.

The main choice was to count every false alert as a cost, next to accuracy. Each species is benchmarked on its own, and every run reports how often a non-target animal would wake the farmer. When a file can't be checked, the farmer gets a "could not check" message, so a fault shows up as a warning.

## The impact

The watcher runs today on a GPU server we control, and a public demo page runs anyone's photo or video through the same pipeline. It's built to read night frames from a camera at the plot, and nilgai alerts come next.

The camera, mounting, power and phone signal are set during the first site visit. Alerts reach the farmer on Slack today, and the farmer's own channel and language are the next step.

**Want to know how it's built?** The technical detail is on the [Farm Wildlife Alerts project page](/projects/farm-wildlife-alerts/).

## A takeaway for us all

An alert system lives or dies on its false alarms. Measure how often it bothers people for nothing, next to how often it's right, and design for the person who has to wake up.

## Here's what you can do

- Write down which events need someone to act now, and which can wait for a morning report.
- Count how many alerts a person will tolerate in a night before they switch the system off.
- Collect footage from the real site and the real light, not only stock images.
- Decide what the system should say when it can't check something.

**Next step:** Start with a free 1-week Discovery on your own camera footage.
