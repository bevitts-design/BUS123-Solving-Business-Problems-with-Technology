const searchInput = document.querySelector("input[data-search]");
const filterButtons = [...document.querySelectorAll("[data-filter-group]")];
const lessons = [...document.querySelectorAll("[data-lesson]")];
const emptyState = document.querySelector("[data-empty]");
const weekAhead = document.querySelector("[data-week-ahead]");
const weekAheadList = document.querySelector("[data-week-ahead-list]");
const weekAheadUpdated = document.querySelector("[data-week-ahead-updated]");

const activeFilters = {
  track: "all",
  material: "all",
  status: "all"
};

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  lessons.forEach((lesson) => {
    const materials = (lesson.dataset.materials || "").split(" ").filter(Boolean);
    const matchesTrack = activeFilters.track === "all" || lesson.dataset.track === activeFilters.track;
    const matchesMaterial = activeFilters.material === "all" || materials.includes(activeFilters.material);
    const matchesStatus = activeFilters.status === "all" || lesson.dataset.status === activeFilters.status;
    const matchesText = !query || lesson.dataset.search.includes(query);
    const show = matchesTrack && matchesMaterial && matchesStatus && matchesText;

    lesson.hidden = !show;
    if (show) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

function updateButtonState(group) {
  filterButtons
    .filter((button) => button.dataset.filterGroup === group)
    .forEach((button) => {
      const isActive = button.dataset.filterValue === activeFilters[group];
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filterGroup;
    activeFilters[group] = button.dataset.filterValue;
    updateButtonState(group);
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
applyFilters();

if (weekAhead && weekAheadList) {
  renderWeekAhead(weekAhead.dataset.weekAheadSrc || "assets/canvas-week-ahead.json");
}

async function renderWeekAhead(src) {
  try {
    const response = await fetch(src, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${src}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    updateWeekAheadTimestamp(data.generatedAt, data.timezone);

    if (!items.length) {
      renderWeekAheadEmpty("No BUS123 Canvas due dates posted for the next week.");
      return;
    }

    const grouped = groupWeekAheadItems(items);
    weekAheadList.replaceChildren(...grouped.map(renderWeekAheadDay));
  } catch (error) {
    renderWeekAheadUnavailable();
    if (weekAheadUpdated) {
      weekAheadUpdated.textContent = "Could not load latest dates";
    }
  }
}

function updateWeekAheadTimestamp(generatedAt, timezone) {
  if (!weekAheadUpdated) return;
  if (!generatedAt) {
    weekAheadUpdated.textContent = "Not updated yet";
    return;
  }

  const date = new Date(generatedAt);
  if (Number.isNaN(date.valueOf())) {
    weekAheadUpdated.textContent = "Update time unavailable";
    return;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone || undefined
  });
  weekAheadUpdated.textContent = `Updated ${formatter.format(date)}`;
}

function groupWeekAheadItems(items) {
  const groups = new Map();
  const sorted = [...items].sort((a, b) => String(a.startsAt).localeCompare(String(b.startsAt)));

  sorted.forEach((item) => {
    const date = new Date(item.startsAt);
    if (Number.isNaN(date.valueOf())) return;

    const key = localDateKey(date);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: dayLabel(date),
        dateLabel: shortDateLabel(date),
        items: []
      });
    }
    groups.get(key).items.push(item);
  });

  return [...groups.values()];
}

function renderWeekAheadDay(group) {
  const section = document.createElement("section");
  section.className = "week-ahead-day";

  const heading = document.createElement("div");
  heading.className = "week-ahead-day-heading";

  const label = document.createElement("h3");
  label.textContent = group.label;

  const date = document.createElement("span");
  date.textContent = group.dateLabel;

  heading.append(label, date);
  section.append(heading, ...group.items.map(renderWeekAheadItem));
  return section;
}

function renderWeekAheadItem(item) {
  const article = document.createElement("article");
  article.className = "week-ahead-item";

  const time = document.createElement("time");
  time.dateTime = item.startsAt || "";
  time.textContent = item.allDay ? "All day" : timeLabel(item.startsAt);

  const copy = document.createElement("div");
  copy.className = "week-ahead-copy";

  const title = document.createElement("strong");
  title.textContent = item.title || "Canvas item";

  const type = document.createElement("span");
  type.textContent = item.type || "Event";

  copy.append(title, type);
  article.append(time, copy);

  if (item.url) {
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = "Canvas";
    article.append(link);
  }

  return article;
}

function renderWeekAheadEmpty(message) {
  const empty = document.createElement("p");
  empty.className = "week-ahead-empty";
  empty.textContent = message;
  weekAheadList.replaceChildren(empty);
}

function renderWeekAheadUnavailable() {
  const empty = document.createElement("p");
  empty.className = "week-ahead-empty";
  empty.append("Canvas week-ahead dates are unavailable right now. ");

  const canvasLink = weekAhead?.querySelector(".week-ahead-actions a");
  if (canvasLink) {
    const link = document.createElement("a");
    link.href = canvasLink.href;
    link.textContent = "Check assignments directly in Canvas.";
    empty.append(link);
  }

  weekAheadList.replaceChildren(empty);
}

function dayLabel(date) {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target - today) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function shortDateLabel(date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function timeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

function localDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}
