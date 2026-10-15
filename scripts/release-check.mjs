// Check the generated public artifact, not only the source configuration.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const read = (file) => readFileSync(join(root, file), 'utf8');
const routes = ['index.html', 'check/index.html', 'register/index.html', 'move/index.html', 'deadlines/index.html', 'about/index.html', '404.html'];
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(root);
assert.equal(files.filter((file) => file.endsWith('.html')).length, routes.length, 'Unexpected public routes');
for (const route of routes) {
  const html = read(route);
  assert.match(html, /<html[^>]+lang="en"/, `${route}: English document language`);
  assert.match(html, /<main[^>]+id="main"/, `${route}: skip link target`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route}: one page heading`);
  assert.match(html, /rel="canonical"/, `${route}: canonical URL`);
  assert.match(html, /name="description"/, `${route}: description`);
  assert.doesNotMatch(html, /<script\b|reticle|pairing-token|pairing-root|localhost|127\.0\.0\.1/i, `${route}: development code or scripts`);
  assert.doesNotMatch(html, /In 23 languages|move your vote|list is frozen/i, `${route}: old copy`);
}
assert.match(read('_headers'), /script-src 'none'/, 'Production scripts must be blocked');
assert.match(read('_headers'), /frame-ancestors 'none'/, 'Pages must block framing');
const schedules = JSON.parse(readFileSync('src/data/elections.json', 'utf8'));
if (!schedules.publishSchedules) {
  const html = read('deadlines/index.html');
  assert.match(html, /We have not verified the current schedules/);
  assert.doesNotMatch(html, /Still in progress|Scheduled dates|2027|ANI:|aninews\.in/);
}
console.log(`Release artifact: ${routes.length} English pages pass metadata, content, and script checks.`);
