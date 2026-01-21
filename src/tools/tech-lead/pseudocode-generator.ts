// Tech Lead Tool - Pseudocode Generator (LOGIC-FOCUSED, COMMENT-DRIVEN)
import type { Module, ClassDefinition, PseudocodeFile } from '../../types/tech-lead.js';

export type PseudocodeLanguage = 'python' | 'typescript' | 'java' | 'go' | 'csharp' | 'cpp' | 'rust';

/**
 * Generate pseudocode files from modules
 * FOCUS: Logic comments, high-level flow, NOT full implementation
 */
export function generatePseudocode(
    modules: Module[],
    language: PseudocodeLanguage = 'python'
): PseudocodeFile[] {
    const files: PseudocodeFile[] = [];

    for (const module of modules) {
        for (const cls of module.classes) {
            const file = generateClassPseudocode(module, cls, language);
            files.push(file);
        }
    }

    return files;
}

/**
 * Generate pseudocode for a class
 */
function generateClassPseudocode(
    module: Module,
    cls: ClassDefinition,
    language: PseudocodeLanguage
): PseudocodeFile {
    const content = generatePseudocodeContent(cls, language, module.name);
    const filename = toFilename(cls.name, language);

    return {
        filename,
        module: module.name,
        language,
        purpose: cls.purpose,
        securityNotes: generateSecurityNotes(cls, language, module.name),
        content
    };
}

/**
 * Generate pseudocode content - LOGIC COMMENTS ONLY
 */
function generatePseudocodeContent(
    cls: ClassDefinition, 
    language: PseudocodeLanguage,
    moduleName: string
): string {
    // Detect domain-specific patterns
    const isSignalProtocol = moduleName.includes('Signal') || cls.name.includes('Ratchet') || cls.name.includes('X3DH');
    const isMalwareAnalysis = moduleName.includes('Sandbox') || cls.name.includes('Malware') || cls.name.includes('IOC');
    const isBlockchain = moduleName.includes('Smart') || cls.name.includes('Contract') || cls.name.includes('Chain');
    const isAppSec = moduleName.includes('SAST') || moduleName.includes('DAST') || moduleName.includes('Security') || 
                     cls.name.includes('SAST') || cls.name.includes('DAST') || cls.name.includes('Analyzer') ||
                     cls.name.includes('Scanner') || cls.name.includes('Dependency') || cls.name.includes('SCA');
    const isMLAI = moduleName.includes('ML') || moduleName.includes('AI') || moduleName.includes('Model') ||
                   cls.name.includes('Adversarial') || cls.name.includes('Training') || cls.name.includes('Inference');
    const isNetworkSec = moduleName.includes('Network') || moduleName.includes('Packet') || moduleName.includes('IDS') ||
                         cls.name.includes('IPS') || cls.name.includes('DPI') || cls.name.includes('Firewall');
    const isWebSec = moduleName.includes('Web') || moduleName.includes('HTTP') || moduleName.includes('WAF') ||
                     cls.name.includes('WAF') || cls.name.includes('CSRF') || cls.name.includes('XSS');

    if (isSignalProtocol) {
        return generateSignalProtocolPseudocode(cls, language);
    } else if (isMalwareAnalysis) {
        return generateMalwareAnalysisPseudocode(cls, language);
    } else if (isBlockchain) {
        return generateBlockchainPseudocode(cls, language);
    } else if (isAppSec) {
        return generateAppSecPseudocode(cls, language);
    } else if (isMLAI) {
        return generateMLAIPseudocode(cls, language);
    } else if (isNetworkSec) {
        return generateNetworkSecPseudocode(cls, language);
    } else if (isWebSec) {
        return generateWebSecPseudocode(cls, language);
    }

    // Generic pseudocode
    switch (language) {
        case 'python': return generatePythonLogicPseudocode(cls);
        case 'typescript': return generateTypeScriptLogicPseudocode(cls);
        case 'cpp': return generateCppLogicPseudocode(cls);
        case 'rust': return generateRustLogicPseudocode(cls);
        default: return generateGenericLogicPseudocode(cls);
    }
}

// ==================== DOMAIN-SPECIFIC PSEUDOCODE ====================

function generateSignalProtocolPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${name} - Signal Protocol Implementation`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('// Reference: Signal Protocol Spec (libsignal-protocol-c)');
    lines.push('');
    lines.push(`class ${name} {`);
    lines.push('');

    if (name.includes('X3DH') || name.includes('Handshake')) {
        lines.push('    // X3DH Key Agreement Protocol (Extended Triple Diffie-Hellman)');
        lines.push('    initiateSession(recipientId):');
        lines.push('        // STEP 1: Load recipient\'s PreKey bundle from server');
        lines.push('        //   - Identity Key (IK_B)');
        lines.push('        //   - Signed PreKey (SPK_B) + signature');
        lines.push('        //   - One-Time PreKey (OPK_B) - if available');
        lines.push('');
        lines.push('        // STEP 2: Verify signature on SPK_B using IK_B');
        lines.push('        //   - Ensure bundle is authentic');
        lines.push('');
        lines.push('        // STEP 3: Generate ephemeral key pair (EK_A)');
        lines.push('');
        lines.push('        // STEP 4: Perform 4-way Diffie-Hellman:');
        lines.push('        //   DH1 = DH(IK_A, SPK_B)   // Long-term to signed');
        lines.push('        //   DH2 = DH(EK_A, IK_B)    // Ephemeral to identity');
        lines.push('        //   DH3 = DH(EK_A, SPK_B)   // Ephemeral to signed');
        lines.push('        //   DH4 = DH(EK_A, OPK_B)   // Ephemeral to one-time (if exists)');
        lines.push('');
        lines.push('        // STEP 5: Derive shared secret SK');
        lines.push('        //   SK = KDF(DH1 || DH2 || DH3 || DH4)');
        lines.push('');
        lines.push('        // STEP 6: Initialize Double Ratchet state with SK');
        lines.push('        //   - Root Key (RK) = HKDF(SK, "RootKey")');
        lines.push('        //   - Chain Key (CK) = HKDF(SK, "ChainKey")');
        lines.push('');
        lines.push('        // STEP 7: Store session state securely');
        lines.push('        //   - Persist to encrypted database (SessionStore)');
        lines.push('');
        lines.push('        // RETURN: Session ID');
        lines.push('');
    }

    if (name.includes('Ratchet') || name.includes('Encrypt')) {
        lines.push('    // Double Ratchet Encryption');
        lines.push('    encryptMessage(sessionId, plaintext):');
        lines.push('        // STEP 1: Load session state (RK, CK, sending_chain)');
        lines.push('');
        lines.push('        // STEP 2: Derive message key from chain key');
        lines.push('        //   MK = HMAC-SHA256(CK, 0x01)');
        lines.push('        //   CK_next = HMAC-SHA256(CK, 0x02)');
        lines.push('');
        lines.push('        // STEP 3: Encrypt plaintext with message key');
        lines.push('        //   ciphertext = AES-256-CBC(plaintext, MK)');
        lines.push('        //   OR ChaCha20-Poly1305(plaintext, MK)');
        lines.push('');
        lines.push('        // STEP 4: Generate header (N, PN, DH_pub)');
        lines.push('        //   N = message number in current chain');
        lines.push('        //   PN = previous chain length');
        lines.push('        //   DH_pub = current DH public key');
        lines.push('');
        lines.push('        // STEP 5: Update chain key for next message');
        lines.push('        //   CK = CK_next');
        lines.push('');
        lines.push('        // STEP 6: Persist updated session state');
        lines.push('');
        lines.push('        // RETURN: {header, ciphertext, MAC}');
        lines.push('');
    }

    lines.push('    // Security Notes:');
    lines.push('    // - MUST verify PreKey bundle signatures before X3DH');
    lines.push('    // - MUST use constant-time comparison for MACs');
    lines.push('    // - MUST zeroize ephemeral keys after use');
    lines.push('    // - MUST implement out-of-order message handling');
    lines.push('    // - Forward Secrecy: Old keys deleted after ratchet step');
    lines.push('    // - Future Secrecy: Compromise of one message key ≠ compromise all');
    lines.push('}');

    return lines.join('\n');
}

function generateMalwareAnalysisPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${name} - Malware Analysis Engine`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('// Reference: MITRE ATT&CK Framework');
    lines.push('');
    lines.push(`class ${name} {`);
    lines.push('');

    if (name.includes('Sandbox') || name.includes('Execute')) {
        lines.push('    // Dynamic Malware Execution in Sandbox');
        lines.push('    executeSample(malwareHash):');
        lines.push('        // STEP 1: Environment Preparation');
        lines.push('        //   - Snapshot VM state (revert after analysis)');
        lines.push('        //   - Disable network (or route through honeypot)');
        lines.push('        //   - Setup filesystem monitoring (procmon, sysmon)');
        lines.push('        //   - Hook API calls (CreateProcess, RegSetValue, socket, etc.)');
        lines.push('');
        lines.push('        // STEP 2: Anti-Evasion Techniques');
        lines.push('        //   - Simulate user interaction (mouse moves, keystrokes)');
        lines.push('        //   - Add artificial delays (avoid time-based checks)');
        lines.push('        //   - Mimic real environment (browser history, docs, processes)');
        lines.push('');
        lines.push('        // STEP 3: Execute Malware Binary');
        lines.push('        //   - Load into memory');
        lines.push('        //   - Set breakpoints on suspicious APIs (VirtualAlloc, WriteProcessMemory)');
        lines.push('        //   - Start execution with timeout (e.g., 5 minutes)');
        lines.push('');
        lines.push('        // STEP 4: Behavioral Monitoring');
        lines.push('        //   - File System: Created/Modified/Deleted files');
        lines.push('        //   - Registry: New keys, modified values');
        lines.push('        //   - Network: DNS queries, HTTP requests, C2 connections');
        lines.push('        //   - Process: Child processes, DLL injections, thread creation');
        lines.push('');
        lines.push('        // STEP 5: Memory Dump & Analysis');
        lines.push('        //   - Dump process memory at intervals');
        lines.push('        //   - Search for strings (URLs, IPs, encryption keys)');
        lines.push('        //   - Detect shellcode patterns');
        lines.push('');
        lines.push('        // STEP 6: IOC Extraction');
        lines.push('        //   - MD5/SHA256 hashes');
        lines.push('        //   - Mutex names');
        lines.push('        //   - C2 domains/IPs');
        lines.push('        //   - File paths');
        lines.push('');
        lines.push('        // STEP 7: Revert VM Snapshot');
        lines.push('');
        lines.push('        // RETURN: BehavioralReport {iocs, score, classification}');
        lines.push('');
    }

    if (name.includes('Static') || name.includes('Analyzer')) {
        lines.push('    // Static Analysis (No Execution)');
        lines.push('    analyzeStatically(filePath):');
        lines.push('        // STEP 1: File Format Analysis');
        lines.push('        //   - PE header parsing (EntryPoint, Sections, Imports)');
        lines.push('        //   - Detect packers (UPX, Themida, VMProtect)');
        lines.push('');
        lines.push('        // STEP 2: Signature Scanning');
        lines.push('        //   - YARA rules matching');
        lines.push('        //   - Antivirus engine check (VirusTotal API)');
        lines.push('');
        lines.push('        // STEP 3: String Extraction');
        lines.push('        //   - Extract ASCII/Unicode strings');
        lines.push('        //   - Regex for URLs, IPs, emails, registry keys');
        lines.push('');
        lines.push('        // STEP 4: Disassembly (IDA Pro / Ghidra)');
        lines.push('        //   - Identify suspicious API calls (LoadLibrary, VirtualProtect)');
        lines.push('        //   - Detect anti-debug tricks (IsDebuggerPresent, RDTSC)');
        lines.push('');
        lines.push('        // STEP 5: Entropy Analysis');
        lines.push('        //   - High entropy sections → likely packed/encrypted');
        lines.push('');
        lines.push('        // RETURN: StaticReport {risk_score, indicators}');
        lines.push('');
    }

    lines.push('    // Security Notes:');
    lines.push('    // - NEVER run malware on host OS - ALWAYS use isolated VM');
    lines.push('    // - Disable VM snapshots exposure (malware detects VirtualBox, VMware)');
    lines.push('    // - Use bare-metal if dealing with VM-aware malware');
    lines.push('    // - Encrypt all stored samples with strong password');
    lines.push('}');

    return lines.join('\n');
}

function generateBlockchainPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${name} - Blockchain Smart Contract`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('// Language: Solidity 0.8.x');
    lines.push('');
    lines.push(`contract ${name} {`);
    lines.push('');

    if (name.includes('Token') || name.includes('ERC20')) {
        lines.push('    // ERC-20 Token Transfer (Secure Pattern)');
        lines.push('    transfer(recipient, amount):');
        lines.push('        // STEP 1: Input Validation');
        lines.push('        //   - REQUIRE recipient != address(0) (no burn by accident)');
        lines.push('        //   - REQUIRE amount > 0');
        lines.push('        //   - REQUIRE balances[msg.sender] >= amount (sufficient funds)');
        lines.push('');
        lines.push('        // STEP 2: Checks-Effects-Interactions Pattern (Anti-Reentrancy)');
        lines.push('        //   CHECKS: Already done above');
        lines.push('        //   EFFECTS: Update state BEFORE external calls');
        lines.push('        //     balances[msg.sender] -= amount');
        lines.push('        //     balances[recipient] += amount');
        lines.push('');
        lines.push('        // STEP 3: Events (for off-chain indexing)');
        lines.push('        //   EMIT Transfer(msg.sender, recipient, amount)');
        lines.push('');
        lines.push('        // STEP 4: External Calls (if needed)');
        lines.push('        //   - ONLY after state updates');
        lines.push('        //   - Use .call{value: x}() instead of .transfer()');
        lines.push('');
        lines.push('        // RETURN: true');
        lines.push('');
    }

    if (name.includes('Vault') || name.includes('Staking')) {
        lines.push('    // Deposit/Withdraw (Reentrancy-Safe)');
        lines.push('    withdraw(amount):');
        lines.push('        // STEP 1: Reentrancy Guard');
        lines.push('        //   - Use OpenZeppelin ReentrancyGuard modifier');
        lines.push('        //   - OR manual: REQUIRE locked == false; locked = true;');
        lines.push('');
        lines.push('        // STEP 2: Validate Withdrawal');
        lines.push('        //   - REQUIRE balances[msg.sender] >= amount');
        lines.push('        //   - REQUIRE amount > 0');
        lines.push('');
        lines.push('        // STEP 3: Update State FIRST (Checks-Effects-Interactions)');
        lines.push('        //   balances[msg.sender] -= amount');
        lines.push('');
        lines.push('        // STEP 4: Transfer Funds');
        lines.push('        //   (bool success, ) = msg.sender.call{value: amount}("")');
        lines.push('        //   REQUIRE success (revert if transfer fails)');
        lines.push('');
        lines.push('        // STEP 5: Emit Event');
        lines.push('        //   EMIT Withdraw(msg.sender, amount)');
        lines.push('');
        lines.push('        // STEP 6: Release Lock');
        lines.push('        //   locked = false;');
        lines.push('');
    }

    lines.push('    // Security Notes:');
    lines.push('    // - ALWAYS follow Checks-Effects-Interactions pattern');
    lines.push('    // - NEVER use tx.origin for authentication (use msg.sender)');
    lines.push('    // - NEVER trust block.timestamp (can be manipulated by miners)');
    lines.push('    // - USE SafeMath (or Solidity 0.8+ built-in overflow checks)');
    lines.push('    // - GAS OPTIMIZATION: Pack state variables, use events for logs');
    lines.push('}');

    return lines.join('\n');
}

/**
 * Application Security (AppSec) - SAST/DAST/Dependency Scanning
 */
function generateAppSecPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    
    if (cls.name.includes('SAST') || cls.name.includes('CodeAnalyzer') || cls.name.includes('StaticAnalyzer')) {
        lines.push(`// SAST Engine - Static Application Security Testing`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    analyzeSecurity(sourceCode: string): VulnerabilityReport {`);
        lines.push(`        // STEP 1: Parse Abstract Syntax Tree (AST)`);
        lines.push(`        //   - Use parser: tree-sitter, srcML, or language-specific parser`);
        lines.push(`        //   - Build Control Flow Graph (CFG)`);
        lines.push(`        //   - Build Data Flow Graph (DFG)`);
        lines.push(`        //   - Extract symbols and identifiers`);
        lines.push(``);
        lines.push(`        // STEP 2: Pattern Matching (Rule-based Detection)`);
        lines.push(`        //   SQL Injection Detection:`);
        lines.push(`        //   - Pattern: execute("SELECT * FROM users WHERE id=" + userInput)`);
        lines.push(`        //   - Flag: Unsanitized concatenation in SQL query`);
        lines.push(`        //   XSS Detection:`);
        lines.push(`        //   - Pattern: innerHTML = userInput`);
        lines.push(`        //   - Flag: Unencoded output to DOM`);
        lines.push(`        //   Hardcoded Secrets:`);
        lines.push(`        //   - Regex: /api[_-]?key\\s*=\\s*['"][a-zA-Z0-9]{20,}['"]/`);
        lines.push(`        //   - Flag: API keys, passwords in source code`);
        lines.push(``);
        lines.push(`        // STEP 3: Data Flow Analysis (Taint Analysis)`);
        lines.push(`        //   Source: User input (req.body, req.query, req.params)`);
        lines.push(`        //   Sink: Dangerous functions (eval, exec, SQL query, file write)`);
        lines.push(`        //   Propagation: Track tainted data through assignments`);
        lines.push(`        //   Sanitizers: Check if input passes through validation/encoding`);
        lines.push(`        //   Example: userInput -> sanitize() -> query [SAFE]`);
        lines.push(``);
        lines.push(`        // STEP 4: Control Flow Analysis`);
        lines.push(`        //   - Detect unreachable code (dead code)`);
        lines.push(`        //   - Identify missing security checks (auth bypass)`);
        lines.push(`        //   - Check for race conditions (TOCTOU)`);
        lines.push(``);
        lines.push(`        // STEP 5: Generate Findings`);
        lines.push(`        //   - CWE classification (CWE-89 for SQLi, CWE-79 for XSS)`);
        lines.push(`        //   - Severity scoring (Critical/High/Medium/Low or CVSS)`);
        lines.push(`        //   - Remediation advice with code snippets`);
        lines.push(`        //   - Line number and context (5 lines before/after)`);
        lines.push(``);
        lines.push(`        // RETURN: List of vulnerabilities with context`);
        lines.push(`    }`);
        lines.push(`}`);
    } else if (cls.name.includes('DAST') || cls.name.includes('DynamicScanner')) {
        lines.push(`// DAST Engine - Dynamic Application Security Testing`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    scanRunningApplication(targetUrl: string): VulnerabilityReport {`);
        lines.push(`        // STEP 1: Crawl Application`);
        lines.push(`        //   - Spider: Discover all endpoints, forms, parameters`);
        lines.push(`        //   - Parse HTML, JavaScript for hidden endpoints`);
        lines.push(`        //   - Respect robots.txt (configurable)`);
        lines.push(``);
        lines.push(`        // STEP 2: Attack Vector Generation`);
        lines.push(`        //   SQL Injection: ' OR 1=1--, '; DROP TABLE--, UNION SELECT`);
        lines.push(`        //   XSS: <script>alert(1)</script>, <img src=x onerror=alert(1)>`);
        lines.push(`        //   Path Traversal: ../../../etc/passwd`);
        lines.push(`        //   SSRF: http://localhost:8080/admin`);
        lines.push(``);
        lines.push(`        // STEP 3: Inject Payloads`);
        lines.push(`        //   - Test each parameter with attack vectors`);
        lines.push(`        //   - Monitor HTTP responses for evidence:`);
        lines.push(`        //     • SQL errors in response (database detection)`);
        lines.push(`        //     • Reflected payload in response (XSS)`);
        lines.push(`        //     • Timing delays (blind SQLi with SLEEP())`);
        lines.push(``);
        lines.push(`        // STEP 4: Verify Vulnerabilities`);
        lines.push(`        //   - Reduce false positives via confirmation tests`);
        lines.push(`        //   - Extract data to prove exploitability`);
        lines.push(``);
        lines.push(`        // STEP 5: Generate Report`);
        lines.push(`        //   - OWASP Top 10 classification`);
        lines.push(`        //   - Proof-of-concept (HTTP request/response)`);
        lines.push(`        //   - Remediation guidance`);
        lines.push(`    }`);
        lines.push(`}`);
    } else if (cls.name.includes('Dependency') || cls.name.includes('SCA')) {
        lines.push(`// SCA Engine - Software Composition Analysis`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    scanDependencies(projectPath: string): VulnerabilityReport {`);
        lines.push(`        // STEP 1: Extract Dependencies`);
        lines.push(`        //   - Parse package.json, requirements.txt, pom.xml, Cargo.toml`);
        lines.push(`        //   - Build dependency tree (direct + transitive)`);
        lines.push(``);
        lines.push(`        // STEP 2: Query Vulnerability Databases`);
        lines.push(`        //   - NVD (National Vulnerability Database)`);
        lines.push(`        //   - OSV (Open Source Vulnerabilities)`);
        lines.push(`        //   - GitHub Advisory Database`);
        lines.push(``);
        lines.push(`        // STEP 3: Check for Known CVEs`);
        lines.push(`        //   - Match package@version with CVE records`);
        lines.push(`        //   - Check CVSS score and exploitability`);
        lines.push(``);
        lines.push(`        // STEP 4: License Compliance Check`);
        lines.push(`        //   - Identify licenses (MIT, GPL, Apache, proprietary)`);
        lines.push(`        //   - Flag incompatible licenses (GPL in closed-source)`);
        lines.push(``);
        lines.push(`        // STEP 5: Generate Remediation Plan`);
        lines.push(`        //   - Recommend version upgrades`);
        lines.push(`        //   - Suggest alternative packages if no fix available`);
        lines.push(`    }`);
        lines.push(`}`);
    }
    
    return lines.join('\n');
}

/**
 * ML/AI Security - Adversarial Defense, Model Robustness
 */
function generateMLAIPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    
    if (cls.name.includes('Adversarial') || cls.name.includes('Defense') || cls.name.includes('RobustModel')) {
        lines.push(`// AI/ML Security - Adversarial Training & Defense`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    trainRobustModel(dataset: Dataset, baseModel: Model): RobustModel {`);
        lines.push(`        // STEP 1: Data Sanitization (Anti-Poisoning)`);
        lines.push(`        //   - Detect outliers using Isolation Forest`);
        lines.push(`        //   - Remove adversarial samples (high loss on validation set)`);
        lines.push(`        //   - Apply differential privacy: DP-SGD (add noise to gradients)`);
        lines.push(``);
        lines.push(`        // STEP 2: Adversarial Training Loop`);
        lines.push(`        //   FOR each epoch:`);
        lines.push(`        //     - Generate adversarial examples:`);
        lines.push(`        //       • FGSM: x_adv = x + ε * sign(∇_x Loss)`);
        lines.push(`        //       • PGD: Iterative FGSM with projection`);
        lines.push(`        //       • CW Attack: Minimize ||x - x_adv|| + c * L(x_adv)`);
        lines.push(`        //     - Mix clean + adversarial samples (50/50 ratio)`);
        lines.push(`        //     - Train model on mixed batch`);
        lines.push(`        //     - Adversarial examples force model to learn robust features`);
        lines.push(``);
        lines.push(`        // STEP 3: Model Inversion Defense`);
        lines.push(`        //   - Add output noise (Laplace mechanism)`);
        lines.push(`        //   - Limit prediction confidence (temperature scaling)`);
        lines.push(`        //   - Prevent attackers from reconstructing training data`);
        lines.push(``);
        lines.push(`        // STEP 4: Membership Inference Defense`);
        lines.push(`        //   - Use dropout at inference time (stochastic predictions)`);
        lines.push(`        //   - Regularization: L2 penalty, weight decay`);
        lines.push(`        //   - Prevent attackers from determining if sample was in training set`);
        lines.push(``);
        lines.push(`        // STEP 5: Robustness Evaluation`);
        lines.push(`        //   - Test against white-box attacks (PGD-40 with ε=8/255)`);
        lines.push(`        //   - Measure certified robustness (randomized smoothing)`);
        lines.push(`        //   - Report: Clean accuracy vs Adversarial accuracy`);
        lines.push(``);
        lines.push(`        // RETURN: Hardened model`);
        lines.push(`    }`);
        lines.push(`}`);
    } else if (cls.name.includes('ModelServing') || cls.name.includes('Inference')) {
        lines.push(`// ML Model Serving with Security Controls`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    predictSecure(input: Tensor): Prediction {`);
        lines.push(`        // STEP 1: Input Validation`);
        lines.push(`        //   - Check input shape, dtype, range`);
        lines.push(`        //   - Detect adversarial perturbations (statistical tests)`);
        lines.push(`        //   - Reject inputs with high entropy or unusual patterns`);
        lines.push(``);
        lines.push(`        // STEP 2: Inference with Defense`);
        lines.push(`        //   - Apply input transformation (JPEG compression, bit depth reduction)`);
        lines.push(`        //   - Use ensemble of models (majority vote)`);
        lines.push(`        //   - Run model with dropout enabled (uncertainty estimation)`);
        lines.push(``);
        lines.push(`        // STEP 3: Output Sanitization`);
        lines.push(`        //   - Clip confidence scores (prevent overconfidence)`);
        lines.push(`        //   - Add calibrated uncertainty estimates`);
        lines.push(`        //   - Redact sensitive predictions if confidence < threshold`);
        lines.push(``);
        lines.push(`        // STEP 4: Logging & Monitoring`);
        lines.push(`        //   - Log prediction confidence distribution`);
        lines.push(`        //   - Alert on suspicious patterns (drift detection)`);
        lines.push(`        //   - Track model performance over time`);
        lines.push(`    }`);
        lines.push(`}`);
    }
    
    return lines.join('\n');
}

/**
 * Network Security - IDS/IPS, Packet Analysis
 */
function generateNetworkSecPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    
    if (cls.name.includes('IDS') || cls.name.includes('IPS') || cls.name.includes('PacketAnalyzer')) {
        lines.push(`// Network IDS/IPS - Intrusion Detection/Prevention System`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    analyzeTraffic(packet: NetworkPacket): ThreatAssessment {`);
        lines.push(`        // STEP 1: Packet Capture & Parsing`);
        lines.push(`        //   - Capture via libpcap, AF_PACKET (Linux)`);
        lines.push(`        //   - Parse headers: Ethernet → IP → TCP/UDP → Application`);
        lines.push(`        //   - Extract 5-tuple: (src_ip, dst_ip, src_port, dst_port, protocol)`);
        lines.push(``);
        lines.push(`        // STEP 2: Signature-Based Detection (Snort rules)`);
        lines.push(`        //   - Match against known attack signatures:`);
        lines.push(`        //     • Port scan: SYN to multiple ports in short time`);
        lines.push(`        //     • SQL injection: HTTP payload contains "UNION SELECT"`);
        lines.push(`        //     • Malware C2: Known C2 server IPs/domains`);
        lines.push(`        //   - Use Boyer-Moore for fast string matching`);
        lines.push(``);
        lines.push(`        // STEP 3: Anomaly-Based Detection (ML models)`);
        lines.push(`        //   - Extract features: packet size, inter-arrival time, flags`);
        lines.push(`        //   - Compare to baseline (trained on normal traffic)`);
        lines.push(`        //   - Detect: DDoS (traffic spike), data exfiltration (large outbound)`);
        lines.push(``);
        lines.push(`        // STEP 4: Protocol Analysis`);
        lines.push(`        //   - Verify protocol compliance (malformed packets)`);
        lines.push(`        //   - Detect protocol abuse (HTTP smuggling, fragmentation attacks)`);
        lines.push(``);
        lines.push(`        // STEP 5: Action Decision (IPS only)`);
        lines.push(`        //   - If threat detected:`);
        lines.push(`        //     • Log alert (severity, timestamp, packet details)`);
        lines.push(`        //     • DROP packet (IPS mode)`);
        lines.push(`        //     • Update firewall rules (block source IP)`);
        lines.push(`        //     • Alert SOC team`);
        lines.push(``);
        lines.push(`        // RETURN: Threat assessment and action taken`);
        lines.push(`    }`);
        lines.push(`}`);
    } else if (cls.name.includes('DPI') || cls.name.includes('DeepPacket')) {
        lines.push(`// Deep Packet Inspection - Application Layer Analysis`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    inspectApplicationLayer(packet: NetworkPacket): ApplicationData {`);
        lines.push(`        // STEP 1: Reconstruct TCP Stream`);
        lines.push(`        //   - Reassemble fragmented packets`);
        lines.push(`        //   - Handle out-of-order delivery`);
        lines.push(`        //   - Track sequence numbers`);
        lines.push(``);
        lines.push(`        // STEP 2: Protocol Detection`);
        lines.push(`        //   - Identify application protocol (HTTP, DNS, SSH, TLS)`);
        lines.push(`        //   - Use port number + payload heuristics`);
        lines.push(``);
        lines.push(`        // STEP 3: Extract Application Data`);
        lines.push(`        //   HTTP: URLs, headers, POST data`);
        lines.push(`        //   DNS: Queried domains, resolved IPs`);
        lines.push(`        //   TLS: SNI (Server Name Indication), certificate`);
        lines.push(``);
        lines.push(`        // STEP 4: Content Inspection`);
        lines.push(`        //   - Scan for malware signatures`);
        lines.push(`        //   - Data loss prevention (DLP): detect PII, credit cards`);
        lines.push(`        //   - Policy enforcement: block file types, URLs`);
        lines.push(`    }`);
        lines.push(`}`);
    }
    
    return lines.join('\n');
}

/**
 * Web Security - WAF, Bot Detection
 */
function generateWebSecPseudocode(cls: ClassDefinition, language: string): string {
    const lines: string[] = [];
    
    if (cls.name.includes('WAF') || cls.name.includes('WebFirewall')) {
        lines.push(`// Web Application Firewall - HTTP Traffic Filtering`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    filterHttpRequest(request: HttpRequest): FilterDecision {`);
        lines.push(`        // STEP 1: Rate Limiting`);
        lines.push(`        //   - Track requests per IP using sliding window (Redis)`);
        lines.push(`        //   - Limit: 100 requests per minute per IP`);
        lines.push(`        //   - Exponential backoff for repeat offenders`);
        lines.push(``);
        lines.push(`        // STEP 2: Signature-Based Filtering (ModSecurity rules)`);
        lines.push(`        //   SQL Injection:`);
        lines.push(`        //   - Pattern: (UNION|SELECT|DROP|INSERT|UPDATE|DELETE).*FROM`);
        lines.push(`        //   XSS:`);
        lines.push(`        //   - Pattern: <script|javascript:|onerror=|onload=`);
        lines.push(`        //   Path Traversal:`);
        lines.push(`        //   - Pattern: \\.\\./|\\.\\.\\\\ in URL path`);
        lines.push(``);
        lines.push(`        // STEP 3: Semantic Analysis`);
        lines.push(`        //   - Parse request as SQL/HTML/JavaScript`);
        lines.push(`        //   - Detect syntactically valid but malicious payloads`);
        lines.push(`        //   - Example: Encoded payloads, polyglot attacks`);
        lines.push(``);
        lines.push(`        // STEP 4: Bot Detection`);
        lines.push(`        //   - Check User-Agent header (known bot signatures)`);
        lines.push(`        //   - JavaScript challenge (render page, execute JS)`);
        lines.push(`        //   - CAPTCHA for suspicious traffic`);
        lines.push(`        //   - Behavioral analysis: Mouse movements, typing patterns`);
        lines.push(``);
        lines.push(`        // STEP 5: Geo-Blocking & IP Reputation`);
        lines.push(`        //   - Check source IP against threat intelligence feeds`);
        lines.push(`        //   - Block requests from high-risk countries (configurable)`);
        lines.push(`        //   - Allow whitelist IPs to bypass checks`);
        lines.push(``);
        lines.push(`        // RETURN: ALLOW, BLOCK, or CHALLENGE`);
        lines.push(`    }`);
        lines.push(`}`);
    } else if (cls.name.includes('CSRF') || cls.name.includes('TokenValidator')) {
        lines.push(`// CSRF Protection - Token-Based Validation`);
        lines.push(`class ${cls.name} {`);
        lines.push(`    validateCSRFToken(request: HttpRequest): boolean {`);
        lines.push(`        // STEP 1: Extract Token from Request`);
        lines.push(`        //   - Check header: X-CSRF-Token`);
        lines.push(`        //   - Check POST parameter: csrf_token`);
        lines.push(``);
        lines.push(`        // STEP 2: Verify Token Signature`);
        lines.push(`        //   - HMAC-SHA256(user_session_id + timestamp, secret_key)`);
        lines.push(`        //   - Prevents token forgery`);
        lines.push(``);
        lines.push(`        // STEP 3: Check Token Expiry`);
        lines.push(`        //   - Tokens valid for 1 hour`);
        lines.push(`        //   - Reject expired tokens`);
        lines.push(``);
        lines.push(`        // STEP 4: One-Time Use Validation`);
        lines.push(`        //   - Mark token as used in Redis`);
        lines.push(`        //   - Reject duplicate tokens (replay attacks)`);
        lines.push(`    }`);
        lines.push(`}`);
    }
    
    return lines.join('\n');
}

// ==================== GENERIC LANGUAGE PSEUDOCODE ====================

function generateCppLogicPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${name}.h / ${name}.cpp`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('');
    lines.push(`class ${name} {`);
    lines.push('public:');

    for (const method of cls.methods) {
        lines.push(`    // ${method.description}`);
        lines.push(`    ${method.name}(${simplifyParams(method.params)}):`);
        
        const steps = generateGenericMethodSteps(method.name, name);
        steps.forEach(step => lines.push(`        ${step}`));
        
        lines.push('');
    }

    lines.push('private:');
    for (const prop of cls.properties) {
        lines.push(`    ${prop.type} ${prop.name};  // ${prop.visibility}`);
    }

    lines.push('};');
    lines.push('');
    lines.push('// Security Checklist:');
    lines.push('// - Use smart pointers (unique_ptr, shared_ptr) - NO raw pointers');
    lines.push('// - Bounds checking: Use std::vector instead of C arrays');
    lines.push('// - RAII pattern: Constructor acquires, destructor releases');
    lines.push('// - Avoid buffer overflows: Use std::string, not char*');

    return lines.join('\n');
}

function generateRustLogicPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${toSnakeCase(name)}.rs`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('');
    lines.push(`impl ${name} {`);

    for (const method of cls.methods) {
        lines.push(`    /// ${method.description}`);
        lines.push(`    pub async fn ${toSnakeCase(method.name)}(&self, ${simplifyParams(method.params)}) -> Result<T, Error> {`);
        
        const steps = generateGenericMethodSteps(method.name, name);
        steps.forEach(step => lines.push(`        ${step}`));
        
        lines.push('    }');
        lines.push('');
    }

    lines.push('}');
    lines.push('');
    lines.push('// Rust Safety Notes:');
    lines.push('// - Ownership: Each value has ONE owner');
    lines.push('// - Borrowing: &T (immutable) or &mut T (mutable)');
    lines.push('// - NO .unwrap() in production - use ? operator');
    lines.push('// - Handle ALL Result/Option cases explicitly');

    return lines.join('\n');
}

function generatePythonLogicPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`# ${name}.py`);
    lines.push(`# Purpose: ${cls.purpose}`);
    lines.push('');
    lines.push(`class ${name}:`);

    for (const method of cls.methods) {
        lines.push(`    def ${toSnakeCase(method.name)}(self, ${simplifyParams(method.params)}):`);
        lines.push(`        """`);
        lines.push(`        ${method.description}`);
        lines.push(`        """`);
        
        const steps = generateGenericMethodSteps(method.name, name);
        steps.forEach(step => lines.push(`        ${step}`));
        
        lines.push('');
    }

    return lines.join('\n');
}

function generateTypeScriptLogicPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// ${toKebabCase(name)}.ts`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('');
    lines.push(`export class ${name} {`);

    for (const method of cls.methods) {
        lines.push(`  /**`);
        lines.push(`   * ${method.description}`);
        lines.push(`   */`);
        lines.push(`  async ${method.name}(${simplifyParams(method.params)}): Promise<Result> {`);
        
        const steps = generateGenericMethodSteps(method.name, name);
        steps.forEach(step => lines.push(`    ${step}`));
        
        lines.push('  }');
        lines.push('');
    }

    lines.push('}');

    return lines.join('\n');
}

function generateGenericLogicPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    lines.push(`${cls.name}:`);
    
    for (const method of cls.methods) {
        lines.push(`  ${method.name}(${simplifyParams(method.params)}):`);
        const steps = generateGenericMethodSteps(method.name, cls.name);
        steps.forEach(step => lines.push(`    ${step}`));
        lines.push('');
    }
    
    return lines.join('\n');
}

// ==================== HELPER FUNCTIONS ====================

function generateGenericMethodSteps(methodName: string, className: string): string[] {
    const name = methodName.toLowerCase();
    
    if (name.includes('create') || name.includes('add') || name.includes('insert')) {
        return [
            '// STEP 1: Input Validation',
            '//   - Check required fields are present',
            '//   - Validate data types and formats',
            '//   - Sanitize input to prevent injection',
            '',
            '// STEP 2: Authorization Check',
            '//   - Verify user has CREATE permission',
            '//   - Check rate limits (prevent spam)',
            '',
            '// STEP 3: Business Logic',
            '//   - Generate unique ID (UUID)',
            '//   - Set timestamps (createdAt, updatedAt)',
            '//   - Apply business rules',
            '',
            '// STEP 4: Database Transaction',
            '//   - BEGIN TRANSACTION',
            '//   - INSERT INTO table VALUES (...)',
            '//   - COMMIT (or ROLLBACK on error)',
            '',
            '// STEP 5: Audit Logging',
            '//   - Log action: {userId, action: "CREATE", resourceId, timestamp}',
            '',
            '// RETURN: Created entity with ID'
        ];
    }
    
    if (name.includes('update') || name.includes('modify') || name.includes('edit')) {
        return [
            '// STEP 1: Validate ID exists',
            '//   - Check ID format (UUID/int)',
            '//   - Query database to ensure record exists',
            '',
            '// STEP 2: Authorization',
            '//   - Verify user owns resource OR has UPDATE permission',
            '',
            '// STEP 3: Validate Changes',
            '//   - Check which fields are being updated',
            '//   - Validate new values',
            '',
            '// STEP 4: Optimistic Locking (prevent race conditions)',
            '//   - Check version number matches',
            '//   - UPDATE ... WHERE id = ? AND version = ?',
            '',
            '// STEP 5: Audit Log',
            '//   - Log: {userId, action: "UPDATE", resourceId, changes: {...}}',
            '',
            '// RETURN: Updated entity'
        ];
    }
    
    if (name.includes('delete') || name.includes('remove')) {
        return [
            '// STEP 1: Validate ID',
            '',
            '// STEP 2: Authorization Check',
            '//   - Verify DELETE permission',
            '',
            '// STEP 3: Soft Delete (preferred) or Hard Delete',
            '//   - Soft: UPDATE table SET deletedAt = NOW() WHERE id = ?',
            '//   - Hard: DELETE FROM table WHERE id = ?',
            '',
            '// STEP 4: Cascade Handling',
            '//   - Delete related records if needed',
            '',
            '// STEP 5: Audit Log',
            '//   - Log: {userId, action: "DELETE", resourceId}',
            '',
            '// RETURN: Success confirmation'
        ];
    }
    
    if (name.includes('get') || name.includes('find') || name.includes('fetch')) {
        return [
            '// STEP 1: Input Validation',
            '//   - Validate query parameters',
            '',
            '// STEP 2: Authorization',
            '//   - Check READ permission',
            '//   - Apply row-level security (user can only see their own data)',
            '',
            '// STEP 3: Database Query',
            '//   - SELECT * FROM table WHERE id = ?',
            '//   - Apply pagination if needed (LIMIT, OFFSET)',
            '',
            '// STEP 4: Data Masking (for sensitive fields)',
            '//   - Mask PII (email → e***@example.com)',
            '//   - Hide sensitive fields based on user role',
            '',
            '// STEP 5: Cache Check (optional)',
            '//   - Check Redis cache before DB query',
            '',
            '// RETURN: Entity or List<Entity>'
        ];
    }
    
    if (name.includes('authenticate') || name.includes('login')) {
        return [
            '// STEP 1: Input Validation',
            '//   - Check username/email format',
            '//   - Ensure password is provided',
            '',
            '// STEP 2: Rate Limiting',
            '//   - Check failed attempts (max 5 per 15 min)',
            '//   - Implement exponential backoff',
            '',
            '// STEP 3: Credential Verification',
            '//   - Query user by username',
            '//   - Compare password hash (bcrypt/argon2)',
            '',
            '// STEP 4: MFA Check (if enabled)',
            '//   - Verify TOTP code',
            '',
            '// STEP 5: Session Management',
            '//   - Generate JWT token (HS256/RS256)',
            '//   - Set expiration (15 min access, 7 day refresh)',
            '',
            '// STEP 6: Audit Log',
            '//   - Log: {userId, action: "LOGIN", ip, timestamp}',
            '',
            '// RETURN: {accessToken, refreshToken}'
        ];
    }
    
    // Default generic steps
    return [
        '// STEP 1: Input Validation',
        '// STEP 2: Authorization Check',
        '// STEP 3: Business Logic Processing',
        '// STEP 4: Database Operation',
        '// STEP 5: Audit Logging',
        '// RETURN: Result'
    ];
}

function generateSecurityNotes(cls: ClassDefinition, language: string, moduleName: string): string[] {
    const notes: string[] = [];
    const name = cls.name.toLowerCase();

    // Generic notes
    notes.push('⚠️ Input validation required for ALL public methods');
    notes.push('📝 Audit logging for all data operations (CREATE/UPDATE/DELETE)');

    // Language-specific
    if (language === 'cpp') {
        notes.push('🔒 Use smart pointers (unique_ptr, shared_ptr) - avoid raw pointers');
        notes.push('🛡️ Bounds checking: prefer std::vector over C arrays');
        notes.push('⚡ RAII pattern: Constructor acquires, Destructor releases');
    }

    if (language === 'rust') {
        notes.push('🦀 Ownership rules: Each value has ONE owner');
        notes.push('🔍 NO .unwrap() in production - use ? operator');
        notes.push('✅ Handle ALL Result/Option cases explicitly');
    }

    // Domain-specific
    if (name.includes('auth')) {
        notes.push('🔐 Rate limiting: Max 5 login attempts per 15 minutes');
        notes.push('🔑 MFA enforcement for privileged accounts');
    }

    if (name.includes('payment') || name.includes('transaction')) {
        notes.push('💳 PCI-DSS compliance required');
        notes.push('🔐 Strong encryption for card data (AES-256)');
    }

    if (moduleName.includes('Signal') || moduleName.includes('Crypto')) {
        notes.push('🔐 Use constant-time comparison for MACs (prevent timing attacks)');
        notes.push('🗑️ Zeroize sensitive keys after use');
    }

    return notes;
}

function simplifyParams(params: string): string {
    // Remove complex types, keep just param names for readability
    return params.split(',')
        .map(p => p.split(':')[0].trim())
        .join(', ');
}

function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function toFilename(name: string, language: PseudocodeLanguage): string {
    const base = toSnakeCase(name);
    switch (language) {
        case 'python': return `${base}.py`;
        case 'typescript': return `${toKebabCase(name)}.ts`;
        case 'java': return `${name}.java`;
        case 'go': return `${base}.go`;
        case 'csharp': return `${name}.cs`;
        case 'cpp': return `${name}.cpp`;
        case 'rust': return `${base}.rs`;
        default: return `${base}.txt`;
    }
}