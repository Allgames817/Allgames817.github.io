import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
const origin = process.env.TEST_URL || 'http://127.0.0.1:4321';
const output = '.impeccable/review';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = { routes: [], accessibility: [], interactions: [], errors: [] };
const features = JSON.parse(await readFile('src/data/features.json', 'utf8'));
const blogArticles = features.blog ? (await readdir('dist/blog', { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => `/blog/${entry.name}/`) : [];
const articleRoute = blogArticles[0] || '/life/berkeley-2025/';
const routes = ['/', '/projects/', '/projects/act/', '/projects/attention-resilience/', '/projects/robomaster-vision/', '/projects/embedded-vision/', '/projects/credit-transfer/', ...(features.blog ? ['/blog/', ...blogArticles] : []), '/life/', '/life/berkeley-2025/', '/about/', '/404.html'];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', error => results.errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(origin + route);
    assert.ok(response.status() === 200 || route === '/404.html', route);
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    await page.reload();
    assert.equal(await page.locator('h1').count(), 1);
    results.routes.push(route);
  }
  for (const theme of ['light', 'dark']) {
    await page.goto(origin);
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('.theme-toggle').click();
    for (const [name, route] of [['home', '/'], ['projects', '/projects/'], ['article', articleRoute]]) {
      await page.goto(origin + route);
      await page.screenshot({ path: `${output}/${name}-desktop-${theme}.png`, fullPage: true });
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      results.accessibility.push({ page: name, viewport: 'desktop', theme, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, elements: v.nodes.map(n => n.target) })) });
    }
  }
  await page.goto(origin + '/projects/');
  await page.getByRole('button', { name: 'AI 系统', exact: true }).click();
  assert.equal(await page.locator('[data-item]:visible').count(), 1);
  await page.reload();
  assert.equal(await page.locator('[data-item]:visible').count(), 1);
  results.interactions.push('project category filtering and persistence');
  if (blogArticles.length) {
    await page.goto(origin + '/blog/');
    const title = await page.locator('[data-item] h3 a').first().innerText();
    await page.getByRole('searchbox').fill(title);
    assert.equal(await page.locator('[data-item]:visible').count(), 1);
    await page.getByRole('searchbox').fill('__no_matching_blog_post__');
    assert.equal(await page.locator('[data-empty]:visible').count(), 1);
    await page.locator('[data-reset]').click();
    assert.equal(await page.locator('[data-item]:visible').count(), blogArticles.length);
    results.interactions.push('published post search, empty and reset states');
  }
  await page.goto(origin + '/');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), '跳到正文');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  results.interactions.push('keyboard skip link');
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  const phone = await mobile.newPage();
  phone.on('pageerror', error => results.errors.push(error.message));
  await phone.goto(origin);
  await phone.getByRole('button', { name: '打开导航菜单' }).tap();
  assert.equal(await phone.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await phone.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '项目', exact: true }).tap();
  assert.ok(phone.url().endsWith('/projects/'));
  await phone.getByRole('button', { name: '打开导航菜单' }).tap();
  await phone.keyboard.press('Escape');
  assert.equal(await phone.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  results.interactions.push('mobile touch menu, navigation, Escape and reduced motion');
  for (const theme of ['light', 'dark']) {
    await phone.goto(origin);
    if (await phone.locator('html').getAttribute('data-theme') !== theme) await phone.locator('.theme-toggle').tap();
    for (const [name, route] of [['home', '/'], ['projects', '/projects/'], ['article', articleRoute]]) {
      await phone.goto(origin + route);
      await phone.screenshot({ path: `${output}/${name}-mobile-${theme}.png`, fullPage: true });
      const scan = await new AxeBuilder({ page: phone }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      results.accessibility.push({ page: name, viewport: 'mobile', theme, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, elements: v.nodes.map(n => n.target) })) });
    }
  }
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) {
      await page.goto(origin + route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `Horizontal overflow ${width}: ${route}`);
    }
  }
  results.interactions.push('all routes at 320/390/768/1024/1440px without horizontal overflow');
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(origin + articleRoute);
  assert.ok(await staticPage.locator('.prose').innerText());
  assert.equal(await staticPage.getByRole('navigation', { name: '主导航' }).getByRole('link').count(), features.blog ? 5 : 4);
  results.interactions.push('no-JavaScript published article content and enabled navigation');
  const auto = await browser.newContext({ colorScheme: 'dark' });
  const autoPage = await auto.newPage();
  await autoPage.goto(origin);
  assert.equal(await autoPage.locator('html').getAttribute('data-theme'), 'dark');
  await autoPage.emulateMedia({ colorScheme: 'light' });
  assert.equal(await autoPage.locator('html').getAttribute('data-theme'), 'light');
  await autoPage.locator('.theme-toggle').click();
  await autoPage.reload();
  assert.equal(await autoPage.locator('html').getAttribute('data-theme'), 'dark');
  results.interactions.push('system theme changes and saved manual preference');
  assert.equal(results.errors.length, 0, 'Browser console errors');
  const violations = results.accessibility.flatMap(r => r.violations);
  assert.equal(violations.length, 0, JSON.stringify(violations));
  console.log('PASS: ' + JSON.stringify(results));
} finally {
  await writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
