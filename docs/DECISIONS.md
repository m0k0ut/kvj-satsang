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

Status: Implemented and published

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

Decision: Do not add a CMS, Supabase, authentication, donations, private resources, analytics, or an admin dashboard to the website release. Telegram automation remained deferred until the post-launch operations decision below.

Rationale: These capabilities add operating cost, privacy exposure, and maintenance burden without a verified current need.

Consequences:

- Reconsider a capability only when the trigger in the Nimbalyst Plan is met.
- Create a new tracker item and architecture decision before implementation.

## Decision 009: Telegram-only operations bot

Status: Approved and active

Date: 2026-09-17

Decision: Create `KVJ Satsanga Mitra` as `KVJ_MitraBot` and run its operations logic from a standalone Google Apps Script web app using Telegram webhook delivery. Enroll it only in the approved KVJ Telegram group. Disable privacy mode so the bot receives current group updates. Ignore ordinary conversation without storing message text or member profiles. Because the group blocks regular-member text, grant administrator status with only `Pin Messages` enabled.

Rationale: The organizer approved a focused operations assistant for welcomes, guidance, current notices, announcements, and reminders. A separate Apps Script runtime keeps Telegram credentials and operations outside the public static website and the registration spreadsheet.

Consequences:

- The public website continues to publish no Telegram username, group detail, invite, or bot identity.
- The bot token and group identifier exist only in Apps Script Script Properties.
- Telegram privacy mode is disabled only to support near-real-time webhook delivery and current group activity awareness.
- Administrator status is limited to operational replies and organizer-approved class-note pinning. All selectable moderation, deletion, member-management, invite, story, topic, video-chat, welcome-message, and administrator-promotion rights remain disabled. Telegram displays `Change Group Info` as an inherited group-member permission rather than a selectable bot grant, and the bot code does not call group-edit APIs.
- Current group administrators are checked through the Bot API before administrative commands run.
- The bot does not translate, moderate members, archive messages, or store ordinary message text or member profiles.
- `/set_today` publishes and silently pins the current class notice when an administrator intentionally uses it.
- Every bot message uses the approved Telugu greeting and bold Telugu signature.
- Automated welcome messages stay disabled until the organizer explicitly enables them.
- The existing Translator bot remains unchanged and retains translation responsibility.
- `research/telegram-group-findings.md` is the single dated discovery record.
- Webhook delivery and the one-minute maintenance trigger are active. Legacy polling remains available only for recovery after the webhook is removed.
- Among Telegram's selectable bot administrator rights, only `Pin Messages` is enabled. Telegram shows `Change Group Info` as inherited from the group's member permissions and does not allow it to be changed in the bot's administrator editor. The bot code does not call group-edit APIs.
- Private `/status` verification passed with the approved Telugu message envelope. Group-visible verification remains deferred to avoid disrupting members.

## Decision 010: Repository slug and English teacher honorifics

Status: Approved and implemented

Date: 2026-09-19

Decision: Rename the GitHub repository to `kvj-satsang` and publish the project page at `https://m0k0ut.github.io/kvj-satsang/`. Use the user-approved English teacher references `Radha Madam`, `Smt. Radha ji`, `Radha garu`, and `Mr. Venkateswarlu garu` according to context.

Rationale: The user explicitly requested a shorter repository name and corrected the public honorifics on the English About page.

Consequences:

- Repository metadata, validation commands, documentation, and the Telegram bot site link use the new project-page URL.
- Astro continues to derive the GitHub Pages base path from `GITHUB_REPOSITORY`.
- Repository renames require a fresh Pages deployment and browser verification of generated assets and content routes.
- The Telugu teacher copy remains unchanged.
