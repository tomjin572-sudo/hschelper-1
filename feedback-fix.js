(() => {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const bodyText = typeof init.body === "string" ? init.body : "";
    const isFeedbackRequest = url.includes("/api/chat") && bodyText.includes("Mark this HSC-style practice answer");

    if (!isFeedbackRequest) return originalFetch(input, init);

    let requestBody = {};
    try {
      requestBody = JSON.parse(bodyText);
    } catch {
      requestBody = {};
    }

    try {
      const response = await originalFetch(input, init);
      const data = await response.clone().json().catch(() => ({}));
      const cleaned = cleanFeedback(data.answer, requestBody.question);
      return new Response(JSON.stringify({ answer: cleaned }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    } catch {
      return new Response(JSON.stringify({ answer: buildLocalFeedback(requestBody.question) }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
  };

  function cleanFeedback(answer, prompt) {
    const parsed = parsePossibleJson(answer);
    if (parsed?.cards?.length) return feedbackFromPlannerJson(parsed, prompt);
    if (looksLikeJson(answer)) return buildLocalFeedback(prompt);
    if (String(answer || "").trim()) return formatPlainFeedback(answer, prompt);
    return buildLocalFeedback(prompt);
  }

  function feedbackFromPlannerJson(parsed, prompt) {
    const card = parsed.cards[0] || {};
    const context = parsePrompt(prompt);
    return [
      "Verdict: This needs a clearer answer before it would earn full marks.",
      `What went wrong: ${context.commonMistake || card.mostCommonMistake || "The working does not clearly prove the final answer."}`,
      `Fix now: ${fixLine(context, card)}`,
      `Next action: ${nextAction(context, card)}`
    ].join("\n");
  }

  function formatPlainFeedback(answer, prompt) {
    const text = String(answer).replace(/```/g, "").trim();
    if (/Verdict:/i.test(text) && /Next action:/i.test(text)) return text;
    const context = parsePrompt(prompt);
    return [
      "Verdict: Good attempt, but check the method before moving on.",
      `What went wrong: ${context.commonMistake || "The answer may be missing a clear marking step."}`,
      `Fix now: ${text.split("\n").find(Boolean)?.slice(0, 160) || "Rewrite the solution with full working."}`,
      "Next action: Redo the same question once without looking at your first attempt."
    ].join("\n");
  }

  function buildLocalFeedback(prompt) {
    const context = parsePrompt(prompt);
    const answer = context.studentAnswer || "";
    const isMaths = /quadratic|equation|factor|solve|x\^|x2/i.test(context.question);
    const isThin = answer.trim().split(/\s+/).filter(Boolean).length < 10;

    if (isMaths) {
      return [
        `Verdict: ${isThin ? "Not enough working yet." : "Good start, but the marker needs cleaner working."}`,
        `What went wrong: ${context.commonMistake || "You may have skipped the factorisation or final roots."}`,
        "Fix now: Write the factorised form first, then state both solutions clearly: x = __ and x = __.",
        "Next action: Redo this question in 3 minutes, then check signs and both roots."
      ].join("\n");
    }

    return [
      `Verdict: ${isThin ? "Too short to mark properly." : "Solid attempt, but make the marking point more obvious."}`,
      `What went wrong: ${context.commonMistake || "The answer does not directly hit the focus point yet."}`,
      `Fix now: Add one sentence that directly proves: ${context.focusPoint || "the main point of the question"}.",`,
      "Next action: Rewrite only the weakest part, then mark the question complete."
    ].join("\n").replace('",', "");
  }

  function parsePrompt(prompt = "") {
    return {
      question: matchLine(prompt, "Question"),
      focusPoint: matchLine(prompt, "Focus point"),
      commonMistake: matchLine(prompt, "Common mistake to check"),
      studentAnswer: prompt.split("Student answer:")[1]?.split("Reply in")[0]?.trim() || ""
    };
  }

  function matchLine(text, label) {
    const regex = new RegExp(`${escapeRegExp(label)}:\\s*([^\\n]+)`, "i");
    return text.match(regex)?.[1]?.trim() || "";
  }

  function parsePossibleJson(value) {
    try {
      return JSON.parse(String(value || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, ""));
    } catch {
      return null;
    }
  }

  function looksLikeJson(value) {
    return /^\s*\{[\s\S]*\}\s*$/.test(String(value || ""));
  }

  function fixLine(context, card) {
    if (/quadratic|factor|solve|x\^|equation/i.test(context.question)) {
      return "Show the factorised form, then write both roots on a separate final line.";
    }
    return card.focusPoint ? `Rewrite the answer so it directly proves: ${card.focusPoint}.` : "Add one clear marking point and one correction before moving on.";
  }

  function nextAction(context, card) {
    if (/quadratic|factor|solve|x\^|equation/i.test(context.question)) {
      return "Try one more similar question immediately and check for sign errors.";
    }
    return card.buttonText || "Redo the weakest part in a 5-minute correction sprint.";
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
})();
