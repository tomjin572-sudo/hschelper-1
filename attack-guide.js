(function () {
  if (window.__hscAttackGuideLoaded) return;
  window.__hscAttackGuideLoaded = true;

  const observer = new MutationObserver(addAttackGuides);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addAttackGuides();

  function addAttackGuides() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const oldGuide = card.querySelector(".mini-masterclass");
      if (oldGuide) oldGuide.remove();
      if (card.querySelector(".attack-guide")) return;
      const questionText = card.querySelector(".question-text");
      if (!questionText) return;
      const guide = buildGuide(card);
      questionText.insertAdjacentHTML("beforebegin", renderGuide(guide));
    });
  }

  function buildGuide(card) {
    const text = card.textContent.toLowerCase();
    const focus = card.querySelector(".question-meta-grid div:first-child span")?.textContent?.trim() || "the tested skill";
    const mistake = card.querySelector(".question-meta-grid div:nth-child(2) span")?.textContent?.trim() || "rushing without checking the question";

    if (/math|quadratic|calculus|differentiat|integrat|function|graph|trig|algebra/.test(text)) {
      return {
        type: focus,
        recognise: "Look for the method trigger: solve, sketch, differentiate, integrate, find gradient or interpret a graph.",
        first: "Write the formula, rule or first algebra line before doing any mental steps.",
        marks: "Show the method line, substitution/working line and final answer check.",
        trap: mistake
      };
    }

    if (/physics|chemistry|biology|science|enzyme|cell|reaction|force|wave|mole|acid|data|experiment/.test(text)) {
      return {
        type: focus,
        recognise: "Look for the concept, formula, data trend, diagram or practical wording in the question.",
        first: "Name the principle or formula, then connect it to the specific scenario.",
        marks: "Use correct terminology, ordered reasoning, units/data and a clear final conclusion.",
        trap: mistake
      };
    }

    if (/english|module|thesis|paragraph|quote|text|essay|analysis/.test(text)) {
      return {
        type: focus,
        recognise: "Use the command word, module wording and text-type clue to choose thesis, paragraph or analysis mode.",
        first: "Write a direct claim that uses the question wording before choosing evidence.",
        marks: "Use quote or example, technique, effect and a clear link back to the question.",
        trap: mistake
      };
    }

    if (/economic|labour|unemployment|inflation|policy|market|wage|business|marketing|operations|finance|human resources/.test(text)) {
      return {
        type: focus,
        recognise: "Find the command term, key concept and whether the question wants a chain, case/example, diagram or judgement.",
        first: "Define the key term or strategy, then set up the cause-effect chain.",
        marks: "Apply terms, explain impact, use an example/data/case and judge if asked.",
        trap: mistake
      };
    }

    return {
      type: focus,
      recognise: "Use the command word and topic clue to decide what kind of answer is needed.",
      first: "Write the first working line, claim or definition before expanding.",
      marks: "Answer the exact question, show evidence/working and finish with a clear link.",
      trap: mistake
    };
  }

  function renderGuide(guide) {
    return `
      <div class="attack-guide">
        <strong>How to Attack This Question</strong>
        <div><b>Question Type</b><span>${escapeHtml(guide.type)}</span></div>
        <div><b>How to Recognise It</b><span>${escapeHtml(guide.recognise)}</span></div>
        <div><b>First Move</b><span>${escapeHtml(guide.first)}</span></div>
        <div><b>Marks Strategy</b><span>${escapeHtml(guide.marks)}</span></div>
        <div><b>Trap to Avoid</b><span>${escapeHtml(guide.trap)}</span></div>
      </div>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
