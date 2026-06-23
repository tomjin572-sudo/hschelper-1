(function () {
  if (window.__hscEveningPlanLoaded) return;
  window.__hscEveningPlanLoaded = true;
  window.__hscEveningPlanDisabled = true;
  // Emergency stability patch: the legacy evening-plan runtime was racing the
  // main StudySprint renderer and could lock the page after plan generation.
  // The main app already renders action cards and handles Start Practice.
})();
