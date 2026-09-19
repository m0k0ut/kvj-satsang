# Telegram Group Findings

## Review scope

This is an internal research note based on a live review of the Krishnam Vande Jagadgurum Telegram group through iPhone Mirroring on September 16, 2026. It records visible facts, reasonable interpretations, and items that need confirmation before publication.

The review covered the current conversation, search results, group files, media, music, voice messages, links, and Telegram group statistics. No messages were sent, changed, downloaded, or deleted.

This file is the single discovery record for the Telegram group. Add future observations as dated refresh sections here instead of creating parallel discovery notes.

## September 17, 2026 refresh

A second review through iPhone Mirroring found:

- 1,684 members, with the visible online count fluctuating from 75 to 89 during review
- 23.1K messages in Telegram's displayed metric, up 165 or 0.72 percent for the September 10 to September 17 period
- 734 viewing members, up 33 or 4.71 percent
- 49 posting members, up 6 or 13.95 percent
- 171 photos, 20 videos, 30 files, 42 music files, 44 voice messages, and 72 links
- many recent member-join service messages, consistent with a current recruitment increase
- recent activity for Sundarakanda, Devi Narayaneeyam practice, Narayaneeyam, and Bhagavatam practice

A later operational check on the same date showed 1,698 members and 112 members online. Online counts are transient and should not be treated as a stable publication metric.

The shared-media counts were unchanged from the September 16 review. Member growth continued. Telegram timestamps shown in the interface are device-local, while schedule text may state IST. Do not infer a public schedule from either source.

### Bots and automation

The group currently has one existing automation bot: the Translator bot. Its role remains translation. Searches for literal `bot`, `Welcome`, and `/start` did not reveal additional bot behavior in the visible message history. The organizer confirmed that the Translator bot is the only existing bot.

The organizer initially approved a second bot with these September 17 boundaries:

- Display name: `KVJ Satsanga Mitra`
- Username: `KVJ_MitraBot`
- Role: group operations only
- Membership boundary: approved group only
- Runtime: a standalone Google Apps Script project using one-minute Bot API polling
- Privacy mode: enabled
- Member functions: help, rules, current organizer-maintained notice, registration, website, and privacy information
- Administrator functions: set today's notice, publish an announcement, schedule or cancel a one-time reminder, and view operating status
- Excluded functions: translation, spiritual advice, moderation, deletion, muting, banning, pinning, member management, message archival, and profile storage

The September 19 refresh below supersedes the polling, privacy-mode, administrator, and pinning assumptions in this initial design.

The maintained source and runbook live under `scripts/telegram-bot/`. BotFather configuration, credential storage in Script Properties, group enrollment, and the one-minute trigger were completed on September 17, 2026.

The first labeled group `/help` check exposed a Telegram permission constraint: regular members cannot send text in this group. Telegram rejected the bot reply for insufficient send rights. The organizer approved administrator status with every optional privilege disabled, solely so the bot can post operational replies. The organizer will apply that change later. Live `/help` and administrator-only `/status` verification remain pending.

The bot token, group identifier, private invite links, member names, and raw Telegram updates must never be recorded in this file.

## September 19, 2026 refresh

A quiet operational review through iPhone Mirroring found 1,745 members and 55 members online at the final observation. The online count is transient. No message was posted, changed, pinned, or deleted in the group during this review.

`KVJ Satsanga Mitra` is now listed as a group administrator. The selectable administrator rights were reduced discreetly so only `Pin Messages` remains enabled. Telegram shows `Change Group Info` as inherited from the group's member permissions and disables its switch in the bot editor. The bot code does not call group-edit APIs. Deletion, banning, invite, member-tag, story, video-chat, welcome-message, anonymous-posting, and administrator-promotion rights are disabled.

The organizer revised the bot operating model:

- Keep setup quiet. Do not send group tests, announcements, class notices, or member welcomes during activation.
- Use near-real-time Telegram webhook delivery instead of frequent polling. A one-minute Apps Script trigger remains only for reminders and other scheduled maintenance.
- Disable privacy mode so Telegram delivers the latest group updates to the bot.
- Read ordinary updates only long enough to route commands and record the latest group activity time. Do not store message text, message history, names, or member profiles.
- Ignore ordinary conversation. Do not infer moderation actions, class schedules, or pinning decisions from free-form member messages.
- Let authorized administrators use `/set_today` privately when they are ready to publish and silently pin the current class notice.
- Keep automated welcome messages disabled until the organizer explicitly enables them.
- Start every bot message with `జై శ్రీ మన్నారాయణ🙏🙏` and end with the bold signature `కృష్ణం వందే జగద్గురుం 🪷🪄📖`.

The existing Translator bot remains unchanged and retains translation responsibility. `KVJ Satsanga Mitra` remains an operations assistant and does not gain autonomous moderation authority.

### September 19 activation evidence

- The standalone Apps Script web app is deployed with a private webhook secret stored only in Script Properties.
- Telegram webhook delivery and the one-minute `runScheduledTasks` maintenance trigger are active. Legacy polling remains available only for recovery after removing the webhook.
- BotFather privacy mode is disabled so new group updates reach the webhook. Telegram does not provide historical group messages to bots, so activity awareness begins with updates delivered after activation.
- The command menu is configured, automated welcomes remain disabled, and no group message was sent during setup.
- A private administrator `/status` check returned within seconds. It reported no delivery error, no current class notice, and no pending reminders.
- The private response began with `జై శ్రీ మన్నారాయణ🙏🙏` and ended with the bold signature `కృష్ణం వందే జగద్గురుం 🪷🪄📖`.
- Group announcements, class notices, welcome messages, and group-visible command tests remain deferred until the organizer chooses to publish them.

## Executive understanding

Krishnam Vande Jagadgurum is an active Telugu devotional learning community. Telegram is its operating hub, not simply an announcement channel. The group conducts live classes, organizes progressive scripture study, distributes study material, records practice, coordinates revision, and supports devotional service activities.

The strongest public story is:

> A Telugu devotional learning community where members study, recite, practice, and serve together through guided online classes and shared spiritual discipline.

The future website should make the group understandable and trustworthy to a newcomer. It should complement Telegram by organizing evergreen information, while Telegram remains the live classroom and daily coordination channel.

## Identity and tone

- Display name: Krishnam Vande Jagadgurum, shown in Telugu as `కృష్ణం వందే జగద్గురుమ్` in the group interface.
- The logo centers Lord Krishna with a flute, an open scripture, a lotus, a lamp, peacock-feather details, and a ring of Telugu text.
- Common greetings include `Jai Srimannarayana`, `Krishnam Vande Jagadgurum`, and `Radhe Radhe`.
- The communication style is devotional, warm, direct, and participation-oriented.
- Telugu is the main teaching and community language. English and transliterated English appear in operational messages such as class reminders and lesson labels.

The website should feel reverent and accessible. It should avoid the visual clutter common to forwarded festival posters. A calm editorial treatment can preserve the devotional identity while making schedules, programs, and next steps easy to understand.

## Scale and current activity

Live group state during the review:

- 1,668 members
- 65 members online
- 171 shared photos
- 20 shared videos
- 30 shared files
- 42 music or audio files
- 44 voice messages
- 72 shared links

Telegram statistics labeled September 10 to September 17, 2026 showed:

- about 1.6K members, up 34 or 2.08 percent
- 23K messages in Telegram's displayed metric, up 131 or 0.57 percent
- 734 viewing members, up 33 or 4.71 percent
- 49 posting members, up 6 or 13.95 percent

The growth chart rose from roughly 1,590 members at the end of August to 1,668 by September 16. The daily activity chart showed the strongest activity in the early morning, especially around 5:00 to 7:00, with another active period around 10:00 to noon. Activity declined sharply in the evening.

These figures are a dated snapshot. If used publicly, label them with the date or use a conservative rounded statement such as "a community of more than 1,600 members."

## Learning model

The group uses a repeatable learning loop:

1. An admin or teacher posts the day's schedule.
2. Members join a Telegram video chat for the live class.
3. The class progresses through a named scripture, chapter, canto, sarga, dashakam, or verse.
4. PDFs, audio tracks, karaoke-style practice files, and recordings support independent study.
5. Members submit short voice recordings or join a practice class.
6. Revision sessions reinforce prior material.
7. Festival observances, parayanam, travel, and service activities connect the study to practice.

Visible video-chat durations included about 38 minutes, 52 minutes, 56 minutes, one hour, and one session of three hours. The format appears flexible by subject and occasion.

## Recurring programs observed

### Narayaneeyam and Devi Narayaneeyam

- A current post announced a Narayaneeyam class from 10:00 to 11:00.
- A separate English reminder said, "Devi Narayaneeyam practice class started pls join."
- Search results showed a structured Devi Narayaneeyam sequence covering at least Dashakam 33 through Dashakam 41 in late July and August.
- The files area contained several copies of `Devinarayaneeyam.pdf` and a Chaturmasyam parayanam document.
- The music area included a 13-minute recording labeled `7 th dashakam`.

### Srimad Bhagavatam

- A current schedule announced Srimad Bhagavata Mahapurana, Dasama Skandham, Uttarardham from 4:00 to 5:15.
- A revision post referred to Bhagavatam chapter 10.24.
- Search results showed systematic progression from the ninth skandham into the tenth skandham, with named adhyayams and verse numbers.
- Examples included ninth skandham, twenty-fourth adhyayam, and tenth skandham, first through third adhyayams.
- Shared files included Bhagavatam material, a Prathama Skandham document, and a document referring to the tenth skandham.

### Ramayanam and Sundarakanda

- A current schedule announced a Sundarakandam class from 11:30 to 1:00.
- Repeated reminders said "Ramayanam class started pl join" and "Sundarakanda class started pl join."
- One lesson was labeled "Ramayanam, Sundarakanda, 1st sarga."
- Shared PDFs included Narayana Kavacham and several Sundarakanda resources, including sarga, sloka, and parayanam material.

### Bhagavad Gita

- One historical announcement described a Bhagavad Gita Makarandam activity organized across six teacher groups.
- The exercises included identifying a verse from its number, identifying a number from its verse, antakshari-style recitation, recognizing who speaks a verse, and producing verses from a given word.
- The post said the group had practiced for six months and invited students to listen, with some receiving an opportunity to answer a question.

This is useful evidence that the program includes active recall and group practice, not passive listening alone.

### Parayanam and devotional practice

- Members referenced Bhagavatam parayanam in Haridwar and parayanam in Ayodhya.
- An older shared link referred to a Vishnu Sahasranama parayanam.
- A related Telegram group was titled Narayaneeyam Nityamrutha Saram.
- Some linked invitations appear to connect the main community to subject-specific or practice groups.

Treat these as ecosystem signals, not confirmed official programs, until the organizers confirm ownership and current status.

## Practice and resource library

The resource mix supports different learning styles:

- PDF texts and study sheets
- lesson recordings
- karaoke-style audio for guided recitation
- guru songs and devotional music
- short member voice recordings
- class video chats
- festival and event posters
- photos and videos from in-person gatherings

The 44 voice messages came from several members and ranged from a few seconds to more than three minutes. This looks like individual recitation, response, or practice submission. The 42 music files include many karaoke-labeled tracks. Together, they suggest a listen, repeat, submit, and improve learning pattern.

Do not publish Telegram files by default. Some may be copyrighted, forwarded, or intended only for group members. Each public resource needs an owner, source, and publication approval.

## Community and service

- The group includes a visible Teacher role and several admins who start classes, post schedules, and share lesson references.
- The principal teacher appears to be known as Radha Ma'am. A visible forwarded-photo label suggests the full name may be Tupakula Radha. Confirm the exact public name, title, biography, and preferred photograph.
- A photo collage showed women serving food at an in-person gathering.
- Multiple posts described the activity as `annadanam` under Radha Ma'am's guidance.
- Festival content included a branded Vinayaka Chavithi greeting and other devotional imagery.
- Many visible participants and organizers were women, but the review did not establish that membership is limited by gender or age.

The community story can include service, fellowship, and festival observance, but member photographs and names require permission before public use.

## What makes the group distinctive

- Structured progression through substantial scriptures rather than isolated talks
- A combination of live teaching, guided practice, revision, and recitation
- Frequent classes across several subjects
- Telugu-first access for devotees
- A large active community with visible growth
- A strong teacher and admin operating model
- Digital learning connected to parayanam, festivals, and annadanam

## Website implications

The first site should answer five questions quickly:

1. What is Krishnam Vande Jagadgurum?
2. What can I study here?
3. Who teaches and guides the community?
4. How do classes work?
5. How can I join safely?

Recommended public proof points:

- More than 1,600 members, dated September 2026
- Multiple recurring scripture programs
- Live online classes and guided practice
- A growing library of study and recitation resources
- Community service and devotional gatherings

Avoid publishing the raw 23K-message metric until its exact Telegram definition is verified.

## Privacy and publication boundaries

- Do not publish a Telegram invite link until the organizers select the correct permanent link and approve public access.
- Do not publish member names, profile photos, screenshots, or voice messages without permission.
- Do not reproduce forwarded posters or PDFs unless ownership and reuse rights are clear.
- Do not hardcode a daily class schedule. The schedule changes and should come from a maintained source.
- Do not make health, spiritual-outcome, or guaranteed-benefit claims.
- Use rounded community metrics with a date.
- Keep this research note internal. Public copy should be written from approved facts only.

## Questions to confirm before building

1. What is the exact Telugu and English public name of the organization?

కృష్ణం వందే జగద్గురుమ్ / Krishnam Vande Jagadgurum

Satsangam suffix will be added as formal organization name. Otherwise use the above as informal telugu/ english names

1. Is Radha Ma'am the founder, principal teacher, or spiritual guide? What full public name and title should appear?

Radha Madam - Founder, Principal Teacher and Spiritual Guide

1. Which classes are permanent programs, and which are temporary series?

not sure.

1. Which time zone should schedules use?

Indian Standard Time (IST)

1. Should the site be Telugu-first, bilingual on every page, or use separate Telugu and English pages?

suggest whats best later

1. Which Telegram link is approved for public use?

2. Should newcomers join the main group directly or complete a short interest form first?

yes, website consists of registration form. and generates memebership card with founder/ principal teacher/ spirtitual guide signature 8. Which logo file, teacher portrait, class photos, and annadanam photos are approved for the site?

yes, use them as you find on the group. use your best judgement.

1. Which PDFs or recordings are owned by the group and approved for public download?
   use publicly avaiable documents to list on website. as reponsitory when group members can easily find necessary files both in telugu and english.

2. Are donations, sponsorships, or volunteer sign-ups in scope?

yes, but for later implementation.

1.  Is the community a formal organization, informal satsang, trust, or service group?

formal organization

1.  What city or geographic base, if any, should the site mention?

main base is hyderabad

## Confidence notes

- High confidence: member count, activity snapshot, media counts, class topics, Telugu-first communication, use of Telegram video chat, and the existence of annadanam activity.
- Medium confidence: Radha Ma'am's full public identity, the relationship between the main group and linked subject groups, and whether all observed programs remain active.
- Needs confirmation: legal organization status, founder story, approved biography, public contact method, permanent schedule, asset rights, and approved Telegram join path.
