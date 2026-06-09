(() => {
  const config = window.BUS123_DECISION_LAB;
  if (!config) return;

  const state = {
    stepIndex: 0,
    completed: new Set(JSON.parse(localStorage.getItem(`${config.storageKey}:completed`) || "[]")),
    selections: JSON.parse(localStorage.getItem(`${config.storageKey}:selections`) || "{}"),
    reflections: JSON.parse(localStorage.getItem(`${config.storageKey}:reflections`) || "{}")
  };

  const $ = (id) => document.getElementById(id);
  const steps = config.steps || [];

  function save() {
    localStorage.setItem(`${config.storageKey}:completed`, JSON.stringify([...state.completed]));
    localStorage.setItem(`${config.storageKey}:selections`, JSON.stringify(state.selections));
    localStorage.setItem(`${config.storageKey}:reflections`, JSON.stringify(state.reflections));
  }

  function selectedFor(step) {
    if (!state.selections[step.id]) {
      state.selections[step.id] = step.mode === "multi" ? [] : "";
    }
    return state.selections[step.id];
  }

  function renderChrome() {
    document.title = config.meta.pageTitle;
    $("kicker").textContent = config.meta.kicker;
    $("title").textContent = config.meta.title;
    $("subtitle").textContent = config.meta.subtitle;
    $("panelTitle").textContent = config.meta.panelTitle || "Decision rounds";
    $("panelIntro").textContent = config.meta.panelIntro;
    $("scenarioName").textContent = config.meta.scenarioName;
    $("scenarioCopy").textContent = config.meta.scenarioCopy;
    $("resetBtn").addEventListener("click", reset);
    $("checkBtn").addEventListener("click", checkStep);
    $("nextBtn").addEventListener("click", nextStep);

    $("stepList").innerHTML = steps.map((step, index) => `
      <button class="step-btn" type="button" data-step="${index}">
        <span class="step-num">${index + 1}</span>
        <span>
          <span class="step-name">${escapeHtml(step.name)}</span>
          <span class="step-short">${escapeHtml(step.short)}</span>
        </span>
      </button>
    `).join("");

    document.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        state.stepIndex = Number(button.dataset.step);
        render();
      });
    });
  }

  function render() {
    const step = steps[state.stepIndex];
    $("stepKicker").textContent = `Round ${state.stepIndex + 1} of ${steps.length}`;
    $("stepTitle").textContent = step.name;
    $("briefTitle").textContent = step.briefTitle;
    $("briefCopy").innerHTML = listHtml(step.brief);
    $("taskTitle").textContent = step.taskTitle;
    $("taskCopy").innerHTML = listHtml(step.task);
    $("evidenceLabel").textContent = step.evidenceLabel || "Evidence";
    $("choiceLabel").textContent = step.choiceLabel || "Your call";
    $("reflectionLabel").textContent = step.reflectionLabel || "Decision memo";
    $("reflection").placeholder = step.reflectionPlaceholder || "Write a short explanation of your decision.";
    $("reflection").value = state.reflections[step.id] || "";
    $("reflection").oninput = (event) => {
      state.reflections[step.id] = event.target.value;
      save();
    };

    renderCards(step);
    renderFeedback(step, "ready");
    updateProgress();
  }

  function renderCards(step) {
    const selected = selectedFor(step);
    $("evidenceGrid").innerHTML = (step.evidence || []).map((item) => `
      <button class="evidence-card ${isSelected(selected, item.id) ? "selected" : ""}" type="button" data-evidence="${escapeAttr(item.id)}">
        <span class="tag-row">${(item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="evidence-copy">${escapeHtml(item.copy)}</span>
      </button>
    `).join("");

    $("choiceGrid").innerHTML = (step.choices || []).map((item) => `
      <button class="choice-card ${isSelected(selected, item.id) ? "selected" : ""}" type="button" data-choice="${escapeAttr(item.id)}">
        <span class="choice-title">${escapeHtml(item.title)}</span>
        <span class="choice-copy">${escapeHtml(item.copy)}</span>
      </button>
    `).join("");

    document.querySelectorAll("[data-evidence], [data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.evidence || button.dataset.choice;
        updateSelection(step, id);
        save();
        renderCards(step);
        renderFeedback(step, "ready");
      });
    });
  }

  function updateSelection(step, id) {
    if (step.mode === "multi") {
      const current = selectedFor(step);
      if (current.includes(id)) {
        state.selections[step.id] = current.filter((item) => item !== id);
      } else {
        state.selections[step.id] = [...current, id];
      }
      return;
    }
    state.selections[step.id] = id;
  }

  function isSelected(selected, id) {
    return Array.isArray(selected) ? selected.includes(id) : selected === id;
  }

  function checkStep() {
    const step = steps[state.stepIndex];
    const selected = selectedFor(step);
    const required = step.required || [];
    const enoughReflection = (state.reflections[step.id] || "").trim().length >= (step.minReflection || 20);
    const hasSelection = Array.isArray(selected) ? selected.length > 0 : Boolean(selected);
    const matched = Array.isArray(selected)
      ? required.every((id) => selected.includes(id))
      : required.includes(selected);

    if (!hasSelection) {
      renderFeedback(step, "warn", step.emptyFeedback || "Choose at least one card before checking your work.");
      return;
    }

    if (!enoughReflection) {
      renderFeedback(step, "warn", "Add a short explanation so the decision is more than a click.");
      return;
    }

    if (matched) {
      state.completed.add(step.id);
      save();
      renderFeedback(step, "good", step.success);
      updateProgress();
    } else {
      renderFeedback(step, "warn", step.coach);
    }
  }

  function renderFeedback(step, tone, message) {
    const selected = selectedFor(step);
    $("feedback").className = `feedback ${tone === "good" ? "good" : tone === "warn" ? "warn" : ""}`;
    $("feedbackTitle").textContent = tone === "good" ? "Strong call" : tone === "warn" ? "Revisit the evidence" : "Ready for your decision";
    $("feedbackCopy").textContent = message || step.ready || "Select evidence, make a call, and write a short rationale.";
    $("scoreA").textContent = Array.isArray(selected) ? selected.length : selected ? "1" : "0";
    $("scoreB").textContent = state.completed.has(step.id) ? "Complete" : "Open";
    $("scoreC").textContent = `${Math.min((state.reflections[step.id] || "").trim().length, 99)} chars`;
  }

  function updateProgress() {
    const complete = state.completed.size;
    const percent = steps.length ? Math.round((complete / steps.length) * 100) : 0;
    $("progressFill").style.width = `${percent}%`;
    $("progressCount").textContent = `${complete}/${steps.length}`;
    $("progressPercent").textContent = `${percent}%`;

    document.querySelectorAll("[data-step]").forEach((button) => {
      const step = steps[Number(button.dataset.step)];
      button.classList.toggle("active", Number(button.dataset.step) === state.stepIndex);
      button.classList.toggle("complete", state.completed.has(step.id));
    });
  }

  function nextStep() {
    state.stepIndex = (state.stepIndex + 1) % steps.length;
    render();
  }

  function reset() {
    localStorage.removeItem(`${config.storageKey}:completed`);
    localStorage.removeItem(`${config.storageKey}:selections`);
    localStorage.removeItem(`${config.storageKey}:reflections`);
    state.completed = new Set();
    state.selections = {};
    state.reflections = {};
    state.stepIndex = 0;
    render();
  }

  function listHtml(items) {
    return `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll("'", "&#39;");
  }

  renderChrome();
  render();
})();
