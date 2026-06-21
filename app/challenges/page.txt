"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Screen = null | "week" | "workspace";
type Overlay = null | "board" | "blog" | "compose";
type Tab = "dispatch" | "map" | "standings";
type ProbTab = "statement" | "editorial" | "submissions";
type RunState = "idle" | "passed";
type LbTab = "season" | "weekly";
type FeedbackType = "idle" | "good" | "bad";

interface Feedback { type: FeedbackType; text: string; }

const PROBLEMS = [
  { id:"q1", title:"Knight's Shortest Path", difficulty:"Medium", topics:["BFS","Graphs"], acceptance:"38.2%", status:"attempted",
    desc:"On an 8×8 board, a knight starts at a given square and must reach a target square in the fewest moves. Return the minimum number of knight moves, or -1 if unreachable.",
    sampleInput:'start = "a1", target = "h8"', sampleOutput:"6",
    constraints:["Squares are valid board coordinates.","0 <= moves <= 64","The board is exactly 8×8."],
    approach:"Breadth-First Search", complexity:"Time Complexity: O(64)\nSpace Complexity: O(64)",
    editorial:"Model each square as a node and every legal knight move as an edge. A BFS from the start square explores squares in order of distance, so the first time the target is dequeued gives the minimum move count.",
    starter:"from collections import deque\n\ndef min_knight_moves(start, target):\n    moves = [(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)]\n    # your code here\n    return -1\n",
    subs:[{status:"Accepted",timeAgo:"4 mins ago",runtime:"12 ms",memory:"8.1 MB"},{status:"Wrong Answer",timeAgo:"20 mins ago",runtime:"N/A",memory:"N/A"}],
    cases:[{i:'"a1"→"h8"',o:"6"},{i:'"a1"→"b3"',o:"1"},{i:'"a1"→"a1"',o:"0"}] },
  { id:"q2", title:"N-Queens Survival", difficulty:"Hard", topics:["Backtracking"], acceptance:"25.4%", status:"todo",
    desc:"Given the position of a hostile pawn on the board, count the number of ways to place 8 queens so that no two attack each other and none shares a square attacked by the pawn.",
    sampleInput:'pawn = "d3"', sampleOutput:"46",
    constraints:["Exactly one pawn on the board.","Standard N-Queens attack rules apply.","1 <= answer <= 92"],
    approach:"Backtracking with Pruning", complexity:"Time Complexity: O(N!)\nSpace Complexity: O(N)",
    editorial:"Place queens row by row, tracking occupied columns and both diagonals in sets for O(1) conflict checks. Add the pawn-attacked squares to the forbidden set before recursing, then count every complete arrangement.",
    starter:"def count_survival(pawn):\n    n = 8\n    # forbidden = squares attacked by the pawn\n    return 0\n",
    subs:[{status:"Time Limit Exceeded",timeAgo:"1 hour ago",runtime:"N/A",memory:"N/A"}],
    cases:[{i:'"d3"',o:"46"},{i:'"a1"',o:"52"},{i:'"e5"',o:"40"}] },
  { id:"q3", title:"Guarded Diagonals", difficulty:"Medium", topics:["Matrix","Simulation"], acceptance:"41.0%", status:"solved",
    desc:"Given a set of queens on a board, determine which empty squares are safe (attacked by no queen). Return the count of safe squares.",
    sampleInput:'queens = ["a1","e7"]', sampleOutput:"41",
    constraints:["0 <= queens <= 8","All queen positions are distinct."],
    approach:"Ray Casting per Queen", complexity:"Time Complexity: O(N·8)\nSpace Complexity: O(64)",
    editorial:"Mark every square reachable by each queen along its 8 rays until the board edge. Squares left unmarked are safe.",
    starter:"def safe_squares(queens):\n    attacked = set()\n    # cast 8 rays from each queen\n    return 64 - len(attacked) - len(queens)\n",
    subs:[{status:"Accepted",timeAgo:"2 days ago",runtime:"6 ms",memory:"7.2 MB"}],
    cases:[{i:'["a1","e7"]',o:"41"},{i:"[]",o:"64"},{i:'["d4"]',o:"36"}] },
  { id:"q4", title:"The Safe Square", difficulty:"Easy", topics:["Greedy"], acceptance:"54.7%", status:"todo",
    desc:"Given the current week's partially filled board, return any one column in the next unlocked row where a queen can be placed while keeping at least one complete solution alive.",
    sampleInput:"placed = [0,4,7]", sampleOutput:"5",
    constraints:["0 <= placed rows <= 7","At least one valid completion exists."],
    approach:"Constraint Propagation", complexity:"Time Complexity: O(S)\nSpace Complexity: O(S)",
    editorial:"Enumerate all 92 base solutions once. Filter to those consistent with the queens already placed, then any column appearing in that filtered set for the target row is a safe move.",
    starter:"def safe_column(placed):\n    # filter the 92 solutions by placed prefix\n    return -1\n",
    subs:[{status:"Accepted",timeAgo:"3 hours ago",runtime:"2 ms",memory:"6.0 MB"}],
    cases:[{i:"[0,4,7]",o:"5"},{i:"[0]",o:"2"},{i:"[]",o:"0"}] },
  { id:"q5", title:"Pawn's Shadow", difficulty:"Hard", topics:["DP","Bitmask"], acceptance:"22.1%", status:"todo",
    desc:"Count the distinct full 8-queens arrangements that avoid a moving pawn whose forbidden squares change each turn.",
    sampleInput:"turns = 3", sampleOutput:"12",
    constraints:["1 <= turns <= 8","Each turn forbids a non-empty square set."],
    approach:"Bitmask Dynamic Programming", complexity:"Time Complexity: O(N·2^N)\nSpace Complexity: O(2^N)",
    editorial:"Represent occupied columns as a bitmask and process rows as DP layers, encoding diagonal conflicts in shifted masks.",
    starter:"def pawn_shadow(turns):\n    # dp[mask] over rows, intersect across turns\n    return 0\n",
    subs:[{status:"Wrong Answer",timeAgo:"5 hours ago",runtime:"N/A",memory:"N/A"}],
    cases:[{i:"turns=3",o:"12"},{i:"turns=1",o:"92"},{i:"turns=8",o:"4"}] },
];

const BLOG_POSTS = [
  { cat:"announce", tag:"ANNOUNCEMENT", title:"Week 4 is live — The Sabotage", excerpt:"A black pawn now sits on every board. Here is exactly what changes, and how survival bonuses are scored from here to Checkmate.", date:"08 JUN", read:"3 MIN", author:"CodeCell Core", initials:"CC", authorBg:"#D4AF37", votes:"142", comments:"38", tags:["announcement","week4"], tagColor:"#FF4D00", tagBg:"rgba(255,77,0,.12)", tagBorder:"rgba(255,77,0,.3)", body:["For three weeks your board has been yours alone. That changes today. A hostile black pawn now occupies a fixed square on every participant's board, and its diagonal reach rewrites which squares are still safe.","Concretely: any placement that shares a square attacked by the pawn is now an instant dead end. The clues hidden in Chapters I through III pointed to exactly where this pawn would land.","Scoring from here is survival-weighted. A queen that keeps a complete solution alive earns +20. A dead-end placement costs you 15 and auto-corrects to the nearest living path."], commentList:[{author:"tal_fan_42",initials:"TF",bg:"#F5E6A3",time:"2h ago",text:"The pawn on d3 wrecked my whole right flank. Took me three tries to see the safe column."},{author:"zugzwanged",initials:"ZW",bg:"#A8D8FF",time:"1h ago",text:"Underrated detail: the auto-correct still costs points, so don't treat it as a free retry."}] },
  { cat:"editorial", tag:"EDITORIAL", title:"Week 3 · Building Harmony — greedy, or was it DP?", excerpt:"A full walk-through of the intended O(n log n) solution, the two greedy traps that failed, and clean reference code.", date:"07 JUN", read:"8 MIN", author:"Sneha Kulkarni", initials:"SK", authorBg:"#F5E6A3", votes:"96", comments:"21", tags:["editorial","dp","greedy"], tagColor:"#D4AF37", tagBg:"rgba(212,175,55,.1)", tagBorder:"rgba(212,175,55,.3)", body:["Most submissions reached for a greedy sweep and got burned on the third hidden test. The trap: locally optimal placements do not compose into a globally valid board once diagonal constraints stack up.","The intended solution sorts candidate placements by constraint tightness, then resolves ties with a secondary key. This brings the search down to O(n log n).","Reference implementation and the two failing greedy variants are linked below."], commentList:[{author:"nimzo_indian",initials:"NI",bg:"#c9c5ba",time:"5h ago",text:"Wish I had read this before submitting six wrong answers. The tie-break key is the part I missed."}] },
  { cat:"lore", tag:"CHAPTER LORE", title:"Reading the pawn's shadow: a recap of Weeks 1–3", excerpt:"Three weeks, three quiet hints. We decode every clue that pointed to where the sabotage pawn just landed.", date:"06 JUN", read:"5 MIN", author:"Kabir Mehta", initials:"KM", authorBg:"#c9c5ba", votes:"78", comments:"14", tags:["lore","recap"], tagColor:"#F5E6A3", tagBg:"rgba(245,230,163,.1)", tagBorder:"rgba(245,230,163,.3)", body:["Every chapter title hid a coordinate. 'The First Move' was not flavour text — it named a file. 'Building Harmony' pointed at a rank. Put them together and the pawn's square was never a surprise.","This is the meta-game CodeCell has been building toward: the narrative and the puzzle are the same object."], commentList:[] },
  { cat:"editorial", tag:"EDITORIAL", title:"Week 2 · The First Move — two pointers in disguise", excerpt:"Why the sorted-window idea beats the obvious nested loop, with a short proof and a reference implementation.", date:"31 MAY", read:"6 MIN", author:"Rohan Chawla", initials:"RC", authorBg:"#D4AF37", votes:"64", comments:"9", tags:["editorial","two-pointers"], tagColor:"#D4AF37", tagBg:"rgba(212,175,55,.1)", tagBorder:"rgba(212,175,55,.3)", body:["The naive nested loop is O(n²) and times out past n = 10⁴. The key observation is monotonicity: once a window violates the constraint, shrinking from the left can only help.","That gives a clean two-pointer sweep in O(n)."], commentList:[] },
  { cat:"community", tag:"COMMUNITY", title:"Find your study group before New Twist", excerpt:"900+ operatives are already in. Channels split by college and by topic.", date:"05 JUN", read:"2 MIN", author:"Aanya Bishop", initials:"AB", authorBg:"#A8D8FF", votes:"51", comments:"27", tags:["community","discord"], tagColor:"#A8D8FF", tagBg:"rgba(168,216,255,.1)", tagBorder:"rgba(168,216,255,.3)", body:["The Discord is now organised by college and by topic. Whatever your weak spot — graphs, DP, geometry — there is a channel and a study circle for it.","Drop an intro in #arrivals and the mods will route you."], commentList:[{author:"pawnstorm",initials:"PS",bg:"#F5E6A3",time:"6h ago",text:"Joined the SPIT channel, already found two teammates. Highly recommend."}] },
  { cat:"announce", tag:"ANNOUNCEMENT", title:"Skit drop — \"You can't flip the board\"", excerpt:"Pranav as Magnus, Wilbert as Gukesh. Our chess-theme launch film is out.", date:"01 JUN", read:"1 MIN", author:"CodeCell Core", initials:"CC", authorBg:"#D4AF37", votes:"210", comments:"44", tags:["announcement","launch"], tagColor:"#FF4D00", tagBg:"rgba(255,77,0,.12)", tagBorder:"rgba(255,77,0,.3)", body:["Our launch film is live. Two minutes, one chessboard, zero respect for the rules. Watch it on the channel and tag a teammate who always tries to flip the board when losing."], commentList:[] },
];

const WEEK_DEFS = [
  { n:1, title:"THE EMPTY BOARD",    desc:"Your journey begins. An empty board awaits your first move.",      img:"/wk1.png", state:"done",  badge:"✓" },
  { n:2, title:"THE FIRST MOVE",     desc:"You place your first queen. The path unfolds.",                    img:"/wk2.png", state:"done",  badge:"✓" },
  { n:3, title:"BUILDING HARMONY",   desc:"You place more queens. Patterns emerge.",                          img:"/wk3.png", state:"done",  badge:"✓" },
  { n:4, title:"THE SABOTAGE",       desc:"A black pawn appears where you least expect.",                     img:"/wk4.png", state:"alert", badge:"●" },
  { n:5, title:"NEW TWIST",          desc:"Another obstacle appears. Your strategy is tested.",               img:"/wk5.png", state:"locked",badge:"" },
  { n:6, title:"NARROW PATHS",       desc:"Fewer safe squares. Greater consequences.",                        img:"/wk6.png", state:"locked",badge:"" },
  { n:7, title:"THE FINAL STRETCH",  desc:"One last queen. One last decision.",                               img:"/wk7.png", state:"locked",badge:"" },
  { n:8, title:"VICTORY OR LESSON",  desc:"Place the 8th queen. Claim your legend.",                         img:"/wk8.png", state:"locked",badge:"" },
];

function genSolutions(): number[][] {
  const res: number[][] = [];
  const cols = new Set<number>(), d1 = new Set<number>(), d2 = new Set<number>(), cur: number[] = [];
  const bt = (r: number) => {
    if (r === 8) { res.push(cur.slice()); return; }
    for (let c = 0; c < 8; c++) {
      if (cols.has(c) || d1.has(r-c) || d2.has(r+c)) continue;
      cols.add(c); d1.add(r-c); d2.add(r+c); cur.push(c);
      bt(r+1);
      cols.delete(c); d1.delete(r-c); d2.delete(r+c); cur.pop();
    }
  };
  bt(0); return res;
}
const SOLUTIONS = genSolutions();

function consistentSols(placements: (number|null)[]): number[][] {
  return SOLUTIONS.filter(sol => placements.every((c, r) => c == null || sol[r] === c));
}
function validCols(row: number, placements: (number|null)[]): Set<number> {
  const s = new Set<number>();
  consistentSols(placements).forEach(sol => s.add(sol[row]));
  return s;
}
function sq(r: number, c: number) { return "abcdefgh"[c] + (8-r); }

function diffColor(d: string) {
  if (d === "Easy")   return { fg:"#8A8880", bd:"rgba(138,136,128,.3)", bg:"rgba(138,136,128,.08)" };
  if (d === "Medium") return { fg:"#D4AF37", bd:"rgba(212,175,55,.3)",  bg:"rgba(212,175,55,.1)"  };
  return                     { fg:"#FF3333", bd:"rgba(255,51,51,.3)",   bg:"rgba(255,51,51,.1)"   };
}
function pieceFor(p: typeof PROBLEMS[0]) {
  if (p.status === "solved")    return { ch:"♚", col:"#D4AF37" };
  if (p.difficulty === "Easy")  return { ch: p.status==="attempted" ? "♟" : "♙", col:"#8A8880" };
  if (p.difficulty === "Medium")return { ch: p.status==="attempted" ? "♞" : "♘", col:"#D4AF37" };
  return                               { ch: p.status==="attempted" ? "♛" : "♕", col:"#FF3333" };
}

const mono = { fontFamily:"'JetBrains Mono',monospace" } as const;
const serif = { fontFamily:"Georgia,'Times New Roman',serif" } as const;
const GOLD = "#D4AF37";
const BG   = "#0A0A0A";
const HI   = "#F0EDE6";
const MID  = "#8A8880";
const BRD  = "#2A2A2A";

export default function WeeklyChallengesPage() {
  const [tab, setTab]                   = useState<Tab>("dispatch");
  const [screen, setScreen]             = useState<Screen>(null);
  const [overlay, setOverlay]           = useState<Overlay>(null);
  const [activeWeek, setActiveWeek]     = useState(4);
  const [activeProblem, setActiveProblem] = useState("q1");
  const [probTab, setProbTab]           = useState<ProbTab>("statement");
  const [code, setCode]                 = useState(PROBLEMS[0].starter);
  const [language, setLanguage]         = useState("Python");
  const [runState, setRunState]         = useState<RunState>("idle");
  const [lbTab, setLbTab]               = useState<LbTab>("season");
  const [filter, setFilter]             = useState("all");
  const [activeBlog, setActiveBlog]     = useState(0);
  const [blogComments, setBlogComments] = useState<{author:string;initials:string;bg:string;time:string;text:string}[]>([]);
  const [newComment, setNewComment]     = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeBody, setComposeBody]   = useState("");
  const [composeCat, setComposeCat]     = useState("editorial");
  const [composeDone, setComposeDone]   = useState(false);
  const [placements, setPlacements]     = useState<(number|null)[]>([0,4,7,null,null,null,null,null]);
  const [activeRow, setActiveRow]       = useState<number|null>(3);
  const [feedback, setFeedback]         = useState<Feedback>({ type:"idle", text:"Week 4 is unlocked. Click a glowing safe square in your highlighted row to place your fourth queen — and keep clear of the sabotage pawn." });
  const [isMounted, setIsMounted]       = useState(false);
  useEffect(() => setIsMounted(true), []);

  const PAWN_R = 5, PAWN_C = 3;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (overlay) setOverlay(null);
      else if (screen === "workspace") setScreen("week");
      else if (screen === "week") setScreen(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [overlay, screen]);

  const placeQueen = useCallback((col: number) => {
    if (activeRow == null) return;
    const valid = validCols(activeRow, placements);
    const np = placements.slice();
    if (valid.has(col)) {
      np[activeRow] = col;
      setPlacements(np); setActiveRow(null);
      setFeedback({ type:"good", text:`Queen holds ${sq(activeRow,col)}. +20 path bonus — your board still completes a valid solution.` });
    } else {
      const fix = [...valid][0];
      np[activeRow] = fix;
      setPlacements(np); setActiveRow(null);
      setFeedback({ type:"bad", text:`${sq(activeRow,col)} collapses every remaining solution — a dead end. −15 pts, queen auto-corrected to ${sq(activeRow,fix)} to keep you alive.` });
    }
  }, [activeRow, placements]);

  const resetBoard = () => {
    setPlacements([0,4,7,null,null,null,null,null]);
    setActiveRow(3);
    setFeedback({ type:"idle", text:"Week 4 is unlocked. Click a glowing safe square in your highlighted row to place your fourth queen — and keep clear of the sabotage pawn." });
  };

  const openWeek = (n: number) => { setActiveWeek(n); setScreen("week"); setOverlay(null); };
  const openProblem = (id: string) => {
    const p = PROBLEMS.find(x => x.id === id)!;
    setActiveProblem(id); setScreen("workspace"); setProbTab("statement"); setCode(p.starter); setRunState("idle");
  };
  const switchProblem = (id: string) => {
    const p = PROBLEMS.find(x => x.id === id)!;
    setActiveProblem(id); setProbTab("statement"); setCode(p.starter); setRunState("idle");
  };
  const openBlog = (idx: number) => {
    const post = BLOG_POSTS[idx];
    setActiveBlog(idx); setOverlay("blog");
    setBlogComments(post.commentList ? [...post.commentList] : []);
    setNewComment("");
  };
  const addComment = () => {
    const txt = newComment.trim(); if (!txt) return;
    setBlogComments(prev => [...prev, { author:"You (Arjun R.)", initials:"AR", bg:"linear-gradient(135deg,#D4AF37,#8a7220)", time:"just now", text:txt }]);
    setNewComment("");
  };
  const cycleLang = () => { const langs = ["Python","C++","Java"]; setLanguage(l => langs[(langs.indexOf(l)+1)%langs.length]); };

  const prob = PROBLEMS.find(p => p.id === activeProblem) || PROBLEMS[0];
  const probIdx = PROBLEMS.findIndex(p => p.id === activeProblem);
  const pd = diffColor(prob.difficulty);
  const validNow = activeRow != null ? validCols(activeRow, placements) : new Set<number>();
  const placed = placements.filter(x => x != null).length;
  const bp = BLOG_POSTS[activeBlog];

  type LbRow = { rank: string; name?: string; college?: string; pts?: string; piece?: string; me?: boolean };
  const SEASON_ROWS: LbRow[] = [
    { rank:"#1",  name:"Ayush Mehrotra", college:"IIT BOMBAY",    pts:"2850", piece:"♚" },
    { rank:"#2",  name:"Rohan Chawla",   college:"VJTI MUMBAI",   pts:"2740", piece:"♛" },
    { rank:"#3",  name:"Sneha Kulkarni", college:"COEP PUNE",     pts:"2610", piece:"♞" },
    { rank:"#4",  name:"Kabir Mehta",    college:"NIT SURATHKAL", pts:"2550", piece:"♝" },
    { rank:"#5",  name:"Divya Shah",     college:"BITS PILANI",   pts:"2495", piece:"♜" },
    { rank:"gap" },
    { rank:"#46", name:"Pawan Storm",  college:"SPIT MUMBAI",  pts:"620", piece:"♟" },
    { rank:"#47", name:"You",          college:"TSEC MUMBAI",  pts:"612", piece:"♛", me:true },
    { rank:"#48", name:"Castle King",  college:"DJ SANGHVI",   pts:"601", piece:"♟" },
  ];
  const WEEKLY_ROWS: LbRow[] = [
    { rank:"#1", name:"Knight Rider",  college:"KJ SOMAIYA",   pts:"100", piece:"♚" },
    { rank:"#2", name:"Aanya Bishop",  college:"TSEC MUMBAI",  pts:"100", piece:"♛" },
    { rank:"#3", name:"Veer Gambit",   college:"VESIT MUMBAI", pts:"96",  piece:"♞" },
    { rank:"#4", name:"Ishan Fork",    college:"PICT PUNE",    pts:"92",  piece:"♝" },
    { rank:"#5", name:"Tara Passant",  college:"RAIT NAVI",    pts:"88",  piece:"♜" },
    { rank:"gap" },
    { rank:"#11", name:"Pawan Storm", college:"SPIT MUMBAI", pts:"74", piece:"♟" },
    { rank:"#12", name:"You",         college:"TSEC MUMBAI", pts:"70", piece:"♛", me:true },
    { rank:"#13", name:"Castle King", college:"DJ SANGHVI",  pts:"66", piece:"♟" },
  ];
  const lbRows = lbTab === "season" ? SEASON_ROWS : WEEKLY_ROWS;
  const meRow = lbRows.find(r => r.me);
  const meIdx = meRow ? lbRows.indexOf(meRow) : -1;
  const aheadRow = meIdx > 0 ? lbRows[meIdx-1] : undefined;

  const fbMap = {
    idle: { bg:"rgba(212,175,55,.06)", bd:"rgba(212,175,55,.25)", col:"#cbbf9e", icon:"♟", ic:GOLD },
    good: { bg:"rgba(212,175,55,.09)", bd:"rgba(212,175,55,.4)",  col:"#e6dcbf", icon:"♛", ic:GOLD },
    bad:  { bg:"rgba(255,77,0,.08)",   bd:"rgba(255,77,0,.4)",    col:"#f0c4ad", icon:"⚠", ic:"#FF4D00" },
  };
  const fb = fbMap[feedback.type];

  return (
    <>
    <div style={{ minHeight:"100vh", background:BG, color:HI, fontFamily:"'Inter',sans-serif", WebkitFontSmoothing:"antialiased" }}>
      <style>{`
        @keyframes wcpulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes wcdrop{0%{transform:translateY(-10px) scale(.5);opacity:0}60%{transform:translateY(2px) scale(1.06);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes wcthreat{0%,100%{filter:drop-shadow(0 0 6px rgba(255,77,0,.6))}50%{filter:drop-shadow(0 0 16px rgba(255,77,0,1))}}
        @keyframes wcfade{from{opacity:0}to{opacity:1}}
        @keyframes wcrise{from{opacity:0;transform:scale(.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .wc-week:hover{border-color:rgba(212,175,55,.5)!important}
        .wc-week:hover .wc-card-img{opacity:.85!important;transform:scale(1.05)!important;filter:grayscale(0) brightness(1)!important}
        .wc-post:hover{background:rgba(212,175,55,.04)!important;border-left-color:#D4AF37!important}
        .wc-post:hover .wc-post-title{color:#D4AF37!important}
        .wc-prow:hover{background:#111!important;border-color:rgba(212,175,55,.5)!important}
        .wc-prow:hover .wc-ptitle{color:#D4AF37!important}
        .wc-tag:hover{border-color:rgba(212,175,55,.5)!important;color:#D4AF37!important}
        .wc-input:focus{outline:none;border-color:#D4AF37!important}
        .wc-close:hover{border-color:#D4AF37!important;color:#D4AF37!important}
        .wc-runbtn:hover{background:#1c1c1c!important}
        .wc-back:hover{color:#D4AF37!important}
        .wc-cta:hover{background:rgba(212,175,55,.14)!important}
        .wc-open:hover{background:#F5E6A3!important}
        .wc-scroll::-webkit-scrollbar{width:6px}
        .wc-scroll::-webkit-scrollbar-thumb{background:#2A2A2A}
        .wc-card-img{transition:opacity .7s ease,transform .7s ease,filter .7s ease}
      `}</style>

      <div style={{ maxWidth:1320, margin:"0 auto", padding:"40px 32px 0" }}>

        {/* ── HERO ── */}
        <div style={{ border:`1px solid ${BRD}`, background:BG, position:"relative", overflow:"hidden", marginBottom:20 }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 88% 10%,rgba(212,175,55,.12),transparent 55%)", pointerEvents:"none" }} />
          <img src="/golden_queen_hero.png" alt="" style={{ position:"absolute", right:-40, top:"50%", transform:"translateY(-50%)", height:"118%", opacity:.16, mixBlendMode:"screen", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:2, display:"grid", gridTemplateColumns:"1.35fr 1fr", gap:44, padding:"48px 52px", alignItems:"center" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 13px", border:"1px solid rgba(104,220,140,.45)", background:"rgba(104,220,140,.08)", ...mono, fontSize:10, letterSpacing:".18em", color:"#68DC8C", textTransform:"uppercase" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#68DC8C", boxShadow:"0 0 8px #68DC8C", animation:"wcpulse 1.6s infinite" }} />
                  LIVE · PROBLEMS OPEN
                </span>
                <span style={{ ...mono, fontSize:11, letterSpacing:".18em", color:MID }}>CHAPTER IV / 08</span>
              </div>
              <h1 style={{ ...serif, fontSize:64, letterSpacing:".06em", lineHeight:1, color:HI, fontWeight:400, marginBottom:16 }}>THE SABOTAGE</h1>
              <p style={{ ...serif, fontStyle:"italic", fontSize:16, color:GOLD, marginBottom:18 }}>N-Queens · Backtracking</p>
              <p style={{ fontSize:14.5, lineHeight:1.7, color:MID, maxWidth:500, marginBottom:32 }}>A black pawn appears where you least expect it. The board you have built for three weeks is no longer yours alone — its shadow falls across diagonals you thought were safe. Place your fourth queen and survive the ambush.</p>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <button onClick={() => openWeek(4)} className="wc-open" style={{ display:"flex", alignItems:"center", gap:11, border:"none", background:GOLD, padding:"17px 30px", ...mono, fontSize:11, fontWeight:700, letterSpacing:".18em", color:BG, textTransform:"uppercase" as const, cursor:"pointer", transition:"background .2s" }}>
                  ENTER WEEK 4 · 5 PROBLEMS <span style={{ fontSize:14 }}>→</span>
                </button>
                <button onClick={() => setOverlay("board")} style={{ display:"flex", alignItems:"center", gap:10, border:"1px solid rgba(212,175,55,.4)", background:"transparent", padding:"16px 24px", ...mono, fontSize:11, fontWeight:700, letterSpacing:".16em", color:GOLD, textTransform:"uppercase" as const, cursor:"pointer" }}>
                  OPEN THE BOARD
                </button>
              </div>
            </div>
            <div style={{ border:`1px solid ${BRD}`, background:"rgba(8,8,8,.7)", backdropFilter:"blur(4px)" }}>
              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${BRD}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:MID, textTransform:"uppercase" as const }}>SUBMISSIONS CLOSE IN</span>
                <span style={{ display:"flex", alignItems:"center", gap:6, ...mono, fontSize:10, letterSpacing:".12em", color:GOLD }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>
                  LIVE
                </span>
              </div>
              <div style={{ display:"flex", gap:0, padding:"24px 22px", justifyContent:"space-between" }}>
                {[{v:"04",l:"DAYS"},{v:"22",l:"HOURS"},{v:"14",l:"MINS"}].map(u => (
                  <div key={u.l} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ ...mono, fontSize:40, fontWeight:600, color:HI, lineHeight:1 }}>{u.v}</div>
                    <div style={{ ...mono, fontSize:9, letterSpacing:".2em", color:MID, textTransform:"uppercase" as const, marginTop:8 }}>{u.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderTop:`1px solid ${BRD}` }}>
                <div style={{ padding:"16px 22px", borderRight:`1px solid ${BRD}` }}>
                  <div style={{ ...mono, fontSize:9, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, marginBottom:7 }}>OPERATIVES IN</div>
                  <div style={{ ...mono, fontSize:17, color:HI }}>14,832</div>
                </div>
                <div style={{ padding:"16px 22px" }}>
                  <div style={{ ...mono, fontSize:9, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, marginBottom:7 }}>WEEK REWARD</div>
                  <div style={{ ...mono, fontSize:17, color:GOLD }}>100 PTS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── UPCOMING STRIP ── */}
        <div style={{ border:`1px solid ${BRD}`, background:"#080808", position:"relative", overflow:"hidden", marginBottom:44, display:"flex", alignItems:"center", gap:32, flexWrap:"wrap" as const, padding:"26px 32px" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:BRD }} />
          <div style={{ display:"flex", alignItems:"center", gap:18, flex:1, minWidth:280 }}>
            <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:46, height:46, border:`1px solid ${BRD}`, background:BG, flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.4"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.2" r="1.3" fill={MID} stroke="none"/></svg>
            </span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:7 }}>
                <span style={{ padding:"4px 11px", border:"1px solid #3a3a3a", ...mono, fontSize:9, letterSpacing:".18em", color:MID, textTransform:"uppercase" as const }}>UPCOMING · CHAPTER V</span>
              </div>
              <div style={{ ...serif, fontSize:22, letterSpacing:".06em", color:"#c9c5ba" }}>NEW TWIST</div>
              <div style={{ ...mono, fontSize:11, letterSpacing:".06em", color:"#5A5A55", marginTop:4 }}>Another obstacle joins the board.</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:22 }}>
            <span style={{ ...mono, fontSize:10, letterSpacing:".16em", color:MID, textTransform:"uppercase" as const }}>Problems unlock in</span>
            <div style={{ display:"flex", gap:14 }}>
              {[{v:"02",l:"DAYS"},{v:"14",l:"HRS"},{v:"06",l:"MIN"}].map(u => (
                <div key={u.l} style={{ textAlign:"center", border:`1px solid ${BRD}`, padding:"10px 14px", minWidth:58 }}>
                  <div style={{ ...mono, fontSize:24, fontWeight:600, color:GOLD, lineHeight:1 }}>{u.v}</div>
                  <div style={{ ...mono, fontSize:8, letterSpacing:".16em", color:MID, textTransform:"uppercase" as const, marginTop:5 }}>{u.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ border:`1px solid ${BRD}`, background:BG, marginBottom:56 }}>
          <div style={{ display:"flex", borderBottom:`1px solid ${BRD}`, background:"#080808" }}>
            {(["dispatch","map","standings"] as Tab[]).map((t,i) => {
              const labels: Record<Tab,string> = { dispatch:"THE DISPATCH", map:"SEASON MAP", standings:"STANDINGS" };
              return (
                <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:16, ...mono, fontSize:12, fontWeight:600, letterSpacing:".14em", cursor:"pointer", outline:"none", border:"none", borderRight: i<2 ? `1px solid ${BRD}` : "none", borderBottom: `2px solid ${tab===t ? GOLD : "transparent"}`, background: tab===t ? BG : "#080808", color: tab===t ? GOLD : MID, transition:"all .2s ease" }}>
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* DISPATCH */}
          {tab === "dispatch" && (
            <div style={{ padding:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22, flexWrap:"wrap" as const, gap:16 }}>
                <div>
                  <h2 style={{ ...serif, fontSize:23, letterSpacing:".08em", color:HI, textTransform:"uppercase" as const }}>Notes From The Board</h2>
                  <p style={{ ...mono, fontSize:11, letterSpacing:".08em", color:MID, marginTop:6 }}>ANNOUNCEMENTS · EDITORIALS · CHAPTER LORE</p>
                </div>
                <button onClick={() => { setOverlay("compose"); setComposeDone(false); setComposeTitle(""); setComposeBody(""); setComposeCat("editorial"); }} className="wc-open" style={{ display:"flex", alignItems:"center", gap:9, border:"none", background:GOLD, padding:"11px 20px", ...mono, fontSize:10, fontWeight:700, letterSpacing:".14em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  WRITE A POST
                </button>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:20 }}>
                {["all","announce","editorial","lore","community"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding:"8px 13px", ...mono, fontSize:10, letterSpacing:".12em", cursor:"pointer", transition:"all .2s ease", background: filter===f ? GOLD : BG, color: filter===f ? BG : MID, border: filter===f ? `1px solid ${GOLD}` : `1px solid ${BRD}` }}>
                    {f === "all" ? "ALL" : f === "announce" ? "ANNOUNCEMENTS" : f === "editorial" ? "EDITORIALS" : f === "lore" ? "LORE" : "COMMUNITY"}
                  </button>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 290px", gap:28, alignItems:"start" }}>
                <div className="wc-scroll" style={{ border:`1px solid ${BRD}`, background:"#080808", maxHeight:560, overflowY:"auto" }}>
                  {BLOG_POSTS.filter(p => filter === "all" || p.cat === filter).map((p, i, arr) => (
                    <div key={i} onClick={() => openBlog(BLOG_POSTS.indexOf(p))} className="wc-post" style={{ display:"flex", gap:22, padding:22, cursor:"pointer", borderLeft:"2px solid transparent", borderBottom: i < arr.length-1 ? "1px solid #1c1c1c" : "none", transition:"background .2s,border-color .2s" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                          <span style={{ padding:"4px 10px", ...mono, fontSize:9, fontWeight:600, letterSpacing:".12em", border:`1px solid ${p.tagBorder}`, background:p.tagBg, color:p.tagColor }}>{p.tag}</span>
                          <span style={{ ...mono, fontSize:10, letterSpacing:".08em", color:"#4A4A4A" }}>{p.date} · {p.read}</span>
                        </div>
                        <h3 className="wc-post-title" style={{ ...serif, fontSize:18, lineHeight:1.3, color:HI, letterSpacing:".02em", transition:"color .2s", marginBottom:8 }}>{p.title}</h3>
                        <p style={{ fontSize:12.5, color:MID, lineHeight:1.55, marginBottom:12 }}>{p.excerpt}</p>
                        <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap" as const }}>
                          <span style={{ display:"flex", alignItems:"center", gap:7, ...mono, fontSize:11, color:MID }}>
                            <span style={{ width:18, height:18, borderRadius:"50%", background:p.authorBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:BG }}>{p.initials}</span>
                            {p.author}
                          </span>
                          {p.tags.map(t => <span key={t} className="wc-tag" style={{ ...mono, fontSize:10, letterSpacing:".05em", color:"#5A5A55", border:"1px solid #1c1c1c", padding:"3px 8px", transition:"all .2s" }}>#{t}</span>)}
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column" as const, alignItems:"center", gap:12, paddingLeft:22, borderLeft:"1px solid #1c1c1c", alignSelf:"stretch", justifyContent:"center", minWidth:62 }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ ...mono, fontSize:15, fontWeight:600, color:GOLD }}>▲ {p.votes}</div>
                          <div style={{ ...mono, fontSize:8, letterSpacing:".1em", color:"#4A4A4A", textTransform:"uppercase" as const, marginTop:3 }}>VOTES</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, ...mono, fontSize:13, color:MID }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"/></svg>
                          {p.comments}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column" as const, gap:20 }}>
                  <div style={{ border:"1px solid rgba(212,175,55,.3)", background:"rgba(212,175,55,.04)", padding:22 }}>
                    <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:14 }}>// PLAY_THIS_WEEK</span>
                    <p style={{ fontSize:12.5, color:"#c9c5ba", lineHeight:1.6, marginBottom:16 }}>Week 4 is live. Five problems are open and the board awaits your fourth queen.</p>
                    <button onClick={() => openWeek(4)} className="wc-open" style={{ width:"100%", border:"none", background:GOLD, padding:13, ...mono, fontSize:10, fontWeight:700, letterSpacing:".16em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>ENTER WEEK 4</button>
                  </div>
                  <div style={{ border:`1px solid ${BRD}`, background:"#080808", padding:22 }}>
                    <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:14 }}>// TOP_AUTHORS</span>
                    <div style={{ display:"flex", flexDirection:"column" as const, gap:13 }}>
                      {[{name:"CodeCell Core",initials:"CC",bg:GOLD,posts:"12"},{name:"Sneha Kulkarni",initials:"SK",bg:"#F5E6A3",posts:"7"},{name:"Rohan Chawla",initials:"RC",bg:"#c9c5ba",posts:"5"},{name:"Kabir Mehta",initials:"KM",bg:"#A8D8FF",posts:"4"}].map(a => (
                        <div key={a.name} style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <span style={{ width:26, height:26, borderRadius:"50%", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:BG }}>{a.initials}</span>
                          <span style={{ flex:1, fontSize:13, color:HI }}>{a.name}</span>
                          <span style={{ ...mono, fontSize:11, color:GOLD }}>{a.posts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEASON MAP */}
          {tab === "map" && (
            <div style={{ padding:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24, flexWrap:"wrap" as const, gap:12 }}>
                <div>
                  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:19, letterSpacing:".1em", color:HI, textTransform:"uppercase" as const, fontWeight:600 }}>8 WEEKS. 8 QUEENS. INFINITE PATHS.</h2>
                  <p style={{ ...serif, fontStyle:"italic", fontSize:14, color:MID, marginTop:6 }}>Open any unlocked week to face its five problems.</p>
                </div>
                <span style={{ ...mono, fontSize:11, letterSpacing:".1em", color:GOLD }}>4 / 8 PLAYED</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {WEEK_DEFS.map(w => {
                  const locked = w.state === "locked";
                  const cardStyle = locked
                    ? { border:`1px solid ${BRD}`, background:"rgba(17,17,17,.8)", cursor:"not-allowed" }
                    : w.state === "alert"
                      ? { border:"1px solid rgba(255,77,0,.45)", background:"rgba(255,77,0,.08)", cursor:"pointer" }
                      : { border:"1px solid rgba(212,175,55,.4)", background:"rgba(212,175,55,.06)", cursor:"pointer" };
                  const imgStyle = locked
                    ? { opacity:.18, filter:"grayscale(1) brightness(.35)" }
                    : w.state === "alert"
                      ? { opacity:.4, filter:"grayscale(.2) brightness(.85) saturate(1.2)" }
                      : { opacity:.4, filter:"grayscale(0) brightness(1.05)" };
                  const wkColor = locked ? "#6A6A66" : w.state === "alert" ? "#FF4D00" : GOLD;
                  const titleColor = locked ? MID : w.state === "alert" ? "#FF4D00" : HI;
                  return (
                    <div key={w.n} className="wc-week" onClick={locked ? undefined : () => openWeek(w.n)}
                      style={{ position:"relative", overflow:"hidden", minHeight:212, padding:22, display:"flex", flexDirection:"column" as const, justifyContent:"space-between", transition:"border-color .4s ease", ...cardStyle }}>
                      <img src={w.img} alt="" className="wc-card-img" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" as const, ...imgStyle }} />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(10,10,10,.94),rgba(10,10,10,.5) 45%,rgba(10,10,10,.94))", zIndex:2 }} />
                      <div style={{ position:"relative", zIndex:3, display:"flex", flexDirection:"column" as const, justifyContent:"space-between", height:"100%", textShadow:"0 2px 8px rgba(0,0,0,.95)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div>
                            <span style={{ ...mono, fontSize:9, letterSpacing:".2em", textTransform:"uppercase" as const, display:"block", marginBottom:6, color:wkColor }}>WEEK {w.n}</span>
                            <h4 style={{ ...serif, fontSize:13, letterSpacing:".12em", color:titleColor }}>{w.title}</h4>
                          </div>
                          {locked ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A66" strokeWidth="1.5"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                          ) : (
                            <span style={{ ...mono, fontSize:11, color:wkColor }}>{w.badge}</span>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize:11.5, color:MID, lineHeight:1.5, marginBottom:10 }}>{w.desc}</p>
                          {!locked && <span style={{ ...mono, fontSize:9, letterSpacing:".14em", color:GOLD, textTransform:"uppercase" as const }}>VIEW 5 PROBLEMS →</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STANDINGS */}
          {tab === "standings" && (
            <div style={{ padding:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap" as const, gap:12 }}>
                <div>
                  <h2 style={{ ...serif, fontSize:23, letterSpacing:".08em", color:HI, textTransform:"uppercase" as const }}>The Standings</h2>
                  <p style={{ ...mono, fontSize:11, letterSpacing:".08em", color:MID, marginTop:6 }}>14,832 OPERATIVES · 37 COLLEGES</p>
                </div>
                <div style={{ display:"flex", border:`1px solid ${BRD}` }}>
                  {(["season","weekly"] as LbTab[]).map(t => (
                    <button key={t} onClick={() => setLbTab(t)} style={{ padding:"9px 16px", ...mono, fontSize:11, letterSpacing:".12em", cursor:"pointer", border:"none", background: lbTab===t ? GOLD : "transparent", color: lbTab===t ? BG : MID }}>
                      {t === "season" ? "SEASON" : "WEEK 04"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1.55fr 1fr", gap:24, alignItems:"start" }}>
                <div style={{ border:`1px solid ${BRD}`, background:"#080808" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 150px 90px", padding:"13px 22px", borderBottom:`1px solid ${BRD}` }}>
                    {["RANK","OPERATIVE","COLLEGE","POINTS"].map(h => (
                      <span key={h} style={{ ...mono, fontSize:9, letterSpacing:".18em", color:MID, textTransform:"uppercase" as const, textAlign: h==="POINTS" ? "right" : "left" as any }}>{h}</span>
                    ))}
                  </div>
                  {lbRows.map((r: any, i: number) => r.rank === "gap" ? (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"8px 0", color:BRD, letterSpacing:5, fontSize:11, borderBottom:"1px solid #161616" }}>· · ·</div>
                  ) : (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"70px 1fr 150px 90px", alignItems:"center", padding:"14px 22px", borderBottom:"1px solid #161616", background: r.me ? "rgba(212,175,55,.08)" : "transparent", boxShadow: r.me ? "inset 3px 0 0 #D4AF37" : "none" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <span style={{ ...mono, fontSize:13, color: r.me || r.rank==="#1" ? GOLD : MID }}>{r.rank}</span>
                        <span style={{ fontSize:16, color: r.me || r.rank==="#1" ? GOLD : MID }}>{r.piece}</span>
                      </span>
                      <span style={{ fontSize:14, fontWeight:500, color: r.me ? GOLD : HI, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</span>
                      <span style={{ ...mono, fontSize:11, color:MID, letterSpacing:".05em" }}>{r.college}</span>
                      <span style={{ ...mono, fontSize:14, fontWeight:600, color: r.me ? GOLD : HI, textAlign:"right" as const }}>{r.pts}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border:"1px solid rgba(212,175,55,.3)", background:"rgba(212,175,55,.04)", padding:24, display:"flex", flexDirection:"column" as const, gap:18 }}>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const }}>// YOUR_POSITION</span>
                  <div style={{ display:"flex", alignItems:"baseline", gap:14 }}>
                    <span style={{ ...mono, fontSize:44, color:GOLD, lineHeight:1 }}>{meRow?.rank}</span>
                    <div>
                      <div style={{ ...mono, fontSize:13, color:HI }}>{meRow?.pts} PTS</div>
                      <div style={{ ...mono, fontSize:10, color:MID, letterSpacing:".1em", marginTop:3 }}>{lbTab === "season" ? "SEASON STANDING" : "WEEK 04 STANDING"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"13px 15px", border:"1px solid rgba(212,175,55,.28)", background:"rgba(212,175,55,.06)" }}>
                    <span style={{ color:GOLD, fontSize:13, lineHeight:1.4 }}>▲</span>
                    <span style={{ fontSize:12, lineHeight:1.5, color:"#c9b98a" }}>
                      <span style={{ color:GOLD, fontWeight:600, ...mono }}>{aheadRow?.pts && meRow?.pts ? (parseInt(aheadRow.pts) - parseInt(meRow.pts)) + " PTS" : ""}</span> behind rank <span style={{ ...mono }}>{aheadRow?.rank}</span> — clear Week 4 to overtake.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── COMMUNITY ── */}
        <div style={{ border:`1px solid ${BRD}`, background:BG, position:"relative", overflow:"hidden", marginBottom:56, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap" as const, padding:40 }}>
          <img src="/chess_knight_bg.png" alt="" style={{ position:"absolute", right:-30, bottom:-50, width:280, opacity:.07, pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:2 }}>
            <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, display:"block", marginBottom:12 }}>// FIND_YOUR_PEOPLE</span>
            <h2 style={{ ...serif, fontSize:26, letterSpacing:".06em", color:HI, lineHeight:1.2, maxWidth:520 }}>Across 37 colleges, the board is shared. Trade ideas the moment editorials drop.</h2>
          </div>
          <div style={{ display:"flex", gap:12, position:"relative", zIndex:2 }}>
            <button className="wc-cta" style={{ border:"1px solid rgba(212,175,55,.5)", background:"rgba(212,175,55,.06)", padding:"14px 24px", ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, cursor:"pointer", whiteSpace:"nowrap" as const }}>[ JOIN DISCORD ]</button>
            <button className="wc-cta" style={{ border:`1px solid ${BRD}`, background:"transparent", padding:"14px 24px", ...mono, fontSize:10, letterSpacing:".2em", color:HI, textTransform:"uppercase" as const, cursor:"pointer", whiteSpace:"nowrap" as const }}>[ WHATSAPP ]</button>
          </div>
        </div>

      </div>
    </div>

    {isMounted && createPortal(<>
      {/* ══════════════ WEEK FULL-SCREEN ══════════════ */}
      {screen === "week" && (
        <div className="wc-scroll" style={{ position:"fixed", inset:0, zIndex:90, background:BG, overflowY:"auto", animation:"wcfade .25s ease" }}>
          <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:"radial-gradient(900px 620px at 82% -6%, rgba(212,175,55,.12), transparent 62%)" }} />
          <img src="/golden_queen_hero.png" alt="" style={{ position:"fixed", right:-90, top:"50%", transform:"translateY(-50%)", height:"128%", opacity:.07, mixBlendMode:"screen", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"sticky", top:0, zIndex:5, borderBottom:`1px solid ${BRD}`, background:"rgba(8,8,8,.92)", backdropFilter:"blur(12px)" }}>
            <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={() => setScreen(null)} className="wc-back" style={{ display:"flex", alignItems:"center", gap:7, border:"none", background:"transparent", ...mono, fontSize:11, letterSpacing:".14em", color:MID, cursor:"pointer", transition:"color .2s" }}>‹ RETURN TO CHALLENGES</button>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <img src="/logo.png" alt="" style={{ width:20, height:20, objectFit:"contain" }} />
                <span style={{ ...mono, fontSize:12, fontWeight:700, letterSpacing:".16em", color:HI }}>TSEC CODECELL_</span>
              </div>
            </div>
          </div>
          <div style={{ maxWidth:1240, margin:"0 auto", padding:"44px 32px 72px", position:"relative", zIndex:1 }}>
            <div style={{ paddingBottom:30, marginBottom:36, borderBottom:"1px solid #1c1c1c" }}>
              <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, display:"block", marginBottom:14 }}>// WEEK_0{activeWeek}.TRIAL</span>
              <h1 style={{ ...serif, fontSize:56, fontWeight:500, letterSpacing:".03em", color:GOLD, textTransform:"uppercase" as const, lineHeight:1, textShadow:"0 0 30px rgba(212,175,55,.28)" }}>
                {WEEK_DEFS.find(w => w.n === activeWeek)?.title || "THE SABOTAGE"}
              </h1>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:18, flexWrap:"wrap" as const, ...mono, fontSize:12.5, color:MID }}>
                <span>Sun 08 — Sat 14 Jun 2026, IST</span>
                <span style={{ color:BRD }}>|</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:7, color:"#68DC8C" }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#68DC8C", boxShadow:"0 0 8px #68DC8C", animation:"wcpulse 1.6s infinite" }} />
                  LIVE NOW
                </span>
                <span style={{ color:BRD }}>|</span>
                <span style={{ color:GOLD }}>100 PTS REWARD</span>
                <span style={{ color:BRD }}>|</span>
                <span>14,832 IN PLAY</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:26, flexWrap:"wrap" as const }}>
                <button onClick={() => setOverlay("board")} className="wc-open" style={{ display:"flex", alignItems:"center", gap:10, border:"none", background:GOLD, padding:"13px 24px", ...mono, fontSize:11, fontWeight:700, letterSpacing:".14em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={BG} stroke="none"><path d="M6 4l13 8-13 8Z"/></svg>
                  OPEN THE BOARD
                </button>
                <button onClick={() => { setOverlay("compose"); setComposeDone(false); }} className="wc-runbtn" style={{ display:"flex", alignItems:"center", gap:9, border:`1px solid ${BRD}`, background:"#111", padding:"12px 18px", ...mono, fontSize:11, letterSpacing:".1em", color:MID, cursor:"pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.7"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"/></svg>
                  DISCUSS
                </button>
                <button onClick={() => setTab("standings")} className="wc-runbtn" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:42, height:42, border:`1px solid ${BRD}`, background:"#111", color:MID, cursor:"pointer" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.7"><path d="M5 21V10M12 21V4M19 21v-7"/></svg>
                </button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1.55fr 1fr", gap:44, alignItems:"start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.7"><path d="M4 6h10M4 12h16M4 18h12"/></svg>
                  <span style={{ ...mono, fontSize:11, letterSpacing:".18em", color:MID, textTransform:"uppercase" as const }}>The Briefing</span>
                </div>
                <p style={{ fontSize:16, lineHeight:1.7, color:HI, marginBottom:16 }}>Welcome to Chapter IV — <span style={{ color:GOLD }}>The Sabotage</span>.</p>
                <p style={{ fontSize:14.5, lineHeight:1.8, color:"#9a988f", marginBottom:14 }}>A black pawn has been planted on your board at <span style={{ color:GOLD }}>d3</span>. Its shadow now falls across diagonals you spent three weeks securing. Every one of this week's five trials orbits a single idea: <span style={{ color:HI }}>surviving a hostile piece</span> while keeping a complete N-Queens solution alive.</p>
                <h3 style={{ display:"flex", alignItems:"center", gap:9, fontSize:18, fontWeight:600, color:HI, margin:"28px 0 14px" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M12 3l2.5 5.2L20 9l-4 4 1 5.6L12 16l-5 2.6 1-5.6-4-4 5.5-.8Z"/></svg>
                  How scoring works
                </h3>
                {["Each accepted solution earns points toward this week's reward and feeds your season survival bonus.","Clear all five trials to bank the full 100 points and unlock your fourth queen on the meta board.","A queen placed on a dead-end square costs −15 and is auto-corrected to keep your path alive."].map((txt,i) => (
                  <div key={i} style={{ display:"flex", gap:12, marginBottom:13 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:GOLD, marginTop:8, flexShrink:0 }} />
                    <p style={{ fontSize:14.5, lineHeight:1.7, color:"#9a988f" }} dangerouslySetInnerHTML={{ __html: txt.replace("five trials","<span style='color:#D4AF37'>five trials</span>").replace("100 points","<span style='color:#D4AF37'>100 points</span>").replace("−15","<span style='color:#FF3333'>−15</span>") }} />
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:16 }}>
                <div onClick={() => { setScreen(null); setTab("standings"); }} style={{ border:"1px solid rgba(212,175,55,.35)", background:"linear-gradient(135deg,rgba(212,175,55,.18),rgba(212,175,55,.035))", padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:10, color:GOLD, fontWeight:600, fontSize:15 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><path d="M5 21V10M12 21V4M19 21v-7"/></svg>
                    Ranking
                  </span>
                  <div style={{ display:"flex", alignItems:"center", paddingLeft:8 }}>
                    {[{i:"KR",bg:GOLD},{i:"AB",bg:"#F5E6A3"},{i:"VG",bg:"#c9c5ba"},{i:"IF",bg:"#A8D8FF"},{i:"TP",bg:"#cdb892"}].map((l,idx) => (
                      <span key={idx} style={{ width:26, height:26, borderRadius:"50%", background:l.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:BG, border:"2px solid #161108", marginLeft: idx>0 ? -8 : 0 }}>{l.i}</span>
                    ))}
                  </div>
                </div>
                <div style={{ border:`1px solid ${BRD}`, background:"#080808" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 18px", borderBottom:"1px solid #1c1c1c", background:"#0c0c0c" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, fontWeight:600, color:HI }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>
                      Problem List
                    </span>
                    <span style={{ ...mono, fontSize:11, letterSpacing:".08em", color:GOLD }}>{PROBLEMS.filter(p=>p.status==="solved").length} / 5</span>
                  </div>
                  {PROBLEMS.map(p => {
                    const d = diffColor(p.difficulty); const pc = pieceFor(p);
                    return (
                      <div key={p.id} onClick={() => openProblem(p.id)} className="wc-prow" style={{ display:"flex", alignItems:"center", gap:13, padding:"14px 18px", borderBottom:"1px solid #161616", cursor:"pointer", transition:"background .25s,border-color .25s" }}>
                        <span style={{ fontSize:19, color:pc.col, lineHeight:1, width:22, textAlign:"center" as const }}>{pc.ch}</span>
                        <span className="wc-ptitle" style={{ flex:1, minWidth:0, ...serif, fontSize:14.5, color: p.status==="solved" ? GOLD : HI, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis", transition:"color .2s" }}>{p.title}</span>
                        <span style={{ ...mono, fontSize:10, letterSpacing:".06em", color:d.fg, textTransform:"uppercase" as const }}>{p.difficulty}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ border:"1px solid rgba(212,175,55,.3)", background:"rgba(212,175,55,.05)", padding:"18px 20px" }}>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:8 }}>// THE_META_BOARD</span>
                  <p style={{ fontSize:12.5, lineHeight:1.6, color:"#c9c5ba", marginBottom:14 }}>Place this week's queen on the season-long board. One safe square keeps your path alive.</p>
                  <button onClick={() => setOverlay("board")} className="wc-open" style={{ width:"100%", border:"none", background:GOLD, padding:12, ...mono, fontSize:10, fontWeight:700, letterSpacing:".16em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>OPEN THE BOARD</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CODE WORKSPACE ══════════════ */}
      {screen === "workspace" && (
        <div style={{ position:"fixed", inset:0, zIndex:95, background:BG, display:"flex", flexDirection:"column" as const, animation:"wcfade .2s ease" }}>
          <div style={{ flexShrink:0, height:56, borderBottom:`1px solid ${BRD}`, background:"#080808", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
              <button onClick={() => setScreen("week")} className="wc-back" style={{ display:"flex", alignItems:"center", gap:6, border:`1px solid ${BRD}`, background:"transparent", padding:"8px 13px", ...mono, fontSize:10, letterSpacing:".12em", color:MID, cursor:"pointer", whiteSpace:"nowrap" as const }}>‹ WEEK 04 · PROBLEMS</button>
              <div style={{ width:1, height:24, background:BRD }} />
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {PROBLEMS.map((p,i) => (
                  <button key={p.id} onClick={() => switchProblem(p.id)} style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", ...mono, fontSize:11, fontWeight:600, cursor:"pointer", border: `1px solid ${p.id===activeProblem ? GOLD : BRD}`, background: p.id===activeProblem ? "rgba(212,175,55,.12)" : "transparent", color: p.id===activeProblem ? GOLD : MID }}>
                    {String(i+1).padStart(2,"0")}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, justifyContent:"center", minWidth:0 }}>
              <span style={{ ...serif, fontSize:16, color:HI, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{prob.title}</span>
              <span style={{ ...mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase" as const, padding:"4px 11px", border:`1px solid ${pd.bd}`, background:pd.bg, color:pd.fg }}>{prob.difficulty}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={() => setRunState("passed")} className="wc-runbtn" style={{ display:"flex", alignItems:"center", gap:7, border:`1px solid ${BRD}`, background:"#111", padding:"9px 18px", ...mono, fontSize:11, fontWeight:600, letterSpacing:".1em", color:HI, cursor:"pointer" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={HI} stroke="none"><path d="M6 4l13 8-13 8Z"/></svg>
                RUN
              </button>
              <button onClick={() => setRunState("passed")} className="wc-open" style={{ border:"none", background:GOLD, padding:"9px 20px", ...mono, fontSize:11, fontWeight:700, letterSpacing:".1em", color:BG, cursor:"pointer" }}>SUBMIT</button>
            </div>
          </div>
          <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:0 }}>
            <div style={{ borderRight:`1px solid ${BRD}`, display:"flex", flexDirection:"column" as const, minHeight:0 }}>
              <div style={{ flexShrink:0, display:"flex", borderBottom:`1px solid ${BRD}`, background:"#080808" }}>
                {(["statement","editorial","submissions"] as ProbTab[]).map(t => {
                  const labels: Record<ProbTab,string> = { statement:"DESCRIPTION", editorial:"EDITORIAL", submissions:"SUBMISSIONS" };
                  return <button key={t} onClick={() => setProbTab(t)} style={{ padding:"13px 20px", ...mono, fontSize:11, fontWeight:700, letterSpacing:".1em", cursor:"pointer", outline:"none", border:"none", borderBottom: `2px solid ${probTab===t ? GOLD : "transparent"}`, background: probTab===t ? "rgba(212,175,55,.08)" : "transparent", color: probTab===t ? GOLD : MID }}>{labels[t]}</button>;
                })}
              </div>
              <div className="wc-scroll" style={{ flex:1, overflowY:"auto", padding:"30px 34px", minHeight:0 }}>
                {probTab === "statement" && (
                  <div>
                    <h1 style={{ ...serif, fontSize:26, color:HI, letterSpacing:".02em", marginBottom:8 }}>
                      <span style={{ color:MID, fontSize:18, marginRight:10 }}>{String(probIdx+1).padStart(2,"0")}.</span>{prob.title}
                    </h1>
                    <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" as const }}>
                      <span style={{ ...mono, fontSize:10, letterSpacing:".14em", textTransform:"uppercase" as const, padding:"5px 12px", border:`1px solid ${pd.bd}`, background:pd.bg, color:pd.fg }}>{prob.difficulty}</span>
                      {prob.topics.map(t => <span key={t} style={{ ...mono, fontSize:10, letterSpacing:".08em", color:MID, border:`1px solid ${BRD}`, background:"#050505", padding:"4px 9px", textTransform:"uppercase" as const }}>{t}</span>)}
                    </div>
                    <p style={{ fontSize:14.5, lineHeight:1.8, color:HI, marginBottom:28 }}>{prob.desc}</p>
                    <h3 style={{ ...mono, fontSize:12, fontWeight:700, color:HI, marginBottom:10, letterSpacing:".04em" }}>Example 1</h3>
                    <div style={{ background:"#1A1A1A", borderLeft:`2px solid ${GOLD}`, padding:"14px 16px", ...mono, fontSize:12.5, lineHeight:1.7, marginBottom:28 }}>
                      <div style={{ color:HI, marginBottom:5 }}>Input: <span style={{ color:MID }}>{prob.sampleInput}</span></div>
                      <div style={{ color:HI }}>Output: <span style={{ color:MID }}>{prob.sampleOutput}</span></div>
                    </div>
                    <h3 style={{ ...mono, fontSize:12, fontWeight:700, color:HI, marginBottom:12, letterSpacing:".04em" }}>Constraints</h3>
                    <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
                      {prob.constraints.map((c,i) => <span key={i} style={{ ...mono, fontSize:12.5, color:MID, background:"#1A1A1A", padding:"7px 12px", alignSelf:"flex-start" }}>{c}</span>)}
                    </div>
                  </div>
                )}
                {probTab === "editorial" && (
                  <div>
                    <span style={{ ...mono, fontSize:10, letterSpacing:".18em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:14 }}>// EDITORIAL</span>
                    <h3 style={{ fontSize:20, fontWeight:700, color:GOLD, marginBottom:14 }}>Approach · {prob.approach}</h3>
                    <p style={{ fontSize:14.5, lineHeight:1.8, color:"#c9c5ba", marginBottom:26 }}>{prob.editorial}</p>
                    <div style={{ background:"#1A1A1A", borderLeft:`2px solid ${GOLD}`, padding:16, ...mono, fontSize:13, lineHeight:1.8, color:MID, whiteSpace:"pre-line" as const }}>{prob.complexity}</div>
                  </div>
                )}
                {probTab === "submissions" && (
                  <div style={{ display:"flex", flexDirection:"column" as const, gap:12 }}>
                    <span style={{ ...mono, fontSize:10, letterSpacing:".18em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:6 }}>// YOUR_SUBMISSIONS</span>
                    {prob.subs.map((s,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#1A1A1A", border:`1px solid ${BRD}`, padding:"14px 16px" }}>
                        <div>
                          <span style={{ ...mono, fontSize:12.5, fontWeight:700, color: s.status==="Accepted" ? GOLD : s.status==="Wrong Answer" ? "#FF3333" : "#FF6A00" }}>{s.status}</span>
                          <span style={{ ...mono, fontSize:10, color:MID, marginLeft:12 }}>{s.timeAgo}</span>
                        </div>
                        <div style={{ ...mono, fontSize:11, color:HI }}>
                          <span style={{ color:MID }}>Runtime:</span> {s.runtime} <span style={{ color:BRD, margin:"0 4px" }}>|</span> <span style={{ color:MID }}>Mem:</span> {s.memory}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column" as const, minHeight:0, background:"#0C0C0C" }}>
              <div style={{ flexShrink:0, height:44, borderBottom:`1px solid ${BRD}`, background:"#080808", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px" }}>
                <button onClick={cycleLang} style={{ display:"flex", alignItems:"center", gap:8, border:`1px solid ${BRD}`, background:"#111", padding:"6px 12px", ...mono, fontSize:11, color:HI, cursor:"pointer" }}>
                  {language} <span style={{ color:MID, fontSize:9 }}>▾</span>
                </button>
                <span style={{ ...mono, fontSize:10, letterSpacing:".1em", color:"#4A4A4A" }}>
                  {language==="Python" ? "solution.py" : language==="C++" ? "solution.cpp" : "Solution.java"}
                </span>
              </div>
              <div style={{ flex:1, display:"flex", minHeight:0, overflow:"hidden" }}>
                <div style={{ flexShrink:0, padding:"16px 0", textAlign:"right" as const, background:BG, borderRight:"1px solid #1A1A1A", color:"#3A3A3A", fontSize:13, lineHeight:1.6, userSelect:"none", minWidth:46, ...mono }}>
                  {code.split("\n").map((_,i) => <div key={i} style={{ padding:"0 12px" }}>{i+1}</div>)}
                </div>
                <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
                  style={{ flex:1, resize:"none", border:"none", background:"#0C0C0C", color:"#E8E0C8", fontSize:13, lineHeight:1.6, padding:16, tabSize:4, minHeight:0, ...mono, outline:"none" }} />
              </div>
              <div style={{ flexShrink:0, borderTop:`1px solid ${BRD}`, background:"#080808", height:208, display:"flex", flexDirection:"column" as const }}>
                <div style={{ flexShrink:0, height:40, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", borderBottom:"1px solid #1A1A1A" }}>
                  <span style={{ ...mono, fontSize:11, fontWeight:700, letterSpacing:".12em", color:HI }}>CONSOLE</span>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".12em", padding:"3px 10px", border: runState==="passed" ? "1px solid rgba(104,220,140,.4)" : `1px solid ${BRD}`, background: runState==="passed" ? "rgba(104,220,140,.08)" : BG, color: runState==="passed" ? "#68DC8C" : MID }}>{runState==="passed" ? "PASSED" : "READY"}</span>
                </div>
                <div className="wc-scroll" style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
                  {runState === "idle" && (
                    <div style={{ ...mono, fontSize:12, color:"#5A5A55", lineHeight:1.7 }}>▸ Press <span style={{ color:GOLD }}>RUN</span> to test against sample cases, or <span style={{ color:GOLD }}>SUBMIT</span> to score this trial.<br />▸ Testcase: <span style={{ color:MID }}>{prob.sampleInput}</span></div>
                  )}
                  {runState === "passed" && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, ...mono, fontSize:12.5, color:"#68DC8C", marginBottom:12 }}>✓ All sample testcases passed · runtime 12 ms</div>
                      {prob.cases.map((c,i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, ...mono, fontSize:11.5, color:MID, padding:"5px 0" }}>
                          <span style={{ color:"#68DC8C" }}>✓</span><span style={{ color:"#5A5A55" }}>Case {i+1}</span><span>in={c.i}</span><span style={{ color:"#4A4A4A" }}>→</span><span style={{ color:HI }}>{c.o}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ BOARD MODAL ══════════════ */}
      {overlay === "board" && (
        <div onClick={() => setOverlay(null)} style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.82)", backdropFilter:"blur(7px)", display:"flex", alignItems:"center", justifyContent:"center", padding:28, animation:"wcfade .2s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:1160, maxHeight:"92vh", overflow:"auto", border:"1px solid rgba(212,175,55,.3)", background:BG, position:"relative", animation:"wcrise .28s cubic-bezier(.2,.8,.2,1)" }}>
            <div style={{ position:"sticky", top:0, zIndex:5, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 28px", borderBottom:`1px solid ${BRD}`, background:"rgba(10,10,10,.95)", backdropFilter:"blur(8px)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 11px", border:"1px solid rgba(104,220,140,.45)", background:"rgba(104,220,140,.08)", ...mono, fontSize:9, letterSpacing:".16em", color:"#68DC8C", textTransform:"uppercase" as const }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#68DC8C" }} />LIVE
                </span>
                <span style={{ ...serif, fontSize:19, letterSpacing:".08em", color:HI }}>THE META BOARD — CHAPTER IV</span>
              </div>
              <button onClick={() => setOverlay(null)} className="wc-close" style={{ border:`1px solid ${BRD}`, background:"transparent", width:34, height:34, ...mono, fontSize:16, color:MID, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>
            <div style={{ padding:28, display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:28, alignItems:"start" }}>
              <div style={{ border:`1px solid ${BRD}`, background:"#050505", padding:24, position:"relative" }}>
                <div style={{ position:"absolute", top:10, left:10, width:18, height:18, borderTop:`1px solid rgba(212,175,55,.65)`, borderLeft:`1px solid rgba(212,175,55,.65)` }} />
                <div style={{ position:"absolute", bottom:10, right:10, width:18, height:18, borderBottom:`1px solid rgba(212,175,55,.65)`, borderRight:`1px solid rgba(212,175,55,.65)` }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".18em", color:MID }}>PLACE WEEK 4'S QUEEN — DODGE THE PAWN</span>
                  <button onClick={resetBoard} style={{ border:`1px solid ${BRD}`, background:BG, padding:"7px 14px", ...mono, fontSize:10, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, cursor:"pointer" }}>↺ REPLAY</button>
                </div>
                <div style={{ display:"flex", gap:13, alignItems:"stretch" }}>
                  <div style={{ display:"flex", flexDirection:"column" as const, justifyContent:"space-around", padding:"2px 0" }}>
                    {["8","7","6","5","4","3","2","1"].map(rk => <span key={rk} style={{ ...mono, fontSize:10, color:"#4A4A4A", display:"flex", alignItems:"center", height:0 }}>{rk}</span>)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ aspectRatio:"1", border:"1px solid rgba(212,175,55,.35)", display:"grid", gridTemplateColumns:"repeat(8,1fr)", gridTemplateRows:"repeat(8,1fr)", boxShadow:"0 24px 60px rgba(0,0,0,.6)" }}>
                      {Array.from({ length: 64 }, (_, idx) => {
                        const r = Math.floor(idx/8), c = idx%8;
                        const dark = (r+c)%2===1;
                        const isActive = r === activeRow;
                        const isQueen = placements[r] === c;
                        const isPawn  = r === PAWN_R && c === PAWN_C;
                        const isSafe  = isActive && validNow.has(c);
                        let bg = dark ? "#15110d" : "#2a2118";
                        if (isActive) bg = dark ? "#2a2410" : "#37300f";
                        if (isQueen)  bg = `radial-gradient(circle at center, rgba(212,175,55,.28), ${dark?"#15110d":"#2a2118"} 72%)`;
                        if (isPawn)   bg = `radial-gradient(circle at center, rgba(255,77,0,.3), ${dark?"#15110d":"#2a2118"} 72%)`;
                        return (
                          <div key={idx} onClick={isActive ? () => placeQueen(c) : undefined}
                            style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", background:bg, cursor: isActive ? "pointer" : "default", boxShadow: isActive ? "inset 0 0 0 2px rgba(212,175,55,.45)" : isQueen ? "inset 0 0 0 1px rgba(212,175,55,.4)" : "none", opacity: activeRow!=null && r > activeRow ? .45 : 1 }}>
                            {c===0 && <span style={{ position:"absolute", top:3, left:4, ...mono, fontSize:8, fontWeight:600, color: r<3 ? "rgba(212,175,55,.7)" : r===3 ? GOLD : "rgba(240,237,230,.16)" }}>W{r+1}</span>}
                            {isQueen && <span style={{ fontSize:32, color:"#F5E6A3", filter:"drop-shadow(0 0 10px rgba(212,175,55,.9))", animation:"wcdrop .35s ease", lineHeight:1 }}>♛</span>}
                            {isPawn  && <span style={{ fontSize:30, color:"#FF4D00", lineHeight:1, animation:"wcthreat 2.2s ease-in-out infinite" }}>♟</span>}
                            {isSafe  && <span style={{ position:"absolute", width:13, height:13, borderRadius:"50%", background:GOLD, opacity:.55, boxShadow:"0 0 10px rgba(212,175,55,.7)" }} />}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", marginTop:7 }}>
                      {["a","b","c","d","e","f","g","h"].map(f => <span key={f} style={{ textAlign:"center" as const, ...mono, fontSize:10, color:"#4A4A4A" }}>{f}</span>)}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:11, marginTop:18, padding:"13px 15px", background:fb.bg, border:`1px solid ${fb.bd}`, color:fb.col }}>
                  <span style={{ fontSize:15, color:fb.ic, lineHeight:1.4 }}>{fb.icon}</span>
                  <span style={{ fontSize:12.5, lineHeight:1.5 }}>{feedback.text}</span>
                </div>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap" as const, marginTop:16, paddingTop:16, borderTop:"1px solid #1c1c1c" }}>
                  {[{ icon:"♛", col:"#F5E6A3", label:"YOUR QUEEN" },{ icon:"♟", col:"#FF4D00", label:"SABOTAGE PAWN" }].map(l => (
                    <div key={l.label} style={{ display:"flex", alignItems:"center", gap:7, ...mono, fontSize:10.5, letterSpacing:".04em", color:MID }}>
                      <span style={{ color:l.col, fontSize:17 }}>{l.icon}</span> {l.label}
                    </div>
                  ))}
                  <div style={{ display:"flex", alignItems:"center", gap:7, ...mono, fontSize:10.5, letterSpacing:".04em", color:MID }}>
                    <span style={{ width:9, height:9, borderRadius:"50%", background:GOLD, opacity:.6 }} /> SAFE SQUARE
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:20 }}>
                <div style={{ border:`1px solid ${BRD}`, background:"#080808", padding:22 }}>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:14 }}>// OBJECTIVE</span>
                  <p style={{ fontSize:13, lineHeight:1.65, color:"#c9c5ba" }}>Each week unlocks one new rank. Place your queen on a <span style={{ color:GOLD }}>safe square</span> that still leads to a complete N-Queens solution. A dead end collapses your path — points lost, queen auto-corrected.</p>
                </div>
                <div style={{ border:`1px solid ${BRD}`, background:"#080808", padding:22 }}>
                  <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD, textTransform:"uppercase" as const, display:"block", marginBottom:16 }}>// YOUR_CAMPAIGN</span>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:`1px solid ${BRD}` }}>
                    {[
                      { val:`${String(placed).padStart(2,"0")}/08`, label:"QUEENS PLACED", color:GOLD },
                      { val: feedback.type==="bad" ? "—" : "100%", label:"PATH INTEGRITY", color:HI },
                      { val:`+${placed*15}`, label:"SURVIVAL BONUS", color:GOLD },
                      { val:"612", label:"SEASON POINTS", color:HI },
                    ].map((s,i) => (
                      <div key={i} style={{ padding:16, borderRight: i%2===0 ? `1px solid ${BRD}` : "none", borderBottom: i<2 ? `1px solid ${BRD}` : "none" }}>
                        <div style={{ ...mono, fontSize:21, color:s.color }}>{s.val}</div>
                        <div style={{ ...mono, fontSize:9, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, marginTop:6 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ BLOG READER MODAL ══════════════ */}
      {overlay === "blog" && bp && (
        <div onClick={() => setOverlay(null)} style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.85)", backdropFilter:"blur(7px)", display:"flex", alignItems:"center", justifyContent:"center", padding:28, animation:"wcfade .2s ease" }}>
          <div onClick={e => e.stopPropagation()} className="wc-scroll" style={{ width:"100%", maxWidth:820, maxHeight:"92vh", overflow:"auto", border:"1px solid rgba(212,175,55,.3)", background:BG, position:"relative", animation:"wcrise .28s cubic-bezier(.2,.8,.2,1)" }}>
            <div style={{ position:"sticky", top:0, zIndex:5, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 30px", borderBottom:`1px solid ${BRD}`, background:"rgba(10,10,10,.96)", backdropFilter:"blur(8px)" }}>
              <span style={{ padding:"4px 11px", ...mono, fontSize:9, fontWeight:600, letterSpacing:".12em", border:`1px solid ${bp.tagBorder}`, background:bp.tagBg, color:bp.tagColor }}>{bp.tag}</span>
              <button onClick={() => setOverlay(null)} className="wc-close" style={{ border:`1px solid ${BRD}`, background:"transparent", width:34, height:34, ...mono, fontSize:16, color:MID, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>
            <div style={{ padding:"34px 44px 40px" }}>
              <h1 style={{ ...serif, fontSize:34, lineHeight:1.2, letterSpacing:".01em", color:HI, marginBottom:18 }}>{bp.title}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:24, marginBottom:28, borderBottom:`1px solid ${BRD}` }}>
                <span style={{ width:34, height:34, borderRadius:"50%", background:bp.authorBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:BG }}>{bp.initials}</span>
                <div>
                  <div style={{ fontSize:14, color:HI }}>{bp.author}</div>
                  <div style={{ ...mono, fontSize:11, color:MID, marginTop:2 }}>{bp.date} · {bp.read} · ▲ {bp.votes}</div>
                </div>
              </div>
              {bp.body.map((para,i) => <p key={i} style={{ fontSize:15.5, lineHeight:1.85, color:"#c9c5ba", marginBottom:20 }}>{para}</p>)}
              <div style={{ marginTop:40, paddingTop:28, borderTop:`1px solid ${BRD}` }}>
                <h3 style={{ ...mono, fontSize:12, fontWeight:700, letterSpacing:".14em", color:GOLD, textTransform:"uppercase" as const, marginBottom:22 }}>// COMMENTS · {blogComments.length}</h3>
                <div style={{ display:"flex", gap:12, marginBottom:28 }}>
                  <span style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#8a7220)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:BG, flexShrink:0 }}>AR</span>
                  <div style={{ flex:1 }}>
                    <textarea className="wc-input" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your line of play…"
                      style={{ width:"100%", minHeight:64, resize:"vertical" as const, background:"#080808", border:`1px solid ${BRD}`, color:HI, fontSize:13, lineHeight:1.5, padding:"12px 14px", fontFamily:"inherit", transition:"border-color .2s" }} />
                    <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
                      <button onClick={addComment} className="wc-open" style={{ border:"none", background:GOLD, padding:"9px 20px", ...mono, fontSize:10, fontWeight:700, letterSpacing:".14em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>POST COMMENT</button>
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column" as const, gap:20 }}>
                  {blogComments.map((cm,i) => (
                    <div key={i} style={{ display:"flex", gap:12 }}>
                      <span style={{ width:32, height:32, borderRadius:"50%", background:cm.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:BG, flexShrink:0 }}>{cm.initials}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:HI }}>{cm.author}</span>
                          <span style={{ ...mono, fontSize:10, color:"#4A4A4A" }}>{cm.time}</span>
                        </div>
                        <p style={{ fontSize:13.5, lineHeight:1.6, color:"#9a988f" }}>{cm.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ COMPOSE MODAL ══════════════ */}
      {overlay === "compose" && (
        <div onClick={() => setOverlay(null)} style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.85)", backdropFilter:"blur(7px)", display:"flex", alignItems:"center", justifyContent:"center", padding:28, animation:"wcfade .2s ease" }}>
          <div onClick={e => e.stopPropagation()} className="wc-scroll" style={{ width:"100%", maxWidth:720, maxHeight:"92vh", overflow:"auto", border:"1px solid rgba(212,175,55,.3)", background:BG, position:"relative", animation:"wcrise .28s cubic-bezier(.2,.8,.2,1)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 30px", borderBottom:`1px solid ${BRD}` }}>
              <div>
                <span style={{ ...mono, fontSize:10, letterSpacing:".2em", color:GOLD }}>// THE_DISPATCH</span>
                <h2 style={{ ...serif, fontSize:22, letterSpacing:".06em", color:HI, marginTop:5 }}>Write a Post</h2>
              </div>
              <button onClick={() => setOverlay(null)} className="wc-close" style={{ border:`1px solid ${BRD}`, background:"transparent", width:34, height:34, ...mono, fontSize:16, color:MID, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>
            {!composeDone ? (
              <div style={{ padding:30 }}>
                <label style={{ ...mono, fontSize:10, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, display:"block", marginBottom:9 }}>Title</label>
                <input className="wc-input" value={composeTitle} onChange={e => setComposeTitle(e.target.value)} placeholder="A sharp, specific headline…"
                  style={{ width:"100%", background:"#080808", border:`1px solid ${BRD}`, color:HI, fontSize:15, padding:"12px 14px", marginBottom:22, ...serif, transition:"border-color .2s" }} />
                <label style={{ ...mono, fontSize:10, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, display:"block", marginBottom:9 }}>Category</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:22 }}>
                  {["announce","editorial","lore","community"].map(c => (
                    <button key={c} onClick={() => setComposeCat(c)} style={{ padding:"8px 14px", ...mono, fontSize:10, letterSpacing:".1em", cursor:"pointer", background: composeCat===c ? GOLD : "#080808", color: composeCat===c ? BG : MID, border: composeCat===c ? `1px solid ${GOLD}` : `1px solid ${BRD}` }}>
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
                <label style={{ ...mono, fontSize:10, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, display:"block", marginBottom:9 }}>Body</label>
                <textarea className="wc-input" value={composeBody} onChange={e => setComposeBody(e.target.value)} placeholder="Write your editorial, announcement or lore… Markdown supported."
                  style={{ width:"100%", minHeight:200, resize:"vertical" as const, background:"#080808", border:`1px solid ${BRD}`, color:HI, fontSize:14, lineHeight:1.6, padding:14, fontFamily:"inherit", transition:"border-color .2s" }} />
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:18, padding:"13px 16px", border:`1px solid ${BRD}`, background:"#080808" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MID} strokeWidth="1.5" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
                  <span style={{ fontSize:12, color:MID, lineHeight:1.5 }}>Posts are reviewed by the CodeCell core team before going public. You'll be notified once it's approved.</span>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginTop:24 }}>
                  <button onClick={() => setOverlay(null)} style={{ border:`1px solid ${BRD}`, background:"transparent", padding:"13px 22px", ...mono, fontSize:10, letterSpacing:".14em", color:MID, textTransform:"uppercase" as const, cursor:"pointer" }}>CANCEL</button>
                  <button onClick={() => setComposeDone(true)} className="wc-open" style={{ border:"none", background:GOLD, padding:"13px 26px", ...mono, fontSize:10, fontWeight:700, letterSpacing:".14em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>SUBMIT FOR REVIEW →</button>
                </div>
              </div>
            ) : (
              <div style={{ padding:"60px 40px", textAlign:"center" as const }}>
                <div style={{ width:64, height:64, margin:"0 auto 24px", border:"1px solid rgba(212,175,55,.4)", background:"rgba(212,175,55,.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h2 style={{ ...serif, fontSize:26, letterSpacing:".04em", color:HI, marginBottom:12 }}>Submitted for review</h2>
                <p style={{ fontSize:14, lineHeight:1.7, color:MID, maxWidth:420, margin:"0 auto 28px" }}>Your post <span style={{ color:GOLD }}>"{composeTitle}"</span> is now in the moderation queue. The core team typically reviews within 24 hours.</p>
                <button onClick={() => setOverlay(null)} className="wc-open" style={{ border:"none", background:GOLD, padding:"13px 28px", ...mono, fontSize:10, fontWeight:700, letterSpacing:".14em", color:BG, textTransform:"uppercase" as const, cursor:"pointer" }}>BACK TO DISPATCH</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>, document.body)}
    </>
  );
}
