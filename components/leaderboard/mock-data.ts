export type Difficulty = "Easy" | "Medium" | "Hard";

export type Contest = {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO
  durationMinutes: number;
  participants: number;
  difficulty: Difficulty;
  status: "upcoming" | "live" | "past";
};

export const featuredContest: Contest = {
  id: "weekly-42",
  title: "CodeCell Weekly #42",
  description:
    "Six handcrafted problems. Two hours. One leaderboard. Bring your A-game.",
  startsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
  durationMinutes: 120,
  participants: 1284,
  difficulty: "Medium",
  status: "upcoming",
};

export type Competitor = {
  rank: number;
  username: string;
  handle: string;
  score: number;
  solved: number;
  penalty: number;
  submissions: number;
  country: string;
  delta: number; // rank delta this week
};

export const leaderboard: Competitor[] = [
  { rank: 1, username: "Aarav Mehta",     handle: "void_runner",   score: 4980, solved: 6, penalty: 312, submissions: 11, country: "IN", delta: 2 },
  { rank: 2, username: "Sana Iqbal",      handle: "segfault.sana", score: 4870, solved: 6, penalty: 348, submissions: 13, country: "IN", delta: -1 },
  { rank: 3, username: "Kabir Shah",      handle: "k4b1r",         score: 4720, solved: 6, penalty: 401, submissions: 14, country: "IN", delta: 5 },
  { rank: 4, username: "Riya Nair",       handle: "ri.ya",         score: 4510, solved: 5, penalty: 289, submissions: 9,  country: "IN", delta: 0 },
  { rank: 5, username: "Devansh Rao",     handle: "dev_rao",       score: 4420, solved: 5, penalty: 305, submissions: 10, country: "IN", delta: 1 },
  { rank: 6, username: "Meera Patel",     handle: "meerap",        score: 4310, solved: 5, penalty: 322, submissions: 12, country: "IN", delta: -2 },
  { rank: 7, username: "Ishaan Kapoor",   handle: "ishxk",         score: 4180, solved: 5, penalty: 360, submissions: 13, country: "IN", delta: 3 },
  { rank: 8, username: "Aditi Sharma",    handle: "aditi.s",       score: 4090, solved: 5, penalty: 388, submissions: 11, country: "IN", delta: -1 },
  { rank: 9, username: "Vivaan Joshi",    handle: "vvn",           score: 3980, solved: 4, penalty: 240, submissions: 8,  country: "IN", delta: 0 },
  { rank: 10, username: "Tara Krishnan",  handle: "tara.k",        score: 3920, solved: 4, penalty: 256, submissions: 9,  country: "IN", delta: 4 },
  { rank: 11, username: "Rohan Bhatt",    handle: "rbhatt",        score: 3840, solved: 4, penalty: 271, submissions: 10, country: "IN", delta: -3 },
  { rank: 12, username: "Anaya Verma",    handle: "anaya.v",       score: 3760, solved: 4, penalty: 288, submissions: 11, country: "IN", delta: 1 },
  { rank: 13, username: "Yash Pawar",     handle: "y.pawar",       score: 3690, solved: 4, penalty: 301, submissions: 12, country: "IN", delta: 0 },
  { rank: 14, username: "Naina Reddy",    handle: "naina_r",       score: 3610, solved: 4, penalty: 320, submissions: 13, country: "IN", delta: -2 },
  { rank: 15, username: "Arjun Sethi",    handle: "arj",           score: 3540, solved: 4, penalty: 339, submissions: 13, country: "IN", delta: 2 },
];

export type TestCase = {
  id: string;
  input: string;
  expected: string;
  hidden?: boolean;
};

export type Problem = {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  acceptance: number; // 0-100
  timeLimitMs: number;
  memoryLimitMb: number;
  statement: string; // markdown-ish plain text
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starter: Record<Language, string>;
};

export type Language = "cpp" | "python" | "javascript" | "java";

export const LANGUAGES: { id: Language; label: string; monaco: string }[] = [
  { id: "cpp",        label: "C++ 17",      monaco: "cpp" },
  { id: "python",     label: "Python 3",    monaco: "python" },
  { id: "javascript", label: "JavaScript",  monaco: "javascript" },
  { id: "java",       label: "Java 17",     monaco: "java" },
];

export const featuredProblem: Problem = {
  id: "p-two-sum-twist",
  slug: "two-sum-twist",
  title: "Two Sum, With a Twist",
  difficulty: "Medium",
  tags: ["array", "hash-map", "two-pointer"],
  acceptance: 47.2,
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement:
    "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nUnlike the classic problem, the array may contain duplicates and you must return the lexicographically smallest pair of indices (0-indexed). If no such pair exists, return `-1 -1`.",
  constraints: [
    "2 ≤ nums.length ≤ 10^5",
    "-10^9 ≤ nums[i] ≤ 10^9",
    "-10^9 ≤ target ≤ 10^9",
    "Exactly one valid answer exists when one exists.",
  ],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "0 1",
      explanation: "nums[0] + nums[1] == 9, and (0,1) is the smallest index pair.",
    },
    {
      input: "nums = [3,3,4,3], target = 6",
      output: "0 1",
      explanation: "Multiple pairs sum to 6; (0,1) is lexicographically smallest.",
    },
  ],
  testCases: [
    { id: "tc-1", input: "4 9\n2 7 11 15", expected: "0 1" },
    { id: "tc-2", input: "4 6\n3 3 4 3",   expected: "0 1" },
    { id: "tc-3", input: "3 10\n1 2 3",    expected: "-1 -1" },
    { id: "tc-4", input: "5 8\n1 5 3 3 5", expected: "1 4", hidden: true },
  ],
  starter: {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; long long target;\n    cin >> n >> target;\n    vector<long long> a(n);\n    for (auto& x : a) cin >> x;\n\n    unordered_map<long long, int> seen;\n    for (int i = 0; i < n; ++i) {\n        long long need = target - a[i];\n        if (seen.count(need)) {\n            cout << seen[need] << ' ' << i << '\\n';\n            return 0;\n        }\n        if (!seen.count(a[i])) seen[a[i]] = i;\n    }\n    cout << "-1 -1\\n";\n    return 0;\n}\n`,
    python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n, target = int(data[0]), int(data[1])\n    a = list(map(int, data[2:2 + n]))\n    seen = {}\n    for i, x in enumerate(a):\n        need = target - x\n        if need in seen:\n            print(seen[need], i)\n            return\n        seen.setdefault(x, i)\n    print(-1, -1)\n\nmain()\n`,
    javascript: `const data = require('fs').readFileSync(0, 'utf8').split(/\\s+/).map(Number);\nconst n = data[0], target = data[1];\nconst a = data.slice(2, 2 + n);\nconst seen = new Map();\nfor (let i = 0; i < n; i++) {\n  const need = target - a[i];\n  if (seen.has(need)) { console.log(seen.get(need), i); process.exit(0); }\n  if (!seen.has(a[i])) seen.set(a[i], i);\n}\nconsole.log(-1, -1);\n`,
    java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StreamTokenizer in = new StreamTokenizer(br);\n        in.nextToken(); int n = (int) in.nval;\n        in.nextToken(); long target = (long) in.nval;\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) { in.nextToken(); a[i] = (long) in.nval; }\n        HashMap<Long, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            long need = target - a[i];\n            if (seen.containsKey(need)) { System.out.println(seen.get(need) + " " + i); return; }\n            seen.putIfAbsent(a[i], i);\n        }\n        System.out.println("-1 -1");\n    }\n}\n`,
  },
};

