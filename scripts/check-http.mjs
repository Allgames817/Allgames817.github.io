import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const origin = (process.env.TEST_URL || 'http://127.0.0.1:4322').replace(/\/$/, '');
const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const life = JSON.parse(await readFile('src/data/life.json', 'utf8'));
const features = JSON.parse(await readFile('src/data/features.json', 'utf8'));
const blogSources = await Promise.all((await readdir('src/content/blog')).filter(file => file.endsWith('.md')).map(async file => {
  const frontmatter = (await readFile(`src/content/blog/${file}`, 'utf8')).split('---')[1];
  return { slug: frontmatter.match(/^slug:\s*(.+)$/m)[1].trim(), draft: /^draft:\s*true\s*$/m.test(frontmatter) };
}));
const routes = ['/', '/projects/', ...projects.map(project => `/projects/${project.slug}/`), '/life/', ...life.notes.map(note => `/life/${note.slug}/`), '/about/', ...(features.blog ? ['/blog/', ...blogSources.filter(post => !post.draft).map(post => `/blog/${post.slug}/`)] : [])];
for (const route of routes) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(origin + route, { signal: AbortSignal.timeout(15000) });
    assert.equal(res.status, 200, route);
    const html = await res.text();
    assert.match(html, /<h1[ >]/, 'Content must be present in the HTTP response without executing JavaScript');
  }
}
const missingRoutes = ['/this-page-does-not-exist/', ...(!features.blog ? ['/blog/'] : []), ...blogSources.filter(post => !features.blog || post.draft).map(post => `/blog/${post.slug}/`)];
for (const route of missingRoutes) {
  const missing = await fetch(origin + route, { signal: AbortSignal.timeout(15000) });
  assert.equal(missing.status, 404, route);
}
console.log(`PASS: ${routes.length} content routes requested twice; server-rendered content; ${missingRoutes.length} unknown, hidden or draft routes return HTTP 404.`);
