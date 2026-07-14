import { Course } from "../types";

export interface CatalogCourse extends Course {
  categoryGroup: string;
  prerequisites: string[];
  objectives: string[];
  readingMaterials: { title: string; content: string }[];
  downloadableResources: { title: string; filename: string; size: string; link: string }[];
  handsOnLabs: { title: string; description: string; instructions: string; codeSnippet?: string; terminalType?: string }[];
  codingChallenges: { title: string; description: string; starterCode?: string; language?: string; expectedOutput?: string }[];
  knowledgeChecks: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  moduleQuizzes: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  practicalAssignments: { title: string; prompt: string; maxScore: number };
  finalCapstoneProject: { title: string; instructions: string; requirements: string[] };
  finalAssessment: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  suggestedNextCourse: { id: string; name: string };
}

export const CATALOG_SCHOOLS = [
  {
    name: "🛡️ School of Cybersecurity",
    description: "Master offensive and defensive cybersecurity techniques, risk management, and digital forensics.",
    courses: [
      {
        id: "CYB-INTRO",
        name: "Introduction to Cybersecurity",
        category: "Foundations",
        durationWeeks: 4,
        totalFees: 6000,
        duration: "4 Weeks",
        description: "Understand the core concepts of information security, threat modeling, and foundational security controls.",
        prerequisites: ["None"],
        objectives: [
          "Understand the CIA Triad (Confidentiality, Integrity, Availability)",
          "Identify common threat actors and their motivations",
          "Analyze basic attack vectors like phishing, malware, and social engineering",
          "Understand the principles of defense-in-depth and security controls"
        ],
        readingMaterials: [
          {
            title: "The Foundations of Information Security",
            content: "Information Security is defined by the CIA triad. Confidentiality ensures that data is accessible only to authorized users. Integrity protects data from unauthorized modifications. Availability guarantees that resources are accessible when needed."
          }
        ],
        downloadableResources: [
          { title: "Cybersecurity Terminology Cheat Sheet", filename: "cybersec_terms.pdf", size: "1.2 MB", link: "#" },
          { title: "Security Best Practices Checklist", filename: "security_checklist.pdf", size: "850 KB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Threat Modeling with STRIDE",
            description: "Analyse a simple banking application using Microsoft's STRIDE framework to identify security vulnerabilities.",
            instructions: "Identify Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege threats in a transaction portal."
          }
        ],
        codingChallenges: [
          {
            title: "Implement a Simple Ceasar Cipher",
            description: "Write a function to encrypt a password using the classical Caesar Cipher shifting mechanism.",
            starterCode: "def caesar_encrypt(text, shift):\n    # Write your encryption logic here\n    return \"\"",
            language: "python"
          }
        ],
        knowledgeChecks: [
          {
            question: "Which of the following represents the 'I' in the CIA Triad?",
            options: ["Identification", "Integrity", "Isolation", "Inspection"],
            answerIndex: 1,
            explanation: "The 'I' in CIA Triad stands for Integrity, which ensures that data is accurate and has not been altered maliciously."
          }
        ],
        moduleQuizzes: [
          {
            question: "What is social engineering?",
            options: [
              "Hacking into server hardware directly",
              "Manipulating individuals into giving away sensitive information",
              "Writing software to automate phishing",
              "Setting up enterprise firewalls"
            ],
            answerIndex: 1,
            explanation: "Social engineering is the psychological manipulation of people into performing actions or divulging confidential information."
          }
        ],
        practicalAssignments: {
          title: "Enterprise Threat Assessment",
          prompt: "Draft a 500-word vulnerability report for a remote-work infrastructure using VPN connections.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "SOHO Network Security Audit Portfolio",
          instructions: "Perform a security posture assessment of a typical Small Office Home Office (SOHO) network setup, recommending firewall, Wi-Fi, and patch management strategies.",
          requirements: [
            "Identify 5 common SOHO network weaknesses.",
            "Formulate detailed remediation steps for each weakness.",
            "Design a basic network diagram detailing secure segmentations."
          ]
        },
        finalAssessment: [
          {
            question: "Which security control is considered preventative?",
            options: ["IDS logs", "Firewall rules", "Audit reviews", "Backup validation"],
            answerIndex: 1,
            explanation: "Firewall rules actively block unauthorized traffic, making them a preventative security control."
          }
        ],
        suggestedNextCourse: { id: "CYB-ETHICAL", name: "Ethical Hacking Fundamentals" }
      },
      {
        id: "CYB-ETHICAL",
        name: "Ethical Hacking Fundamentals",
        category: "Ethical Hacking",
        durationWeeks: 8,
        totalFees: 12000,
        duration: "8 Weeks",
        description: "Dive deep into offensive security testing, reconnaissance, scanning, vulnerability assessments, and exploitation.",
        prerequisites: ["Introduction to Cybersecurity", "Linux Fundamentals"],
        objectives: [
          "Understand the phases of penetration testing",
          "Perform passive and active information gathering using Nmap and Shodan",
          "Identify and exploit web and system vulnerabilities",
          "Formulate clear, professional security audit reports"
        ],
        readingMaterials: [
          {
            title: "Penetration Testing Methodology Guide",
            content: "An ethical hacker follows a structured methodology: 1. Reconnaissance (Information Gathering), 2. Scanning & Enumeration, 3. Gaining Access (Exploitation), 4. Maintaining Access, and 5. Covering Tracks or Reporting."
          }
        ],
        downloadableResources: [
          { title: "Nmap Commands Cheat Sheet", filename: "nmap_commands.pdf", size: "1.4 MB", link: "#" },
          { title: "Metasploit Quick Start Guide", filename: "metasploit_guide.pdf", size: "2.1 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Nmap Port Scanning Lab",
            description: "Scan a mock target server using Nmap to identify active ports, protocols, and software services.",
            instructions: "Run a stealth scan (sS) and service version detection scan (sV) on target IP 192.168.1.100."
          }
        ],
        codingChallenges: [
          {
            title: "Build an Offline Port Scanner in Python",
            description: "Write a simple script using Python's socket library that attempts to connect to a target host on a range of ports.",
            starterCode: "import socket\n\ndef scan_port(host, port):\n    # Attempt connections to identify open ports\n    pass",
            language: "python"
          }
        ],
        knowledgeChecks: [
          {
            question: "What does the -sS flag represent in Nmap?",
            options: ["Script scan", "Syn stealth scan", "Service version scan", "SCTP association scan"],
            answerIndex: 1,
            explanation: "-sS triggers a SYN Stealth Scan, which does not complete the 3-way TCP handshake, evading simple logs."
          }
        ],
        moduleQuizzes: [
          {
            question: "Which of the following tools is primary for exploitation?",
            options: ["Wireshark", "Nmap", "Metasploit Framework", "Burp Suite"],
            answerIndex: 2,
            explanation: "Metasploit Framework is the most widely recognized tool for executing exploitation payloads against known vulnerabilities."
          }
        ],
        practicalAssignments: {
          title: "Vulnerability Scanning Assessment",
          prompt: "Conduct a scanning review based on Nmap log outputs and recommend immediate patch measures.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Vulnerable Server Penetration Portfolio",
          instructions: "Execute a mock penetration test on a legacy server environment, exploit a vulnerable web form, escalate privileges, and submit a remediation roadmap.",
          requirements: [
            "Document the reconnaissance phase completely with terminal logs.",
            "Outline the successful exploitation chain.",
            "Suggest long-term patches for the server OS and software."
          ]
        },
        finalAssessment: [
          {
            question: "What is privilege escalation?",
            options: [
              "Upgrading internet connection speed",
              "Gaining higher-level administrative access using system loopholes",
              "Buying enterprise licenses for pentest tools",
              "Adding new regular users to a database"
            ],
            answerIndex: 1,
            explanation: "Privilege escalation is the act of exploiting a bug, design flaw, or configuration oversight in an operating system or software application to gain elevated access."
          }
        ],
        suggestedNextCourse: { id: "CYB-WEBSEC", name: "Web Application Security (OWASP Top 10)" }
      },
      {
        id: "CYB-WEBSEC",
        name: "Web Application Security",
        category: "Web Security",
        durationWeeks: 6,
        totalFees: 10000,
        duration: "6 Weeks",
        description: "Master secure coding, web protocols, and defensive measures against critical OWASP Top 10 vulnerabilities.",
        prerequisites: ["Introduction to Cybersecurity", "HTML5 & CSS3"],
        objectives: [
          "Explain OWASP Top 10 security risks in modern apps",
          "Identify and patch SQL Injections and Cross-Site Scripting (XSS)",
          "Configure secure HTTP headers and authentication flows",
          "Implement CSRF protection mechanisms"
        ],
        readingMaterials: [
          {
            title: "OWASP Top 10 Deep Dive",
            content: "Web application security revolves around mitigating input validation failures. SQL Injection (SQLi) occurs when untrusted user input is concatenated directly into SQL command strings. Cross-Site Scripting (XSS) occurs when an application includes untrusted data in a web page without proper validation or escaping."
          }
        ],
        downloadableResources: [
          { title: "OWASP Top 10 Reference Poster", filename: "owasp_top_10.pdf", size: "2.4 MB", link: "#" },
          { title: "Secure PHP & JS Code Snippets", filename: "secure_snippets.zip", size: "120 KB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "SQL Injection Prevention Sandbox",
            description: "Analyze a vulnerable PHP lookup form and convert raw query concatenations into secure Prepared Statements.",
            instructions: "Inspect login.php and replace standard mysql_query calls with PDO prepared statements."
          }
        ],
        codingChallenges: [
          {
            title: "XSS Input Sanitizer",
            description: "Write a JavaScript function that sanitizes incoming comments to remove script tags and dangerous HTML characters.",
            starterCode: "function sanitizeHtml(input) {\n    // Replace tags with secure HTML entities\n    return input;\n}",
            language: "javascript"
          }
        ],
        knowledgeChecks: [
          {
            question: "Which technique is most effective at preventing SQL Injection?",
            options: ["Client-side length constraints", "Prepared Statements & Parameterization", "Converting letters to uppercase", "Hashing input text with MD5"],
            answerIndex: 1,
            explanation: "Prepared statements ensure the SQL interpreter treats user inputs strictly as parameters, preventing executable command injections."
          }
        ],
        moduleQuizzes: [
          {
            question: "What is Cross-Site Scripting (XSS)?",
            options: [
              "Injecting malicious database rows",
              "Injecting malicious scripts into trusted websites that execute in users' browsers",
              "Crashing a system server using large packet sizes",
              "Bypassing network routers entirely"
            ],
            answerIndex: 1,
            explanation: "XSS is a vulnerability where malicious scripts are injected into web apps, executing when other users load the pages."
          }
        ],
        practicalAssignments: {
          title: "Secure Web Form Review",
          prompt: "Audit a web application login mechanism and submit a mitigation checklist against Session Hijacking.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Secure E-Commerce Portal Hardening",
          instructions: "Audit a mockup digital store, find 3 architectural security holes (CSRF, IDOR, SQLi), document them with CVSS ratings, and implement code fixes.",
          requirements: [
            "Demonstrate functional Proof of Concept (PoC) attacks.",
            "Write secure, refactored backend scripts.",
            "Incorporate standard helmet headers and CSRF tokens."
          ]
        },
        finalAssessment: [
          {
            question: "What does CSRF stand for?",
            options: ["Cyber Security Risk Framework", "Cross-Site Request Forgery", "Command System Routing File", "Critical Security Response Force"],
            answerIndex: 1,
            explanation: "CSRF stands for Cross-Site Request Forgery, an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated."
          }
        ],
        suggestedNextCourse: { id: "CYB-NETSEC", name: "Network Security & VPNs" }
      }
    ]
  },
  {
    name: "💻 School of Programming",
    description: "Acquire robust software development skills across high-performance languages like Python, Java, C++, and Rust.",
    courses: [
      {
        id: "PROG-PYTHON",
        name: "Python Core Programming",
        category: "Python",
        durationWeeks: 8,
        totalFees: 8000,
        duration: "8 Weeks",
        description: "Develop structural programming skills utilizing variables, loops, object-oriented concepts, and APIs in Python.",
        prerequisites: ["Basic Computer Literacy"],
        objectives: [
          "Understand Python variables, structures (lists, dicts, tuples)",
          "Formulate custom algorithms using conditional branches and loops",
          "Apply Object-Oriented Programming (OOP) classes and inheritance",
          "Read and write raw files and communicate with web REST APIs"
        ],
        readingMaterials: [
          {
            title: "Python Data Structures In-Depth",
            content: "Python features rich, built-in dynamic arrays called Lists, key-value hash structures called Dictionaries, and immutable tuples. Programmers leverage list comprehensions to write clean, mathematical-like data filter loops."
          }
        ],
        downloadableResources: [
          { title: "Python Core Syntax Guide", filename: "python_syntax.pdf", size: "1.8 MB", link: "#" },
          { title: "Standard Library Handy Reference", filename: "python_stdlib.pdf", size: "900 KB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Local Database CRUD File Lab",
            description: "Construct an offline database storage script that records and retrieves user profiles in a JSON file.",
            instructions: "Create profiles.json and write python load_db() and save_db() functions."
          }
        ],
        codingChallenges: [
          {
            title: "Array Filter Challenge",
            description: "Write a function that filters out all numbers that are prime in a given list of integers.",
            starterCode: "def filter_primes(numbers):\n    # Return only prime values from the input list\n    return []",
            language: "python"
          }
        ],
        knowledgeChecks: [
          {
            question: "How do you define a function in Python?",
            options: ["function myFunc()", "def myFunc():", "void myFunc()", "define myFunc()"],
            answerIndex: 1,
            explanation: "In Python, functions are defined using the 'def' keyword followed by the function name, arguments list, and a colon."
          }
        ],
        moduleQuizzes: [
          {
            question: "Which data type in Python is immutable?",
            options: ["List", "Dictionary", "Set", "Tuple"],
            answerIndex: 3,
            explanation: "Tuples are immutable sequence types in Python; once created, their elements cannot be changed or reallocated."
          }
        ],
        practicalAssignments: {
          title: "Command-Line Directory Utility",
          prompt: "Write a command-line script that crawls a local directory and aggregates file sizes grouped by extensions.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Multi-User Financial Ledger System",
          instructions: "Build a modular, OOP-driven financial tracking ledger. Users must be able to log incomes, record expenses, categorize costs, and generate terminal balance summaries written to a secure ledger file.",
          requirements: [
            "Integrate file persistence (JSON or CSV).",
            "Handle decimal values using appropriate float formatting.",
            "Write complete exception handling for file read/write issues."
          ]
        },
        finalAssessment: [
          {
            question: "What is the result of '3' + '4' in Python?",
            options: ["7", "12", "'34'", "Error"],
            answerIndex: 2,
            explanation: "Concatenating two string elements '3' and '4' returns the merged string '34'."
          }
        ],
        suggestedNextCourse: { id: "PROG-RUST", name: "Rust Systems Programming & Memory Safety" }
      },
      {
        id: "PROG-RUST",
        name: "Rust Systems Programming",
        category: "Rust",
        durationWeeks: 10,
        totalFees: 15000,
        duration: "10 Weeks",
        description: "Master modern systems programming with Rust. Dive into the borrow checker, ownership, lifelines, and concurrency.",
        prerequisites: ["Python Core Programming", "C Programming"],
        objectives: [
          "Grasp Rust ownership, borrowing, and lifetime rules",
          "Write concurrent code without data races",
          "Implement high-performance zero-cost abstractions",
          "Build efficient system-level tools"
        ],
        readingMaterials: [
          {
            title: "The Mechanics of Ownership & Borrowing",
            content: "Rust achieves memory safety without a garbage collector through its Ownership system. Every value has a single owner. When the owner goes out of scope, the memory is automatically reclaimed (dropped). Programmers can borrow values via references: immutable references (&T) or a single mutable reference (&mut T) at any time."
          }
        ],
        downloadableResources: [
          { title: "Rust Ownership Cheat Sheet", filename: "rust_ownership.pdf", size: "2.1 MB", link: "#" },
          { title: "Cargo Package Manager Reference", filename: "cargo_reference.pdf", size: "1.1 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Custom Command Parser",
            description: "Write a memory-safe command parser that reads a terminal string and slices it safely using borrowed slices.",
            instructions: "Create a safe command struct that holds a reference string without copying memory heaps."
          }
        ],
        codingChallenges: [
          {
            title: "Borrow Checker Fix",
            description: "Fix a buggy Rust function that tries to return a reference to a local variable.",
            starterCode: "fn get_greeting<'a>() -> &'a String {\n    let s = String::from(\"hello\");\n    &s // Fix this memory safety bug!\n}",
            language: "rust"
          }
        ],
        knowledgeChecks: [
          {
            question: "How many mutable references to a resource can exist simultaneously in Rust?",
            options: ["Infinite", "Up to 5", "Exactly 1", "As many as active threads"],
            answerIndex: 2,
            explanation: "To prevent data races, Rust allows exactly one mutable reference to a value in a scope, and only if no immutable references exist."
          }
        ],
        moduleQuizzes: [
          {
            question: "Which of the following is NOT true about a garbage collector in Rust?",
            options: [
              "Rust does not use a garbage collector during execution",
              "Memory is freed at compile-time by injecting clean drop statements",
              "Rust requires manual free() calls from the programmer",
              "Ownership rules are validated during compilation"
            ],
            answerIndex: 2,
            explanation: "Rust does not require manual free() calls; the compiler automatically drops resources when they exit their valid owner scopes."
          }
        ],
        practicalAssignments: {
          title: "Custom Stack Vector Implementation",
          prompt: "Write a primitive Stack array vector structure using Rust and guarantee thread safety bounds.",
          maxScore: 120
        },
        finalCapstoneProject: {
          title: "High-Performance Log Aggregator",
          instructions: "Construct a concurrent log analysis engine. It must read multiple directories, parse syslog dates using regex threads, and write aggregates into an output dashboard.",
          requirements: [
            "Use thread workers and channels (std::sync::mpsc).",
            "Implement custom Error type mapping.",
            "Provide absolute zero-copy parsing where applicable."
          ]
        },
        finalAssessment: [
          {
            question: "What does the 'unwrap' method do in Rust when called on an Option containing None?",
            options: ["Returns a default value", "Gracefully prompts the user", "Triggers a program panic", "Converts None into Some"],
            answerIndex: 2,
            explanation: "Calling unwrap() on an Option that holds 'None' results in an immediate execution panic."
          }
        ],
        suggestedNextCourse: { id: "WEB-DEV-REACT", name: "Modern Web Engineering with React & Node" }
      }
    ]
  },
  {
    name: "🌐 School of Web Development",
    description: "Construct scalable, secure, and beautiful frontend interfaces and enterprise backend services.",
    courses: [
      {
        id: "WEB-DEV-REACT",
        name: "Full-Stack Web Engineering",
        category: "Web Development",
        durationWeeks: 12,
        totalFees: 15000,
        duration: "12 Weeks",
        description: "Master modern web development using HTML5, CSS3, Tailwind CSS, TypeScript, React, Express.js, and SQL databases.",
        prerequisites: ["JavaScript Basics"],
        objectives: [
          "Construct interactive responsive frontends with React & Tailwind CSS",
          "Implement high-throughput REST APIs using Node.js & Express",
          "Design SQL relational schemas and query with custom ORMs",
          "Configure secure local state persistence and state routing"
        ],
        readingMaterials: [
          {
            title: "React Hooks & Virtual DOM rendering",
            content: "React maximizes UI efficiency by maintaining a Virtual DOM in-memory. Components render based on state changes. Hooks like useState, useEffect, and useMemo allow developers to plug state and caching mechanics directly into clean functional components."
          }
        ],
        downloadableResources: [
          { title: "React Lifecycle & Hooks Quickcard", filename: "react_hooks.pdf", size: "1.7 MB", link: "#" },
          { title: "Tailwind CSS Layout Blueprint", filename: "tailwind_layouts.pdf", size: "800 KB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Build an Express REST API",
            description: "Design an Express server with RESTful routes to manage an educational courses list.",
            instructions: "Create server.ts with routes GET /api/courses, POST /api/courses, and appropriate status handlers."
          }
        ],
        codingChallenges: [
          {
            title: "Custom React State Filter",
            description: "Create a React helper function that filters a list of objects based on dynamic query parameters without mutating the source list.",
            starterCode: "import React from 'react';\n\nexport function filterList(items, query) {\n    // Return filtered list\n    return [];\n}",
            language: "typescript"
          }
        ],
        knowledgeChecks: [
          {
            question: "What hook is used to run side effects in functional React components?",
            options: ["useState", "useEffect", "useMemo", "useContext"],
            answerIndex: 1,
            explanation: "The useEffect hook is specifically designed to perform asynchronous side-effects (e.g., data fetching, subscription logs) inside React."
          }
        ],
        moduleQuizzes: [
          {
            question: "What is the default port for EnoTech dev server architectures?",
            options: ["5173", "8080", "3000", "443"],
            answerIndex: 2,
            explanation: "Port 3000 is the designated externally routed container port in our sandboxed dev reverse proxy."
          }
        ],
        practicalAssignments: {
          title: "Full-Stack Task Board",
          prompt: "Write a React card portal that logs tasks, updates their categories via an API, and persists records.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "EnoTech LMS Module Dashboard",
          instructions: "Create a miniature clone of the EnoTech academy dashboard. Incorporate user-role selection (Student, Admin, Instructor), lesson completion tickers, and local progress tracking.",
          requirements: [
            "Maintain states cleanly across tabs.",
            "Write a simple Node back-proxy for mock requests.",
            "Style fully with tailwind dark utility grids."
          ]
        },
        finalAssessment: [
          {
            question: "Which Tailwind utility class is used to establish flex containers?",
            options: ["display-flex", "make-flex", "flex", "container-flex"],
            answerIndex: 2,
            explanation: "The utility 'flex' establishes a standard flexbox layout container."
          }
        ],
        suggestedNextCourse: { id: "CERT-SECPLUS", name: "CompTIA Security+ Exam Prep" }
      }
    ]
  },
  {
    name: "🐧 Linux Academy",
    description: "Gain complete mastery over the Linux command line, shell scripting, system administration, and security.",
    courses: [
      {
        id: "LINUX-ADMIN",
        name: "Linux Administration & Bash Scripting",
        category: "Linux",
        durationWeeks: 6,
        totalFees: 7500,
        duration: "6 Weeks",
        description: "Master filesystems, permissions, user groups, networking, services, and automating systems with Bash scripting.",
        prerequisites: ["None"],
        objectives: [
          "Understand Linux file structures and permission masks (chmod/chown)",
          "Configure background tasks, systemd services, and cron jobs",
          "Automate administrative tasks with shell loops and conditional bash files",
          "Troubleshoot networking adapters and system log errors"
        ],
        readingMaterials: [
          {
            title: "Linux Filesystem Hierarchy & Permissions",
            content: "Linux is founded on the philosophy 'everything is a file'. Standard directories include /bin (essential binaries), /etc (system configurations), /var (dynamic logs), and /home (user paths). Permissions are represented by octal values: Read (4), Write (2), and Execute (1)."
          }
        ],
        downloadableResources: [
          { title: "Bash Command Reference Card", filename: "bash_commands.pdf", size: "1.5 MB", link: "#" },
          { title: "Linux SysAdmin Boot Guide", filename: "linux_sysadmin.pdf", size: "1.9 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Automated Log Rotation Script",
            description: "Write a bash script that locates logs larger than 1MB in /var/log/ and archives them to backups.",
            instructions: "Create log_rotator.sh using find, tar, and standard shell loops. Set a mockup cron entry."
          }
        ],
        codingChallenges: [
          {
            title: "Bash Variable Parser",
            description: "Construct a bash function that reads a configuration file line by line and prints only lines starting with an active variable definition.",
            starterCode: "#!/bin/bash\n\nparse_config() {\n    # Read file and match lines\n    echo \"\"\n}",
            language: "bash"
          }
        ],
        knowledgeChecks: [
          {
            question: "What octal value represents read, write, and execute permissions for the owner, and read-only for others?",
            options: ["777", "755", "744", "644"],
            answerIndex: 2,
            explanation: "Owner gets rwx (4+2+1=7), group gets r-- (4), and others get r-- (4). That matches octal code 744."
          }
        ],
        moduleQuizzes: [
          {
            question: "Which command is used to view running process streams in real-time?",
            options: ["ps", "top", "grep", "cat"],
            answerIndex: 1,
            explanation: "The 'top' command (or htop) displays the active, dynamic process schedule tree in real-time."
          }
        ],
        practicalAssignments: {
          title: "User Management Playbook",
          prompt: "Draft a bash routine that batch registers 50 users from a list, creating secure home files and randomized passwords.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Hardened LAMP Cluster Orchestration",
          instructions: "Formulate a detailed systemd layout script. It must launch a web application environment, configure UFW firewall rules, restrict SSH keys, and schedule hourly databases logs to a backup terminal.",
          requirements: [
            "Construct a fully functional sysctl system config file.",
            "Provide complete terminal log transcripts of simulated commands.",
            "Ensure zero root login privileges over port 22."
          ]
        },
        finalAssessment: [
          {
            question: "Where are system log messages traditionally stored in a standard Linux system?",
            options: ["/etc/syslog", "/var/log", "/home/logs", "/usr/bin/logs"],
            answerIndex: 1,
            explanation: "The '/var/log' directory stores dynamic log assets including syslog, auth.log, and service errors."
          }
        ],
        suggestedNextCourse: { id: "CERT-RHCSA", name: "Red Hat Certified System Administrator (RHCSA)" }
      }
    ]
  },
  {
    name: "☁ Cloud Computing",
    description: "Learn to architect, secure, and deploy global cloud applications on AWS, Google Cloud, and Azure.",
    courses: [
      {
        id: "CLOUD-AWS",
        name: "Cloud Architecture & Devops with AWS",
        category: "Cloud Computing",
        durationWeeks: 8,
        totalFees: 12000,
        duration: "8 Weeks",
        description: "Deploy, manage, and scale global web apps using Amazon Web Services, Terraform, and Docker containers.",
        prerequisites: ["Linux Administration"],
        objectives: [
          "Design secure VPC architectures with public and private subnets",
          "Automate AWS cloud infrastructure using Terraform",
          "Configure auto-scaling groups and Application Load Balancers",
          "Implement high-availability relational databases (RDS)"
        ],
        readingMaterials: [
          {
            title: "The Principles of High-Availability Cloud Design",
            content: "Cloud scale relies on decoupling services. Applications are hosted across multiple Availability Zones (AZs) behind redundant load balancers. Infrastructure is defined as code (IaC) using tools like Terraform, assuring consistent, repeatable builds."
          }
        ],
        downloadableResources: [
          { title: "Terraform AWS Cheatsheet", filename: "terraform_aws.pdf", size: "1.4 MB", link: "#" },
          { title: "AWS Architecture Blueprint Design Guide", filename: "aws_blueprints.pdf", size: "2.3 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "VPC Infrastructure Provisioning Lab",
            description: "Deploy a multi-tier AWS VPC configuration with private database networks and elastic route gateways.",
            instructions: "Write a main.tf file containing aws_vpc, aws_subnet, and appropriate internet gateway attachments."
          }
        ],
        codingChallenges: [
          {
            title: "Terraform Resource Definer",
            description: "Complete a Terraform block that provisions an auto-scaling group bound to a target group port 80.",
            starterCode: "resource \"aws_autoscaling_group\" \"web\" {\n  # Insert auto-scaling setup\n}",
            language: "hcl"
          }
        ],
        knowledgeChecks: [
          {
            question: "Which AWS service provides resizable compute capacity in the cloud?",
            options: ["Amazon S3", "Amazon EC2", "Amazon RDS", "Amazon VPC"],
            answerIndex: 1,
            explanation: "Amazon Elastic Compute Cloud (EC2) provides secure, resizable Virtual Machines (compute capacity) in the AWS Cloud."
          }
        ],
        moduleQuizzes: [
          {
            question: "What is the primary role of an AWS Internet Gateway?",
            options: [
              "Routing traffic inside a private subnet only",
              "Allowing external communication between VPC assets and the wide web",
              "Encrypting backup data pools",
              "Managing user password lifespans"
            ],
            answerIndex: 1,
            explanation: "An Internet Gateway (IGW) enables bidirectional routing between resources in public subnets and the internet."
          }
        ],
        practicalAssignments: {
          title: "Cloud Infrastructure Budgeting and Cost Analysis",
          prompt: "Draft an enterprise cost proposal for migrating a local cluster of 10 virtual servers into AWS Cloud.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Global Scalable Web Application Infrastructure Portfolio",
          instructions: "Plan and script a multi-tier AWS infrastructure using Terraform. It must instantiate a load-balanced set of web VMs running inside private subnets, storing persistent uploads on S3 with CDN distribution.",
          requirements: [
            "Submit a fully valid, syntax-checked main.tf configuration.",
            "Design highly available networks spanning at least two AZs.",
            "Establish strict security group access bounds."
          ]
        },
        finalAssessment: [
          {
            question: "What is the core function of a CDN service like Amazon CloudFront?",
            options: ["Increasing processor clocks", "Caching web media content closer to global end-users", "Database indexing", "Compiling programming scripts"],
            answerIndex: 1,
            explanation: "A Content Delivery Network (CDN) caches static media and files at global edge locations, lowering retrieval latency for users."
          }
        ],
        suggestedNextCourse: { id: "CERT-AWS-CCP", name: "AWS Certified Cloud Practitioner Exam Prep" }
      }
    ]
  },
  {
    name: "🎓 Certification Preparation",
    description: "Intense, structured preparation bootcamps for industry-leading computer, network, and security certifications.",
    courses: [
      {
        id: "CERT-SECPLUS",
        name: "CompTIA Security+ (SY0-701) Prep",
        category: "Security Certification",
        durationWeeks: 8,
        totalFees: 15000,
        duration: "8 Weeks",
        description: "Comprehensive exam-focused bootcamp preparing candidates to pass the official CompTIA Security+ examination.",
        prerequisites: ["Introduction to Cybersecurity", "Linux Administration"],
        objectives: [
          "Understand all five core domains of the SY0-701 exam blueprint",
          "Differentiate complex cryptography models, access protocols, and network vectors",
          "Explain security governance, threat indicators, risk compliance, and recovery steps",
          "Master mock performance-based questions (PBQs)"
        ],
        readingMaterials: [
          {
            title: "Governance, Risk, and Incident Response Management",
            content: "Governance establishes the enterprise security roadmap. Risk is calculated as Risk = Threat x Vulnerability x Asset Value. Incident response is managed through: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Lessons Learned."
          }
        ],
        downloadableResources: [
          { title: "Security+ Official Domain Study Guide", filename: "security_prep_guide.pdf", size: "3.2 MB", link: "#" },
          { title: "Security+ Key Ports & Protocols Reference", filename: "security_ports.pdf", size: "1.1 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Security Log Forensic Analysis",
            description: "Analyze a corporate firewall packet log to detect a brute-force SSH infiltration pattern.",
            instructions: "Identify malicious IPs, count connection attempts, and write an iptables command blocking the attacker."
          }
        ],
        codingChallenges: [
          {
            title: "IP Address Checker",
            description: "Write a function to validate if an incoming packet source string is a valid IPv4 address in CIDR format.",
            starterCode: "def validate_cidr(cidr_str):\n    # Return true if string matches standard CIDR IPv4 structures\n    return False",
            language: "python"
          }
        ],
        knowledgeChecks: [
          {
            question: "Which port is traditionally utilized by secure LDAPS connection requests?",
            options: ["389", "636", "443", "22"],
            answerIndex: 1,
            explanation: "Secure LDAPS communications default to port 636, whereas unencrypted LDAP is bound to port 389."
          }
        ],
        moduleQuizzes: [
          {
            question: "What does RTO stand for in disaster recovery scenarios?",
            options: ["Recovery Time Objective", "Routing Transit Organization", "Risk Transfer Oversight", "Remediation Task Order"],
            answerIndex: 0,
            explanation: "RTO stands for Recovery Time Objective: the maximum tolerable duration of system downtime before unacceptable consequences arise."
          }
        ],
        practicalAssignments: {
          title: "Disaster Recovery Strategy",
          prompt: "Draft an enterprise backup and recovery strategy demonstrating multi-site synchronization (Hot, Warm, Cold).",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Enterprise Cybersecurity Governance Portfolio",
          instructions: "Formulate a comprehensive, corporate security policy framework. Include guidelines on BYOD devices, password policies, physical barriers, remote access networks, and incident response matrices.",
          requirements: [
            "Structure clear, standard-compliant (ISO 27001/NIST) policy clauses.",
            "Write a detailed physical security check sheet.",
            "Implement a mock incident handling flowchart."
          ]
        },
        finalAssessment: [
          {
            question: "What is an indicator of compromise (IoC)?",
            options: [
              "A system patch file",
              "A piece of digital forensic data suggesting an active or past compromise",
              "An authorized employee login",
              "A cloud network server backup log"
            ],
            answerIndex: 1,
            explanation: "Indicators of Compromise (IoCs) are forensic remnants (e.g. unknown hashes, strange outward connections) indicating that an endpoint was compromised."
          }
        ],
        suggestedNextCourse: { id: "CERT-CCNA", name: "Cisco Certified Network Associate (CCNA)" }
      },
      {
        id: "CERT-CCNA",
        name: "Cisco Certified Network Associate (CCNA 200-301)",
        category: "Network Certification",
        durationWeeks: 10,
        totalFees: 18000,
        duration: "10 Weeks",
        description: "Rigorous certification prep covering routing, switching, VLAN segmentations, IP subnetting, and Cisco IOS commands.",
        prerequisites: ["Linux Administration"],
        objectives: [
          "Understand the OSI and TCP/IP protocol stack layers",
          "Configure Cisco routers and switches using official IOS CLI commands",
          "Implement complex IPv4 CIDR subnetting and dynamic routing (OSPF)",
          "Configure secure VLANs, trunks, and port security protocols"
        ],
        readingMaterials: [
          {
            title: "Subnetting and VLAN Trunks",
            content: "Classless Inter-Domain Routing (CIDR) optimizes IP space distribution. VLANs segment broadcast domains on switches. Switchports are designated as Access ports (belonging to one VLAN) or Trunk ports (carrying multiple tagged VLAN traffic across IEEE 802.1Q lines)."
          }
        ],
        downloadableResources: [
          { title: "Cisco IOS CLI Cheat Sheet", filename: "cisco_ios_cheatsheet.pdf", size: "1.6 MB", link: "#" },
          { title: "Subnetting Practice Workbook", filename: "subnetting_workbook.pdf", size: "2.5 MB", link: "#" }
        ],
        handsOnLabs: [
          {
            title: "Cisco Switch VLAN Routing",
            description: "Configure inter-VLAN routing on a simulated Cisco switch using router-on-a-stick topology.",
            instructions: "Create VLAN 10 and VLAN 20 on the switch, assign ports, and configure subinterfaces on the router."
          }
        ],
        codingChallenges: [
          {
            title: "IP Subnet Mask Calculator",
            description: "Write a function that accepts an IP address and a slash notation suffix, then calculates the network address.",
            starterCode: "def get_network_address(ip, mask_bits):\n    # Return the network address string\n    return \"\"",
            language: "python"
          }
        ],
        knowledgeChecks: [
          {
            question: "Which layer of the OSI model does a router operate on?",
            options: ["Layer 1 - Physical", "Layer 2 - Data Link", "Layer 3 - Network", "Layer 4 - Transport"],
            answerIndex: 2,
            explanation: "Routers operate on Layer 3 (Network) of the OSI model, routing packets based on IP addresses."
          }
        ],
        moduleQuizzes: [
          {
            question: "What is the administrative distance of OSPF?",
            options: ["90", "110", "120", "200"],
            answerIndex: 1,
            explanation: "The default Administrative Distance (AD) for Open Shortest Path First (OSPF) routing protocol is 110."
          }
        ],
        practicalAssignments: {
          title: "IP Addressing Allocation Scheme",
          prompt: "Design an IP subnet allocation plan for a corporate headquarters with 4 departments containing 50, 20, 10, and 5 hosts.",
          maxScore: 100
        },
        finalCapstoneProject: {
          title: "Enterprise Branch Network Design Case Study",
          instructions: "Formulate a multi-site enterprise network layout. Include VLAN allocations, OSPF areas, NAT translations for internet access, and switch port-security configurations.",
          requirements: [
            "Provide switch and router configuration scripts.",
            "Implement a secure subnetting schema.",
            "Write a security mitigation guide against DHCP spoofing."
          ]
        },
        finalAssessment: [
          {
            question: "What does ARP do?",
            options: [
              "Maps IP addresses to MAC addresses",
              "Routes traffic across wide area networks",
              "Resolves domain names to IP addresses",
              "Assigns dynamic IP addresses to endpoints"
            ],
            answerIndex: 0,
            explanation: "Address Resolution Protocol (ARP) resolves IPv4 Layer 3 addresses into physical Layer 2 MAC addresses."
          }
        ],
        suggestedNextCourse: { id: "CERT-CISSP", name: "CISSP Conceptual Masterclass" }
      }
    ]
  }
];

export const ALL_COURSES_FROM_CATALOG: Course[] = [];

CATALOG_SCHOOLS.forEach((school) => {
  school.courses.forEach((c) => {
    // Cast to standard Course structure
    const mapped: Course = {
      id: c.id,
      name: c.name,
      description: c.description,
      category: `${school.name.replace(/[^a-zA-Z0-9\s🛡️💻🌐🐧☁🎓]/g, "").trim()} - ${c.category}`,
      durationWeeks: c.durationWeeks,
      totalFees: c.totalFees,
      duration: c.duration,
      instructorName: "Enock Omato",
      modules: [
        {
          id: "MOD-1",
          title: "Syllabus Overview & Deep Dive Fundamentals",
          lessons: [
            { id: `${c.id}-L1`, title: `${c.name} - Professional Orientation`, type: "text", content: `Welcome to ${c.name} at EnoTech Academy!\n\nOverview:\n${c.description}\n\nObjectives:\n${c.objectives.map((o, idx) => `${idx + 1}. ${o}`).join("\n")}` },
            { id: `${c.id}-L2`, title: `Prerequisites, Setup, and Syllabus Checklist`, type: "text", content: `Prerequisites required for this certification/track:\n${c.prerequisites.join(", ")}\n\nReview the reading materials and labs attached to start your journey.` }
          ]
        },
        {
          id: "MOD-2",
          title: "Core Practical Foundations & Interactive Lessons",
          lessons: [
            { id: `${c.id}-L3`, title: `Syllabus Reading: ${c.readingMaterials[0].title}`, type: "text", content: c.readingMaterials[0].content },
            { id: `${c.id}-L4`, title: `Interactive Sandbox Lab: ${c.handsOnLabs[0].title}`, type: "text", content: `${c.handsOnLabs[0].description}\n\nInstructions:\n${c.handsOnLabs[0].instructions}` }
          ]
        }
      ]
    };
    ALL_COURSES_FROM_CATALOG.push(mapped);
  });
});
