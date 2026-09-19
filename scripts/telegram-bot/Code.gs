const BOT_USERNAME = 'KVJ_MitraBot';
const TIME_ZONE = 'Asia/Kolkata';
const SITE_URL = 'https://m0k0ut.github.io/kvj-satsang/';
const REGISTRATION_URL = SITE_URL + 'register/';
const MAX_COMMAND_TEXT = 2500;
const MAX_REMINDERS = 25;
const WELCOME_COOLDOWN_MS = 10 * 60 * 1000;
const MESSAGE_GREETING = 'జై శ్రీ మన్నారాయణ🙏🙏';
const MESSAGE_SIGNATURE = '<b>కృష్ణం వందే జగద్గురుం 🪷🪄📖</b>';

const PROPERTY_KEYS = Object.freeze({
  TOKEN: 'TELEGRAM_BOT_TOKEN',
  GROUP_ID: 'TELEGRAM_GROUP_CHAT_ID',
  LAST_UPDATE_ID: 'LAST_UPDATE_ID',
  TODAY_DATE: 'TODAY_SCHEDULE_DATE',
  TODAY_TEXT: 'TODAY_SCHEDULE_TEXT',
  REMINDERS: 'REMINDERS_JSON',
  LAST_WELCOME_AT: 'LAST_WELCOME_AT',
  WELCOME_PENDING: 'WELCOME_PENDING',
  WELCOME_ENABLED: 'WELCOME_ENABLED',
  LAST_POLL_AT: 'LAST_POLL_AT',
  LAST_MAINTENANCE_AT: 'LAST_MAINTENANCE_AT',
  LAST_GROUP_ACTIVITY_AT: 'LAST_GROUP_ACTIVITY_AT',
  LAST_ERROR_AT: 'LAST_ERROR_AT',
  ENROLLMENT_CODE: 'TELEGRAM_ENROLLMENT_CODE',
  WEBHOOK_URL: 'TELEGRAM_WEBHOOK_URL',
  WEBHOOK_SECRET: 'TELEGRAM_WEBHOOK_SECRET'
});

const MEMBER_COMMANDS = Object.freeze([
  { command: 'start', description: 'Introduction and privacy limits' },
  { command: 'help', description: 'Show available commands' },
  { command: 'rules', description: 'Show group participation guidance' },
  { command: 'today', description: "Show today's class notice" },
  { command: 'register', description: 'Open class registration' },
  { command: 'site', description: 'Open the official KVJ website' },
  { command: 'privacy', description: 'Explain what the bot reads and stores' }
]);

const ADMIN_COMMANDS = Object.freeze([
  ...MEMBER_COMMANDS,
  { command: 'set_today', description: "Set today's class notice" },
  { command: 'announce', description: 'Publish a group announcement' },
  { command: 'remind', description: 'Schedule a one-time IST reminder' },
  { command: 'cancel_reminder', description: 'Cancel a pending reminder' },
  { command: 'status', description: 'Show bot operating status' }
]);

function pollTelegram() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;

  const properties = scriptProperties_();
  try {
    requireRuntimeConfig_(properties);
    const lastUpdateId = numberProperty_(properties, PROPERTY_KEYS.LAST_UPDATE_ID, 0);
    const updates = telegramApi_('getUpdates', {
      offset: lastUpdateId + 1,
      limit: 100,
      timeout: 0,
      allowed_updates: ['message']
    });

    processUpdates_(updates, properties);
    flushWelcome_(properties, new Date());
    processDueReminders_(properties, new Date());
    properties.setProperty(PROPERTY_KEYS.LAST_POLL_AT, istTimestamp_(new Date()));
    properties.deleteProperty(PROPERTY_KEYS.LAST_ERROR_AT);
  } catch (error) {
    properties.setProperty(PROPERTY_KEYS.LAST_ERROR_AT, istTimestamp_(new Date()));
    console.error('Telegram bot polling failed. Review the Apps Script execution record.');
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  const properties = scriptProperties_();
  const expectedSecret = properties.getProperty(PROPERTY_KEYS.WEBHOOK_SECRET);
  const receivedSecret = e && e.parameter && e.parameter.secret;
  if (!expectedSecret || receivedSecret !== expectedSecret) return textOutput_('ignored');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('webhook_busy');

  try {
    requireRuntimeConfig_(properties);
    const contents = e && e.postData && e.postData.contents;
    if (!contents) return textOutput_('ignored');

    const update = JSON.parse(contents);
    processUpdates_([update], properties);
    properties.setProperty(PROPERTY_KEYS.LAST_POLL_AT, istTimestamp_(new Date()));
    properties.deleteProperty(PROPERTY_KEYS.LAST_ERROR_AT);
    return textOutput_('ok');
  } catch (error) {
    properties.setProperty(PROPERTY_KEYS.LAST_ERROR_AT, istTimestamp_(new Date()));
    console.error('Telegram webhook processing failed. Review the Apps Script execution record.');
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function runScheduledTasks() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;

  const properties = scriptProperties_();
  try {
    requireRuntimeConfig_(properties);
    const now = new Date();
    flushWelcome_(properties, now);
    processDueReminders_(properties, now);
    properties.setProperty(PROPERTY_KEYS.LAST_MAINTENANCE_AT, istTimestamp_(now));
    properties.deleteProperty(PROPERTY_KEYS.LAST_ERROR_AT);
  } catch (error) {
    properties.setProperty(PROPERTY_KEYS.LAST_ERROR_AT, istTimestamp_(new Date()));
    console.error('Telegram scheduled maintenance failed. Review the Apps Script execution record.');
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function processUpdates_(updates, properties) {
  const orderedUpdates = Array.isArray(updates)
    ? updates.slice().sort((a, b) => Number(a.update_id) - Number(b.update_id))
    : [];

  for (const update of orderedUpdates) {
    const updateId = Number(update && update.update_id);
    if (!Number.isFinite(updateId)) continue;

    const lastProcessed = numberProperty_(properties, PROPERTY_KEYS.LAST_UPDATE_ID, 0);
    if (updateId <= lastProcessed) continue;

    handleUpdate_(update, properties);
    properties.setProperty(PROPERTY_KEYS.LAST_UPDATE_ID, String(updateId));
  }
}

function handleUpdate_(update, properties) {
  const message = update && update.message;
  if (!message || !message.chat) return;

  const configuredGroupId = properties.getProperty(PROPERTY_KEYS.GROUP_ID);
  if (!configuredGroupId) return;

  const chatId = String(message.chat.id);
  const isConfiguredGroup = chatId === configuredGroupId;
  const isPrivateChat = message.chat.type === 'private';

  if (!isConfiguredGroup && !isPrivateChat) return;

  if (isConfiguredGroup) {
    properties.setProperty(PROPERTY_KEYS.LAST_GROUP_ACTIVITY_AT, istTimestamp_(new Date()));
    if (hasHumanNewMembers_(message)) {
      properties.setProperty(PROPERTY_KEYS.WELCOME_PENDING, '1');
    }
  }

  const parsed = parseCommand_(message.text || '');
  if (!parsed) return;

  const userId = message.from && message.from.id;
  if (!userId) return;

  const isAdminCommand = isAdminCommand_(parsed.command);
  let isAdmin = false;
  if (isPrivateChat || isAdminCommand) {
    isAdmin = isGroupAdministrator_(configuredGroupId, userId);
  }

  if (isPrivateChat && !isAdmin) {
    sendMessage_(chatId, 'This bot accepts private commands from KVJ administrators only.');
    return;
  }

  if (isAdminCommand && !isAdmin) {
    sendMessage_(chatId, 'This command is available to KVJ group administrators only.');
    return;
  }

  routeCommand_(parsed, {
    replyChatId: chatId,
    groupChatId: configuredGroupId,
    properties: properties,
    isPrivateChat: isPrivateChat
  });
}

function routeCommand_(parsed, context) {
  const command = parsed.command;
  const args = parsed.args;
  const replyChatId = context.replyChatId;
  const groupChatId = context.groupChatId;
  const properties = context.properties;

  switch (command) {
    case 'start':
      sendMessage_(replyChatId, startText_());
      return;
    case 'help':
      sendMessage_(replyChatId, helpText_());
      return;
    case 'rules':
      sendMessage_(replyChatId, rulesText_());
      return;
    case 'today':
      sendMessage_(replyChatId, todayText_(properties, new Date()));
      return;
    case 'register':
      sendMessage_(replyChatId, '<b>Class registration</b>\n\n' + escapeHtml_(REGISTRATION_URL));
      return;
    case 'site':
      sendMessage_(replyChatId, '<b>Official KVJ website</b>\n\n' + escapeHtml_(SITE_URL));
      return;
    case 'privacy':
      sendMessage_(replyChatId, privacyText_());
      return;
    case 'set_today':
      setToday_(replyChatId, groupChatId, args, properties, new Date(), context.isPrivateChat);
      return;
    case 'announce':
      announce_(replyChatId, groupChatId, args, context.isPrivateChat);
      return;
    case 'remind':
      createReminder_(replyChatId, args, properties, new Date());
      return;
    case 'cancel_reminder':
      cancelReminder_(replyChatId, args, properties);
      return;
    case 'status':
      sendMessage_(replyChatId, statusText_(properties, new Date()));
      return;
    default:
      sendMessage_(replyChatId, 'Unknown command. Use /help to see available commands.');
  }
}

function setToday_(replyChatId, groupChatId, args, properties, now, isPrivateChat) {
  const text = cleanCommandText_(args, 1500);
  if (!text) {
    sendMessage_(replyChatId, 'Usage: /set_today &lt;class notice&gt;');
    return;
  }

  properties.setProperty(PROPERTY_KEYS.TODAY_DATE, istDate_(now));
  properties.setProperty(PROPERTY_KEYS.TODAY_TEXT, text);
  const postedMessage = sendMessage_(groupChatId, todayNoticeHtml_(text));
  if (!postedMessage || !postedMessage.message_id) throw new Error('class_notice_message_missing');
  telegramApi_('pinChatMessage', {
    chat_id: groupChatId,
    message_id: postedMessage.message_id,
    disable_notification: true
  });
  if (isPrivateChat) {
    sendMessage_(replyChatId, "Today's class notice was published and pinned until midnight IST.");
  }
}

function announce_(replyChatId, groupChatId, args, isPrivateChat) {
  const text = cleanCommandText_(args, MAX_COMMAND_TEXT);
  if (!text) {
    sendMessage_(replyChatId, 'Usage: /announce &lt;announcement text&gt;');
    return;
  }

  sendMessage_(groupChatId, '<b>KVJ Announcement</b>\n\n' + escapeHtml_(text));
  if (isPrivateChat) sendMessage_(replyChatId, 'Announcement published to the KVJ group.');
}

function createReminder_(chatId, args, properties, now) {
  const parsed = parseReminderArgs_(args);
  if (!parsed) {
    sendMessage_(chatId, 'Usage: /remind YYYY-MM-DD HH:MM &lt;reminder text&gt;');
    return;
  }

  const currentMinute = istTimestamp_(now);
  if (parsed.dueAt <= currentMinute) {
    sendMessage_(chatId, 'The reminder time must be in the future and use IST.');
    return;
  }

  const reminders = loadReminders_(properties);
  if (reminders.length >= MAX_REMINDERS) {
    sendMessage_(chatId, 'The reminder limit has been reached. Cancel an existing reminder first.');
    return;
  }

  const reminder = {
    id: Utilities.getUuid().replace(/-/g, '').slice(0, 8),
    dueAt: parsed.dueAt,
    text: parsed.text
  };
  reminders.push(reminder);
  reminders.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  saveReminders_(properties, reminders);

  sendMessage_(
    chatId,
    '<b>Reminder scheduled</b>\n\n' +
      'ID: <code>' + escapeHtml_(reminder.id) + '</code>\n' +
      'Time: ' + escapeHtml_(reminder.dueAt) + ' IST'
  );
}

function cancelReminder_(chatId, args, properties) {
  const reminderId = String(args || '').trim();
  if (!/^[a-f0-9]{8}$/i.test(reminderId)) {
    sendMessage_(chatId, 'Usage: /cancel_reminder &lt;reminder ID&gt;');
    return;
  }

  const reminders = loadReminders_(properties);
  const remaining = reminders.filter((item) => item.id !== reminderId);
  if (remaining.length === reminders.length) {
    sendMessage_(chatId, 'No pending reminder was found with that ID.');
    return;
  }

  saveReminders_(properties, remaining);
  sendMessage_(chatId, 'Reminder <code>' + escapeHtml_(reminderId) + '</code> was cancelled.');
}

function processDueReminders_(properties, now) {
  const groupChatId = properties.getProperty(PROPERTY_KEYS.GROUP_ID);
  if (!groupChatId) return;

  const currentMinute = istTimestamp_(now);
  const reminders = loadReminders_(properties);
  let pending = reminders.slice();

  for (const reminder of reminders) {
    if (reminder.dueAt <= currentMinute) {
      sendMessage_(
        groupChatId,
        '<b>KVJ Reminder</b>\n\n' + escapeHtml_(reminder.text) +
          '\n\n<i>Scheduled for ' + escapeHtml_(reminder.dueAt) + ' IST</i>'
      );
      pending = pending.filter((item) => item.id !== reminder.id);
      saveReminders_(properties, pending);
    }
  }
}

function flushWelcome_(properties, now) {
  if (properties.getProperty(PROPERTY_KEYS.WELCOME_PENDING) !== '1') return;
  if (properties.getProperty(PROPERTY_KEYS.WELCOME_ENABLED) !== 'true') {
    properties.deleteProperty(PROPERTY_KEYS.WELCOME_PENDING);
    return;
  }

  const lastWelcomeAt = numberProperty_(properties, PROPERTY_KEYS.LAST_WELCOME_AT, 0);
  if (now.getTime() - lastWelcomeAt < WELCOME_COOLDOWN_MS) return;

  const groupChatId = properties.getProperty(PROPERTY_KEYS.GROUP_ID);
  if (!groupChatId) return;

  sendMessage_(
    groupChatId,
    '<b>Welcome to Krishnam Vande Jagadgurum.</b>\n\n' +
      'Please use /rules for participation guidance and /help for available commands.'
  );
  properties.setProperty(PROPERTY_KEYS.LAST_WELCOME_AT, String(now.getTime()));
  properties.deleteProperty(PROPERTY_KEYS.WELCOME_PENDING);
}

function configureBotCommands() {
  requireToken_(scriptProperties_());
  telegramApi_('setMyCommands', {
    scope: { type: 'all_group_chats' },
    commands: MEMBER_COMMANDS
  });
  telegramApi_('setMyCommands', {
    scope: { type: 'all_chat_administrators' },
    commands: ADMIN_COMMANDS
  });
  return 'Bot command menus configured.';
}

function configureTelegramWebhook() {
  const properties = scriptProperties_();
  requireRuntimeConfig_(properties);
  const webAppUrl = String(properties.getProperty(PROPERTY_KEYS.WEBHOOK_URL) || '').trim();
  const secret = String(properties.getProperty(PROPERTY_KEYS.WEBHOOK_SECRET) || '').trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(webAppUrl)) {
    throw new Error('webhook_url_invalid');
  }
  if (!/^[A-Za-z0-9_-]{24,128}$/.test(secret)) throw new Error('webhook_secret_invalid');

  telegramApi_('setWebhook', {
    url: webAppUrl + '?secret=' + encodeURIComponent(secret),
    allowed_updates: ['message'],
    drop_pending_updates: false
  });
  return 'Telegram webhook configured.';
}

function removeTelegramWebhook() {
  requireToken_(scriptProperties_());
  telegramApi_('deleteWebhook', { drop_pending_updates: false });
  return 'Telegram webhook removed.';
}

function verifyTelegramWebhook() {
  const info = telegramApi_('getWebhookInfo', {});
  if (!info || !info.url) throw new Error('webhook_not_configured');
  return 'Telegram webhook is active. Pending updates: ' + Number(info.pending_update_count || 0) + '.';
}

function verifyBotConnection() {
  const bot = telegramApi_('getMe', {});
  if (!bot || bot.username !== BOT_USERNAME) throw new Error('unexpected_bot_identity');
  return 'Bot API connection verified.';
}

function diagnoseBotConnection() {
  const token = requireToken_(scriptProperties_());
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getMe', {
    muteHttpExceptions: true
  });
  console.log('Telegram getMe status: ' + response.getResponseCode());
}

function diagnoseGroupSend() {
  const properties = scriptProperties_();
  requireRuntimeConfig_(properties);
  const token = requireToken_(properties);
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: properties.getProperty(PROPERTY_KEYS.GROUP_ID),
      text: formatBotMessage_('<b>KVJ Satsanga Mitra commands</b>\n\nUse /help to see available commands.'),
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });

  let description = 'unavailable';
  try {
    const body = JSON.parse(response.getContentText());
    if (body && typeof body.description === 'string') {
      description = body.description.replace(/[^a-z0-9 _.:()-]/gi, '').slice(0, 160);
    }
  } catch (error) {
    description = 'invalid_response';
  }
  console.log('Telegram sendMessage status: ' + response.getResponseCode() + '; ' + description);
}

function installPollingTrigger() {
  requireRuntimeConfig_(scriptProperties_());
  removePollingTriggers_();
  ScriptApp.newTrigger('pollTelegram').timeBased().everyMinutes(1).create();
  return 'One-minute polling trigger installed.';
}

function installMaintenanceTrigger() {
  requireRuntimeConfig_(scriptProperties_());
  removeBotTriggers_();
  ScriptApp.newTrigger('runScheduledTasks').timeBased().everyMinutes(1).create();
  return 'One-minute scheduled maintenance trigger installed.';
}

function removePollingTrigger() {
  const removed = removePollingTriggers_();
  return 'Removed ' + removed + ' polling trigger(s).';
}

function removePollingTriggers_() {
  let removed = 0;
  for (const trigger of ScriptApp.getProjectTriggers()) {
    if (trigger.getHandlerFunction() === 'pollTelegram') {
      ScriptApp.deleteTrigger(trigger);
      removed += 1;
    }
  }
  return removed;
}

function removeBotTriggers_() {
  let removed = 0;
  for (const trigger of ScriptApp.getProjectTriggers()) {
    if (['pollTelegram', 'runScheduledTasks'].includes(trigger.getHandlerFunction())) {
      ScriptApp.deleteTrigger(trigger);
      removed += 1;
    }
  }
  return removed;
}

function createEnrollmentCode() {
  const properties = scriptProperties_();
  requireToken_(properties);
  if (properties.getProperty(PROPERTY_KEYS.GROUP_ID)) {
    throw new Error('group_already_configured');
  }

  const code = Utilities.getUuid().replace(/-/g, '').slice(0, 12);
  properties.setProperty(PROPERTY_KEYS.ENROLLMENT_CODE, code);
  return code;
}

function enrollConfiguredGroup() {
  const properties = scriptProperties_();
  requireToken_(properties);
  if (properties.getProperty(PROPERTY_KEYS.GROUP_ID)) {
    throw new Error('group_already_configured');
  }

  const enrollmentCode = properties.getProperty(PROPERTY_KEYS.ENROLLMENT_CODE);
  if (!enrollmentCode) throw new Error('enrollment_code_missing');

  const lastUpdateId = numberProperty_(properties, PROPERTY_KEYS.LAST_UPDATE_ID, 0);
  const updates = telegramApi_('getUpdates', {
    offset: lastUpdateId + 1,
    limit: 100,
    timeout: 0,
    allowed_updates: ['message']
  });

  let match = null;
  let newestUpdateId = lastUpdateId;
  for (const update of updates) {
    const updateId = Number(update && update.update_id);
    if (Number.isFinite(updateId)) newestUpdateId = Math.max(newestUpdateId, updateId);
    const message = update && update.message;
    if (!message || !message.chat || !['group', 'supergroup'].includes(message.chat.type)) continue;
    const parsed = parseCommand_(message.text || '');
    if (!parsed || parsed.command !== 'start') continue;
    if (parsed.args === 'enroll ' + enrollmentCode) match = message;
  }

  if (!match) throw new Error('matching_enrollment_command_not_found');

  properties.setProperty(PROPERTY_KEYS.GROUP_ID, String(match.chat.id));
  properties.setProperty(PROPERTY_KEYS.LAST_UPDATE_ID, String(newestUpdateId));
  properties.deleteProperty(PROPERTY_KEYS.ENROLLMENT_CODE);
  return 'Group enrollment complete. The group identifier remains in Script Properties.';
}

function parseCommand_(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed.startsWith('/')) return null;

  const match = trimmed.match(/^\/([a-z0-9_]{1,32})(?:@([a-z0-9_]{5,32}))?(?:\s+([\s\S]*))?$/i);
  if (!match) return null;
  if (match[2] && match[2].toLowerCase() !== BOT_USERNAME.toLowerCase()) return null;

  return {
    command: match[1].toLowerCase(),
    args: String(match[3] || '').trim()
  };
}

function parseReminderArgs_(args) {
  const match = String(args || '').trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+([\s\S]+)$/);
  if (!match) return null;

  const dueAt = match[1] + ' ' + match[2];
  const text = cleanCommandText_(match[3], MAX_COMMAND_TEXT);
  if (!text || !isValidIstTimestamp_(dueAt)) return null;
  return { dueAt: dueAt, text: text };
}

function isValidIstTimestamp_(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (year < 2020 || month < 1 || month > 12 || hour > 23 || minute > 59) return false;
  return day >= 1 && day <= daysInMonth_(year, month);
}

function daysInMonth_(year, month) {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isAdminCommand_(command) {
  return ['set_today', 'announce', 'remind', 'cancel_reminder', 'status'].includes(command);
}

function isGroupAdministrator_(groupChatId, userId) {
  const administrators = telegramApi_('getChatAdministrators', { chat_id: groupChatId });
  return administrators.some((entry) => entry && entry.user && String(entry.user.id) === String(userId));
}

function hasHumanNewMembers_(message) {
  return Array.isArray(message.new_chat_members) && message.new_chat_members.some((member) => !member.is_bot);
}

function todayText_(properties, now) {
  const date = properties.getProperty(PROPERTY_KEYS.TODAY_DATE);
  const text = properties.getProperty(PROPERTY_KEYS.TODAY_TEXT);
  if (date !== istDate_(now) || !text) {
    properties.deleteProperty(PROPERTY_KEYS.TODAY_DATE);
    properties.deleteProperty(PROPERTY_KEYS.TODAY_TEXT);
    return "No class notice has been set for today. Please follow the administrators' current announcements.";
  }
  return todayNoticeHtml_(text);
}

function todayNoticeHtml_(text) {
  return "<b>Today's class notice</b>\n\n" + escapeHtml_(text) + '\n\n<i>India Standard Time</i>';
}

function statusText_(properties, now) {
  const hasTodayNotice = properties.getProperty(PROPERTY_KEYS.TODAY_DATE) === istDate_(now) &&
    Boolean(properties.getProperty(PROPERTY_KEYS.TODAY_TEXT));
  const reminders = loadReminders_(properties);
  const lastPollAt = properties.getProperty(PROPERTY_KEYS.LAST_POLL_AT) || 'Not recorded yet';
  const lastMaintenanceAt = properties.getProperty(PROPERTY_KEYS.LAST_MAINTENANCE_AT) || 'Not recorded yet';
  const lastGroupActivityAt = properties.getProperty(PROPERTY_KEYS.LAST_GROUP_ACTIVITY_AT) || 'Not recorded yet';
  const lastErrorAt = properties.getProperty(PROPERTY_KEYS.LAST_ERROR_AT) || 'None';

  return '<b>KVJ Satsanga Mitra status</b>\n\n' +
    'Last processed update: ' + escapeHtml_(lastPollAt) + ' IST\n' +
    'Last scheduled maintenance: ' + escapeHtml_(lastMaintenanceAt) + ' IST\n' +
    'Last group activity: ' + escapeHtml_(lastGroupActivityAt) + ' IST\n' +
    "Today's notice: " + (hasTodayNotice ? 'Set' : 'Not set') + '\n' +
    'Pending reminders: ' + reminders.length + '\n' +
    'Last delivery error: ' + escapeHtml_(lastErrorAt) + (lastErrorAt === 'None' ? '' : ' IST');
}

function startText_() {
  return '<b>KVJ Satsanga Mitra</b>\n\n' +
    'I support group operations for Krishnam Vande Jagadgurum. I provide guidance, class notices, reminders, registration, and help. ' +
    'I do not provide spiritual advice or replace the teacher or administrators.\n\nUse /help to see available commands.';
}

function helpText_() {
  return '<b>KVJ Satsanga Mitra commands</b>\n\n' +
    '/rules - Group participation guidance\n' +
    "/today - Today's class notice\n" +
    '/register - Class registration\n' +
    '/site - Official KVJ website\n' +
    '/privacy - Bot privacy information\n' +
    '/help - This command list';
}

function rulesText_() {
  return '<b>Group participation guidance</b>\n\n' +
    '1. Keep messages respectful and relevant to the satsangam.\n' +
    '2. Follow the teacher and administrators for current class guidance.\n' +
    '3. Do not share member information or group-only material outside the group without permission.\n' +
    '4. Use /today for the organizer-maintained class notice.';
}

function privacyText_() {
  return '<b>Bot privacy</b>\n\n' +
    'This bot receives messages in the configured KVJ group so commands can be handled promptly. ' +
    'It inspects each update only long enough to route authorized commands and record the latest group activity time. ' +
    'It ignores ordinary conversation and does not store message text, message history, member profiles, names, phone numbers, or invite links. ' +
    'It stores only operational settings, the current class notice, pending reminders, and delivery state.';
}

function loadReminders_(properties) {
  const raw = properties.getProperty(PROPERTY_KEYS.REMINDERS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) =>
      item &&
      /^[a-f0-9]{8}$/i.test(String(item.id || '')) &&
      isValidIstTimestamp_(item.dueAt) &&
      typeof item.text === 'string' &&
      item.text.length > 0 &&
      item.text.length <= MAX_COMMAND_TEXT
    ).slice(0, MAX_REMINDERS);
  } catch (error) {
    return [];
  }
}

function saveReminders_(properties, reminders) {
  properties.setProperty(PROPERTY_KEYS.REMINDERS, JSON.stringify(reminders.slice(0, MAX_REMINDERS)));
}

function sendMessage_(chatId, html) {
  return telegramApi_('sendMessage', {
    chat_id: chatId,
    text: formatBotMessage_(html),
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });
}

function formatBotMessage_(html) {
  return MESSAGE_GREETING + '\n\n' + String(html || '') + '\n\n' + MESSAGE_SIGNATURE;
}

function textOutput_(value) {
  return ContentService.createTextOutput(String(value || '')).setMimeType(ContentService.MimeType.TEXT);
}

function telegramApi_(method, payload) {
  const token = requireToken_(scriptProperties_());
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/' + method, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) throw new Error('telegram_api_error');

  let body;
  try {
    body = JSON.parse(response.getContentText());
  } catch (error) {
    throw new Error('telegram_api_invalid_response');
  }
  if (!body || body.ok !== true) throw new Error('telegram_api_rejected_request');
  return body.result;
}

function requireRuntimeConfig_(properties) {
  requireToken_(properties);
  if (!properties.getProperty(PROPERTY_KEYS.GROUP_ID)) throw new Error('group_not_configured');
}

function requireToken_(properties) {
  const token = properties.getProperty(PROPERTY_KEYS.TOKEN);
  if (!token) throw new Error('telegram_token_missing');
  return token;
}

function scriptProperties_() {
  return PropertiesService.getScriptProperties();
}

function numberProperty_(properties, key, fallback) {
  const value = Number(properties.getProperty(key));
  return Number.isFinite(value) ? value : fallback;
}

function cleanCommandText_(value, maxLength) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function istDate_(date) {
  return Utilities.formatDate(date, TIME_ZONE, 'yyyy-MM-dd');
}

function istTimestamp_(date) {
  return Utilities.formatDate(date, TIME_ZONE, 'yyyy-MM-dd HH:mm');
}
