# KVJ Satsangam agent guide

This file is the canonical coding-agent guide for this repository. `AGENTS.md` is a symbolic link to this file so Codex, Claude Code, and other compatible agents receive the same project instructions.

## Start here

Read these sources before changing the project:

1. `CLAUDE.md`: working rules and completion checks
2. `docs/MASTER_SPEC.md`: product, architecture, data, security, and operations specification
3. `docs/DECISIONS.md`: durable technical and product decisions
4. `plan.md`: the approved Nimbalyst plan, delivery gates, and work-item definitions
5. Nimbalyst Tracker: current execution status, dependencies, approval state, and evidence
6. `README.md`: maintainer commands and routine content updates

If sources conflict, apply this order:

1. The user's latest explicit instruction
2. Human approval state in Nimbalyst
3. `plan.md`
4. `docs/MASTER_SPEC.md` and `docs/DECISIONS.md`
5. `README.md`

Do not infer approval from implemented code, passing tests, or completed tracker evidence.

## Project summary

Krishnam Vande Jagadgurum is a Telugu-first devotional learning website for a Hyderabad satsangam. English content lives under `/en/`. The public experience explains the community, programs, teacher, classes, gallery, resources, participation path, and private registration process.

The current release candidate uses:

- Astro 7.3.3 with static output
- strict TypeScript 6
- Markdown content collections and YAML site data
- GitHub Actions and GitHub Pages for artifact-only publication
- Google Apps Script and the organizer-owned Google Sheet for registration
- a standalone Google Apps Script webhook service for the Telegram-only operations bot
- Nimbalyst Plan and Tracker for work, dependencies, evidence, and approvals

The website launch was approved and completed on September 17, 2026. New public releases still require explicit user instruction. Post-launch Telegram bot work is tracked separately and must not reopen or alter the completed website release.

## Non-negotiable project rules

### Privacy and publication

- Never publish a Telegram invite, username, phone number, email address, group detail, or other access method.
- Telegram may appear only as the class platform. Use approved Telegram brand artifacts and retain the independent, unaffiliated statement.
- Never put Google credentials, spreadsheet data, member details, or private contact information in source files, build output, logs, screenshots, commits, or documentation.
- Never put a Telegram bot token, group identifier, invite link, enrollment code, raw update, or member data in source files, build output, logs, screenshots, commits, documentation, or Nimbalyst.
- Registration data may go only to the approved organizer spreadsheet through the bound Apps Script web app.
- Keep `research/`, root `content/`, `plan.md`, agent documentation, and tracker information out of `dist/`.
- Add media only when publication permission is established. Preserve the approved 22-image community gallery unless the user changes the decision.

### Language and content

- Telugu is the default locale with no URL prefix.
- English routes use `/en/`.
- Keep Telugu and English public content separately reviewable.
- Do not invent schedules, contact details, biographies, participation promises, or program availability.
- The schedule remains organizer-announced in Telegram and uses `Asia/Kolkata`.

### Writing and source hygiene

- Never use em dashes or en dashes in prose, comments, content, or documentation.
- Keep human-facing writing concise, specific, and free of promotional filler.
- Treat `src/` and `public/` as publication-capable locations.
- Treat `research/`, root `content/`, `docs/`, `plan.md`, `CLAUDE.md`, and `AGENTS.md` as internal sources.
- Reference the canonical source instead of copying mutable values such as the Apps Script endpoint into multiple documents.

## Architecture boundaries

- Runtime pages must remain static. Do not add a server runtime without a new approved architecture decision.
- Public content belongs in `src/content/`, `src/data/`, `src/assets/`, or `public/` as defined in `docs/MASTER_SPEC.md`.
- Shared route generation belongs in `src/pages/[...path].astro` and shared page rendering in `src/components/InteriorPage.astro`.
- Base-path-safe URLs must use the existing URL helper and Astro configuration. GitHub project pages run under a repository base path.
- The registration form posts directly to the Apps Script `/exec` endpoint stored only in `src/data/registration.ts`.
- Backend changes start in `scripts/google-apps-script/Code.gs`, then must be copied, versioned, deployed, and tested in the bound Apps Script project.
- Telegram bot changes start in `scripts/telegram-bot/Code.gs` and follow `scripts/telegram-bot/README.md`.
- Keep the bot in a standalone Apps Script project. Do not bind it to the registration spreadsheet or add it to the Astro runtime.
- Disable Telegram privacy mode only for `KVJ_MitraBot` so Telegram can deliver the approved group's latest updates to the webhook. The bot must ignore ordinary conversation and never store message text, history, names, or member profiles.
- The group disables text messages for regular members. The bot therefore needs administrator status with `Pin Messages` as its only selectable administrator right. Disable message deletion, member management, bans, invites, member tags, stories, video chats, welcome messages, anonymous posting, administrator promotion, and every other selectable privilege. Telegram displays `Change Group Info` as inherited from the group's member permissions and disables its switch in the bot editor. The bot code must never call group-edit APIs.
- Every Telegram message sent by the bot starts with `జై శ్రీ మన్నారాయణ🙏🙏` and ends with the bold signature `కృష్ణం వందే జగద్గురుం 🪷🪄📖`.
- Keep automated welcomes disabled until the organizer explicitly enables them. Do not post group tests, announcements, or class notices during quiet setup.
- The bot handles operations only. The existing Translator bot retains translation responsibility.
- Treat `research/telegram-group-findings.md` as the single Telegram discovery record. Add dated refresh sections there.
- Live Telegram activation is complete. The webhook, one-minute maintenance trigger, privacy-mode change, minimal selectable pin-only administrator role, and private `/status` check were verified on September 19, 2026. Group-visible acceptance messages remain deferred until the organizer chooses to publish them.

## Nimbalyst operating model

Nimbalyst is the project control plane.

- Keep `plan.md` as the single Nimbalyst Plan.
- Use Tracker work items for execution state, dependencies, priority, and evidence.
- Add implementation evidence as tracker comments. Include changed paths, validation results, and remaining blockers.
- Use `in-review` for approval-dependent work. Only the user may approve Gate 2 or Gate 3.
- Preserve dependency order. In particular, GitHub Pages publication remains blocked by Gate 3.
- Use the existing saved views: `MVP Delivery`, `Approval Queue`, `Deferred Roadmap`, and `Launch Readiness`.
- Do not expose local tracker keys in public documents, external references, or commit messages.
- If a tracker description write reports `collaborativeBodyStored: false`, do not claim the body is shared. Retry and verify collaborative storage, or add the evidence as a comment.
- When a task changes scope or a durable decision, update the relevant tracker item and the appropriate canonical document in the same work session.

## Standard workflow

1. Read the canonical sources and inspect current Nimbalyst state.
2. Identify the governing gate, tracker item, dependencies, and approval boundary.
3. Inspect the exact files in scope. Preserve unrelated user changes.
4. Make the smallest complete change.
5. Run proportional validation.
6. Review public output for privacy, language, links, and base-path behavior.
7. Attach evidence to the relevant Nimbalyst tracker item without approving gates.
8. Report the result, remaining risk, and next approval or dependency.

## Commands

Install and run locally:

```bash
npm install
npm run dev
```

Required checks for code, content, route, or style changes:

```bash
npm run check
npm run build
```

Validate the GitHub project-page configuration:

```bash
env GITHUB_REPOSITORY=m0k0ut/kvj-satsang SITE_URL=https://m0k0ut.github.io npm run build
```

Validate Apps Script syntax after backend changes:

```bash
node --check < scripts/google-apps-script/Code.gs
node --check < scripts/telegram-bot/Code.gs
npm run test:telegram-bot
```

Scan human-facing repository text for prohibited dash characters:

```bash
rg -n -P '[\x{2013}\x{2014}]' CLAUDE.md README.md plan.md docs src public scripts
```

## Completion criteria

A change is ready for review when:

- `npm run check` passes with no errors or warnings.
- `npm run build` passes the Astro build, privacy check, and internal-link check.
- The GitHub project-page build passes when routes, assets, or links changed.
- Apps Script syntax and a labeled end-to-end test pass when the backend changed.
- Telegram bot changes pass the bot test harness, syntax check, Apps Script activation checks, and labeled group verification.
- Telugu and English behavior remain consistent where the feature is bilingual.
- No private data or internal material enters `dist/`.
- The relevant Nimbalyst tracker item contains current evidence and retains the correct approval state.

## Reference map

- Architecture and behavior: `docs/MASTER_SPEC.md`
- Decision history: `docs/DECISIONS.md`
- Documentation map: `docs/INDEX.md`
- Delivery plan and gates: `plan.md`
- Maintainer guide: `README.md`
- Registration backend source: `scripts/google-apps-script/Code.gs`
- Telegram bot source and runbook: `scripts/telegram-bot/`
- Registration endpoint source: `src/data/registration.ts`
- Deployment workflow: `.github/workflows/deploy.yml`
