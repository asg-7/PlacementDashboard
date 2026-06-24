export const dsaPatternsData = [
  {
    id: "array",
    name: "Array",
    color: "#00E5FF", // Electric Blue
    children: [
      {
        id: "array-two-pointer",
        name: "Two Pointer",
        children: [
          {
            id: "array-two-pointer-opposite",
            name: "Opposite ends (left + right)",
            problems: [
              { id: "nc-011", title: "Two Sum II - Input Array Is Sorted", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
              { id: "nc-012", title: "3Sum", link: "https://leetcode.com/problems/3sum/" },
              { id: "nc-013", title: "Container With Most Water", link: "https://leetcode.com/problems/container-with-most-water/" },
              { id: "nc-010", title: "Valid Palindrome", link: "https://leetcode.com/problems/valid-palindrome/" }
            ]
          },
          {
            id: "array-two-pointer-same",
            name: "Same direction (fast & slow pointers)",
            problems: [
              { id: "nc-041", title: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/" },
              { id: "nc-042", title: "Find the Duplicate Number", link: "https://leetcode.com/problems/find-the-duplicate-number/" },
              { id: "s-001", title: "Remove Nth Node From End of List", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" }
            ]
          },
          {
            id: "array-two-pointer-partition",
            name: "Partition / Dutch flag",
            problems: [
              { id: "s-004", title: "Sort Colors", link: "https://leetcode.com/problems/sort-colors/" },
              { id: "s-005", title: "Move Zeroes", link: "https://leetcode.com/problems/move-zeroes/" }
            ]
          }
        ]
      },
      {
        id: "array-sliding-window",
        name: "Sliding Window",
        children: [
          {
            id: "array-sliding-window-fixed",
            name: "Fixed Size",
            problems: [
              { id: "nc-018", title: "Permutation in String", link: "https://leetcode.com/problems/permutation-in-string/" },
              { id: "s-032", title: "Maximum Sum Subarray of Size K", link: "https://geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1" }
            ]
          },
          {
            id: "array-sliding-window-variable",
            name: "Variable Size",
            children: [
              {
                id: "array-sliding-window-variable-expand",
                name: "Expand–Shrink",
                problems: [
                  { id: "nc-016", title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
                  { id: "nc-017", title: "Longest Repeating Character Replacement", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
                  { id: "nc-019", title: "Minimum Window Substring", link: "https://leetcode.com/problems/minimum-window-substring/" }
                ]
              },
              {
                id: "array-sliding-window-variable-monotonic",
                name: "Monotonic Window",
                problems: [
                  { id: "nc-020", title: "Sliding Window Maximum", link: "https://leetcode.com/problems/sliding-window-maximum/" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "array-prefix",
        name: "Prefix Based",
        children: [
          {
            id: "array-prefix-sum",
            name: "Prefix Sum",
            problems: [
              { id: "s-011", title: "Subarray Sum Equals K", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
              { id: "s-012", title: "Range Sum Query - Immutable", link: "https://leetcode.com/problems/range-sum-query-immutable/" }
            ]
          },
          {
            id: "array-prefix-xor",
            name: "Prefix XOR",
            problems: [
              { id: "s-013", title: "Subarray with given XOR", link: "https://www.interviewbit.com/problems/subarray-with-given-xor/" },
              { id: "s-014", title: "XOR Queries of a Subarray", link: "https://leetcode.com/problems/xor-queries-of-a-subarray/" }
            ]
          },
          {
            id: "array-prefix-2d",
            name: "2D Prefix",
            problems: [
              { id: "s-015", title: "Range Sum Query 2D - Immutable", link: "https://leetcode.com/problems/range-sum-query-2d-immutable/" }
            ]
          }
        ]
      },
      {
        id: "array-kadane",
        name: "Kadane's / Subarray",
        children: [
          {
            id: "array-kadane-max-sum",
            name: "Max subarray sum (Kadane's)",
            problems: [
              { id: "nc-122", title: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/" }
            ]
          },
          {
            id: "array-kadane-max-prod",
            name: "Max product subarray",
            problems: [
              { id: "nc-114", title: "Maximum Product Subarray", link: "https://leetcode.com/problems/maximum-product-subarray/" }
            ]
          },
          {
            id: "array-kadane-xor-sum",
            name: "Subarray with given XOR / sum",
            problems: [
              { id: "s-112", title: "Subarray Sums Divisible by K", link: "https://leetcode.com/problems/subarray-sums-divisible-by-k/" }
            ]
          }
        ]
      },
      {
        id: "array-binary-search",
        name: "Binary Search",
        children: [
          {
            id: "array-binary-search-index",
            name: "on index",
            problems: [
              { id: "nc-028", title: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
              { id: "nc-031", title: "Find Minimum in Rotated Sorted Array", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
              { id: "nc-032", title: "Search in Rotated Sorted Array", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" }
            ]
          },
          {
            id: "array-binary-search-answer",
            name: "on answer",
            problems: [
              { id: "nc-030", title: "Koko Eating Bananas", link: "https://leetcode.com/problems/koko-eating-bananas/" },
              { id: "s-115", title: "Capacity To Ship Packages Within D Days", link: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "string",
    name: "String",
    color: "#E040FB", // Light Purple / Violet
    children: [
      {
        id: "string-sliding-window",
        name: "Sliding Window",
        children: [
          { id: "string-sliding-window-longest", name: "Longest substring without repeat", problems: [{ id: "nc-016", title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" }] },
          { id: "string-sliding-window-min", name: "Minimum window substring", problems: [{ id: "nc-019", title: "Minimum Window Substring", link: "https://leetcode.com/problems/minimum-window-substring/" }] },
          { id: "string-sliding-window-anagram", name: "Anagram / permutation in string", problems: [{ id: "nc-018", title: "Permutation in String", link: "https://leetcode.com/problems/permutation-in-string/" }] }
        ]
      },
      {
        id: "string-two-pointers",
        name: "Two Pointers",
        children: [
          { id: "string-two-pointers-palindrome", name: "Palindrome check", problems: [{ id: "nc-010", title: "Valid Palindrome", link: "https://leetcode.com/problems/valid-palindrome/" }] },
          { id: "string-two-pointers-reverse", name: "Reverse words / characters", problems: [{ id: "s-152", title: "Reverse Words in a String", link: "https://leetcode.com/problems/reverse-words-in-a-string/" }] },
          { id: "string-two-pointers-compress", name: "String compression", problems: [{ id: "s-153", title: "String Compression", link: "https://leetcode.com/problems/string-compression/" }] }
        ]
      },
      {
        id: "string-pattern",
        name: "Pattern Matching",
        children: [
          { id: "string-pattern-kmp", name: "KMP (failure function)", problems: [{ id: "s-154", title: "Find the Index of the First Occurrence in a String", link: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" }] },
          { id: "string-pattern-rabin", name: "Rabin-Karp (rolling hash)", problems: [{ id: "s-155", title: "Repeated String Match", link: "https://leetcode.com/problems/repeated-string-match/" }] },
          { id: "string-pattern-z", name: "Z-algorithm", problems: [{ id: "s-156", title: "Search Pattern (Z-algorithm)", link: "https://www.geeksforgeeks.org/problems/search-pattern-z-algorithm--141631/1" }] }
        ]
      }
    ]
  },
  {
    id: "hashmap",
    name: "Hash Map",
    color: "#00E676", // Green
    children: [
      { id: "hashmap-freq", name: "Frequency Based", problems: [{ id: "nc-002", title: "Valid Anagram", link: "https://leetcode.com/problems/valid-anagram/" }] },
      { id: "hashmap-lookup", name: "Lookup Based", problems: [{ id: "nc-003", title: "Two Sum", link: "https://leetcode.com/problems/two-sum/" }] },
      { id: "hashmap-set", name: "Set Based", problems: [{ id: "nc-001", title: "Contains Duplicate", link: "https://leetcode.com/problems/contains-duplicate/" }] },
      { id: "hashmap-index", name: "Index Mapping", problems: [{ id: "nc-009", title: "Longest Consecutive Sequence", link: "https://leetcode.com/problems/longest-consecutive-sequence/" }] },
      { id: "hashmap-group", name: "Grouping Pattern", problems: [{ id: "nc-004", title: "Group Anagrams", link: "https://leetcode.com/problems/group-anagrams/" }] }
    ]
  },
  {
    id: "stack",
    name: "Stack",
    color: "#FF9100", // Amber
    children: [
      {
        id: "stack-monotonic",
        name: "Monotonic Stack",
        children: [
          { id: "stack-monotonic-inc", name: "Increasing", problems: [{ id: "nc-025", title: "Daily Temperatures", link: "https://leetcode.com/problems/daily-temperatures/" }] },
          { id: "stack-monotonic-dec", name: "Decreasing", problems: [{ id: "nc-026", title: "Car Fleet", link: "https://leetcode.com/problems/car-fleet/" }] }
        ]
      },
      {
        id: "stack-nearest",
        name: "Nearest Element",
        children: [
          { id: "stack-nearest-greater", name: "Next Greater", problems: [{ id: "s-162", title: "Next Greater Element I", link: "https://leetcode.com/problems/next-greater-element-i/" }] },
          { id: "stack-nearest-smaller", name: "Next Smaller", problems: [{ id: "s-163", title: "Nearest Smaller Element", link: "https://www.interviewbit.com/problems/nearest-smaller-element/" }] },
          { id: "stack-nearest-prev", name: "Previous Variants", problems: [] }
        ]
      },
      { id: "stack-range", name: "Range / Span", problems: [{ id: "s-164", title: "Online Stock Span", link: "https://leetcode.com/problems/online-stock-span/" }] },
      { id: "stack-minmax", name: "min/Max Stack", problems: [{ id: "nc-022", title: "Min Stack", link: "https://leetcode.com/problems/min-stack/" }] },
      { id: "stack-expr", name: "Expression Handling", problems: [{ id: "nc-023", title: "Evaluate Reverse Polish Notation", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" }] },
      { id: "stack-histo", name: "Histogram Pattern", problems: [{ id: "nc-027", title: "Largest Rectangle in Histogram", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }] }
    ]
  },
  {
    id: "queue",
    name: "Queue / Deque",
    color: "#2979FF", // Blue
    children: [
      { id: "queue-fifo", name: "FIFO Processing", problems: [{ id: "s-171", title: "Implement Queue using Stacks", link: "https://leetcode.com/problems/implement-queue-using-stacks/" }] },
      { id: "queue-level", name: "Level-wise Processing", problems: [{ id: "nc-053", title: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" }] },
      { id: "queue-circular", name: "Circular Queue Pattern", problems: [{ id: "s-172", title: "Design Circular Queue", link: "https://leetcode.com/problems/design-circular-queue/" }] },
      { id: "queue-deque", name: "Deque Based", problems: [{ id: "nc-020", title: "Sliding Window Maximum", link: "https://leetcode.com/problems/sliding-window-maximum/" }] }
    ]
  },
  {
    id: "linkedlist",
    name: "Linked List",
    color: "#00B0FF", // Cyan
    children: [
      {
        id: "linkedlist-pointer",
        name: "Pointer Techniques",
        children: [
          { id: "linkedlist-pointer-fastslow", name: "Fast–Slow", problems: [{ id: "nc-041", title: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/" }] },
          { id: "linkedlist-pointer-cycle", name: "Cycle Detection", problems: [{ id: "nc-041", title: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/" }] },
          { id: "linkedlist-pointer-middle", name: "Finding Middle", problems: [{ id: "s-181", title: "Middle of the Linked List", link: "https://leetcode.com/problems/middle-of-the-linked-list/" }] }
        ]
      },
      {
        id: "linkedlist-reversal",
        name: "Reversal",
        children: [
          { id: "linkedlist-reversal-full", name: "Full Reverse", problems: [{ id: "nc-035", title: "Reverse Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" }] },
          { id: "linkedlist-reversal-partial", name: "Partial (k-group)", problems: [{ id: "nc-045", title: "Reverse Nodes in k-Group", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" }] }
        ]
      },
      { id: "linkedlist-merge", name: "Merge Lists", problems: [{ id: "nc-036", title: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" }] }
    ]
  },
  {
    id: "trees",
    name: "Trees",
    color: "#651FFF", // Purple
    children: [
      {
        id: "trees-traversal",
        name: "Traversal",
        children: [
          { id: "trees-traversal-dfs", name: "DFS (Pre / In / Post order)", problems: [{ id: "s-191", title: "Binary Tree Postorder Traversal", link: "https://leetcode.com/problems/binary-tree-postorder-traversal/" }] },
          { id: "trees-traversal-bfs", name: "BFS (Level Order / zigzag / right side view)", problems: [{ id: "nc-054", title: "Binary Tree Right Side View", link: "https://leetcode.com/problems/binary-tree-right-side-view/" }] }
        ]
      },
      {
        id: "trees-recursion",
        name: "Recursion Patterns",
        children: [
          { id: "trees-recursion-topdown", name: "Top Down approach", problems: [{ id: "nc-050", title: "Same Tree", link: "https://leetcode.com/problems/same-tree/" }] },
          { id: "trees-recursion-bottomup", name: "Bottom Up approach", problems: [{ id: "nc-047", title: "Maximum Depth of Binary Tree", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" }] }
        ]
      },
      {
        id: "trees-path",
        name: "Path Based",
        children: [
          { id: "trees-path-max", name: "Max path sum", problems: [{ id: "nc-059", title: "Binary Tree Maximum Path Sum", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" }] },
          { id: "trees-path-diameter", name: "Diameter / Height / depth", problems: [{ id: "nc-048", title: "Diameter of Binary Tree", link: "https://leetcode.com/problems/diameter-of-binary-tree/" }] }
        ]
      },
      { id: "trees-bst", name: "BST (Binary Search Tree)", problems: [{ id: "nc-056", title: "Validate Binary Search Tree", link: "https://leetcode.com/problems/validate-binary-search-tree/" }] }
    ]
  },
  {
    id: "recursion",
    name: "Recursion",
    color: "#FF3D00", // Coral / Red-orange
    children: [
      {
        id: "recursion-backtracking",
        name: "Backtracking",
        children: [
          {
            id: "recursion-backtracking-exploration",
            name: "Exploration",
            children: [
              { id: "rec-bt-exp-dec", name: "Decision Tree", problems: [{ id: "nc-075", title: "Letter Combinations of a Phone Number", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" }] },
              { id: "rec-bt-exp-cee", name: "Choose–Explore–Unchoose", problems: [{ id: "nc-072", title: "Permutations", link: "https://leetcode.com/problems/permutations/" }] },
              { id: "rec-bt-exp-sub", name: "Subsets (power set)", problems: [{ id: "nc-071", title: "Subsets", link: "https://leetcode.com/problems/subsets/" }] },
              { id: "rec-bt-exp-perm", name: "Permutations / Combinations (nCr)", problems: [{ id: "nc-073", title: "Combination Sum", link: "https://leetcode.com/problems/combination-sum/" }] },
              { id: "rec-bt-exp-word", name: "Word search on grid", problems: [{ id: "nc-076", title: "Word Search", link: "https://leetcode.com/problems/word-search/" }] },
              { id: "rec-bt-exp-pal", name: "Palindrome partitioning", problems: [{ id: "nc-077", title: "Palindrome Partitioning", link: "https://leetcode.com/problems/palindrome-partitioning/" }] }
            ]
          },
          { id: "recursion-backtracking-prune", name: "Pruning / State Tracking", problems: [{ id: "nc-078", title: "N-Queens", link: "https://leetcode.com/problems/n-queens/" }] }
        ]
      },
      {
        id: "recursion-divide",
        name: "Divide & Conquer",
        children: [
          { id: "recursion-divide-merge", name: "Merge sort pattern", problems: [{ id: "s-201", title: "Merge Sort", link: "https://leetcode.com/problems/sort-an-array/" }] },
          { id: "recursion-divide-quick", name: "Quick select (Kth largest)", problems: [{ id: "nc-061", title: "Kth Largest Element in an Array", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" }] },
          { id: "recursion-divide-count", name: "Count inversions", problems: [{ id: "s-202", title: "Count Inversions", link: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1" }] }
        ]
      }
    ]
  },
  {
    id: "heap",
    name: "Heap",
    color: "#00E5FF", // Cyan-blue
    children: [
      { id: "heap-topk", name: "Top K / Kth Element / k closest points", problems: [{ id: "nc-060", title: "Kth Largest Element in a Stream", link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" }, { id: "nc-062", title: "K Closest Points to Origin", link: "https://leetcode.com/problems/k-closest-points-to-origin/" }] },
      {
        id: "heap-greedy",
        name: "Greedy + Heap",
        children: [
          { id: "heap-greedy-task", name: "Task scheduler", problems: [{ id: "nc-064", title: "Task Scheduler", link: "https://leetcode.com/problems/task-scheduler/" }] },
          { id: "heap-greedy-meet", name: "Meeting rooms", problems: [{ id: "s-211", title: "Meeting Rooms II", link: "https://leetcode.com/problems/meeting-rooms-ii/" }] },
          { id: "heap-greedy-reorg", name: "Reorganize string", problems: [{ id: "s-212", title: "Reorganize String", link: "https://leetcode.com/problems/reorganize-string/" }] },
          { id: "heap-greedy-huff", name: "Huffman encoding", problems: [] }
        ]
      },
      { id: "heap-kway", name: "K-way Merge", problems: [{ id: "nc-044", title: "Merge k Sorted Lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/" }] }
    ]
  },
  {
    id: "graphs",
    name: "Graphs",
    color: "#FF1744", // Deep Red
    children: [
      {
        id: "graphs-traversal",
        name: "Traversal",
        children: [
          { id: "graphs-traversal-bfs", name: "BFS", problems: [{ id: "nc-082", title: "Clone Graph", link: "https://leetcode.com/problems/clone-graph/" }] },
          { id: "graphs-traversal-dfs", name: "DFS", problems: [{ id: "nc-082", title: "Clone Graph", link: "https://leetcode.com/problems/clone-graph/" }] }
        ]
      },
      {
        id: "graphs-cycle",
        name: "Cycle Detection",
        children: [
          { id: "graphs-cycle-dir", name: "Directed", problems: [{ id: "nc-085", title: "Course Schedule", link: "https://leetcode.com/problems/course-schedule/" }] },
          { id: "graphs-cycle-undir", name: "Undirected", problems: [{ id: "nc-088", title: "Graph Valid Tree", link: "https://leetcode.com/problems/graph-valid-tree/" }] }
        ]
      },
      {
        id: "graphs-topo",
        name: "Topological Sort",
        children: [
          { id: "graphs-topo-sort", name: "Topological Sort (BFS / DFS)", problems: [{ id: "nc-086", title: "Course Schedule II", link: "https://leetcode.com/problems/course-schedule-ii/" }] },
          { id: "graphs-topo-kahns", name: "Kahn's algorithm (BFS in-degree)", problems: [{ id: "nc-086", title: "Course Schedule II", link: "https://leetcode.com/problems/course-schedule-ii/" }] },
          { id: "graphs-topo-dfs", name: "DFS-based topo sort", problems: [{ id: "nc-086", title: "Course Schedule II", link: "https://leetcode.com/problems/course-schedule-ii/" }] }
        ]
      },
      {
        id: "graphs-shortest",
        name: "Shortest Path",
        children: [
          { id: "graphs-shortest-dijkstra", name: "Dijkstra", problems: [{ id: "nc-090", title: "Network Delay Time", link: "https://leetcode.com/problems/network-delay-time/" }] },
          { id: "graphs-shortest-bellman", name: "Bellman-Ford", problems: [{ id: "s-221", title: "Distance from the Source (Bellman-Ford)", link: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford/1" }] },
          { id: "graphs-shortest-floyd", name: "Floyd-Warshall (all pairs)", problems: [{ id: "s-222", title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", link: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" }] }
        ]
      },
      {
        id: "graphs-spanning",
        name: "Spanning Tree",
        children: [
          { id: "graphs-spanning-kruskal", name: "Kruskal", problems: [{ id: "nc-091", title: "Min Cost to Connect All Points", link: "https://leetcode.com/problems/min-cost-to-connect-all-points/" }] },
          { id: "graphs-spanning-prims", name: "Prims", problems: [{ id: "nc-091", title: "Min Cost to Connect All Points", link: "https://leetcode.com/problems/min-cost-to-connect-all-points/" }] }
        ]
      },
      { id: "graphs-dsu", name: "Union-Find (DSU) — Detect cycle in undirected", problems: [{ id: "nc-087", title: "Redundant Connection", link: "https://leetcode.com/problems/redundant-connection/" }] },
      { id: "graphs-bipartite", name: "Bipartite / Multi-source BFS / 0-1 BFS", problems: [{ id: "nc-084", title: "Rotting Oranges", link: "https://leetcode.com/problems/rotting-oranges/" }] }
    ]
  },
  {
    id: "trie",
    name: "Trie",
    color: "#E040FB", // Violet
    children: [
      {
        id: "trie-prefix",
        name: "Prefix Based",
        children: [
          { id: "trie-prefix-insert", name: "Insert / Search", problems: [{ id: "nc-068", title: "Implement Trie (Prefix Tree)", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" }] },
          { id: "trie-prefix-match", name: "Prefix Match", problems: [{ id: "nc-068", title: "Implement Trie (Prefix Tree)", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" }] }
        ]
      },
      { id: "trie-bitwise", name: "Bitwise Trie", problems: [{ id: "s-231", title: "Maximum XOR of Two Numbers in an Array", link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" }] }
    ]
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    color: "#651FFF", // Deep Purple
    children: [
      {
        id: "dp-core",
        name: "Core",
        children: [
          { id: "dp-core-1d", name: "1D", problems: [{ id: "nc-095", title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" }, { id: "nc-097", title: "House Robber", link: "https://leetcode.com/problems/house-robber/" }] },
          { id: "dp-core-2d", name: "2D", problems: [{ id: "nc-105", title: "Unique Paths", link: "https://leetcode.com/problems/unique-paths/" }] }
        ]
      },
      {
        id: "dp-transition",
        name: "Transition Type",
        children: [
          { id: "dp-transition-linear", name: "Linear DP", problems: [{ id: "nc-098", title: "House Robber II", link: "https://leetcode.com/problems/house-robber-ii/" }] },
          { id: "dp-transition-grid", name: "Grid DP", problems: [{ id: "nc-106", title: "Longest Common Subsequence", link: "https://leetcode.com/problems/longest-common-subsequence/" }] },
          { id: "dp-transition-decision", name: "Decision DP", problems: [{ id: "nc-102", title: "Coin Change", link: "https://leetcode.com/problems/coin-change/" }] }
        ]
      },
      {
        id: "dp-pattern",
        name: "Pattern Types",
        children: [
          { id: "dp-pattern-knapsack", name: "Knapsack", problems: [{ id: "nc-111", title: "Partition Equal Subset Sum", link: "https://leetcode.com/problems/partition-equal-subset-sum/" }] },
          { id: "dp-pattern-sequence", name: "Sequence DP", problems: [{ id: "nc-103", title: "Longest Increasing Subsequence", link: "https://leetcode.com/problems/longest-increasing-subsequence/" }] },
          { id: "dp-pattern-partition", name: "Partition DP", problems: [{ id: "nc-120", title: "Burst Balloons", link: "https://leetcode.com/problems/burst-balloons/" }] },
          { id: "dp-pattern-interval", name: "Interval DP", problems: [{ id: "nc-119", title: "Edit Distance", link: "https://leetcode.com/problems/edit-distance/" }] }
        ]
      },
      {
        id: "dp-advanced",
        name: "Advanced",
        children: [
          { id: "dp-advanced-bitmask", name: "Bitmask DP", problems: [] },
          { id: "dp-advanced-digit", name: "Digit DP", problems: [] },
          { id: "dp-advanced-trees", name: "DP on Trees", problems: [] }
        ]
      },
      {
        id: "dp-opt",
        name: "Optimization",
        children: [
          { id: "dp-opt-memo", name: "Memoization", problems: [{ id: "nc-095", title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" }] },
          { id: "dp-opt-tab", name: "Tabulation", problems: [{ id: "nc-095", title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" }] }
        ]
      }
    ]
  },
  {
    id: "greedy",
    name: "Greedy",
    color: "#00E676", // Green Accent
    children: [
      {
        id: "greedy-interval",
        name: "Interval Greedy",
        children: [
          { id: "greedy-interval-activity", name: "Activity Selection", problems: [] },
          { id: "greedy-interval-nonover", name: "Non-overlapping Intervals", problems: [{ id: "nc-132", title: "Non-overlapping Intervals", link: "https://leetcode.com/problems/non-overlapping-intervals/" }] },
          { id: "greedy-interval-minrem", name: "Minimum Removals", problems: [] }
        ]
      },
      {
        id: "greedy-sched",
        name: "Scheduling Greedy",
        children: [
          { id: "greedy-sched-dl", name: "Deadline Based Scheduling", problems: [] },
          { id: "greedy-sched-profit", name: "Profit Based Selection", problems: [] }
        ]
      },
      {
        id: "greedy-resource",
        name: "Resource Allocation",
        children: [
          { id: "greedy-resource-plat", name: "Minimum Platforms / Rooms", problems: [] },
          { id: "greedy-resource-meet", name: "Meeting Rooms", problems: [{ id: "nc-133", title: "Meeting Rooms", link: "https://leetcode.com/problems/meeting-rooms/" }] }
        ]
      },
      { id: "greedy-jump", name: "Jump Game Pattern", problems: [{ id: "nc-123", title: "Jump Game", link: "https://leetcode.com/problems/jump-game/" }] },
      { id: "greedy-huffman", name: "Huffman / Merge Cost", problems: [] }
    ]
  },
  {
    id: "bitmanip",
    name: "Bit Manipulation",
    color: "#2979FF", // Blue Accent
    children: [
      {
        id: "bitmanip-core",
        name: "Core",
        children: [
          { id: "bitmanip-core-xor", name: "XOR Pattern", problems: [{ id: "nc-144", title: "Single Number", link: "https://leetcode.com/problems/single-number/" }] },
          { id: "bitmanip-core-mask", name: "Bit Masking", problems: [{ id: "nc-145", title: "Number of 1 Bits", link: "https://leetcode.com/problems/number-of-1-bits/" }] }
        ]
      },
      {
        id: "bitmanip-usage",
        name: "Usage",
        children: [
          { id: "bitmanip-usage-subset", name: "Subset via Bits", problems: [{ id: "nc-071", title: "Subsets", link: "https://leetcode.com/problems/subsets/" }] },
          { id: "bitmanip-usage-check", name: "Bit Checks", problems: [{ id: "nc-146", title: "Counting Bits", link: "https://leetcode.com/problems/counting-bits/" }] },
          { id: "bitmanip-usage-prefix", name: "Prefix XOR", problems: [] }
        ]
      }
    ]
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    color: "#FF9100", // Yellow/Orange
    children: [
      { id: "sort-bubble", name: "Bubble Sort", problems: [{ id: "s-005", title: "Bubble Sort", link: "https://www.geeksforgeeks.org/problems/bubble-sort/1" }] },
      { id: "sort-selection", name: "Selection Sort", problems: [{ id: "s-004", title: "Selection Sort", link: "https://www.geeksforgeeks.org/problems/selection-sort/1" }] },
      { id: "sort-insertion", name: "Insertion Sort", problems: [{ id: "s-006", title: "Insertion Sort", link: "https://www.geeksforgeeks.org/problems/insertion-sort/1" }] },
      { id: "sort-merge", name: "Merge Sort", problems: [{ id: "s-201", title: "Merge Sort", link: "https://leetcode.com/problems/sort-an-array/" }] },
      { id: "sort-quick", name: "Quick Sort", problems: [{ id: "s-203", title: "Quick Sort", link: "https://www.geeksforgeeks.org/problems/quick-sort/1" }] },
      { id: "sort-heap", name: "Heap Sort", problems: [{ id: "s-204", title: "Heap Sort", link: "https://www.geeksforgeeks.org/problems/heap-sort/1" }] },
      { id: "sort-counting", name: "Counting Sort", problems: [] },
      { id: "sort-radix", name: "Radix Sort", problems: [] },
      { id: "sort-bucket", name: "Bucket Sort", problems: [{ id: "nc-005", title: "Top K Frequent Elements", link: "https://leetcode.com/problems/top-k-frequent-elements/" }] }
    ]
  },
  {
    id: "range",
    name: "Range Structures",
    color: "#00B0FF", // Cyan Accent
    children: [
      {
        id: "range-segtree",
        name: "Segment Tree",
        children: [
          { id: "range-segtree-query", name: "Range Query", problems: [] },
          { id: "range-segtree-lazy", name: "Lazy Propagation", problems: [] }
        ]
      },
      {
        id: "range-fenwick",
        name: "Fenwick Tree",
        children: [
          { id: "range-fenwick-prefix", name: "Prefix Query", problems: [] }
        ]
      }
    ]
  }
];
