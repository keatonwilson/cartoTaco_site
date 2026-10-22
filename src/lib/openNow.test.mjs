// node src/lib/openNow.test.mjs
import assert from 'node:assert';
import { toMinutes, tucsonNow, isOpen, tally } from './openNow.js';

assert.equal(toMinutes('11:00'), 660);
assert.equal(toMinutes('12:30 AM'), 30);
assert.equal(toMinutes('1:15 PM'), 795);
// 2026-10-21 19:00 UTC is Wednesday 12:00 in Tucson (UTC-7, no DST)
assert.deepEqual(tucsonNow(new Date('2026-10-21T19:00:00Z')), { day: 'wed', minutes: 720 });
const noonWed = { day: 'wed', minutes: 720 };
assert.ok(isOpen({ wed_start: '10:00', wed_end: '20:00' }, noonWed));
assert.ok(!isOpen({ wed_start: '13:00', wed_end: '20:00' }, noonWed));
assert.ok(isOpen({ wed_start: '18:00', wed_end: '02:00' }, { day: 'wed', minutes: 23 * 60 }));
assert.ok(!isOpen({}, noonWed));
const h = { wed_start: '10:00', wed_end: '20:00' };
assert.deepEqual(tally([
  { site: { vetting_status: 'vetted' }, hours: h },
  { site: {}, hours: {} },
  { site: { vetting_status: 'pending' }, hours: h },
  { site: { closed_at: '2026-09-01' }, hours: h },
], noonWed), { open: 1, total: 2 });
console.log('openNow ok');
