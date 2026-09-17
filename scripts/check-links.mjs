import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

const dist = resolve('dist');
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const derivedBase = repositoryName && !repositoryName.endsWith('.github.io') ? repositoryName : '';
const base = (process.env.BASE_PATH || derivedBase).replace(/^\//, '').replace(/\/$/, '');

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

const htmlFiles = (await walk(dist)).filter((file) => extname(file) === '.html');
const missing = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:https?:|mailto:|tel:|#|data:)/.test(link)) continue;
    const clean = decodeURIComponent(link.split(/[?#]/)[0]);
    let target;
    if (clean.startsWith('/')) {
      let rootPath = clean.slice(1);
      if (base && rootPath.startsWith(`${base}/`)) rootPath = rootPath.slice(base.length + 1);
      target = join(dist, rootPath);
    } else {
      target = resolve(dirname(file), clean);
    }
    const candidates = extname(target) ? [target] : [target, join(target, 'index.html')];
    let found = false;
    for (const candidate of candidates) {
      try { await access(candidate); found = true; break; } catch {}
    }
    if (!found) missing.push(`${file.replace(`${dist}/`, '')}: ${link}`);
  }
}

if (missing.length) {
  console.error('Broken local references:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Link check passed for ${htmlFiles.length} HTML pages.`);
