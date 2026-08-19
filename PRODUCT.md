# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a Brazilian guardian of a healthy adult dog or cat who has no
veterinary training, already has the pet food at home, and wants to know how many grams
to serve each day.

Veterinarians are not the target audience. Clinical cases require professional tools and
individual assessment.

## Product Purpose

The calculator turns the pet's ideal weight, species, supported adult profile, and the
food label's metabolizable energy into an initial daily portion in grams. Success means
the guardian can complete the calculation without specialist arithmetic, understand how
the result was obtained, and use it as a monitored starting point rather than a
prescription.

## Positioning

Unlike broad feeding tables, the calculator accounts for species, neutering status, and
obesity tendency. It exposes the veterinary-sourced equation and each calculation step
instead of presenting an unexplained number.

## Operating Context

The guardian uses the calculator with the pet food package available to read its
metabolizable energy in kcal/kg. They enter the ideal weight established with a
veterinarian, calculate on a single responsive screen, weigh the resulting portion with
a kitchen scale, and monitor weight and body condition over two to four weeks with
veterinary guidance.

## Capabilities and Constraints

- The supported population is healthy adult dogs and cats.
- The supported profiles are neutered, intact, and obesity-prone; the last describes an
  animal at a healthy weight that tends to gain weight, not a weight-loss protocol.
- Puppies, pregnant or lactating animals, sick animals, weight-loss protocols, working
  dogs, and other unsupported profiles do not receive a calculation.
- The result includes daily grams, daily maintenance energy, visible calculation steps,
  and clinical caveats.
- The result is a population estimate and never replaces veterinary assessment.
- The application has no backend, database, account, history, analytics, telemetry,
  cookies, or collection, transmission, or persistence of user or animal data.
- The product remains one calculator until a second real tool justifies broader
  navigation or platform concepts.

## Brand Commitments

- User-facing copy is Brazilian Portuguese and uses language understandable without
  veterinary training.
- The product is direct and educational without claiming clinical authority.
- The requested weight is always the ideal weight defined with a veterinarian.
- Copy never promises a weight-loss timeline and sends visibly overweight animals to a
  veterinarian, with the specific unsupervised calorie-restriction risk for cats.

## Evidence on Hand

- `docs/prd.md` defines the audience, scope, workflow, and fifteen acceptance criteria.
- `docs/dominio-nutricional.md` is the source of truth for formulas, factors, validation
  ranges, and clinical warnings.
- `docs/referencias.md` records the veterinary sources and their verification status.
- Automated tests cover the accepted product behavior, including calculation examples,
  responsive behavior, keyboard operation, and the no-network requirement.
- There are no testimonials, customer claims, clinical outcomes, or commercial evidence;
  future work must not fabricate them.

## Product Principles

1. Make the daily portion understandable, not merely computable.
2. Keep every nutritional number traceable to veterinary literature.
3. Be explicit about uncertainty, supported populations, and clinical boundaries.
4. Keep the entire calculation private and local to the browser.
5. Optimize one focused task before considering additional tools.

## Accessibility & Inclusion

The single-screen flow must remain usable at a 360 px viewport and operable using only a
keyboard. Every field keeps an associated label, and Brazilian numeric conventions such
as decimal commas remain accepted alongside dot decimals.
