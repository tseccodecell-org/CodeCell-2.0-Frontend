"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Terminal, Play, CheckCircle2, ChevronLeft, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const challengeData: Record<string, {
  name: string;
  category: string;
  piece: string;
  difficulty: string;
  elo: string;
  cell: string;
  desc: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  initialCode: string;
  asciiBoard: string;
  testCases: { name: string; status: string }[];
}> = {
  "01": {
    name: "Knight's Tour Pathfinding",
    category: "Knight",
    piece: "♞",
    difficulty: "Medium",
    elo: "+30 ELO",
    cell: "B3",
    desc: "A knight's tour is a sequence of moves of a knight on a chessboard such that the knight visits every square exactly once. Given the starting position of the Knight on an 8x8 chessboard, output a sequence of coordinates representing a valid tour path.",
    inputFormat: "Two space-separated integers representing the initial row and column (0-indexed).",
    outputFormat: "64 lines, each containing two space-separated integers showing the step-by-step path coordinates.",
    sampleInput: "0 0",
    sampleOutput: "0 0\n2 1\n4 0\n...",
    asciiBoard: "  a b c d e f g h\n8 ♞ . . . . . . .\n7 . . . . . . . .\n6 . . . . . . . .\n5 . . . . . . . .\n4 . . . . . . . .\n3 . . . . . . . .\n2 . . . . . . . .\n1 . . . . . . . .",
    initialCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Solve the Knight's Tour problem\nvector<pair<int, int>> solveKnightsTour(int startX, int startY) {\n    vector<pair<int, int>> path;\n    // Write your backtracking algorithm here\n    return path;\n}\n\nint main() {\n    int x, y;\n    if (cin >> x >> y) {\n        auto path = solveKnightsTour(x, y);\n        for (auto p : path) {\n            cout << p.first << " " << p.second << "\\n";\n        }\n    }\n    return 0;\n}`,
    testCases: [
      { name: "Initial Boundary Verification", status: "PASS" },
      { name: "No Cell Visited Twice Audit", status: "PASS" },
      { name: "All 64 Cells Covered Metric", status: "PASS" },
      { name: "Valid Knight Moves Sequence Check", status: "PASS" },
    ]
  },
  "02": {
    name: "N-Queens Checkmate Solver",
    category: "Queen",
    piece: "♛",
    difficulty: "Hard",
    elo: "+50 ELO",
    cell: "D8",
    desc: "The N-Queens puzzle is the problem of placing N chess queens on an NxN chessboard so that no two queens threaten each other. Thus, a solution requires that no two queens share the same row, column, or diagonal.",
    inputFormat: "An integer N representing the size of the board.",
    outputFormat: "Print the board configuration with 'Q' for Queen and '.' for empty spaces.",
    sampleInput: "4",
    sampleOutput: ". Q . .\n. . . Q\nQ . . .\n. . Q .",
    asciiBoard: "  a b c d e f g h\n8 . . . ♛ . . . .\n7 . . . . . . . .\n6 . . . . . . . .\n5 . . . . . . . .\n4 . . . . . . . .\n3 . . . . . . . .\n2 . . . . . . . .\n1 . . . . . . . .",
    initialCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid solveNQueens(int n) {\n    // Implement backtracking algorithm here\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        solveNQueens(n);\n    }\n    return 0;\n}`,
    testCases: [
      { name: "Dynamic N=4 Configuration", status: "PASS" },
      { name: "Dynamic N=8 Configuration", status: "PASS" },
      { name: "Diagonal Intersection Check", status: "PASS" },
      { name: "No Two Queens Attacking", status: "PASS" },
    ]
  },
  "03": {
    name: "En Passant Capture Checker",
    category: "Pawn",
    piece: "♟",
    difficulty: "Easy",
    elo: "+15 ELO",
    cell: "A4",
    desc: "En passant is a special pawn capture in chess. It occurs when a pawn moves two squares forward from its starting position, and an opponent pawn on an adjacent file captures it on the crossed square. Write an auditor to determine if a capture is valid.",
    inputFormat: "Two board configurations representing state before and after the move.",
    outputFormat: "Output 1 if capture was legal, 0 otherwise.",
    sampleInput: "e2e4 d4d5\ne4d5",
    sampleOutput: "1",
    asciiBoard: "  a b c d e f g h\n8 . . . . . . . .\n7 . . . . ♟ . . .\n6 . . . . . . . .\n5 . . . ♟ . . . .\n4 . . . . . . . .\n3 . . . . . . . .\n2 . . . . . . . .\n1 . . . . . . . .",
    initialCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isValidEnPassant(string stateBefore, string stateAfter) {\n    // Write your evaluation engine here\n    return true;\n}\n\nint main() {\n    string before, after;\n    if (cin >> before >> after) {\n        cout << isValidEnPassant(before, after) << endl;\n    }\n    return 0;\n}`,
    testCases: [
      { name: "Pawn Double Move Validation", status: "PASS" },
      { name: "Adjacent File Position Check", status: "PASS" },
      { name: "Immediate Step Recency Verification", status: "PASS" },
    ]
  },
  "04": {
    name: "Castling Status Auditor",
    category: "Rook",
    piece: "♜",
    difficulty: "Medium",
    elo: "+25 ELO",
    cell: "H1",
    desc: "Castling consists of moving the King two squares toward a Rook on the same rank, and moving the Rook to the square passed over. Verify if castling is legal given the historical paths of the King and Rook.",
    inputFormat: "King/Rook positional history matrices.",
    outputFormat: "Boolean representing castling rights legality.",
    sampleInput: "K: e1-e1, R: h1-h1",
    sampleOutput: "1",
    asciiBoard: "  a b c d e f g h\n8 . . . . . . . .\n7 . . . . . . . .\n6 . . . . . . . .\n5 . . . . . . . .\n4 . . . . . . . .\n3 . . . . . . . .\n2 . . . . . . . .\n1 ♜ . . . ♔ . . ♜",
    initialCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isCastlingLegal(string history) {\n    // Write castling status auditor\n    return true;\n}\n\nint main() {\n    string history;\n    getline(cin, history);\n    cout << isCastlingLegal(history) << endl;\n    return 0;\n}`,
    testCases: [
      { name: "Unmoved King/Rook Checks", status: "PASS" },
      { name: "Path Intersecting Check Audit", status: "PASS" },
      { name: "Empty Square Path Verification", status: "PASS" },
    ]
  }
};

const defaultChallenge = {
  name: "Chessboard Algorithm Sandbox",
  category: "Chess",
  piece: "♔",
  difficulty: "Medium",
  elo: "+25 ELO",
  cell: "E4",
  desc: "Solve advanced chess positional and game-tree pathfinding algorithms. Optimize move evaluation trees using alpha-beta pruning techniques.",
  inputFormat: "Standard algebraic notation coordinates.",
  outputFormat: "Evaluated board score relative to white to move.",
  sampleInput: "e2e4 e7e5",
  sampleOutput: "+0.15",
  asciiBoard: "  a b c d e f g h\n8 . . . . ♔ . . .\n7 . . . . . . . .\n6 . . . . . . . .\n5 . . . . . . . .\n4 . . . . . . . .\n3 . . . . . . . .\n2 . . . . . . . .\n1 . . . . . . . .",
  initialCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\ndouble evaluateChessPosition(string moves) {\n    // Write your evaluation engine here\n    return 0.15;\n}\n\nint main() {\n    string moves;\n    getline(cin, moves);\n    cout << evaluateChessPosition(moves) << endl;\n    return 0;\n}`,
  testCases: [
    { name: "Move Legality Evaluation", status: "PASS" },
    { name: "Alpha-Beta Tree Depth Verification", status: "PASS" },
    { name: "Positional Bishop Pair Check", status: "PASS" },
  ]
};

export default function SolveChallengePage() {
  const params = useParams();
  const router = useRouter();
  
  const idRaw = params?.id as string || "solve-01";
  const id = idRaw.replace("solve-", "");
  const challenge = challengeData[id] || defaultChallenge;

  const [code, setCode] = useState(challenge.initialCode);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs([]);
    setIsSuccess(false);

    // Simulated step-by-step console print compilation steps
    const steps = [
      `> g++ -O3 -std=c++20 FILE_${id}.cpp -o chess_eval.bin`,
      `[ compiling successfully in 410ms ]`,
      `> Executing chess sandbox tests...`,
    ];

    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, step]);
      }, delay);
      delay += 400;
    });

    // Test cases execution
    challenge.testCases.forEach((tc, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, `[ TEST CASE ${index + 1} ]: ${tc.name} ... PASSED`]);
      }, delay);
      delay += 500;
    });

    // Final success execution
    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev, 
        `\n>> SUCCESS: ALL SANDBOX CHECKS PASSED.`,
        `>> RATING EARNED: ${challenge.elo}`
      ]);
      setIsRunning(false);
      setIsSuccess(true);
    }, delay);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-8 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col select-none">
      {/* Back Button & Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2A] pb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/challenges">
            <button className="p-2 border border-[#2A2A2A] bg-[#141414] hover:border-[#E8FF00] hover:text-[#E8FF00] transition-colors text-[#F0EDE6] flex items-center justify-center cursor-pointer">
              <ChevronLeft size={16} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#4BE2C4] font-bold">[{challenge.category.toUpperCase()}]</span>
              <span className="font-mono text-[9px] text-[#FF4D00] font-bold">[SQUARE_{challenge.cell}]</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-[#F0EDE6] mt-1">
              {challenge.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[#4A4A4A]">DIFFICULTY: <span className="text-[#F0EDE6] font-bold uppercase">{challenge.difficulty}</span></span>
          <span className="text-[#4A4A4A]">ELO: <span className="text-[#E8FF00] font-bold">{challenge.elo}</span></span>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Description & Board Visualizer (45%) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Board Visualizer */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-5 card-scanner relative overflow-hidden">
            <div className="absolute top-0 right-0 text-7xl text-white opacity-[0.02] font-serif p-2 select-none">
              {challenge.piece}
            </div>
            <span className="block font-mono text-[9px] text-[#4A4A4A] mb-3 uppercase tracking-wider">
              [ CHESSBOARD_BOARDSTATE.log ]
            </span>
            <pre className="font-mono text-xs text-[#E8FF00] leading-relaxed bg-[#0D0D0D] border border-[#2A2A2A] p-4 select-text">
              {challenge.asciiBoard}
            </pre>
          </div>

          {/* Problem statement */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-6 flex-1 space-y-4 select-text">
            <div>
              <span className="block font-mono text-[9px] text-[#4BE2C4] uppercase tracking-wider mb-1">
                // SYSTEM_BRIEF
              </span>
              <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                {challenge.desc}
              </p>
            </div>

            <hr className="border-[#1D1D1D]" />

            <div>
              <span className="block font-mono text-[9px] text-[#FF4D00] uppercase tracking-wider mb-1">
                // INPUT_FORMAT
              </span>
              <p className="font-sans text-xs text-[#4A4A4A] leading-relaxed">
                {challenge.inputFormat}
              </p>
            </div>

            <div>
              <span className="block font-mono text-[9px] text-[#FF4D00] uppercase tracking-wider mb-1">
                // OUTPUT_FORMAT
              </span>
              <p className="font-sans text-xs text-[#4A4A4A] leading-relaxed">
                {challenge.outputFormat}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="block font-mono text-[9px] text-[#4A4A4A] uppercase tracking-wider mb-1">
                  SAMPLE_INPUT
                </span>
                <pre className="font-mono text-[10px] text-[#F0EDE6] bg-[#0D0D0D] border border-[#2A2A2A] p-2.5">
                  {challenge.sampleInput}
                </pre>
              </div>
              <div>
                <span className="block font-mono text-[9px] text-[#4A4A4A] uppercase tracking-wider mb-1">
                  SAMPLE_OUTPUT
                </span>
                <pre className="font-mono text-[10px] text-[#F0EDE6] bg-[#0D0D0D] border border-[#2A2A2A] p-2.5">
                  {challenge.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console (55%) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Code Editor */}
          <div className="bg-[#141414] border border-[#2A2A2A] flex flex-col h-[400px]">
            <div className="border-b border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2 flex items-center justify-between font-mono text-[10px] text-[#4A4A4A]">
              <span>C++ COMPILER (GCC-13) - FILE_{id}.cpp</span>
              <span className="text-[#4BE2C4]">UTF-8</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#0D0D0D] text-[#F0EDE6] font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed select-text"
              style={{ tabSize: 4 }}
            />
            <div className="border-t border-[#2A2A2A] bg-[#0F0F0F] p-3 flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#4A4A4A]">STATUS: UNCOMPILED</span>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="
                  flex 
                  items-center 
                  gap-1.5 
                  bg-[#E8FF00] 
                  text-[#0D0D0D] 
                  border 
                  border-[#E8FF00] 
                  px-4 
                  py-1.5 
                  font-mono 
                  text-[10px] 
                  font-bold 
                  tracking-wider 
                  hover:bg-transparent 
                  hover:text-[#E8FF00] 
                  transition-all 
                  duration-200 
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Play size={10} />
                COMPILE & EXECUTE
              </button>
            </div>
          </div>

          {/* Compiler Terminal Console */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-5 flex flex-col h-[200px] font-mono text-[11px]">
            <span className="block text-[9px] text-[#4A4A4A] mb-3 uppercase tracking-wider">
              [ SANDBOX_TERMINAL_OUTPUT.log ]
            </span>
            <div className="flex-1 bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-[#8A8880] overflow-y-auto space-y-1.5 select-text">
              {consoleLogs.length === 0 && !isRunning && (
                <div className="text-[#4A4A4A] italic">// Terminal idle. Trigger 'COMPILE & EXECUTE' above to run program checks.</div>
              )}
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log.startsWith("[ compiling") && <span className="text-[#8A8880]">{log}</span>}
                  {!log.startsWith("[ compiling") && log.includes("PASSED") && <span className="text-[#4BE2C4]">{log}</span>}
                  {!log.startsWith("[ compiling") && log.includes("SUCCESS") && <span className="text-[#E8FF00] font-bold">{log}</span>}
                  {!log.startsWith("[ compiling") && log.includes("RATING") && <span className="text-[#4BE2C4] font-bold">{log}</span>}
                  {!log.startsWith("[ compiling") && !log.includes("PASSED") && !log.includes("SUCCESS") && !log.includes("RATING") && <span>{log}</span>}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-1.5 text-[#4BE2C4] animate-pulse">
                  <Activity size={10} className="animate-spin" />
                  <span>Processing test suites...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
