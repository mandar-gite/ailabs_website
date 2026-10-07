---
name: 72° AI LABS
description: Bespoke AI systems built on a client's own data, presented with pentagon-born proportion and a single gold accent.
colors:
  gold: "#D9A441"
  gold-deep: "#C4902E"
  gold-tint: "rgba(217,164,65,0.12)"
  navy: "#0C1A3F"
  ink: "#1A2238"
  ink-2: "#5B6472"
  ink-3: "#8A93A3"
  canvas: "#FFFFFF"
  canvas-2: "#F6F7F9"
  line: "rgba(26,34,56,0.08)"
  line-2: "rgba(26,34,56,0.14)"
  logo-gold: "#DDA744"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "clamp(2.7rem, 5.2vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  stat:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "clamp(2.5rem, 4vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body-lead:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, Inter, -apple-system, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  nav: "10px"
  md: "12px"
  control: "14px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  section-tight: "72px"
  section: "104px"
  container-max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.control}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 28px"
  button-submit:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
  eyebrow:
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.gold-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  badge:
    backgroundColor: "{colors.canvas-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
  step-number:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.gold}"
    rounded: "{rounded.pill}"
    size: "44px"
  nav-link:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.nav}"
    padding: "9px 15px"
  nav-link-hover:
    backgroundColor: "{colors.canvas-2}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.navy}"
    rounded: "6px"
    padding: "8px 12px"
---

# Design System: 72° AI LABS

## Overview

**Creative North Star: "The Golden Angle"**

A regular pentagon's external angle is 72°, and that one visible angle carries the golden ratio inside it. The system works the same way: a single precise gold accent, set against a calm white field and softened navy ink, signals the structure underneath. Every screen should read as proportion first and decoration never. If an element can't explain its place in the composition, it goes.

Density is open and unhurried. Sections breathe on 104px vertical rhythm, content sits in a 1200px column, and the type does the heavy lifting: tight, heavy Plus Jakarta Sans headlines (800 weight, negative tracking) over muted, generous body copy. Gold appears as a thread (an eyebrow, a separator dot, a hover edge, an accent word) and never as a flood.

Components are tactile and confident. Surfaces carry a visible resting shadow, lift on hover, and should press back on click. The feel is a well-made physical object: you can tell what's touchable before you touch it.

**Key Characteristics:**
- White canvas with one cool-grey band colour; no cream, no gradients behind content.
- One warm accent (gold) used sparingly; navy reserved for dense, high-contrast moments.
- Heavy, tightly tracked display type over quiet grey body copy.
- Generous radii (14px controls, 20px cards) and pill-shaped small labels.
- Resting shadows and hover lift; motion that's short and purposeful, and off under reduced motion.

## Colors

A white, near-neutral field with softened navy ink and a single warm gold that carries all the emphasis.

### Primary
- **Pentagon Gold** (#D9A441): the one accent. Separator dots, badge dots, the 3px hover edge on cards, step-number numerals, the float-metric number, and the soft radial glow behind the hero. Decorative and graphic use only, never body text on white.
- **Burnished Gold** (#C4902E): the text-weight gold. Hero accent words and the eyebrow label. At large display sizes only (see contrast rule below).
- **Gold Wash** (rgba(217,164,65,0.12)): tint behind the eyebrow chip and hovered card icons.

### Secondary
- **Midnight Navy** (#0C1A3F): the logo navy, used as a solid surface for small dense elements: step-number discs, the floating metric card, pipeline output nodes, skip link. Its job is contrast and gravity in a small footprint.

### Neutral
- **Softened Ink** (#1A2238): headings, button text and borders, primary nav text on hover. The strongest text colour on the site.
- **Slate Body** (#5B6472): body copy, nav links at rest, card descriptions, badges.
- **Quiet Caption** (#8A93A3): uppercase micro-labels and captions only.
- **Canvas White** (#FFFFFF): the page and every card.
- **Cool Mist** (#F6F7F9): the single band colour (process section, contact section, window bars, chip fills, icon tiles).
- **Hairline** (rgba(26,34,56,0.08)) and **Firm Hairline** (rgba(26,34,56,0.14)): borders and dividers; the firm one for hover and ghost buttons.

### Logo-only
- **Brand Kit Gold** (#DDA744) with Midnight Navy: reserved for the logo artwork per `Brand_Kit.md`. Not a UI colour.

### Named Rules
**The One Thread Rule.** Gold is the only chromatic accent. Keep it to roughly 5% of any viewport; its scarcity is what makes it read as "the point". No second accent hue, no blue links.

**The Large-Gold Rule.** Burnished Gold on white measures 2.85:1, which misses WCAG AA even for large text (3:1). The incumbent hero accent words accept that at display size (2.7rem and up) because the same line is complete without them; a darker gold is an open fix. Anything smaller that must be read sits in Softened Ink with gold as a dot, rule or underline beside it.

**The Single Palette Rule.** The `--wp-*` tokens in `src/styles/global.css` are the system. The older `--brand-cream` / `--brand-gold` set and the slate/blue `--text*`, `--accent*`, `--surface`, `--border` set are drift still present on `/about`, ProjectCard, the contact form and the mobile nav. New work uses `--wp-*` only and migrates the old ones when touched.

## Typography

**Display Font:** Plus Jakarta Sans (with Inter, -apple-system, sans-serif)
**Body Font:** Plus Jakarta Sans (same stack)

**Character:** One geometric-humanist family carries everything, with hierarchy built from weight and tracking rather than a second face. Headlines are dense and assertive; body text steps back in Slate Body so the headline always wins.

### Hierarchy
- **Display** (800, clamp(2.7rem, 5.2vw, 4.25rem), 1.03, -0.04em): hero headline only. Drops to 2.25rem under 768px.
- **Headline** (800, clamp(2rem, 3.4vw, 2.75rem), about 1.15, -0.03em): section headers and the contact heading.
- **Stat** (800, clamp(2.5rem, 4vw, 3.5rem), 1, -0.03em): proof numbers.
- **Title** (700, 1.02rem, 1.35, -0.01em): card and step headings.
- **Body Lead** (400, 1.125rem, 1.7): hero paragraph and section intros, max width about 520px (roughly 60ch).
- **Body** (400, 0.9rem, 1.6): card and step descriptions.
- **Label** (700, 0.7 to 0.75rem, 0.09 to 0.1em, uppercase): eyebrows, card category labels, trust-bar label, pipeline label.

### Named Rules
**The Weight-Not-Face Rule.** Hierarchy comes from weight (800 / 700 / 400) and tracking. Don't introduce a second typeface for headings. The logo's serif belongs to the logo artwork only.

**The Tight-Top Rule.** Anything 2rem or larger tracks negative (-0.03em to -0.04em). Anything uppercase tracks positive (+0.09em to +0.1em). Body copy stays at normal tracking.

## Layout

A centred 1200px column with 2rem side padding. Sections stack full-bleed, alternating Canvas White and Cool Mist, separated by hairlines rather than shadows. Vertical rhythm is 104px (6.5rem) for primary sections, 72px (4.5rem) for compact proof bands, and 96px (6rem) for hero and contact.

Section headers are left-aligned, capped at 40rem, with 56px below before content. Grids are 3-up for capability cards and process steps, collapsing to 2-up at 1024px and 1-up at 768px. The hero is a 55/45 two-column split (text, then graphic) with 64px gap; the contact section is 50/50. Both collapse to a single column at 768px with text first.

Card grids use 24px gaps; step grids use 32px by 40px.

**The Left-Edge Rule.** Content aligns to the left edge of the column. Centred text is reserved for the contact form heading and the footer copyright line.

## Elevation & Depth

Hybrid, leaning tactile. Section structure is flat (hairlines and band colour), while interactive objects carry real shadow: a soft resting shadow so they read as touchable, a deeper one on hover with a physical lift. All shadows are cool, low-opacity and slate-tinted (rgba(15,23,42,...)), never black.

### Shadow Vocabulary
- **Rest** (`0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)`): buttons and cards at rest.
- **Raised** (`0 4px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)`): mid-level, available for dropdowns and popovers.
- **Lifted** (`0 12px 40px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.04)`): hovered cards and the floating metric.
- **Showpiece** (`0 24px 60px rgba(15,23,42,0.12), 0 8px 16px rgba(15,23,42,0.06)`): the hero pipeline window only.

### Named Rules
**The Earned Lift Rule.** Lift is a response. Buttons rise 2px and cards 5px on hover, paired with the next shadow step. Nothing floats at rest except the single hero metric card.

**The Press-Back Rule.** Tactile means the click lands. Interactive surfaces should settle back (translateY(0), shadow returns to Rest) on `:active`. Current buttons and cards don't do this yet; add it whenever they're touched.

## Shapes

Generously rounded, never sharp. Controls use 14px corners, cards and the hero window 20px, icon tiles 14px, nav links 10px, and small labels (eyebrows, badges, the submit button) are full pills. Step numbers and status dots are perfect circles. Borders are 1px hairlines; the primary button alone takes a firmer 1.5px ink border.

The pentagon behind the brand name shows up as proportion, not as literal polygons. Don't clip images or cards into pentagons.

## Components

### Buttons
Confident, outlined and inverting.
- **Shape:** gently rounded (14px).
- **Primary:** Canvas White fill, Softened Ink text, 1.5px Softened Ink border, 700 weight at 0.9375rem, 14px by 28px padding, Rest shadow.
- **Hover:** fills solid Softened Ink, text turns white, lifts 2px. 150ms transition.
- **Ghost:** same shape and padding, Firm Hairline border instead of ink; on hover the border darkens to Slate Body and the button lifts 2px.
- **Submit (contact form):** Pentagon Gold pill with Midnight Navy text, 8px by 24px. It currently uses the drift gold (#DDA744, hover #C49038); move it to the `--wp-gold` tokens.

### Chips
- **Eyebrow:** Gold Wash pill with Burnished Gold uppercase label (0.74rem, 700, 0.1em). One per hero.
- **Badge:** Cool Mist pill with a Hairline border, Slate Body 0.73rem 600 text and a 6px Pentagon Gold dot leading.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** Canvas White.
- **Shadow Strategy:** Rest at rest, Lifted on hover with a 5px rise.
- **Border:** Hairline, firming to Firm Hairline on hover.
- **Signature edge:** a 3px Pentagon Gold bar across the top edge scales in from the left on hover (320ms, cubic-bezier(.2,.7,.2,1)).
- **Icon tile:** 48px Cool Mist square with 14px corners holding a 22px stroke icon in Softened Ink; on hover it turns Gold Wash with Burnished Gold icon.
- **Internal Padding:** 32px.
- ProjectCard (`src/components/ProjectCard.astro`) still uses the legacy 8px radius, 2px border and solid gold badge. It's drift.

### Inputs / Fields
- **Style:** white fill, 1px grey border, 6px corners, 0.875rem Midnight Navy text, 8px by 12px padding; labels sit above at 0.875rem.
- **Focus:** 2px Pentagon Gold ring, no outline offset.
- **Container:** the form sits on a white card with 8px corners and a heavy shadow. This is the least on-system surface on the site and should adopt 14px controls, 20px card corners and the shadow vocabulary above.

### Navigation
- Sticky 76px bar, 90% white with 20px backdrop blur and a bottom hairline.
- Brand lockup: mark plus "72° AI LABS" in 800 weight with an uppercase caption beneath.
- Links: Slate Body, 600 weight, 0.98rem, 9px by 15px padding, 10px corners; hover fills Cool Mist and darkens to Softened Ink.
- Mobile (under 768px): links collapse behind a menu button into a stacked panel. Its hover still uses the drift blue accent; it should match the desktop hover.

### Process Step
A 44px Midnight Navy disc with a Pentagon Gold numeral (0.8125rem, 800), followed by a Title heading and Body description. The navy-and-gold disc is the system's densest brand moment.

### Pipeline Window (signature)
The hero graphic: a white 20px-cornered window with Showpiece shadow, a Cool Mist title bar with three traffic-light dots, an uppercase pipeline label, and an animated SVG showing source boxes (Cool Mist) flowing through a pulsing navy-and-gold "72°" node into navy output boxes. Flow lines animate a dashed gold stroke; the node breathes and ripples. A row of badges closes the window, and a navy metric card floats off its lower-right corner. All animation stops under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** use the `--wp-*` tokens from `src/styles/global.css` for every new surface.
- **Do** keep gold to dots, rules, edges, numerals and display-size accent words.
- **Do** track headlines negative (-0.03em to -0.04em) at 800 weight, and uppercase labels positive (+0.1em).
- **Do** give interactive surfaces the Rest shadow, a hover lift with the next shadow step, and a press-back on `:active`.
- **Do** alternate Canvas White and Cool Mist bands, separated by Hairline borders.
- **Do** disable every looping animation under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** set body-size text in Burnished Gold or Pentagon Gold on white; it fails contrast.
- **Don't** set readable small text in Quiet Caption (#8A93A3); at about 3:1 it's for decorative micro-labels only.
- **Don't** reintroduce cream (#FAF7F2), the slate/blue site palette (#2563EB, #1E293B) or brand-kit gold (#DDA744) in UI. Brand-kit gold is for the logo.
- **Don't** use the logo serif or any second typeface for headings.
- **Don't** stretch, recolour, shadow or filter the logo (per `Brand_Kit.md`).
- **Don't** float or animate anything at rest beyond the hero pipeline window and its metric card.
- **Don't** rely on `src/styles/home.css` (legacy, still imported by `src/layouts/Layout.astro`); its `.hero` and `.cta-section` rules leak centring that pages currently override.
