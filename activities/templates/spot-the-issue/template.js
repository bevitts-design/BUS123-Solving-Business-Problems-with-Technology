
function renderActivity(data) {
  title.textContent = data.title;
  prompt.textContent = data.prompt;
  meta.textContent = `${data.course} · ${data.lesson} · ${data.company}`;

  choiceList.innerHTML = data.items.map(item => `
    <label class="choice">
      <input type="checkbox" name="issue" value="${item.id}">
      <span>${item.label}</span>
    </label>
  `).join("");
}

function checkAnswers(data, selectedIds) {
  return data.items.map(item => {
    const selected = selectedIds.includes(item.id);
    const isCorrect = selected === item.correct;

    return {
      ...item,
      selected,
      isCorrect
    };
  });
}
