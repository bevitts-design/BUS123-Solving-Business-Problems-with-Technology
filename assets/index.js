const searchInput = document.querySelector("input[data-search]");
const filterButtons = [...document.querySelectorAll("[data-filter-group]")];
const lessons = [...document.querySelectorAll("[data-lesson]")];
const emptyState = document.querySelector("[data-empty]");
const businessNews = document.querySelector("[data-business-news]");
const businessNewsBody = document.querySelector("[data-business-news-body]");
const businessNewsWeek = document.querySelector("[data-business-news-week]");

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

if (businessNews && businessNewsBody) {
  renderBusinessNews(businessNews.dataset.businessNewsSrc || "assets/business-news-connections.json");
}

async function renderBusinessNews(src) {
  try {
    const response = await fetch(src, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${src}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const item = items[0];
    if (!item) {
      renderBusinessNewsEmpty("No weekly business connection is posted yet.");
      return;
    }

    if (businessNewsWeek) {
      businessNewsWeek.textContent = item.week || updatedLabel(data.updatedAt) || "This week";
    }

    businessNewsBody.replaceChildren(renderBusinessNewsItem(item));
  } catch (error) {
    renderBusinessNewsEmpty("The weekly business connection is unavailable right now.");
    if (businessNewsWeek) {
      businessNewsWeek.textContent = "Unavailable";
    }
  }
}

function renderBusinessNewsItem(item) {
  const article = document.createElement("article");
  article.className = "business-news-card";

  const title = document.createElement("h3");
  title.textContent = item.title || "Weekly business connection";

  const source = document.createElement("span");
  source.className = "business-news-source";
  source.textContent = item.sourceLabel || "Course connection";

  const question = document.createElement("p");
  question.className = "business-question";
  question.textContent = item.businessQuestion || "";

  const connection = document.createElement("p");
  connection.textContent = item.connection || "";

  const prompt = document.createElement("div");
  prompt.className = "business-prompt";
  const promptLabel = document.createElement("strong");
  promptLabel.textContent = "Discussion prompt";
  const promptCopy = document.createElement("p");
  promptCopy.textContent = item.discussionPrompt || "";
  prompt.append(promptLabel, promptCopy);

  article.append(source, title, question, connection, prompt);

  if (item.sourceUrl) {
    const link = document.createElement("a");
    link.href = item.sourceUrl;
    link.textContent = "Read source";
    article.append(link);
  }

  return article;
}

function renderBusinessNewsEmpty(message) {
  const empty = document.createElement("p");
  empty.className = "panel-empty";
  empty.textContent = message;
  businessNewsBody.replaceChildren(empty);
}

function updatedLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
