import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outputPath = path.join(root, "assets", "canvas-week-ahead.json");

const feedUrl = process.env.CANVAS_ICAL_URL;
const courseId = process.env.CANVAS_COURSE_ID || "58218";
const courseMatch = process.env.CANVAS_COURSE_MATCH || "BUS123";
const timezone = process.env.CANVAS_WEEK_AHEAD_TZ || "America/New_York";
const windowDays = Number.parseInt(process.env.CANVAS_WEEK_AHEAD_DAYS || "7", 10);

if (!feedUrl) {
  throw new Error("CANVAS_ICAL_URL is required. Paste the private Canvas Calendar Feed URL into that environment variable.");
}

if (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 31) {
  throw new Error("CANVAS_WEEK_AHEAD_DAYS must be an integer from 1 to 31.");
}

const response = await fetch(feedUrl);
if (!response.ok) {
  throw new Error(`Canvas calendar fetch failed: ${response.status} ${response.statusText}`);
}

const icsText = await response.text();
const events = parseIcsEvents(icsText)
  .map(normalizeEvent)
  .filter(Boolean)
  .filter((event) => matchesCourse(event, { courseId, courseMatch }))
  .filter((event) => inDateWindow(event, windowDays))
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

const publicPayload = {
  generatedAt: new Date().toISOString(),
  source: "Canvas Calendar iCal",
  courseId,
  courseMatch,
  timezone,
  windowDays,
  items: events.map((event) => ({
    title: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    allDay: event.allDay,
    type: event.type,
    url: event.url
  }))
};

await fs.writeFile(outputPath, `${JSON.stringify(publicPayload, null, 2)}\n`);
console.log(`Wrote ${events.length} Canvas week-ahead item${events.length === 1 ? "" : "s"} to ${path.relative(root, outputPath)}.`);

function parseIcsEvents(text) {
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);
  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const rawKey = line.slice(0, separator);
    const value = line.slice(separator + 1);
    const [name, ...paramParts] = rawKey.split(";");
    const key = name.toUpperCase();
    const params = Object.fromEntries(paramParts.map((part) => {
      const [paramName, ...paramValue] = part.split("=");
      return [paramName.toUpperCase(), paramValue.join("=")];
    }));

    current[key] = current[key] || [];
    current[key].push({ value, params });
  }

  return events;
}

function normalizeEvent(event) {
  const startProp = firstProp(event, "DTSTART") || firstProp(event, "DUE");
  if (!startProp) return null;

  const start = parseIcsDate(startProp.value, startProp.params);
  if (!start?.date) return null;

  const endProp = firstProp(event, "DTEND");
  const end = endProp ? parseIcsDate(endProp.value, endProp.params) : null;
  const title = cleanText(firstValue(event, "SUMMARY") || "Canvas item");
  const description = cleanText(firstValue(event, "DESCRIPTION"));
  const location = cleanText(firstValue(event, "LOCATION"));
  const url = cleanUrl(firstValue(event, "URL") || urlFromText(description));

  return {
    title,
    description,
    location,
    url,
    rawSearch: [title, description, location, url].filter(Boolean).join(" "),
    startsAt: start.date.toISOString(),
    endsAt: end?.date?.toISOString() || null,
    allDay: start.allDay,
    type: detectType({ title, description, url })
  };
}

function firstProp(event, key) {
  return event[key]?.[0] || null;
}

function firstValue(event, key) {
  return firstProp(event, key)?.value || "";
}

function parseIcsDate(value, params = {}) {
  if (params.VALUE === "DATE" || /^\d{8}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    return { date: new Date(year, month, day), allDay: true };
  }

  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!match) return null;

  const [, yyyy, mm, dd, hh, min, ss, utc] = match;
  const parts = [yyyy, mm, dd, hh, min, ss].map(Number);
  const date = utc
    ? new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]))
    : new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);

  return { date, allDay: false };
}

function cleanText(value = "") {
  return String(value)
    .replace(/\\n/g, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanUrl(value = "") {
  const trimmed = cleanText(value);
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

function urlFromText(text = "") {
  return text.match(/https?:\/\/[^\s<>"']+/i)?.[0] || "";
}

function matchesCourse(event, { courseId, courseMatch }) {
  const haystack = event.rawSearch.toLowerCase();
  return haystack.includes(`/courses/${courseId}`) || haystack.includes(courseMatch.toLowerCase());
}

function inDateWindow(event, days) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const windowEnd = new Date(startOfToday);
  windowEnd.setDate(windowEnd.getDate() + days + 1);

  const eventDate = new Date(event.startsAt);
  return eventDate >= startOfToday && eventDate < windowEnd;
}

function detectType({ title, description, url }) {
  const haystack = [title, description, url].filter(Boolean).join(" ").toLowerCase();
  if (haystack.includes("quiz")) return "Quiz";
  if (haystack.includes("discussion")) return "Discussion";
  if (haystack.includes("assignment") || haystack.includes("/assignments/")) return "Assignment";
  if (haystack.includes("homework")) return "Homework";
  return "Event";
}
