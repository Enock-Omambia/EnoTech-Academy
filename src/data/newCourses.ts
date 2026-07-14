import { Course } from "../types";

export const NEW_UNIVERSITY_COURSES: Course[] = [
  {
    id: "C-UNIV-1",
    name: "Advanced Cryptography & Zero-Knowledge Proofs",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 12,
    totalFees: 28000,
    duration: "12 Weeks",
    instructorName: "Prof. Enock Omato",
    description: "Rigorous study of algebraic cryptography, pairing-based cryptography, and non-interactive zero-knowledge arguments (zk-SNARKs/zk-STARKs).",
    modules: [
      {
        id: "M1",
        title: "Algebraic Cryptography Foundations",
        lessons: [
          { id: "L1", title: "Prime Fields & Finite Groups", type: "video", duration: "18:20", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Modular Polynomial Arithmetic Notes", type: "text", content: "Discrete logarithms are computationally intractable in large finite fields. Students will learn GCD algorithms, Chinese Remainder Theorem (CRT), and Euler's Totient." }
        ]
      },
      {
        id: "M2",
        title: "Elliptic Curve Cryptography (ECC)",
        lessons: [
          { id: "L3", title: "Weierstrass Curve Invariants", type: "video", duration: "20:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Elliptic Curve Diffie-Hellman Lab", type: "text", content: "Lab: Implement a scalar point multiplication routine over SECP256k1 in the interactive playground. Verify public keys offline." }
        ]
      },
      {
        id: "M3",
        title: "Pairing-Based Cryptography & Bilinear Maps",
        lessons: [
          { id: "L5", title: "Weil and Tate Pairings Explained", type: "video", duration: "22:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Bilinear Pairings Handshake Theory", type: "text", content: "Bilinear maps transfer difficult discrete logarithm problems from elliptic curve subgroups into simpler extension fields, enabling single-round tripartite handshakes." }
        ]
      },
      {
        id: "M4",
        title: "Zero-Knowledge Proofs & zk-SNARKs",
        lessons: [
          { id: "L7", title: "QAPs & R1CS Constraint Systems", type: "video", duration: "25:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "zk-SNARK Circuit Constructor Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-2",
    name: "AI Systems Architecture & LLMOps",
    category: "Artificial Intelligence",
    durationWeeks: 14,
    totalFees: 32000,
    duration: "14 Weeks",
    instructorName: "Dr. Catherine Nekesa",
    description: "Deep engineering study on model quantization, distributed training pipelines, parameter-efficient fine-tuning (PEFT), and scalable low-latency LLM serving.",
    modules: [
      {
        id: "M1",
        title: "Scalable Model Inference & Quantization",
        lessons: [
          { id: "L1", title: "Floating Point Operations & FP8 vs INT4", type: "video", duration: "16:45", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Model Compression & Calibration Algorithms", type: "text", content: "Quantization scales real-valued neural network weights into discrete integers. Students will implement a simple symmetric min-max quantization matrix mapper." }
        ]
      },
      {
        id: "M2",
        title: "Distributed Training & PEFT Pipelines",
        lessons: [
          { id: "L3", title: "Data Parallelism vs Tensor Parallelism", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L4", title: "LoRA: Low-Rank Adaptation Mechanics", type: "text", content: "LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices, drastically reducing trainable parameter counts." }
        ]
      },
      {
        id: "M3",
        title: "Vector Databases & Retrieval Architecture",
        lessons: [
          { id: "L5", title: "HNSW Graphs & Cosine Indexing", type: "video", duration: "19:35", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Retrieval-Augmented Generation (RAG) Controls", type: "text", content: "Learn to design a high-throughput context retrieval pipeline that supplements raw system prompt matrices with localized domain knowledge indices." }
        ]
      },
      {
        id: "M4",
        title: "High-Performance LLM Serving & Benchmarks",
        lessons: [
          { id: "L7", title: "vLLM PagedAttention Architectures", type: "video", duration: "24:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L8", title: "LLM Latency & Throughput Benchmark Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-3",
    name: "Bioinformatics & Computational Genomics",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 26000,
    duration: "12 Weeks",
    instructorName: "Dr. Silas Kiprotich",
    description: "Computational study of biological sequence analysis, genome assembly graph algorithms, phylogenetic trees, and structural bioinformatics.",
    modules: [
      {
        id: "M1",
        title: "Sequence Alignment Algorithms",
        lessons: [
          { id: "L1", title: "Needleman-Wunsch & Smith-Waterman Dynamic Programming", type: "video", duration: "19:50", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Scoring Matrices & Gap Penalty Mechanics", type: "text", content: "Sequence alignment uses dynamic programming grids. Needleman-Wunsch yields global alignments, while Smith-Waterman computes localized matching." }
        ]
      },
      {
        id: "M2",
        title: "Genome Assembly Graph Theory",
        lessons: [
          { id: "L3", title: "De Bruijn Graphs and Eulerian Paths", type: "video", duration: "18:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "K-mer Composition & De Novo Reconstruction", type: "text", content: "De novo genome assembly splits reads into overlapping k-mers, representing them as a De Bruijn graph. The assembled genome represents an Eulerian path." }
        ]
      },
      {
        id: "M3",
        title: "Phylogenetic Tree Reconstruction",
        lessons: [
          { id: "L5", title: "Neighbor-Joining & UPGMA Methods", type: "video", duration: "17:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Parsimony and Maximum Likelihood Trees", type: "text", content: "Phylogenetic analysis traces evolutionary ancestry. Distance-based methods evaluate absolute pairwise mutation counts to construct branching nodes." }
        ]
      },
      {
        id: "M4",
        title: "Genomic Mutation Mapping & Variant Analysis",
        lessons: [
          { id: "L7", title: "Single Nucleotide Polymorphisms (SNPs) Analysis", type: "video", duration: "20:45", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Computational Genomics Final Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-4",
    name: "Quantum Computing & Algorithms",
    category: "Computer Science",
    durationWeeks: 16,
    totalFees: 34000,
    duration: "16 Weeks",
    instructorName: "Prof. David Kamau",
    description: "Theoretical and practical foundations of quantum mechanics, qubit states, quantum circuit models, Shor's factoring, and Qiskit simulation.",
    modules: [
      {
        id: "M1",
        title: "Quantum Mechanics & Qubits",
        lessons: [
          { id: "L1", title: "Bra-Ket Notation & Bloch Sphere Invariants", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Quantum Superposition & Multi-Qubit Entanglement", type: "text", content: "A qubit is represented as a state vector on the Bloch sphere. Measurement collapses the vector to discrete basis states with probabilistic amplitudes." }
        ]
      },
      {
        id: "M2",
        title: "Quantum Circuit Models & Logic Gates",
        lessons: [
          { id: "L3", title: "Hadamard, Pauli, CNOT, and Toffoli Gates", type: "video", duration: "18:55", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Quantum Bell State Generation Lab", type: "text", content: "Practical Lab: Construct a quantum circuit containing a Hadamard gate and a CNOT gate to produce the maximally entangled Bell state." }
        ]
      },
      {
        id: "M3",
        title: "Quantum Algorithms",
        lessons: [
          { id: "L5", title: "Deutsch-Jozsa & Grover's Search Algorithm", type: "video", duration: "22:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Shor's Factoring & Quantum Fourier Transform (QFT)", type: "text", content: "Shor's algorithm solves prime factorization in polynomial time by converting the search into a period-finding task on a quantum computer." }
        ]
      },
      {
        id: "M4",
        title: "Qiskit Programming & Noise Mitigation",
        lessons: [
          { id: "L7", title: "Programming Real Quantum Hardware with Qiskit", type: "video", duration: "24:30", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Quantum Mechanics and Circuit Models Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-5",
    name: "Advanced Robotic Control Systems",
    category: "Computer Systems & Hardware",
    durationWeeks: 12,
    totalFees: 29000,
    duration: "12 Weeks",
    instructorName: "Eng. Victor Maina",
    description: "Engineering robotic kinematics, Jacobian matrices, state estimation with Kalman filters, SLAM navigation, and ROS2 control loops.",
    modules: [
      {
        id: "M1",
        title: "Robotic Kinematics & Matrices",
        lessons: [
          { id: "L1", title: "Denavit-Hartenberg (DH) Parameters & Forward Kinematics", type: "video", duration: "16:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Inverse Kinematics and Jacobian Singularities", type: "text", content: "Inverse kinematics maps target end-effector coordinates back to physical motor joint configurations using numerical Jacobian evaluations." }
        ]
      },
      {
        id: "M2",
        title: "State Estimation & Filtering",
        lessons: [
          { id: "L3", title: "Extended Kalman Filters (EKF) for Sensor Fusion", type: "video", duration: "20:45", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L4", title: "EKF Position Tracking Practical", type: "text", content: "Lab: Program an offline 1D Kalman filter tracking a robot's coordinates using acceleration and noisy GPS measurements. Plot the filtered state." }
        ]
      },
      {
        id: "M3",
        title: "SLAM & Navigation Algorithms",
        lessons: [
          { id: "L5", title: "Simultaneous Localization and Mapping (SLAM) Methods", type: "video", duration: "19:10", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L6", title: "LIDAR Point Clouds and Occupancy Grid Maps", type: "text", content: "SLAM algorithms build a physical layout map of an unknown environment while tracking a robot's relative path inside the map." }
        ]
      },
      {
        id: "M4",
        title: "ROS2 Controller Engineering",
        lessons: [
          { id: "L7", title: "Writing Custom ROS2 Nodes & PID Loops", type: "video", duration: "23:50", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L8", title: "Robotics State & Path Control Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-6",
    name: "Distributed Ledger Engineering & Solidity",
    category: "Software Engineering",
    durationWeeks: 12,
    totalFees: 31000,
    duration: "12 Weeks",
    instructorName: "Sarah Mwangi, MSc",
    description: "Deep study of the Ethereum Virtual Machine (EVM), gas optimization strategies, secure ERC tokens development, and smart contract audit procedures.",
    modules: [
      {
        id: "M1",
        title: "EVM Internals & Memory Layouts",
        lessons: [
          { id: "L1", title: "EVM Stack, Memory, Storage and Opcodes", type: "video", duration: "17:30", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Gas Cost Calculations and Optimization Rules", type: "text", content: "EVM memory is linear and byte-addressed. Writing data to durable blockchain storage incurs maximum gas. Learn how variable packing optimizes fees." }
        ]
      },
      {
        id: "M2",
        title: "Standard Token Architectures",
        lessons: [
          { id: "L3", title: "ERC-20 & ERC-721 Token Code Review", type: "video", duration: "19:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "ERC-20 Token Builder Lab", type: "text", content: "Practical Lab: Construct a compliant offline ERC-20 token contract. Show state changes during balance transfers, events, and approvals." }
        ]
      },
      {
        id: "M3",
        title: "Smart Contract Vulnerabilities",
        lessons: [
          { id: "L5", title: "Reentrancy, Integer Overflows & Front-running Attacks", type: "video", duration: "21:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Checks-Effects-Interactions Pattern", type: "text", content: "To prevent reentrancy, state modifications must be executed BEFORE external calls. Implement custom modifiers protecting payment withdrawals." }
        ]
      },
      {
        id: "M4",
        title: "Hardhat Framework & Multi-Sig Vaults",
        lessons: [
          { id: "L7", title: "Deploying and Testing Multi-Signature Wallets", type: "video", duration: "23:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "EVM Security Audit & Governance Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-7",
    name: "Compiler Optimization & Program Analysis",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 27000,
    duration: "12 Weeks",
    instructorName: "Dr. Peter Onyango",
    description: "Advanced compilers study. Static Single Assignment (SSA), control-flow graph construction, loop transformations, auto-vectorization, and LLVM pass development.",
    modules: [
      {
        id: "M1",
        title: "Intermediate Representations (IR)",
        lessons: [
          { id: "L1", title: "Static Single Assignment (SSA) Form & Phi Nodes", type: "video", duration: "15:55", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Control-Flow Graph (CFG) Mathematical Representation", type: "text", content: "Compilers convert syntax trees into an SSA IR, ensuring each variable is assigned exactly once. Phi nodes resolve diverging execution paths." }
        ]
      },
      {
        id: "M2",
        title: "Data-Flow Analysis & Optimizations",
        lessons: [
          { id: "L3", title: "Liveness Analysis & Register Allocation Heuristics", type: "video", duration: "18:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Dead Code Elimination (DCE) Lab", type: "text", content: "Practical Lab: Implement an offline dead-code elimination filter. Scan basic block assignment sequences to discard unreferenced local variables." }
        ]
      },
      {
        id: "M3",
        title: "Loop Transformations & Parallelism",
        lessons: [
          { id: "L5", title: "Loop Unrolling, Loop Fusion, and Auto-Vectorization", type: "video", duration: "20:10", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "SIMD Instructions & Vector Registers Mapping", type: "text", content: "Loop vectorization replaces scalar operations with Single-Instruction Multiple-Data hardware instructions, maximizing compute bandwidth." }
        ]
      },
      {
        id: "M4",
        title: "LLVM Compiler Infrastructure",
        lessons: [
          { id: "L7", title: "Writing a Custom Optimization Pass in LLVM", type: "video", duration: "22:30", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "IR Parsing & Static Analysis Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-8",
    name: "Cloud-Native Microservices with Istio",
    category: "Information Systems & Cloud",
    durationWeeks: 10,
    totalFees: 25000,
    duration: "10 Weeks",
    instructorName: "Eng. Alice Wambui",
    description: "Architecting cloud systems using gRPC, Docker, Kubernetes, and Istio Service Mesh. Secure and monitor traffic via Envoy sidecars.",
    modules: [
      {
        id: "M1",
        title: "High-Performance gRPC Communication",
        lessons: [
          { id: "L1", title: "Protocol Buffers (Protobuf) vs JSON Performance", type: "video", duration: "14:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "HTTP/2 Multiplexing & gRPC Streaming Options", type: "text", content: "gRPC uses binary serialization via Protobuf over HTTP/2 transport. Learn how connection multiplexing eliminates application head-of-line blocking." }
        ]
      },
      {
        id: "M2",
        title: "Service Mesh & Envoy Sidecars",
        lessons: [
          { id: "L3", title: "Istio Control Plane (Istiod) & Envoy Proxies", type: "video", duration: "16:45", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L4", title: "Declarative Sidecar Injection Configuration", type: "text", content: "The service mesh injects an Envoy proxy sidecar alongside each container. Sidecars capture, inspect, and route inter-pod networking traffic." }
        ]
      },
      {
        id: "M3",
        title: "Traffic Engineering & mutual TLS",
        lessons: [
          { id: "L5", title: "Canary Deployments, VirtualServices, and Retries", type: "video", duration: "18:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "mTLS Encryption & PeerAuthentication Rules", type: "text", content: "mTLS verifies cryptographic identities of both caller and receiver pods, securing service communications within the Kubernetes cluster boundary." }
        ]
      },
      {
        id: "M4",
        title: "Mesh Observability & Telemetry",
        lessons: [
          { id: "L7", title: "Distributed Tracing with Jaeger and Prometheus Metrics", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Cloud-Native Mesh Resiliency Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-9",
    name: "Full-Stack Functional Programming with Haskell",
    category: "Programming",
    durationWeeks: 12,
    totalFees: 24000,
    duration: "12 Weeks",
    instructorName: "Prof. Kenneth Mwenda",
    description: "Deep dive into category theory foundations, Monads, Applicatives, Algebraic Data Types, and compiling functional paradigms to optimized browser JS.",
    modules: [
      {
        id: "M1",
        title: "Lambda Calculus & Haskell Core",
        lessons: [
          { id: "L1", title: "Functional Purity, Laziness & Currying Mechanics", type: "video", duration: "16:50", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Algebraic Data Types & Pattern Matching", type: "text", content: "Functional architectures leverage immutable data structures and pure functions. Algebraic Data Types (Sum/Product) strictly define application states." }
        ]
      },
      {
        id: "M2",
        title: "The Monad Typeclass & Effects",
        lessons: [
          { id: "L3", title: "Functors, Applicative Functors, and Monadic Binds", type: "video", duration: "19:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Haskell State Monad Practical Lab", type: "text", content: "Lab: Write a type-safe parser using the State Monad. Manage a shifting text index without resorting to mutable global registers." }
        ]
      },
      {
        id: "M3",
        title: "Category Theory Foundations",
        lessons: [
          { id: "L5", title: "Monoids, Categories, and Natural Transformations", type: "video", duration: "21:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Isomorphism & Duality Theory Notes", type: "text", content: "Understand mappings from category C to D. Functors preserve structure. Natural transformations construct structure-preserving maps between functors." }
        ]
      },
      {
        id: "M4",
        title: "Compiling Functional Layouts to JS",
        lessons: [
          { id: "L7", title: "PureScript Compiler and React-Halogen Interfaces", type: "video", duration: "23:55", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Functional Programming Final Evaluation", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-10",
    name: "Cyber-Physical Systems & Real-Time Kernels",
    category: "Computer Systems & Hardware",
    durationWeeks: 12,
    totalFees: 28500,
    duration: "12 Weeks",
    instructorName: "Eng. Paul Gichuki",
    description: "Design and scheduling of real-time embedded systems, priority inversion mitigation, and custom kernel development for cyber-physical devices.",
    modules: [
      {
        id: "M1",
        title: "Real-Time Scheduling Models",
        lessons: [
          { id: "L1", title: "Rate Monotonic Scheduling (RMS) & EDF Invariants", type: "video", duration: "14:50", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Symmetric Multiprocessing & Task Affinities", type: "text", content: "RMS assigns static priorities based on task execution frequency. EDF dynamically assigns priority based on closest task completion deadlines." }
        ]
      },
      {
        id: "M2",
        title: "Interrupts & Hardware Interfacing",
        lessons: [
          { id: "L3", title: "Nested Vector Interrupt Controllers (NVIC) and I/O", type: "video", duration: "16:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "UART Interrupt Service Routine Practical", type: "text", content: "Practical Lab: Model an interrupt routine that buffers incoming sensor telemetry strings into an offline ring-queue without dropping packets." }
        ]
      },
      {
        id: "M3",
        title: "Priority Inversion Protocols",
        lessons: [
          { id: "L5", title: "Priority Inheritance and Ceiling Protocols", type: "video", duration: "18:22", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Mars Pathfinder Glitch Case Analysis", type: "text", content: "Review how priority inversion causes system deadlocks when low-priority threads hold shared mutex locks required by high-priority tasks." }
        ]
      },
      {
        id: "M4",
        title: "FreeRTOS Kernel Implementation",
        lessons: [
          { id: "L7", title: "Task Context Switching & Semaphore Semantics", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Embedded Kernels Final Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-11",
    name: "Natural Language Understanding & Parsing",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 30000,
    duration: "12 Weeks",
    instructorName: "Dr. Catherine Nekesa",
    description: "Theoretical syntax trees construction, the CYK algorithm, dependency parsing models, sequence labeling, and offline parsing engine design.",
    modules: [
      {
        id: "M1",
        title: "Formal Grammars & CYK Parsing",
        lessons: [
          { id: "L1", title: "Chomsky Normal Form & Cocke-Younger-Kasami Parsing", type: "video", duration: "18:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Parsing Arbitrary Sentences with CFG Hand-Solving", type: "text", content: "The CYK algorithm parses context-free grammars in Chomsky Normal Form using dynamic programming matrices to evaluate rule combinations." }
        ]
      },
      {
        id: "M2",
        title: "Dependency Parsing Architectures",
        lessons: [
          { id: "L3", title: "Transition-Based vs Graph-Based Parsing Models", type: "video", duration: "16:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Arc-Standard Dependency Parsing Simulator", type: "text", content: "Practical Lab: Implement a transition-based parser with a virtual shift, left-arc, and right-arc stack operator to construct parse relations." }
        ]
      },
      {
        id: "M3",
        title: "Sequence Labeling & Named Entities",
        lessons: [
          { id: "L5", title: "Hidden Markov Models & Conditional Random Fields", type: "video", duration: "19:50", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Viterbi Decoder Pathfinding Core", type: "text", content: "The Viterbi algorithm computes the most likely sequence of hidden states (e.g. POS tags) from a sequence of observed words under HMM rules." }
        ]
      },
      {
        id: "M4",
        title: "Deep Sequence Parsing Engines",
        lessons: [
          { id: "L7", title: "Transformers for Syntactic and Semantic Parsing", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Syntactic Grammars Theory Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-12",
    name: "Deep Reinforcement Learning & Game Theory",
    category: "Artificial Intelligence",
    durationWeeks: 14,
    totalFees: 33000,
    duration: "14 Weeks",
    instructorName: "Dr. Silas Kiprotich",
    description: "Markov Decision Processes, deep value-based models, policy gradient derivations (PPO/TRPO), and implementing game theoretic reinforcement environments.",
    modules: [
      {
        id: "M1",
        title: "Markov Decision Processes (MDP)",
        lessons: [
          { id: "L1", title: "Bellman Expectation & Optimality Equations", type: "video", duration: "17:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Value Iteration and Policy Iteration Dynamic Solvers", type: "text", content: "An MDP maps states, actions, transition models, and rewards. Value iteration converges dynamically to locate optimal policy vectors." }
        ]
      },
      {
        id: "M2",
        title: "Value-Based Deep Learning",
        lessons: [
          { id: "L3", title: "Q-Learning, SARSA, and Deep Q-Networks (DQN)", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "DQN Experience Replay & Target Model Sync", type: "text", content: "DQN uses neural network approximations. Experience replay buffers reduce data correlation, and secondary target networks stabilize loss gradients." }
        ]
      },
      {
        id: "M3",
        title: "Policy Gradient Optimizers",
        lessons: [
          { id: "L5", title: "REINFORCE, Actor-Critic, and Proximal Policy Optimization", type: "video", duration: "23:45", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "PPO Clipping & Actor-Critic Cores", type: "text", content: "PPO limits policy updates using a clipped surrogate objective function, ensuring stable optimization steps during neural learning loops." }
        ]
      },
      {
        id: "M4",
        title: "Game Theoretic Solvers & Gym",
        lessons: [
          { id: "L7", title: "Multi-Agent RL & Nash Equilibrium Convergence", type: "video", duration: "25:20", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Reinforcement Optimization final Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-13",
    name: "High-Performance GPU Programming with CUDA",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 32500,
    duration: "12 Weeks",
    instructorName: "Prof. David Kamau",
    description: "Architecting GPU code. Dynamic grid/block configurations, thread synchronization, optimizing shared memory structures, bank conflicts, and streams.",
    modules: [
      {
        id: "M1",
        title: "CUDA Thread Hierarchy Foundations",
        lessons: [
          { id: "L1", title: "GPU Hardware Layout: SMs, Warps, and Grids", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Writing Your First CUDA Kernel (VecAdd)", type: "text", content: "CUDA threads execute in groups of 32 (warps). Proper indexing uses blockIdx, blockDim, and threadIdx variables to split parallel vector offsets." }
        ]
      },
      {
        id: "M2",
        title: "Shared Memory & Coalesced Access",
        lessons: [
          { id: "L3", title: "Coalesced Global Memory & Shared Memory Allocations", type: "video", duration: "19:12", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L4", title: "Avoiding Shared Memory Bank Conflicts", type: "text", content: "Shared memory is partitioned into 32 banks. Subsequent access to the same bank creates conflicts, stalling warp execution. Learn to pad arrays." }
        ]
      },
      {
        id: "M3",
        title: "CUDA Streams & Multi-GPU Concurrency",
        lessons: [
          { id: "L5", title: "Overlapping Kernel Compute & Host-Device Memory Transfers", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Asynchronous Memcpy & Streams Architecture", type: "text", content: "Streams allow concurrent operations. Transferring memory asynchronously while executing another stream's kernel conceals bus bottlenecks." }
        ]
      },
      {
        id: "M4",
        title: "Accelerated Matrix Math & FFT",
        lessons: [
          { id: "L7", title: "Optimizing 2D Shared Memory Matrix Multiplication", type: "video", duration: "24:15", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Parallel Hardware Architecture Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-14",
    name: "Computer Vision & Convolutional Networks",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 29500,
    duration: "12 Weeks",
    instructorName: "Eng. Victor Maina",
    description: "Classical image processing filters, Deep CNNs (ResNet, MobileNet), real-time object detection (YOLO), and edge inference optimization.",
    modules: [
      {
        id: "M1",
        title: "Classical Image Processing Filters",
        lessons: [
          { id: "L1", title: "Gaussian Blurs, Sobel Edges, and Kernel Convolutions", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "2D Convolution Mechanics & Padding Structures", type: "text", content: "2D convolutions slide a coefficient kernel matrix across pixel channels, extracting low-level frequency features (edges, corners, gradients)." }
        ]
      },
      {
        id: "M2",
        title: "Deep CNN Architecture In-Depth",
        lessons: [
          { id: "L3", title: "Receptive Fields, ResNet Skip Connections, and Pooling", type: "video", duration: "18:45", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "CNN Backward Propagation Mechanics Notes", type: "text", content: "Skip connections in ResNet pass inputs directly to subsequent layers, preserving gradients during backpropagation across ultra-deep networks." }
        ]
      },
      {
        id: "M3",
        title: "Real-Time Object Detection YOLO",
        lessons: [
          { id: "L5", title: "YOLO (You Only Look Once) vs R-CNN Pipeline", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Bounding Boxes & Intersection over Union (IoU) Math", type: "text", content: "YOLO divides frames into bounding grid grids, outputting confidence coefficients and regression offsets for class labels in a single feedforward pass." }
        ]
      },
      {
        id: "M4",
        title: "Edge Deployment & Quantization Models",
        lessons: [
          { id: "L7", title: "Compiling Models to TensorFlow Lite and ONNX Runtime", type: "video", duration: "23:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Deep CNN and CV Models Evaluation Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-15",
    name: "Advanced Database Tuning & Query Optimization",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 26500,
    duration: "12 Weeks",
    instructorName: "Dr. Peter Onyango",
    description: "Database engine internals. B-Trees, LSM-Trees, cost-based optimizer mechanics, transactional lock tables, and query execution planning.",
    modules: [
      {
        id: "M1",
        title: "Storage Engines & Indexes Internals",
        lessons: [
          { id: "L1", title: "B-Tree vs Log-Structured Merge (LSM) Trees", type: "video", duration: "17:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Clustered Indexes vs Heap Storage", type: "text", content: "B-Trees organize keys sequentially for quick read seek offsets. LSM-Trees append data to memory logs, periodically flushing structured segments to disk." }
        ]
      },
      {
        id: "M2",
        title: "Cost-Based Query Optimization",
        lessons: [
          { id: "L3", title: "Database Statistics, Histograms & Cardinality Estimates", type: "video", duration: "19:22", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Query Plan Generation Lab", type: "text", content: "Practical Lab: Generate and parse query execution plans (EXPLAIN ANALYZE) in a PostgreSQL environment. Trace nested loops and hash join selection." }
        ]
      },
      {
        id: "M3",
        title: "Concurrency & Lock Invariants",
        lessons: [
          { id: "L5", title: "MVCC (Multi-Version Concurrency Control) & Deadlocks", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Transaction Isolation Levels Explained", type: "text", content: "Review read-uncommitted, read-committed, repeatable-read, and serializable states. See how MVCC resolves write lock contention without blocking reads." }
        ]
      },
      {
        id: "M4",
        title: "Scale Architectures & Partitioning",
        lessons: [
          { id: "L7", title: "Horizontal Sharding & Distributed Relational Joins", type: "video", duration: "23:55", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Relational Optimizer & Architecture Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-16",
    name: "Internet-Scale Network Routing Protocols",
    category: "Networking",
    durationWeeks: 10,
    totalFees: 27500,
    duration: "10 Weeks",
    instructorName: "Eng. Alice Wambui",
    description: "Deep networking dive: Border Gateway Protocol (BGP4), OSPF convergence, MPLS Traffic Engineering, and Software-Defined Networking.",
    modules: [
      {
        id: "M1",
        title: "Exterior Gateway Protocols (BGP4)",
        lessons: [
          { id: "L1", title: "AS Numbers, Path Vector Routing, and BGP Handshakes", type: "video", duration: "15:20", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "BGP Route Attributes & Filtering Rules", type: "text", content: "BGP4 maintains the worldwide routing matrix using path vectors, evaluating variables (MED, local preference, weight, AS-Path) to determine loop-free routes." }
        ]
      },
      {
        id: "M2",
        title: "MPLS Label Switching Paths",
        lessons: [
          { id: "L3", title: "Label Distribution Protocol (LDP) & RSVP-TE", type: "video", duration: "18:40", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L4", title: "MPLS Tunnel Construction Lab", type: "text", content: "Lab: Map out label distribution paths across a 6-router core node map, calculating incoming and outgoing label translation logs." }
        ]
      },
      {
        id: "M3",
        title: "Software-Defined Networking (SDN)",
        lessons: [
          { id: "L5", title: "Separating Control Plane and Data Plane (OpenFlow)", type: "video", duration: "20:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "SDN Centralized Controllers & Flow Tables", type: "text", content: "SDN centralizes routing logic in software controllers. Network switches act as simple hardware forwarders matching rules in high-speed flow tables." }
        ]
      },
      {
        id: "M4",
        title: "Network Core Resiliency & Attacks",
        lessons: [
          { id: "L7", title: "Mitigating IP Hijacking & BGP Leak Vulnerabilities", type: "video", duration: "22:15", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "OSPF & BGP Routing Core Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-17",
    name: "Advanced Parallel Algorithms & MPI",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 29000,
    duration: "12 Weeks",
    instructorName: "Prof. David Kamau",
    description: "Designing message-passing parallel software. Collective communication, parallel sorting, barrier synchronizations, and Amdahl's Law speedups.",
    modules: [
      {
        id: "M1",
        title: "Amdahl's Law & Parallel Overhead",
        lessons: [
          { id: "L1", title: "Speedup Bounds, Strong vs Weak Scaling Math", type: "video", duration: "16:15", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Inter-Core Communication Latency Analysis", type: "text", content: "Amdahl's Law determines maximum performance bounds. S = 1 / ((1 - P) + P/N), proving that serial bottlenecks cap parallel scaling limits." }
        ]
      },
      {
        id: "M2",
        title: "MPI Point-to-Point Exchanges",
        lessons: [
          { id: "L3", title: "MPI_Send, MPI_Recv, and Non-blocking Buffers (Isend)", type: "video", duration: "18:45", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Message Passing Deadlocks Lab", type: "text", content: "Practical Lab: Model a deadlock condition where adjacent nodes try synchronous transmissions simultaneously. Code non-blocking resolves." }
        ]
      },
      {
        id: "M3",
        title: "MPI Collectives & Reductions",
        lessons: [
          { id: "L5", title: "MPI_Scatter, MPI_Gather, MPI_Allreduce, and Barriers", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Parallel Bitonic and Sample Sort Algorithms", type: "text", content: "Collectives distribute vectors across processes efficiently. MPI_Reduce applies mathematical functions (sum, min, max) globally without manual indexing." }
        ]
      },
      {
        id: "M4",
        title: "Shared Memory OpenMP Integration",
        lessons: [
          { id: "L7", title: "Hybrid OpenMP + MPI Clustered Formats", type: "video", duration: "23:45", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Parallel Complexity & Synchronization Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-18",
    name: "Mobile System Architectures & Native Bridges",
    category: "Programming",
    durationWeeks: 12,
    totalFees: 23000,
    duration: "12 Weeks",
    instructorName: "Eng. Paul Gichuki",
    description: "Designing memory-efficient native mobile bridges, cross-platform UI loops, battery optimization, and encrypted client-side local sync states.",
    modules: [
      {
        id: "M1",
        title: "Native UI Thread Loops & Bridges",
        lessons: [
          { id: "L1", title: "Dynamic Native JS/C++ Bridges & IPC Calls", type: "video", duration: "14:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Message Serialization Costs & Memory Overheads", type: "text", content: "Native application bridges translate web layouts to underlying platform frameworks. Learn to minimize bridge traffic using unified structured arrays." }
        ]
      },
      {
        id: "M2",
        title: "On-Device Memory Optimization",
        lessons: [
          { id: "L3", title: "Dynamic Texture Atlas Loading & Layout Rebuilds", type: "video", duration: "17:55", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Mobile Heap Analyzer Allocation Lab", type: "text", content: "Practical Lab: Trace memory allocation sizes in a mobile viewport, identifying and releasing detached DOM views to prevent app crashes." }
        ]
      },
      {
        id: "M3",
        title: "Secure Client-Side Sandboxing",
        lessons: [
          { id: "L5", title: "Keychain Security, Cryptographic Storage, and SQLite-Sync", type: "video", duration: "19:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "AES-GCM Secure Storage Policies", type: "text", content: "Configure automatic local storage encryption. Use hardware keys to lock local offline database records on sleep cycles." }
        ]
      },
      {
        id: "M4",
        title: "Low-Power Background Scheduling",
        lessons: [
          { id: "L7", title: "WorkManager Constraints and Network Coalescing", type: "video", duration: "22:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Mobile Systems and Bridge Operations Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-19",
    name: "HDL & FPGA Digital Logic Synthesis",
    category: "Computer Systems & Hardware",
    durationWeeks: 12,
    totalFees: 30500,
    duration: "12 Weeks",
    instructorName: "Eng. Paul Gichuki",
    description: "Hardware description language system implementation: SystemVerilog, FPGA logic cells placement, timing constraints, and ALU soft processors.",
    modules: [
      {
        id: "M1",
        title: "SystemVerilog Structural Design",
        lessons: [
          { id: "L1", title: "RTL Synthesizable Code Blocks vs Testbench Loops", type: "video", duration: "15:10", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Always Blocks & Blocking vs Non-blocking Assignments", type: "text", content: "Always_ff blocks model sequential logic using non-blocking registers (<=). Always_comb blocks model instant combinational routing." }
        ]
      },
      {
        id: "M2",
        title: "FSM Design & Multi-Clock Domains",
        lessons: [
          { id: "L3", title: "Mealy vs Moore State Engines and Clock Synchronization", type: "video", duration: "18:40", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L4", title: "Dual-Flip-Flop Clock Sync Lab", type: "text", content: "Practical Lab: Implement a dual-stage sync register to pass control flags safely across different hardware clock speeds, eliminating metastability." }
        ]
      },
      {
        id: "M3",
        title: "Synthesis, Place-and-Route, and Timing",
        lessons: [
          { id: "L5", title: "LUT Allocations, Routing Overheads, and Clock Skew", type: "video", duration: "21:15", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Resolving Hold & Setup Time Violations", type: "text", content: "Setup time requires data stabilize before the next clock pulse. Hold time ensures data persists after. Learn how placement delays alter margins." }
        ]
      },
      {
        id: "M4",
        title: "Custom Soft-Processor ALU Synthesis",
        lessons: [
          { id: "L7", title: "Designing an 8-Bit Instruction Decoder and Registers", type: "video", duration: "24:50", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "SystemVerilog RTL Synthesis Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-20",
    name: "Penetration Testing Methodology & Red Teaming",
    category: "Cybersecurity & Cryptography",
    durationWeeks: 12,
    totalFees: 28000,
    duration: "12 Weeks",
    instructorName: "Sarah Mwangi, MSc",
    description: "Comprehensive active defense and offensive pentesting study. Port scanning heuristics, custom buffer overflows, Active Directory attacks, and audits.",
    modules: [
      {
        id: "M1",
        title: "Active Reconnaissance & Port Scans",
        lessons: [
          { id: "L1", title: "TCP Syn Scans, Idle Scans, and OS Fingerprints", type: "video", duration: "16:20", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Bypassing IDS/Firewall Filters with Scapy Packet Crafting", type: "text", content: "Port scanning mapping evaluates open/closed port signatures by monitoring TCP flags. Custom crafted packets bypass basic security routing." }
        ]
      },
      {
        id: "M2",
        title: "Custom Buffer Overflow Exploit Design",
        lessons: [
          { id: "L3", title: "Fuzzing Stack Pointers & Controlling EIP Registers", type: "video", duration: "21:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L4", title: "Shellcode Payload Injection Lab", type: "text", content: "Practical Lab: Construct a shellcode deployment payload. Identify target return pointers and write assembly offsets to hijack stack instructions." }
        ]
      },
      {
        id: "M3",
        title: "Active Directory Domain Escalations",
        lessons: [
          { id: "L5", title: "Kerberoasting, Pass-the-Hash, and BloodHound Audits", type: "video", duration: "23:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "AD Domain Controller Hijacking Policies", type: "text", content: "AD networks rely on ticket validation. Kerberoasting attacks extract service ticket hashes, offline auditing them to uncover accounts." }
        ]
      },
      {
        id: "M4",
        title: "Enterprise Red Team Security Auditing",
        lessons: [
          { id: "L7", title: "Writing Professional Penetration Testing Reports", type: "video", duration: "25:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L8", title: "Offensive Exploitations & Audits Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-21",
    name: "Enterprise Systems & Event-Driven Architecture",
    category: "Software Engineering",
    durationWeeks: 12,
    totalFees: 25500,
    duration: "12 Weeks",
    instructorName: "Dr. Peter Onyango",
    description: "Scalable enterprise architectures: Event Sourcing, Command Query Responsibility Segregation (CQRS), Apache Kafka, and distributed Saga patterns.",
    modules: [
      {
        id: "M1",
        title: "Event Sourcing & CQRS Core",
        lessons: [
          { id: "L1", title: "Log-centric States & Projection View Generations", type: "video", duration: "16:40", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Command Handler Validation Routines", type: "text", content: "Event sourcing persists state as a sequence of immutable events. CQRS decouples high-speed write command pipelines from optimized read views." }
        ]
      },
      {
        id: "M2",
        title: "Kafka Event Broker Topologies",
        lessons: [
          { id: "L3", title: "Kafka Partitions, Consumer Groups, and Commit Offsets", type: "video", duration: "19:15", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "High-Throughput Partition Broker Lab", type: "text", content: "Practical Lab: Configure a local mock partition selector assigning message keys to unique consumer threads to guarantee order processing." }
        ]
      },
      {
        id: "M3",
        title: "Saga Pattern Distributed Transactions",
        lessons: [
          { id: "L5", title: "Choreography vs Orchestration Saga Mechanics", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Compensating Transactions and Failure Handlers", type: "text", content: "The Saga pattern manages multi-service updates without locking databases globally, triggering sequential compensating undo commands on errors." }
        ]
      },
      {
        id: "M4",
        title: "Resilient Offline Order Pipelines",
        lessons: [
          { id: "L7", title: "Outbox Pattern and Message Delivery Guarantees", type: "video", duration: "23:55", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Distributed Enterprise Patterns Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-22",
    name: "Computational Geometry & Spatial Indexing",
    category: "Computer Science",
    durationWeeks: 12,
    totalFees: 27000,
    duration: "12 Weeks",
    instructorName: "Prof. Kenneth Mwenda",
    description: "Mathematical modeling of spatial structures: Convex hulls, sweep-line segment intersections, and indexing with KD-trees and Quadtrees.",
    modules: [
      {
        id: "M1",
        title: "Convex Hull Geometric Solvers",
        lessons: [
          { id: "L1", title: "Graham Scan & Jarvis March Complexity Math", type: "video", duration: "15:40", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Cross-Product Turn Determinations Notes", type: "text", content: "Graham scan solves convex hulls in O(N log N) by sorting vertices radially and tracking clockwise/counterclockwise vector cross-products." }
        ]
      },
      {
        id: "M2",
        title: "Sweep-Line Intersection Solvers",
        lessons: [
          { id: "L3", title: "Bentley-Ottmann Segment Crossings Method", type: "video", duration: "18:25", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Sweep-Line Intersection Event Queue Lab", type: "text", content: "Practical Lab: Code an offline sweep-line event sorter tracking horizontal segment intervals, outputting intersecting coordinates." }
        ]
      },
      {
        id: "M3",
        title: "Spatial Partitioning Indexes",
        lessons: [
          { id: "L5", title: "KD-Trees, Quadtrees, and R-Tree Structures", type: "video", duration: "20:45", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Multidimensional Range Query Slicers", type: "text", content: "Spatial indexes partition coordinates into hierarchical nodes, slicing query complexities from O(N) to O(log N) for mapping systems." }
        ]
      },
      {
        id: "M4",
        title: "Collision & Range Filters",
        lessons: [
          { id: "L7", title: "AABB Spatial Partition and Dynamic Viewport Mapping", type: "video", duration: "23:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Spatial Geometric Complexity Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-23",
    name: "Data Science: Deep Statistical Learning & ANOVA",
    category: "Artificial Intelligence",
    durationWeeks: 12,
    totalFees: 26000,
    duration: "12 Weeks",
    instructorName: "Dr. Catherine Nekesa",
    description: "Rigorous statistical model parsing: ANOVA, multiple regressions, collinearity diagnoses, and Principal Component Analysis (PCA).",
    modules: [
      {
        id: "M1",
        title: "Analysis of Variance (ANOVA) Foundations",
        lessons: [
          { id: "L1", title: "F-Distribution, Variance Between/Within Groups", type: "video", duration: "16:10", url: "https://www.youtube.com/embed/Vl0hqi_Apc" },
          { id: "L2", title: "Two-Way ANOVA Matrices & Interacting Effects", type: "text", content: "ANOVA tests statistical equivalence across multiple sample sets by evaluating mean-square variances relative to random probability." }
        ]
      },
      {
        id: "M2",
        title: "Multivariate Regression Analysis",
        lessons: [
          { id: "L3", title: "Ordinary Least Squares (OLS) & Collinearity Diagnoses", type: "video", duration: "19:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L4", title: "Multivariate Slope Coefficient Calculator Lab", type: "text", content: "Practical Lab: Construct a matrix regression solver offline. Map input covariance matrices to extract model weights and intercept vectors." }
        ]
      },
      {
        id: "M3",
        title: "Principal Component Analysis (PCA)",
        lessons: [
          { id: "L5", title: "Covariance Eigenvalues & Dimension Reductions", type: "video", duration: "21:40", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "SVD (Singular Value Decomposition) Math Notes", type: "text", content: "PCA maps high-dimensional vectors to perpendicular principal components, isolating the vectors with maximum variance weights." }
        ]
      },
      {
        id: "M4",
        title: "Statistical Inference Sandbox Models",
        lessons: [
          { id: "L7", title: "Hypothesis Testing, Chi-Square, and Model Fits", type: "video", duration: "24:30", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Statistical Modeling Theory Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-24",
    name: "Virtualization & Hypervisor Internals",
    category: "Information Systems & Cloud",
    durationWeeks: 12,
    totalFees: 31500,
    duration: "12 Weeks",
    instructorName: "Sarah Mwangi, MSc",
    description: "Detailed systems programming: Hardware virtualization extensions, nested page tables, Type-1 vs Type-2 hypervisors, and guest context switches.",
    modules: [
      {
        id: "M1",
        title: "Hardware Virtualization Foundations",
        lessons: [
          { id: "L1", title: "Intel VT-x VMX Root/Non-Root Execution Modes", type: "video", duration: "17:15", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "VM Control Structures (VMCS) Layouts", type: "text", content: "Intel VT-x introduces hardware-controlled root/non-root sandboxes. The VMCS controls guest register states and VM-Exit trap parameters." }
        ]
      },
      {
        id: "M2",
        title: "Virtual Memory & Nested Paging",
        lessons: [
          { id: "L3", title: "Extended Page Tables (EPT) and Address Conversions", type: "video", duration: "19:40", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Two-Dimensional Page Walk Calculation Lab", type: "text", content: "Lab: Track physical address translation from guest-virtual to guest-physical to host-physical registers using nested EPT trees." }
        ]
      },
      {
        id: "M3",
        title: "I/O Trap Intercepts & Emulation",
        lessons: [
          { id: "L5", title: "VirtIO Drivers, PCI Passes, and Guest MMIO Traps", type: "video", duration: "21:55", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Shadow Page Tables vs Hardware EPT Rates", type: "text", content: "I/O requests trigger guest trapping exit routines. Hypervisors catch instructions and emulate responses using direct memory maps." }
        ]
      },
      {
        id: "M4",
        title: "Context Switch Engine Simulation",
        lessons: [
          { id: "L7", title: "Writing a Guest State Save and Restore Loop", type: "video", duration: "24:10", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Hypervisor Architecture final Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-25",
    name: "Human-Computer Interaction: Cognitive Accessibility",
    category: "Graphic Design",
    durationWeeks: 8,
    totalFees: 18000,
    duration: "8 Weeks",
    instructorName: "Sarah Mwangi, MSc",
    description: "Designing interfaces with WCAG 2.2 AAA guidelines, parsing screen-readers, customizing keyboard loops, and contrast heuristics.",
    modules: [
      {
        id: "M1",
        title: "Cognitive Load & Screen Readers",
        lessons: [
          { id: "L1", title: "Aria Roles, Landmarks, and Screen Reader Traversals", type: "video", duration: "14:10", url: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          { id: "L2", title: "Cognitive Load Theory and Visual Focus Hierarchies", type: "text", content: "HCI designs isolate primary actions. Clear visual labels and landmark tags allow screen readers to parse applications quickly." }
        ]
      },
      {
        id: "M2",
        title: "Keyboard Traps & Interactive Focus Loops",
        lessons: [
          { id: "L3", title: "WCAG 2.2 Tab-Index Rules and Focus Traps", type: "video", duration: "16:30", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Modal Keyboard Trap Interceptor Lab", type: "text", content: "Practical Lab: Code an offline JavaScript listener trapping key focus inside a modal popup, preventing tab escapes to hidden screen elements." }
        ]
      },
      {
        id: "M3",
        title: "Contrast Heuristics & Dynamic Focus Rings",
        lessons: [
          { id: "L5", title: "Calculating Color Contrast Ratios (WCAG AAA)", type: "video", duration: "18:45", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Design Patterns for Color Blindness", type: "text", content: "Contrast ratios must meet 7:1 for WCAG AAA compliance. Never convey critical system state using color changes alone." }
        ]
      },
      {
        id: "M4",
        title: "Dynamic High-Contrast Dashboard Refactoring",
        lessons: [
          { id: "L7", title: "Integrating CSS Variable Inversions & Custom Themes", type: "video", duration: "21:20", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "WCAG 2.2 Compliance and Heuristics Quiz", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-26",
    name: "Enterprise Resource Planning & Distributed Ledgers",
    category: "Information Systems & Cloud",
    durationWeeks: 10,
    totalFees: 24500,
    duration: "10 Weeks",
    instructorName: "Eng. Alice Wambui",
    description: "Designing double-entry and triple-entry transactional ledger engines, multi-tenant schemas, and ACID transaction locks.",
    modules: [
      {
        id: "M1",
        title: "Relational Ledger Schemas & ACID Invariants",
        lessons: [
          { id: "L1", title: "Double-Entry Bookkeeping Database Models", type: "video", duration: "15:20", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Database Integrity & Multi-Tenant Partition Mappings", type: "text", content: "Double-entry databases map transactions to balancing debit and credit entries. Tenant partitions use isolation keys protecting access." }
        ]
      },
      {
        id: "M2",
        title: "Triple-Entry Cryptographic Ledgers",
        lessons: [
          { id: "L3", title: "Hash-Linked Invoice Receipts and Smart Auditing", type: "video", duration: "18:45", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "Triple-Entry Cryptographic Validator Lab", type: "text", content: "Practical Lab: Construct an offline ledger signer hash linking consecutive entries to construct a tamper-proof invoice sequence." }
        ]
      },
      {
        id: "M3",
        title: "Concurrency Control & Row Locks",
        lessons: [
          { id: "L5", title: "Two-Phase Commit Protocols & Distributed Ledger Merges", type: "video", duration: "20:50", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Avoiding Ledger Collision Overdrafts", type: "text", content: "Row-level locks block concurrent balance debits, preventing balance race conditions across distributed transactional nodes." }
        ]
      },
      {
        id: "M4",
        title: "Multi-tenant Ledger Balance Synchronization",
        lessons: [
          { id: "L7", title: "Designing High-Throughput Reconciliation Queues", type: "video", duration: "22:40", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "ERP Ledgers and ACID Invariants Exam", type: "quiz" }
        ]
      }
    ]
  },
  {
    id: "C-UNIV-27",
    name: "Advanced Game Engine Physics & Spatial Octrees",
    category: "Software Engineering",
    durationWeeks: 12,
    totalFees: 30000,
    duration: "12 Weeks",
    instructorName: "Prof. Kenneth Mwenda",
    description: "Designing rigid body physics, Continuous Collision Detection (CCD) math, and 3D space partition indexes utilizing octrees.",
    modules: [
      {
        id: "M1",
        title: "Rigid Body Kinematics & Forces",
        lessons: [
          { id: "L1", title: "Inertia Tensors, Torques, and Gravity Integrators", type: "video", duration: "16:45", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
          { id: "L2", title: "Euler Integration vs Verlet Coordinate Updates", type: "text", content: "Rigid body physics loops integrate velocity matrices to update coordinates. Verlet integration tracks previous frames to maintain stable bonds." }
        ]
      },
      {
        id: "M2",
        title: "3D Collision Solvers & CCD",
        lessons: [
          { id: "L3", title: "Continuous Collision Detection vs Discrete Overlaps", type: "video", duration: "19:20", url: "https://www.youtube.com/embed/8-y1X-M8M-8" },
          { id: "L4", title: "AABB Elastic Bounce Direction Calculator Lab", type: "text", content: "Practical Lab: Code an offline 3D collision solver calculating kinetic bounce direction changes between intersecting box bodies." }
        ]
      },
      {
        id: "M3",
        title: "3D Spatial Octrees & Partitioning",
        lessons: [
          { id: "L5", title: "Octrees and Binary Space Partition (BSP) Maps", type: "video", duration: "21:30", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: "L6", title: "Slicing Collision Checking Rates", type: "text", content: "Octrees recursively subdivide 3D space into eight octants, reducing rendering and collision testing rates from O(N^2) to O(N log N)." }
        ]
      },
      {
        id: "M4",
        title: "Custom 3D Physics Loop Construction",
        lessons: [
          { id: "L7", title: "Rigid Body Solver and Matrix Rotations", type: "video", duration: "23:50", url: "https://www.youtube.com/embed/y17RuWkWdn8" },
          { id: "L8", title: "Game Engine Physics and Matrix math Quiz", type: "quiz" }
        ]
      }
    ]
  }
];
