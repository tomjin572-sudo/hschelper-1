(function(){
  if(window.__hscSessionFlowPolishLoaded)return;
  window.__hscSessionFlowPolishLoaded=true;
  var steps=["Learn","Worked Example","Your Turn","AI Feedback","Fix","Next Action"];
  addStyles();
  var observer=new MutationObserver(queue);
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  document.addEventListener("input",queue,true);
  document.addEventListener("click",function(){setTimeout(queue,80);setTimeout(queue,450)},true);
  queue();

  function queue(){clearTimeout(queue.t);queue.t=setTimeout(run,80)}
  function run(){clean(document.body);polishBrief();document.querySelectorAll("#questionStack .question-card").forEach(polishCard);polishCheatSheet()}
  function polishBrief(){var brief=document.querySelector("#questionEngineBrief");if(brief)brief.textContent="Follow the steps in order: learn the move, see the example, try it, get feedback, fix it, then move on."}
  function polishCard(card){
    if(!card.querySelector(".learning-section"))return;
    card.classList.add("session-flow-card");
    addStepper(card);rename(card);addExample(card);addFeedback(card);addFix(card);addNext(card);setActive(card);
  }
  function addStepper(card){
    if(card.querySelector(".session-stepper"))return;
    var ol=document.createElement("ol");ol.className="session-stepper";ol.setAttribute("aria-label","Learning session steps");
    ol.innerHTML=steps.map(function(s,i){return '<li data-session-step="'+(i+1)+'"><span>'+(i+1)+'</span><b>'+esc(s)+'</b></li>'}).join("");
    var head=card.querySelector(".learning-card-head,.question-topline");if(head)head.after(ol);else card.prepend(ol)
  }
  function rename(card){
    title(card,".why-section","Step 1: Learn","Why this mark is worth attacking");
    title(card,".attack-section","Step 2: Worked Example","Use this answer path");
    title(card,".concept-section","Step 3: Your Turn","Quick check");
    title(card,".short-response-section","Step 3: Your Turn","Write the answer");
    title(card,".exam-application-section","Step 3: Your Turn","Exam-style attempt");
    title(card,".reflection-section","Step 5: Fix","Lock the correction")
  }
  function title(card,sel,strong,badge){var sec=card.querySelector(sel),wrap=sec&&sec.querySelector(".learning-section-title"),first=wrap&&wrap.firstElementChild,s=wrap&&wrap.querySelector("strong"),b=wrap&&wrap.querySelector("span"),m=String(strong||"").match(/step\s*(\d+)/i);if(s)s.textContent=strong;if(b)b.textContent=first===b&&m?m[1]:badge}
  function addExample(card){
    var attack=card.querySelector(".attack-section");if(!attack||attack.querySelector(".sentence-scaffold"))return;
    var sc=scaffold(((val("#subjectsInput")||val("#cheatSubjectInput")||"")+" "+card.textContent).toLowerCase());
    var box=document.createElement("div");box.className="sentence-scaffold";
    box.innerHTML="<b>"+esc(sc.title)+"</b><ol>"+sc.lines.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ol>";
    attack.appendChild(box)
  }
  function scaffold(text){
    if(/economics|labour|labor|unemployment|inflation|wage|market/.test(text))return{title:"Economics sentence path",lines:["Sentence 1: Define the key term.","Sentence 2: Explain the cause.","Sentence 3: Explain the mechanism.","Sentence 4: Explain the impact.","Sentence 5: Add an example or data point.","Sentence 6: Make a judgement or link back to the question."]};
    if(/english|module|essay|text|quote|analysis|thesis/.test(text))return{title:"English sentence path",lines:["Sentence 1: Make a thesis or topic-sentence claim.","Sentence 2: Add evidence.","Sentence 3: Name the technique.","Sentence 4: Analyse meaning.","Sentence 5: Explain audience effect.","Sentence 6: Link back to the question."]};
    if(/business|operations|marketing|finance|human resources/.test(text))return{title:"Business Studies sentence path",lines:["Sentence 1: Name the concept.","Sentence 2: Explain how it works.","Sentence 3: Add a case study or realistic example.","Sentence 4: Explain the business impact.","Sentence 5: Make a judgement."]};
    return{title:"Answer sentence path",lines:["Sentence 1: Answer the command word directly.","Sentence 2: Add the key term or method.","Sentence 3: Explain the effect, evidence or working.","Sentence 4: Link back to the question."]}
  }
  function addFeedback(card){
    if(card.querySelector(".feedback-step"))return;
    var actions=card.querySelector(".question-actions");if(!actions)return;
    var sec=document.createElement("section");sec.className="learning-section feedback-step";
    sec.innerHTML='<div class="learning-section-title"><span>Step 4</span><strong>AI Feedback</strong></div><p class="micro-prompt">Submit after a real attempt. Feedback should tell you what mark you protected, what is missing, and what to fix next.</p>';
    actions.before(sec);var btn=actions.querySelector("[data-question-feedback],[data-pack-feedback]");if(btn)btn.textContent="Get AI Feedback"
  }
  function addFix(card){
    var r=card.querySelector(".reflection-section");if(!r||r.querySelector(".fix-checklist"))return;
    var box=document.createElement("div");box.className="fix-checklist";
    box.innerHTML="<b>Fix before moving on</b><ul><li>Rewrite the weakest sentence or working line.</li><li>Name the trap you will avoid next time.</li><li>Keep the correction short enough to remember tomorrow.</li></ul>";
    r.appendChild(box)
  }
  function addNext(card){
    if(card.querySelector(".next-action-step"))return;
    var sec=document.createElement("section");sec.className="learning-section next-action-step";
    sec.innerHTML='<div class="learning-section-title"><span>Step 6</span><strong>Next Action</strong></div><p class="micro-prompt">If this felt solid, mark it complete and move to the next card. If it felt shaky, fix one sentence or working line first.</p>';
    var fb=card.querySelector(".question-feedback");if(fb)fb.after(sec);else card.appendChild(sec)
  }
  function setActive(card){
    var hasAnswer=[].some.call(card.querySelectorAll("textarea"),function(t){return t.value.trim()});
    var hasFeedback=[].some.call(card.querySelectorAll(".question-feedback"),function(n){return !n.hidden&&n.textContent.trim()});
    var complete=/completed/i.test((card.querySelector("[data-question-complete],[data-pack-complete]")||{}).textContent||"")||card.classList.contains("is-complete");
    var active=1;if(card.querySelector(".mcq-option.is-selected,.learning-mcq-option.is-selected"))active=3;if(hasAnswer)active=4;if(hasFeedback)active=5;if(complete)active=6;
    card.querySelectorAll("[data-session-step]").forEach(function(li){var n=Number(li.dataset.sessionStep);li.classList.toggle("is-active",n===active);li.classList.toggle("is-done",n<active)})
  }
  function polishCheatSheet(){
    var copy=document.querySelector("#tomorrow-cheat-sheet .section-copy");if(copy)copy.textContent="A last-minute exam action sheet: what to know, what to practise, what to ignore, and the first practice task to start now.";
    var result=document.querySelector(".cheat-sheet-result");if(!result||result.dataset.actionSheetPolished)return;result.dataset.actionSheetPolished="true";
    var eyebrow=result.querySelector(".cheat-print-head .eyebrow");if(eyebrow)eyebrow.textContent="Last-minute exam action sheet";
    renameCheat(result,"Strategy","Tonight's Strategy");renameCheat(result,"High-Probability Questions","Must Practise");renameCheat(result,"How To Answer","Answer Path");renameCheat(result,"Practice Inside HSC Helper","Start Practice From This Sheet");
    var mistakes=findCheat(result,"Common Mistakes");if(mistakes&&!findCheat(result,"What Not To Waste Time On")){var waste=document.createElement("section");waste.className="cheat-card";waste.innerHTML="<strong>What Not To Waste Time On</strong><ul><li>Do not rewrite full notes before attempting a question.</li><li>Do not start a new low-value topic before fixing the weak point.</li><li>Do not watch explanations without writing an answer.</li><li>Do not make a perfect summary instead of a timed response.</li></ul>";mistakes.before(waste)}
    var grid=result.querySelector(".practice-now .cheat-practice-grid");if(grid){var buttons=[].slice.call(grid.querySelectorAll("button"));buttons.forEach(function(b,i){if(i>1)b.remove()});if(buttons[0])buttons[0].textContent="Start Highest-ROI Practice";if(buttons[1])buttons[1].textContent="Fix My Weakest Point"}
  }
  function renameCheat(root,from,to){var c=findCheat(root,from),s=c&&c.querySelector("strong");if(s)s.textContent=to}
  function findCheat(root,title){return [].slice.call(root.querySelectorAll(".cheat-card")).find(function(c){return((c.querySelector("strong")||{}).textContent||"").trim().toLowerCase()===title.toLowerCase()})}
  function clean(root){
    if(!root)return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
    while(n=w.nextNode()){var t=n.nodeValue;t=t.replace(/馃幆/g,"Focus").replace(/馃挴/g,"Marks Impact").replace(/鈿狅笍/g,"Common Mistake").replace(/馃毇/g,"Ignore").replace(/\s+([:;,.])/g,"$1").replace(/\bHow To Attack This Question\b/g,"How to Attack This Question").replace(/\bCheck the Concept\b/g,"Concept Check");if(t!==n.nodeValue)n.nodeValue=t}
  }
  function addStyles(){
    if(document.querySelector("#hsc-session-flow-polish-styles"))return;var s=document.createElement("style");s.id="hsc-session-flow-polish-styles";
    s.textContent=".session-flow-card{gap:14px;max-width:100%}.session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64)}.session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.session-stepper b{font-size:.72rem;line-height:1.15}.session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.session-stepper li.is-active span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green))}.session-stepper li.is-done{border-color:rgba(71,230,164,.24);color:rgba(71,230,164,.9)}.sentence-scaffold,.fix-checklist{display:grid;gap:7px;border:1px solid rgba(143,207,255,.22);border-radius:12px;padding:10px;background:rgba(143,207,255,.07)}.sentence-scaffold b,.fix-checklist b{color:rgba(247,249,255,.9);font-size:.74rem;text-transform:uppercase}.sentence-scaffold ol,.fix-checklist ul{display:grid;gap:5px;margin:0;padding-left:18px}.feedback-step{border-color:rgba(143,207,255,.2);background:rgba(143,207,255,.065)}.next-action-step{border-color:rgba(71,230,164,.22);background:rgba(71,230,164,.07)}.question-actions button,.cheat-practice-grid button{min-height:46px}@media(max-width:820px){.focus-shell{width:min(100%,calc(100vw - 16px));grid-template-columns:1fr;padding:12px;gap:12px}.timer-panel{position:sticky;top:8px;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:16px}.timer-ring,.timer-ring svg,.progress-ring,.progress-ring svg{width:82px;height:82px}.timer-ring strong,.progress-ring strong{font-size:1.15rem}.timer-actions{display:flex;gap:8px}.timer-actions button{min-height:40px;padding:8px 10px}.practice-workflow,.question-engine,.question-stack,.question-card,.learning-section{width:100%;min-width:0}.question-engine-head{display:grid;gap:8px}#questionProgress{width:max-content;max-width:100%}.session-stepper{grid-template-columns:repeat(3,minmax(0,1fr))}.why-grid,.criteria-grid,.question-meta-grid,.card-grid,.essay-guidance-grid{grid-template-columns:1fr!important}.learning-card-head,.learning-section-title,.question-topline,.question-actions{align-items:stretch;flex-direction:column}.question-actions{display:grid;grid-template-columns:1fr;gap:8px}.mcq-option{grid-template-columns:30px minmax(0,1fr);min-height:52px}.question-card{padding:12px;border-radius:16px}.question-text{font-size:1rem!important}textarea{font-size:16px}.execution-card{min-width:0}.action-card-stack{grid-template-columns:1fr}}@media(max-width:460px){.session-stepper{grid-template-columns:1fr 1fr}.focus-shell{width:100%;min-height:100dvh;border-radius:0}.timer-panel{top:0}}";
    document.head.appendChild(s)
  }
  function val(sel){var n=document.querySelector(sel);return n&&n.value?n.value.trim():""}
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
})();
