# Project documentation index

This directory holds durable internal documentation for coding agents and maintainers. These files are not part of the public Astro output.

## Canonical documents

| Document | Purpose | Update when |
| --- | --- | --- |
| `../CLAUDE.md` | Agent rules, workflow, safeguards, and completion checks | Agent behavior or project operating rules change |
| `MASTER_SPEC.md` | Product, architecture, data, security, deployment, and QA specification | Product behavior or technical implementation changes |
| `DECISIONS.md` | Durable decision log with rationale and consequences | A long-lived architectural or product decision is made or replaced |
| `../plan.md` | Nimbalyst Plan, delivery work items, dependencies, and gates | Scope, delivery sequence, or approval gates change |
| `../README.md` | Routine maintainer and local-development guide | Setup, commands, or content operations change |

## Operational systems

| System | Authority |
| --- | --- |
| Nimbalyst Plan | Approved delivery plan and gate definitions |
| Nimbalyst Tracker | Current work status, dependencies, comments, evidence, and approvals |
| Repository | Current implementation |
| Google Sheet | Organizer-owned registration records |
| Apps Script project | Deployed registration backend version |
| Standalone Telegram Apps Script project | Deployed KVJ Satsanga Mitra version and trigger |
| GitHub Actions | Build validation and GitHub Pages publication workflow |

## Update discipline

- Link to canonical values instead of duplicating values that can drift.
- Record stable rationale in `DECISIONS.md`.
- Record implementation detail and interfaces in `MASTER_SPEC.md`.
- Record current task evidence in Nimbalyst Tracker comments.
- Keep all approval decisions in Nimbalyst. Passing tests do not grant release approval.
- Keep Telegram operational instructions in `../scripts/telegram-bot/README.md` and discovery evidence in `../research/telegram-group-findings.md`.
