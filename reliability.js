(() => {
  const nativeSetTimeout = window.setTimeout.bind(window);
  window.setTimeout = (handler, delay, ...args) => nativeSetTimeout(handler, delay === 24000 ? 45000 : delay, ...args);

  function rewriteFallbackText() {
    const output = document.querySelector("#sprintOutput");
    if (!output) return;
    output.querySelectorAll("*").forEach((node) => {
      if (!node.childNodes.length && node.textContent) {
        node.textContent = node.textContent
          .replaceAll("Offline fallback", "Backup plan")
          .replaceAll("Local fallback", "Backup plan")
          .replaceAll("Quick recovery plan", "Backup plan")
          .replaceAll("The plan is taking longer than expected. Try fewer subjects or weak topics.", "ChatGPT is connected, but this request took too long. Try 1 subject and 2-3 weak topics.");
      }
    });
  }

  function startWatching() {
    const output = document.querySelector("#sprintOutput");
    if (!output) return;
    rewriteFallbackText();
    new MutationObserver(rewriteFallbackText).observe(output, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWatching);
  } else {
    startWatching();
  }
})();
