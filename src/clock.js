export function clockAngles(date = new Date()) {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  const minutes = date.getMinutes() + seconds / 60;
  return { second: -Math.PI * 2 * seconds / 60, minute: -Math.PI * 2 * minutes / 60, hour: -Math.PI * 2 * ((date.getHours() % 12) + minutes / 60) / 12 };
}
