(function () {
  if (window.__hscMcqPracticeLoaded) return;
  window.__hscMcqPracticeLoaded = true;

  compressStudySprintRequests();
  injectStyles();
  const observer = new MutationObserver(convertCards);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  convertCards();

  function convertCards() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const questionText = card.querySelector(".question-text");
      if (!questionText || card.dataset.mcqConverted === "true") return;
      const parsed = parseMcq(questionText.textContent);
      if (!parsed) return;

      card.dataset.mcqConverted = "true";
      questionText.textContent = parsed.stem;

      const answerBox = card.querySelector("[data-question-answer]");
      const answerLabel = answerBox && answerBox.closest(".question-answer");
      if (answerLabel) answerLabel.hidden = true;

      const sample = findSampleAnswer(card);
      const correct = sample.match(/correct answer:\s*([A-D])/i)?.[1] || "";
      const explanation = sample || "Check the key takeaway, then carry it into the next stage.";
      const group = document.createElement("div");
      group.className = "mcq-answer";
      group.innerHTML = `
        <strong>Choose one answer</strong>
        <div class="mcq-options">
          ${parsed.options.map((option) => `
            <button type="button" class="mcq-option" data-letter="${escapeHtml(option.letter)}" data-value="${escapeHtml(option.value)}" aria-pressed="false">
              <span>${escapeHtml(option.letter)}</span>
              <b>${escapeHtml(option.text)}</b>
            </button>
          `).join("")}
        </div>
        <div class="mcq-result" hidden></div>
      `;

      (answerLabel || card.querySelector(".question-actions"))?.insertAdjacentElement("beforebegin", group);
      group.addEventListener("click", (event) => {
        const option = event.target.closest(".mcq-option");
        if (!option) return;
        group.querySelectorAll(".mcq-option").forEach((button) => {
          const selected = button === option;
          button.classList.toggle("is-selected", selected);
          button.setAttribute("aria-pressed", selected ? "true" : "false");
        });
        if (answerBox) {
          answerBox.value = option.dataset.value || "";
          answerBox.dispatchEvent(new Event("input", { bubbles: true }));
        }
        const picked = option.dataset.letter || "";
        const result = group.querySelector(".mcq-result");
        result.hidden = false;
        result.innerHTML = `
          <b>${correct && picked === correct ? "Correct" : correct ? "Not quite" : "Answer selected"}</b>
          <span>${escapeHtml(explanation)}</span>
        `;
        const complete = card.querySelector("[data-question-complete]");
        if (complete && !/completed/i.test(complete.textContent || "")) complete.click();
      });
    });
  }

  function parseMcq(text) {
    const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const firstOption = lines.findIndex((line) => /^[A-D][.)]\s+/.test(line));
    if (firstOption < 0) return null;
    const options = lines.slice(firstOption).map((line) => {
      const match = line.match(/^([A-D])[.)]\s+(.+)$/);
      return match ? { letter: match[1], text: match[2], value: `${match[1]}. ${match[2]}` } : null;
    }).filter(Boolean);
    if (options.length < 2) return null;
    return { stem: lines.slice(0, firstOption).join(" "), options };
  }

  function findSampleAnswer(card) {
    const text = card.textContent || "";
    const match = text.match(/Correct answer:\s*[A-D][\s\S]{0,220}/i);
    return match ? match[0].replace(/\s+/g, " ").trim() : "";
  }

  function injectStyles() {
    if (document.querySelector("#hsc-mcq-choice-styles")) return;
    const style = document.createElement("style");
    style.id = "hsc-mcq-choice-styles";
    style.textContent = `
      .mcq-answer { display: grid; gap: 8px; }
      .mcq-answer > strong { color: rgba(247,249,255,.84); font-size: .69rem; font-weight: 900; text-transform: uppercase; }
      .mcq-options { display: grid; gap: 8px; }
      .mcq-option { display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 10px; width: 100%; min-height: 48px; padding: 8px 12px; color: rgba(247,249,255,.88); text-align: left; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; box-shadow: none; }
      .mcq-option:hover, .mcq-option.is-selected { border-color: rgba(143,207,255,.5); background: rgba(143,207,255,.14); }
      .mcq-option span { display: inline-grid; place-items: center; width: 30px; height: 30px; color: #06101f; font-size: .78rem; font-weight: 900; background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 999px; }
      .mcq-option b { color: rgba(247,249,255,.9); font-size: .92rem; line-height: 1.3; }
      .mcq-result { border: 1px solid rgba(71,230,164,.24); border-radius: 12px; padding: 10px; background: rgba(71,230,164,.08); color: rgba(247,249,255,.88); }
      .mcq-result b { display: block; margin-bottom: 4px; color: rgba(247,249,255,.94); }
      .mcq-result span { color: rgba(210,218,235,.9); font-size: .9rem; line-height: 1.4; }
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function compressStudySprintRequests() {
    if (window.__hscFastStudySprintFetch) return;
    window.__hscFastStudySprintFetch = true;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      const url = typeof input === "string" ? input : input && input.url;
      if (url === "/api/chat" && init && typeof init.body === "string") {
        try {
          const payload = JSON.parse(init.body);
          const question = String(payload.question || "");
          if (question.length > 800 && /Weak topics:/i.test(question)) {
            const subject = question.match(/Subjects:\s*([^\n]+)/i)?.[1] || payload.subject || "HSC subject";
            const topics = question.match(/Weak topics:\s*([^\n]+)/i)?.[1] || "";
            const time = question.match(/Available study time:\s*([^\n]+)/i)?.[1] || "";
            const exam = question.match(/Exam dates:\s*([^\n]+)/i)?.[1] || "";
            init.body = JSON.stringify({
              ...payload,
              subject,
              question: `Subject: ${subject}\nWeak topic: ${topics}\nAvailable time: ${time}\nExam timing: ${exam}`
            });
          }
        } catch {}
      }
      return nativeFetch(input, init);
    };
  }
})();