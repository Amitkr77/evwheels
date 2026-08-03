// EVWheels' market is Patna/Bihar (IST, UTC+5:30, no DST). Revenue/date
// boundaries must bucket by the IST calendar day regardless of what timezone
// the server process happens to run in — otherwise "today's revenue" silently
// shifts by up to 5.5 hours depending on hosting.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Midnight IST of the day containing `date`, returned as the equivalent UTC instant.
export function startOfDayIST(date = new Date()) {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - IST_OFFSET_MS);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
