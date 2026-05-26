const searchInput = document.querySelector("[data-search]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const lessons = [...document.querySelectorAll("[data-lesson]")];

let activeTrack = "all";

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  lessons.forEach((lesson) => {
    const matchesTrack = activeTrack === "all" || lesson.dataset.track === activeTrack;
    const matchesText = !query || lesson.dataset.search.includes(query);
    const show = matchesTrack && matchesText;
    lesson.hidden = !show;
    if (show) visible += 1;
  });

  document.querySelector("[data-empty]").hidden = visible !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTrack = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
