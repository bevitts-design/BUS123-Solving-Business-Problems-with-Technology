const searchInput = document.querySelector("input[data-search]");
const filterButtons = [...document.querySelectorAll("[data-filter-group]")];
const lessons = [...document.querySelectorAll("[data-lesson]")];
const emptyState = document.querySelector("[data-empty]");

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
