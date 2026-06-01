"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Play, ChevronLeft, Activity, ShieldCheck, CheckCircle2, FileText, History, Code2, Terminal } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const problemData: Record<string, any> = {
  "01": {
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    acceptance: "42.5%",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    inputFormat: "Array of integers `nums`, Integer `target`",
    outputFormat: "Array of two integers",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
      "Java": `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "0ms" },
      { name: "Test Case 2", status: "PASS", time: "1ms" },
      { name: "Test Case 3", status: "PASS", time: "0ms" },
    ],
    editorialApproach: "O(N) One-Pass Hash Map",
    editorialComplexity: "Time Complexity: O(N)\nSpace Complexity: O(N)",
    editorialDesc: "Use a Hash Map to store indices of numbers as we traverse. For each element x, check if target - x is already present. This reduces the search time from O(N) to O(1) per element, bringing down overall time complexity to O(N).",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "2 mins ago", runtime: "28 ms", memory: "10.4 MB" },
      { status: "Wrong Answer", timeAgo: "10 mins ago", runtime: "N/A", memory: "N/A" },
      { status: "Compile Error", timeAgo: "15 mins ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "02": {
    title: "Add Two Numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math"],
    acceptance: "38.2%",
    desc: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    inputFormat: "Two linked lists l1 and l2",
    outputFormat: "A linked list representing the sum",
    sampleInput: "l1 = [2,4,3], l2 = [5,6,4]",
    sampleOutput: "[7,0,8]",
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    templates: {
      "C++": `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};`,
      "Python": `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:\n        pass`,
      "Java": `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n * }\n */\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "2ms" },
      { name: "Test Case 2", status: "PASS", time: "1ms" },
      { name: "Test Case 3", status: "PASS", time: "2ms" },
    ],
    editorialApproach: "Elementary Math with Pointer Simulation",
    editorialComplexity: "Time Complexity: O(max(N, M))\nSpace Complexity: O(max(N, M))",
    editorialDesc: "Iterate through both linked lists simultaneously representing digits in reverse. Maintain a running carry variable. Create a new Node for each digit sum (val1 + val2 + carry) % 10, and set carry = (val1 + val2 + carry) / 10. Continue until both lists are fully traversed and carry is zero.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "5 mins ago", runtime: "64 ms", memory: "43.2 MB" },
      { status: "Time Limit Exceeded", timeAgo: "30 mins ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "03": {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["Hash Table", "String", "Sliding Window"],
    acceptance: "33.1%",
    desc: "Given a string `s`, find the length of the longest substring without repeating characters. A substring is a contiguous non-empty sequence of characters within a string.",
    inputFormat: "String s",
    outputFormat: "Integer — length of the longest substring",
    sampleInput: 's = "abcabcbb"',
    sampleOutput: "3",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      "Java": `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "4ms" },
      { name: "Test Case 2", status: "PASS", time: "3ms" },
    ],
    editorialApproach: "Sliding Window with Dynamic Pointers",
    editorialComplexity: "Time Complexity: O(N)\nSpace Complexity: O(min(M, N))",
    editorialDesc: "Use a Hash Set or Map as a sliding window to track unique characters in the current substring. Maintain two pointers left and right. If the character at right is already in the window, advance left to remove the duplicate. Record the maximum window size at each step.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "1 day ago", runtime: "52 ms", memory: "8.9 MB" },
      { status: "Wrong Answer", timeAgo: "1 day ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "04": {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance: "25.4%",
    desc: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    inputFormat: "Two sorted arrays nums1 and nums2",
    outputFormat: "Float — the median value",
    sampleInput: "nums1 = [1,3], nums2 = [2]",
    sampleOutput: "2.00000",
    constraints: [
      "nums1.length == m, nums2.length == n",
      "0 <= m <= 1000, 0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass`,
      "Java": `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "8ms" },
      { name: "Test Case 2", status: "PASS", time: "6ms" },
      { name: "Test Case 3", status: "PASS", time: "7ms" },
    ],
    editorialApproach: "Binary Search on Partition Index",
    editorialComplexity: "Time Complexity: O(log(min(M, N)))\nSpace Complexity: O(1)",
    editorialDesc: "To find the median in logarithmic time, perform binary search on the smaller array to partition both arrays such that the left halves contain the same number of elements as the right halves. Verify if the maximum elements on left are smaller than minimum elements on right, then compute the median accordingly.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "2 hours ago", runtime: "84 ms", memory: "46.1 MB" },
      { status: "Time Limit Exceeded", timeAgo: "3 hours ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "05": {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topics: ["String", "Dynamic Programming"],
    acceptance: "31.8%",
    desc: "Given a string `s`, return the longest palindromic substring in `s`. A palindrome reads the same forward and backward.",
    inputFormat: "String s",
    outputFormat: "String — the longest palindromic substring",
    sampleInput: 's = "babad"',
    sampleOutput: '"bab"',
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass`,
      "Java": `class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "12ms" },
      { name: "Test Case 2", status: "PASS", time: "8ms" },
    ],
    editorialApproach: "Expand Around Centers",
    editorialComplexity: "Time Complexity: O(N^2)\nSpace Complexity: O(1)",
    editorialDesc: "A palindrome mirrors around its center. There are 2n - 1 such centers (single letters and spaces between letters). For each center, expand outward as long as characters match and return the longest palindromic substring discovered.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "45 mins ago", runtime: "124 ms", memory: "14.1 MB" },
      { status: "Wrong Answer", timeAgo: "1 hour ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "10": {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    topics: ["String", "Dynamic Programming", "Recursion"],
    acceptance: "28.3%",
    desc: "Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element. The matching should cover the entire input string.",
    inputFormat: "String s, Pattern p",
    outputFormat: "Boolean — true if s matches p",
    sampleInput: 's = "aa", p = "a*"',
    sampleOutput: "true",
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 20",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '.', and '*'."
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    bool isMatch(string s, string p) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        pass`,
      "Java": `class Solution {\n    public boolean isMatch(String s, String p) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "0ms" },
      { name: "Test Case 2", status: "PASS", time: "1ms" },
      { name: "Test Case 3", status: "PASS", time: "0ms" },
    ],
    editorialApproach: "Dynamic Programming Bottom-Up",
    editorialComplexity: "Time Complexity: O(T * P)\nSpace Complexity: O(T * P)",
    editorialDesc: "Let dp[i][j] represent if the text prefix s[0..i-1] matches pattern prefix p[0..j-1]. Fill the DP table: if pattern character is *, match zero preceding characters (dp[i][j-2]) or match multiple if the preceding pattern matches text.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "3 hours ago", runtime: "8 ms", memory: "6.5 MB" },
      { status: "Time Limit Exceeded", timeAgo: "4 hours ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "11": {
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers"],
    acceptance: "53.2%",
    desc: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    inputFormat: "Array of integers height",
    outputFormat: "Integer — maximum water area",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]",
    sampleOutput: "49",
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass`,
      "Java": `class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "3ms" },
      { name: "Test Case 2", status: "PASS", time: "2ms" },
    ],
    editorialApproach: "Two Pointer Greedy Approach",
    editorialComplexity: "Time Complexity: O(N)\nSpace Complexity: O(1)",
    editorialDesc: "Initialize two pointers: left = 0 and right = size - 1. The area is constrained by the shorter vertical line. Since moving the taller pointer can never increase the area, greedily move the shorter pointer inward to search for potential taller boundary lines.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "10 mins ago", runtime: "56 ms", memory: "28.3 MB" },
      { status: "Wrong Answer", timeAgo: "20 mins ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "15": {
    title: "3Sum",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers", "Sorting"],
    acceptance: "30.5%",
    desc: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    inputFormat: "Array of integers nums",
    outputFormat: "Array of triplets",
    sampleInput: "nums = [-1,0,1,2,-1,-4]",
    sampleOutput: "[[-1,-1,2],[-1,0,1]]",
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass`,
      "Java": `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "15ms" },
      { name: "Test Case 2", status: "PASS", time: "12ms" },
      { name: "Test Case 3", status: "PASS", time: "14ms" },
    ],
    editorialApproach: "Sorting and Two Pointers",
    editorialComplexity: "Time Complexity: O(N^2)\nSpace Complexity: O(N)",
    editorialDesc: "Sort the array first. Iterate through each element as a fixed value nums[i]. Use two pointers (left starting at i+1 and right starting at end) to find pairs that sum to -nums[i]. Skip duplicate values to ensure unique triplets.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "1 hour ago", runtime: "112 ms", memory: "20.4 MB" },
      { status: "Wrong Answer", timeAgo: "2 hours ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "20": {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["String", "Stack"],
    acceptance: "40.2%",
    desc: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "String s",
    outputFormat: "Boolean — true if valid",
    sampleInput: 's = "([]){}"',
    sampleOutput: "true",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    templates: {
      "C++": `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
      "Python": `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      "Java": `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "0ms" },
      { name: "Test Case 2", status: "PASS", time: "0ms" },
      { name: "Test Case 3", status: "PASS", time: "1ms" },
    ],
    editorialApproach: "Stack Data Structure Representation",
    editorialComplexity: "Time Complexity: O(N)\nSpace Complexity: O(N)",
    editorialDesc: "Use a stack to track open brackets. As you traverse the string, push open brackets onto the stack. For a closing bracket, check if the stack is non-empty and if the top of the stack matches its corresponding open bracket. Return true if stack is empty at the end.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "15 mins ago", runtime: "4 ms", memory: "6.2 MB" },
      { status: "Wrong Answer", timeAgo: "25 mins ago", runtime: "N/A", memory: "N/A" }
    ]
  },
  "23": {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    topics: ["Linked List", "Divide and Conquer", "Heap"],
    acceptance: "46.1%",
    desc: "You are given an array of k linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    inputFormat: "Array of k sorted linked lists",
    outputFormat: "A single merged sorted linked list",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,3,4,4,5,6]",
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "The total number of nodes across all lists does not exceed 10^4."
    ],
    templates: {
      "C++": `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n * };\n */\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        \n    }\n};`,
      "Python": `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeKLists(self, lists: List[ListNode]) -> ListNode:\n        pass`,
      "Java": `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n * }\n */\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        \n    }\n}`
    },
    testCases: [
      { name: "Test Case 1", status: "PASS", time: "5ms" },
      { name: "Test Case 2", status: "PASS", time: "3ms" },
    ],
    editorialApproach: "Divide & Conquer or Min-Heap",
    editorialComplexity: "Time Complexity: O(N log k)\nSpace Complexity: O(k)",
    editorialDesc: "Use a Min-Heap (priority queue) to keep track of the head nodes of all k lists. Pop the smallest node, append it to the merged list, and push its next node into the heap. Repeat until heap is empty.",
    mockSubmissions: [
      { status: "Accepted", timeAgo: "30 mins ago", runtime: "44 ms", memory: "22.8 MB" },
      { status: "Time Limit Exceeded", timeAgo: "50 mins ago", runtime: "N/A", memory: "N/A" }
    ]
  },
};

const defaultProblem = problemData["01"];

export default function SolveChallengePage() {
  const params = useParams();
  const idRaw = params?.id as string || "01";
  const id = idRaw.replace("solve-", "");
  const problem = problemData[id] || defaultProblem;

  const [language, setLanguage] = useState<"C++" | "Python" | "Java">("C++");
  const [code, setCode] = useState(problem.templates["C++"]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "submissions" | "editorial">("problem");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "C++" | "Python" | "Java";
    setLanguage(newLang);
    setCode(problem.templates[newLang]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      
      // We must use setTimeout to allow React state to update before setting cursor
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs([]);

    const steps = [
      `> Compiling ${language} code...`,
      `[ compiling successfully in 410ms ]`,
      `> Executing test suite...`,
    ];

    let delay = 0;
    steps.forEach((step) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, step]);
      }, delay);
      delay += 400;
    });

    problem.testCases.forEach((tc: any, index: number) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, `[ TEST ${index + 1} ]: ${tc.name} ... PASSED (${tc.time})`]);
      }, delay);
      delay += 500;
    });

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev, 
        `\n>> SUCCESS: ALL TESTS PASSED.`,
        `>> Accepted. Runtime beats 98.4% of users.`
      ]);
      setIsRunning(false);
    }, delay);
  };

  // Generate line numbers based on code line count
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(10, lineCount) }, (_, i) => i + 1);

  return (
    <div className="h-screen -mt-20 pt-20 bg-[#0A0A0A] pb-4 max-w-full flex flex-col select-none overflow-hidden relative">
      
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 pt-3 px-4 md:px-8 shrink-0 bg-[#111111]">
        <div className="flex items-center gap-4">
          <Link href="/challenges">
            <button className="text-[#8A8880] hover:text-[#F0EDE6] transition-colors flex items-center gap-1 font-mono text-xs">
              <ChevronLeft size={14} /> LIST
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#F0EDE6]">{problem.title}</h1>
            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#1A1A1A] 
              ${problem.difficulty === "Easy" ? "text-[#4BE2C4]" : problem.difficulty === "Medium" ? "text-[#E8FF00]" : "text-[#FF4D00]"}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden px-4 md:px-8 mt-4">
        
        {/* Left Panel: Problem Tabs */}
        <div className="bg-[#111111] border border-[#2A2A2A] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-[#2A2A2A] bg-[#161616]">
            <button 
              onClick={() => setActiveTab("problem")}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-[11px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === "problem" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-transparent text-[#8A8880] hover:text-[#F0EDE6]"}`}
            >
              <FileText size={14} /> DESCRIPTION
            </button>
            <button 
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-[11px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === "submissions" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-transparent text-[#8A8880] hover:text-[#F0EDE6]"}`}
            >
              <History size={14} /> SUBMISSIONS
            </button>
            <button 
              onClick={() => setActiveTab("editorial")}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-[11px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === "editorial" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-transparent text-[#8A8880] hover:text-[#F0EDE6]"}`}
            >
              <Code2 size={14} /> EDITORIAL
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto flex-1 select-text scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent">
            {activeTab === "problem" && (
              <div className="space-y-6">
                <p className="font-sans text-sm text-[#F0EDE6] leading-relaxed">
                  {problem.desc}
                </p>

                <div>
                  <h3 className="font-mono text-xs font-bold text-[#F0EDE6] mb-2">Example 1:</h3>
                  <div className="bg-[#1A1A1A] border-l-2 border-[#D4AF37] p-3 font-mono text-xs text-[#8A8880]">
                    <span className="block mb-1 text-[#F0EDE6]">Input: <span className="text-[#8A8880]">{problem.sampleInput}</span></span>
                    <span className="block text-[#F0EDE6]">Output: <span className="text-[#8A8880]">{problem.sampleOutput}</span></span>
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs font-bold text-[#F0EDE6] mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {problem.constraints.map((c: string, idx: number) => (
                      <li key={idx} className="font-mono text-xs text-[#8A8880] bg-[#1A1A1A] px-2 py-0.5 rounded inline-block mb-1 mr-2">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === "submissions" && (
              <div className="space-y-4 w-full">
                {(problem.mockSubmissions || [
                  { status: "Accepted", timeAgo: "2 mins ago", runtime: "12 ms", memory: "14.2 MB" },
                  { status: "Wrong Answer", timeAgo: "10 mins ago", runtime: "N/A", memory: "N/A" }
                ]).map((sub: any, idx: number) => (
                  <div key={idx} className={`flex justify-between items-center bg-[#1A1A1A] p-3 border border-[#2A2A2A] ${sub.status !== "Accepted" ? "opacity-70" : ""}`}>
                    <div>
                      <span className={`font-bold font-mono text-xs ${
                        sub.status === "Accepted" ? "text-[#D4AF37]" : 
                        sub.status === "Wrong Answer" ? "text-[#FF3333]" : 
                        sub.status === "Compile Error" ? "text-[#FF9F00]" : "text-[#D4AF37]"
                      }`}>{sub.status}</span>
                      <span className="text-[10px] text-[#8A8880] ml-3 font-mono">{sub.timeAgo}</span>
                    </div>
                    <div className="text-xs text-[#F0EDE6] font-mono">
                      <span className="text-[#8A8880]">Runtime:</span> {sub.runtime} <span className="text-[#8A8880] mx-1">|</span> <span className="text-[#8A8880]">Mem:</span> {sub.memory}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "editorial" && (
              <div className="space-y-6 text-sm text-[#F0EDE6] leading-relaxed font-sans">
                <div>
                  <h3 className="text-[#D4AF37] font-bold text-lg mb-2">Approach: {problem.editorialApproach || "Optimal Strategy"}</h3>
                  <p className="text-[#8A8880]">
                    {problem.editorialDesc || "The solution explanation is currently being computed."}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] p-4 border-l-2 border-[#D4AF37] font-mono text-xs text-[#8A8880] whitespace-pre-line">
                  {problem.editorialComplexity || "Complexity breakdown is not defined."}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          
          {/* Editor Container */}
          <div className="bg-[#111111] border border-[#2A2A2A] flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Editor Toolbar */}
            <div className="border-b border-[#2A2A2A] bg-[#161616] px-4 py-2 flex items-center justify-between">
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#F0EDE6] px-2 py-1 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="C++">C++17</option>
                <option value="Python">Python 3.10</option>
                <option value="Java">Java 17</option>
              </select>
              <span className="font-mono text-[10px] text-[#4A4A4A]">AUTO-SAVED</span>
            </div>
            
            {/* Custom Code Editor with Line Numbers */}
            <div className="flex flex-1 overflow-hidden relative">
              {/* Line Numbers */}
              <div className="bg-[#161616] border-r border-[#2A2A2A] text-[#4A4A4A] font-mono text-[13px] leading-[21px] py-4 px-3 text-right select-none w-12 overflow-hidden">
                {lineNumbers.map(n => <div key={n}>{n}</div>)}
              </div>
              
              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="flex-1 bg-[#111111] text-[#F0EDE6] font-mono text-[13px] leading-[21px] p-4 focus:outline-none resize-none select-text whitespace-pre overflow-auto scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Run Toolbar */}
            <div className="border-t border-[#2A2A2A] bg-[#161616] p-3 flex items-center justify-between">
              <button className="text-[#8A8880] hover:text-[#F0EDE6] font-mono text-xs transition-colors">
                Console
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="px-4 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#F0EDE6] bg-[#2A2A2A] hover:bg-[#3E3E3C] transition-colors disabled:opacity-50"
                >
                  RUN
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="px-4 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#0A0A0A] bg-[#D4AF37] hover:bg-[#F5E6A3] transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Play size={12} /> SUBMIT
                </button>
              </div>
            </div>
          </div>

          {/* Output Console (Expandable) */}
          <div className="bg-[#111111] border border-[#2A2A2A] h-[200px] flex flex-col font-mono text-[11px] shrink-0">
            <div className="border-b border-[#2A2A2A] bg-[#161616] px-4 py-2 flex items-center justify-between">
              <span className="text-[#8A8880] flex items-center gap-2">
                <Terminal size={14} /> EXECUTION LOG
              </span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto select-text scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent bg-[#0D0D0D]">
              {consoleLogs.length === 0 && !isRunning && (
                <div className="text-[#4A4A4A]">// Run code to see output</div>
              )}
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log.includes("PASSED") && <span className="text-[#D4AF37]">{log}</span>}
                  {log.includes("SUCCESS") && <span className="text-[#F5E6A3] font-bold">{log}</span>}
                  {log.includes("Accepted") && <span className="text-[#D4AF37] font-bold">{log}</span>}
                  {!log.includes("PASSED") && !log.includes("SUCCESS") && !log.includes("Accepted") && <span className="text-[#8A8880]">{log}</span>}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-[#D4AF37] animate-pulse mt-2">
                  <Activity size={12} className="animate-spin" />
                  Running test suites...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
