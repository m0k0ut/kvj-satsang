# Krishnam Vande Jagadgurum

Website project for the Krishnam Vande Jagadgurum Telugu devotional learning community.

Live site: https://m0k0ut.github.io/kvj-satsang/

## Current phase

The Astro MVP is live on GitHub Pages. Telugu is the default language. English routes live under `/en/`. Registration uses a Google Apps Script web app to validate submissions and append them to the organizer's Google Sheet. The public site contains no Google credentials.

## Working files

- `research/telegram-group-findings.md`: evidence from the live Telegram group review, including activity, programs, resources, community behavior, and privacy boundaries
- `content/site-brief.md`: recommended audience, positioning, page structure, homepage narrative, calls to action, and content requirements

## Agent handoff and specifications

- `CLAUDE.md`: canonical coding-agent rules, safeguards, workflow, and completion checks
- `AGENTS.md`: symbolic link to `CLAUDE.md` for compatible coding agents
- `docs/MASTER_SPEC.md`: master product and technical specification with architecture diagrams
- `docs/DECISIONS.md`: durable architecture and product decision log
- `docs/INDEX.md`: documentation map and source-of-truth guide
- `plan.md`: Nimbalyst Plan with delivery work items and approval gates

Nimbalyst Tracker is authoritative for current execution status, dependencies, evidence, and human approvals. Passing tests do not approve Gate 2 or Gate 3.

## Project structure

```text
kvj-satsang/
  AGENTS.md                 # Symlink to CLAUDE.md
  CLAUDE.md                 # Canonical coding-agent guide
  README.md
  docs/                     # Internal specifications and decisions
  research/
    telegram-group-findings.md
  content/                  # Internal briefs, never published
    site-brief.md
  src/
    content/                # Validated public content entries
    data/                   # Validated site settings and schedule state
    pages/                  # Telugu and English routes
    components/             # Shared Astro components
    layouts/                # Site metadata and page shell
    styles/                 # Design tokens and responsive styles
  public/
    favicon.svg
  scripts/                  # Privacy and internal-link checks
    google-apps-script/     # Registration backend source
  .github/workflows/        # GitHub Pages deployment
```

`research/`, the root `content/` folder, and `plan.md` are internal. Only Astro's generated `dist/` directory is deployed. The build fails if private project material enters that artifact.

## Local development

```bash
npm install
npm run dev
```

Before review:

```bash
npm run check
npm run build
```

The build validates content schemas, generates the static site, checks for private material, and verifies internal links.

## Updating content

- Programs: edit Markdown files under `src/content/programs/te/` and `src/content/programs/en/`.
- Resources: edit Markdown files under `src/content/resources/`.
- Site identity: edit `src/data/site.yaml`.
- Schedule state: edit `src/data/schedule.yaml` only after organizer confirmation.
- Images: add only publication-approved files under `src/assets/` or `public/`.

Every content entry is checked during the build. A missing required field stops publication with a useful error.

## Registration backend

The Telugu and English registration pages post to a Google Apps Script web app. The script appends these fields to `Sheet1` in the organizer spreadsheet:

- submitted time
- name, mobile number, optional email, and city
- preferred language and program interest
- optional learning background
- consent, source, status, and a duplicate-protection submission ID

The form includes browser validation, an invisible bot trap, server-side required-field checks, spreadsheet-formula protection, a script lock for concurrent writes, and duplicate protection for recent submission IDs.

The maintained backend source is `scripts/google-apps-script/Code.gs`. After changing that file:

1. Copy it into the bound Apps Script project.
2. Save and deploy a new web app version that executes as the spreadsheet owner.
3. Keep web app access set to `Anyone` so the public registration form can submit.
4. Put the resulting `/exec` URL in `src/data/registration.ts`.
5. Submit one labeled test registration and confirm the row in `Sheet1`.

The Apps Script URL is public by design, but it does not grant spreadsheet access. Never add Google account credentials or private contact data to the repository.

The deployed script is bound to the registration Sheet and uses `@OnlyCurrentDoc`, which limits its authorization to that spreadsheet.

## GitHub Pages

The repository can remain private. GitHub Actions builds and deploys only `dist/`.

1. Set the repository's Pages source to GitHub Actions.
2. Push the reviewed release to `main`.
3. Astro derives the project-page base path from `GITHUB_REPOSITORY`.
4. Set `SITE_URL` only if the final Pages origin or custom domain needs to override the default.

The release candidate uses the organizer-supplied teacher photograph, licensed public-domain artwork in the gallery, and resource summaries without copied Telegram files. Telegram is presented only as the class platform. No invite, username, email, or phone number is published. Registration details are stored privately in the organizer's Google Sheet. Public release still requires the user's Gate 3 approval.
