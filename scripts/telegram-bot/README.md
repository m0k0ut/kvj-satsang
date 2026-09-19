# KVJ Satsanga Mitra operations runbook

This directory contains the maintained source for the Telegram-only operations bot. It is separate from the public Astro website and the registration Apps Script project.

## Security boundary

- Never commit the Telegram bot token, group identifier, invite link, enrollment code, or member data.
- Keep the bot token and group identifier in the standalone Apps Script project's Script Properties.
- Disable Telegram privacy mode only for this bot so Telegram can deliver ordinary group updates to the webhook.
- Add the bot only to the approved KVJ group.
- Grant the bot administrator status with `Pin Messages` as its only selectable administrator right. Disable message deletion, bans, invites, member tags, stories, video chats, welcome messages, anonymous posting, administrator promotion, and every other selectable privilege. Telegram may display `Change Group Info` as inherited from the group's member permissions and disable its switch in the bot editor. The bot code must never call group-edit APIs.
- Keep automated welcome messages disabled until the organizer explicitly enables them.
- Do not copy raw Telegram updates, member names, messages, or execution output into this repository or Nimbalyst.
- If the token is exposed, revoke it in BotFather, replace `TELEGRAM_BOT_TOKEN`, and verify the old token no longer works.

## Apps Script project

Create a standalone Apps Script project. Do not bind it to the registration spreadsheet.

1. Copy `Code.gs` and `appsscript.json` into the standalone project.
2. In Project Settings, add `TELEGRAM_BOT_TOKEN` as a Script Property.
3. Run `createEnrollmentCode` and keep the returned value private.
4. In the approved KVJ group, send `/start@KVJ_MitraBot enroll CODE`, replacing `CODE` with the temporary value.
5. Run `enrollConfiguredGroup`. The function stores the group identifier and deletes the temporary enrollment code without logging the identifier.
6. Deploy the Apps Script project as a web app that executes as the owner and permits `Anyone` access.
7. Store the `/exec` deployment URL in `TELEGRAM_WEBHOOK_URL`.
8. Generate a private 24 to 128 character random value and store it in `TELEGRAM_WEBHOOK_SECRET`.
9. Run `configureBotCommands`, `configureTelegramWebhook`, and `verifyTelegramWebhook`.
10. Run `installMaintenanceTrigger` and confirm that one trigger runs `runScheduledTasks` every minute.
11. Disable privacy mode through BotFather so the webhook receives the latest group updates.
12. Grant the bot administrator status with only `Pin Messages` enabled.
13. Keep `WELCOME_ENABLED` unset or set to `false` until the organizer approves automated welcomes.
14. Verify commands privately before performing any labeled live-group acceptance test.

The active Script Properties are:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_GROUP_CHAT_ID`
- `LAST_UPDATE_ID`
- `TODAY_SCHEDULE_DATE`
- `TODAY_SCHEDULE_TEXT`
- `REMINDERS_JSON`
- `LAST_WELCOME_AT`
- `WELCOME_PENDING`
- `WELCOME_ENABLED`
- `LAST_POLL_AT`
- `LAST_MAINTENANCE_AT`
- `LAST_GROUP_ACTIVITY_AT`
- `LAST_ERROR_AT`
- `TELEGRAM_WEBHOOK_URL`
- `TELEGRAM_WEBHOOK_SECRET`

`TELEGRAM_ENROLLMENT_CODE` is temporary and is deleted after group enrollment.

## BotFather configuration

Use the official BotFather account.

### Profile avatar handoff

Use `scripts/telegram-bot/handoff/kvj-mitra-bot-avatar.png` when BotFather needs the approved profile image. Keep this file in the bot operations directory. It is intentionally outside `src/` and `public/`, and the production privacy check rejects both its filename and exact image bytes.

- Display name: `KVJ Satsanga Mitra`
- Username: `KVJ_MitraBot`
- Privacy mode: disabled for near-real-time group update delivery
- Group joining: enabled
- About: `KVJ group helper for welcomes, rules, class notices, reminders, and registration.`
- Description: `KVJ Satsanga Mitra supports group operations for Krishnam Vande Jagadgurum. Use commands for group guidance, today's class notices, reminders, registration, and help. It does not provide spiritual advice or replace the teacher or administrators.`

If the requested username is unavailable, stop. Do not create a fallback username without user approval.

## Operating model

Telegram sends updates to the Apps Script `doPost` webhook. This normally handles commands within seconds. The webhook:

- processes each update idempotently
- accepts updates only for the configured group and private administrator chats
- checks current group administrators before executing an administrative command
- processes administrator-only private commands without exposing group identifiers
- records only the latest group activity timestamp for ordinary messages
- ignores ordinary message content without storing text, history, names, or member profiles
- formats every Telegram message with the approved Telugu greeting and signature

The one-minute `runScheduledTasks` trigger sends due reminders and handles welcome batching. Welcome messages remain disabled unless `WELCOME_ENABLED` is explicitly set to `true`. The existing Translator bot remains responsible for translation.

The legacy `pollTelegram` function remains available only for recovery after removing the webhook. Telegram does not permit `getUpdates` polling while a webhook is active.

## Administrator commands

Use India Standard Time for reminders.

```text
/set_today <class notice>
/announce <announcement text>
/remind YYYY-MM-DD HH:MM <reminder text>
/cancel_reminder <reminder ID>
/status
```

Private administrator commands keep control text out of the group. A group administrator must start a private chat with the bot before sending private commands.

`/set_today` publishes the class notice to the configured group and pins it without a notification. Use it only when the organizer is ready to publish the notice.

## Recovery

- Webhook stopped: run `verifyTelegramWebhook`, inspect the Apps Script Executions page, and confirm the active web app deployment still uses the current code.
- Group replies fail: confirm the bot remains an administrator with `Pin Messages` as its only optional privilege.
- Duplicate or legacy triggers: run `installMaintenanceTrigger`. It removes existing bot triggers before creating one `runScheduledTasks` trigger.
- Wrong group configured: remove `TELEGRAM_GROUP_CHAT_ID`, run `createEnrollmentCode`, and repeat the enrollment steps in the approved group.
- Token rotated: replace `TELEGRAM_BOT_TOKEN`, then run `configureBotCommands` and `configureTelegramWebhook`.
- Pause command handling: run `removeTelegramWebhook`. This preserves operational state.
- Restore polling temporarily: run `removeTelegramWebhook`, then `installPollingTrigger`. Do not leave polling and webhook delivery enabled together.

## Verification

Before deployment:

```bash
npm run test:telegram-bot
node --check < scripts/telegram-bot/Code.gs
npm run check
npm run build
```

After deployment, confirm:

1. `verifyTelegramWebhook` confirms the webhook with no unexpected backlog.
2. An administrator can run `/status` privately and receive a response with the approved greeting and signature.
3. `/today` reports that no notice is set until an administrator uses `/set_today`.
4. A non-administrator cannot run `/status`.
5. Ordinary messages produce no bot response and no stored message text.
6. A command in another group produces no response.
7. `/set_today` publishes and pins one class notice when the organizer intentionally uses it.
8. The public website contains no bot username, group identifier, token, invite link, or private Telegram detail.

## Activation state

As of September 19, 2026:

- BotFather identity, profile, commands, and group joining are configured.
- The standalone Apps Script project is active and the approved group is enrolled.
- The web app deployment, Telegram webhook, and one-minute `runScheduledTasks` maintenance trigger are active.
- BotFather privacy mode is disabled for current-update delivery.
- The bot's selectable administrator rights are restricted to `Pin Messages`. Telegram shows `Change Group Info` as inherited from the group's member permissions and disables its switch in the bot editor. The bot code does not call group-edit APIs.
- A private `/status` check returned through the webhook within seconds with the required Telugu message envelope.
- The source supports quiet observation of ordinary messages, pinned class notices, and the required Telugu message envelope.
- Automated welcome messages are disabled by default.
- Group messages and announcements remain deferred until the organizer chooses to publish them.
