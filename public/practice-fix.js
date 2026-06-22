(() => {
  const originalNormalizeQuestions = window.normalizeQuestions;

  window.normalizeQuestions = function patchedNormalizeQuestions(card) {
    const text = `${card?.title || ""} ${card?.questionType || ""} ${card?.doThisNow || ""}`.toLowerCase();
    const isMcqCard = /multiple choice|mcq|learning check/.test(text);
    const supplied = Array.isArray(card?.questions) ? card.questions.filter((question) => question && question.question) : [];

    if (!isMcqCard || !supplied.length) {
      return typeof originalNormalizeQuestions === "function" ? originalNormalizeQuestions(card) : supplied;
    }

    return supplied.slice(0, 5).map((question, index) => ({
      guidedAnswerPath: question.guidedAnswerPath || {
        keyDefinitionsYouNeed: ["Directive: command word controlling depth.", "Judgement: clear position based on evidence."],
        whatThisQuestionIsReallyAsking: "Pick the option that would earn marks.",
        firstSentenceYouCanUse: "The best option is ... because ...",
        stepByStepAnswerPath: ["Read the directive.", "Eliminate vague options.", "Choose the option with reasoning.", "Explain the trap."],
        whatToIncludeForFullMarks: ["Correct option", "One reason", "Trap identified"],
        commonMistake: "Choosing the vague option."
      },
      question: question.question,
      markValue: question.markValue || "1 mark",
      difficulty: question.difficulty || "Warm-up",
      estimatedTime: question.estimatedTime || "2 min",
      focusPoint: question.focusPoint || "Choose the strongest exam move.",
      commonMistake: question.commonMistake || "Choosing the broad option with no reasoning.",
      marksImpact: question.marksImpact || "Teaches the structure before writing.",
      whatToIgnore: question.whatToIgnore || "Do not write the essay yet.",
      sampleAnswer: question.sampleAnswer || ""
    }));
  };

  window.desiredCardCount = function patchedDesiredCardCount() {
    return 5;
  };

  const originalParseExecutionPlan = window.parseExecutionPlan;
  window.parseExecutionPlan = function patchedParseExecutionPlan(answer) {
    try {
      const cleaned = String(answer)
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed || !Array.isArray(parsed.cards) || !parsed.cards.length) return null;
      return {
        coachCall: parsed.coachCall || "",
        cards: parsed.cards.slice(0, 5).map((card) => (
          typeof window.normalizeCardQuestions === "function" ? window.normalizeCardQuestions(card) : card
        ))
      };
    } catch {
      return typeof originalParseExecutionPlan === "function" ? originalParseExecutionPlan(answer) : null;
    }
  };
})();
