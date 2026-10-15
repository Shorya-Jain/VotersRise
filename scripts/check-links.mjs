import assert from 'node:assert/strict';
import { check, LinkState } from 'linkinator';

const result = await check({
  path: 'dist',
  recurse: true,
  checkCss: true,
  checkFragments: true,
  // Local directory scans use a temporary HTTP server, not file:// URLs.
  linksToSkip: ['^https?://(?!127\\.0\\.0\\.1(?::|/))'],
});
const checked = result.links.filter((link) => link.state !== LinkState.SKIPPED);
assert.ok(checked.length > 0, 'The link checker did not check any links');
for (const link of result.links.filter((link) => link.state === LinkState.BROKEN)) {
  console.error(`${link.status ?? 'error'}: ${link.url} (from ${link.parent ?? 'root'})`);
}
assert.ok(result.passed, 'Broken local links or assets');
console.log(`Checked ${checked.length} local links, assets, and fragments. External URLs require a separate check.`);
