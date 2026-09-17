# Project decision log

This log records durable decisions already implemented or established by project policy. Nimbalyst remains authoritative for approval state and current work status.

## Decision 001: Static Astro architecture

Status: Implemented

Date: 2026-09-17

Decision: Build the public website with Astro static output, strict TypeScript, local Markdown content, and YAML site data.

Rationale: The site is content-led, has modest update frequency, and does not need a public application server for its current scope.

Consequences:

- Public pages are prebuilt into `dist/`.
- Content changes require a build and deployment.
- A server runtime, CMS, or client database requires a new approved decision.

## Decision 002: Telugu-first bilingual routing

Status: Implemented

Date: 2026-09-17

Decision: Use Telugu as the default locale and English under `/en/`.

Rationale: Telugu is the primary community language, while English improves accessibility for a broader audience.

Consequences:

- Telugu routes have no locale prefix.
- Equivalent English routes use `/en/`.
- Content and interface changes must consider both locales.

## Decision 003: Private source with artifact-only GitHub Pages deployment

Status: Implemented, publication pending Gate 3

Date: 2026-09-17

Decision: Keep source and internal material in a private repository. Publish only Astro's generated `dist/` artifact through GitHub Actions to GitHub Pages.

Rationale: This keeps research, planning, and operational material private while using a low-maintenance public host.

Consequences:

- The build includes a privacy scan.
- GitHub project-page base paths must work correctly.
- Public deployment cannot proceed before Gate 3 approval.

## Decision 004: Google Sheets registration backend

Status: Implemented and tested

Date: 2026-09-17

Decision: Submit the static registration form to a bound Google Apps Script web app that appends validated records to the organizer-owned Google Sheet.

Rationale: The organizer already owns the Sheet and needs a simple, low-cost registration workflow without a separate database or admin product.

Consequences:

- The public form requires `Anyone` access to the Apps Script web app.
- The script executes as the organizer and uses `@OnlyCurrentDoc`.
- Backend updates require a new Apps Script deployment version and a labeled end-to-end test.
- The endpoint is canonical only in `src/data/registration.ts`.

## Decision 005: No public Telegram access details

Status: Policy

Date: 2026-09-17

Decision: Present Telegram only as the class platform. Do not publish an invite, username, email, phone number, contact method, or group detail.

Rationale: Access is coordinated privately by organizers and public contact details create privacy and moderation risk.

Consequences:

- The website uses approved Telegram brand artifacts only.
- The site states that KVJ Satsangam is independent from Telegram.
- Registration is the public participation path.

## Decision 006: Approved-content publication boundary

Status: Policy and build-enforced

Date: 2026-09-17

Decision: Treat `src/` and `public/` as publication-capable locations. Keep research, working briefs, plans, agent guidance, and project documentation outside the generated site.

Rationale: Clear source boundaries reduce accidental publication of private or unapproved material.

Consequences:

- `scripts/check-dist.mjs` fails the build when known internal material reaches `dist/`.
- New media requires publication approval.
- The gallery retains 22 deduplicated organizer-approved community images.

## Decision 007: Nimbalyst as the project control plane

Status: Policy

Date: 2026-09-17

Decision: Use `plan.md` as the single Nimbalyst Plan and Nimbalyst Tracker for work status, dependencies, evidence, saved views, and approvals.

Rationale: The project needs durable cross-session context and explicit release gates.

Consequences:

- Coding agents inspect Nimbalyst before making scope or status assumptions.
- Evidence is attached to tracker items as comments.
- Only the user can approve gated decisions.
- Local tracker keys are not used in public or shared references.

## Decision 008: Deferred platform capabilities

Status: Deferred

Date: 2026-09-17

Decision: Do not add a CMS, Supabase, authentication, donations, Telegram automation, private resources, analytics, or an admin dashboard to the current release.

Rationale: These capabilities add operating cost, privacy exposure, and maintenance burden without a verified current need.

Consequences:

- Reconsider a capability only when the trigger in the Nimbalyst Plan is met.
- Create a new tracker item and architecture decision before implementation.
