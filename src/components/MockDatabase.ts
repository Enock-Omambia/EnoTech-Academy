/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Course,
  Student,
  AttendanceRecord,
  Assignment,
  StudentSubmission,
  StudentQuizAttempt,
  Certificate,
  Transaction,
  LabAsset,
  Announcement,
  SystemLog,
} from "../types";
import { ALL_COURSES_FROM_CATALOG } from "../data/coursesCatalog";

// Helper to get from local storage or return default
const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`enotech_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`enotech_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Storage write error", e);
  }
};

// Seed Course Data (Initial 20+ courses dynamically expandable)
export const DEFAULT_COURSES: Course[] = [
  {
    id: "C-MS-OFFICE",
    name: "Microsoft Office Specialist",
    category: "Computer Packages",
    durationWeeks: 4,
    totalFees: 5000,
    description: "Master essential workplace packages including Word, Excel, PowerPoint, Access, and Publisher.",
    modules: [
      {
        id: "M1",
        title: "Microsoft Word & Document Editing",
        lessons: [
          { id: "L1", title: "Word Formatting & Ribbon Basics", type: "video", duration: "12:45", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Word Styles, Headers & Margins", type: "video", duration: "11:30", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L3", title: "Advanced Tables & Layouts", type: "pdf", url: "#", content: "Learn how to use nested tables, merge cells, and adjust padding inside MS Word." },
          { id: "L4", title: "Word Final Quiz", type: "quiz" },
        ],
      },
      {
        id: "M2",
        title: "Microsoft Excel & Data Analysis",
        lessons: [
          { id: "L5", title: "Excel Formulas & Basic Charts", type: "video", duration: "18:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L6", title: "VLOOKUP & Pivot Tables", type: "video", duration: "15:10", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L7", title: "Advanced Data Sorting & Subtotals", type: "video", duration: "13:40", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
        ],
      },
    ],
  },
  {
    id: "C-WEB-DEV",
    name: "Full-Stack Web Development",
    category: "Programming",
    durationWeeks: 12,
    totalFees: 15000,
    description: "Construct modern responsive websites from scratch using HTML, CSS, JavaScript, PHP, and MySQL.",
    modules: [
      {
        id: "M1",
        title: "Frontend Foundations",
        lessons: [
          { id: "L1", title: "Semantic HTML5 Elements", type: "video", duration: "10:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "CSS Flexbox & Grid Styling", type: "video", duration: "14:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L3", title: "Responsive Media Queries", type: "text", content: "Media queries allow developers to target device screen widths. Use @media (max-width: 768px) for tablets." },
        ],
      },
      {
        id: "M2",
        title: "JavaScript Programming",
        lessons: [
          { id: "L4", title: "JavaScript Variables & Arrays", type: "video", duration: "22:05", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L5", title: "DOM Manipulation & Events", type: "video", duration: "19:40", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L6", title: "DOM Event Handler Lab", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "C-PYTHON",
    name: "Python Core Programming",
    category: "Programming",
    durationWeeks: 8,
    totalFees: 12000,
    description: "Learn Python fundamentals, syntax, algorithms, scripting, and basic data structures.",
    modules: [
      {
        id: "M1",
        title: "Python Basics & Syntax",
        lessons: [
          { id: "L1", title: "Python Environment & Syntax", type: "video", duration: "08:15", url: "https://www.youtube.com/embed/x7X9w_GIm1s" },
          { id: "L2", title: "Variables & Mathematical Operators", type: "video", duration: "11:50", url: "https://www.youtube.com/embed/8pG7B-G33A0" },
        ],
      },
      {
        id: "M2",
        title: "Python Structures & Control Flow",
        lessons: [
          { id: "L3", title: "Conditional Statements & Loops", type: "video", duration: "14:10", url: "https://www.youtube.com/embed/x7X9w_GIm1s" },
          { id: "L4", title: "Functions & Variable Scopes", type: "video", duration: "13:25", url: "https://www.youtube.com/embed/8pG7B-G33A0" },
        ],
      },
    ],
  },
  {
    id: "C-GRAPHIC",
    name: "Professional Graphic Design",
    category: "Graphic Design",
    durationWeeks: 6,
    totalFees: 8500,
    description: "Create breathtaking marketing posters, vectors, and branding layouts using Adobe Photoshop and Canva.",
    modules: [
      {
        id: "M1",
        title: "Photoshop & Canvas Basics",
        lessons: [
          { id: "L1", title: "Introduction to Photoshop Workspaces", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Layers & Layer Masks Masterclass", type: "video", duration: "18:00", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
        ],
      },
      {
        id: "M2",
        title: "Layout and Color Theory",
        lessons: [
          { id: "L3", title: "Canva Pro Tips & Design Composition", type: "video", duration: "12:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L4", title: "Branding, Logos & Color Harmony", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
        ],
      },
    ],
  },
  {
    id: "C-CYBER",
    name: "Cyber Security Basics",
    category: "Networking",
    durationWeeks: 6,
    totalFees: 10000,
    description: "Develop foundational knowledge in information security, threat detection, and system hardening.",
    modules: [
      {
        id: "M1",
        title: "Threat Landscape Overview",
        lessons: [
          { id: "L1", title: "Phishing & Social Engineering", type: "video", duration: "12:10", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Malware, Ransomware & Trojan Analysis", type: "video", duration: "14:45", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
        ],
      },
      {
        id: "M2",
        title: "Network Protection",
        lessons: [
          { id: "L3", title: "Encryption & Public Key Infrastructure", type: "video", duration: "15:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Firewalls, VPNs & Port Scanning", type: "video", duration: "16:15", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
        ],
      },
    ],
  },
  {
    id: "C-CS-ALGO",
    name: "Introduction to Computer Science & Algorithms",
    category: "Computer Science",
    durationWeeks: 8,
    totalFees: 14000,
    description: "Learn standard Big-O notation, recursion, data structures (stacks, queues, linked lists, trees), and sorting algorithms with practical notes and lab sessions.",
    modules: [
      {
        id: "M1",
        title: "Complexity & Core Data Structures",
        lessons: [
          { id: "L1", title: "Big-O Notation & Computational Efficiency", type: "video", duration: "14:30", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Memory Layout: Arrays & Linked Lists", type: "video", duration: "13:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L3", title: "Stacks & Queues In-Depth", type: "text", content: "Notes: A Stack follows Last-In First-Out (LIFO). Standard operations are push(), pop(), and peek(). A Queue follows First-In First-Out (FIFO). Complete Lab: Write a stack implementation in the Python Playground." }
        ]
      },
      {
        id: "M2",
        title: "Recursion & Trees",
        lessons: [
          { id: "L4", title: "Recursion & Binary Search Trees", type: "video", duration: "18:20", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L5", title: "Graph Traversals (BFS & DFS)", type: "video", duration: "16:10", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L6", title: "BST Structure Final Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-DBMS-SQL",
    name: "Database Management Systems & SQL",
    category: "Computer Science",
    durationWeeks: 10,
    totalFees: 16000,
    description: "Deep dive into Relational Algebra, Entity Relationship modeling, normalizations, and writing complex relational queries with live terminal lab suites.",
    modules: [
      {
        id: "M1",
        title: "Relational Schema & Normalization",
        lessons: [
          { id: "L1", title: "ER Modeling & Database Constraints", type: "video", duration: "11:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "SQL Schema Definition (DDL Statements)", type: "video", duration: "12:50", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L3", title: "Relational Normal Forms (1NF, 2NF, 3NF)", type: "text", content: "Notes: Relational tables must conform to Normal Forms. 1NF removes duplicate columns. 2NF removes partial dependency. 3NF removes transitive dependency. Complete the SQL Terminal lab inside the programming tools section to practice selections!" }
        ]
      },
      {
        id: "M2",
        title: "Advanced Query Formulation",
        lessons: [
          { id: "L4", title: "Writing Joins, Group By & Aggregations", type: "video", duration: "16:45", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L5", title: "Subqueries, Views & Query Tuning", type: "video", duration: "15:20", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L6", title: "Relational Database Final Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-SW-ARCH",
    name: "Software Architecture & Design Patterns",
    category: "Software Engineering",
    durationWeeks: 12,
    totalFees: 18000,
    description: "Advanced study of software design patterns and architectural styles including microservices, event-driven architectures, and domain-driven design.",
    modules: [
      {
        id: "M1",
        title: "Architectural Patterns & Microservices",
        lessons: [
          { id: "L1", title: "Microservices vs Monoliths Deep Dive", type: "video", duration: "15:45", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Domain-Driven Design (DDD) Bounded Contexts", type: "text", content: "University Lecture: Domain-Driven Design establishes model boundaries. Bounded contexts encapsulate domain services, domain events, and aggregates. Practical: Map out standard context boundaries for an offline inventory app." }
        ]
      },
      {
        id: "M2",
        title: "Gang of Four Design Patterns",
        lessons: [
          { id: "L3", title: "Creational & Structural Patterns", type: "video", duration: "18:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Offline Architecture & Publisher-Subscriber Practical", type: "text", content: "Practical Lab: Implement a local TypeScript EventBus that buffers messages to localStorage when the system state triggers offline conditions." },
          { id: "L5", title: "Software Patterns Final Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-COMPILER",
    name: "Compiler Design & Translation Theory",
    category: "Computer Science",
    durationWeeks: 14,
    totalFees: 22000,
    description: "Mathematical foundations of lexical analysis, syntactic parser construction (LL/LR parsing), semantic analyzer passes, AST creation, intermediate code generation, and target register allocation.",
    modules: [
      {
        id: "M1",
        title: "Lexical & Syntactic Parsing Theory",
        lessons: [
          { id: "L1", title: "Finite Automata & Tokenization Methods", type: "video", duration: "14:12", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Context-Free Grammars & LL(1) Parsers", type: "text", content: "University Lecture: Grammars are represented by G=(V, T, P, S). An LL(1) parser reads tokens from left-to-right and constructs a leftmost derivation using a single lookahead token. Practical: Hand-write a predictive parsing table for a simple arithmetic grammar." }
        ]
      },
      {
        id: "M2",
        title: "AST Representation & Code Generation",
        lessons: [
          { id: "L3", title: "Abstract Syntax Trees (AST) & Type Checking", type: "video", duration: "16:40", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Parser Generator Practical Assignment", type: "text", content: "Practical Lab: Construct a functional, offline-compliant recursive-descent Parser function in the Code Editor that compiles basic nested parenthesis mathematical equations into structural JSON syntax trees." }
        ]
      }
    ]
  },
  {
    id: "C-OS-KERNEL",
    name: "Operating Systems & Kernel Engineering",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 19000,
    description: "Deep exploration of kernel development, memory management, virtual memory paging, CPU thread scheduling, mutex deadlocks, and POSIX file systems.",
    modules: [
      {
        id: "M1",
        title: "Process Concurrency & Scheduling",
        lessons: [
          { id: "L1", title: "Inter-Process Communication & Mutexes", type: "video", duration: "13:22", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L2", title: "CPU Schedulers: Round Robin & Priority", type: "text", content: "University Lecture: CPU schedulers optimize throughput, turnaround, and response times. Round-robin introduces time-slicing (quantum). Practical Lab: Write an offline scheduler simulator class that calculates average waiting times for a queue of incoming tasks." }
        ]
      },
      {
        id: "M2",
        title: "Memory Spaces & Page Replacements",
        lessons: [
          { id: "L3", title: "Paging, Virtual Memory & TLB Cache", type: "video", duration: "15:55", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "LRU Page Replacement Practical", type: "text", content: "Practical Lab: Implement the Least Recently Used (LRU) cache algorithm. Show state changes of the cache storage upon subsequent memory address misses." }
        ]
      }
    ]
  },
  {
    id: "C-AI-ML",
    name: "Artificial Intelligence & Machine Learning",
    category: "Artificial Intelligence",
    durationWeeks: 16,
    totalFees: 25000,
    description: "Rigorous math-focused course on supervised and unsupervised learning, gradient descent optimization, backpropagation, and deep neural networks.",
    modules: [
      {
        id: "M1",
        title: "Statistical Classifiers & Cost Functions",
        lessons: [
          { id: "L1", title: "Multivariate Linear & Logistic Regression", type: "video", duration: "18:10", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Gradient Descent and Cost Convexity", type: "text", content: "University Lecture: Optimization of parameters is executed via Gradient Descent: theta = theta - alpha * grad(J). Practical: Write an offline learning loop that iteratively fits a slope line to data coordinates using localized updates." }
        ]
      },
      {
        id: "M2",
        title: "Deep Feedforward Neural Networks",
        lessons: [
          { id: "L3", title: "Backpropagation Mechanics & Matrices", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Neural Network Math Practical Assignment", type: "text", content: "Practical Lab: Construct a simple 3-layer neural network model from scratch in the coding sandbox. Explicitly write the matrix dot products, sigmoid activation functions, and calculate validation loss metrics offline." },
          { id: "L5", title: "Deep Networks Final Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-DIST-SYS",
    name: "Distributed Systems & Consensus Protocols",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 21000,
    description: "Multi-node synchronization, clock drift, vector clocks, Paxos/Raft consensus algorithms, and CAP theorem partition tolerance tradeoffs.",
    modules: [
      {
        id: "M1",
        title: "Distributed Time & State Synchronization",
        lessons: [
          { id: "L1", title: "Lamport Timestamps & Vector Clocks", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "CAP Theorem: Consistency, Availability, Partition", type: "text", content: "University Lecture: The CAP Theorem asserts that a distributed data store can simultaneously provide at most two of three guarantees. Practical: Analyze split-brain sync scenarios in network cluster boundaries." }
        ]
      },
      {
        id: "M2",
        title: "Consensus Algorithms",
        lessons: [
          { id: "L3", title: "Paxos vs Raft Leader Elections", type: "video", duration: "19:10", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Raft State Machine Simulation Practical", type: "text", content: "Practical Lab: Create an offline model of a Raft consensus log node. Show how a leader updates indices across follower nodes while handling simulated packet dropouts." }
        ]
      }
    ]
  },
  {
    id: "C-ADV-CRYPTO",
    name: "Advanced Cryptography & System Security",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 12,
    totalFees: 20000,
    description: "Rigorous mathematical foundations of symmetric and asymmetric crypto, number theory (modular arithmetic), RSA, ECC, and zero-knowledge protocols.",
    modules: [
      {
        id: "M1",
        title: "Asymmetric Cryptography Math Foundations",
        lessons: [
          { id: "L1", title: "Modular Arithmetic & Euler's Totient", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "RSA Cryptosystem Mechanics", type: "text", content: "University Lecture: RSA operates on the difficulty of prime factorization. Choose p,q; calculate n=pq and phi=(p-1)(q-1). Practical Lab: Manually calculate a small public/private keypair using small prime integers." }
        ]
      },
      {
        id: "M2",
        title: "Zero-Knowledge Proofs & Future Schemes",
        lessons: [
          { id: "L3", title: "Elliptic Curve Cryptography (ECC) & ZK-Snarks", type: "video", duration: "17:25", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Crypto Digital Signatures Assignment", type: "text", content: "Practical Lab: Implement a digital signature generator. Author an offline hash signing function verifying sender signatures using public modular variables." }
        ]
      }
    ]
  },
  {
    id: "C-BIG-DATA",
    name: "Data Warehousing & Big Data Systems",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 23000,
    description: "Study of distributed file systems (HDFS), MapReduce execution models, Apache Spark pipelines, and columnar relational data stores.",
    modules: [
      {
        id: "M1",
        title: "Distributed Query Execution",
        lessons: [
          { id: "L1", title: "MapReduce Architecture & Master-Worker Handshakes", type: "video", duration: "16:05", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L2", title: "Distributed File Layouts & Partitioning Keys", type: "text", content: "University Lecture: Data blocks are partitioned horizontally across worker nodes. Selecting proper partition keys avoids performance skew. Practical: Sketch schema models optimized for localized queries." }
        ]
      },
      {
        id: "M2",
        title: "Apache Spark & Stream Pipelines",
        lessons: [
          { id: "L3", title: "Resilient Distributed Datasets (RDDs) and Memory Caches", type: "video", duration: "18:45", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Mock MapReduce Text Analytics Assignment", type: "text", content: "Practical Lab: Implement an offline Javascript simulation of Map-Shuffle-Reduce to parse a block of paragraph logs and output exact word frequencies." }
        ]
      }
    ]
  },
  {
    id: "C-NET-PROTO",
    name: "Computer Networks & Layered Protocols",
    category: "Networking",
    durationWeeks: 10,
    totalFees: 17000,
    description: "Structural analysis of OSI layers, IP routing (OSPF, BGP), congestion control algorithms (TCP Cubic/BBR), and custom socket programming.",
    modules: [
      {
        id: "M1",
        title: "Network Core & Subnetting Mechanics",
        lessons: [
          { id: "L1", title: "IP Classless Inter-Domain Routing (CIDR)", type: "video", duration: "14:50", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Routing Protocols: OSPF & Border Gateway Protocol", type: "text", content: "University Lecture: OSPF uses Dijkstra's link-state solver within an autonomous system, whereas BGP manages inter-domain paths via path vectors. Practical: Calculate subnet masks and default gateways for 5 unique lab departments." }
        ]
      },
      {
        id: "M2",
        title: "Transport Protocols & Congestion Management",
        lessons: [
          { id: "L3", title: "TCP Slow Start, Fast Recovery, and Flow Windows", type: "video", duration: "16:20", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Flow Window Adjustment Lab", type: "text", content: "Practical Lab: Model a TCP Sliding Window buffer mechanism. Simulate packet drops and trace how the congestion window size changes dynamically." }
        ]
      }
    ]
  },
  {
    id: "C-CLOUD-K8S",
    name: "Cloud Native Infrastructure with Kubernetes",
    category: "Information Systems & Cloud",
    durationWeeks: 10,
    totalFees: 19500,
    description: "Architectural study of container runtimes, Kubernetes control plane, service meshes (Istio), declarative setups, and horizontal pod autoscaling.",
    modules: [
      {
        id: "M1",
        title: "Containerization & Namespace Isolation",
        lessons: [
          { id: "L1", title: "Docker Runtimes, Linux Cgroups, and Layers", type: "video", duration: "13:40", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Namespace Isolation & Virtual Network Bridging", type: "text", content: "University Lecture: Linux isolates processes via namespaces (PID, net, mnt, ipc, uts) and controls resources using cgroups. Practical: Draft docker config files optimizing layers for small-image builds." }
        ]
      },
      {
        id: "M2",
        title: "Kubernetes Orchestration Controls",
        lessons: [
          { id: "L3", title: "Pods, ReplicaSets, and Kube-Scheduler", type: "video", duration: "15:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Declarative Manifest Compilation Practical", type: "text", content: "Practical Lab: Author a nested, offline-reproducible Kubernetes Deployment and Service manifest bundle utilizing YAML rules to provision multi-instance load-balanced nodes." }
        ]
      }
    ]
  },
  {
    id: "C-ADV-ALGO",
    name: "Advanced Data Structures & Algorithms",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 18500,
    description: "Self-balancing trees (AVL, Red-Black), Heaps, Graphs, Dynamic Programming techniques, Greedy algorithms, and NP-Completeness proofs.",
    modules: [
      {
        id: "M1",
        title: "Self-Balancing Trees & Graph Traversals",
        lessons: [
          { id: "L1", title: "Red-Black Tree Rotations and Balance Invariants", type: "video", duration: "15:50", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Graph Pathfinding: Bellman-Ford & Dijkstra's Algorithm", type: "text", content: "University Lecture: Dijkstra's uses a greedy structure to solve single-source shortest paths on non-negative weighted graphs. Practical: Compute shortest paths manually on a 7-node network matrix." }
        ]
      },
      {
        id: "M2",
        title: "Algorithm Optimization Paradigms",
        lessons: [
          { id: "L3", title: "Dynamic Programming: Knapsack & Longest Subsequence", type: "video", duration: "19:15", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Dynamic Programming Knapsack Assignment", type: "text", content: "Practical Lab: Implement the 0/1 Knapsack optimization algorithm offline. Print the dynamic programming memoization grid to verify sub-problem convergence." }
        ]
      }
    ]
  },
  {
    id: "C-MOBILE-DEV",
    name: "Mobile Application Architectures",
    category: "Programming",
    durationWeeks: 12,
    totalFees: 16000,
    description: "Engineering native-speed mobile applications with offline storage synchronization, custom native bridging, and battery-efficient rendering.",
    modules: [
      {
        id: "M1",
        title: "Mobile Compilation & Lifecycles",
        lessons: [
          { id: "L1", title: "Native UI Renders & Thread Model Paradigms", type: "video", duration: "14:10", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Background Services & State Persistence", type: "text", content: "University Lecture: Mobile applications must preserve user data when background memory cleaner operations kill dormant app runtimes. Practical: Write simple local state storage procedures." }
        ]
      },
      {
        id: "M2",
        title: "Offline Sync Architectures",
        lessons: [
          { id: "L3", title: "SQLite databases, SQLite-sync, and Conflicts Resolutions", type: "video", duration: "16:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Offline Task Synchronization Practical", type: "text", content: "Practical Lab: Develop an offline storage queue that logs user requests locally during simulated connection failures and pushes them sequentially to a mock endpoint on recovery." }
        ]
      }
    ]
  },
  {
    id: "C-NLP-LLM",
    name: "Natural Language Processing & LLMs",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 24000,
    description: "Mathematical architectures of recurrent networks, self-attention mechanisms, Transformers, tokenization strategies, and fine-tuning.",
    modules: [
      {
        id: "M1",
        title: "Statistical Languages & Word Vectors",
        lessons: [
          { id: "L1", title: "N-grams, Word2Vec, and Cosine Vector Similarity", type: "video", duration: "15:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Recurrent Networks (RNN) and LSTM Cells", type: "text", content: "University Lecture: LSTMs mitigate the vanishing gradient problem in deep language pipelines using input, forget, and output control gates. Practical: Draw flow charts of LSTM cell equations." }
        ]
      },
      {
        id: "M2",
        title: "Transformer Attention Blocks",
        lessons: [
          { id: "L3", title: "Self-Attention Mathematics: Queries, Keys, and Values", type: "video", duration: "18:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Matrix Dot-Product Attention Practical", type: "text", content: "Practical Lab: Construct a local Matrix Self-Attention simulation. Compute raw compatibility matrices from random query and key vectors using dot products and a Softmax mapping." }
        ]
      }
    ]
  },
  {
    id: "C-PARALLEL-COMP",
    name: "Parallel & High-Performance Computing",
    category: "Computer Science",
    durationWeeks: 10,
    totalFees: 21500,
    description: "Parallel architectures, multi-core thread scheduling, GPU compute with CUDA, message passing (MPI), and cache coherence protocols.",
    modules: [
      {
        id: "M1",
        title: "Shared Memory Parallelism",
        lessons: [
          { id: "L1", title: "POSIX Threads & OpenMP Compiler Pragmas", type: "video", duration: "13:10", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Symmetric Multiprocessing & Cache Coherence (MESI)", type: "text", content: "University Lecture: Cache lines must maintain state consistency across physical processor cores using MESI protocol transitions (Modified, Exclusive, Shared, Invalid). Practical: Analyze race condition states." }
        ]
      },
      {
        id: "M2",
        title: "Distributed Memory & GPU compute",
        lessons: [
          { id: "L3", title: "MPI Message Exchanges and GPU SIMD Architecture", type: "video", duration: "15:50", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Cache-Friendly Matrix Optimization Assignment", type: "text", content: "Practical Lab: Code an offline matrix transpose algorithm. Optimize memory strides to exploit CPU L1/L2 cache locality, graphing execution time ratios." }
        ]
      }
    ]
  },
  {
    id: "C-HCI-UX",
    name: "Human-Computer Interaction & Cognitive UX",
    category: "Graphic Design",
    durationWeeks: 8,
    totalFees: 13000,
    description: "Cognitive psychology models of interface perception, Fitts's Law, empirical testing design, and accessibility compliance.",
    modules: [
      {
        id: "M1",
        title: "Cognitive Models & Heuristics",
        lessons: [
          { id: "L1", title: "Fitts's Law, Hick's Law, and Gestalt Psychology", type: "video", duration: "12:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Nielsen's 10 Usability Heuristics", type: "text", content: "University Lecture: Interfaces must maintain visual consistency, provide clear feedback, prevent input errors, and support undo/redo parameters. Practical: Outline UX improvements for active user profiles." }
        ]
      },
      {
        id: "M2",
        title: "Accessibility Standards (WCAG)",
        lessons: [
          { id: "L3", title: "Web Content Accessibility Guidelines (A, AA, AAA)", type: "video", duration: "13:30", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Contrast Audit & Heuristic Report Assignment", type: "text", content: "Practical Lab: Heuristically evaluate the active student enrollment interface. Deliver an offline compliance action report proposing contrast and tab-focus fixes." }
        ]
      }
    ]
  },
  {
    id: "C-COMP-GRAPH",
    name: "Computer Graphics & Ray Tracing Engines",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 20500,
    description: "Linear algebra of 3D spaces, perspective projection matrices, rasterization, lighting models (Phong), and writing a Ray Tracer.",
    modules: [
      {
        id: "M1",
        title: "Mathematical 3D Projections",
        lessons: [
          { id: "L1", title: "Homogeneous Coordinates & Transformation Matrices", type: "video", duration: "15:10", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Phong Reflection Model: Ambient, Diffuse, Specular", type: "text", content: "University Lecture: Reflectance is modeled as I = Ka*Ia + Kd*Id*(N.L) + Ks*Is*(R.V)^n. Practical: Calculate specular highlights on a target vector mathematically." }
        ]
      },
      {
        id: "M2",
        title: "Ray Tracing Core Architectures",
        lessons: [
          { id: "L3", title: "Ray-Sphere Intersection Calculus & Shadow Tracing", type: "video", duration: "18:20", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Character-Grid Ray Tracer Practical", type: "text", content: "Practical Lab: Program an offline 3D viewport renderer. Project virtual light rays onto 3D spherical space and output shading characters (e.g., '.', '*', '#') to the text console." }
        ]
      }
    ]
  },
  {
    id: "C-IOT-EMBED",
    name: "Internet of Things & Real-Time Embedded Systems",
    category: "Computer Systems & Hardware",
    durationWeeks: 12,
    totalFees: 19000,
    description: "Microcontroller CPU instruction sets, memory-mapped I/O, serial communications (SPI/I2C/UART), and Real-Time OS scheduling.",
    modules: [
      {
        id: "M1",
        title: "Embedded Hardware & RTOS Controls",
        lessons: [
          { id: "L1", title: "Memory-Mapped Register Layouts & Interrupt Vectors", type: "video", duration: "14:25", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Real-Time OS Task Priority & Schedulers", type: "text", content: "University Lecture: RTOS engines utilize preemptive rate-monotonic scheduling to guarantee hard real-time latency limits. Practical: Design a prioritized interrupt routine pipeline." }
        ]
      },
      {
        id: "M2",
        title: "Serial Protocols & Telemetry",
        lessons: [
          { id: "L3", title: "SPI, I2C, UART Signals, and MQTT Broker topologies", type: "video", duration: "16:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Virtual Telemetry Node Loop Practical", type: "text", content: "Practical Lab: Construct a local embedded simulation. Code a periodic execution loop reading fake device registries and formatting structured MQTT JSON payload packets." }
        ]
      }
    ]
  },
  {
    id: "C-SW-TEST",
    name: "Software Quality Assurance & Automated Testing",
    category: "Software Engineering",
    durationWeeks: 8,
    totalFees: 12000,
    description: "Unit testing math, code coverage heuristics, integration mocking, test-driven development (TDD), and continuous deployment pipelines.",
    modules: [
      {
        id: "M1",
        title: "TDD & Unit Testing Fundamentals",
        lessons: [
          { id: "L1", title: "Red-Green-Refactor Cycles & Mocking Objects", type: "video", duration: "12:55", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Code Path Coverage & Boundary Conditions", type: "text", content: "University Lecture: Solid test suites strive for high statement, branch, and path coverages. Boundary-value testing uncovers hidden errors. Practical: Map state transitions for a student registrar engine." }
        ]
      },
      {
        id: "M2",
        title: "Integration and Deployment Gates",
        lessons: [
          { id: "L3", title: "E2E UI Testing & Automated Release Pipelines", type: "video", duration: "14:50", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Automated Path Testing Assignment", type: "text", content: "Practical Lab: Write an offline state validator assert suite that checks robust state updates across user registrations, ensuring no empty parameters enter storage." }
        ]
      }
    ]
  },
  {
    id: "C-DISCRETE-MATH",
    name: "Discrete Mathematics for Computer Science",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 14500,
    description: "Mathematical proof systems, induction, sets, graph theory algorithms, combinatorics, and solving recurrence relations.",
    modules: [
      {
        id: "M1",
        title: "Formal Proof Systems & Combinatorics",
        lessons: [
          { id: "L1", title: "Predicate Logic, Mathematical Induction, and Set Proofs", type: "video", duration: "15:30", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Combinations, Permutations, and Pigeonhole Principle", type: "text", content: "University Lecture: The Pigeonhole Principle guarantees that if N items are put into M boxes where N > M, at least one box contains multiple items. Practical: Solve combinatorial subsets manually." }
        ]
      },
      {
        id: "M2",
        title: "Graph Structures & Pathfinding Math",
        lessons: [
          { id: "L3", title: "Trees, Vertices Degrees, Eulerian Paths, and Planar Graphs", type: "video", duration: "16:45", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Shortest Path Matrix Assignment", type: "text", content: "Practical Lab: Implement Dijkstra's minimum cost route matrix solver. Code the node relaxation updates mathematically to locate short routes across coordinate nodes." }
        ]
      }
    ]
  },
  {
    id: "C-NUM-METHODS",
    name: "Numerical Analysis & Scientific Computing",
    category: "Computer Science",
    durationWeeks: 10,
    totalFees: 15500,
    description: "Floating-point precision constraints, root-finding math, numerical integration, and solving differential equations with Runge-Kutta.",
    modules: [
      {
        id: "M1",
        title: "Non-linear Systems & Polynomial Interpolations",
        lessons: [
          { id: "L1", title: "Newton-Raphson Method & Floating-Point Error", type: "video", duration: "13:40", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Lagrange Polynomials & Spline Interpolation Curves", type: "text", content: "University Lecture: Interpolation fits polynomial equations exactly through a discrete sample of data coordinates. Practical: Plot linear splines manually." }
        ]
      },
      {
        id: "M2",
        title: "Differential Equation Solvers",
        lessons: [
          { id: "L3", title: "Euler Method vs 4th Order Runge-Kutta Integrators", type: "video", duration: "16:10", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Runge-Kutta 4th Order Program Assignment", type: "text", content: "Practical Lab: Code an offline numerical solver evaluating dynamic equations. Store calculation accuracy logs to prove stability margins." }
        ]
      }
    ]
  },
  {
    id: "C-DIGITAL-LOGIC",
    name: "Digital Logic Design & Computer Architecture",
    category: "Computer Systems & Hardware",
    durationWeeks: 12,
    totalFees: 18000,
    description: "Boolean reduction, logic gate gates, multiplexers, latches, flip-flops, registers, ALU design, and microarchitectures.",
    modules: [
      {
        id: "M1",
        title: "Combinational Logic & Boolean Algebra",
        lessons: [
          { id: "L1", title: "Karnaugh Map Reductions & De Morgan's Laws", type: "video", duration: "14:40", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Multiplexers, Decoders, and Binary Adders", type: "text", content: "University Lecture: Combinational logic maps inputs to outputs instantly without storage. Full Adders combine bits with carry parameters. Practical: Design sum-of-product circuit logs." }
        ]
      },
      {
        id: "M2",
        title: "Sequential Systems & ALUs",
        lessons: [
          { id: "L3", title: "D-Latches, Flip-Flops, Registers, and Memory Banks", type: "video", duration: "16:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "4-Bit ALU Simulator Practical", type: "text", content: "Practical Lab: Model an offline 4-bit Arithmetic Logic Unit (ALU). Program virtual function routes executing addition, subtraction, bitwise AND, and OR operations." }
        ]
      }
    ]
  },
  {
    id: "C-FORENSICS",
    name: "Cybersecurity Incident Response & Digital Forensics",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 10,
    totalFees: 18500,
    description: "Volatile memory analysis, network trace reconstruction, system log audit forensics, file system carvings, and sandbox triage.",
    modules: [
      {
        id: "M1",
        title: "Memory Forensics & Registry Carving",
        lessons: [
          { id: "L1", title: "Analyzing Volatile RAM Dumps & Registry Logs", type: "video", duration: "14:35", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Executable File Structures & Process Triage", type: "text", content: "University Lecture: Volatile RAM carving uncovers active system credentials and running rootkits hiding from standard process logs. Practical: Document system telemetry entries." }
        ]
      },
      {
        id: "M2",
        title: "Network Trace Forensics",
        lessons: [
          { id: "L3", title: "Extracting Files from PCAP Traffic Captures", type: "video", duration: "16:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Forensic Traffic Reconstruction Practical", type: "text", content: "Practical Lab: Build an offline string parser that searches fake transaction log strings for SQL injection signatures, outputting an incident audit profile." }
        ]
      }
    ]
  },
  {
    id: "C-INFO-SEC-GOV",
    name: "Information Systems Security & Governance",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 8,
    totalFees: 14000,
    description: "System auditing standards, NIST and ISO 27001 policy frameworks, regulatory compliances, risk management matrices, and business continuity.",
    modules: [
      {
        id: "M1",
        title: "IT Security Frameworks & Policies",
        lessons: [
          { id: "L1", title: "ISO 27001 ISMS and NIST Risk Controls", type: "video", duration: "12:50", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Asset Vulnerability and Risk Calculations", type: "text", content: "University Lecture: Risk is evaluated as Asset Value * Threat * Vulnerability. Policies establish access matrix boundaries. Practical: Evaluate campus laboratory systems risks." }
        ]
      },
      {
        id: "M2",
        title: "Governance & Continuity Planning",
        lessons: [
          { id: "L3", title: "Business Impact Analysis (BIA) and Disaster Recovery", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Security Governance Matrix Assignment", type: "text", content: "Practical Lab: Structure a comprehensive Security Risk Assessment Spreadsheet offline, calculating likelihood and impact weights for remote server nodes." }
        ]
      }
    ]
  },
  {
    id: "C-DATA-SCIENCE",
    name: "Data Science & Statistical Modeling",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 19000,
    description: "Mathematical statistics, hypothesis testing, ANOVA, linear and multivariate regression, classification, and cluster mapping.",
    modules: [
      {
        id: "M1",
        title: "Descriptive Statistics & Testing",
        lessons: [
          { id: "L1", title: "Normal Distributions, Z-Scores, and T-Tests", type: "video", duration: "14:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Analysis of Variance (ANOVA) Matrices", type: "text", content: "University Lecture: ANOVA evaluates mean variances across multiple datasets to isolate statistical significance. Practical: Calculate standard dev profiles from grade arrays." }
        ]
      },
      {
        id: "M2",
        title: "Predictive Modeling & Regressions",
        lessons: [
          { id: "L3", title: "Linear and Logistic Regression Models Fitting", type: "video", duration: "16:50", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L4", title: "Regression Slope Engine Practical", type: "text", content: "Practical Lab: Program an offline Linear Regression calculator. Compute slopes and intercept constants from custom student attendance and score arrays." }
        ]
      }
    ]
  },
  {
    id: "C-ERP-SYSTEMS",
    name: "Enterprise Resource Planning Systems",
    category: "Information Systems & Cloud",
    durationWeeks: 10,
    totalFees: 16500,
    description: "Software architecture of large-scale ERP packages, relational transactional tracking, ledger mappings, and API broker patterns.",
    modules: [
      {
        id: "M1",
        title: "ERP Database Architecture",
        lessons: [
          { id: "L1", title: "ERP Modular Schemas & Referential Foreign Keys", type: "video", duration: "13:30", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Accounting Ledgers & Inventory Double-Entry Systems", type: "text", content: "University Lecture: Enterprise transactions require ACID compliance. double-entry guarantees assets balance liabilities. Practical: Draw referential ERP core schemas." }
        ]
      },
      {
        id: "M2",
        title: "Enterprise Synchronization Controls",
        lessons: [
          { id: "L3", title: "Distributed Database Merges and Ledger Locks", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Double-Entry Ledger Validator Assignment", type: "text", content: "Practical Lab: Implement a local double-entry accounting ledger system. Code logic that blocks transaction saves if credits and debits do not balance exactly." }
        ]
      }
    ]
  },
  {
    id: "C-ETHICAL-HACK",
    name: "Ethical Hacking & Penetration Testing",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 12,
    totalFees: 22000,
    description: "Penetration testing methodology, advanced system port scans, SQL injection mapping, buffer overflows, and privilege escalations.",
    modules: [
      {
        id: "M1",
        title: "Reconnaissance & Vulnerability Scans",
        lessons: [
          { id: "L1", title: "Information Gathering, Port Scans, and OS Fingerprints", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Exploiting Web Core Input Parameters", type: "text", content: "University Lecture: Web parameters that aren't sanitized before SQL compilation allow raw SQL payload injections. Practical: Document injection vulnerable inputs." }
        ]
      },
      {
        id: "M2",
        title: "Exploitation & Privilege Escapes",
        lessons: [
          { id: "L3", title: "Buffer Overflows and Escalating Local User Roles", type: "video", duration: "17:45", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Injection Safety Detector Practical", type: "text", content: "Practical Lab: Build an offline parser function that audits incoming search fields, scanning for hazardous characters (e.g., \"' OR '1'='1\") and flagging suspected inject threats." }
        ]
      }
    ]
  },
  {
    id: "C-GAME-ENGINE",
    name: "Game Engine Architecture & Physics",
    category: "Software Engineering",
    durationWeeks: 12,
    totalFees: 21000,
    description: "Engineering real-time game systems, game loops, double buffering, sprite batch rendering, quadtree spatial maps, and basic AABB physics.",
    modules: [
      {
        id: "M1",
        title: "Real-Time Game Loop Architecture",
        lessons: [
          { id: "L1", title: "Determining Fixed Delta-Time & Frame-Rate Locks", type: "video", duration: "14:20", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Sprite Pipelines & Double-Buffering Render", type: "text", content: "University Lecture: Game engines update coordinates independently of render rates using fixed delta integrations. Double-buffering removes visual flickering. Practical: Plot game coordinates update tables." }
        ]
      },
      {
        id: "M2",
        title: "Collision & Quadtree Partitioning",
        lessons: [
          { id: "L3", title: "Axis-Aligned Bounding Box (AABB) Collision Math", type: "video", duration: "16:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "AABB Elastic Bounce Simulator Assignment", type: "text", content: "Practical Lab: Construct an offline 2D collision resolver. Code logic that checks intersections between rectangular bodies and calculates post-collision vector direction updates." }
        ]
      }
    ]
  },
  {
    id: "C-BLOCKCHAIN",
    name: "Blockchain & Decentralized Ledgers",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 23000,
    description: "Hash-linked data structures, proof-of-work mining algorithm, peer-to-peer network routing, smart contract compiling, and Solidity state safety.",
    modules: [
      {
        id: "M1",
        title: "Cryptographic Block Ledger Mechanics",
        lessons: [
          { id: "L1", title: "SHA-256 Block Hashing & Proof-of-Work Mining", type: "video", duration: "15:10", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Peer-to-Peer Ledger Consensus & Hard Forks", type: "text", content: "University Lecture: Blockchains link consecutive blocks using previous block header hashes. Proof-of-work imposes computational costs to prevent sybil attacks. Practical: Map chain branching structures." }
        ]
      },
      {
        id: "M2",
        title: "Smart Contracts & State Safety",
        lessons: [
          { id: "L3", title: "Solidity State Mutability and Reentrancy Attack Safety", type: "video", duration: "18:25", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Offline Blockchain Class Engine Practical", type: "text", content: "Practical Lab: Write an offline Block and Blockchain compiler class in TypeScript. Implement SHA-256 block linking, proof-of-work target mining, and a function checking chain integrity." }
        ]
      }
    ]
  }
];

// Seed Student Data
export const DEFAULT_STUDENTS: Student[] = [
  {
    id: "ET-2026-1001",
    admissionNo: "ETA/2026/001",
    fullName: "Enock Omato Jr",
    passportPhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    gender: "Male",
    dob: "2000-05-12",
    nationalId: "38920147",
    nationality: "Kenyan",
    county: "Kisii",
    subCounty: "Kitutu Chache",
    ward: "Marani",
    village: "Omoke",
    guardian: "Enock Omato Senior",
    parentPhone: "0712345678",
    parentEmail: "enockomato9@gmail.com",
    address: "P.O Box 456, Kisii",
    emergencyContact: "0722334455",
    courseEnrolled: "C-WEB-DEV",
    duration: "3 Months",
    batch: "Morning Batch A",
    class: "Room 1 - Tech Sandbox",
    learningMode: "Physical",
    registrationDate: "2026-06-01",
    expectedCompletionDate: "2026-09-01",
    status: "Active",
    achievements: ["Top Coder", "Perfect Attendance"],
  },
  {
    id: "ET-2026-1002",
    admissionNo: "ETA/2026/002",
    fullName: "Mercy Chepngetich",
    passportPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    gender: "Female",
    dob: "2003-09-24",
    nationalId: "40192837",
    nationality: "Kenyan",
    county: "Kericho",
    subCounty: "Belgut",
    ward: "Waldai",
    village: "Kabianga",
    guardian: "John Keter",
    parentPhone: "0723948576",
    parentEmail: "chepmercy@gmail.com",
    address: "P.O Box 12, Kericho",
    emergencyContact: "0799887766",
    courseEnrolled: "C-MS-OFFICE",
    duration: "1 Month",
    batch: "Afternoon Batch B",
    class: "Room 3 - Business Suite",
    learningMode: "Hybrid",
    registrationDate: "2026-06-15",
    expectedCompletionDate: "2026-07-15",
    status: "Active",
    achievements: ["Word Specialist"],
  },
  {
    id: "ET-2026-1003",
    admissionNo: "ETA/2026/003",
    fullName: "Alex Mwangi",
    passportPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    gender: "Male",
    dob: "2001-01-30",
    nationalId: "39102934",
    nationality: "Kenyan",
    county: "Nairobi",
    subCounty: "Westlands",
    ward: "Parklands",
    village: "Deep West",
    guardian: "Peter Mwangi",
    parentPhone: "0733123456",
    parentEmail: "mwangi.p@gmail.com",
    address: "Ngara Road, Nairobi",
    emergencyContact: "0711223344",
    courseEnrolled: "C-PYTHON",
    duration: "2 Months",
    batch: "Evening Batch C",
    class: "Online Hub",
    learningMode: "Online",
    registrationDate: "2026-06-10",
    expectedCompletionDate: "2026-08-10",
    status: "Active",
    achievements: [],
  },
];

// Seed Attendance
export const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  { id: "A1", studentId: "ET-2026-1001", date: "2026-07-01", status: "Present", markedBy: "Enock Omato" },
  { id: "A2", studentId: "ET-2026-1002", date: "2026-07-01", status: "Present", markedBy: "Enock Omato" },
  { id: "A3", studentId: "ET-2026-1003", date: "2026-07-01", status: "Present", markedBy: "Enock Omato" },
  { id: "A4", studentId: "ET-2026-1001", date: "2026-07-02", status: "Present", markedBy: "Enock Omato" },
  { id: "A5", studentId: "ET-2026-1002", date: "2026-07-02", status: "Late", markedBy: "Enock Omato" },
  { id: "A6", studentId: "ET-2026-1003", date: "2026-07-02", status: "Present", markedBy: "Enock Omato" },
  { id: "A7", studentId: "ET-2026-1001", date: "2026-07-03", status: "Present", markedBy: "Enock Omato" },
  { id: "A8", studentId: "ET-2026-1002", date: "2026-07-03", status: "Absent", markedBy: "Enock Omato" },
  { id: "A9", studentId: "ET-2026-1003", date: "2026-07-03", status: "Present", markedBy: "Enock Omato" },
];

// Seed Invoices & Cashflow
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "T1", type: "Income", category: "Tuition Fees", amount: 15000, date: "2026-06-01", description: "Enock Omato Jr Web Dev Fees Full Pay", paymentMethod: "M-Pesa", studentId: "ET-2026-1001", referenceNo: "RFA12903" },
  { id: "T2", type: "Income", category: "Tuition Fees", amount: 3000, date: "2026-06-15", description: "Mercy Chepngetich Office Package Installment 1", paymentMethod: "M-Pesa", studentId: "ET-2026-1002", referenceNo: "RFB39102" },
  { id: "T3", type: "Income", category: "Tuition Fees", amount: 6000, date: "2026-06-10", description: "Alex Mwangi Python Core Fees Deposit", paymentMethod: "Bank Transfer", studentId: "ET-2026-1003", referenceNo: "TXN77810" },
  { id: "T4", type: "Expense", category: "Rent & Facilities", amount: 20000, date: "2026-06-30", description: "Main Academy Hall Monthly Lease Payment", paymentMethod: "Bank Transfer", referenceNo: "LEAS9102" },
  { id: "T5", type: "Expense", category: "Utilities", amount: 4500, date: "2026-07-01", description: "Safaricom Business Fibres Internet Bill", paymentMethod: "M-Pesa", referenceNo: "RFC39201" },
  { id: "T6", type: "Expense", category: "Lab Supplies", amount: 12500, date: "2026-07-02", description: "Purchased 2 x Laptop Replacement RAM Modules and CMOS batteries", paymentMethod: "Cash", referenceNo: "CASH01" },
];

// Seed Lab Assets
export const DEFAULT_ASSETS: LabAsset[] = [
  { id: "AS1", name: "Dell OptiPlex Core i5 Workspace", type: "Computer", assetTag: "ETA-PC-001", status: "Operational", labRoom: "Lab A", lastInspectionDate: "2026-06-25" },
  { id: "AS2", name: "Epson PowerLite Projector", type: "Projector", assetTag: "ETA-PROJ-01", status: "Operational", labRoom: "Lecture Hall 1", lastInspectionDate: "2026-06-20" },
  { id: "AS3", name: "Cisco Catalyst 2960 Switch", type: "Switch", assetTag: "ETA-SW-01", status: "Operational", labRoom: "Networking Lab", lastInspectionDate: "2026-06-28" },
  { id: "AS4", name: "HP LaserJet Pro Printer", type: "Other", assetTag: "ETA-PRN-01", status: "Maintenance", labRoom: "Reception", lastInspectionDate: "2026-07-01" },
];

// Seed Assignments
export const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: "ASG1", courseId: "C-WEB-DEV", title: "Build a Responsive Navigation Bar", description: "Use semantic HTML5 tags and CSS flexbox to design a professional navigation bar that transforms into a hamburger overlay on screens under 768px wide.", deadline: "2026-07-15", maxMarks: 20 },
  { id: "ASG2", courseId: "C-MS-OFFICE", title: "Corporate Sales Spreadsheet Design", description: "Build an Excel model incorporating SUMIF, VLOOKUP, pivot charts, and neat monetary cell formatting representing dynamic quarterly performance.", deadline: "2026-07-10", maxMarks: 50 },
];

// Seed Student Submissions
export const DEFAULT_SUBMISSIONS: StudentSubmission[] = [
  { id: "S1", assignmentId: "ASG1", studentId: "ET-2026-1001", submittedAt: "2026-07-03 14:35", files: [{ name: "navbar_project.zip", size: "320 KB" }], textAnswers: "I successfully structured my code and responsive layouts using Tailwind utility classes.", marks: 18, gradeStatus: "Graded", feedback: "Excellent typography and fully fluid responsive breakdown. Try improving some dark mode states.", gradedBy: "Enock Omato" },
];

// Seed Certificates
export const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    certificateNumber: "ETA-2026-9042",
    studentId: "ET-2026-1001",
    studentName: "Enock Omato Jr",
    courseId: "C-WEB-DEV",
    courseName: "Full-Stack Web Development",
    issueDate: "2026-07-04",
    verificationUrl: `${window.location.origin}/verify/ETA-2026-9042`,
    qrCodeData: "https://enotech.academy/verify/ETA-2026-9042",
    status: "Valid",
    signatures: {
      principal: "Enock Omato",
      instructor: "Enock Omato",
    },
  },
];

// Seed Announcements
export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: "AN1", title: "Academy Offline Registration Module Now Live", content: "To aid local physical registration in outer counties, receptionist software can now function entirely offline using local caches, syncing seamlessly once connection is established.", date: "2026-07-01", sender: "Enock Omato", audience: "All", pinned: true },
  { id: "AN2", title: "End of Term Examinations Notice", content: "All active students in Computer Packages must clear outstanding lab fees and submit their spreadsheet design projects prior to booking the practical examinable slots.", date: "2026-07-03", sender: "Admin Office", audience: "Students", pinned: false },
];

// Database Manager class
export class EnoTechDatabase {
  static getCourses(): Course[] {
    const stored = getStored("courses", [] as Course[]);
    const combinedDefaults = [...DEFAULT_COURSES, ...ALL_COURSES_FROM_CATALOG];
    if (stored.length === 0) {
      setStored("courses", combinedDefaults);
      return combinedDefaults;
    }
    // Automatically merge new default courses that are missing from localStorage
    let updated = [...stored];
    let changed = false;
    combinedDefaults.forEach((c) => {
      if (!updated.some((uc) => uc.id === c.id)) {
        updated.push(c);
        changed = true;
      }
    });
    if (changed) {
      setStored("courses", updated);
    }
    return updated;
  }

  static saveCourse(course: Course) {
    const courses = this.getCourses();
    const existingIndex = courses.findIndex((c) => c.id === course.id);
    if (existingIndex > -1) {
      courses[existingIndex] = course;
    } else {
      courses.push(course);
    }
    setStored("courses", courses);
    this.addLog("SYSTEM", "Super Administrator", "Course Action", `Saved course ${course.name}`);
  }

  static massInjectCourses(newCourses: Course[]): Course[] {
    const courses = this.getCourses();
    let injectedCount = 0;
    const updated = [...courses];
    newCourses.forEach((c) => {
      const existingIndex = updated.findIndex((uc) => uc.id === c.id);
      if (existingIndex > -1) {
        updated[existingIndex] = c;
      } else {
        updated.push(c);
        injectedCount++;
      }
    });
    setStored("courses", updated);
    this.addLog("SYSTEM", "Super Administrator", "Course Action", `Mass-injected ${newCourses.length} university courses (${injectedCount} brand new)`);
    return updated;
  }

  static getStudents(): Student[] {
    return getStored("students", DEFAULT_STUDENTS);
  }

  static deleteStudent(id: string) {
    const students = this.getStudents();
    const updated = students.filter((s) => s.id !== id);
    setStored("students", updated);
    this.addLog("SYSTEM", "Super Administrator", "Student Action", `Deleted student ID ${id}`);
  }

  static saveStudent(student: Student) {
    const students = this.getStudents();
    const existingIndex = students.findIndex((s) => s.id === student.id);
    if (existingIndex > -1) {
      students[existingIndex] = student;
    } else {
      students.push(student);
    }
    setStored("students", students);
    this.addLog("SYSTEM", "Super Administrator", "Student Action", `Enrolled/Modified student ${student.fullName}`);
  }

  static getAttendance(): AttendanceRecord[] {
    return getStored("attendance", DEFAULT_ATTENDANCE);
  }

  static saveAttendance(records: AttendanceRecord[]) {
    const list = this.getAttendance();
    records.forEach((record) => {
      const idx = list.findIndex((a) => a.studentId === record.studentId && a.date === record.date);
      if (idx > -1) {
        list[idx] = record;
      } else {
        list.push(record);
      }
    });
    setStored("attendance", list);
    this.addLog("SYSTEM", "Super Administrator", "Attendance Mark", `Marked attendance for ${records.length} students`);
  }

  static getTransactions(): Transaction[] {
    return getStored("transactions", DEFAULT_TRANSACTIONS);
  }

  static addTransaction(tx: Transaction) {
    const txs = this.getTransactions();
    txs.push(tx);
    setStored("transactions", txs);
    this.addLog("SYSTEM", "Super Administrator", "Financial Entry", `Added ${tx.type}: ${tx.category} of KSh ${tx.amount}`);
  }

  static getAssets(): LabAsset[] {
    return getStored("assets", DEFAULT_ASSETS);
  }

  static saveAsset(asset: LabAsset) {
    const assets = this.getAssets();
    const existingIndex = assets.findIndex((a) => a.id === asset.id);
    if (existingIndex > -1) {
      assets[existingIndex] = asset;
    } else {
      assets.push(asset);
    }
    setStored("assets", assets);
    this.addLog("SYSTEM", "Super Administrator", "Asset Log", `Saved asset ${asset.name} (${asset.assetTag})`);
  }

  static getAssignments(): Assignment[] {
    return getStored("assignments", DEFAULT_ASSIGNMENTS);
  }

  static saveAssignment(asg: Assignment) {
    const list = this.getAssignments();
    list.push(asg);
    setStored("assignments", list);
  }

  static getSubmissions(): StudentSubmission[] {
    return getStored("submissions", DEFAULT_SUBMISSIONS);
  }

  static saveSubmission(sub: StudentSubmission) {
    const list = this.getSubmissions();
    const existingIndex = list.findIndex((s) => s.id === sub.id || (s.studentId === sub.studentId && s.assignmentId === sub.assignmentId));
    if (existingIndex > -1) {
      list[existingIndex] = sub;
    } else {
      list.push(sub);
    }
    setStored("submissions", list);
  }

  static getQuizAttempts(): StudentQuizAttempt[] {
    return getStored("quiz_attempts", []);
  }

  static saveQuizAttempt(attempt: StudentQuizAttempt) {
    const list = this.getQuizAttempts();
    list.push(attempt);
    setStored("quiz_attempts", list);
  }

  static getCertificates(): Certificate[] {
    return getStored("certificates", DEFAULT_CERTIFICATES);
  }

  static issueCertificate(cert: Certificate) {
    const list = this.getCertificates();
    list.push(cert);
    setStored("certificates", list);
    this.addLog("SYSTEM", "Super Administrator", "Certificate Issue", `Generated Certificate ${cert.certificateNumber} for ${cert.studentName}`);
  }

  static getAnnouncements(): Announcement[] {
    return getStored("announcements", DEFAULT_ANNOUNCEMENTS);
  }

  static addAnnouncement(ann: Announcement) {
    const list = this.getAnnouncements();
    list.push(ann);
    setStored("announcements", list);
  }

  static getLogs(): SystemLog[] {
    return getStored("logs", [
      { id: "L1", timestamp: "2026-07-04 10:20:15", userId: "Enock Omato", userRole: "Super Administrator", action: "System Boot", details: "EnoTech Academy core offline environment loaded successfully." },
      { id: "L2", timestamp: "2026-07-04 11:45:10", userId: "Enock Omato", userRole: "Super Administrator", action: "User Creation", details: "Instructors registered onto initial portal." },
    ]);
  }

  static addLog(userId: string, role: string, action: string, details: string) {
    const list = this.getLogs();
    const newLog: SystemLog = {
      id: "LOG-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleString(),
      userId,
      userRole: role as any,
      action,
      details,
    };
    list.unshift(newLog);
    setStored("logs", list);
  }

  // Generate Unique Admission / Serial ID
  static generateStudentNumber(): string {
    const students = this.getStudents();
    const nextNum = 1000 + students.length + 1;
    return `ET-2026-${nextNum}`;
  }

  static generateAdmissionNumber(): string {
    const students = this.getStudents();
    const nextNum = students.length + 1;
    return `ETA/2026/${String(nextNum).padStart(3, "0")}`;
  }

  static generateCertificateNumber(): string {
    const chars = "0123456789";
    let rand = "";
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ET-CERT-2026-${rand}`;
  }

  // Simulated Offline Synchronization Engine with detailed conflict logging
  static triggerSync(onProgress: (status: string, logs: string[]) => void): Promise<boolean> {
    return new Promise((resolve) => {
      const logs: string[] = [];
      onProgress("Checking network connection...", [...logs]);

      setTimeout(() => {
        logs.push("● Handshake established with EnoTech Cloud Backup (Cloud Run)...");
        onProgress("Connecting...", [...logs]);

        setTimeout(() => {
          logs.push("● Analyzing local offline queue: found 3 unsynced transactions and 2 attendance logs.");
          logs.push("● Pulling server schema: no major schema conflicts found.");
          onProgress("Pulling Cloud Records...", [...logs]);

          setTimeout(() => {
            logs.push("● Conflict Resolution: Student [Mercy Chepngetich] local status 'Active' matches cloud state. Retaining local.");
            logs.push("● Merging financial ledger: Transaction [T3] synchronized with bank webhook.");
            logs.push("● Encrypted payload containing certificates backed up with AES-256.");
            onProgress("Merging Data Nodes...", [...logs]);

            setTimeout(() => {
              logs.push("✔ Database Synchronization complete. Integrity factor: 100%.");
              onProgress("Success", [...logs]);
              resolve(true);
            }, 1000);
          }, 1200);
        }, 1200);
      }, 800);
    });
  }
}
