(function () {
  if (window.__hscEveningPlanLoaded) return;
  window.__hscEveningPlanLoaded = true;

  const originalFetch = window.fetch && window.fetch.bind(window);

  if (originalFetch) {
    window.fetch = function patchedEveningPlanFetch(input, init) {
      try {
        const url = typeof input === "string" ? input : input && input.url;
        const isChat = typeof url === "string" && url.includes("/api/chat");
        const body = init && typeof init.body === "string" ? JSON.parse(init.body) : null;

        if (isChat && body && typeof body.question === "string" && body.question.includes("Create a simple HSC study plan")) {
          body.question += `

Evening revision flow requirement:
- Keep the UI simple: generate only timed question/practice cards, not a long exam plan.
- Return valid JSON with coachCall and 2-3 cards.
- Each card should be a clear practice task with timeRequired, topic, questionType, doThisNow, focusPoint, mostCommonMistake and buttonText.
- Do not create generic planning blocks like review notes, warm-up, final recall, or pack-down.
- Prioritise direct exam-style questions students can start immediately.`;
          init.body = JSON.stringify(body);
        }
      } catch (error) {
        // If another helper already shaped the request, keep the original request moving.
      }

      return originalFetch(input, init);
    };
  }

  const output = document.querySelector("#sprintOutput");
  if (!output) return;

  const observer = new MutationObserver(() => injectEveningPlan());
  observer.observe(output, { childList: true, subtree: true });
  document.addEventListener("submit", () => setTimeout(injectEveningPlan, 250), true);
  setTimeout(injectEveningPlan, 500);

  function injectEveningPlan() {
    const stack = output.querySelector(".action-card-stack");
    if (!stack || output.querySelector(".evening-plan")) return;

    const details = getPlannerDetails();
    const cardCount = Math.max(1, output.querySelectorAll(".execution-card").length || 1);
    const blocks = buildEveningPlan(details, cardCount);
    const cardElements = Array.from(stack.querySelectorAll(".execution-card"));
    const section = document.createElement("section");
    section.className = "evening-plan";
    section.innerHTML = renderEveningPlan(blocks, details, cardElements);
    stack.parentNode.insertBefore(section, stack);
    output.querySelectorAll(".start-now-heading").forEach((item) => item.remove());
    stack.hidden = true;
    stack.classList.add("action-card-source");
  }

  function getPlannerDetails() {
    return {
      subjects: splitInput("#subjectsInput"),
      topics: splitInput("#weakTopicsInput"),
      examDates: valueOf("#examDatesInput"),
      studyTime: valueOf("#studyTimeInput") || "90 minutes tonight"
    };
  }

  function splitInput(selector) {
    return valueOf(selector)
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function valueOf(selector) {
    const node = document.querySelector(selector);
    return node ? node.value.trim() : "";
  }

  function buildEveningPlan(details, cardCount) {
    const minutes = parseAvailableMinutes(details.studyTime);
    const subjects = details.subjects.length ? details.subjects : ["Priority subject"];
    const topics = details.topics.length ? details.topics : ["weakest topic"];
    const primary = subjects[0];
    const secondary = subjects[1] || primary;
    const weak = topics[0];
    const secondWeak = topics[1] || weak;
    const count = Math.max(1, Math.min(cardCount, minutes < 50 ? 1 : minutes < 90 ? 2 : 3));
    const baseDuration = count === 1 ? Math.min(minutes, 35) : count === 2 ? Math.min(35, Math.floor(minutes / 2)) : Math.min(30, Math.floor(minutes / 3));
    const blocks = [
      block(baseDuration, "Question Card 1", actionFor(primary, weak), primary, weak, "Start solving immediately.", true, 0),
      block(baseDuration, "Question Card 2", actionFor(secondary, secondWeak), secondary, secondWeak, "Second focused practice rep.", true, Math.min(1, cardCount - 1)),
      block(baseDuration, "Question Card 3", actionFor(primary, topics[2] || weak), primary, topics[2] || weak, "Harder follow-up practice.", true, Math.min(2, cardCount - 1))
    ].slice(0, count);

    return addTimes(blocks);
  }

  function block(minutes, title, action, subject, topic, purpose, opensPractice, cardIndex) {
    return { minutes, title, action, subject, topic, purpose, opensPractice, cardIndex: cardIndex || 0 };
  }

  function actionFor(subject, topic) {
    const text = `${subject} ${topic}`.toLowerCase();
    if (text.includes("math")) return `Complete a timed equation set on ${topic}. Show every line of working and check signs.`;
    if (text.includes("english")) return `Write one timed paragraph on ${topic}. Use thesis, evidence, analysis, and a clear link back.`;
    if (text.includes("economic")) return `Build one cause-effect chain for ${topic}, then turn it into an exam paragraph with one statistic or example.`;
    if (text.includes("biology") || text.includes("science")) return `Answer 3 short-response questions on ${topic}. Use correct terminology and process order.`;
    return `Complete one timed HSC-style task on ${topic}. Produce an answer, then mark and fix one weakness.`;
  }

  function fitBlocks(blocks, targetMinutes) {
    const minFor = (item) => item.opensPractice ? 15 : 5;
    let total = sumMinutes(blocks);
    let index = 0;

    while (total < targetMinutes) {
      const item = blocks[index % blocks.length];
      const add = Math.min(5, targetMinutes - total);
      item.minutes += add;
      total += add;
      index += 1;
    }

    index = 0;
    while (total > targetMinutes && index < blocks.length * 8) {
      const item = blocks[index % blocks.length];
      const remove = Math.min(5, total - targetMinutes, Math.max(0, item.minutes - minFor(item)));
      if (remove > 0) {
        item.minutes -= remove;
        total -= remove;
      }
      index += 1;
    }

    return blocks.filter((item) => item.minutes >= 5);
  }

  function addTimes(blocks) {
    let cursor = 18 * 60;
    return blocks.map((item) => {
      const start = cursor;
      cursor += item.minutes;
      return {
        ...item,
        duration: `${item.minutes} min`,
        time: `${formatClock(start)}-${formatClock(cursor)}`
      };
    });
  }

  function parseAvailableMinutes(studyTime) {
    const text = String(studyTime || "").toLowerCase();
    let minutes = 0;
    const hourMatches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/g)];
    const minuteMatches = [...text.matchAll(/(\d+)\s*(m|min|mins|minute|minutes)\b/g)];

    hourMatches.forEach((match) => {
      minutes += Math.round(Number(match[1]) * 60);
    });
    minuteMatches.forEach((match) => {
      minutes += Number(match[1]);
    });

    if (!minutes) {
      const bare = text.match(/\d+(?:\.\d+)?/);
      if (bare) {
        const number = Number(bare[0]);
        minutes = number <= 6 ? Math.round(number * 60) : Math.round(number);
      }
    }

    return Math.max(25, Math.min(minutes || 90, 240));
  }

  function sumMinutes(blocks) {
    return blocks.reduce((sum, item) => sum + item.minutes, 0);
  }

  function formatClock(totalMinutes) {
    const hour24 = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;
    const hour12 = ((hour24 + 11) % 12) + 1;
    return `${hour12}:${String(minute).padStart(2, "0")}`;
  }

  function renderEveningPlan(blocks, details, cardElements) {
    const total = blocks.reduce((sum, item) => sum + item.minutes, 0);
    return `
      <div class="evening-plan-head">
        <div>
          <h3>Timed Question Cards</h3>
          <p>Just the time and the practice card. Click Start Practice when you are ready.</p>
        </div>
        <span>${total} min</span>
      </div>
      <div class="evening-timeline" aria-label="Tonight revision timeline">
        ${blocks.map((item, index) => renderEveningBlock(item, index, cardElements)).join("")}
      </div>
    `;
  }

  function renderEveningBlock(item, index, cardElements) {
    const card = item.opensPractice ? cardElements[Number(item.cardIndex) || 0] || cardElements[0] : null;
    return `
      <article class="timeline-block ${item.opensPractice ? "is-practice" : ""}">
        <div class="timeline-header">
          <div class="timeline-top">
            <span>${escapeHtml(item.time)}</span>
            <em>${escapeHtml(item.duration)}</em>
          </div>
        </div>
        ${
          card
            ? `<div class="timeline-card-slot">${card.outerHTML}</div>`
            : `<div class="timeline-task-card"><strong>Do this block</strong><p>${escapeHtml(item.action)}</p></div>`
        }
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
