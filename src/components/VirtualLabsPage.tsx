/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * EnoTech Academy Virtual Laboratories & AI Content Studio Module.
 * Offline-First interactive sandboxed environments.
 */

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Shield,
  Network,
  Database as DbIcon,
  Code,
  Sparkles,
  Play,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  BookOpen,
  Award,
  Search,
  Sliders,
  Tv,
  FileText,
  Clock,
  Eye,
  FileCode,
  ShieldAlert,
  Fingerprint,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import InteractivePlayground from "./InteractivePlayground";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface LabStats {
  labHours: number;
  completedTasks: number;
  averageAccuracy: number;
  activeBadges: string[];
}

interface ScenarioStep {
  title: string;
  description: string;
  command: string;
  explanation: string;
  simulatedOutput: string[];
}

interface CyberScenario {
  id: string;
  name: string;
  vulnerability: string;
  targetUrl: string;
  targetIp: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tools: string[];
  steps: ScenarioStep[];
}

const CYBER_SCENARIOS: CyberScenario[] = [
  {
    id: "sql-injection",
    name: "SQL Injection Exploitation & Defense",
    vulnerability: "Unsanitized Query Concatenation (SQLi)",
    targetUrl: "target-bank.local",
    targetIp: "10.10.12.34",
    difficulty: "Medium",
    tools: ["Nmap", "Sqlmap"],
    steps: [
      {
        title: "Reconnaissance: Web Port Identification",
        description: "Let's perform a fast service identification scan using Nmap to confirm HTTP services are running on the target.",
        command: "nmap -sV target-bank.local",
        explanation: "Nmap successfully scanned the target-bank.local domain, identifying port 80/tcp open and running Apache web server version 2.4.41. This confirms there is an active web application hosting the login interface.",
        simulatedOutput: [
          "Starting Nmap 7.92 ( https://nmap.org ) at 2026-07-08 02:47",
          "Nmap scan report for target-bank.local (10.10.12.34)",
          "Host is up (0.00015s latency).",
          "PORT   STATE SERVICE VERSION",
          "80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))",
          "Service info: OS: Linux; CPE: cpe:/o:linux:linux_kernel",
          "",
          "Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .",
          "Nmap done: 1 IP address (1 host up) scanned in 0.95 seconds"
        ]
      },
      {
        title: "Vulnerability Scanning: probing for injection",
        description: "Use sqlmap to probe the parameters of target-bank's login URL to see if input parameters are directly parsed as query components.",
        command: "sqlmap -u \"http://target-bank.local/login.php?user=admin\" --dbs",
        explanation: "Sqlmap confirmed the parameter 'user' is highly vulnerable to Union-Based and Error-Based SQL injection. It successfully bypassed standard string gates and listed the databases: 'information_schema' (internal) and 'bank_users' (custom data).",
        simulatedOutput: [
          "___",
          "__H__",
          "[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal...",
          "",
          "[*] starting at 02:48:15",
          "",
          "[INFO] testing connection to the target URL",
          "[INFO] testing if HTTP parameter 'user' is dynamic",
          "[INFO] heuristic test shows that HTTP parameter 'user' might be vulnerable to SQL injection",
          "[INFO] testing for SQL injection on HTTP parameter 'user'",
          "[INFO] target URL appears to be vulnerable to UNION query SQL injection",
          "parameter 'user' is vulnerable. Do you want to keep testing others? [y/N] n",
          "",
          "available databases [2]:",
          "[*] bank_users",
          "[*] information_schema"
        ]
      },
      {
        title: "Exploitation: Dumping sensitive database accounts",
        description: "Use sqlmap's dump feature to extract credentials from the accounts table inside the bank_users database.",
        command: "sqlmap -u \"http://target-bank.local/login.php?user=admin\" -D bank_users -T accounts --dump",
        explanation: "The database has been breached. By leveraging SQL Injection, we bypassed authorization completely, dumping cleartext account rows, admin hash signatures, and bank balances. We see the admin password hash and an incredible balance of $9,430,221.00.",
        simulatedOutput: [
          "[INFO] fetching tables for database: 'bank_users'",
          "[INFO] fetching columns for table 'accounts' in database 'bank_users'",
          "[INFO] retrieving entries for table 'accounts'",
          "Database: bank_users",
          "Table: accounts",
          "+----+-----------+------------------------------------+------------------+",
          "| id | username  | password_hash                      | account_balance  |",
          "+----+-----------+------------------------------------+------------------+",
          "| 1  | admin     | $2y$10$8CgU3fKqI9p/xPZreMv5He87Q   | $9,430,221.00    |",
          "| 2  | eomato    | $2y$10$gO2WbH9xIq2304ZLaP47Ue10o   | $15,000.00       |",
          "+----+-----------+------------------------------------+------------------+",
          "[INFO] table 'bank_users.accounts' dumped to CSV file",
          "",
          "Exploitation phase completed successfully!"
        ]
      },
      {
        title: "Defensive Action: Code Remediation (Patch)",
        description: "To fix this vulnerability, we must patch the PHP script to use Parameterized Prepared Statements instead of raw SQL concatenation. Run the 'patch-sql' command.",
        command: "patch-sql",
        explanation: "Prepared Statements isolate raw user inputs from SQL executable instructions, fully rendering SQL injection impossible. The source code on target-bank.local has been securely updated.",
        simulatedOutput: [
          "[SYS_CONFIG] Applying secure code patch on /var/www/target-bank/login.php...",
          "[ORIGINAL CODE]:",
          "   $sql = \"SELECT * FROM accounts WHERE username = '\" . $user . \"'\";",
          "[PATCHED CODE IMPLEMENTED]:",
          "   $stmt = $pdo->prepare('SELECT * FROM accounts WHERE username = :user');",
          "   $stmt->execute(['user' => $user]);",
          "",
          "[SUCCESS] Code patch applied! Rebuilding target-bank.local database gateway..."
        ]
      },
      {
        title: "Verification: Testing Security Hardening",
        description: "Run the sqlmap scan once again to verify that our Prepared Statement patch blocks any SQL injection payloads.",
        command: "sqlmap -u \"http://target-bank.local/login.php?user=admin\" --dbs",
        explanation: "Success! Sqlmap reports that the target parameter is no longer dynamic or injectable. The vulnerability is fully patched, and target-bank.local is safe from SQL injection attacks.",
        simulatedOutput: [
          "[INFO] testing connection to the target URL",
          "[INFO] testing if HTTP parameter 'user' is dynamic",
          "[WARNING] HTTP parameter 'user' does not appear to be dynamic",
          "[WARNING] heuristic test shows that HTTP parameter 'user' might not be vulnerable",
          "[ERROR] all tested parameters do not appear to be injectable.",
          "",
          "Verdict: target-bank.local is SECURED and resistant to SQL injection."
        ]
      }
    ]
  },
  {
    id: "brute-force",
    name: "Corporate Brute Force & Account Lockouts",
    vulnerability: "No Rate Limiting & Weak Default Credentials",
    targetUrl: "corp-portal.local",
    targetIp: "10.10.12.89",
    difficulty: "Easy",
    tools: ["Nmap", "Hydra"],
    steps: [
      {
        title: "Reconnaissance: Port Discovery",
        description: "Scan the corporate portal with Nmap to see what access portals are available.",
        command: "nmap corp-portal.local",
        explanation: "Nmap discovered three open TCP ports: SSH (22), HTTP (80), and HTTP-PROXY (8080). We can focus on the port 80 HTTP login portal.",
        simulatedOutput: [
          "Starting Nmap 7.92 ( https://nmap.org ) at 2026-07-08 02:49",
          "Nmap scan report for corp-portal.local (10.10.12.89)",
          "Host is up (0.00018s latency).",
          "PORT     STATE SERVICE",
          "22/tcp   open  ssh",
          "80/tcp   open  http",
          "8080/tcp open  http-proxy",
          "",
          "Nmap done: 1 IP address (1 host up) scanned in 0.85 seconds"
        ]
      },
      {
        title: "Exploitation: Dictionary Brute Force",
        description: "Use THC-Hydra to crack the 'admin' account password using an offline password dictionary list.",
        command: "hydra -l admin -P passwords.txt corp-portal.local http-post-form",
        explanation: "Because there is no rate limiting, Hydra rapidly verified 500 credentials in seconds, identifying a weak administrator credential: admin / enotech_super.",
        simulatedOutput: [
          "Hydra v9.2 (c) 2026 by van Hauser/THC - for legal purposes only",
          "Hydra started on corp-portal.local (10.10.12.89) with 16 threads",
          "[DATA] attacking http-post-form on port 80",
          "[STATUS] 100 tries per minute, 16 threads, 500 common passwords loaded",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: admin  - Failed",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: password123  - Failed",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: enotech_super  - SUCCESS",
          "1 of 1 target successfully completed, 1 valid credential found",
          "Hydra finished. Valid login: admin / enotech_super"
        ]
      },
      {
        title: "Defensive Action: Implement Rate Limiting",
        description: "Enforce strict Express/Node rate-limit security logic to block consecutive failed login requests from an IP. Run the 'patch-brute' command.",
        command: "patch-brute",
        explanation: "Rate Limiters and account lockout policies protect applications by limiting the number of login requests, rendering high-velocity brute force attacks completely ineffective.",
        simulatedOutput: [
          "[SYS_CONFIG] Injecting rate limiter middleware to corp-portal authorization routes...",
          "[INJECTING]  express-rate-limit logic on /api/login endpoints...",
          "   max: 5 failed login attempts per 15 minutes.",
          "   lockout: IP locked out for 24 hours on consecutive abuse.",
          "",
          "[SUCCESS] Rate limiting and account lockouts are now fully enforced!"
        ]
      },
      {
        title: "Verification: Testing Lockout Integrity",
        description: "Run the Hydra password attack again to confirm that the server now locks out brute force requests.",
        command: "hydra -l admin -P passwords.txt corp-portal.local http-post-form",
        explanation: "Awesome! The brute-force protection intercepted Hydra on its 4th attempt. The server responded with '429 Too Many Requests', locking out the intruder. The system is secure!",
        simulatedOutput: [
          "Hydra v9.2 started on corp-portal.local (10.10.12.89)",
          "[DATA] attacking http-post-form on port 80",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: admin  - Failed",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: password123  - Failed",
          "[80][http-post-form] host: corp-portal.local  login: admin  password: 123456  - Failed",
          "[80][http-post-form] [ERROR] HTTP/1.1 429 Too Many Requests - IP Locked Out.",
          "[80][http-post-form] [ERROR] Security Warning: Connection blocked by firewall rules.",
          "",
          "Verdict: corp-portal.local is SECURED and resistant to automated login cracking."
        ]
      }
    ]
  },
  {
    id: "command-injection",
    name: "API Command Injection & Input Whitelisting",
    vulnerability: "Direct System Command Shell Execution",
    targetUrl: "api-gateway.local",
    targetIp: "10.10.15.110",
    difficulty: "Hard",
    tools: ["Curl"],
    steps: [
      {
        title: "Reconnaissance: Probing API inputs",
        description: "Inspect how the API processes network commands by sending a ping parameter query with curl.",
        command: "curl http://api-gateway.local/ping?ip=127.0.0.1",
        explanation: "The API endpoint evaluates the input ip address and returns a standard ping result, hinting that it runs an underlying system command.",
        simulatedOutput: [
          "HTTP/1.1 200 OK",
          "Content-Type: text/plain",
          "",
          "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.",
          "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms",
          "--- 127.0.0.1 ping statistics ---",
          "1 packets transmitted, 1 received, 0% packet loss"
        ]
      },
      {
        title: "Exploitation: Command Injection",
        description: "Inject a shell control command delimiter (semicolon ;) followed by a cat command to read target configuration passwords.",
        command: "curl \"http://api-gateway.local/ping?ip=127.0.0.1;cat+/etc/passwd\"",
        explanation: "Critical vulnerability found! The API server directly concatenated user inputs with shell processes, allowing us to execute arbitrary commands and retrieve /etc/passwd contents.",
        simulatedOutput: [
          "HTTP/1.1 200 OK",
          "Content-Type: text/plain",
          "",
          "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.",
          "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms",
          "--- 127.0.0.1 ping statistics ---",
          "1 packets transmitted, 1 received, 0% packet loss",
          "",
          "root:x:0:0:root:/root:/bin/bash",
          "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
          "bin:x:2:2:bin:/bin:/usr/sbin/nologin",
          "sys:x:3:3:sys:/dev:/usr/sbin/nologin",
          "enotech_admin:x:1000:1000:Enock Omato,,,:/home/enotech_admin:/bin/bash",
          "",
          "[SUCCESS] Exploitation successful: Leaked user databases and file structures!"
        ]
      },
      {
        title: "Defensive Action: Enforce Input Sanitization",
        description: "Apply strict whitelisting to block system metacharacters (; & | $ `) and enforce a valid IPv4 pattern check. Run the 'patch-api' command.",
        command: "patch-api",
        explanation: "Input Whitelisting blocks any dynamic character payload that does not match strict formats, ensuring zero execution of injected shell arguments.",
        simulatedOutput: [
          "[SYS_CONFIG] Securing /api/ping input parameter parsing...",
          "[ENFORCING]  IPv4 Regex Filter Whitelist: ^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$",
          "[BLOCKING]   Metacharacters: ;, &, |, $, `, \n",
          "",
          "[SUCCESS] Whitelist filtering deployed. Shell injection threats terminated!"
        ]
      },
      {
        title: "Verification: Verifying input defense sanitization",
        description: "Resend the payload. Verify that input control blocks arbitrary commands.",
        command: "curl \"http://api-gateway.local/ping?ip=127.0.0.1;cat+/etc/passwd\"",
        explanation: "Superb! The API gateway detected invalid characters, returned a '400 Bad Request', and safely aborted command compilation. The gateway is completely secured!",
        simulatedOutput: [
          "HTTP/1.1 400 Bad Request",
          "Content-Type: application/json",
          "",
          "{",
          "  \"status\": \"error\",",
          "  \"message\": \"Security Alert: Invalid input characters detected. Operation terminated.\"",
          "}",
          "",
          "Verdict: api-gateway.local is SECURED and resistant to command injection."
        ]
      }
    ]
  }
];

export default function VirtualLabsPage({ darkMode = true }: { darkMode?: boolean }) {
  const [activeLab, setActiveLab] = useState<
    "programming" | "database" | "networking" | "cybersecurity" | "linux" | "ai-studio" | "assessments"
  >("programming");

  // Local Lab state & metrics for Learning Results Engine
  const [stats, setStats] = useState<LabStats>({
    labHours: 18.5,
    completedTasks: 12,
    averageAccuracy: 94.2,
    activeBadges: ["Script Master", "DB Admin", "Hacker Safe", "Root Terminal"]
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Trigger feedback logs inside the laboratory
  const [labLogs, setLabLogs] = useState<string[]>([
    "System: Virtual Lab Environment initialized.",
    "Network: Routing tables synchronized (Offline Cache).",
    "Security: Sandbox isolation active (Docker-mock sandbox level 3)."
  ]);

  const addLabLog = (msg: string) => {
    setLabLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  // ==========================================
  // 1. DATABASE LAB STATE
  // ==========================================
  const [dbLessonIdx, setDbLessonIdx] = useState(0);
  const [dbSqlQuery, setDbSqlQuery] = useState(
    `CREATE TABLE students_records (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  grade INTEGER,\n  enrolled_date DATE\n);\n\nINSERT INTO students_records (name, grade, enrolled_date) VALUES\n('Enock Omato', 98, '2026-01-15'),\n('Mercy Chepkoech', 92, '2026-02-10');\n\nSELECT * FROM students_records;`
  );
  const [dbConsoleOutput, setDbConsoleOutput] = useState<string[]>([]);
  const [dbResultSchema, setDbResultSchema] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [isDbRunning, setIsDbRunning] = useState(false);

  const dbLessons = [
    {
      title: "Introduction to Relational DDL (Data Definition)",
      objective: "Create a table and insert critical student rows offline.",
      instructions: "Execute the DDL block below to instantiate a local SQLite node memory catalog.",
      defaultQuery: `CREATE TABLE students_records (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  grade INTEGER,\n  enrolled_date DATE\n);\n\nINSERT INTO students_records (name, grade, enrolled_date) VALUES\n('Enock Omato', 98, '2026-01-15'),\n('Mercy Chepkoech', 92, '2026-02-10');\n\nSELECT * FROM students_records;`
    },
    {
      title: "Data Query Filter Operations & Aggregates",
      objective: "Select students who scored above 95 to verify certificate triggers.",
      instructions: "Modify the select filter query with a WHERE clause constraint.",
      defaultQuery: `SELECT name, grade, enrolled_date\nFROM students_records\nWHERE grade >= 95;`
    }
  ];

  const handleRunDbLab = () => {
    setIsDbRunning(true);
    addLabLog("Database: Commencing local SQL transaction execution...");
    
    setTimeout(() => {
      setIsDbRunning(false);
      const isSelectAll = dbSqlQuery.toLowerCase().includes("select *");
      const isCreate = dbSqlQuery.toLowerCase().includes("create table");
      
      if (isCreate && isSelectAll) {
        setDbResultSchema({
          columns: ["id", "name", "grade", "enrolled_date"],
          rows: [
            { id: 1, name: "Enock Omato", grade: 98, enrolled_date: "2026-01-15" },
            { id: 2, name: "Mercy Chepkoech", grade: 92, enrolled_date: "2026-02-10" }
          ]
        });
        setDbConsoleOutput([
          "CREATE TABLE students_records [SUCCESS]",
          "INSERT INTO students_records (2 rows affected) [SUCCESS]",
          "SELECT * FROM students_records -> 2 rows retrieved."
        ]);
        addLabLog("Database: Successfully compiled DDL schemas and fetched records.");
        setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1, averageAccuracy: Math.min(100, prev.averageAccuracy + 0.5) }));
      } else {
        // Query filter response
        setDbResultSchema({
          columns: ["name", "grade", "enrolled_date"],
          rows: [
            { name: "Enock Omato", grade: 98, enrolled_date: "2026-01-15" }
          ]
        });
        setDbConsoleOutput([
          "SELECT name, grade, enrolled_date FROM students_records WHERE grade >= 95 -> 1 row retrieved."
        ]);
        addLabLog("Database: SELECT aggregation parsed.");
      }
    }, 850);
  };

  // ==========================================
  // 2. NETWORKING LAB STATE
  // ==========================================
  const [networkHops, setNetworkHops] = useState<{ name: string; ip: string; status: string; delay: string }[]>([
    { name: "Local Workstation Gateway", ip: "192.168.1.1", status: "Active", delay: "1ms" },
    { name: "EnoTech Core Switch", ip: "10.0.1.254", status: "Active", delay: "2ms" },
    { name: "Autonomous Local DNS Resolver", ip: "10.0.1.10", status: "Active", delay: "4ms" },
    { name: "Mock Cloud Router Node", ip: "172.16.4.1", status: "Standby", delay: "--" }
  ]);
  const [isTracing, setIsTracing] = useState(false);
  const [subnetAddress, setSubnetAddress] = useState("192.168.1.0");
  const [subnetMask, setSubnetMask] = useState("/24");
  const [subnetOutput, setSubnetOutput] = useState<{ hosts: number; firstIp: string; lastIp: string; broadcast: string } | null>(null);

  const calculateSubnet = () => {
    addLabLog(`Networking: Simulating local subnet calculations for ${subnetAddress}${subnetMask}`);
    if (subnetMask === "/24") {
      setSubnetOutput({
        hosts: 254,
        firstIp: "192.168.1.1",
        lastIp: "192.168.1.254",
        broadcast: "192.168.1.255"
      });
    } else if (subnetMask === "/26") {
      setSubnetOutput({
        hosts: 62,
        firstIp: "192.168.1.1",
        lastIp: "192.168.1.62",
        broadcast: "192.168.1.63"
      });
    } else {
      setSubnetOutput({
        hosts: 14,
        firstIp: "192.168.1.1",
        lastIp: "192.168.1.14",
        broadcast: "192.168.1.15"
      });
    }
    setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1 }));
    addLabLog("Networking: Local subnet lookup calculation compiled.");
  };

  const handleTraceRoute = () => {
    setIsTracing(true);
    addLabLog("Networking: Tracing ICMP packet routing paths locally...");
    
    // Animate traces
    setTimeout(() => {
      setNetworkHops((prev) =>
        prev.map((hop) =>
          hop.name.includes("Cloud Router")
            ? { ...hop, status: "Active", delay: "12ms" }
            : hop
        )
      );
      setIsTracing(false);
      addLabLog("Networking: ICMP Route trace successfully established.");
    }, 1200);
  };

  // ==========================================
  // 3. CYBERSECURITY LAB STATE
  // ==========================================
  const [cyberPlaintext, setCyberPlaintext] = useState("EnotechSecureAdmin101");
  const [cyberSalt, setCyberSalt] = useState("salt_KSh2026");
  const [cyberHashes, setCyberHashes] = useState({ md5: "", sha256: "", saltedSha256: "" });
  const [crackTimer, setCrackTimer] = useState(false);
  const [crackResults, setCrackResults] = useState<string[]>([]);

  const generateCryptographicHashes = () => {
    addLabLog("Cybersecurity: Initializing cryptographic engines...");
    
    // Simulating deterministic mock hashing output strings
    const mockHashMD5 = "d54d2dc8c86d88c2278cb7cf2a33f4a4";
    const mockHashSHA256 = "6f4414ec7a53c3065a7f92026e6328a6fdfb5eb7bf2069e223c683b547842da2";
    const mockHashSalted = "15982ef2b0124ad0c102a0a2dfd6a2f77894a48cdbf0e386ba11ee36da90013b";
    
    setCyberHashes({
      md5: mockHashMD5,
      sha256: mockHashSHA256,
      saltedSha256: mockHashSalted
    });
    addLabLog("Cybersecurity: MD5, SHA-256 and custom Salted Encryption compiled.");
  };

  const simulateBruteForce = () => {
    setCrackTimer(true);
    setCrackResults(["System: Commencing offline dictionary crack attack...", "Checking 10,000 common passwords..."]);
    addLabLog("Cybersecurity: Starting dictionary password evaluation sandbox.");
    
    setTimeout(() => {
      setCrackTimer(false);
      setCrackResults((prev) => [
        ...prev,
        "Scanning dictionary values: MATCH FOUND!",
        `Candidate password: "${cyberPlaintext}" is highly vulnerable.`,
        "Entropy: 42 bits (Weak). Recommended: Use multi-byte Special symbols."
      ]);
      addLabLog("Cybersecurity: Brute-force credentials simulation complete.");
      setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1 }));
    }, 1500);
  };

  // ==========================================
  // 4. LINUX & CYBER DEFENSE LAB STATE
  // ==========================================
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [securedScenarios, setSecuredScenarios] = useState<Record<string, boolean>>({});
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string>("");
  const [lastExecutedOutput, setLastExecutedOutput] = useState<string[]>([]);
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "EnoTech Cyber Range Terminal Interface v2.5.0",
    "Ready for simulation protocols. Select a target scenario above to start.",
    "Type 'help' for standard Linux shell diagnostics.",
    ""
  ]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCommand.trim()) return;

    const rawCommand = terminalCommand.trim();
    const cmd = rawCommand.toLowerCase().replace(/\s+/g, ' ');
    const output: string[] = [`enotech@root:~$ ${rawCommand}`];

    // Get current step command for current scenario
    const currentScenario = CYBER_SCENARIOS[selectedScenarioIdx];
    const currentStep = currentScenario.steps[currentStepIdx];
    const cleanExpected = currentStep.command.toLowerCase().replace(/\s+/g, ' ');

    // Check if entered command matches the expected step command (or some easy alias)
    if (cmd === cleanExpected) {
      // It matches! Put the simulated output
      output.push(...currentStep.simulatedOutput);
      
      setLastExecutedCommand(rawCommand);
      setLastExecutedOutput(currentStep.simulatedOutput);

      addLabLog(`Cyber Range: Step ${currentStepIdx + 1} completed on ${currentScenario.targetUrl}`);

      // If it's the last step, mark scenario as secured!
      if (currentStepIdx === currentScenario.steps.length - 1) {
        setSecuredScenarios(prev => ({ ...prev, [currentScenario.id]: true }));
        addLabLog(`Security range success: Fully SECURED ${currentScenario.targetUrl}!`);
        
        // Update user lab stats
        setStats(prev => {
          const isAlreadySecured = securedScenarios[currentScenario.id];
          const newCompletedCount = isAlreadySecured ? prev.completedTasks : prev.completedTasks + 1;
          const newAccuracy = Math.min(100, prev.averageAccuracy + 1.2);
          const newBadges = [...prev.activeBadges];
          if (!newBadges.includes("Cyber Sentinel") && newCompletedCount >= 13) {
            newBadges.push("Cyber Sentinel");
          }
          return {
            ...prev,
            completedTasks: newCompletedCount,
            averageAccuracy: parseFloat(newAccuracy.toFixed(1)),
            activeBadges: newBadges
          };
        });
      } else {
        // Advance to next step automatically
        setCurrentStepIdx(prev => prev + 1);
      }
    } else {
      // General commands support
      if (cmd === "help") {
        output.push(
          "EnoTech Cyber Range Terminal Interface. Commands:",
          "  help               - View general terminal help manual.",
          "  ls                 - List files in current sandbox path.",
          "  pwd                - Display current active directory.",
          "  whoami             - Show current user shell contexts.",
          "  ping <ip/host>     - Ping system gateways.",
          "  clear              - Clear terminal terminal buffer history.",
          "",
          "Cyber Range guided command for active step:",
          `  ${currentStep.command}`
        );
      } else if (cmd === "ls") {
        output.push("cyber_range_secrets.env  vulnerability_audit.report  passwords.txt  exploit_payloads/");
      } else if (cmd === "pwd") {
        output.push("/var/lib/enotech_cyber_range/sandbox");
      } else if (cmd === "whoami") {
        output.push("root (Cybersecurity Specialist Sandbox Context)");
      } else if (cmd === "clear") {
        setTerminalHistory([]);
        setTerminalCommand("");
        return;
      } else if (cmd.startsWith("ping")) {
        const parts = cmd.split(" ");
        const target = parts[1] || "127.0.0.1";
        output.push(
          `PING ${target} (${target}) 56(84) bytes of data.`,
          `64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.08 ms`,
          `64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.07 ms`,
          `--- ${target} ping statistics ---`,
          "2 packets transmitted, 2 received, 0% packet loss, time 1002ms"
        );
      } else {
        // Check if user is typing a command for another step in this scenario to provide a friendly hint
        const anyStepIdx = currentScenario.steps.findIndex(st => st.command.toLowerCase().replace(/\s+/g, ' ') === cmd);
        if (anyStepIdx !== -1) {
          output.push(
            `[HINT]: That command is valid for Step ${anyStepIdx + 1} ("${currentScenario.steps[anyStepIdx].title}").`,
            `Please execute the current step's command first: "${currentStep.command}"`
          );
        } else {
          output.push(
            `bash: ${rawCommand}: command not found in offline sandboxed kernel.`,
            `Please execute the expected guided step command: "${currentStep.command}" or type 'help'.`
          );
        }
      }
    }

    setTerminalHistory((prev) => [...prev, ...output, ""]);
    setTerminalCommand("");
  };

  // ==========================================
  // 5. AI CONTENT STUDIO STATE
  // ==========================================
  const [studioTopic, setStudioTopic] = useState("Introduction to TypeScript interfaces");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<{
    logo: string;
    objectives: string[];
    outline: string[];
    manual: string;
    presentationSlides: string[];
    quiz: string[];
    challenge: string;
    copyright: string;
  } | null>(null);

  const triggerAIContentStudio = () => {
    setIsGeneratingContent(true);
    addLabLog("AI Studio: Activating localized generative engine context...");
    
    setTimeout(() => {
      setIsGeneratingContent(false);
      setGeneratedMaterial({
        logo: "EnoTech Academy 🏆",
        objectives: [
          "Understand typescript strongly-typed variables vs dynamic ones.",
          "Instantiate and implement custom structural interfaces.",
          "Apply schema modeling to represent student logs."
        ],
        outline: [
          "Module 1: What is Type Safety?",
          "Module 2: Defining TypeScript interfaces",
          "Module 3: Code Compilation and Transpiling checks"
        ],
        manual: `EnoTech Study Handbook: A deep-dive manual guiding students through the foundational concepts of typing. Strongly typed structures completely bypass standard compilation bugs before code execution starts. Ensure that interface keys are strictly adhered to in active modules.`,
        presentationSlides: [
          "Slide 1: EnoTech Academy - Welcome to TypeScript Types & Interfaces!",
          "Slide 2: Interfaces enforce structural shapes without runtime overhead.",
          "Slide 3: Code demonstration - implementing IPayments and IStudents interfaces."
        ],
        quiz: [
          "Q1: What keyword defines an interface? (Answer: interface)",
          "Q2: Does typescript compile down to javascript? (Answer: Yes)"
        ],
        challenge: "Practice: Re-engineer the InteractivePlayground component's React props structure into a strongly typed interface and test code compilation.",
        copyright: `© ${new Date().getFullYear()} EnoTech Academy. All original training assets are intellectual properties of EnoTech.`
      });
      addLabLog("AI Studio: High-fidelity educational material compiled and saved into local catalog files.");
      setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1 }));
    }, 1600);
  };

  // ==========================================
  // 6. ASSIGNMENTS & EXAMS STATE
  // ==========================================
  const [activeAssessmentTab, setActiveAssessmentTab] = useState<"assignment" | "examination">("assignment");
  const [plagiarismPercent, setPlagiarismPercent] = useState<number | null>(null);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [examProctorLogs, setExamProctorLogs] = useState<string[]>([
    "Proctor AI: Camera and audio telemetry active.",
    "Proctor AI: Standard focus lock secured."
  ]);
  const [proctorViolations, setProctorViolations] = useState(0);

  const runPlagiarismScan = () => {
    setCheckingPlagiarism(true);
    addLabLog("Assessment: Running offline structural plagiarism scanners on file upload...");
    
    setTimeout(() => {
      setCheckingPlagiarism(false);
      const randomPct = Math.floor(Math.random() * 12); // Low plagiarism
      setPlagiarismPercent(randomPct);
      addLabLog(`Assessment: Scan completed successfully. Plagiarism detected: ${randomPct}%`);
    }, 1100);
  };

  const simulateExamsProctoring = () => {
    addLabLog("Exams: Testing automated proctoring AI feedback monitors...");
    setExamProctorLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ALERT: Multiple focus shifts identified! Check student terminal tab state.`,
      ...prev
    ]);
    setProctorViolations((prev) => prev + 1);
  };

  // Auto-run hash generation once on load
  useEffect(() => {
    if (activeLab === "cybersecurity" && !cyberHashes.md5) {
      generateCryptographicHashes();
    }
  }, [activeLab]);

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">EnoTech Academy Laboratory & Content Studios</h2>
          <p className="text-xs text-slate-400">
            Modular learning sandboxes, diagnostic simulators, secure compilers, and AI educational content creators operating offline-first.
          </p>
        </div>

        {/* Central Statistics Dashboard for Laboratories */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-2.5">
          <div className="text-center px-3 border-r border-slate-850">
            <span className="block text-[10px] text-slate-500 font-mono">LAB METRIC HOURS</span>
            <span className="text-xs font-black text-white">{stats.labHours} hrs</span>
          </div>
          <div className="text-center px-3 border-r border-slate-850">
            <span className="block text-[10px] text-slate-500 font-mono">COMPLETED TASKS</span>
            <span className="text-xs font-black text-cyan-400">{stats.completedTasks}</span>
          </div>
          <div className="text-center px-3 border-r border-slate-850">
            <span className="block text-[10px] text-slate-500 font-mono">AVG ACCURACY</span>
            <span className="text-xs font-black text-emerald-500">{stats.averageAccuracy}%</span>
          </div>
          <div className="text-center px-2">
            <span className="block text-[10px] text-slate-500 font-mono">BADGES SECURED</span>
            <span className="text-[10px] font-bold text-orange-400 flex items-center gap-0.5 justify-center">
              <Award className="w-3 h-3" /> {stats.activeBadges.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Laboratories Modules Tabs */}
      <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-lg border border-slate-850 gap-1">
        <button
          onClick={() => { setActiveLab("programming"); addLabLog("Admin: Initializing Programming Sandbox Lab."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "programming" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <Code className="w-4 h-4" /> Programming Lab
        </button>
        <button
          onClick={() => { setActiveLab("database"); addLabLog("Admin: Loading Relational SQLite Sandbox Lab."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "database" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <DbIcon className="w-4 h-4" /> Database Lab
        </button>
        <button
          onClick={() => { setActiveLab("networking"); addLabLog("Admin: Commencing ICMP Network Router Simulator."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "networking" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <Network className="w-4 h-4" /> Networking Lab
        </button>
        <button
          onClick={() => { setActiveLab("cybersecurity"); addLabLog("Admin: Launching Cyber Cryptography Defense Sandbox."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "cybersecurity" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" /> Cybersecurity Lab
        </button>
        <button
          onClick={() => { setActiveLab("linux"); addLabLog("Admin: Booting Linux Bash Terminal simulator."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "linux" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <Terminal className="w-4 h-4" /> Linux Terminal Lab
        </button>
        <button
          onClick={() => { setActiveLab("ai-studio"); addLabLog("Admin: Opening Generative Educational Content workshop."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "ai-studio" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" /> AI Content Studio
        </button>
        <button
          onClick={() => { setActiveLab("assessments"); addLabLog("Admin: Loading Student Exams/Assignments audit workspace."); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
            activeLab === "assessments" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" /> Assignments & Exams
        </button>
      </div>

      {/* Split Window: Laboratory Area (Left) & Real-time Log Feed (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Lab Workspace (Main) */}
        <div className="xl:col-span-3 space-y-4">

          {/* ==========================================
              SUB-TAB 1: PROGRAMMING LABORATORY
              ========================================== */}
          {activeLab === "programming" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Offline Multi-Language Sandbox Editor</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fully operational browser-integrated compilers and script interpreters. Change code and click run to view outcomes. Supported stacks: Python 3, Java 21, SQL, HTML/JS/CSS, and C++.
                </p>
              </div>
              <InteractivePlayground onCompleteTask={(sc) => {
                setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1, averageAccuracy: Math.round((prev.averageAccuracy + sc) / 2 * 10) / 10 }));
                addLabLog(`Programming: Task compiled successfully. Evaluated Score: ${sc}%`);
              }} />
            </div>
          )}

          {/* ==========================================
              SUB-TAB 2: DATABASE LABORATORY
              ========================================== */}
          {activeLab === "database" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Database Syllabus Sidebar */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase">Postgres Database Lessons</span>
                  <div className="space-y-2">
                    {dbLessons.map((les, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDbLessonIdx(idx);
                          setDbSqlQuery(les.defaultQuery);
                          addLabLog(`Database: Loaded lesson - ${les.title}`);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs leading-snug transition-all flex flex-col gap-1 ${
                          dbLessonIdx === idx
                            ? "bg-slate-950 border-cyan-500/30 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="font-extrabold">{les.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{les.objective}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-mono block">SCHEMA VISUALIZATION</span>
                    <div className="p-2 bg-slate-950 rounded border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1">
                      <span className="text-cyan-400 font-bold block">students_records</span>
                      <div>- id (int, PK)</div>
                      <div>- name (varchar)</div>
                      <div>- grade (int)</div>
                      <div>- enrolled_date (date)</div>
                    </div>
                  </div>
                </div>

                {/* Database Query Terminal */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px]">
                  <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                      <DbIcon className="w-4 h-4 text-cyan-400 animate-pulse" /> Active Query Editor
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">SQLite/PostgreSQL Local Engine</span>
                  </div>

                  <div className="flex-1 p-3 bg-slate-950 flex flex-col">
                    <textarea
                      value={dbSqlQuery}
                      onChange={(e) => setDbSqlQuery(e.target.value)}
                      className="flex-1 w-full bg-slate-950 p-2 text-xs font-mono text-slate-200 border-none focus:ring-0 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="bg-slate-950 p-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">Type SELECT query to retrieve rows</span>
                    <button
                      onClick={handleRunDbLab}
                      disabled={isDbRunning}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded text-xs font-black cursor-pointer disabled:opacity-50"
                    >
                      {isDbRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run Query
                    </button>
                  </div>
                </div>
              </div>

              {/* Database Query Tabular Output preview */}
              {dbResultSchema && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase">Query Executions STD_OUT</span>
                  
                  {/* Local log buffer */}
                  <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-slate-400 space-y-1">
                    {dbConsoleOutput.map((l, i) => <div key={i}>{l}</div>)}
                  </div>

                  {/* Schema table */}
                  <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                    <table className="w-full text-left text-[11px] font-mono text-slate-300">
                      <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold uppercase text-cyan-400">
                        <tr>
                          {dbResultSchema.columns.map((col, i) => (
                            <th key={i} className="p-2 border-r border-slate-800">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dbResultSchema.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-850 hover:bg-slate-900/40">
                            {dbResultSchema.columns.map((col, cIdx) => (
                              <td key={cIdx} className="p-2 border-r border-slate-850">{row[col]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              SUB-TAB 3: NETWORKING LABORATORY
              ========================================== */}
          {activeLab === "networking" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Subnet Calculator Interactive Card */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase block">Offline Subnet Simulator</span>
                    <p className="text-xs text-slate-400">Calculate logical subnet boundaries without internet.</p>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-mono block mb-1">NETWORK IP ADDRESS</label>
                        <input
                          type="text"
                          value={subnetAddress}
                          onChange={(e) => setSubnetAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-mono block mb-1">SUBNET PREFIX MASK</label>
                        <select
                          value={subnetMask}
                          onChange={(e) => setSubnetMask(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="/24">/24 (255.255.255.0 - Class C)</option>
                          <option value="/26">/26 (255.255.255.192 - Subdivided)</option>
                          <option value="/28">/28 (255.255.255.240 - Micro)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={calculateSubnet}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded text-xs font-bold transition-all cursor-pointer"
                  >
                    Calculate IP Range
                  </button>
                </div>

                {/* Visual outputs */}
                <div className="lg:col-span-2 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <span className="text-xs font-bold text-white">Calculated Subnet Allocation Node</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-[9px] rounded font-mono font-bold uppercase">Ready</span>
                  </div>

                  {subnetOutput ? (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 space-y-1">
                        <span className="text-slate-500 text-[10px] block font-mono">USABLE LOCAL HOSTS</span>
                        <span className="text-sm font-black text-white">{subnetOutput.hosts} hosts</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 space-y-1">
                        <span className="text-slate-500 text-[10px] block font-mono">BROADCAST ADDRESS</span>
                        <span className="text-sm font-black text-rose-400 font-mono">{subnetOutput.broadcast}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 space-y-1">
                        <span className="text-slate-500 text-[10px] block font-mono">FIRST ASSIGNABLE IP</span>
                        <span className="text-sm font-black text-cyan-400 font-mono">{subnetOutput.firstIp}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 space-y-1">
                        <span className="text-slate-500 text-[10px] block font-mono">LAST ASSIGNABLE IP</span>
                        <span className="text-sm font-black text-cyan-400 font-mono">{subnetOutput.lastIp}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 italic text-xs">
                      Run calculation to populate subnet telemetry data.
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                    *EnoTech networks utilize non-overlapping Classless Inter-Domain Routing (CIDR) to manage local offline device pools.
                  </div>
                </div>
              </div>

              {/* ICMP Traceroute visual router simulator */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Network className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xs font-bold text-white">ICMP Packet traceroute Router Simulator</h3>
                  </div>
                  <button
                    onClick={handleTraceRoute}
                    disabled={isTracing}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-black cursor-pointer disabled:opacity-50"
                  >
                    {isTracing ? "Sending packets..." : "Traceroute Path"}
                  </button>
                </div>

                {/* Router topology map */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                  {networkHops.map((hop, i) => (
                    <div
                      key={i}
                      className={`p-3 bg-slate-950 border rounded-xl space-y-1 text-xs relative ${
                        hop.status === "Active" ? "border-cyan-500/30" : "border-slate-850"
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 font-mono">HOP #{i + 1}</span>
                      <span className="block font-black text-white truncate">{hop.name}</span>
                      <span className="block font-mono text-cyan-400 text-[10px]">{hop.ip}</span>
                      
                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className={hop.status === "Active" ? "text-emerald-400" : "text-amber-500"}>{hop.status}</span>
                        <span className="text-slate-500 font-mono">{hop.delay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              SUB-TAB 4: CYBERSECURITY LABORATORY
              ========================================== */}
          {activeLab === "cybersecurity" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Hash Cryptography Tool */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase block">Cryptographic Analyzer</span>
                    <p className="text-xs text-slate-400">Experiment with hash calculations & dictionary salting.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block mb-1">RAW PLAINTEXT PASSWORD</label>
                      <input
                        type="text"
                        value={cyberPlaintext}
                        onChange={(e) => setCyberPlaintext(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block mb-1">SALT COMPONENT (OFFLINE EXCLUSIVE)</label>
                      <input
                        type="text"
                        value={cyberSalt}
                        onChange={(e) => setCyberSalt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={generateCryptographicHashes}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded text-xs font-black cursor-pointer"
                  >
                    Generate Cryptographic Hashes
                  </button>

                  {/* Hash outputs */}
                  {cyberHashes.md5 && (
                    <div className="space-y-2 font-mono text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-850 text-slate-300">
                      <div>
                        <span className="text-cyan-400 font-bold block mb-0.5">MD5 COMPRESSED:</span>
                        <span className="text-slate-400 break-all">{cyberHashes.md5}</span>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold block mb-0.5">SHA-256 ENCRYPTED:</span>
                        <span className="text-slate-400 break-all">{cyberHashes.sha256}</span>
                      </div>
                      <div>
                        <span className="text-orange-400 font-bold block mb-0.5">SALTED SHA-256 (SHA256 + SALT):</span>
                        <span className="text-slate-400 break-all">{cyberHashes.saltedSha256}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brute force cracking simulator */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                      <span className="text-xs font-bold text-white">Dictionary Password cracking simulator</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Measure how fast a standard dictionary attack checks your plaintext password in offline nodes. Strong entropy protects local records.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-400 space-y-1 h-44 overflow-y-auto">
                    {crackResults.length === 0 ? (
                      <span className="text-slate-600 italic">Logs are empty. Click Simulate Crack.</span>
                    ) : (
                      crackResults.map((res, i) => (
                        <div key={i} className={res.includes("FOUND") ? "text-emerald-400 font-bold" : "text-slate-400"}>
                          {res}
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={simulateBruteForce}
                    disabled={crackTimer}
                    className="w-full py-2 bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-600 hover:to-orange-500 text-white rounded text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {crackTimer ? "Brute-forcing database cache..." : "Simulate Crack Attack"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              SUB-TAB 5: LINUX TERMINAL LABORATORY (CYBER RANGE)
              ========================================== */}
          {activeLab === "linux" && (
            <div className="space-y-4">
              {/* Scenario selector & Stats Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                        SELECT CYBERSECURITY ATTACK &amp; PATCH LAB
                      </h4>
                      <p className="text-xs text-slate-400">
                        Choose an offline simulated scenario. Complete all steps to exploit and patch the target.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 self-start">
                      <span className="text-[10px] text-slate-500 font-mono">Completed:</span>
                      <span className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-black font-mono text-cyan-400">
                        {Object.keys(securedScenarios).filter(k => securedScenarios[k]).length} / {CYBER_SCENARIOS.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {CYBER_SCENARIOS.map((sc, idx) => {
                      const isSecured = securedScenarios[sc.id];
                      const isCurrent = idx === selectedScenarioIdx;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            setSelectedScenarioIdx(idx);
                            setCurrentStepIdx(0);
                            setLastExecutedCommand("");
                            setLastExecutedOutput([]);
                            setTerminalHistory([
                              `EnoTech Cyber Range: Initialized target scenario "${sc.name}"`,
                              `Vulnerability Vector: ${sc.vulnerability}`,
                              `Target Domain: ${sc.targetUrl} (${sc.targetIp})`,
                              "Type 'help' to inspect standard terminal utility sets.",
                              ""
                            ]);
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between gap-4 border cursor-pointer flex-1 min-w-[200px] ${
                            isCurrent
                              ? "bg-slate-950 border-cyan-400/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="block text-slate-200">{sc.name}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">
                              IP: {sc.targetIp} | Diff: <span className={
                                sc.difficulty === "Easy" ? "text-emerald-400" : sc.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                              }>{sc.difficulty}</span>
                            </span>
                          </div>
                          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                            isSecured ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900" : "bg-slate-950 text-slate-500"
                          }`}>
                            {isSecured ? "Secured" : "Vulnerable"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Host Details Panel */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-bold block">TARGET HOST AUDIT</span>
                    <h5 className="text-xs font-black text-white uppercase font-mono">
                      {CYBER_SCENARIOS[selectedScenarioIdx].targetUrl}
                    </h5>
                    <div className="space-y-1 text-[11px] font-mono text-slate-400">
                      <div className="flex justify-between border-b border-slate-850 pb-1">
                        <span>IP Address:</span>
                        <span className="text-slate-300">{CYBER_SCENARIOS[selectedScenarioIdx].targetIp}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1">
                        <span>Vulnerability:</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{CYBER_SCENARIOS[selectedScenarioIdx].vulnerability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tools Deployed:</span>
                        <span className="text-slate-300">{CYBER_SCENARIOS[selectedScenarioIdx].tools.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCurrentStepIdx(0);
                        setLastExecutedCommand("");
                        setLastExecutedOutput([]);
                        setSecuredScenarios(prev => ({ ...prev, [CYBER_SCENARIOS[selectedScenarioIdx].id]: false }));
                        setTerminalHistory([
                          `EnoTech Cyber Range: Reset scenario steps for "${CYBER_SCENARIOS[selectedScenarioIdx].name}"`,
                          "Ready for input...",
                          ""
                        ]);
                      }}
                      className="w-full py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-400 font-mono uppercase rounded transition-all cursor-pointer"
                    >
                      Reset Current Range Progress
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Interactive Workspace (Terminal and Visible Guidance Panel Side-by-Side) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 1. Terminal Simulator Container (7/12 cols) */}
                <div className="lg:col-span-7 flex flex-col space-y-2">
                  <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-xs flex flex-col h-[480px] shadow-2xl relative">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3 text-slate-500 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>bash terminal - offline attack gateway</span>
                      </div>
                      <span className="text-cyan-500 font-bold">root@cyber_range:~#</span>
                    </div>

                    {/* Command Outputs history */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-300 pr-2 font-mono text-[11px] leading-relaxed">
                      {terminalHistory.map((line, idx) => {
                        if (line.startsWith("enotech@root:~$")) {
                          return (
                            <div key={idx} className="text-cyan-400 font-bold mt-1.5">
                              {line}
                            </div>
                          );
                        }
                        if (line.includes("SUCCESS") || line.includes("Exploitation successful") || line.includes("SECURED") || line.includes("Verdict:")) {
                          return (
                            <div key={idx} className="text-emerald-400 font-bold bg-emerald-950/20 p-1.5 rounded border border-emerald-900/30 my-1">
                              {line}
                            </div>
                          );
                        }
                        if (line.includes("vulnerable") || line.includes("WARNING") || line.includes("vulnerability") || line.includes("ERROR") || line.includes("HINT")) {
                          return (
                            <div key={idx} className="text-orange-400 bg-orange-950/10 p-1 rounded border border-orange-900/20 my-0.5">
                              {line}
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="text-slate-300">
                            {line}
                          </div>
                        );
                      })}
                    </div>

                    {/* Input prompt */}
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 border-t border-slate-900 pt-2 mt-2">
                      <span className="text-cyan-400 font-bold">enotech@root:~$</span>
                      <input
                        type="text"
                        value={terminalCommand}
                        onChange={(e) => setTerminalCommand(e.target.value)}
                        placeholder={`Type or copy: ${CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.command || "help"}`}
                        className="flex-1 bg-transparent border-none text-xs text-white focus:ring-0 focus:outline-none font-mono placeholder:text-slate-700"
                        autoFocus
                      />
                    </form>
                  </div>
                  
                  <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      💡 <strong className="text-slate-300">Quick Guide:</strong> Type or copy the active command in the right-hand side panel exactly.
                    </span>
                    <button
                      onClick={() => {
                        const activeCmd = CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.command;
                        if (activeCmd) {
                          setTerminalCommand(activeCmd);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] text-cyan-400 font-mono rounded cursor-pointer transition-all"
                    >
                      Autofill Step Command
                    </button>
                  </div>
                </div>

                {/* 2. Command Explanation, Interpretation & Patching Guidance Panel (5/12 cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  {/* Active Step Indicator & Instructions card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-black text-white tracking-wider uppercase">
                        Lab Objective Pipeline
                      </span>
                      <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-400">
                        Step {currentStepIdx + 1} of {CYBER_SCENARIOS[selectedScenarioIdx].steps.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Active Operation:</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">
                          {CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.title}
                        </h4>
                      </div>

                      <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                        {CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.description}
                      </div>

                      {/* Display command to copy */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">Command to execute in terminal:</span>
                        <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-850 font-mono text-xs text-slate-200 group">
                          <code className="text-cyan-300 break-all">{CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.command}</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx]?.command || "");
                              addLabLog("System: Copied command to clipboard.");
                            }}
                            className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded text-slate-400 hover:text-slate-200 transition-all cursor-pointer font-mono ml-2 shrink-0"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Output Interpreter & Explanation Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-black text-white tracking-wider uppercase">
                          Terminal output decoder
                        </span>
                      </div>

                      {lastExecutedCommand ? (
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 block font-bold">DECODING EXECUTED COMMAND:</span>
                            <span className="text-xs font-mono text-slate-300 italic">"{lastExecutedCommand}"</span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-emerald-400 block font-bold">WHAT THIS DATA MEANS &amp; DISCOVERIES:</span>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850 font-sans">
                              {CYBER_SCENARIOS[selectedScenarioIdx].steps[currentStepIdx - 1]?.explanation || 
                               CYBER_SCENARIOS[selectedScenarioIdx].steps[CYBER_SCENARIOS[selectedScenarioIdx].steps.length - 1].explanation}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl">
                          Execute the target step command in the terminal on the left to see the output decoder explanation here.
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-850 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Range Integrity Status:</span>
                        <span className={`font-bold ${securedScenarios[CYBER_SCENARIOS[selectedScenarioIdx].id] ? "text-emerald-400" : "text-amber-400"}`}>
                          {securedScenarios[CYBER_SCENARIOS[selectedScenarioIdx].id] ? "SECURED (PATCHED)" : "ACTIVE VULNERABILITY"}
                        </span>
                      </div>
                      
                      {securedScenarios[CYBER_SCENARIOS[selectedScenarioIdx].id] && (
                        <div className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 p-2.5 rounded-lg text-xs leading-relaxed">
                          🛡️ <strong className="text-emerald-300 font-bold">System Hardening Verified!</strong> You successfully identified the weakness, exploited the target service parameters, deployed a code-level security patch, and re-scanned to verify defense remediation. Excellent job!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              SUB-TAB 6: AI CONTENT STUDIO
              ========================================== */}
          {activeLab === "ai-studio" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase block">AI Study Asset generator</span>
                  <h3 className="text-sm font-bold text-white">Create Original Lesson plans & outlines</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Formulate course content with embedded objectives, diagrams, slide decks, challenge summaries, quizzes, and EnoTech Academy trademarks.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studioTopic}
                    onChange={(e) => setStudioTopic(e.target.value)}
                    placeholder="Enter course topic (e.g., Python class decorators)"
                    className="flex-1 bg-slate-950 border border-slate-850 rounded p-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={triggerAIContentStudio}
                    disabled={isGeneratingContent}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded text-xs font-black shadow-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingContent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-orange-300" />} Produce Content
                  </button>
                </div>
              </div>

              {generatedMaterial && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                  
                  {/* Generated Outline Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-850 gap-2">
                    <div>
                      <span className="text-[11px] font-black text-cyan-400 tracking-wider block font-mono">{generatedMaterial.logo}</span>
                      <h4 className="text-sm font-black text-white">Course Segment: {studioTopic}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] rounded font-semibold">
                      Status: Compiled & Draft Saved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                    
                    {/* Objectives */}
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">LESSON OBJECTIVES</span>
                      <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                        {generatedMaterial.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    </div>

                    {/* Slides outline */}
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">PRESENTATION SLIDES DECK (MOCK)</span>
                      <div className="space-y-1.5 leading-relaxed font-mono text-[10px]">
                        {generatedMaterial.presentationSlides.map((slide, i) => (
                          <div key={i} className="p-1 bg-slate-900 rounded text-slate-400">
                            {slide}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Manual */}
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 text-xs leading-relaxed space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">STUDENT HANDBOOK STUDY DOCUMENTATION</span>
                    <p className="text-slate-300">{generatedMaterial.manual}</p>
                  </div>

                  {/* Practice Challenge & Copyright Footer */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs space-y-1">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1">🏆 PRACTICAL CHALLENGE EXERCISE</span>
                    <p className="text-slate-300 leading-normal">{generatedMaterial.challenge}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-850">
                    <span>{generatedMaterial.copyright}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert("Downloading presentation slides as HTML Slide Project file...")}
                        className="px-2 py-1 bg-slate-850 hover:bg-slate-800 rounded border border-slate-800 text-[10px] text-slate-400"
                      >
                        Export Slide Deck
                      </button>
                      <button
                        onClick={() => alert("Downloading handbook manuals as educational materials...")}
                        className="px-2 py-1 bg-slate-850 hover:bg-slate-800 rounded border border-slate-800 text-[10px] text-slate-400"
                      >
                        Export Manual PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              SUB-TAB 7: ASSIGNMENTS & EXAMS LABS
              ========================================== */}
          {activeLab === "assessments" && (
            <div className="space-y-4">
              
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 gap-1 self-start">
                <button
                  onClick={() => setActiveAssessmentTab("assignment")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeAssessmentTab === "assignment" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Offline Plagiarism Check
                </button>
                <button
                  onClick={() => setActiveAssessmentTab("examination")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeAssessmentTab === "examination" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Examinations AI Proctor Simulator
                </button>
              </div>

              {activeAssessmentTab === "assignment" ? (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase block">Offline Plagiarism Checker</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload student assignments to evaluate textual references against the local offline textbook caches to verify original content.
                    </p>
                  </div>

                  <div className="border border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-950 text-center">
                    <Download className="w-10 h-10 text-slate-500" />
                    <div>
                      <span className="text-xs font-bold text-white block">Upload Student Assignment Document</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Supports PDF, DOCX, CSV, TXT (Maximum size: 8MB)</span>
                    </div>
                    <button
                      onClick={runPlagiarismScan}
                      disabled={checkingPlagiarism}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-black cursor-pointer disabled:opacity-50"
                    >
                      {checkingPlagiarism ? "Checking plagiarism nodes..." : "Simulate File Upload & Scan"}
                    </button>
                  </div>

                  {plagiarismPercent !== null && (
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">REPORT OUTCOME</span>
                        <h4 className="text-xs font-extrabold text-white">Plagiarism verification complete.</h4>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">MATCH PERCENTAGE</span>
                        <span className={`text-xl font-black ${plagiarismPercent > 15 ? "text-rose-500" : "text-emerald-400"}`}>
                          {plagiarismPercent}% Plagiarized
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black uppercase block">AI Proctoring Sandbox</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      EnoTech Examinations enforce secure logins and utilize client-side proctor cameras to capture gaze anomalies or unauthorized tab-shifting behaviors.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Camera view simulator */}
                    <div className="aspect-video bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06),transparent_80%)]"></div>
                      <div className="flex justify-between items-center z-10">
                        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-400/20 text-rose-400 rounded text-[9px] font-mono font-bold animate-pulse">
                          PROCTOR AI CAMERA ACTIVE
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">1 fps</span>
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-2 z-10 flex-1">
                        <Shield className="w-12 h-12 text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                          Student Gaze Tracking: LOCKED
                        </span>
                      </div>

                      <button
                        onClick={simulateExamsProctoring}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded text-[10px] font-bold z-10 transition-all cursor-pointer"
                      >
                        Simulate Student Tab Shift Attempt
                      </button>
                    </div>

                    {/* Telemetry diagnostics logs */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-cyan-400 font-black uppercase">Telemetry Audit Records</span>
                          <span className="text-rose-400 font-mono text-xs font-bold">{proctorViolations} anomalies</span>
                        </div>

                        <div className="space-y-1.5 font-mono text-[10px] text-slate-400 leading-normal max-h-40 overflow-y-auto">
                          {examProctorLogs.map((log, idx) => (
                            <div key={idx} className={log.includes("ALERT") ? "text-rose-400 font-bold" : "text-slate-400"}>
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500 leading-normal block">
                          *Automatic timer saves examination scripts in intervals. Server-side grading verifies solutions upon exam final submission.
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Laboratory Activity feed logs (Right Column) */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> Sandbox Output logs
              </span>
              <button
                onClick={() => setLabLogs(["System: Logs refreshed."])}
                className="text-[10px] text-slate-500 hover:text-white"
              >
                Clear
              </button>
            </div>

            {/* Simulated Live Logs */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {labLogs.map((log, i) => {
                let colorClass = "text-slate-400";
                if (log.includes("System:")) colorClass = "text-slate-500 italic";
                else if (log.includes("Database:")) colorClass = "text-cyan-400";
                else if (log.includes("Security:") || log.includes("Cybersecurity:")) colorClass = "text-rose-400";
                else if (log.includes("Network:") || log.includes("Networking:")) colorClass = "text-blue-400";
                else if (log.includes("AI Studio:")) colorClass = "text-amber-400";
                else if (log.includes("Linux:")) colorClass = "text-slate-300";

                return (
                  <div key={i} className={`font-mono text-[10px] leading-relaxed border-b border-slate-850/30 pb-1.5 ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-850 text-[10px] text-slate-500 leading-relaxed font-sans">
              *All labs support offline memory cache. Progress is stored locally and syncs immediately once a network handshake is verified.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
