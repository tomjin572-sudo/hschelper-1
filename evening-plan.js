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
- Return valid JSON with coachCall, eveningPlan, and cards.
- eveningPlan must be an array of timed blocks that fills the available study time the student gave.
- Each eveningPlan block must include: time, duration, title, action, subject, topic, purpose, opensPractice, cardIndex.
- If the student has less than 45 minutes, create a survival plan: one practice task, one fix task, one recall check.
- If the student has 60-120 minutes, create 4-6 blocks: warm-up, highest ROI task, marking/fix, second practice, final recall.
- If the student has 2+ hours, create a longer plan with breaks and multiple subjects, but still prioritise weak areas.
- Avoid generic blocks like review notes. Use active tasks: timed paragraph, short-answer drill, equation set, cause-effect chain, error log, recall check.
- Blocks with opensPractice true should connect to a matching action card using cardIndex.
- Keep cards underneath the schedule as the highest-value Start Practice tasks.`;
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

    let blocks;
    if (minutes < 45) {
      blocks = fitBlocks([
        block(5, "Set up the attempt", `Write the exact topic you are attacking: ${weak}. No planning beyond one sentence.`, primary, weak, "Remove friction before the timed task.", false),
        block(25, "Highest ROI practice", actionFor(primary, weak), primary, weak, "Create marks fast through exam-style output.", true, 0),
        block(8, "Mark and fix one error", "Check the answer against the success criteria and rewrite the weakest line, step or definition.", primary, weak, "Repair the mistake while it is fresh.", false),
        block(7, "Final recall check", `Close notes and write the three things you must remember for ${weak}.`, primary, weak, "Lock in the minimum exam-ready memory.", false)
      ], minutes);
    } else if (minutes <= 120) {
      blocks = fitBlocks([
        block(10, "Warm-up recall", `Brain-dump the key formulas, definitions, arguments or steps for ${weak}.`, primary, weak, "Expose gaps before using the timer.", false),
        block(25, "Highest ROI practice", actionFor(primary, weak), primary, weak, "Turn revision into assessable work.", true, 0),
        block(10, "Mark and fix", "Circle one lost-mark reason and rewrite that part only.", primary, weak, "Stop repeating the same mistake.", false),
        block(25, "Second practice rep", actionFor(secondary, secondWeak), secondary, secondWeak, "Build a second exam-style attempt while focus is still high.", true, Math.min(1, cardCount - 1)),
        block(10, "Error log", "Write one mistake, the correct method, and the trigger that will remind you in the exam.", primary, weak, "Convert errors into rules.", false),
        block(10, "Final recall", "Do a closed-book recall check: definitions, steps, structure, and one example.", primary, weak, "Finish with memory, not scrolling.", false)
      ], minutes);
    } else {
      blocks = fitBlocks([
        block(10, "Priority setup", `Rank tonight's weak areas. Put ${weak} first unless tomorrow's exam says otherwise.`, primary, weak, "Make the night strategic, not evenly balanced.", false),
        block(30, "Deep practice block", actionFor(primary, weak), primary, weak, "Attack the highest marks impact first.", true, 0),
        block(10, "Break", "Stand up, water, no phone scrolling. Come back with one correction target.", primary, weak, "Protect focus for the second block.", false),
        block(25, "Weakness repair", "Redo the hardest step or paragraph from the first block with the mistake removed.", primary, weak, "Fix the exact leak in marks.", false),
        block(30, "Second subject practice", actionFor(secondary, secondWeak), secondary, secondWeak, "Keep momentum across another likely exam area.", true, Math.min(1, cardCount - 1)),
        block(10, "Break", "Reset your desk and write the next task before starting again.", secondary, secondWeak, "Prevent the long-session slump.", false),
        block(25, "Challenge attempt", actionFor(primary, topics[2] || weak), primary, topics[2] || weak, "Push into exam application, not comfort work.", true, Math.min(2, cardCount - 1)),
        block(15, "Final recall and pack-down", "Write tomorrow's must-remember list and one thing you will ignore.", primary, weak, "End calm with a clear exam target.", false)
      ], minutes);
    }

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
          <h3>Tonight's Revision Flow</h3>
          <p>Each time block has the exact action underneath. Practice blocks include a big card you can open.</p>
        </div>
        <span>${total} min</span>
      </div>
      <div class="evening-timeline" aria-label="Tonight revision timeline">
        ${blocks.map((item, index) => renderEveningBlock(item, index, cardElements)).join("")}
      </div>
      <p class="evening-plan-note">Based on: ${escapeHtml(details.studyTime || "tonight")}. Follow the blocks from top to bottom.</p>
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
          <div class="timeline-body">
            <strong>${index + 1}. ${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.action)}</p>
            <small>${escapeHtml(item.subject)} - ${escapeHtml(item.topic)} - ${escapeHtml(item.purpose)}</small>
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
