import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
async function files(dir) { return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name)))).flat(); }
const all = await files(root);
// The user explicitly authorized this public certificate; source documents and resumes stay excluded.
const allowedDocuments = new Set(['documents/study-abroad-ambassador-2025-public.pdf']);
const html = all.filter(f => f.endsWith('.html'));
const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const life = JSON.parse(await readFile('src/data/life.json', 'utf8'));
const features = JSON.parse(await readFile('src/data/features.json', 'utf8'));
const blogSources = await Promise.all((await readdir('src/content/blog')).filter(file => file.endsWith('.md')).map(async file => {
  const frontmatter = (await readFile(`src/content/blog/${file}`, 'utf8')).split('---')[1];
  return { slug: frontmatter.match(/^slug:\s*(.+)$/m)[1].trim(), draft: /^draft:\s*true\s*$/m.test(frontmatter) };
}));
const publishedPosts = features.blog ? blogSources.filter(post => !post.draft) : [];
assert.equal(html.length, 4 + Number(features.blog) + projects.length + publishedPosts.length + life.notes.length + 2, 'Expected enabled main pages, project details, published articles, life notes, certificate and 404');
if (!features.blog) assert.ok(!all.some(file => path.relative(root, file).replaceAll('\\', '/').startsWith('blog/')), 'Disabled blog must not generate public files');
for (const post of blogSources.filter(post => post.draft)) assert.ok(!html.some(file => path.relative(root, file).replaceAll('\\', '/') === `blog/${post.slug}/index.html`), `Draft must not be published: ${post.slug}`);
let checkedLinks = 0;
for (const file of html) {
  const text = await readFile(file, 'utf8');
  if (!features.blog) {
    assert.ok(!text.includes(`href="${base}/blog/`), `Disabled blog link in ${file}`);
    assert.ok(!text.includes('id="related"'), `Hidden blog section or TOC in ${file}`);
  }
  assert.match(text, /lang="zh-CN"/);
  assert.equal((text.match(/<h1[ >]/g) || []).length, 1, file + ' needs one h1');
  assert.ok(!/href="#"|简历待上传|Resume|CV 下载/.test(text), 'Forbidden placeholder or resume in ' + file);
  assert.ok(!/C:\\Users|attachments\/|private-input/.test(text), 'Private source path leaked');
  const headings = new Set([...text.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const [, raw] of text.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(raw)) continue;
    const [local, hash] = raw.split('#');
    if (!local) { if (hash) assert.ok(headings.has(hash), `Broken anchor ${file}: ${raw}`); continue; }
    let target;
    if (local.startsWith('/')) {
      assert.ok(!base || local.startsWith(base + '/'), `Missing base prefix ${raw}`);
      target = path.join(root, decodeURIComponent(local.slice(base.length).split('?')[0]));
    } else target = path.resolve(path.dirname(file), decodeURIComponent(local.split('?')[0]));
    try { if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html'); await stat(target); }
    catch { assert.fail(`Missing local asset/link ${raw} in ${file}`); }
    checkedLinks++;
  }
}
assert.ok(!all.some(f => /\.(pdf|docx|txt)$/i.test(f) && !allowedDocuments.has(path.relative(root, f).replaceAll('\\', '/'))), 'Unexpected input document in output');
console.log(`PASS: ${html.length} HTML pages; ${checkedLinks} local links/assets; headings, anchors, base path and privacy checks.`);
