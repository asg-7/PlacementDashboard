export const hldSystems = [
  {
    id: "hld-rate-limiter",
    name: "Rate Limiter",
    icon: "⏱️",
    difficulty: "beginner",
    checklist: [
      "Define Functional Reqs (Throttling rules, windowing, key-based limiters)",
      "Define Non-Functional Reqs (Low latency, high accuracy, low memory footprint)",
      "Perform Capacity Estimation (RPS, network bandwidth, memory for active users)",
      "Design API Interfaces (HTTP response headers e.g., X-Ratelimit-Remaining)",
      "Choose Database & Caching (Redis for fast token bucket/leaky bucket counters)",
      "Create HLD Diagram (Client -> Load Balancer -> Middleware Limiters -> App Servers)",
      "Analyze Trade-offs & Scaling (Race conditions, token bucket vs sliding window, distributed Redis lock)"
    ],
    resources: [
      { title: "ByteByteGo: Rate Limiter Design", url: "https://bytebytego.com/", type: "article" },
      { title: "Gaurav Sen: Rate Limiting", url: "https://www.youtube.com/watch?v=CRGPbCbR1DA", type: "video" }
    ]
  },
  {
    id: "hld-consistent-hashing",
    name: "Consistent Hashing",
    icon: "⭕",
    difficulty: "beginner",
    checklist: [
      "Identify the problem (Rehashing on server add/remove causes massive misses)",
      "Define hash space and hash ring structure",
      "Assign servers onto the hash ring using multiple hash functions",
      "Map keys onto the ring to locate the clockwise closest server",
      "Solve server hotspotting using Virtual Nodes",
      "Create HLD Diagram showing hash ring, servers, keys, and virtual nodes",
      "Analyze Trade-offs (Memory overhead of virtual nodes vs distribution balance)"
    ],
    resources: [
      { title: "ByteByteGo: Consistent Hashing", url: "https://bytebytego.com/", type: "article" },
      { title: "Gaurav Sen: Consistent Hashing", url: "https://www.youtube.com/watch?v=zaRkONvyGr8", type: "video" }
    ]
  },
  {
    id: "hld-key-value",
    name: "Key-Value Store",
    icon: "🔑",
    difficulty: "intermediate",
    checklist: [
      "Define constraints (Read heavy vs write heavy, memory vs disk, consistency vs availability)",
      "Plan capacity for 10TB of key-value pairs (RAM capacity vs SSD cost)",
      "Design API (put(key, value), get(key))",
      "Design single-node storage engine (LSM Tree, SSTables, Write-Ahead Log vs B-Tree)",
      "Plan distribution (Data partitioning, replication factor, master-slave vs master-less)",
      "Handle write conflicts and vector clocks / conflict resolution",
      "Analyze CAP theorem and tunability (Quorum reads/writes, gossip protocol)"
    ],
    resources: [
      { title: "ByteByteGo: Key Value Store", url: "https://bytebytego.com/", type: "article" },
      { title: "DDIA Chapter 3: Storage and Retrieval", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", type: "book" }
    ]
  },
  {
    id: "hld-unique-id",
    name: "Unique ID Generator",
    icon: "🆔",
    difficulty: "beginner",
    checklist: [
      "Define requirements (Unique, 64-bit, sortable by time, distributed generation)",
      "Estimate peak ID generation throughput per second",
      "Evaluate multi-master database replication with offsets (and its downsides)",
      "Evaluate UUID/GUID generation (128-bit, not chronologically sortable)",
      "Design Twitter Snowflake approach (Timestamp + Datacenter ID + Machine ID + Sequence)",
      "Create HLD architecture of Snowflake workers and Zookeeper coordination",
      "Analyze clock drift issues and network partition trade-offs"
    ],
    resources: [
      { title: "ByteByteGo: Unique ID Generator", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-url-shortener",
    name: "URL Shortener (TinyURL)",
    icon: "🔗",
    difficulty: "beginner",
    checklist: [
      "Define Functional Reqs (Shorten URL, redirect, custom alias, expiration)",
      "Define Non-Functional Reqs (High availability, redirection <100ms, secure)",
      "Calculate storage & read/write bandwidth for 100M URLs created per month",
      "Choose Base62 encoding vs MD5/SHA256 hashing + collision resolution",
      "Create HLD Diagram (Client -> Web Servers -> Cache (Redis) -> DB (NoSQL/SQL) + Key Range Generator)",
      "Detail redirection caching strategy (HTTP 301 Permanent vs 302 Temporary)",
      "Scale database partitioning and clean up expired links"
    ],
    resources: [
      { title: "ByteByteGo: URL Shortener", url: "https://bytebytego.com/", type: "article" },
      { title: "Gaurav Sen: System Design: TinyURL", url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4", type: "video" }
    ]
  },
  {
    id: "hld-web-crawler",
    name: "Web Crawler",
    icon: "🕸️",
    difficulty: "intermediate",
    checklist: [
      "Define requirements (Politeness, robustness, scalability, extensibility)",
      "Calculate storage for 1 Billion pages (HTML, indexes, URL frontier)",
      "Design the HTML Downloader and DNS resolver bottlenecks",
      "Design the URL Frontier (FIFO queues, priority queues, politeness manager, back-off)",
      "Determine duplicate detection strategies (Doc checksums, SimHash, Bloom Filters)",
      "Create HLD (Spiders -> Parser -> Content Filter -> Link Extractor -> URL Frontier)",
      "Discuss distributed crawling issues and dead locks / trap loops"
    ],
    resources: [
      { title: "ByteByteGo: Web Crawler", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-notification",
    name: "Notification System",
    icon: "🔔",
    difficulty: "intermediate",
    checklist: [
      "Define notification types (iOS Push, Android Push, SMS, Email)",
      "Estimate system throughput (10M notifications per day, peak loads)",
      "Design database schema for users, preferences, tracking, templates",
      "Create sender components integrated with third-party providers (APNS, FCM, Twilio, SendGrid)",
      "Integrate Message Queues (RabbitMQ/Kafka) for reliability and rate-limiting",
      "Design HLD Diagram with worker pools, template engines, and status trackers",
      "Discuss deduplication, delivery guarantees (at-least-once), and retry policies"
    ],
    resources: [
      { title: "ByteByteGo: Notification System", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-chat-system",
    name: "Chat System",
    icon: "💬",
    difficulty: "advanced",
    checklist: [
      "Define requirements (1-on-1 chat, group chat, online status, read receipts)",
      "Calculate message storage and WebSocket connection concurrency",
      "Compare protocols (HTTP polling, Long Polling, WebSockets, SSE)",
      "Design stateful Connection Servers and stateless API servers",
      "Select message storage (NoSQL key-value/wide-column like Cassandra/HBase for high write/read)",
      "Create HLD Diagram including Presence Servers, Chat Servers, Push Notifications, and Cache",
      "Scale for group chats (fan-out on write vs read) and network reconnect handling"
    ],
    resources: [
      { title: "Gaurav Sen: Whatsapp System Design", url: "https://www.youtube.com/watch?v=vvhC64hQBIc", type: "video" },
      { title: "ByteByteGo: Chat System", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-video-streaming",
    name: "Video Streaming (Netflix/YouTube)",
    icon: "🎥",
    difficulty: "advanced",
    checklist: [
      "Define requirements (Upload, view, transcoding, low latency, search, comments)",
      "Calculate storage for 10M active daily video streams and upload rates",
      "Design transcoding pipeline (DAG engine, chunking, multiple resolutions/formats, DRM)",
      "Integrate Content Delivery Network (CDN) caching strategies and edge servers",
      "Design API and DB schema for metadata, video catalog, and user tracking",
      "Create HLD (Upload Flow vs Playback Flow with CDN)",
      "Solve performance issues (Dynamic adaptive streaming over HTTP, playback prefetching)"
    ],
    resources: [
      { title: "Gaurav Sen: System Design: YouTube", url: "https://www.youtube.com/watch?v=wYk0x1-9gTY", type: "video" },
      { title: "ByteByteGo: YouTube Design", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-news-feed",
    name: "News Feed System (FB/Twitter)",
    icon: "📰",
    difficulty: "intermediate",
    checklist: [
      "Define requirements (Publish posts, view news feed, add friends, like/comment)",
      "Calculate reads vs writes RPS (extreme read-heavy system)",
      "Design news feed generation logic (Push model/fan-out-on-write vs Pull model/fan-out-on-read)",
      "Design Hybrid push-pull model for celebrity users (active pull vs passive push)",
      "Design database schema (Post table, Relationship table, Feed Cache in Redis)",
      "Create HLD Diagram (Publish post API, News feed retrieval API, CDN, Load balancer, Cache)",
      "Analyze cache invalidation and news feed pagination (cursors vs offsets)"
    ],
    resources: [
      { title: "Gaurav Sen: System Design: Twitter", url: "https://www.youtube.com/watch?v=KmAyPUvy9JY", type: "video" },
      { title: "ByteByteGo: News Feed System", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-autocomplete",
    name: "Search Autocomplete (Google Suggest)",
    icon: "🔍",
    difficulty: "advanced",
    checklist: [
      "Define requirements (Top K suggestions, fast latency < 100ms, real-time updates)",
      "Estimate query volume (100k queries/sec, data storage for trie)",
      "Design Trie Data Structure representing prefix search and frequency weight",
      "Design ingestion pipeline (Log aggregator -> Log analyzer -> Aggregated Trie DB)",
      "Implement Trie caching strategy at client browser, load balancer, and Trie servers",
      "Create HLD (Data collection service vs Query service with Trie Cache)",
      "Solve scale (Trie partitioning by character prefix, consistent hashing, real-time frequency updates)"
    ],
    resources: [
      { title: "Gaurav Sen: Search Autocomplete", url: "https://www.youtube.com/watch?v=us0qySiUsMY", type: "video" },
      { title: "ByteByteGo: Search Autocomplete", url: "https://bytebytego.com/", type: "article" }
    ]
  },
  {
    id: "hld-ad-click",
    name: "Ad Click Event Aggregator",
    icon: "📊",
    difficulty: "advanced",
    checklist: [
      "Define requirements (Track ad click events, aggregate metrics over time windows, query stats)",
      "Estimate volume (10 Billion clicks per day, real-time stream processing scale)",
      "Design stream ingestion layer (Message broker like Kafka/Kinesis)",
      "Select stream processor (Apache Flink, Spark Streaming) and Windowing strategy",
      "Design data storage for aggregated metrics (Time-series DB or Cassandra/ClickHouse)",
      "Create HLD Diagram (Ad Click -> Web App -> Kafka -> Flink Aggregator -> OLAP DB -> API Query)",
      "Discuss fault tolerance, idempotency (exactly-once processing), and data drift"
    ],
    resources: [
      { title: "ByteByteGo: Ad Click Event Aggregation", url: "https://bytebytego.com/", type: "article" }
    ]
  }
];

export const lldProblems = [
  {
    id: "lld-parking-lot",
    name: "Design Parking Lot",
    designPatterns: ["Singleton", "Factory", "Strategy"],
    checklist: [
      "Define use cases (Multiple entry/exit points, multiple spot sizes, vehicle types, ticketing, spot allocation)",
      "Create Class Diagram (ParkingLot, ParkingSpot, Ticket, Payment, Vehicle, Entrance/Exit)",
      "Structure classes and write code for spot allocation strategy (nearest-first, handicap-first)",
      "Apply SOLID (Liskov Substitution for Vehicle types, Single Responsibility for billing)",
      "Add concurrency handling (simultaneous entrances checking for same spots)"
    ],
    resources: [
      { title: "Concept && Coding: Design Parking Lot", url: "https://www.youtube.com/watch?v=tVRyb4HaRYo" }
    ]
  },
  {
    id: "lld-atm",
    name: "Design ATM Machine",
    designPatterns: ["State Pattern", "Chain of Responsibility"],
    checklist: [
      "Define ATM states (Idle, HasCard, PinEntered, CashWithdrawn, OutOfCash)",
      "Create Class Diagram (ATM, ATMState, Card, Account, Transaction, CashDispenser)",
      "Write State transition logic (Card inserted -> PIN -> Auth -> Withdraw -> Dispense)",
      "Implement Chain of Responsibility for cash dispensing ($100 -> $50 -> $20 -> $10)",
      "Write exception handling for insufficient funds, card locking, hardware failures"
    ],
    resources: [
      { title: "Concept && Coding: ATM LLD", url: "https://www.youtube.com/watch?v=vV23G144hlo" }
    ]
  },
  {
    id: "lld-splitwise",
    name: "Design Splitwise",
    designPatterns: ["Strategy", "Observer"],
    checklist: [
      "Define splits (Equal, Exact Amount, Percentage, Share ratio)",
      "Create Class Diagram (User, Group, Expense, Split, BalanceSheetManager)",
      "Write split execution logic using polymorphic Split classes",
      "Implement Simplify Expenses algorithm (Min Cash Flow algorithm using priority queues)",
      "Apply Observer pattern to notify group members of new expenses"
    ],
    resources: [
      { title: "Concept && Coding: Splitwise LLD", url: "https://www.youtube.com/watch?v=apGQy_Z6lJw" }
    ]
  },
  {
    id: "lld-chess",
    name: "Design Chess Game",
    designPatterns: ["Factory", "Command"],
    checklist: [
      "Define Board representation, pieces (King, Queen, Rook, Bishop, Knight, Pawn), and game statuses",
      "Create Class Diagram (Game, Board, Spot, Piece, Move, Account, Player)",
      "Write move validation logic for pieces (polymorphic piece.canMove(board, start, end))",
      "Handle special moves (Castling, En Passant, Pawn Promotion)",
      "Implement turn-taking loop, check/checkmate detection, and command history for undo"
    ],
    resources: [
      { title: "Concept && Coding: Chess LLD", url: "https://www.youtube.com/watch?v=t1L5q4-B-n0" }
    ]
  },
  {
    id: "lld-vending",
    name: "Design Vending Machine",
    designPatterns: ["State Pattern"],
    checklist: [
      "Define states (NoCoin, HasCoin, ProductSelected, Dispensing)",
      "Create Class Diagram (VendingMachine, State, Inventory, Product, Slot, Coin/Note)",
      "Write coin/cash collection, change return, and item selection logic",
      "Apply State Pattern to transition machine actions seamlessly based on currency state",
      "Handle edge cases: item out of stock, refund requested, insufficient money inserted"
    ],
    resources: [
      { title: "Concept && Coding: Vending Machine LLD", url: "https://www.youtube.com/watch?v=zJg13Z_238I" }
    ]
  },
  {
    id: "lld-library",
    name: "Design Library Management",
    designPatterns: ["Observer", "Strategy"],
    checklist: [
      "Define members, book items, reservation system, fine calculation, search indexing",
      "Create Class Diagram (Library, Book, BookItem, Account, Member, Librarian, BookReservation, Fine)",
      "Implement fine system strategy (daily rate calculations, grace period check)",
      "Apply SOLID (Interface segregation for search types, Single Responsibility for member records)",
      "Implement notify mechanism (Observer) for book availability to waiting members"
    ],
    resources: [
      { title: "Concept && Coding: Library LLD", url: "https://www.youtube.com/watch?v=4-1P4sPr5U4" }
    ]
  },
  {
    id: "lld-bookmyshow",
    name: "Design Movie Ticket Booking (BookMyShow)",
    designPatterns: ["Singleton", "Factory"],
    checklist: [
      "Define use cases: City list, Cinemas, Halls, Shows, Seat layout, Seat selection, Booking status",
      "Create Class Diagram (Cinema, Hall, Show, Seat, Booking, Payment, Movie)",
      "Write concurrency control logic to avoid double booking of seats (DB isolation levels, locking)",
      "Implement search and filtering for movies by genre, language, and date",
      "Add ticket pricing strategies based on seat type (VIP, Gold, Silver) and timing"
    ],
    resources: [
      { title: "Concept && Coding: BookMyShow LLD", url: "https://www.youtube.com/watch?v=2T5N2eJ3k0w" }
    ]
  },
  {
    id: "lld-hotel",
    name: "Design Hotel Management System",
    designPatterns: ["Factory", "Strategy"],
    checklist: [
      "Define use cases: Room booking, check-in/out, services ordering, billing, room types (Deluxe, Suite, Standard)",
      "Create Class Diagram (Hotel, Room, Booking, Invoice, Guest, Housekeeping, Service)",
      "Write room allocation and check-in validation code",
      "Implement billing strategy incorporating room charges, service orders, taxes, and discounts",
      "Incorporate SOLID design (Open/Closed principle for room types and discount policies)"
    ],
    resources: [
      { title: "Concept && Coding: Hotel Management LLD", url: "https://www.youtube.com/watch?v=yY_A4N4S6y8" }
    ]
  }
];
