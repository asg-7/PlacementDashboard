export const striverTopics = [
  {
    id: "basics",
    title: "1. Learn the Basics",
    problems: [
      {
        id: "s-001",
        title: "Count digits in a number",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/maths/count-digits-in-a-number/",
          gfg: "https://www.geeksforgeeks.org/problems/count-digits5717/1",
          lc: null
        },
        patterns: ["math", "loops"],
        approach: "Divide by 10 and count iterations until number is 0."
      },
      {
        id: "s-002",
        title: "Reverse a number",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/maths/reverse-a-number/",
          gfg: "https://www.geeksforgeeks.org/problems/reverse-an-array/0",
          lc: "https://leetcode.com/problems/reverse-integer/"
        },
        patterns: ["math"],
        approach: "Extract digits using modulo 10 and construct the reversed number check overflow."
      },
      {
        id: "s-003",
        title: "Check Palindrome",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/maths/check-if-a-number-is-palindrome-or-not/",
          gfg: "https://www.geeksforgeeks.org/problems/palindrome0732/1",
          lc: "https://leetcode.com/problems/palindrome-number/"
        },
        patterns: ["math"],
        approach: "Reverse the number and compare with the original value."
      }
    ]
  },
  {
    id: "sorting",
    title: "2. Sorting Techniques",
    problems: [
      {
        id: "s-004",
        title: "Selection Sort",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/sorting/selection-sort-algorithm/",
          gfg: "https://www.geeksforgeeks.org/problems/selection-sort/1",
          lc: null
        },
        patterns: ["sorting"],
        approach: "Select the minimum element from unsorted part and swap it to the beginning."
      },
      {
        id: "s-005",
        title: "Bubble Sort",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/sorting/bubble-sort-algorithm/",
          gfg: "https://www.geeksforgeeks.org/problems/bubble-sort/1",
          lc: null
        },
        patterns: ["sorting"],
        approach: "Repeatedly step through the list, compare adjacent elements, and swap if in wrong order."
      },
      {
        id: "s-006",
        title: "Insertion Sort",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/sorting/insertion-sort-algorithm/",
          gfg: "https://www.geeksforgeeks.org/problems/insertion-sort/1",
          lc: null
        },
        patterns: ["sorting"],
        approach: "Insert elements in their proper position one by one like sorting cards."
      }
    ]
  },
  {
    id: "arrays-easy",
    title: "3. Solve Problems on Arrays (Easy)",
    problems: [
      {
        id: "s-007",
        title: "Largest Element in Array",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/find-the-largest-element-in-an-array/",
          gfg: "https://www.geeksforgeeks.org/problems/largest-element-in-array3846/1",
          lc: null
        },
        patterns: ["arrays"],
        approach: "Keep a max variable and iterate through the array to find largest."
      },
      {
        id: "s-008",
        title: "Second Largest Element in Array",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/find-second-largest-element-in-an-array-without-sorting/",
          gfg: "https://www.geeksforgeeks.org/problems/second-largest3735/1",
          lc: null
        },
        patterns: ["arrays"],
        approach: "Keep track of largest and second largest in a single pass."
      },
      {
        id: "s-009",
        title: "Check if Array is Sorted",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/check-if-an-array-is-sorted/",
          gfg: "https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted3042/1",
          lc: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/"
        },
        patterns: ["arrays"],
        approach: "Verify that every element is smaller than or equal to its successor."
      }
    ]
  },
  {
    id: "arrays-medium",
    title: "4. Solve Problems on Arrays (Medium)",
    problems: [
      {
        id: "s-010",
        title: "Two Sum",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-an-array/",
          gfg: "https://www.geeksforgeeks.org/problems/key-pair5616/1",
          lc: "https://leetcode.com/problems/two-sum/"
        },
        patterns: ["arrays", "hashing"],
        approach: "Use a hashmap to store seen elements and check for target complement."
      },
      {
        id: "s-011",
        title: "Sort an array of 0s, 1s, 2s (Dutch National Flag)",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s/",
          gfg: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1",
          lc: "https://leetcode.com/problems/sort-colors/"
        },
        patterns: ["arrays", "two-pointers"],
        approach: "Maintain three pointers low, mid, high. Swap 0s to low and 2s to high."
      },
      {
        id: "s-012",
        title: "Kadane's Algorithm (Max Subarray Sum)",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/",
          gfg: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
          lc: "https://leetcode.com/problems/maximum-subarray/"
        },
        patterns: ["arrays", "dp"],
        approach: "Track current subarray sum. If negative, reset to 0. Keep global maximum."
      }
    ]
  },
  {
    id: "arrays-hard",
    title: "5. Solve Problems on Arrays (Hard)",
    problems: [
      {
        id: "s-013",
        title: "Pascal's Triangle",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/program-to-generate-pascals-triangle/",
          gfg: "https://www.geeksforgeeks.org/problems/pascals-triangle5521/1",
          lc: "https://leetcode.com/problems/pascals-triangle/"
        },
        patterns: ["arrays", "math"],
        approach: "Generate each row using combinations or summation of elements above."
      },
      {
        id: "s-014",
        title: "Majority Element (n/3 times)",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/majority-elementsn-3-times-find-the-elements-that-appears-more-than-n-3-times-in-an-array/",
          gfg: "https://www.geeksforgeeks.org/problems/majority-vote/1",
          lc: "https://leetcode.com/problems/majority-element-ii/"
        },
        patterns: ["arrays", "boyer-moore"],
        approach: "Use Boyer-Moore Majority Vote algorithm tracking two potential candidates."
      }
    ]
  },
  {
    id: "binary-search-1d",
    title: "6. Binary Search (1D)",
    problems: [
      {
        id: "s-015",
        title: "Binary Search Implementation",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/binary-search/binary-search-explained/",
          gfg: "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",
          lc: "https://leetcode.com/problems/binary-search/"
        },
        patterns: ["binary-search"],
        approach: "Check mid-element. Shrink space left or right based on comparisons."
      },
      {
        id: "s-016",
        title: "Search in Rotated Sorted Array",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/binary-search/search-element-in-a-rotated-sorted-array/",
          gfg: "https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1",
          lc: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
        },
        patterns: ["binary-search"],
        approach: "Identify which half is sorted. Perform search within the sorted bounds."
      }
    ]
  },
  {
    id: "strings-easy-med",
    title: "7. Learn Strings (Easy / Medium)",
    problems: [
      {
        id: "s-017",
        title: "Reverse Words in a String",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/reverse-words-in-a-string/",
          gfg: "https://www.geeksforgeeks.org/problems/reverse-words-in-a-given-string5416/1",
          lc: "https://leetcode.com/problems/reverse-words-in-a-string/"
        },
        patterns: ["strings"],
        approach: "Parse words into array, filter extra spaces, reverse order and join."
      },
      {
        id: "s-018",
        title: "Valid Anagram",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/check-if-two-strings-are-anagram-of-each-other/",
          gfg: "https://www.geeksforgeeks.org/problems/anagram-1587115620/1",
          lc: "https://leetcode.com/problems/valid-anagram/"
        },
        patterns: ["strings", "hashing"],
        approach: "Compare character frequency counts of both strings."
      }
    ]
  },
  {
    id: "linkedlist-basics",
    title: "8. Learn LinkedList",
    problems: [
      {
        id: "s-019",
        title: "Reverse a LinkedList",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/reverse-a-linked-list/",
          gfg: "https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1",
          lc: "https://leetcode.com/problems/reverse-linked-list/"
        },
        patterns: ["linkedlists"],
        approach: "Use three pointers (prev, curr, next) to flip node references in place."
      },
      {
        id: "s-020",
        title: "Detect a Loop in LinkedList",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list/",
          gfg: "https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1",
          lc: "https://leetcode.com/problems/linked-list-cycle/"
        },
        patterns: ["linkedlists", "two-pointers"],
        approach: "Use Floyd's Cycle-Finding Algorithm (slow and fast pointer collision)."
      }
    ]
  },
  {
    id: "recursion",
    title: "9. Recursion & Backtracking",
    problems: [
      {
        id: "s-021",
        title: "Subset Sums",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/subset-sum-sum-of-all-subsets/",
          gfg: "https://www.geeksforgeeks.org/problems/subset-sums2234/1",
          lc: null
        },
        patterns: ["recursion"],
        approach: "At each step, make binary decision to include or exclude elements."
      },
      {
        id: "s-022",
        title: "N-Queens Solver",
        difficulty: "hard",
        sources: {
          striver: "https://takeuforward.org/data-structure/n-queen-problem-backtracking/",
          gfg: "https://www.geeksforgeeks.org/problems/n-queen-problem0315/1",
          lc: "https://leetcode.com/problems/n-queens/"
        },
        patterns: ["recursion", "backtracking"],
        approach: "Place queens row by row. Backtrack if diagonal/row collision is found."
      }
    ]
  },
  {
    id: "greedy",
    title: "10. Greedy Algorithms",
    problems: [
      {
        id: "s-023",
        title: "N Meetings in One Room",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/n-meetings-in-one-room/",
          gfg: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
          lc: null
        },
        patterns: ["greedy"],
        approach: "Sort meetings by end times. Select meeting if start time is after last end time."
      },
      {
        id: "s-024",
        title: "Fractional Knapsack",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/fractional-knapsack-problem-greedy-approach/",
          gfg: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
          lc: null
        },
        patterns: ["greedy"],
        approach: "Sort items by value-to-weight ratio. Take greedily as much as possible."
      }
    ]
  },
  {
    id: "stacks-queues-striver",
    title: "11. Stacks and Queues",
    problems: [
      {
        id: "s-025",
        title: "Next Greater Element",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/next-greater-element-using-stack/",
          gfg: "https://www.geeksforgeeks.org/problems/next-greater-element/1",
          lc: "https://leetcode.com/problems/next-greater-element-i/"
        },
        patterns: ["stacks", "monotonic-stack"],
        approach: "Use a decreasing monotonic stack scanning from right to left."
      }
    ]
  },
  {
    id: "sliding-window",
    title: "12. Sliding Window & Two Pointers",
    problems: [
      {
        id: "s-026",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/longest-substring-without-repeating-characters/",
          gfg: "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1",
          lc: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
        },
        patterns: ["sliding-window"],
        approach: "Maintain sliding window bounds using hashmap to record index of seen letters."
      }
    ]
  },
  {
    id: "heaps",
    title: "13. Heaps",
    problems: [
      {
        id: "s-027",
        title: "Kth Largest Element in an Array",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array/",
          gfg: "https://www.geeksforgeeks.org/problems/k-largest-elements3736/1",
          lc: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
        },
        patterns: ["heaps", "priority-queue"],
        approach: "Maintain a min-heap of size K. Discard smaller elements."
      }
    ]
  },
  {
    id: "trees-striver",
    title: "14. Binary Trees",
    problems: [
      {
        id: "s-028",
        title: "Binary Tree Traversals (In/Pre/Post Order)",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/data-structure/preorder-inorder-postorder-traversal-in-one-traversal/",
          gfg: "https://www.geeksforgeeks.org/problems/inorder-traversal/1",
          lc: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
        },
        patterns: ["trees"],
        approach: "Use standard DFS (recursive/iterative using stacks) to traverse tree nodes."
      }
    ]
  },
  {
    id: "bst",
    title: "15. Binary Search Trees",
    problems: [
      {
        id: "s-029",
        title: "Search in a Binary Search Tree",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/binary-search-tree/search-in-a-binary-search-tree-bst/",
          gfg: "https://www.geeksforgeeks.org/problems/search-a-node-in-bst/1",
          lc: "https://leetcode.com/problems/search-in-a-binary-search-tree/"
        },
        patterns: ["bst"],
        approach: "If target is smaller search left; if larger search right."
      }
    ]
  },
  {
    id: "graphs-striver",
    title: "16. Graphs",
    problems: [
      {
        id: "s-030",
        title: "Breadth First Search (BFS)",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/graph/breadth-first-search-bfs-level-order-traversal/",
          gfg: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
          lc: null
        },
        patterns: ["graphs"],
        approach: "Use a queue and visit array to traverse nodes level by level."
      },
      {
        id: "s-031",
        title: "Depth First Search (DFS)",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/graph/depth-first-search-dfs-traversal-algorithm/",
          gfg: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1",
          lc: null
        },
        patterns: ["graphs"],
        approach: "Use recursive call stack to traverse down path as deep as possible before backtracking."
      }
    ]
  },
  {
    id: "dp-striver",
    title: "17. Dynamic Programming",
    problems: [
      {
        id: "s-032",
        title: "0-1 Knapsack Problem",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/0-1-knapsack-dp-19/",
          gfg: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0817/1",
          lc: null
        },
        patterns: ["dp"],
        approach: "Use grid of [n][weights]. Recurrence is max(take, don't take)."
      }
    ]
  },
  {
    id: "tries",
    title: "18. Tries",
    problems: [
      {
        id: "s-033",
        title: "Implement Trie (Prefix Tree)",
        difficulty: "medium",
        sources: {
          striver: "https://takeuforward.org/data-structure/implement-trie-how-to-implement-trie/",
          gfg: "https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1",
          lc: "https://leetcode.com/problems/implement-trie-prefix-tree/"
        },
        patterns: ["tries"],
        approach: "Represent each letter as a child node in a map/array of size 26."
      }
    ]
  },
  {
    id: "bit-manipulation",
    title: "19. Bit Manipulation",
    problems: [
      {
        id: "s-034",
        title: "Power of Two",
        difficulty: "easy",
        sources: {
          striver: "https://takeuforward.org/binary-search/check-if-a-number-is-power-of-two/",
          gfg: "https://www.geeksforgeeks.org/problems/power-of-2-1587115620/1",
          lc: "https://leetcode.com/problems/power-of-two/"
        },
        patterns: ["bits"],
        approach: "Verify that `n & (n - 1) == 0` for `n > 0`."
      }
    ]
  }
];
