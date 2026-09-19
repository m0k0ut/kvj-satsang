import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./Code.gs', import.meta.url), 'utf8');

function createHarness() {
  const values = new Map([['TELEGRAM_BOT_TOKEN', 'test-token']]);
  const requests = [];
  let getUpdatesResult = [];
  let administrators = [];
  let failNextSend = false;
  let messageId = 100;

  const properties = {
    getProperty(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setProperty(key, value) {
      values.set(key, String(value));
      return this;
    },
    deleteProperty(key) {
      values.delete(key);
      return this;
    }
  };

  const sandbox = {
    console: { error() {} },
    Date,
    JSON,
    Math,
    Number,
    Object,
    String,
    Array,
    RegExp,
    PropertiesService: { getScriptProperties: () => properties },
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock() {} })
    },
    ScriptApp: {
      getProjectTriggers: () => [],
      deleteTrigger() {},
      newTrigger: () => ({
        timeBased: () => ({
          everyMinutes: () => ({ create() {} })
        })
      })
    },
    ContentService: {
      MimeType: { TEXT: 'text/plain' },
      createTextOutput(value) {
        return {
          value,
          mimeType: null,
          setMimeType(mimeType) {
            this.mimeType = mimeType;
            return this;
          }
        };
      }
    },
    Utilities: {
      getUuid: () => 'abcdef12-3456-7890-abcd-ef1234567890',
      formatDate(date, zone, format) {
        assert.equal(zone, 'Asia/Kolkata');
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: zone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23'
        }).formatToParts(date);
        const part = (type) => parts.find((item) => item.type === type).value;
        const day = `${part('year')}-${part('month')}-${part('day')}`;
        return format === 'yyyy-MM-dd' ? day : `${day} ${part('hour')}:${part('minute')}`;
      }
    },
    UrlFetchApp: {
      fetch(url, options) {
        const method = url.split('/').at(-1);
        const payload = JSON.parse(options.payload || '{}');
        requests.push({ method, payload });

        if (method === 'sendMessage' && failNextSend) {
          failNextSend = false;
          return response(500, { ok: false });
        }
        if (method === 'sendMessage') {
          messageId += 1;
          return response(200, { ok: true, result: { message_id: messageId } });
        }
        if (method === 'getUpdates') return response(200, { ok: true, result: getUpdatesResult });
        if (method === 'getChatAdministrators') return response(200, { ok: true, result: administrators });
        return response(200, { ok: true, result: true });
      }
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'Code.gs' });

  return {
    bot: sandbox,
    properties,
    values,
    requests,
    setUpdates(value) { getUpdatesResult = value; },
    setAdministrators(value) { administrators = value; },
    failNextSend() { failNextSend = true; }
  };
}

function response(code, body) {
  return {
    getResponseCode: () => code,
    getContentText: () => JSON.stringify(body)
  };
}

function sentMessages(harness) {
  return harness.requests.filter((request) => request.method === 'sendMessage');
}

function assertWrapped(message) {
  assert.match(message.payload.text, /^జై శ్రీ మన్నారాయణ🙏🙏\n\n/);
  assert.match(message.payload.text, /\n\n<b>కృష్ణం వందే జగద్గురుం 🪷🪄📖<\/b>$/);
}

{
  const { bot } = createHarness();
  assert.deepEqual(
    JSON.parse(JSON.stringify(bot.parseCommand_('/today@KVJ_MitraBot'))),
    { command: 'today', args: '' }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(bot.parseCommand_('/set_today Morning class'))),
    { command: 'set_today', args: 'Morning class' }
  );
  assert.equal(bot.parseCommand_('ordinary conversation'), null);
  assert.equal(bot.parseCommand_('/today@AnotherBot'), null);
  assert.equal(bot.escapeHtml_('<b>&"'), '&lt;b&gt;&amp;&quot;');
}

{
  const { bot } = createHarness();
  assert.equal(bot.isValidIstTimestamp_('2028-02-29 23:59'), true);
  assert.equal(bot.isValidIstTimestamp_('2027-02-29 12:00'), false);
  assert.equal(bot.isValidIstTimestamp_('2027-04-31 12:00'), false);
  assert.equal(bot.isValidIstTimestamp_('2027-04-30 24:00'), false);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TODAY_SCHEDULE_DATE', '2026-09-16');
  values.set('TODAY_SCHEDULE_TEXT', 'Old notice');
  const text = bot.todayText_(properties, new Date('2026-09-17T04:00:00Z'));
  assert.match(text, /No class notice/);
  assert.equal(values.has('TODAY_SCHEDULE_TEXT'), false);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  bot.handleUpdate_({
    update_id: 1,
    message: { chat: { id: '-2002', type: 'supergroup' }, from: { id: 4 }, text: '/help' }
  }, properties);
  bot.handleUpdate_({
    update_id: 2,
    message: { chat: { id: '-1001', type: 'supergroup' }, from: { id: 4 }, text: 'hello' }
  }, properties);
  assert.equal(sentMessages(harness).length, 0);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  harness.setAdministrators([{ user: { id: 10 } }]);
  bot.handleUpdate_({
    update_id: 3,
    message: { chat: { id: '-1001', type: 'supergroup' }, from: { id: 20 }, text: '/status' }
  }, properties);
  const messages = sentMessages(harness);
  assert.equal(messages.length, 1);
  assert.match(messages[0].payload.text, /administrators only/);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  values.set('WELCOME_ENABLED', 'true');
  bot.handleUpdate_({
    update_id: 4,
    message: {
      chat: { id: '-1001', type: 'supergroup' },
      from: { id: 10 },
      new_chat_members: [{ id: 21, is_bot: false }, { id: 22, is_bot: false }]
    }
  }, properties);
  bot.flushWelcome_(properties, new Date('2026-09-17T04:00:00Z'));
  bot.flushWelcome_(properties, new Date('2026-09-17T04:01:00Z'));
  assert.equal(sentMessages(harness).length, 1);
  assert.doesNotMatch(sentMessages(harness)[0].payload.text, /21|22/);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  values.set('WELCOME_PENDING', '1');
  bot.flushWelcome_(properties, new Date('2026-09-17T04:00:00Z'));
  assert.equal(sentMessages(harness).length, 0);
  assert.equal(values.has('WELCOME_PENDING'), false);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  values.set('REMINDERS_JSON', JSON.stringify([
    { id: 'abcdef12', dueAt: '2026-09-17 09:00', text: '<Morning class>' },
    { id: 'abcdef13', dueAt: '2026-09-18 09:00', text: 'Tomorrow' }
  ]));
  bot.processDueReminders_(properties, new Date('2026-09-17T04:00:00Z'));
  assert.equal(sentMessages(harness).length, 1);
  assert.match(sentMessages(harness)[0].payload.text, /&lt;Morning class&gt;/);
  assert.equal(JSON.parse(values.get('REMINDERS_JSON')).length, 1);
}

{
  const harness = createHarness();
  const { bot, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  harness.setUpdates([
    { update_id: 10, message: { chat: { id: '-1001', type: 'supergroup' }, from: { id: 2 }, text: '/help' } },
    { update_id: 11, message: { chat: { id: '-1001', type: 'supergroup' }, from: { id: 2 }, text: 'ordinary' } }
  ]);
  bot.pollTelegram();
  assert.equal(values.get('LAST_UPDATE_ID'), '11');
  const firstMessageCount = sentMessages(harness).length;
  bot.pollTelegram();
  assert.equal(sentMessages(harness).length, firstMessageCount);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  harness.failNextSend();
  assert.throws(() => bot.processUpdates_([
    { update_id: 20, message: { chat: { id: '-1001', type: 'supergroup' }, from: { id: 2 }, text: '/help' } }
  ], properties), /telegram_api_error/);
  assert.equal(values.has('LAST_UPDATE_ID'), false);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');

  const memberCommands = ['start', 'help', 'rules', 'today', 'register', 'site', 'privacy'];
  for (const command of memberCommands) {
    bot.routeCommand_({ command, args: '' }, {
      replyChatId: '-1001',
      groupChatId: '-1001',
      properties,
      isPrivateChat: false
    });
  }

  const messages = sentMessages(harness);
  assert.equal(messages.length, memberCommands.length);
  messages.forEach(assertWrapped);
  assert.match(messages[0].payload.text, /KVJ Satsanga Mitra/);
  assert.match(messages[1].payload.text, /\/rules/);
  assert.match(messages[2].payload.text, /participation guidance/);
  assert.match(messages[3].payload.text, /No class notice/);
  assert.match(messages[4].payload.text, /kvj-satsang\/register\//);
  assert.match(messages[5].payload.text, /kvj-satsang\//);
  assert.match(messages[6].payload.text, /does not store message text/);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');

  bot.setToday_(
    '-9001',
    '-1001',
    '<Morning class>',
    properties,
    new Date('2026-09-17T04:00:00Z'),
    true
  );
  assert.equal(values.get('TODAY_SCHEDULE_DATE'), '2026-09-17');
  assert.equal(values.get('TODAY_SCHEDULE_TEXT'), '<Morning class>');
  assert.match(bot.todayText_(properties, new Date('2026-09-17T05:00:00Z')), /&lt;Morning class&gt;/);
  const pinRequest = harness.requests.find((request) => request.method === 'pinChatMessage');
  assert.equal(pinRequest.payload.chat_id, '-1001');
  assert.equal(pinRequest.payload.disable_notification, true);

  bot.announce_('-9001', '-1001', '<Verification>', true);
  const announcementMessages = sentMessages(harness).slice(-2);
  assert.equal(announcementMessages[0].payload.chat_id, '-1001');
  assert.match(announcementMessages[0].payload.text, /&lt;Verification&gt;/);
  assert.equal(announcementMessages[1].payload.chat_id, '-9001');

  bot.createReminder_(
    '-9001',
    '2026-09-17 10:00 <Reminder>',
    properties,
    new Date('2026-09-17T04:00:00Z')
  );
  let reminders = JSON.parse(values.get('REMINDERS_JSON'));
  assert.equal(reminders.length, 1);
  assert.equal(reminders[0].id, 'abcdef12');
  assert.equal(reminders[0].text, '<Reminder>');

  bot.cancelReminder_('-9001', 'abcdef12', properties);
  reminders = JSON.parse(values.get('REMINDERS_JSON'));
  assert.equal(reminders.length, 0);

  values.set('LAST_POLL_AT', '2026-09-17 09:30');
  const status = bot.statusText_(properties, new Date('2026-09-17T04:00:00Z'));
  assert.match(status, /Today's notice: Set/);
  assert.match(status, /Pending reminders: 0/);
  assert.match(status, /Last delivery error: None/);
  sentMessages(harness).forEach(assertWrapped);
}

{
  const harness = createHarness();
  const { bot, properties, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  harness.setAdministrators([{ user: { id: 10 } }]);

  bot.handleUpdate_({
    update_id: 30,
    message: { chat: { id: '10', type: 'private' }, from: { id: 10 }, text: '/status' }
  }, properties);
  assert.match(sentMessages(harness).at(-1).payload.text, /KVJ Satsanga Mitra status/);

  bot.handleUpdate_({
    update_id: 31,
    message: { chat: { id: '20', type: 'private' }, from: { id: 20 }, text: '/help' }
  }, properties);
  assert.match(sentMessages(harness).at(-1).payload.text, /accepts private commands from KVJ administrators only/);

  bot.routeCommand_({ command: 'unknown', args: '' }, {
    replyChatId: '-1001',
    groupChatId: '-1001',
    properties,
    isPrivateChat: false
  });
  assert.match(sentMessages(harness).at(-1).payload.text, /Unknown command/);
  sentMessages(harness).forEach(assertWrapped);
}

{
  const harness = createHarness();
  harness.bot.configureBotCommands();
  const menuCalls = harness.requests.filter((request) => request.method === 'setMyCommands');
  assert.equal(menuCalls.length, 2);
  assert.equal(menuCalls[0].payload.scope.type, 'all_group_chats');
  assert.equal(menuCalls[1].payload.scope.type, 'all_chat_administrators');
  assert.equal(menuCalls[1].payload.commands.at(-1).command, 'status');
}

{
  const harness = createHarness();
  const { bot, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  values.set('TELEGRAM_WEBHOOK_URL', 'https://script.google.com/macros/s/example-deployment-id/exec');
  values.set('TELEGRAM_WEBHOOK_SECRET', 'abcdefghijklmnopqrstuvwx');
  bot.configureTelegramWebhook();
  const request = harness.requests.find((item) => item.method === 'setWebhook');
  assert.match(request.payload.url, /^https:\/\/script\.google\.com\/macros\/s\//);
  assert.match(request.payload.url, /\?secret=abcdefghijklmnopqrstuvwx$/);
  assert.deepEqual(JSON.parse(JSON.stringify(request.payload.allowed_updates)), ['message']);
}

{
  const harness = createHarness();
  const { bot, values } = harness;
  values.set('TELEGRAM_GROUP_CHAT_ID', '-1001');
  values.set('TELEGRAM_WEBHOOK_SECRET', 'abcdefghijklmnopqrstuvwx');
  const output = bot.doPost({
    parameter: { secret: 'abcdefghijklmnopqrstuvwx' },
    postData: {
      contents: JSON.stringify({
        update_id: 90,
        message: {
          message_id: 500,
          chat: { id: '-1001', type: 'supergroup' },
          from: { id: 10 },
          text: '/help'
        }
      })
    }
  });
  assert.equal(output.value, 'ok');
  assert.equal(values.get('LAST_UPDATE_ID'), '90');
  assert.ok(values.get('LAST_GROUP_ACTIVITY_AT'));
  assert.equal(sentMessages(harness).length, 1);
  assertWrapped(sentMessages(harness)[0]);

  const ordinary = bot.doPost({
    parameter: { secret: 'abcdefghijklmnopqrstuvwx' },
    postData: {
      contents: JSON.stringify({
        update_id: 91,
        message: {
          message_id: 501,
          chat: { id: '-1001', type: 'supergroup' },
          from: { id: 11 },
          text: 'confidential ordinary message'
        }
      })
    }
  });
  assert.equal(ordinary.value, 'ok');
  assert.equal(values.get('LAST_UPDATE_ID'), '91');
  assert.equal(sentMessages(harness).length, 1);
  assert.equal([...values.values()].some((value) => value.includes('confidential ordinary message')), false);

  const ignored = bot.doPost({
    parameter: { secret: 'wrong' },
    postData: { contents: '{}' }
  });
  assert.equal(ignored.value, 'ignored');
}

console.log('Telegram bot tests passed.');
