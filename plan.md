# Launch Astro MVP Website

Status: `complete`

Nimbalyst phase: `completed`

Suggested tags: `#website` `#astro` `#mvp` `#github-pages` `#bilingual` `#approval-required`

## Decision

Build the first public release as a static Astro website with local Markdown, YAML, and image content. Deploy it through GitHub Actions to GitHub Pages. Use Google Apps Script and the organizer's Google Sheet for registration submissions.

Do not add Storyblok, Supabase, authentication, donations, or Telegram automation in the MVP.

Gate 1 was approved by the user on September 17, 2026. Gate 2 was reopened at the user's request so teacher information can be revised. Implementation is tracked in the Nimbalyst Kanban. Public launch remains a separate review gate.

On September 17, 2026, the user explicitly activated the registration capability and supplied the organizer-owned Google Sheet. This scope change replaces the earlier no-data-collection decision for registration only.

## Goal

Create a clear, trustworthy, mobile-first public home for Krishnam Vande Jagadgurum that explains the community, its learning programs, its teacher, how classes work, and how an interested person can join.

The first release must be easy to operate through simple content files and automatic deployment from GitHub.

## Repository and publication boundary

Use one private GitHub repository at the Nimbalyst project root. The connected GitHub account is on the Pro plan, which supports GitHub Pages from a private repository.

GitHub Actions must publish only Astro's generated `dist/` artifact. The repository, planning documents, and research remain private. The GitHub Pages website is public.

Use this structure:

```text
kvj-satsang/
  plan.md                    # Internal planning and review
  research/                  # Internal, never published
  content/                   # Internal briefs and working copy
  src/                       # Astro source and approved site content
  public/                    # Approved public assets only
  .github/workflows/         # Build and Pages deployment
  astro.config.mjs
  package.json
```

Keep internal research outside Astro's `src/` and `public/` directories. Add a build-time privacy check that fails if internal planning or research files enter `dist/`.

## MVP scope

### Public pages

1. Home
2. Programs
3. About the teacher and community
4. How classes work
5. Gallery
6. Resources
7. Join
8. Register
9. Custom 404 page

### Languages

- Telugu is the default experience.
- English is available under `/en/`.
- Telugu and English content remain in separate files.
- Each language can be reviewed and published independently.

### Content model

Use Astro Content Collections with schema validation for:

- programs
- resources
- gallery items
- events or recurring schedule entries

Use YAML for site settings, navigation, and the weekly schedule.

### Join and registration path

The MVP explains that classes run on Telegram, but publishes no invite link, username, email, phone number, or group details. Access is coordinated privately by organizers. The registration page collects the minimum details needed to review interest and coordinate the next step. Submissions go to the organizer's Google Sheet through Google Apps Script. The public site contains no Google credentials.

## Out of scope for the MVP

- Storyblok or another CMS
- Supabase or another database
- member accounts
- attendance tracking
- membership cards
- donations or payment processing
- automated Telegram synchronization
- private resource access
- analytics that use cookies or collect personal data
- an admin dashboard

These items belong in the Nimbalyst backlog and should be activated only when a verified need appears.

## Delivery plan

### Gate 1: Plan approval

Review and approve:

- Astro-only architecture
- public-page scope
- Telugu-first routing
- one private repository with artifact-only Pages deployment
- deferred-feature backlog

No implementation or Kanban execution begins before this gate.

### Work item 1: Establish the Astro foundation and publication boundary

Priority: high

Dependencies: Gate 1

Actions:

- Initialize the current stable Astro release in the project root without overwriting existing planning or research files.
- Configure static output and strict TypeScript.
- Add `.gitignore`, `.env.example`, and an approved-content-only rule.
- Configure the build so only `dist/` is eligible for GitHub Pages deployment.
- Add a privacy check for internal filenames and paths in the generated output.

Done when:

- Astro starts locally.
- The production build succeeds.
- `dist/` contains only approved public website output.
- Internal research remains available in the private repository but cannot enter the deployment artifact.

### Work item 2: Create the content and language foundation

Priority: high

Dependencies: Work item 1

Actions:

- Configure Telugu as the default locale and English under `/en/`.
- Define validated collections for programs, resources, gallery items, and events.
- Add site settings and schedule schemas.
- Add representative approved sample content in both languages.

Done when:

- Invalid content fails the build with a useful error.
- Telugu and English routes build successfully.
- Content can be changed without editing page components.

### Work item 3: Build the visual system and first meaningful preview

Priority: high

Dependencies: Work items 1 and 2

Actions:

- Define shared design tokens for indigo, gold, lotus pink, ivory, typography, spacing, borders, and motion.
- Build the site shell, header, footer, language switcher, buttons, and section components.
- Build the homepage hero, community introduction, program summary, and join action.
- Use approved assets only. Use clearly labeled internal placeholders during review.
- Open the first Nimbalyst preview after the page is recognizable and the theme is intentional.

Done when:

- The homepage communicates the group and its main action in the first viewport.
- The preview works at mobile and desktop widths.
- The user approves the visual direction at Gate 2.

### Gate 2: Visual direction approval

Status: in review. The visual direction is accepted. The teacher biography and organizer-supplied photograph were revised at the user's request and await final review.

Review:

- homepage hierarchy
- devotional visual language
- Telugu and English typography
- navigation
- mobile presentation
- treatment of unavailable or unapproved assets

The approved direction uses the existing devotional design, responsive navigation, Telugu-first hierarchy, and conservative treatment of unapproved assets.

### Work item 4: Complete the public pages

Priority: high

Dependencies: Gate 2

Actions:

- Build Programs.
- Build About.
- Build How Classes Work.
- Build Gallery.
- Build Resources.
- Build Join.
- Build Register with Telugu and English form copy.
- Connect registration to Google Apps Script and the organizer's Google Sheet.
- Add the custom 404 page.
- Add meaningful page titles, descriptions, canonical URLs, and social metadata.

Done when:

- Every navigation item resolves.
- Every page has Telugu and English handling.
- No internal research, private link, member data, or unapproved media appears.

### Work item 5: Content and asset approval pass

Priority: high

Dependencies: Work item 4

Actions:

- Confirm the exact public organization name in Telugu and English.
- Confirm Radha Ma'am's public name, title, biography, and portrait.
- Confirm stable programs and the schedule time zone.
- Confirm that no Telegram access details or public contact information will be published.
- Confirm registration consent, organizer access, retention, and follow-up handling.
- Confirm publication rights for every gallery image and resource.
- Replace internal placeholders with approved assets or remove the section.

Safe release decisions:

- Use the confirmed public role and concise biography for Radha Madam.
- Use the organizer-supplied pilgrimage photograph for the teacher profile.
- Publish the 22 unique community photographs supplied and approved by the organizer on September 17, 2026. Remove exact duplicates, strip embedded metadata, and provide Telugu and English alternative text.
- Publish resource summaries without copying files from Telegram.
- Use the official Telegram logo to identify the class platform, state that KVJ is independent from Telegram, and keep all group access details private.

Done when:

- Every public claim and asset has an identified approval source.
- The build contains no approval placeholders.

### Work item 6: Quality and privacy validation

Priority: high

Dependencies: Work items 4 and 5

Actions:

- Run the production build and type checks.
- Validate keyboard navigation, focus states, landmarks, labels, image alternatives, contrast, and reduced motion.
- Validate mobile and desktop layouts.
- Check internal and external links.
- Verify Telugu rendering and language switching.
- Confirm that no private research, personal data, draft invite links, or unused secrets enter the build.
- Confirm that registration data is sent only to the approved organizer spreadsheet and is never rendered into the public site.
- Check sitemap, robots metadata, favicon, social metadata, and the 404 page.

Done when:

- The production build passes.
- No blocking accessibility, privacy, or navigation issue remains.
- The release candidate is placed in `in-review` for Gate 3.

### Gate 3: Launch approval

Review the complete release candidate in Nimbalyst. Only the user can approve public publication.

Approved by the user on September 17, 2026. The approved release is live at https://m0k0ut.github.io/kvj-satsang/.

### Work item 7: Publish through GitHub Pages

Priority: high

Dependencies: Gate 3

Actions:

- Create or connect the approved private GitHub repository for this Nimbalyst project.
- Add the official Astro GitHub Pages workflow.
- Configure Astro `site` and `base` values for the final repository URL.
- Push the reviewed release.
- Enable GitHub Pages with GitHub Actions as the source.
- Enforce HTTPS.
- Add a custom domain later only if the user provides one.

Done when:

- The public URL loads successfully.
- Direct navigation and refresh work on all routes.
- The deployed build matches the approved release candidate.

Status: complete. GitHub Pages published the approved build on September 17, 2026.

### Work item 8: Maintenance handoff

Priority: medium

Dependencies: Work item 7

Actions:

- Document how to update Telugu and English content through GitHub's web editor.
- Document how to add programs, resources, events, and gallery items.
- Document preview, review, rollback, and deployment steps.
- Add a short monthly maintenance checklist.

Done when:

- A maintainer can make a content edit and deploy it without changing application code.

## Nimbalyst operating model

After Gate 1 approval:

1. Keep this document as the single Nimbalyst Plan.
2. Create one tracker work item for each numbered work item above.
3. Add the stated dependencies so only unblocked work appears as ready.
4. Use `#approval-required` for Gate 2 and Gate 3 items.
5. Use `#later` for deferred capabilities.
6. Keep approval-dependent work in `in-review`. Do not mark it approved on the user's behalf.
7. Attach evidence to each work item: changed files, build result, preview, and validation result.
8. Set the Nimbalyst session phase and tags to match the active work item.

### Saved views

Create these Nimbalyst views after approval:

- `MVP Delivery`: Kanban grouped by status, ordered by dependency and priority
- `Approval Queue`: items tagged `#approval-required` or in `in-review`
- `Deferred Roadmap`: items tagged `#later`
- `Launch Readiness`: open high-priority items required by Gate 3

## Deferred roadmap

Create backlog items, not implementation commitments, for:

| Capability | Trigger to reconsider |
| --- | --- |
| Headless CMS | More than one nontechnical editor or frequent page updates become difficult through GitHub |
| Supabase schedule | Schedule changes must appear immediately without a site rebuild |
| Member accounts | The group identifies a real private-content requirement |
| Telegram automation | Repeated manual publishing produces measurable administrative burden |
| Donations | Legal entity, payment ownership, accounting, and privacy requirements are confirmed |
| Membership card | Organizers define its purpose, eligibility, data fields, and revocation process |
| Analytics | A specific decision requires traffic data and a privacy-preserving measurement plan is approved |

## Release acceptance criteria

The MVP is complete when:

- It is a static Astro site with a narrowly scoped Google Apps Script registration backend.
- Telugu and English content are separately maintainable.
- All agreed pages work on mobile and desktop.
- The participation page explains the private organizer-coordinated access model without publishing group or contact details.
- Registration collects only the approved fields and stores them in the organizer's Google Sheet.
- No internal research or unapproved asset is public.
- The production build and quality checks pass.
- The user approves the release candidate.
- GitHub Pages serves the approved build over HTTPS.
- The maintenance guide is complete.

## Review decision requested

Approve or change these five decisions:

1. Astro-only MVP
2. Telugu-first with English under `/en/`
3. One private GitHub repository with artifact-only Pages deployment
4. Registration through Google Apps Script and the organizer's Google Sheet
5. Three review gates: plan, visual direction, and launch

## Technical references

- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro internationalization: https://docs.astro.build/en/guides/internationalization/
- Astro GitHub Pages deployment: https://docs.astro.build/en/guides/deploy/github/
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
