import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const botAvatar = fileURLToPath(new URL('./telegram-bot/handoff/kvj-mitra-bot-avatar.png', import.meta.url));
const botAvatarHash = createHash('sha256').update(await readFile(botAvatar)).digest('hex');
const forbiddenPaths = [
  'research/',
  'content/site-brief',
  'docs/',
  'agents.md',
  'claude.md',
  'plan.md',
  'readme.md',
  'telegram-group-findings',
  'kvj_mitrabot',
  'kvj satsanga mitra',
  'kvj-mitra-bot-avatar',
  'telegram_bot_token',
  'telegram_group_chat_id',
];
const textExtensions = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.map']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const files = await walk(root);
const violations = [];

for (const file of files) {
  const publicPath = relative(root, file).replaceAll('\\', '/');
  if (forbiddenPaths.some((token) => publicPath.toLowerCase().includes(token))) {
    violations.push(publicPath);
  }
  const bytes = await readFile(file);
  if (createHash('sha256').update(bytes).digest('hex') === botAvatarHash) {
    violations.push(`${publicPath} (protected bot avatar)`);
  }
  if (textExtensions.has(extname(file))) {
    const body = bytes.toString('utf8');
    if (forbiddenPaths.some((token) => body.toLowerCase().includes(token))) {
      violations.push(`${publicPath} (content)`);
    }
  }
}

if (violations.length) {
  console.error('Private project material was found in dist:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Privacy check passed for ${files.length} generated files.`);
