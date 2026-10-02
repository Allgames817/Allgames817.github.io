import assert from 'node:assert/strict';
const origin = process.env.TEST_URL || 'http://127.0.0.1:4322';
const routes = ['/', '/projects/', '/projects/act/', '/projects/attention-resilience/', '/projects/robomaster-vision/', '/projects/embedded-vision/', '/blog/', '/blog/act-data-flow/', '/blog/act-to-diffusion/', '/blog/vision-modules/', '/life/', '/about/'];
for (const route of routes) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(origin + route);
    assert.equal(res.status, 200, route);
    const html = await res.text();
    assert.match(html, /<h1[ >]/, 'Content must be present in the HTTP response without executing JavaScript');
    if (route.includes('act-data-flow')) {
      assert.match(html, /<math/);
      assert.match(html, /record_for_inspection/);
      assert.match(html, /示例草稿/);
    }
  }
}
const missing = await fetch(origin + '/this-page-does-not-exist/');
assert.equal(missing.status, 404);
console.log('PASS: 12 content routes requested twice; server-rendered content and math; unknown path returns HTTP 404.');
