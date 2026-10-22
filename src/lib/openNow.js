// Counts vetted, still-open spots whose hours cover the current Tucson time.
// Same rules as the app's isOpenNow() and census (cartoTaco src/lib/stores.js).
// The anon key is the app's public, read-only key (RLS allows select only).
const URL = 'https://vavreprfoxojjyaadlsd.supabase.co/rest/v1/sites_complete?select=site,hours';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdnJlcHJmb3hvamp5YWFkbHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Nzc0MTgsImV4cCI6MjA4NjI1MzQxOH0.iOx4DDd15AKDCQHHDCbMCS4oU1UvJl1x19TtkCgz1JM';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function toMinutes(t) {
  if (!t) return null;
  const [time, period] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period?.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

// Tucson never observes DST, so America/Phoenix is its clock year-round.
export function tucsonNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Phoenix', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(date).map((p) => [p.type, p.value])
  );
  return { day: parts.weekday.slice(0, 3).toLowerCase(), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function isOpen(hours, { day, minutes }) {
  const start = toMinutes(hours?.[`${day}_start`]);
  const end = toMinutes(hours?.[`${day}_end`]);
  if (start === null || end === null) return false;
  return end < start ? minutes >= start || minutes <= end : minutes >= start && minutes <= end;
}

export function tally(rows, now) {
  const live = rows.filter((r) => r.site?.vetting_status !== 'pending' && !r.site?.closed_at);
  return { open: live.filter((r) => isOpen(r.hours, now)).length, total: live.length };
}

export async function countOpenNow() {
  const res = await fetch(URL, { headers: { apikey: KEY } });
  if (!res.ok) throw new Error(res.status);
  return tally(await res.json(), tucsonNow());
}
