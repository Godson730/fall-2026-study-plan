// Sends the daily study-plan reminder to every device listed in the PUSH_SUBSCRIPTIONS secret.
// The phone writes the notification text itself from its own ticks; this only wakes it up.
import fs from "node:fs";
import webpush from "web-push";

const TZ = "America/Toronto";
const now = new Date();
const hour = Number(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(now));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
const wanted = Number(process.env.REMINDER_HOUR || 8);
const manual = process.env.MANUAL_RUN === "true";

if (!manual && hour !== wanted) {
  console.log(`Not reminder time: it is ${hour}:00 in Guelph and reminders go out at ${wanted}:00.`);
  process.exit(0);
}
if (!manual && (today < "2026-09-10" || today > "2026-12-22")) {
  console.log(`${today} is outside the Fall 2026 semester, so no reminder was sent.`);
  process.exit(0);
}

const config = fs.readFileSync(new URL("../config.js", import.meta.url), "utf8");
const publicKey = (config.match(/vapidPublicKey:\s*"([^"]+)"/) || [])[1];
const privateKey = process.env.VAPID_PRIVATE_KEY;
if (!publicKey || publicKey.startsWith("__") || !privateKey) {
  console.error("Missing keys: check vapidPublicKey in config.js and the VAPID_PRIVATE_KEY secret.");
  process.exit(1);
}

function parse(line) {
  let text = line.trim();
  if (!text) return null;
  if (text.startsWith("SPR1-")) text = Buffer.from(text.slice(5), "base64").toString("utf8");
  try {
    const sub = JSON.parse(text);
    return sub && sub.endpoint && sub.keys ? sub : null;
  } catch {
    return null;
  }
}

const subs = String(process.env.PUSH_SUBSCRIPTIONS || "").split(/\r?\n/).map(parse).filter(Boolean);
if (!subs.length) {
  console.log("No devices yet. Turn on the reminder in the app, then add its code to the PUSH_SUBSCRIPTIONS secret.");
  process.exit(0);
}

webpush.setVapidDetails("https://github.com/Godson730/fall-2026-study-plan", publicKey, privateKey);

let sent = 0;
for (const sub of subs) {
  const host = new URL(sub.endpoint).host;
  try {
    await webpush.sendNotification(sub, JSON.stringify({ type: manual ? "test" : "daily" }), { TTL: 6 * 60 * 60 });
    sent++;
    console.log(`Sent to a device on ${host}.`);
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.error(`A device on ${host} is no longer subscribed. Turn the reminder on again in the app and replace its code in PUSH_SUBSCRIPTIONS.`);
    } else {
      console.error(`Sending to ${host} failed (${err.statusCode || err.message}).`);
    }
  }
}
if (!sent) process.exit(1);
