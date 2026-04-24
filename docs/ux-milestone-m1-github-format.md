# Milestone: M1 - UX Conversion Foundation

**Objective:** Improve website UX and increase lead conversion (CTA click-through + form submissions).

**Target window:** 2 weeks from kickoff.

**Success metrics**
- +20% form submission rate (baseline vs post-release)
- +15% hero CTA click-through
- Reduced mobile nav drop-off

## Issue 1 — Form Conversion Pass
**Title:** `UX-01: Reduce contact form friction and improve mobile completion`

**Priority:** P0  
**Estimate:** M

**Context**  
Current form requires all core fields and uses a fixed two-column layout, increasing friction on mobile.

**Scope**
- Make `Phone` optional.
- Evaluate making `Company` optional.
- Switch to single-column layout on small screens.
- Add reassurance copy near submit button.
- Add inline error/help messaging.

**Acceptance Criteria**
- [ ] Form works with required minimum: Name + Email + Brief + Consent.
- [ ] Mobile view (<=640px) shows single-column input layout.
- [ ] Validation errors are readable and accessible.
- [ ] Form still posts successfully to Formspree endpoint.

**Definition of Done**
- [ ] Implemented and reviewed in staging.
- [ ] Mobile and desktop manual QA done.
- [ ] Tracked in release notes/changelog.

## Issue 2 — Navigation & Mobile Menu UX
**Title:** `UX-02: Improve mobile navigation behavior and wayfinding`

**Priority:** P1  
**Estimate:** S

**Context**  
Mobile nav toggles but lacks close-on-link-click behavior and active-state clarity.

**Scope**
- Close mobile menu after selecting a nav link.
- Add active page state to nav links.
- Add Esc-to-close support.

**Acceptance Criteria**
- [ ] Mobile menu closes on link click.
- [ ] Active route is visually indicated.
- [ ] Keyboard Esc closes menu when open.

**Definition of Done**
- [ ] Behavior verified on at least one mobile viewport and desktop.
- [ ] No regressions in sticky header behavior.

## Issue 3 — Hero CTA Clarity
**Title:** `UX-03: Improve hero CTA messaging for higher intent clicks`

**Priority:** P0  
**Estimate:** S

**Context**  
Current CTA copy is clear but generic; can be made outcome-oriented.

**Scope**
- Update primary CTA to concrete action.
- Add one-line expectation copy.
- Keep visual hierarchy intact.

**Acceptance Criteria**
- [ ] Hero has one clear primary CTA and one secondary CTA.
- [ ] Expectation-setting microcopy is visible near CTA.
- [ ] No layout regressions on mobile.

**Definition of Done**
- [ ] Copy reviewed and approved.
- [ ] CTR event tracked (see UX-08).

## Issue 4 — Exit Intent Popup Optimization
**Title:** `UX-04: Make exit popup less intrusive and more intent-driven`

**Priority:** P1  
**Estimate:** M

**Context**  
Popup triggers on desktop exit and on mobile after fixed 40s low-scroll condition.

**Scope**
- Refine mobile trigger using engagement/intent rules.
- Suppress popup if user already interacted with CTA/form.
- Add popup analytics events.

**Acceptance Criteria**
- [ ] Popup does not appear for users already engaging with form/CTA.
- [ ] Mobile trigger based on intent (not only time delay).
- [ ] Events captured: shown, dismissed, CTA clicked.

**Definition of Done**
- [ ] Trigger logic documented.
- [ ] QA for desktop + mobile trigger paths complete.

## Issue 5 — Trust Signals Near Contact CTA
**Title:** `UX-05: Add trust and process cues near contact section`

**Priority:** P0  
**Estimate:** M

**Context**  
Trust signals exist, but conversion area can use stronger proof and process clarity.

**Scope**
- Add mini proof block near form.
- Add “what happens next” 2–3 step snippet.
- Reuse existing claims (no new unverified numbers).

**Acceptance Criteria**
- [ ] Contact area includes trust snippet + next-step flow.
- [ ] Information appears without pushing form too far below fold.
- [ ] Copy matches approved brand language.

**Definition of Done**
- [ ] Content reviewed by business owner.
- [ ] Mobile readability validated.

## Issue 6 — Footer Trust & Utility Links
**Title:** `UX-06: Improve footer with compliance and contact utility links`

**Priority:** P2  
**Estimate:** S

**Context**  
Footer is clean but minimal on trust/compliance content.

**Scope**
- Add Privacy Policy and Terms links.
- Add direct contact email.
- Add optional final footer CTA.

**Acceptance Criteria**
- [ ] Footer includes policy links + contact method.
- [ ] Links are keyboard accessible and visually consistent.

**Definition of Done**
- [ ] Footer links verified in production build.

## Issue 7 — Accessibility Hardening
**Title:** `UX-07: Accessibility improvements for nav, popup, and form`

**Priority:** P1  
**Estimate:** M

**Context**  
Strong baseline exists (skip link + dialog semantics), but polish opportunities remain.

**Scope**
- Review nav logo alt semantics.
- Ensure visible focus states on all actionable controls.
- Run accessibility pass (axe/lighthouse) and fix top findings.

**Acceptance Criteria**
- [ ] No critical accessibility errors.
- [ ] Keyboard-only navigation works for nav/menu/popup/form.
- [ ] Focus indicators visible on key controls.

**Definition of Done**
- [ ] Accessibility report attached to issue.
- [ ] Critical/high findings resolved.

## Issue 8 — Analytics Funnel & Experiment Baseline
**Title:** `UX-08: Instrument conversion funnel and event tracking`

**Priority:** P0  
**Estimate:** M

**Context**  
GA4 and Clarity are installed; event-level UX funnel needs explicit instrumentation.

**Scope**
- Track events: hero CTA click, nav contact click, form start, form submit, popup shown/dismiss/click.
- Build lightweight weekly funnel view.

**Acceptance Criteria**
- [ ] All core events available in GA/Clarity.
- [ ] Funnel can report weekly trend: visit → CTA click → form submit.
- [ ] Event naming documented in repo docs.

**Definition of Done**
- [ ] Analytics QA completed in staging and production.
- [ ] Baseline week recorded before major copy/design tests.

## Suggested Milestone Board Columns
- Backlog
- Ready
- In Progress
- In Review
- Done

## Suggested Labels
- `ux`
- `conversion`
- `accessibility`
- `analytics`
- `frontend`
- `priority:P0` / `priority:P1` / `priority:P2`
- `size:S` / `size:M` / `size:L`
