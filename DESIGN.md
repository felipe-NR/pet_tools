---
name: Pet Tools
description: A precise, local-first feeding-portion calculator for Brazilian pet guardians.
colors:
  ink: "#082136"
  night: "#061f31"
  paper: "#fff8e8"
  paper-deep: "#f2e8d4"
  vermilion: "#ef3d26"
  vermilion-deep: "#be291d"
  seafoam: "#bfddd0"
  line: "#9aa5a1"
  focus: "#15425b"
  danger: "#b1231d"
typography:
  display:
    fontFamily: "Plex Condensed, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.35rem, 2.6vw, 3.2rem)"
    fontWeight: 850
    lineHeight: 0.84
    letterSpacing: "-0.035em"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Plex Condensed, ui-sans-serif, sans-serif"
    fontWeight: 850
    letterSpacing: "0.04em"
rounded:
  square: "0"
spacing:
  compact: "0.75rem"
  field: "1.25rem"
  panel: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "0.75rem 3.3rem 0.75rem 1rem"
  field-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.72rem 0.75rem"
---

# Design System: Pet Tools

## Overview

**Creative North Star: "The Pantry Calibration Sheet"**

The interface feels like a durable measurement sheet used beside a food package and a kitchen scale. It is operational, tactile, and exact: an ink-blue instrument field holds warm paper sheets, while the calculation itself is always visible and traceable.

The system earns expression through measurement details—rules, numbered stations, tabular figures, and dense formula trails—not through decoration or a generic app shell. Product copy remains direct and clinical limits remain easy to find.

**Key Characteristics:**

- Two-material contrast: physical paper against an instrument-dark field.
- Condensed display lettering for task hierarchy and measurements.
- Vermilion is reserved for commitment, exceptions, and the daily-portion focal value.
- The calculated result is a ticket with a visible audit trail, never an unexplained metric.

## Colors

The palette pairs a dark measuring surface with warm paper, then uses a small set of high-legibility functional accents.

### Primary

- **Calibration Vermilion:** the committed action, selected output, and high-attention state.

### Secondary

- **Measured Seafoam:** calculation rows and quiet positive data fields.

### Neutral

- **Instrument Ink:** primary type, rules, and numbered station plates.
- **Instrument Night:** the outer work surface and persistent output field.
- **Warm Paper:** form and result substrates.
- **Deep Paper:** tonal separation behind primary output values.
- **Measurement Line:** low-emphasis dividers and dotted construction marks.

### Named Rules

**The Accent Has a Job Rule.** Vermilion marks an action, a warning, or the answer; it is not a general-purpose decoration.

## Typography

**Display Font:** Plex Condensed (with a condensed system sans fallback)

**Body Font:** System UI sans stack

**Character:** Condensed uppercase display text supplies the engineered, label-like voice. The body remains an ordinary sans serif so clinical guidance is read comfortably rather than performed.

### Hierarchy

- **Display:** the calculator title and output values; condensed, heavy, and tightly led.
- **Headline:** ticket and calculation-trail headings; condensed, uppercase, and tracked.
- **Body:** field help, warnings, and clinical guidance; regular UI sans with generous line height.
- **Label:** field labels and sequence numbers; heavy, compact, and measurement-oriented.

### Named Rules

**The Measurement Voice Rule.** Use the condensed face only where the visitor is locating a step, a unit, or a result; prose stays in the body face.

## Layout

The main operating surface is a two-column calibration field: an ivory form sheet on the left and a dark instrument frame with a persistent result ticket on the right. Four numbered inputs form a vertical sequence. On narrow screens the form comes first, followed by the result ticket, with no horizontal scrolling.

Spacing alternates between tight field groups and clear section breaks. The clinical boundary sits as a horizontal finishing strip, not a competing hero.

## Elevation & Depth

Depth is structural rather than decorative. The full work surface receives one ambient sheet shadow; internal hierarchy comes from paper-versus-instrument contrast, fine rules, and layered paper tones.

### Shadow Vocabulary

- **Sheet Lift:** the single ambient shadow that separates the complete calibration field from the night background.

### Named Rules

**The One Lift Rule.** Lift the assembled work surface, not each field or result row.

## Shapes

The system is square and ruled. Inputs, buttons, calculation rows, and ticket panels use crisp right angles, one-pixel rules, dotted dividers, and measurement marks. The paper texture is an authored raster material; it must not be replaced with a generic CSS grain.

## Components

### Buttons

The primary button is a vermilion stamped action inside the paper sheet.

- **Shape:** square corners.
- **Primary:** heavy condensed uppercase text with a directional arrow and an inset lower edge.
- **Hover / Focus:** hover deepens the action color and lifts it slightly; focus uses the dark focus color with a visible offset.

### Inputs / Fields

Fields are numbered stations in a measurement sequence.

- **Style:** warm-paper controls with a dark one-pixel outline and tabular numeric treatment.
- **Focus:** a high-contrast dark outline offset from the field.
- **Error:** the control turns to a pale warning paper and the message uses the danger color.

### Calculation Ticket

The result area is a persistent instrument field that becomes an ivory ticket once calculated. The grams-per-day value owns the largest scale; the daily energy and three formula rows remain adjacent so the result can be checked without changing views.

## Do's and Don'ts

### Do:

- **Do** preserve the paper-sheet versus dark-instrument contrast in every new operational surface.
- **Do** make quantities tabular, visibly labelled, and adjacent to their units.
- **Do** keep the calculation trace close to its answer when a result depends on user-entered values.
- **Do** keep keyboard focus, error text, and reduced-motion behavior visible inside the same material system.

### Don't:

- **Don't** use rounded dashboard cards, glass effects, or floating metric tiles in place of the measurement sheet.
- **Don't** scatter vermilion through neutral content; reserve it for meaningful action and emphasis.
- **Don't** introduce navigation or a marketing hero before an operating task.
- **Don't** replace the paper texture with a generic grain or unproven medical imagery.
