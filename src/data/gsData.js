export const gsPuzzles = [
  {
    id: "puz-1",
    category: "probability",
    title: "3 Ants on a Triangle",
    difficulty: "medium",
    hint: "Think about when the ants do NOT collide. They only avoid collision if they all walk in the same direction.",
    solution: "Each ant can walk in 2 directions (clockwise or counter-clockwise). Total possible combinations = 2^3 = 8. They only avoid collision if they all move clockwise (1 way) or all move counter-clockwise (1 way). So non-collision ways = 2. Probability of no collision = 2/8 = 1/4. Hence, probability of collision = 1 - 1/4 = 3/4 (75%)."
  },
  {
    id: "puz-2",
    category: "logic",
    title: "Heavy Pill Bottle",
    difficulty: "medium",
    hint: "You can only use the scale ONCE. Take different number of pills from each bottle.",
    solution: "Label the bottles 1 to 20. Take 1 pill from bottle 1, 2 from bottle 2, 3 from bottle 3, ..., and 20 from bottle 20. Total pills taken = 210. If all pills were normal (10g), total weight would be 2100g. If bottle 'k' has the heavy pills (11g), the total weight will be 2100 + k grams. Therefore, the excess weight in grams directly tells you the bottle number."
  },
  {
    id: "puz-3",
    category: "probability",
    title: "Russian Roulette (2 Adjacent Bullets)",
    difficulty: "hard",
    hint: "Calculate conditional probability. You already know the first chamber was empty.",
    solution: "There are 6 chambers. Two adjacent are loaded. Let's represent chambers as 1,2 (loaded) and 3,4,5,6 (empty). The first shot was empty, so you are in one of the empty chambers (3, 4, 5, or 6). If you spin, your chance of dying is 2/6 = 1/3. If you pull trigger again without spinning: if you were in 3, next is 4 (empty); if in 4, next is 5 (empty); if in 5, next is 6 (empty); if in 6, next is 1 (loaded). So only 1 of the 4 starting positions leads to a bullet. Probability of dying is 1/4 (25%). 1/4 is better than 1/3, so you should pull the trigger again without spinning!"
  },
  {
    id: "puz-4",
    category: "logic",
    title: "100 Prisoners and 100 Boxes",
    difficulty: "hard",
    hint: "Each prisoner should use a loop-following strategy starting with their own number.",
    solution: "Each prisoner opens their own box. If it has number 'X', they go open box 'X', and so on, up to 50 boxes. Since boxes contain random permutations, they form loops. If the largest loop is <= 50, all prisoners will find their number! The probability that a random permutation contains a loop of length > 50 is about 69%. Thus, this loop-following strategy gives the prisoners a whopping ~31.18% chance of survival compared to (1/2)^100."
  },
  {
    id: "puz-5",
    category: "fermi",
    title: "Pianos in Chicago",
    difficulty: "medium",
    hint: "Estimate population, percentage of piano owners, tuning frequency, and working hours.",
    solution: "Chicago population is ~3 million. Assume average household has 3 people -> 1M households. Maybe 1 in 10 households owns a piano -> 100,000 pianos. Pianos tuned once a year -> 100,000 tunings/year. A tuner works 250 days/year, tunes 4 pianos/day -> 1000 tunings/tuner/year. Therefore, we need 100,000 / 1,000 = 100 piano tuners in Chicago."
  },
  {
    id: "puz-6",
    category: "logic",
    title: "Burning Ropes (Measure 45 Mins)",
    difficulty: "easy",
    hint: "You have two ropes, each taking 1 hour to burn but burning non-uniformly. You can light ropes at both ends.",
    solution: "Light Rope 1 at both ends, and Rope 2 at one end. When Rope 1 finishes burning (exactly 30 minutes), Rope 2 has 30 minutes left of burning time. At that exact moment, light the other end of Rope 2. It will finish burning in exactly 15 more minutes. Total elapsed time = 30 + 15 = 45 minutes."
  },
  {
    id: "puz-7",
    category: "probability",
    title: "Monty Hall Problem",
    difficulty: "medium",
    hint: "Think about the probability of choosing the car vs goat initially. Does switching change that?",
    solution: "Initially, you have a 1/3 chance of picking the car and a 2/3 chance of picking a goat. If you pick a goat (2/3 chance), Monty MUST open the other goat door, leaving the car behind the remaining door. If you switch, you get the car. If you pick the car initially (1/3 chance), Monty opens a goat door, and switching gets you a goat. Therefore, switching wins 2/3 of the time, while staying wins only 1/3 of the time. You should always switch."
  },
  {
    id: "puz-8",
    category: "logic",
    title: "Crossing Bridge at Night",
    difficulty: "medium",
    hint: "Make the two slowest people cross together to save time, but they need a faster person to bring the flashlight back.",
    solution: "Times are 1, 2, 5, 10. Let 1 and 2 cross (2 mins). 1 returns with flashlight (1 min, total 3). Now the slowest, 5 and 10, cross (10 mins, total 13). 2 returns with flashlight (2 mins, total 15). Finally, 1 and 2 cross again (2 mins, total 17 mins). All four have crossed in 17 minutes."
  },
  {
    id: "puz-9",
    category: "probability",
    title: "Bag of Coins (1 Double-Headed)",
    difficulty: "medium",
    hint: "Use Bayes' Theorem. P(Double Headed | 10 Heads).",
    solution: "Bag has 1000 coins: 999 fair, 1 double-headed. You pick one, flip it 10 times, all Heads. What is P(DH | 10H)? P(DH) = 0.001, P(Fair) = 0.999. P(10H | DH) = 1. P(10H | Fair) = (1/2)^10 = 1/1024. P(10H) = (0.001 * 1) + (0.999 * 1/1024) = 0.001 + 0.000975 = 0.001975. P(DH | 10H) = (0.001 * 1) / 0.001975 = 0.506 (50.6% chance it is the double-headed coin)."
  },
  {
    id: "puz-10",
    category: "logic",
    title: "Poisoned Wine & 10 Prisoners",
    difficulty: "hard",
    hint: "Use binary representation. 1000 bottles can be represented in 10 bits (2^10 = 1024).",
    solution: "Label bottles 1 to 1000 in binary. Assign prisoner 1 to represent bit 1, prisoner 2 to represent bit 2, and so on. For bottle 'N', feed a drop of it to prisoner 'i' only if the 'i'-th bit of N is 1. After 24 hours, line up the dead prisoners as 1s and survivors as 0s. The resulting 10-bit binary number is the index of the poisoned bottle."
  }
];

export const gsFinanceBasics = [
  { id: "fin-1", concept: "How Goldman Sachs Makes Money", completed: false, description: "Underwriting (IPO, bonds), M&A advisory, Market making / Trading, Asset Management, and Wealth Management." },
  { id: "fin-2", concept: "P&L vs Balance Sheet", completed: false, description: "Income Statement (P&L) tracks revenues, expenses, and net profit over a PERIOD. Balance Sheet shows Assets, Liabilities, and Equity at a specific POINT in time." },
  { id: "fin-3", concept: "Net Present Value (NPV)", completed: false, description: "NPV calculates the value of future cash flows in today's dollars: NPV = Sum of [CF_t / (1 + r)^t] - Initial Investment." },
  { id: "fin-4", concept: "Derivatives (Futures, Forwards, Options)", completed: false, description: "Contracts whose value is derived from an underlying asset. Options give the right (not obligation) to buy (Call) or sell (Put)." },
  { id: "fin-5", concept: "Market Making", completed: false, description: "Providing liquidity by standing ready to buy and sell at quoted prices, earning the Bid-Ask spread." }
];

export const gsSTARQuestions = [
  {
    id: "star-1",
    question: "Tell me about a time you handled a difficult team member.",
    prefill: {
      situation: "During the TSDPL (Tata Steel) project, one developer fell behind on their UI components, putting our sprint timeline at risk.",
      task: "Ensure the components were integrated on time without creating friction or compromising quality.",
      action: "I scheduled a 1-on-1, discovered they were struggling with React hooks, and paired up with them for 2 evening sessions to code the state changes.",
      result: "We integrated on time, and they went on to successfully build their next feature independently."
    }
  },
  {
    id: "star-2",
    question: "Describe your experience in the Goldman Sachs Hackathon.",
    prefill: {
      situation: "We were shortlisted for the national finals of the GS Hackathon.",
      task: "Build a highly scalable prototype addressing a real-world financial inclusion problem under 36 hours.",
      action: "I led the development of the ML recommendation engine, setting up APIs and integrating dynamic user risk scoring.",
      result: "We successfully pitched to GS engineering leaders and achieved a finalist rank."
    }
  },
  {
    id: "star-3",
    question: "Give an example of resolving a technical disagreement.",
    prefill: {
      situation: "In the SignalRank repository, team split between SQL vs NoSQL for the transaction log.",
      task: "Reach a consensus based on metrics and requirements rather than personal bias.",
      action: "I created a benchmark script testing throughput under concurrent writes. PostgreSQL showed higher reliability for transactional integrity.",
      result: "The team agreed on PostgreSQL, and database issues dropped to zero in production."
    }
  }
];

export const gsInterviewPatterns = [
  { topic: "HashMap / String Manipulation", reason: "Very common in GS round 1 (e.g. Anagrams, custom alphabet sort, run-length encoding)." },
  { topic: "High Precision Math / BigInt", reason: "Financial systems require handling very large integers or exact decimals without floating point errors." },
  { topic: "Two Pointers & Sliding Window", reason: "Common for optimized subarray/substring problems (e.g., subarray sum equals K)." },
  { topic: "Dynamic Programming / Memoization", reason: "Standard for optimized paths or coin change variations." }
];

export const gsResources = [
  { name: "Goldman Sachs Engineering Blog", url: "https://www.goldmansachs.com/careers/students/programs/engineering-blog.html" },
  { name: "LeetCode Discuss GS Prep Tag", url: "https://leetcode.com/discuss/interview-question?query=goldman%20sachs" },
  { name: "Quant Guide puzzles", url: "https://www.brainstellar.com/" }
];
