(function () {
  const config = window.BUS123_ACTIVITY;
  if (!config) {
    throw new Error("Missing window.BUS123_ACTIVITY configuration.");
  }

  const columns = config.sheet.columns;
  const rows = config.sheet.rows;
  const storageKey = config.storageKey || "bus123-activity-template";
  const resultCells = new Set(config.sheet.resultCells || []);
  const inspectMissionId = config.inspectMissionId || "";

  let cells = {};
  let state = {
    activeCell: config.sheet.activeCell || columns[0] + rows[0],
    activeMission: 0,
    completed: [],
    formulaBarChecked: false
  };

  function defaultCells() {
    const next = {};
    rows.forEach(row => {
      columns.forEach(col => {
        next[col + row] = {
          value: "",
          formula: "",
          format: "general",
          bold: false,
          align: "left",
          locked: false
        };
      });
    });
    Object.entries(config.sheet.initialCells || {}).forEach(([address, cell]) => {
      next[address] = { ...next[address], ...cell };
    });
    return next;
  }

  function loadState() {
    cells = defaultCells();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && saved.cells && saved.state) {
        cells = { ...cells, ...saved.cells };
        state = { ...state, ...saved.state };
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify({ cells, state }));
  }

  function addressParts(address) {
    const match = String(address).match(/^([A-Z]+)([0-9]+)$/);
    return match ? { col: match[1], row: Number(match[2]) } : null;
  }

  function cellText(address) {
    return String(cells[address]?.value || cells[address]?.formula || "").trim().toLowerCase();
  }

  function normalizedFormula(address) {
    return String(cells[address]?.formula || "").trim().toUpperCase().replace(/\s+/g, "");
  }

  function nearlyEqual(actual, expected, tolerance = 0.001) {
    return Number.isFinite(actual) && Math.abs(actual - expected) < tolerance;
  }

  function numberValue(address) {
    const cell = cells[address];
    if (!cell) return NaN;
    if (cell.formula) return evaluateFormula(cell.formula);
    const parsed = parseFloat(String(cell.value).replace(/[$,%]/g, ""));
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function evaluateFormula(formula) {
    const clean = String(formula).trim().toUpperCase().replace(/\s+/g, "");
    const multiply = clean.match(/^=([A-Z]+[0-9]+)\*([A-Z]+[0-9]+)$/);
    if (multiply) {
      return numberValue(multiply[1]) * numberValue(multiply[2]);
    }
    const sum = clean.match(/^=SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/);
    if (sum) {
      const start = addressParts(sum[1]);
      const end = addressParts(sum[2]);
      if (!start || !end || start.col !== end.col) return NaN;
      let total = 0;
      for (let row = start.row; row <= end.row; row += 1) {
        total += numberValue(start.col + row);
      }
      return total;
    }
    return NaN;
  }

  function displayValue(address) {
    const cell = cells[address];
    if (!cell) return "";
    let raw = cell.formula ? evaluateFormula(cell.formula) : cell.value;
    if (raw === "" || raw === null || typeof raw === "undefined") return "";
    if (typeof raw === "number" && !Number.isFinite(raw)) return "#VALUE!";
    if (cell.format === "currency" && raw !== "") {
      const num = Number(raw);
      return Number.isFinite(num) ? "$" + num.toFixed(2) : raw;
    }
    if (cell.format === "percent" && raw !== "") {
      const num = Number(raw);
      return Number.isFinite(num) ? (num * 100).toFixed(0) + "%" : raw;
    }
    return String(raw);
  }

  function rawCellEntry(address) {
    const cell = cells[address];
    if (!cell) return "";
    return cell.formula || cell.value || "";
  }

  function activeMission() {
    return config.missions[state.activeMission] || config.missions[0];
  }

  function isInspectMissionActive() {
    return activeMission().id === inspectMissionId;
  }

  function isComplete(index) {
    return state.completed.includes(config.missions[index].id);
  }

  function missionHintAddress(address) {
    return (activeMission().hintCells || []).includes(address);
  }

  function checkRule(rule) {
    if (rule.type === "activeCell") return state.activeCell === rule.address;
    if (rule.type === "formulaBarChecked") return state.formulaBarChecked;
    if (rule.type === "cellText") return cellText(rule.address) === String(rule.equals).trim().toLowerCase();
    if (rule.type === "cellNumber") return nearlyEqual(numberValue(rule.address), Number(rule.equals), rule.tolerance);
    if (rule.type === "cellFormat") return cells[rule.address]?.format === rule.equals;
    if (rule.type === "cellAlign") return cells[rule.address]?.align === rule.equals;
    if (rule.type === "cellBold") return Boolean(cells[rule.address]?.bold) === Boolean(rule.equals);
    if (rule.type === "headerFormatted") {
      return rule.addresses.every(address => cells[address]?.bold && cells[address]?.align === (rule.align || "center"));
    }
    if (rule.type === "productFormula") {
      const formula = normalizedFormula(rule.address);
      const first = String(rule.first).toUpperCase();
      const second = String(rule.second).toUpperCase();
      return formula === "=" + first + "*" + second || formula === "=" + second + "*" + first;
    }
    return false;
  }

  function missionIsComplete(mission) {
    return (mission.checks || []).every(checkRule);
  }

  function markComplete(index, announce = true) {
    const mission = config.missions[index];
    if (!state.completed.includes(mission.id)) {
      state.completed.push(mission.id);
    }
    if (index < config.missions.length - 1) {
      state.activeMission = index + 1;
    }
    if (announce) showToast(mission.success);
    saveState();
  }

  function checkCurrentMission() {
    const index = state.activeMission;
    const mission = config.missions[index];
    if (missionIsComplete(mission)) {
      markComplete(index);
    } else {
      showToast(mission.hint);
    }
    render();
  }

  function checkSilently() {
    const mission = config.missions[state.activeMission];
    if (mission && missionIsComplete(mission)) {
      markComplete(state.activeMission, false);
    }
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 3800);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderShellText() {
    document.title = config.meta.pageTitle;
    document.getElementById("activityKicker").textContent = config.meta.kicker;
    document.getElementById("activityTitle").textContent = config.meta.title;
    document.getElementById("activitySubtitle").textContent = config.meta.subtitle;
    document.getElementById("missionIntro").textContent = config.meta.missionIntro;
    document.getElementById("caseLabel").textContent = config.meta.company;
    document.getElementById("workbenchTitle").textContent = config.meta.workbenchTitle;
    document.getElementById("feedbackIntro").textContent = config.meta.feedbackIntro;
  }

  function renderSheet() {
    const head = document.getElementById("sheetHead");
    const body = document.getElementById("sheetBody");
    head.innerHTML = "<tr><th class=\"corner\"></th>" + columns.map(col => "<th scope=\"col\">" + col + "</th>").join("") + "</tr>";
    body.innerHTML = rows.map(row => {
      const cellsHtml = columns.map(col => {
        const address = col + row;
        const cell = cells[address];
        const inputClasses = [
          "cell-inner",
          cell.formula ? "formula-text" : "",
          cell.format,
          cell.bold ? "bold" : "",
          "align-" + cell.align
        ].filter(Boolean).join(" ");
        const cellClasses = [
          "cell",
          address === state.activeCell ? "active" : "",
          resultCells.has(address) ? "result-cell" : "",
          missionHintAddress(address) ? "hint-cell" : ""
        ].filter(Boolean).join(" ");
        return "<td class=\"" + cellClasses + "\" data-address=\"" + address + "\"><input class=\"" + inputClasses + "\" data-address=\"" + address + "\" aria-label=\"Cell " + address + "\" value=\"" + escapeHtml(displayValue(address)) + "\"></td>";
      }).join("");
      return "<tr><th scope=\"row\" class=\"row-head\">" + row + "</th>" + cellsHtml + "</tr>";
    }).join("");
  }

  function renderMissions() {
    const list = document.getElementById("missionsList");
    list.innerHTML = config.missions.map((mission, index) => {
      const classes = [
        "mission-btn",
        index === state.activeMission ? "active" : "",
        isComplete(index) ? "complete" : ""
      ].filter(Boolean).join(" ");
      const complete = isComplete(index);
      const number = complete ? "OK" : String(index + 1);
      const current = index === state.activeMission ? " aria-current=\"step\"" : "";
      const completedText = complete ? " <span class=\"sr-only\">complete</span>" : "";
      return "<button class=\"" + classes + "\" type=\"button\" data-mission=\"" + index + "\"" + current + "><span class=\"mission-num\">" + number + "</span><span><span class=\"mission-name\">" + escapeHtml(mission.name) + completedText + "</span><span class=\"mission-desc\">" + escapeHtml(mission.short) + "</span></span></button>";
    }).join("");
  }

  function renderFeedback() {
    const mission = activeMission();
    const complete = missionIsComplete(mission);
    const completedCount = state.completed.length;
    const percent = Math.round((completedCount / config.missions.length) * 100);
    document.getElementById("progressText").textContent = completedCount + " of " + config.missions.length + " done";
    document.getElementById("progressPercent").textContent = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("activeMissionName").textContent = mission.name;
    document.getElementById("activeMissionPrompt").textContent = isComplete(state.activeMission) ? mission.success : mission.prompt;

    const status = document.getElementById("feedbackStatus");
    status.textContent = complete ? "Looks right" : "Keep going";
    status.classList.toggle("warn", !complete);

    const activeAddress = state.activeCell;
    document.getElementById("nameBox").textContent = activeAddress;
    document.getElementById("selectedReadout").textContent = activeAddress;
    document.getElementById("displayReadout").textContent = displayValue(activeAddress) || "(blank)";
    document.getElementById("formulaReadout").textContent = rawCellEntry(activeAddress) || "(blank)";
    document.getElementById("formulaInput").value = rawCellEntry(activeAddress);
    const formulaCheckedBtn = document.getElementById("formulaCheckedBtn");
    formulaCheckedBtn.hidden = !isInspectMissionActive();
    formulaCheckedBtn.disabled = !isInspectMissionActive() || !activeMission().checks?.some(rule => rule.type === "formulaBarChecked");
  }

  function renderToolbar() {
    const cell = cells[state.activeCell];
    document.getElementById("boldBtn").classList.toggle("active", Boolean(cell?.bold));
    document.getElementById("currencyBtn").classList.toggle("active", cell?.format === "currency");
    document.getElementById("percentBtn").classList.toggle("active", cell?.format === "percent");
    document.getElementById("leftBtn").classList.toggle("active", cell?.align === "left");
    document.getElementById("centerBtn").classList.toggle("active", cell?.align === "center");
    document.getElementById("rightBtn").classList.toggle("active", cell?.align === "right");
  }

  function render() {
    renderShellText();
    renderSheet();
    renderMissions();
    renderFeedback();
    renderToolbar();
  }

  function focusCellInput(address, shouldSelect = true) {
    requestAnimationFrame(() => {
      const input = document.querySelector(".cell-inner[data-address=\"" + address + "\"]");
      if (!input) return;
      input.focus();
      if (shouldSelect) input.select();
    });
  }

  function selectCell(address, focusTarget = null) {
    if (!cells[address]) return;
    state.activeCell = address;
    if (isInspectMissionActive()) state.formulaBarChecked = false;
    render();
    if (focusTarget === "formula") {
      document.getElementById("formulaInput").focus();
    } else if (focusTarget === "cell") {
      focusCellInput(address);
    }
    saveState();
  }

  function updateActiveCell(entry, options = {}) {
    const { renderAfter = true } = options;
    const cell = cells[state.activeCell];
    if (!cell || cell.locked) {
      showToast("That cell is locked for this practice view.");
      if (renderAfter) render();
      return;
    }
    if (String(entry).trim().startsWith("=")) {
      cell.formula = String(entry).trim();
      cell.value = "";
    } else {
      cell.value = entry;
      cell.formula = "";
    }
    state.formulaBarChecked = false;
    saveState();
    checkSilently();
    if (renderAfter) render();
  }

  function applyFormat(type) {
    const active = activeMission();
    if (type === "header") {
      const addresses = active.headerCells || config.sheet.defaultHeaderCells || [];
      addresses.forEach(address => {
        if (cells[address]) {
          cells[address].bold = true;
          cells[address].align = "center";
        }
      });
      showToast("Header formatting applied.");
    } else {
      const cell = cells[state.activeCell];
      if (!cell || cell.locked) return;
      if (type === "bold") cell.bold = !cell.bold;
      if (type === "currency") cell.format = cell.format === "currency" ? "general" : "currency";
      if (type === "percent") cell.format = cell.format === "percent" ? "general" : "percent";
      if (type === "left") cell.align = "left";
      if (type === "center") cell.align = "center";
      if (type === "right") cell.align = "right";
    }
    saveState();
    checkSilently();
    render();
  }

  function moveActiveCell(key, focusAfterMove = false) {
    const parts = addressParts(state.activeCell);
    if (!parts) return;
    let colIndex = columns.indexOf(parts.col);
    let rowIndex = rows.indexOf(parts.row);
    if (key === "ArrowRight" || key === "Tab") colIndex += 1;
    if (key === "ArrowLeft") colIndex -= 1;
    if (key === "ArrowDown" || key === "Enter") rowIndex += 1;
    if (key === "ArrowUp") rowIndex -= 1;
    colIndex = Math.max(0, Math.min(columns.length - 1, colIndex));
    rowIndex = Math.max(0, Math.min(rows.length - 1, rowIndex));
    selectCell(columns[colIndex] + rows[rowIndex], focusAfterMove ? "cell" : null);
  }

  function resetActivity() {
    localStorage.removeItem(storageKey);
    cells = defaultCells();
    state = {
      activeCell: config.sheet.activeCell || columns[0] + rows[0],
      activeMission: 0,
      completed: [],
      formulaBarChecked: false
    };
    render();
    showToast("Practice reset. Start fresh with Mission 1.");
  }

  document.addEventListener("click", event => {
    const cellTarget = event.target.closest("[data-address]");
    if (cellTarget) {
      selectCell(cellTarget.dataset.address, event.target.matches("input") ? "cell" : null);
    }

    const missionTarget = event.target.closest("[data-mission]");
    if (missionTarget) {
      state.activeMission = Number(missionTarget.dataset.mission);
      render();
      saveState();
    }
  });

  document.addEventListener("focusin", event => {
    if (event.target.matches(".cell-inner")) {
      const address = event.target.dataset.address;
      if (state.activeCell !== address) {
        selectCell(address, "cell");
        return;
      }
      event.target.value = rawCellEntry(address);
      event.target.select();
    }
  });

  document.addEventListener("change", event => {
    if (event.target.matches(".cell-inner")) {
      updateActiveCell(event.target.value);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.target.matches(".cell-inner") && ["Enter", "Tab"].includes(event.key)) {
      event.preventDefault();
      updateActiveCell(event.target.value, { renderAfter: false });
      moveActiveCell(event.key, true);
    } else if (event.target.matches(".cell-inner") && event.key.startsWith("Arrow")) {
      event.preventDefault();
      updateActiveCell(event.target.value, { renderAfter: false });
      moveActiveCell(event.key, true);
    }
  });

  document.getElementById("formulaInput").addEventListener("change", event => {
    updateActiveCell(event.target.value);
  });

  document.getElementById("formulaInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      updateActiveCell(event.target.value);
    }
  });

  document.getElementById("boldBtn").addEventListener("click", () => applyFormat("bold"));
  document.getElementById("currencyBtn").addEventListener("click", () => applyFormat("currency"));
  document.getElementById("percentBtn").addEventListener("click", () => applyFormat("percent"));
  document.getElementById("leftBtn").addEventListener("click", () => applyFormat("left"));
  document.getElementById("centerBtn").addEventListener("click", () => applyFormat("center"));
  document.getElementById("rightBtn").addEventListener("click", () => applyFormat("right"));
  document.getElementById("headerBtn").addEventListener("click", () => applyFormat("header"));
  document.getElementById("hintBtn").addEventListener("click", () => showToast(activeMission().hint));
  document.getElementById("checkBtn").addEventListener("click", checkCurrentMission);
  document.getElementById("formulaCheckedBtn").addEventListener("click", () => {
    state.formulaBarChecked = true;
    checkCurrentMission();
  });
  document.getElementById("resetProgress").addEventListener("click", resetActivity);

  loadState();
  render();
})();
