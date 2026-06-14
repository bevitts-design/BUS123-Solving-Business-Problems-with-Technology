#!/usr/bin/env python3
"""Rebuild the two critical BUS123 slide decks with the current BUS123 scaffold."""

from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


CSS = r"""
:root{
  --ink:#0E1116;
  --paper:#FAF8F3;
  --paper-2:#F2EEE5;
  --white:#FFFFFF;
  --text:#1A1F2C;
  --text-soft:#4A5567;
  --muted:#7A8290;
  --border:#E5E1D6;
  --sage:#4A7C5E;
  --gold:#B8843D;
  --terra:#9C4A2B;
  --steel:#355773;
  --formula-bg:#EAF3EC;
  --gradient:linear-gradient(90deg,var(--gold),var(--terra),var(--sage));
  --serif:"Bodoni Moda",serif;
  --sans:"DM Sans",sans-serif;
  --mono:"JetBrains Mono",monospace;
  --type-display:72px;
  --type-title:46px;
  --type-subtitle:30px;
  --type-lead:24px;
  --type-body:20px;
  --type-small:16px;
  --type-eyebrow:15px;
  --type-stat:140px;
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--ink);color:var(--text);font-family:var(--sans);overflow:hidden}
body{width:100vw;height:100vh}
.deck-shell{position:absolute;width:1280px;height:720px;transform-origin:top left;background:var(--ink);overflow:hidden}
.tab-strip{position:absolute;left:0;top:0;bottom:0;width:84px;background:var(--ink);display:flex;flex-direction:column;gap:10px;padding:24px 12px;z-index:20}
.home-dot{width:36px;height:36px;border-radius:50%;background:var(--gradient);border:0;cursor:pointer;margin:0 auto 18px}
.tab{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:rgba(250,248,243,.74);border-radius:11px;height:82px;font:700 12px/1 var(--mono);letter-spacing:.08em;writing-mode:vertical-rl;text-orientation:mixed;display:grid;place-items:center;cursor:pointer}
.tab[data-section="1"]{border-color:rgba(74,124,94,.62)}
.tab[data-section="2"]{border-color:rgba(184,132,61,.62)}
.tab[data-section="3"]{border-color:rgba(156,74,43,.62)}
.tab[data-section="4"]{border-color:rgba(53,87,115,.62)}
.tab.active{background:var(--paper);color:var(--ink)}
.deck{position:absolute;left:84px;top:0;width:1196px;height:720px}
.slide{position:absolute;inset:0;width:1196px;height:720px;display:none;overflow:hidden;padding:54px 62px 50px;background:var(--paper);color:var(--text)}
.slide.active{display:block}
.slide.dark{background:var(--ink);color:var(--paper)}
.slide.terra{background:var(--terra);color:var(--paper)}
.slide.dark::before,.slide.section::before,.slide.terra::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:var(--gradient)}
.slide-number{position:absolute;right:34px;bottom:24px;font:600 13px/1 var(--mono);letter-spacing:.1em;color:var(--muted)}
.dark .slide-number,.terra .slide-number{color:rgba(250,248,243,.56)}
.eyebrow{font:700 var(--type-eyebrow)/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--sage);margin:0 0 14px}
.dark .eyebrow,.terra .eyebrow{color:var(--gold)}
h1,h2,h3,p{margin:0}
h1{font:700 var(--type-display)/.95 var(--serif);letter-spacing:0;max-width:860px}
h2{font:700 var(--type-title)/1.04 var(--serif);letter-spacing:0;max-width:900px}
h3{font:700 var(--type-subtitle)/1.08 var(--serif);letter-spacing:0}
.subtitle{font:400 italic var(--type-subtitle)/1.18 var(--serif);color:var(--text-soft);max-width:820px;margin-top:18px}
.dark .subtitle,.terra .subtitle{color:rgba(250,248,243,.76)}
.lead{font:500 var(--type-lead)/1.35 var(--sans);color:var(--text-soft);max-width:760px}
.dark .lead,.terra .lead{color:rgba(250,248,243,.78)}
.body{font:500 var(--type-body)/1.42 var(--sans);color:var(--text)}
.muted{color:var(--text-soft)}
.dark .body,.terra .body{color:rgba(250,248,243,.9)}
.dark .muted,.terra .muted{color:rgba(250,248,243,.68)}
.header-row{display:flex;align-items:center;gap:20px;margin-bottom:26px}
.rule{height:1px;background:var(--border);flex:1}
.dark .rule,.terra .rule{background:rgba(250,248,243,.18)}
.title-meta{position:absolute;left:62px;bottom:58px;display:flex;gap:18px;flex-wrap:wrap;font:700 13px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:rgba(250,248,243,.7)}
.title-meta span{border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:10px 13px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:stretch}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.two-col{display:grid;grid-template-columns:1.03fr .97fr;gap:34px;align-items:center}
.card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;min-height:138px}
.card strong{display:block;font:700 15px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--sage);margin-bottom:12px}
.card p{font:500 var(--type-body)/1.38 var(--sans);color:var(--text-soft)}
.dark .card,.terra .card{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18)}
.dark .card p,.terra .card p{color:rgba(250,248,243,.75)}
.numbered{display:grid;grid-template-columns:62px 1fr;gap:16px;align-items:start;margin-bottom:18px}
.numbered .n{font:400 italic 50px/.92 var(--serif);color:var(--sage)}
.numbered .n-body{font:600 var(--type-lead)/1.24 var(--sans)}
.pill-row{display:flex;flex-wrap:wrap;gap:12px}
.pill{border:1px solid var(--border);background:var(--white);border-radius:999px;padding:11px 14px;font:700 14px/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--text-soft)}
.stat{font:700 var(--type-stat)/.86 var(--serif);color:var(--sage)}
.stat-caption{font:700 var(--type-lead)/1.22 var(--sans);color:var(--text-soft);max-width:520px}
.company-card{display:grid;grid-template-columns:74px 1fr;gap:16px;align-items:center;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:18px}
.company-card img{width:74px;height:74px;object-fit:contain}
.company-card strong{font:700 15px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--sage)}
.company-card p{font:500 18px/1.26 var(--sans);color:var(--text-soft);margin-top:7px}
.image-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px}
.image-card img{width:100%;height:310px;object-fit:cover;border-radius:10px;display:block}
.process{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px}
.process div{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:20px;min-height:134px}
.process b{display:block;font:400 italic 42px/.95 var(--serif);color:var(--sage);margin-bottom:8px}
.process span{font:700 var(--type-body)/1.18 var(--sans)}
.spectrum{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:28px}
.spectrum div{min-height:220px;border-radius:14px;padding:15px;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid var(--border);background:var(--white)}
.spectrum div:nth-child(1),.spectrum div:nth-child(2),.spectrum div:nth-child(3),.spectrum div:nth-child(4){box-shadow:inset 0 6px 0 var(--sage)}
.spectrum strong{font:700 15px/1.2 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--text)}
.spectrum span{font:600 15px/1.22 var(--sans);color:var(--text-soft);margin-top:8px}
.formula-panel{background:var(--formula-bg);color:var(--ink);border-left:4px solid var(--sage);border-radius:12px;padding:20px 22px;font:500 18px/1.45 var(--mono);margin:16px 0}
.formula-panel .fn{display:block;color:var(--steel);font-size:22px;font-weight:700;margin-bottom:14px}
.formula-panel .result{color:var(--sage);font-weight:700}
.mini-sheet{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:18px;overflow:hidden}
.sheet-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #c9a84c}
.sheet-grid span{padding:11px;border:1px solid #c9a84c;font:700 14px/1.15 var(--mono);color:#0a3d6b;background:#fff}
.sheet-grid .head{background:#1a1a2e;color:var(--gold)}
.sheet-grid .alt{background:#f7f8fa}
.sheet-grid .result{background:#fffbf0;color:#1a6b3c;border-left:3px solid #c9a84c}
.chart{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:22px;height:330px;position:relative}
.axis{position:absolute;left:68px;bottom:56px;width:420px;height:214px;border-left:3px solid var(--ink);border-bottom:3px solid var(--ink)}
.line{position:absolute;left:72px;height:4px;transform-origin:left center;border-radius:99px}
.line.cost{bottom:112px;width:410px;background:var(--terra);transform:rotate(-10deg)}
.line.rev{bottom:62px;width:420px;background:var(--sage);transform:rotate(-30deg)}
.be-dot{position:absolute;left:276px;bottom:151px;width:18px;height:18px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 8px rgba(184,132,61,.18)}
.quote{font:700 62px/.98 var(--serif);max-width:900px;color:var(--paper)}
.question-grid{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:34px}
.question-grid div{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:30px;font:700 var(--type-lead)/1.28 var(--sans)}
.nav{position:fixed;right:22px;bottom:18px;z-index:40;display:flex;gap:8px}
.nav button{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.55);color:#fff;font:700 20px/1 var(--sans);cursor:pointer}
.counter{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:40;background:rgba(0,0,0,.55);color:#fff;border-radius:999px;padding:8px 15px;font:700 12px/1 var(--mono);letter-spacing:.08em}
.notes{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:39;width:min(820px,86vw);max-height:160px;overflow:auto;display:none;background:rgba(14,17,22,.94);color:#f2eee5;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:14px 18px;font:500 14px/1.45 var(--sans)}
"""


JS = r"""
(function(){
  var W=1280,H=720;
  var shell=document.querySelector(".deck-shell");
  var slides=[].slice.call(document.querySelectorAll(".slide"));
  var tabs=[].slice.call(document.querySelectorAll(".tab"));
  var counter=document.querySelector(".counter");
  var notesPanel=document.querySelector(".notes");
  var notes=[];
  try{notes=JSON.parse(document.getElementById("speaker-notes").textContent)}catch(e){notes=[]}
  var i=0;
  function fit(){
    var s=Math.min(window.innerWidth/W,window.innerHeight/H);
    var x=(window.innerWidth-W*s)/2;
    var y=(window.innerHeight-H*s)/2;
    shell.style.transform="translate("+x+"px,"+y+"px) scale("+s+")";
  }
  function render(){
    slides.forEach(function(slide,idx){slide.classList.toggle("active",idx===i)});
    var section=slides[i].getAttribute("data-section");
    tabs.forEach(function(tab){tab.classList.toggle("active",tab.getAttribute("data-section")===section)});
    counter.textContent=(i+1)+" / "+slides.length;
    if(notesPanel.style.display==="block"){notesPanel.textContent=notes[i]||""}
  }
  function go(n){i=Math.max(0,Math.min(slides.length-1,n));render()}
  document.querySelector(".next").addEventListener("click",function(){go(i+1)});
  document.querySelector(".prev").addEventListener("click",function(){go(i-1)});
  document.querySelector(".home-dot").addEventListener("click",function(){go(0)});
  tabs.forEach(function(tab){
    tab.addEventListener("click",function(){
      var section=tab.getAttribute("data-section");
      var idx=slides.findIndex(function(slide){return slide.getAttribute("data-section")===section});
      if(idx>=0)go(idx);
    });
  });
  document.addEventListener("keydown",function(e){
    if(["ArrowRight","ArrowDown"," ","PageDown"].includes(e.key)){e.preventDefault();go(i+1)}
    if(["ArrowLeft","ArrowUp","PageUp"].includes(e.key)){e.preventDefault();go(i-1)}
    if(e.key==="Home"){e.preventDefault();go(0)}
    if(e.key==="End"){e.preventDefault();go(slides.length-1)}
    if(e.key==="n"||e.key==="N"){notesPanel.style.display=notesPanel.style.display==="block"?"none":"block";notesPanel.textContent=notes[i]||""}
  });
  window.addEventListener("resize",fit);
  fit();render();
})();
"""


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def slide(num: int, section: int, kind: str, label: str, body: str) -> str:
    classes = ["slide"]
    if kind:
        classes.append(kind)
    return (
        f'<section class="{" ".join(classes)}" data-section="{section}" data-slide="{num}" data-label="{esc(label)}">\n'
        f"{body}\n"
        f'<div class="slide-number">{num:02d} / 22</div>\n'
        "</section>"
    )


def header(eyebrow: str, title: str) -> str:
    return f'<div class="header-row"><div class="eyebrow">{esc(eyebrow)}</div><div class="rule"></div></div><h2>{esc(title)}</h2>'


def deck_html(title: str, notes: list[str], slides: list[str]) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script type="application/json" id="speaker-notes">{json.dumps(notes, indent=2)}</script>
  <style>{CSS}</style>
</head>
<body>
  <div class="deck-shell">
    <nav class="tab-strip" aria-label="Deck sections">
      <button class="home-dot" aria-label="Go to first slide"></button>
      <button class="tab" data-section="0">OPEN</button>
      <button class="tab" data-section="1">PART 1</button>
      <button class="tab" data-section="2">PART 2</button>
      <button class="tab" data-section="3">PART 3</button>
      <button class="tab" data-section="4">WRAP</button>
    </nav>
    <main class="deck">
      {"".join(slides)}
    </main>
  </div>
  <div class="counter"></div>
  <div class="notes" aria-live="polite"></div>
  <div class="nav"><button class="prev" aria-label="Previous slide">&larr;</button><button class="next" aria-label="Next slide">&rarr;</button></div>
  <script>{JS}</script>
</body>
</html>
"""


def build_intro() -> tuple[list[str], list[str]]:
    notes = [
        "Open by naming the point of the lesson: students already use technology all day, but BUS123 is about becoming the person who can choose, build, organize, and explain the tool in a business context.",
        "Frame the agenda as a movement from daily technology to career value. The module starts broad on purpose before students begin building workbooks.",
        "Read the learning targets quickly and pause on the phrase professional operator. That is the thread for the whole class.",
        "Use this as a fast bridge from setup work. Microsoft 365 and OneDrive are not housekeeping; they are the operating system students need before the first workbook.",
        "Transition into the first content section. Technology in business is not one career path. It is the shared infrastructure underneath many different business roles.",
        "Make the everyday examples concrete. Ask students to count which ones they used before class. The point is that business problems now reach students through tools.",
        "Walk across the sectors and invite students to find themselves in at least one column. The tools vary by role, but the underlying skills repeat.",
        "Introduce the four BUS123 case companies as recurring clients, not decorative examples. These images are local content assets now, so the deck is easier to maintain.",
        "Move from where technology appears to where the student sits on the skill spectrum. This is the self-assessment part of the lesson.",
        "Explain passive user without shame. Most people start there. BUS123 is designed to make the invisible habits of professional operators visible and teachable.",
        "Use the spectrum as a career ladder. BUS123 is not promising automation mastery in one semester; it is moving students into the differentiating tier of formula building and analysis habits.",
        "Connect the skill ladder to early-career outcomes. Keep this practical: hiring, first 90 days, promotion, and entrepreneurship.",
        "Start the final content section by shifting from why technology matters to what students should actually do next.",
        "Give the AI message honestly. AI can accelerate work, but professional judgment still requires context, verification, and accountability.",
        "Name the four habits as small behaviors that compound. Emphasize file naming and verification because those are the habits students will practice immediately.",
        "Use this slide as the activity setup. Students should choose a field, name a recurring technology problem, select a Microsoft 365 tool, and describe the output.",
        "Use the process view to make the activity feel like a professional workflow, not a reflection prompt. Problem first, tool second, output third, explanation last.",
        "Pause on the common mistake. The danger is not being new to Excel. The danger is overestimating what casual experience means in a professional setting.",
        "Use these discussion prompts to let students connect the lesson to their own careers. This is also a good chance to hear where the class is anxious or excited.",
        "Close the lesson with three plain takeaways. Students should leave understanding that digital fluency is career capital.",
        "Preview the first Excel build. This keeps the course momentum clear: today explains why, next class begins building.",
        "End with the exit ticket and office-hours reminder. Keep the tone encouraging: the course is designed to move them step by step.",
    ]
    s = [
        slide(1, 0, "dark", "Title", '<div class="eyebrow">BUS123 · INTRO-M01-L02</div><h1>Technology in Everyday Life and Business</h1><p class="subtitle">Why digital fluency is no longer optional, and how it shapes every career path.</p><div class="title-meta"><span>Prof. Evitts</span><span>Gerrish School of Business</span><span>Fall 2026</span></div>'),
        slide(2, 0, "", "Agenda", header("Today", "Three questions guide the lesson.") + '<div class="grid-3" style="margin-top:38px"><div class="card"><strong>01</strong><p>Where does technology already shape business decisions?</p></div><div class="card"><strong>02</strong><p>What separates casual use from professional operation?</p></div><div class="card"><strong>03</strong><p>Which habits will help you build credibility this semester?</p></div></div>'),
        slide(3, 0, "", "Learning Objectives", header("I can", "By the end of class, you can do four things.") + '<div style="margin-top:32px"><div class="numbered"><div class="n">01</div><div class="n-body">Navigate the core Microsoft 365 apps used in BUS123.</div></div><div class="numbered"><div class="n">02</div><div class="n-body">Distinguish a passive user from a professional operator.</div></div><div class="numbered"><div class="n">03</div><div class="n-body">Identify how technology changes decisions in a real industry.</div></div><div class="numbered"><div class="n">04</div><div class="n-body">Connect a Microsoft 365 app to a workflow in your intended career.</div></div></div>'),
        slide(4, 0, "", "Bridge", header("Bridge", "Setup is only useful when it supports real work.") + '<div class="two-col" style="margin-top:30px"><div><p class="lead">Microsoft 365, OneDrive, Canvas, and file naming are the infrastructure. The business value comes when those tools help someone make a better decision.</p></div><div class="process" style="grid-template-columns:1fr 1fr"><div><b>01</b><span>Find the task</span></div><div><b>02</b><span>Choose the tool</span></div><div><b>03</b><span>Build the output</span></div><div><b>04</b><span>Explain the decision</span></div></div></div>'),
        slide(5, 1, "dark section", "Part 1", '<div class="eyebrow">Part 1 of 3</div><h1>Where Technology Meets Business</h1><p class="subtitle">Every industry. Every role. Every decision.</p>'),
        slide(6, 1, "", "Everyday Technology", header("A day in your life", "Before this class, you probably used six systems.") + '<div class="grid-3" style="margin-top:28px"><div class="card"><strong>Banking</strong><p>Balances, payments, fraud alerts, and transaction history.</p></div><div class="card"><strong>Maps</strong><p>Routing, traffic, local search, and location data.</p></div><div class="card"><strong>Canvas</strong><p>Assignments, notifications, files, grades, and messages.</p></div><div class="card"><strong>Streaming</strong><p>Recommendation systems and personalized feeds.</p></div><div class="card"><strong>Ordering</strong><p>Inventory, payment, delivery, and customer updates.</p></div><div class="card"><strong>Calendar</strong><p>Scheduling, reminders, shared availability, and follow-up.</p></div></div>'),
        slide(7, 1, "", "Sectors", header("Across sectors", "Whatever your path, the tool habits repeat.") + '<div class="grid-3" style="margin-top:28px"><div class="card"><strong>Finance</strong><p>Models, dashboards, forecasts, and time value of money.</p></div><div class="card"><strong>Retail</strong><p>Inventory, point of sale, pricing, payroll, and reorder decisions.</p></div><div class="card"><strong>Marketing</strong><p>Campaign data, segments, A/B tests, and presentation decks.</p></div><div class="card"><strong>Healthcare</strong><p>Scheduling, billing, payer mix, compliance, and reporting.</p></div><div class="card"><strong>Management</strong><p>Reports, client decks, budgets, and operating analysis.</p></div><div class="card"><strong>HR and law</strong><p>Contracts, tracking, payroll, training, and policy documents.</p></div></div>'),
        slide(8, 1, "", "Case Companies", header("Recurring clients", "Four BUS123 companies make the work less abstract.") + '<div class="grid-4" style="margin-top:30px"><div class="company-card"><img src="img/bus123-intro-m01-l02-tidal-goods-badge.png" alt="Tidal Goods Co. badge"><div><strong>Tidal Goods Co.</strong><p>Retail, inventory, markup, and markdown.</p></div></div><div class="company-card"><img src="img/bus123-intro-m01-l02-meridian-advisory-group-badge.png" alt="Meridian Advisory Group badge"><div><strong>Meridian Advisory Group</strong><p>Payroll, interest, loans, and tax math.</p></div></div><div class="company-card"><img src="img/bus123-intro-m01-l02-anchor-oak-events-badge.png" alt="Anchor and Oak Events badge"><div><strong>Anchor & Oak Events</strong><p>Breakeven, labor, pricing, and cash flow.</p></div></div><div class="company-card"><img src="img/bus123-intro-m01-l02-harborside-medical-center-badge.png" alt="Harborside Medical Center badge"><div><strong>Harborside Medical Center</strong><p>Payer mix, reporting, and payroll complexity.</p></div></div></div>'),
        slide(9, 2, "dark section", "Part 2", '<div class="eyebrow">Part 2 of 3</div><h1>Where You Fit on the Spectrum</h1><p class="subtitle">And what it costs to stay where you are.</p>'),
        slide(10, 2, "", "Passive vs Operator", header("Core distinction", "Professional operators build the tool, not just use it.") + '<div class="grid-2" style="margin-top:32px"><div class="card"><strong>Passive user</strong><p>Uses what others configured, types numbers into existing workbooks, saves wherever files land, and asks what a button does.</p></div><div class="card"><strong>Professional operator</strong><p>Builds from a blank sheet, writes formulas, names files for teams, troubleshoots first, and asks which tool fits the problem.</p></div></div>'),
        slide(11, 2, "", "Spectrum", header("Digital fluency spectrum", "BUS123 moves you through the expected layers.") + '<div class="spectrum"><div><strong>Basic literacy</strong><span>Every job</span></div><div><strong>File management</strong><span>Expected</span></div><div><strong>Spreadsheet use</strong><span>Most business roles</span></div><div><strong>Formula building</strong><span>Differentiator</span></div><div><strong>Data analysis</strong><span>Advanced layer</span></div><div><strong>Modeling and automation</strong><span>Premium skill</span></div></div>'),
        slide(12, 2, "", "Career Impact", header("Career impact", "This skill set pays off in visible ways.") + '<div class="grid-4" style="margin-top:30px"><div class="card"><strong>Hiring</strong><p>Excel proficiency makes interviews and early screening easier to survive.</p></div><div class="card"><strong>First 90 days</strong><p>Digitally fluent hires spend less time stuck on admin work.</p></div><div class="card"><strong>Promotion</strong><p>Building a model, report, or dashboard others use creates visible value.</p></div><div class="card"><strong>Entrepreneurship</strong><p>Budgets, pricing, payroll, and cash flow usually start in Excel.</p></div></div>'),
        slide(13, 2, "", "Decision Shift", header("Before and after", "Technology changes which decisions are possible.") + '<div class="grid-2" style="margin-top:32px"><div class="card"><strong>Before modern tools</strong><p>Pricing by gut feel. Inventory by physical count. Payroll by hand. Cash flow projections that took weeks.</p></div><div class="card"><strong>With modern tools</strong><p>Dynamic pricing, real-time inventory, faster payroll, and twelve-month cash flow in an afternoon.</p></div></div>'),
        slide(14, 3, "dark section", "Part 3", '<div class="eyebrow">Part 3 of 3</div><h1>What To Do About It</h1><p class="subtitle">Habits, AI judgment, and a career-mapping activity.</p>'),
        slide(15, 3, "", "AI Fluency", header("AI fluency", "AI is useful, but it does not replace judgment.") + '<div class="grid-2" style="margin-top:32px"><div class="card"><strong>AI is good at</strong><p>Suggesting formulas, drafting first versions, summarizing data, and spotting patterns you provide.</p></div><div class="card"><strong>AI is not good at</strong><p>Knowing your business context, checking unstated errors, making judgment calls, or building your credibility.</p></div></div>'),
        slide(16, 3, "", "Habits", header("Four habits", "Small professional habits compound.") + '<div class="grid-4" style="margin-top:30px"><div class="card"><strong>Name files</strong><p>So a teammate can find them without you.</p></div><div class="card"><strong>Back up first</strong><p>Use OneDrive versioning and save before edits.</p></div><div class="card"><strong>Document logic</strong><p>Explain formulas so future-you can trust them.</p></div><div class="card"><strong>Verify output</strong><p>Open it elsewhere before presenting.</p></div></div>'),
        slide(17, 3, "", "Activity", header("Activity", "Map your career to a tool.") + '<div class="process"><div><b>01</b><span>Name your intended field.</span></div><div><b>02</b><span>Name a technology problem in that role.</span></div><div><b>03</b><span>Choose Excel, Word, or PowerPoint.</span></div><div><b>04</b><span>Name the output: table, chart, report, or deck.</span></div></div><p class="lead" style="margin-top:34px">Eight minutes individual, then share with a partner.</p>'),
        slide(18, 3, "terra", "Common Mistake", '<div class="eyebrow">Common Mistake</div><h2>Confusing "I have used it" with "I can operate it professionally."</h2><div class="grid-2" style="margin-top:36px"><div class="card"><strong>Casual familiarity</strong><p>Typing in Excel, making a slide deck, or saving a file.</p></div><div class="card"><strong>Professional fluency</strong><p>Building the formula, structuring the story, and creating a file system a team can trust.</p></div></div>'),
        slide(19, 4, "", "Discussion", header("Discuss", "Connect the lesson to your own path.") + '<div class="question-grid"><div>Which technology problem is most likely to appear in your intended career?</div><div>Which Microsoft 365 app would you use first, and what would the final output look like?</div></div>'),
        slide(20, 4, "", "Takeaways", header("Key takeaways", "Three ideas should stick.") + '<div style="margin-top:32px"><div class="numbered"><div class="n">01</div><div class="n-body">Business technology is not separate from business decisions.</div></div><div class="numbered"><div class="n">02</div><div class="n-body">Professional operators build, organize, verify, and explain.</div></div><div class="numbered"><div class="n">03</div><div class="n-body">BUS123 moves you from casual use toward career-ready fluency.</div></div></div>'),
        slide(21, 4, "", "Up Next", header("Coming next", "EXCEL-M01 begins the semester of building.") + '<div class="two-col" style="margin-top:30px"><div><p class="lead">Blank sheet. Blank cell. Your first formula. The course now shifts from why technology matters to how to build useful workbooks.</p></div><div class="mini-sheet"><div class="sheet-grid"><span class="head">Task</span><span class="head">Input</span><span class="head">Formula</span><span class="head">Output</span><span>Sales</span><span>120</span><span>=B2*C2</span><span class="result">$1,200</span><span class="alt">Cost</span><span class="alt">75</span><span class="alt">=B3*C3</span><span class="result">$750</span></div></div></div>'),
        slide(22, 4, "dark", "Close", '<div class="eyebrow">Exit ticket</div><h1>One career problem. One tool. One output.</h1><p class="subtitle">Submit your answer before you leave, then bring your file questions to office hours.</p><div class="title-meta"><span>Next: EXCEL-M01</span><span>Creating and editing worksheets</span></div>'),
    ]
    return s, notes


def build_math() -> tuple[list[str], list[str]]:
    notes = [
        "Open by framing this as a pricing decision lesson. Students are not just calculating percentages; they are deciding whether a price can cover cost, waste, and event overhead for Anchor and Oak.",
        "Preview the three-part path: markup, markdown, and break-even. Keep the sequence simple because the formulas build on one another.",
        "Read the objectives and emphasize interpretation. Students need to know what the percentage is based on before trusting an answer.",
        "Use the Anchor and Oak image as the bridge. Event pricing is a good case because capacity, timing, perishability, and labor all matter at the same time.",
        "Start part one by naming the central question: if we know cost and markup, can we set a price that makes sense?",
        "Walk through the terms slowly. Cost, selling price, and gross profit are not interchangeable. The formulas only work when the base is clear.",
        "Show Excel syntax first, then the manual math. This models the course pattern: spreadsheet function or formula first, then the calculation logic underneath.",
        "Use the mini worksheet to make markup feel like a workbook row. Ask students what would change if the markup rate changed.",
        "Transition to markdowns. The business reason changes: now the issue is demand, timing, and inventory that may lose value.",
        "Anchor markdowns in event decisions. Unsold seats, perishable supplies, and late promotions all turn time into a pricing pressure.",
        "Again, show the Excel expression first. Then show the manual selling price after the markdown. Emphasize that markdown is taken from the original selling price.",
        "Use this comparison to separate markup from markdown. One begins with cost and builds up. The other begins with price and moves down.",
        "This is the student decision prompt. Let them vote before revealing the logic. The point is not a single right instinct; it is naming the tradeoff.",
        "Move to break-even. This is the moment where pricing and cost structure meet.",
        "Define fixed cost, variable cost, selling price, and contribution margin. These terms will come back in later workbook work.",
        "Show the contribution margin formula first, then break-even units. Students need to see how price and variable cost connect before solving for volume.",
        "Use the chart as the visual anchor. Break-even is the point where revenue catches total cost. Everything before it is pressure; everything after it creates profit.",
        "Pause on the required common mistake. Students often mix percent bases or divide by price when the formula needs contribution margin.",
        "Use these questions to make the lesson conversational. The best answer should mention both math and business context.",
        "Close with three durable takeaways. Keep markup, markdown, and break-even separate in their minds.",
        "Preview the next lesson as a shift from price decisions to costs that change over time and people.",
        "End with the office-hours prompt and the workbook setup. Students should bring questions about bases, not just arithmetic.",
    ]
    s = [
        slide(1, 0, "dark", "Title", '<div class="eyebrow">BUS123 · MATH-M04-L01</div><h1>Markups, Markdowns, and Break-Even</h1><p class="subtitle">From cost to price decisions at Anchor & Oak Events.</p><div class="title-meta"><span>Business Math</span><span>Anchor & Oak Events</span><span>Fall 2026</span></div>'),
        slide(2, 0, "", "Agenda", header("Today", "Three pricing questions guide the lesson.") + '<div class="grid-3" style="margin-top:38px"><div class="card"><strong>01 Markup</strong><p>How do we turn cost into a selling price?</p></div><div class="card"><strong>02 Markdown</strong><p>How do demand, timing, and waste pressure price?</p></div><div class="card"><strong>03 Break-even</strong><p>How many sales are needed before profit begins?</p></div></div>'),
        slide(3, 0, "", "Objectives", header("I can", "By the end of class, you can do four things.") + '<div style="margin-top:32px"><div class="numbered"><div class="n">01</div><div class="n-body">Calculate markup from cost and selling price.</div></div><div class="numbered"><div class="n">02</div><div class="n-body">Calculate markdowns from original selling price.</div></div><div class="numbered"><div class="n">03</div><div class="n-body">Use contribution margin to estimate break-even units.</div></div><div class="numbered"><div class="n">04</div><div class="n-body">Explain how pricing assumptions affect an event decision.</div></div></div>'),
        slide(4, 0, "", "Bridge", header("Anchor & Oak Events", "Event pricing has to cover more than food.") + '<div class="two-col" style="margin-top:28px"><div><p class="lead">A ticket price has to absorb vendor cost, staffing, setup, unsold capacity, and the risk of perishable inventory. A small pricing error can move the entire event from profit to loss.</p></div><div class="image-card"><img src="img/bus123-math-m04-l01-anchor-oak-events-wide.png" alt="Anchor and Oak Events visual"></div></div>'),
        slide(5, 1, "dark section", "Part 1", '<div class="eyebrow">Part 1 of 3</div><h1>Markup: Turning Cost Into Price</h1><p class="subtitle">The first job is knowing what base the percentage is using.</p>'),
        slide(6, 1, "", "Terms", header("Markup terms", "Keep the base clear before calculating.") + '<div class="grid-3" style="margin-top:30px"><div class="card"><strong>COST</strong><p>What Anchor & Oak pays for food, rentals, supplies, or services.</p></div><div class="card"><strong>SELLING PRICE</strong><p>What the customer pays for the package, ticket, or item.</p></div><div class="card"><strong>GROSS PROFIT</strong><p>The difference between selling price and cost before overhead.</p></div></div>'),
        slide(7, 1, "", "Markup Formula", header("Excel first", "Markup builds up from cost.") + '<div class="formula-panel"><span class="fn">=Cost*(1+MarkupRate)</span>Cost $18.00; markup rate 45%; selling price <span class="result">$26.10</span>.</div><p class="lead">Manual math: $18.00 + ($18.00 x 45%) = $18.00 + $8.10 = $26.10.</p>'),
        slide(8, 1, "", "Markup Worksheet", header("Worksheet row", "A pricing model makes the base visible.") + '<div class="two-col" style="margin-top:28px"><div class="mini-sheet"><div class="sheet-grid"><span class="head">Item</span><span class="head">Cost</span><span class="head">Markup</span><span class="head">Price</span><span>Dessert cup</span><span>$18.00</span><span>45%</span><span class="result">$26.10</span><span class="alt">Table favor</span><span class="alt">$6.50</span><span class="alt">55%</span><span class="result">$10.08</span></div></div><div><p class="lead">The formula is not the whole decision. Anchor & Oak still has to ask whether customers will accept the price.</p></div></div>'),
        slide(9, 2, "dark section", "Part 2", '<div class="eyebrow">Part 2 of 3</div><h1>Markdowns and Perishables</h1><p class="subtitle">Event businesses price for demand, timing, and waste.</p>'),
        slide(10, 2, "", "Markdown Pressure", header("Markdown pressure", "Late demand changes the pricing question.") + '<div class="grid-3" style="margin-top:30px"><div class="card"><strong>Demand</strong><p>Will enough seats fill before the event?</p></div><div class="card"><strong>Timing</strong><p>How late is the promotion or discount?</p></div><div class="card"><strong>Waste</strong><p>What supplies or capacity expire if unsold?</p></div></div>'),
        slide(11, 2, "", "Markdown Formula", header("Excel first", "Markdown moves down from the original price.") + '<div class="formula-panel"><span class="fn">=OriginalPrice*(1-MarkdownRate)</span>Original price $52.00; markdown rate 20%; sale price <span class="result">$41.60</span>.</div><p class="lead">Manual math: $52.00 - ($52.00 x 20%) = $52.00 - $10.40 = $41.60.</p>'),
        slide(12, 2, "", "Markup vs Markdown", header("Do not mix the bases", "Markup and markdown point in opposite directions.") + '<div class="grid-2" style="margin-top:32px"><div class="card"><strong>Markup</strong><p>Starts with cost and builds up to selling price.</p></div><div class="card"><strong>Markdown</strong><p>Starts with selling price and moves down to a sale price.</p></div></div>'),
        slide(13, 2, "", "Decision Prompt", header("Decision prompt", "Should Anchor & Oak discount empty seats?") + '<div class="grid-3" style="margin-top:30px"><div class="card"><strong>Option A</strong><p>Hold price and protect brand position.</p></div><div class="card"><strong>Option B</strong><p>Discount late and recover some contribution.</p></div><div class="card"><strong>Option C</strong><p>Bundle extras instead of lowering the ticket.</p></div></div>'),
        slide(14, 3, "dark section", "Part 3", '<div class="eyebrow">Part 3 of 3</div><h1>Break-Even</h1><p class="subtitle">How many sales does it take before profit begins?</p>'),
        slide(15, 3, "", "Break-Even Terms", header("Break-even terms", "Separate costs that stay fixed from costs that move.") + '<div class="grid-4" style="margin-top:30px"><div class="card"><strong>FC</strong><p>Fixed costs: venue, permit, base staffing, insurance.</p></div><div class="card"><strong>VC</strong><p>Variable cost per guest: food, materials, service labor.</p></div><div class="card"><strong>S</strong><p>Selling price per guest or unit.</p></div><div class="card"><strong>CM</strong><p>Contribution margin: selling price minus variable cost.</p></div></div>'),
        slide(16, 3, "", "Break-Even Formula", header("Excel first", "Break-even divides fixed cost by contribution margin.") + '<div class="formula-panel"><span class="fn">=FixedCosts/(SellingPrice-VariableCost)</span>Fixed costs $3,600; selling price $48; variable cost $27; break-even <span class="result">172 guests</span>.</div><p class="lead">Manual math: $3,600 / ($48 - $27) = $3,600 / $21 = 171.4, rounded up to 172 guests.</p>'),
        slide(17, 3, "", "Break-Even Chart", header("Visual anchor", "Revenue crosses total cost at break-even.") + '<div class="two-col" style="margin-top:28px"><div class="chart"><div class="axis"></div><div class="line cost"></div><div class="line rev"></div><div class="be-dot"></div></div><div><p class="lead">Before the crossing point, each sale reduces the loss. After the crossing point, each additional guest contributes to profit.</p></div></div>'),
        slide(18, 3, "terra", "Common Mistake", '<div class="eyebrow">Common Mistake</div><h2>Using the wrong base for the percentage.</h2><div class="grid-2" style="margin-top:36px"><div class="card"><strong>Wrong move</strong><p>Apply markdown to cost, or divide fixed costs by selling price instead of contribution margin.</p></div><div class="card"><strong>Better move</strong><p>Name the base first: cost, original selling price, or contribution margin.</p></div></div>'),
        slide(19, 4, "", "Discussion", header("Discuss", "Pricing is math plus judgment.") + '<div class="question-grid"><div>When is a lower price the smarter business decision?</div><div>Which assumption matters most for Anchor & Oak: demand, waste, labor, or fixed cost?</div></div>'),
        slide(20, 4, "", "Takeaways", header("Key takeaways", "Three pricing ideas should stick.") + '<div style="margin-top:32px"><div class="numbered"><div class="n">01</div><div class="n-body">Markup starts with cost and builds toward price.</div></div><div class="numbered"><div class="n">02</div><div class="n-body">Markdown starts with original price and moves down.</div></div><div class="numbered"><div class="n">03</div><div class="n-body">Break-even depends on contribution margin, not just sales volume.</div></div></div>'),
        slide(21, 4, "", "Up Next", header("Coming next", "Depreciation and payroll costs.") + '<div class="two-col" style="margin-top:30px"><div><p class="lead">Next, we shift from prices to costs that change across time and people: depreciation, payroll, and the work of matching formulas to messy business realities.</p></div><div class="card"><strong>Workbook bridge</strong><p>Before opening the workbook, identify the base for every percentage and the unit for every cost.</p></div></div>'),
        slide(22, 4, "dark", "Close", '<div class="eyebrow">Questions?</div><h1>Bring the base. Then bring the formula.</h1><p class="subtitle">Office hours are posted on Canvas. Bring workbook questions before the next lesson.</p><div class="title-meta"><span>Next: MATH-M05</span><span>Costs across time and people</span></div>'),
    ]
    return s, notes


def main() -> int:
    intro_slides, intro_notes = build_intro()
    math_slides, math_notes = build_math()
    (ROOT / "INTRO/M01/bus123-intro-m01-l02-slides.html").write_text(
        deck_html("BUS123 · INTRO M01 · L02 — Technology in Everyday Life and Business", intro_notes, intro_slides),
        encoding="utf-8",
    )
    (ROOT / "MATH/M04/bus123-math-m04-l01-slides.html").write_text(
        deck_html("BUS123 · MATH M04 · L01 — Markups, Markdowns, and Break-Even", math_notes, math_slides),
        encoding="utf-8",
    )
    print("Rebuilt INTRO/M01/L02 and MATH/M04/L01 decks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
