import { VulnerabilityDefinition, VulnCategory } from '../types';

export const VULNERABILITY_CATEGORIES: VulnCategory[] = [
  'Injection',
  'Broken Access Control',
  'Authentication & Session',
  'Server-Side Attacks',
  'Client-Side Attacks',
  'API & Microservices',
  'Cloud & Infrastructure',
  'Business Logic',
  'Cryptographic Failures',
  'File Handling & Deserialization',
  'Information Disclosure',
  'Network & Protocols',
];

export const VULNERABILITIES: VulnerabilityDefinition[] = [
  // -------------------------------------------------------------
  // 1. INJECTION
  // -------------------------------------------------------------
  {
    id: 'sqli',
    name: 'SQL Injection (SQLi)',
    cwe: 'CWE-89',
    category: 'Injection',
    baseSeverity: 'Critical',
    baseCvssScore: 9.3,
    isPopular: true,
    shortDesc: 'Untrusted user input alters database query logic',
    fullDesc: 'SQL Injection occurs when user-supplied data is concatenated or directly interpolated into SQL statements without parameterized queries. Attackers can read sensitive data, alter records, bypass authentication, or execute administrative operations on the underlying database server.',
    remediationAdvice: 'Implement parameterized queries (prepared statements) or ORM binding; never concatenate input directly into SQL statements.',
    typicalHackerOnePayout: { minUsd: 2500, maxUsd: 15000 },
    typicalBugcrowdPayout: { minUsd: 2000, maxUsd: 12000, vrtTier: 'P1' },
    questions: [
      {
        id: 'sqli_type',
        title: 'Which SQL Injection technique did you trigger?',
        description: 'Specify the operational injection style observed in the response',
        options: [
          { id: 'union', label: 'UNION-based query extraction', detail: 'Reflects extracted table columns directly in server response', scoreModifier: 0.4, cvssImpact: { c: 'H' } },
          { id: 'error', label: 'Error-based / Verbose SQL syntax leak', detail: 'Throws verbose syntax errors exposing database metadata and rows', scoreModifier: 0.2, cvssImpact: { c: 'H' } },
          { id: 'blind_bool', label: 'Blind Boolean-based conditional inference', detail: 'Inferring true/false conditions through page response variations', scoreModifier: 0.0, cvssImpact: { c: 'H' } },
          { id: 'time_blind', label: 'Blind Time-based delay (pg_sleep / WAITFOR)', detail: 'Server sleeps execution for specified seconds indicating successful injection', scoreModifier: 0.0, cvssImpact: { c: 'H' } },
          { id: 'stacked', label: 'Stacked Queries (INSERT/UPDATE/DROP command)', detail: 'Allows executing multi-statement queries to alter or delete table records', scoreModifier: 0.6, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'rce_cmd', label: 'RCE via xp_cmdshell / COPY PROGRAM / UDF', detail: 'Escalated from database query to shell command execution on OS host', scoreModifier: 0.8, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
        ],
      },
      {
        id: 'sqli_impact',
        title: 'What data or action was compromised?',
        description: 'Select the proven impact demonstrated in your proof-of-concept',
        options: [
          { id: 'rce_full', label: 'Full Operating System Command Execution / Shell', detail: 'Compromised underlying host operating system via SQL features', scoreModifier: 0.6, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'dump_pii', label: 'Extracted entire database with sensitive customer PII & password hashes', detail: 'Mass customer personally identifiable information or hashed credentials obtained', scoreModifier: 0.4, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'auth_bypass', label: 'Administrative login / Authentication bypass', detail: 'Logged in as super admin without valid credentials', scoreModifier: 0.3, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'limited_tables', label: 'Extracted non-sensitive schema tables or product catalog', detail: 'Read database version, system banners, or public product listings', scoreModifier: -1.2, cvssImpact: { c: 'L' } },
          { id: 'write_tamper', label: 'Tampered with financial records, user roles, or balance', detail: 'Modified records inside the active transactional database', scoreModifier: 0.5, cvssImpact: { i: 'H' } },
        ],
      },
      {
        id: 'sqli_auth',
        title: 'What privilege was needed to trigger the injection?',
        description: 'Select the authentication barrier required to exploit the bug',
        options: [
          { id: 'unauth', label: 'Pre-Authentication (Public guest / Anonymous user)', detail: 'Can be triggered by anyone on public internet without an account', scoreModifier: 0.3, cvssImpact: { pr: 'N' } },
          { id: 'low_priv', label: 'Low-privilege registered user account', detail: 'Requires standard signed-in user account', scoreModifier: -0.3, cvssImpact: { pr: 'L' } },
          { id: 'high_priv', label: 'High-privilege Admin / Internal team role', detail: 'Requires already compromised internal staff or admin session', scoreModifier: -1.5, cvssImpact: { pr: 'H' } },
        ],
      },
    ],
  },
  {
    id: 'nosqli',
    name: 'NoSQL Injection',
    cwe: 'CWE-943',
    category: 'Injection',
    baseSeverity: 'High',
    baseCvssScore: 8.4,
    shortDesc: 'Manipulating MongoDB / Document query operators ($ne, $regex, $gt)',
    fullDesc: 'Occurs in applications using NoSQL document databases like MongoDB when JSON/BSON query operators are directly accepted from user input. Allows bypassing authentication, data extraction via regex timing, or arbitrary collection manipulation.',
    remediationAdvice: 'Sanitize query inputs, use schema validation libraries (Zod, Joi), and avoid passing raw objects directly to MongoDB find/findOne methods.',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 8000 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 6500, vrtTier: 'P2' },
    questions: [
      {
        id: 'nosqli_vector',
        title: 'Which NoSQL operator / vector was exploited?',
        description: 'How was the query logic altered',
        options: [
          { id: 'auth_ne', label: 'Bypassed authentication using {"$ne": null} or {"$gt": ""}', detail: 'Logged in as administrator without valid password', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'regex_extract', label: 'Exfiltrated secret tokens using {"$regex": "^secret"}', detail: 'Extracted password reset tokens or secret keys character by character', scoreModifier: 0.2, cvssImpact: { c: 'H' } },
          { id: 'where_js', label: 'Arbitrary JavaScript execution via $where clause', detail: 'Executed server-side JavaScript engine code inside database process', scoreModifier: 0.8, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'schema_leak', label: 'Leaked non-sensitive collection metadata only', detail: 'Disclosed collection names or record counts without user data', scoreModifier: -1.5, cvssImpact: { c: 'L' } },
        ],
      },
      {
        id: 'nosqli_env',
        title: 'Where was the injection point located?',
        description: 'Environment and scope target',
        options: [
          { id: 'prod_login', label: 'Primary user login / password recovery endpoint', detail: 'Critical public gateway affecting all platform accounts', scoreModifier: 0.4 },
          { id: 'api_search', label: 'Authenticated search / filter API endpoint', detail: 'Restricted to search query parameters inside portal', scoreModifier: -0.2 },
          { id: 'internal_tool', label: 'Internal administrative dashboard only', detail: 'Requires admin credentials to access vulnerable endpoint', scoreModifier: -1.2 },
        ],
      },
    ],
  },
  {
    id: 'rce',
    name: 'Remote Code Execution (RCE) / Command Injection',
    cwe: 'CWE-78',
    category: 'Injection',
    baseSeverity: 'Critical',
    baseCvssScore: 9.8,
    isPopular: true,
    shortDesc: 'Execution of arbitrary system commands on the host operating system',
    fullDesc: 'Command Injection occurs when an application passes unsafe user-supplied data to a system shell (e.g., system(), exec(), Runtime.getRuntime().exec()). This grants the attacker full execution power over the web server or container.',
    remediationAdvice: 'Avoid passing user input to system shells. Use native programmatic APIs instead of spawning system processes. If system commands are unavoidable, strictly whitelist allowed arguments.',
    typicalHackerOnePayout: { minUsd: 5000, maxUsd: 25000 },
    typicalBugcrowdPayout: { minUsd: 4000, maxUsd: 20000, vrtTier: 'P1' },
    questions: [
      {
        id: 'rce_privs',
        title: 'What execution privileges did your payload achieve?',
        description: 'The user account / context running the command',
        options: [
          { id: 'root', label: 'Root / NT AUTHORITY\\SYSTEM / Full Host Admin', detail: 'Complete unchecked takeover of physical or host virtual machine', scoreModifier: 0.4, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'service_user', label: 'Standard web service user (e.g., www-data, nginx, appuser)', detail: 'Can read local filesystem, source code, and pivot internally', scoreModifier: 0.1, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'hardened_container', label: 'Hardened Read-Only container with network egress blocked', detail: 'Isolated sandbox with ephemeral files and no outbound shell connections', scoreModifier: -0.8, cvssImpact: { c: 'H', i: 'L' } },
          { id: 'blind_oob', label: 'Blind RCE confirmed only via DNS/ICMP pingback (no stdout)', detail: 'Verified execution via Burp Collaborator or Interactsh ping', scoreModifier: -0.2, cvssImpact: { c: 'H', i: 'H' } },
        ],
      },
      {
        id: 'rce_auth',
        title: 'Authentication required to exploit?',
        description: 'Entry barrier required by the attacker',
        options: [
          { id: 'preauth', label: 'Pre-Authentication (Unauthenticated remote internet trigger)', detail: 'Anyone can exploit without an account or session token', scoreModifier: 0.3, cvssImpact: { pr: 'N' } },
          { id: 'authenticated_user', label: 'Requires logged-in user account', detail: 'Normal authenticated user can trigger command injection', scoreModifier: -0.4, cvssImpact: { pr: 'L' } },
          { id: 'admin_only', label: 'Restricted to authenticated Admin portal feature', detail: 'Only existing administrators can execute commands', scoreModifier: -1.5, cvssImpact: { pr: 'H' } },
        ],
      },
      {
        id: 'rce_scope',
        title: 'Target host infrastructure context',
        description: 'What environment does this host belong to?',
        options: [
          { id: 'prod_core', label: 'Production cluster with direct access to databases & secrets', detail: 'Houses production customer data and internal microservice tokens', scoreModifier: 0.3 },
          { id: 'staging_dev', label: 'Staging / QA / UAT testing environment', detail: 'Non-production test data, but connected to corporate network', scoreModifier: -0.5 },
          { id: 'third_party_app', label: 'Isolated third-party SaaS connector / sandbox', detail: 'No direct access to core customer records', scoreModifier: -1.0 },
        ],
      },
    ],
  },
  {
    id: 'ssti',
    name: 'Server-Side Template Injection (SSTI)',
    cwe: 'CWE-1336',
    category: 'Injection',
    baseSeverity: 'Critical',
    baseCvssScore: 9.6,
    isPopular: true,
    shortDesc: 'Template engines evaluate malicious embedded expressions leading to RCE',
    fullDesc: 'SSTI occurs when user input is concatenated directly into server-side template engines (such as Jinja2, Twig, Freemarker, Thymeleaf, Handlebars, Mako). Can escalate from simple arithmetic evaluation to full remote code execution.',
    remediationAdvice: 'Pass user input into template context variables rather than compiling template strings dynamically; enable template sandboxing.',
    typicalHackerOnePayout: { minUsd: 3000, maxUsd: 15000 },
    typicalBugcrowdPayout: { minUsd: 2500, maxUsd: 12500, vrtTier: 'P1' },
    questions: [
      {
        id: 'ssti_engine',
        title: 'What engine and impact was proven?',
        description: 'The proven severity of your template payload',
        options: [
          { id: 'rce_popen', label: 'Full RCE achieved (e.g. Jinja2 __mro__, Twig system())', detail: 'Executed system shell commands through template engine objects', scoreModifier: 0.4, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'file_read', label: 'Arbitrary local file read (e.g., /etc/passwd or env vars)', detail: 'Read server configuration, source code, or credentials', scoreModifier: -0.3, cvssImpact: { c: 'H' } },
          { id: 'math_eval', label: 'Calculated expressions only (e.g., {{7*7}} returns 49) without sandbox escape', detail: 'Proved template evaluation occurred but restricted by strict sandbox', scoreModifier: -1.8, cvssImpact: { c: 'L' } },
          { id: 'xss_reflection', label: 'Client-side reflection only (acts like stored/reflected XSS)', detail: 'Template rendered on client without server-side shell access', scoreModifier: -2.2, cvssImpact: { c: 'L', i: 'L' } },
        ],
      },
      {
        id: 'ssti_priv',
        title: 'Authentication prerequisite',
        description: 'Level of access required',
        options: [
          { id: 'unauthenticated', label: 'Unauthenticated (e.g., in email template, public quote generator)', detail: 'Triggerable by anonymous external requests', scoreModifier: 0.3, cvssImpact: { pr: 'N' } },
          { id: 'user_auth', label: 'Authenticated user (e.g., custom user profile or invoice template)', detail: 'Standard user dashboard customization feature', scoreModifier: -0.3, cvssImpact: { pr: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'crlf',
    name: 'CRLF Injection / HTTP Response Splitting',
    cwe: 'CWE-113',
    category: 'Injection',
    baseSeverity: 'Medium',
    baseCvssScore: 5.3,
    shortDesc: 'Carriage Return Line Feed injection into HTTP response headers',
    fullDesc: 'When unvalidated input containing \\r\\n sequences is injected into HTTP response headers, attackers can inject custom response headers (Set-Cookie) or split the HTTP response to inject arbitrary HTML/JavaScript bodies.',
    remediationAdvice: 'Strip all carriage return and line feed characters (\\r, \\n) from values passed to HTTP headers.',
    typicalHackerOnePayout: { minUsd: 300, maxUsd: 1500 },
    typicalBugcrowdPayout: { minUsd: 250, maxUsd: 1200, vrtTier: 'P3' },
    questions: [
      {
        id: 'crlf_impact',
        title: 'What was achieved through header injection?',
        description: 'Demonstrated exploitation vector',
        options: [
          { id: 'xss_split', label: 'Full HTTP Response Splitting leading to XSS / Fake HTML body', detail: 'Injected complete malicious HTML body rendered in victim browser', scoreModifier: 1.5, cvssImpact: { c: 'L', i: 'L' } },
          { id: 'cookie_inject', label: 'Injected arbitrary Set-Cookie header (Session Fixation)', detail: 'Forces session cookie on victim browser or overwrites security flags', scoreModifier: 0.5, cvssImpact: { i: 'L' } },
          { id: 'cors_bypass', label: 'Injected Access-Control-Allow-Origin: * header', detail: 'Loosened browser CORS restrictions on sensitive endpoints', scoreModifier: 0.2, cvssImpact: { c: 'L' } },
          { id: 'header_only', label: 'Arbitrary custom header injected (X-Custom: test) with no security impact', detail: 'Injected benign header value without browser execution or cookie overwrite', scoreModifier: -1.8, cvssImpact: { c: 'N' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. BROKEN ACCESS CONTROL
  // -------------------------------------------------------------
  {
    id: 'idor',
    name: 'Insecure Direct Object Reference (IDOR / BOLA)',
    cwe: 'CWE-639',
    category: 'Broken Access Control',
    baseSeverity: 'High',
    baseCvssScore: 8.2,
    isPopular: true,
    shortDesc: 'Accessing or altering other users records by swapping object IDs',
    fullDesc: 'IDOR (or Broken Object Level Authorization - BOLA) happens when an application provides direct access to objects based on user-supplied IDs (e.g. /api/users/1029/receipts) without validating that the authenticated user owns or is authorized to view that resource.',
    remediationAdvice: 'Enforce object-level permission checks in backend controllers verifying current session ownership against the target entity ID.',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 8000 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 7000, vrtTier: 'P2' },
    questions: [
      {
        id: 'idor_action',
        title: 'What operation can be performed via the swapped ID?',
        description: 'The level of CRUD permissions allowed',
        options: [
          { id: 'account_takeover', label: 'Full Account Takeover (Reset another user password or change email)', detail: 'Directly modify password reset or email of any target account', scoreModifier: 1.6, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'write_delete', label: 'Modify or delete other users sensitive resources (Orders, Documents, Messages)', detail: 'State-changing mutation affecting other accounts', scoreModifier: 0.8, cvssImpact: { i: 'H' } },
          { id: 'read_pii', label: 'View sensitive PII (Passport, SSN, Credit card, Private chat messages)', detail: 'Exposes private, confidential personal data of all users', scoreModifier: 0.3, cvssImpact: { c: 'H' } },
          { id: 'read_low', label: 'View low-sensitivity metadata (Public display name, Avatar URL, Created date)', detail: 'Data that is already semi-public or low confidentiality', scoreModifier: -2.5, cvssImpact: { c: 'L' } },
        ],
      },
      {
        id: 'idor_scope',
        title: 'Target user scope and multi-tenancy impact',
        description: 'Who can be targeted?',
        options: [
          { id: 'cross_tenant', label: 'Cross-Tenant / Cross-Organization (Company A accessing Company B data)', detail: 'Breaches corporate boundary between separate enterprise accounts', scoreModifier: 0.5 },
          { id: 'intra_tenant', label: 'Intra-Organization (Colleague to Colleague within same company)', detail: 'Within same company workspace but bypassing role limits', scoreModifier: -0.3 },
          { id: 'sequential', label: 'Predictable sequential integer IDs (1, 2, 3...) enabling mass scraping', detail: 'Trivial automated dumping of entire platform records', scoreModifier: 0.4 },
          { id: 'uuid_v4', label: 'High-entropy GUID / UUID (hard to guess without leaking elsewhere)', detail: 'Requires knowing or intercepting 128-bit random UUID', scoreModifier: -0.6 },
        ],
      },
      {
        id: 'idor_auth',
        title: 'Authentication required for IDOR endpoint',
        description: 'What credentials did you need to supply?',
        options: [
          { id: 'unauthenticated', label: 'Completely Unauthenticated (No cookies or bearer tokens needed)', detail: 'Public API endpoint unprotected against unauthorized access', scoreModifier: 0.6, cvssImpact: { pr: 'N' } },
          { id: 'standard_user', label: 'Standard logged-in user account', detail: 'Normal authenticated member session', scoreModifier: 0.0, cvssImpact: { pr: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'priv_esc_vert',
    name: 'Vertical Privilege Escalation (BFLA)',
    cwe: 'CWE-269',
    category: 'Broken Access Control',
    baseSeverity: 'High',
    baseCvssScore: 8.8,
    isPopular: true,
    shortDesc: 'Regular user accesses administrative roles and capabilities',
    fullDesc: 'Vertical privilege escalation occurs when a user with basic user permissions can invoke administrative or supervisory functions, endpoints, or APIs (Broken Function Level Authorization - BFLA).',
    remediationAdvice: 'Implement role-based access control (RBAC) middleware on every privileged endpoint; never rely on UI hiding or client-side checks alone.',
    typicalHackerOnePayout: { minUsd: 2000, maxUsd: 10000 },
    typicalBugcrowdPayout: { minUsd: 1800, maxUsd: 8500, vrtTier: 'P1' },
    questions: [
      {
        id: 'priv_action',
        title: 'What administrative functionality was accessed?',
        description: 'The capabilities unlocked by the escalation',
        options: [
          { id: 'super_admin', label: 'Super Admin platform controls (Manage all tenants, billing, server keys)', detail: 'Highest privilege level on entire SaaS platform', scoreModifier: 0.8, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'org_admin', label: 'Organization Admin (Invite users, change roles within single workspace)', detail: 'Tenant-wide administration privileges', scoreModifier: 0.2, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'moderator', label: 'Moderator / Reviewer capabilities (Flag posts, view audit log)', detail: 'Limited elevated viewing or review rights', scoreModifier: -1.0, cvssImpact: { c: 'L', i: 'L' } },
        ],
      },
      {
        id: 'priv_mechanism',
        title: 'How was the escalation achieved?',
        description: 'The flaw triggering the bypass',
        options: [
          { id: 'parameter_role', label: 'Mass Assignment / Parameter tampering (role: "admin", is_admin: true)', detail: 'Backend directly saved client JSON parameter into database record', scoreModifier: 0.2 },
          { id: 'hidden_endpoint', label: 'Directly calling unauthenticated/unprotected /api/admin/* endpoints', detail: 'Missing authorization check on controller method', scoreModifier: 0.3 },
          { id: 'http_method', label: 'HTTP verb tampering (changing GET to PUT/POST or HEAD bypass)', detail: 'Firewall or gateway only protected specific HTTP methods', scoreModifier: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'path_traversal',
    name: 'Path Traversal / Local File Inclusion (LFI)',
    cwe: 'CWE-22',
    category: 'Broken Access Control',
    baseSeverity: 'High',
    baseCvssScore: 8.6,
    isPopular: true,
    shortDesc: 'Traversing directory structure (../) to read arbitrary system files',
    fullDesc: 'Path Traversal (also known as Directory Traversal or Local File Inclusion) allows attackers to read arbitrary files on the server running an application by injecting dot-dot-slash (../../) sequences into file download or template parameters.',
    remediationAdvice: 'Use path canonicalization checks, validate filenames against an alphanumeric whitelist, or store files with index references rather than user filenames.',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 8000 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 7000, vrtTier: 'P2' },
    questions: [
      {
        id: 'lfi_read',
        title: 'What files were successfully read or retrieved?',
        description: 'Sensitivity of exposed files',
        options: [
          { id: 'source_code', label: 'Application source code, .env file with production secrets & API keys', detail: 'Exposed master database passwords, AWS keys, JWT signing secret', scoreModifier: 0.8, cvssImpact: { c: 'H' } },
          { id: 'os_passwd', label: 'System files (/etc/passwd, win.ini, system logs)', detail: 'Confirmed file read with user enumeration and system fingerprints', scoreModifier: 0.1, cvssImpact: { c: 'H' } },
          { id: 'log_poison_rce', label: 'Log Poisoning / PHP wrapper leading to Remote Code Execution', detail: 'Escalated file inclusion into full web shell execution', scoreModifier: 1.2, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'public_assets', label: 'Only public static assets or CSS within web root', detail: 'Unable to escape web directory, only reads files already publicly accessible', scoreModifier: -3.5, cvssImpact: { c: 'L' } },
        ],
      },
      {
        id: 'lfi_write',
        title: 'Can you also write or overwrite files?',
        description: 'Did traversal allow arbitrary file upload/write?',
        options: [
          { id: 'read_only', label: 'Read-only traversal', detail: 'Can read files but cannot upload or overwrite', scoreModifier: 0.0 },
          { id: 'arbitrary_write', label: 'Arbitrary file write (Zip Slip, path traversal in file upload)', detail: 'Can overwrite cron jobs, authorized_keys, or web shell files', scoreModifier: 1.0, cvssImpact: { i: 'H' } },
        ],
      },
    ],
  },
  {
    id: 'cors_misconfig',
    name: 'CORS Misconfiguration',
    cwe: 'CWE-942',
    category: 'Broken Access Control',
    baseSeverity: 'Medium',
    baseCvssScore: 6.5,
    shortDesc: 'Excessive Cross-Origin Resource Sharing trust allowing cross-origin data theft',
    fullDesc: 'Occurs when an API endpoint dynamically reflects arbitrary Origin headers with Access-Control-Allow-Credentials: true or trusts attacker subdomains (e.g. victim.com.attacker.com or null origin), allowing malicious websites to read victim private data.',
    remediationAdvice: 'Specify an explicit strict whitelist of allowed trusted origins; never reflect user-supplied Origin headers with credentials enabled.',
    typicalHackerOnePayout: { minUsd: 500, maxUsd: 3000 },
    typicalBugcrowdPayout: { minUsd: 400, maxUsd: 2500, vrtTier: 'P3' },
    questions: [
      {
        id: 'cors_creds',
        title: 'Is Access-Control-Allow-Credentials enabled and sensitive data exposed?',
        description: 'The security implication of the CORS headers',
        options: [
          { id: 'creds_pii', label: 'Credentials allowed (true) + Leaks private PII / API keys on malicious site', detail: 'Full authenticated cross-origin data theft via JavaScript fetch()', scoreModifier: 1.0, cvssImpact: { c: 'H' } },
          { id: 'null_origin', label: 'Trusts Origin: "null" with credentials (exploitable via iframe sandbox)', detail: 'Can steal authenticated data from sandboxed iframe', scoreModifier: 0.5, cvssImpact: { c: 'H' } },
          { id: 'wildcard_public', label: 'Access-Control-Allow-Origin: * on purely public endpoints (No credentials)', detail: 'Standard public API behavior with no confidential data leak', scoreModifier: -3.5, cvssImpact: { c: 'N' } },
        ],
      },
      {
        id: 'cors_origin_type',
        title: 'Which origin pattern was accepted?',
        description: 'Origin validation bypass technique',
        options: [
          { id: 'any_origin', label: 'Reflects ANY arbitrary domain (e.g., evil-hacker.com)', detail: 'Complete trust in all domains on the internet', scoreModifier: 0.3 },
          { id: 'subdomain_trust', label: 'Trusts all subdomains (*.target.com) where subdomain takeover is possible', detail: 'Requires chaining with a vulnerable or dangling subdomain', scoreModifier: -0.2 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. SERVER-SIDE ATTACKS
  // -------------------------------------------------------------
  {
    id: 'ssrf',
    name: 'Server-Side Request Forgery (SSRF)',
    cwe: 'CWE-918',
    category: 'Server-Side Attacks',
    baseSeverity: 'Critical',
    baseCvssScore: 9.1,
    isPopular: true,
    shortDesc: 'Server makes unauthorized network requests to internal or cloud services',
    fullDesc: 'SSRF occurs when a web application fetches a remote resource without validating the user-supplied URL. Attackers can coerce the server into connecting to internal network services, loopback interfaces (127.0.0.1), or cloud metadata services (e.g. AWS 169.254.169.254).',
    remediationAdvice: 'Enforce strict URL whitelisting, disable HTTP redirects, block private IP ranges (RFC 1918), and enforce IMDSv2 with token hops on AWS.',
    typicalHackerOnePayout: { minUsd: 3000, maxUsd: 15000 },
    typicalBugcrowdPayout: { minUsd: 2500, maxUsd: 12000, vrtTier: 'P1' },
    questions: [
      {
        id: 'ssrf_target',
        title: 'What internal target or response was successfully fetched?',
        description: 'The proven destination reached by the server',
        options: [
          { id: 'aws_imds', label: 'Cloud Metadata (AWS IMDSv1 169.254.169.254 IAM credentials)', detail: 'Extracted temporary AWS SecretKey and SessionToken with cloud access', scoreModifier: 0.8, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'internal_admin', label: 'Internal microservice / unauthenticated Redis / Elasticsearch / Admin panel', detail: 'Accessed internal network services unreachable from public internet', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'L' } },
          { id: 'rce_pivot', label: 'Achieved RCE through internal Redis write / FastCGI / Gopher protocol', detail: 'Pivoted from SSRF request into system command execution', scoreModifier: 1.0, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'port_scan', label: 'Internal Port Scanning only (Open vs Closed timing/error differences)', detail: 'Can determine which internal ports are open without reading content', scoreModifier: -1.5, cvssImpact: { c: 'L' } },
          { id: 'blind_dns', label: 'Blind SSRF with only outbound DNS query (No HTTP response content)', detail: 'Pingback received on DNS server but cannot read internal data or headers', scoreModifier: -2.0, cvssImpact: { c: 'L' } },
        ],
      },
      {
        id: 'ssrf_auth',
        title: 'Authentication level required',
        description: 'Privileges needed to trigger the fetch request',
        options: [
          { id: 'unauth_public', label: 'Unauthenticated (Webhook tester, public URL preview, image fetcher)', detail: 'Publicly reachable by any external user', scoreModifier: 0.3, cvssImpact: { pr: 'N' } },
          { id: 'auth_user', label: 'Standard logged-in user feature (e.g., avatar import from URL)', detail: 'Requires registered account', scoreModifier: -0.2, cvssImpact: { pr: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'xxe',
    name: 'XML External Entity (XXE) Injection',
    cwe: 'CWE-611',
    category: 'Server-Side Attacks',
    baseSeverity: 'High',
    baseCvssScore: 8.6,
    shortDesc: 'Unsafe XML parsing evaluates external DTD entities exposing files and SSRF',
    fullDesc: 'XXE occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser. Can lead to disclosure of confidential files, denial of service (Billion Laughs), and server-side request forgery.',
    remediationAdvice: 'Disable external DTDs (DOCTYPE declarations) and external entity resolution completely in the XML parser configuration.',
    typicalHackerOnePayout: { minUsd: 2000, maxUsd: 10000 },
    typicalBugcrowdPayout: { minUsd: 1500, maxUsd: 8000, vrtTier: 'P1' },
    questions: [
      {
        id: 'xxe_impact',
        title: 'What was achieved through the external entity?',
        description: 'Demonstrated result of entity resolution',
        options: [
          { id: 'file_read_inband', label: 'In-band Arbitrary File Read (file:///etc/passwd reflected in response)', detail: 'Direct file contents returned directly in XML reply', scoreModifier: 0.5, cvssImpact: { c: 'H' } },
          { id: 'oob_exfil', label: 'Out-of-band (OOB) file exfiltration via malicious external DTD', detail: 'Sent base64-encoded file contents to external attacker server', scoreModifier: 0.4, cvssImpact: { c: 'H' } },
          { id: 'ssrf_cloud', label: 'SSRF to Cloud Metadata or internal network endpoints', detail: 'Reaching internal IP resources via SYSTEM entity URL', scoreModifier: 0.3, cvssImpact: { c: 'H' } },
          { id: 'dos_billion', label: 'Denial of Service only (Billion Laughs / XML entity expansion bomb)', detail: 'Crashed worker thread without extracting data', scoreModifier: -1.8, cvssImpact: { a: 'H', c: 'N' } },
        ],
      },
    ],
  },
  {
    id: 'insecure_deserialization',
    name: 'Insecure Deserialization',
    cwe: 'CWE-502',
    category: 'File Handling & Deserialization',
    baseSeverity: 'Critical',
    baseCvssScore: 9.8,
    isPopular: true,
    shortDesc: 'Deserializing untrusted object streams triggers malicious gadget chains',
    fullDesc: 'Insecure Deserialization happens when untrusted user data is passed to deserialization engines (Java serialization, Python pickle, PHP unserialize, .NET BinaryFormatter, Ruby Marshal). Attackers craft serialized payloads executing arbitrary code.',
    remediationAdvice: 'Never deserialize untrusted input with polymorphic/native object deserializers; migrate to plain data formats like JSON with strict schemas.',
    typicalHackerOnePayout: { minUsd: 4000, maxUsd: 20000 },
    typicalBugcrowdPayout: { minUsd: 3500, maxUsd: 18000, vrtTier: 'P1' },
    questions: [
      {
        id: 'deser_outcome',
        title: 'What was executed via the gadget chain?',
        description: 'Impact on target system',
        options: [
          { id: 'rce_chain', label: 'Remote Code Execution (ysoserial / gadget chain pop shell)', detail: 'Full control of application server operating system', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'auth_tamper', label: 'Authentication Bypass / Privilege Tampering via object state manipulation', detail: 'Altered serialized session object attributes without RCE', scoreModifier: -0.4, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'dos_loop', label: 'CPU Denial of Service (Hash collision or infinite loop in deserializer)', detail: 'Hangs application thread on deserializing payload', scoreModifier: -2.2, cvssImpact: { a: 'H', c: 'N' } },
        ],
      },
    ],
  },
  {
    id: 'request_smuggling',
    name: 'HTTP Request Smuggling (CL.TE / TE.CL / H2)',
    cwe: 'CWE-444',
    category: 'Server-Side Attacks',
    baseSeverity: 'High',
    baseCvssScore: 8.9,
    shortDesc: 'Frontend proxy and backend server disagree on HTTP request boundaries',
    fullDesc: 'HTTP Request Smuggling arises when frontend reverse proxies and backend servers parse Content-Length and Transfer-Encoding headers differently. Attackers smuggle requests that poison shared TCP connections, hijack other users requests, or bypass frontend security controls.',
    remediationAdvice: 'Normalize HTTP/1.1 connections, use HTTP/2 exclusively end-to-end, or disable HTTP connection reuse for requests with ambiguous headers.',
    typicalHackerOnePayout: { minUsd: 2500, maxUsd: 12000 },
    typicalBugcrowdPayout: { minUsd: 2000, maxUsd: 10000, vrtTier: 'P1' },
    questions: [
      {
        id: 'smuggle_impact',
        title: 'What was achieved through smuggled request?',
        description: 'Proven exploit chain',
        options: [
          { id: 'credential_hijack', label: 'Hijacked other users requests and captured session cookies / Authorization tokens', detail: 'Captured live incoming requests from unrelated platform users', scoreModifier: 0.7, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'cache_poison', label: 'Web Cache Poisoning serving malicious payload to all visitors', detail: 'Poisoned homepage or shared JS bundle for massive visitor compromise', scoreModifier: 0.6, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'acl_bypass', label: 'Bypassed frontend WAF / reverse proxy access controls to reach internal admin', detail: 'Accessed internal administration routes blocked from public internet', scoreModifier: 0.1, cvssImpact: { c: 'H' } },
          { id: 'timing_only', label: 'Connection timeout / desync confirmed via socket delay only', detail: 'Socket delay observed but no request capture or cache poisoning demonstrated', scoreModifier: -2.0, cvssImpact: { c: 'L' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. CLIENT-SIDE ATTACKS
  // -------------------------------------------------------------
  {
    id: 'stored_xss',
    name: 'Stored Cross-Site Scripting (Stored XSS)',
    cwe: 'CWE-79',
    category: 'Client-Side Attacks',
    baseSeverity: 'High',
    baseCvssScore: 8.1,
    isPopular: true,
    shortDesc: 'Malicious JavaScript is permanently stored in database and executed in victims browsers',
    fullDesc: 'Stored XSS occurs when user-supplied input is stored in the database (comments, profile names, chat messages, tickets) and later rendered in other users browsers without proper HTML entity encoding or sanitization.',
    remediationAdvice: 'Context-aware contextual output encoding, use modern frameworks with automatic escaping (React, Vue), and enforce strict Content Security Policy (CSP).',
    typicalHackerOnePayout: { minUsd: 1000, maxUsd: 6000 },
    typicalBugcrowdPayout: { minUsd: 800, maxUsd: 5000, vrtTier: 'P2' },
    questions: [
      {
        id: 'xss_victim',
        title: 'Where is the payload stored and who executes it?',
        description: 'Target victim demographic',
        options: [
          { id: 'admin_panel', label: 'Admin / Support Staff portal (Triggers when staff views ticket or user list)', detail: 'Executes inside privileged administrative dashboard leading to admin account takeover', scoreModifier: 0.8, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'public_feed', label: 'Public post / comment feed (Triggers for all visitors automatically)', detail: 'Wormable across all active site users viewing public timeline', scoreModifier: 0.3, cvssImpact: { c: 'H', i: 'L' } },
          { id: 'self_xss', label: 'Self-XSS only (Only triggers in the authors own private dashboard profile)', detail: 'Cannot be delivered to another user without physical access or paste trick', scoreModifier: -3.8, cvssImpact: { c: 'N', i: 'N' } },
        ],
      },
      {
        id: 'xss_cookie',
        title: 'Cookie and session takeover potential',
        description: 'Are session tokens accessible to JavaScript?',
        options: [
          { id: 'no_httponly', label: 'Session cookies lack HttpOnly flag (direct exfiltration via document.cookie)', detail: 'Can steal active session cookie directly to attacker server', scoreModifier: 0.4 },
          { id: 'httponly_api', label: 'HttpOnly is present, but XSS can perform API actions on behalf of victim (CSRF style)', detail: 'Can invoke background authenticated POST requests like changing email/password', scoreModifier: 0.1 },
        ],
      },
      {
        id: 'xss_csp',
        title: 'Content Security Policy (CSP) status',
        description: 'Was there an active CSP blocking execution?',
        options: [
          { id: 'no_csp', label: 'No CSP or weak CSP bypassed completely', detail: 'Script executes inline without restrictions', scoreModifier: 0.0 },
          { id: 'csp_bypass', label: 'Strict CSP present and successfully bypassed via JSONP / gadget', detail: 'Demonstrated real execution despite enterprise defensive policy', scoreModifier: 0.4 },
        ],
      },
    ],
  },
  {
    id: 'reflected_xss',
    name: 'Reflected Cross-Site Scripting (Reflected XSS)',
    cwe: 'CWE-79',
    category: 'Client-Side Attacks',
    baseSeverity: 'Medium',
    baseCvssScore: 6.1,
    isPopular: true,
    shortDesc: 'Script payload in URL parameter immediately reflected back in response',
    fullDesc: 'Reflected XSS occurs when an application receives data in an HTTP request (e.g. search term or error message parameter) and includes that data within the immediate response in an unsafe way, requiring victim social engineering to click a link.',
    remediationAdvice: 'HTML encode all reflected input parameters in the template; configure Content-Security-Policy: default-src \'self\'.',
    typicalHackerOnePayout: { minUsd: 500, maxUsd: 2500 },
    typicalBugcrowdPayout: { minUsd: 400, maxUsd: 2000, vrtTier: 'P3' },
    questions: [
      {
        id: 'rxss_domain',
        title: 'On which domain does the reflection occur?',
        description: 'Scope and authority of the vulnerable domain',
        options: [
          { id: 'main_app', label: 'Core authenticated production domain (e.g., app.company.com)', detail: 'Shares session cookies and API tokens with main web application', scoreModifier: 0.4, cvssImpact: { c: 'L', i: 'L' } },
          { id: 'marketing_site', label: 'Static marketing / blog subdomain (e.g., blog.company.com)', detail: 'No authenticated user sessions or sensitive API tokens on this origin', scoreModifier: -1.2, cvssImpact: { c: 'L' } },
          { id: 'sandbox_domain', label: 'Isolated sandboxed asset domain (e.g., user-content.net)', detail: 'Specifically sandboxed without credentials', scoreModifier: -2.5, cvssImpact: { c: 'N' } },
        ],
      },
      {
        id: 'rxss_interaction',
        title: 'User interaction required',
        description: 'How does the victim trigger the script?',
        options: [
          { id: 'simple_click', label: 'Simple link click (e.g., clicking URL in phishing email)', detail: 'Zero additional user interaction required after opening link', scoreModifier: 0.1, cvssImpact: { ui: 'R' } },
          { id: 'complex_action', label: 'Complex interaction (Requires clicking button + pasting value)', detail: 'Low likelihood of real victim falling for multi-step trick', scoreModifier: -1.5 },
        ],
      },
    ],
  },
  {
    id: 'csrf',
    name: 'Cross-Site Request Forgery (CSRF)',
    cwe: 'CWE-352',
    category: 'Client-Side Attacks',
    baseSeverity: 'Medium',
    baseCvssScore: 6.5,
    isPopular: true,
    shortDesc: 'Forces logged-in victim browser to perform unwanted authenticated actions',
    fullDesc: 'CSRF tricks an authenticated user into executing unwanted actions on a web application where they are currently authenticated. If an application relies solely on ambient browser credentials (cookies) without anti-CSRF tokens or SameSite cookie protection.',
    remediationAdvice: 'Set SameSite=Lax or Strict on all session cookies, and implement unpredictable anti-CSRF challenge tokens for all state-changing requests.',
    typicalHackerOnePayout: { minUsd: 500, maxUsd: 3500 },
    typicalBugcrowdPayout: { minUsd: 400, maxUsd: 3000, vrtTier: 'P3' },
    questions: [
      {
        id: 'csrf_action',
        title: 'What action can be performed on behalf of the victim?',
        description: 'The state-changing request executed via CSRF',
        options: [
          { id: 'change_email_pass', label: 'Change email address or password (Direct Account Takeover)', detail: 'Replaces victims credentials with attackers, locking out victim', scoreModifier: 1.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'financial_transfer', label: 'Financial transaction / Order placement / Money transfer', detail: 'Unconsented economic loss directly from victims account', scoreModifier: 1.2, cvssImpact: { i: 'H' } },
          { id: 'delete_content', label: 'Delete user project / post / resource', detail: 'Data loss affecting victims private items', scoreModifier: 0.3, cvssImpact: { i: 'L' } },
          { id: 'minor_pref', label: 'Minor profile preference (Toggle dark mode, update bio text)', detail: 'Cosmetic change with negligible security harm', scoreModifier: -2.0, cvssImpact: { i: 'L' } },
          { id: 'logout_csrf', label: 'Logout CSRF only (/logout endpoint without CSRF protection)', detail: 'Causes victim to be logged out of current session', scoreModifier: -3.8, cvssImpact: { c: 'N', i: 'N' } },
        ],
      },
      {
        id: 'csrf_samesite',
        title: 'SameSite cookie flag configuration',
        description: 'Are modern browser cookies isolated?',
        options: [
          { id: 'none_or_missing', label: 'SameSite=None or No SameSite flag present', detail: 'Cookies sent on all cross-site POST/GET requests', scoreModifier: 0.2 },
          { id: 'samesite_lax', label: 'SameSite=Lax present, but vulnerable endpoint accepts GET request', detail: 'GET-based CSRF bypasses SameSite=Lax', scoreModifier: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'subdomain_takeover',
    name: 'Subdomain Takeover',
    cwe: 'CWE-284',
    category: 'Cloud & Infrastructure',
    baseSeverity: 'High',
    baseCvssScore: 7.7,
    isPopular: true,
    shortDesc: 'DNS CNAME points to an unclaimed cloud service (AWS S3, GitHub, Heroku)',
    fullDesc: 'Subdomain takeover occurs when a domain name has a DNS CNAME pointing to an external cloud service provider (e.g. AWS S3, Azure Traffic Manager, GitHub Pages, Zendesk) that has been decommissioned or deleted, allowing an attacker to claim the target bucket/tenant and serve arbitrary content under the legitimate organization domain.',
    remediationAdvice: 'Audit DNS records regularly and remove dangling CNAME records pointing to decommissioned third-party cloud services.',
    typicalHackerOnePayout: { minUsd: 1000, maxUsd: 5000 },
    typicalBugcrowdPayout: { minUsd: 800, maxUsd: 4000, vrtTier: 'P2' },
    questions: [
      {
        id: 'subdomain_scope',
        title: 'What domain is vulnerable and what can it access?',
        description: 'The impact of claiming this hostname',
        options: [
          { id: 'cookie_leak', label: 'Subdomain can harvest parent wildcard session cookies (.company.com)', detail: 'Allows stealing main application session cookies from visiting users', scoreModifier: 0.9, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'cors_trusted', label: 'Main app has CORS or OAuth redirect whitelist trusting this subdomain', detail: 'Enables stealing OAuth authorization codes or bypassing API origins', scoreModifier: 0.6, cvssImpact: { c: 'H' } },
          { id: 'isolated_sub', label: 'Dangling subdomain isolated with no cookies or CORS trusts', detail: 'Can serve custom content for phishing under legitimate company brand', scoreModifier: -0.8, cvssImpact: { c: 'L', i: 'L' } },
        ],
      },
      {
        id: 'takeover_proof',
        title: 'Was the takeover claimed or proven with a safe PoC?',
        description: 'Demonstration standard',
        options: [
          { id: 'claimed_bucket', label: 'Safely claimed bucket/tenant serving benign proof HTML', detail: 'Live demonstration confirming full control of HTTP responses', scoreModifier: 0.1 },
          { id: 'dns_only', label: 'DNS CNAME pointing to 404 service without claiming asset', detail: 'Theoretical risk without live tenant verification', scoreModifier: -0.4 },
        ],
      },
    ],
  },
  {
    id: 'open_redirect',
    name: 'Open Redirect',
    cwe: 'CWE-601',
    category: 'Client-Side Attacks',
    baseSeverity: 'Low',
    baseCvssScore: 4.3,
    isPopular: true,
    shortDesc: 'Parameter allows redirecting users to arbitrary untrusted external URLs',
    fullDesc: 'An Open Redirect is when an application accepts untrusted input that specifies an external URL and redirects the user to that URL without validation. Often chained with phishing or OAuth token theft.',
    remediationAdvice: 'Whitelist allowed redirect destinations relative to current origin; reject absolute external URLs.',
    typicalHackerOnePayout: { minUsd: 200, maxUsd: 1000 },
    typicalBugcrowdPayout: { minUsd: 150, maxUsd: 800, vrtTier: 'P4' },
    questions: [
      {
        id: 'redirect_chain',
        title: 'Can this redirect be chained to leak sensitive tokens?',
        description: 'Is it chained with high impact vulnerabilities?',
        options: [
          { id: 'oauth_leak', label: 'Chained with OAuth redirect_uri to leak authorization codes / tokens', detail: 'Leads directly to Account Takeover via stolen OAuth code', scoreModifier: 3.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'ssrf_chain', label: 'Used as a hop to bypass SSRF filter restrictions', detail: 'Backend follows 302 redirect to internal IP addresses', scoreModifier: 2.8, cvssImpact: { c: 'H' } },
          { id: 'pure_phishing', label: 'Pure external redirection (e.g. login?returnUrl=https://evil.com)', detail: 'Only assists in social engineering/phishing without token theft', scoreModifier: -0.5, cvssImpact: { c: 'N' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. AUTHENTICATION & SESSION
  // -------------------------------------------------------------
  {
    id: 'jwt_flaws',
    name: 'JSON Web Token (JWT) Vulnerabilities',
    cwe: 'CWE-347',
    category: 'Authentication & Session',
    baseSeverity: 'High',
    baseCvssScore: 8.7,
    isPopular: true,
    shortDesc: 'Algorithm confusion, missing signature verification, or weak HMAC secret',
    fullDesc: 'Occurs when JWT authentication fails to enforce signature integrity: accepting "alg: none", confusing asymmetric RS256 with symmetric HS256, using brute-forceable weak HMAC secrets, or failing to verify token expiration and signature.',
    remediationAdvice: 'Use strict cryptographic libraries that reject "none", enforce algorithm whitelisting, and use strong random 256-bit secrets.',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 7500 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 6500, vrtTier: 'P2' },
    questions: [
      {
        id: 'jwt_type',
        title: 'What flaw allows forging or bypassing the token?',
        description: 'Specific JWT vulnerability demonstrated',
        options: [
          { id: 'alg_none', label: 'Accepts {"alg": "none"} allowing arbitrary unsigned admin tokens', detail: 'Complete authentication bypass with arbitrary role claims', scoreModifier: 0.6, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'key_confusion', label: 'Algorithm Confusion (RS256 public key verified as HS256 secret)', detail: 'Can sign arbitrary valid tokens using public key as HMAC secret', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'weak_secret', label: 'Weak HMAC secret cracked offline (e.g. "secret", "password123")', detail: 'Attacker computed key to forge valid tokens for any user', scoreModifier: 0.3, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'missing_exp', label: 'Missing expiration / Token never invalidates upon password reset', detail: 'Stolen token remains valid indefinitely even after user logs out', scoreModifier: -1.5, cvssImpact: { c: 'L' } },
        ],
      },
      {
        id: 'jwt_impact',
        title: 'What privilege was gained with the forged token?',
        description: 'Account takeover scope',
        options: [
          { id: 'admin_forge', label: 'Impersonate super administrator or any arbitrary user ID', detail: 'Complete platform control across all accounts', scoreModifier: 0.4 },
          { id: 'limited_scope', label: 'Tamper with minor token claims (e.g. theme preference)', detail: 'No sensitive authorization checks tied to modified claim', scoreModifier: -2.5 },
        ],
      },
    ],
  },
  {
    id: 'mfa_bypass',
    name: 'Multi-Factor Authentication (MFA / 2FA) Bypass',
    cwe: 'CWE-304',
    category: 'Authentication & Session',
    baseSeverity: 'High',
    baseCvssScore: 8.5,
    isPopular: true,
    shortDesc: 'Bypassing the 2FA verification step to access protected accounts',
    fullDesc: 'MFA bypass occurs when an application asks for a secondary factor (SMS OTP, TOTP authenticator code) but allows bypassing it through direct API access to dashboard endpoints, manipulating response JSON (e.g. changing {"success":false} to true), brute forcing short OTP codes due to missing rate limiting, or re-using OTP tokens across sessions.',
    remediationAdvice: 'Verify second factor on the server before issuing final session cookies; enforce strict rate limiting on OTP submissions.',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 7000 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 6000, vrtTier: 'P2' },
    questions: [
      {
        id: 'mfa_technique',
        title: 'How was the 2FA step bypassed?',
        description: 'The technical mechanism used',
        options: [
          { id: 'response_manip', label: 'HTTP Response Manipulation (Changing 401 / {"status":"fail"} to 200 OK)', detail: 'Client-side frontend navigation unlocks account based on JSON boolean', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'direct_url', label: 'Forced browsing / Direct API call bypassing 2FA gate', detail: 'Session cookie issued before 2FA verification and valid for all API calls', scoreModifier: 0.6, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'otp_brute', label: 'No rate limiting on 4-6 digit OTP code (Brute forceable in minutes)', detail: 'Can script all 10,000-1,000,000 combinations without lockout', scoreModifier: 0.2, cvssImpact: { c: 'H' } },
          { id: 'csrf_mfa_disable', label: 'CSRF to disable 2FA without requiring current password', detail: 'Turns off second factor if victim visits an external webpage', scoreModifier: -0.5, cvssImpact: { i: 'H' } },
        ],
      },
    ],
  },
  {
    id: 'oauth_misconfig',
    name: 'OAuth 2.0 / SSO Misconfiguration',
    cwe: 'CWE-287',
    category: 'Authentication & Session',
    baseSeverity: 'High',
    baseCvssScore: 8.3,
    shortDesc: 'Flaws in OAuth flows leading to account takeover or token theft',
    fullDesc: 'OAuth 2.0 vulnerabilities occur when implementation errors allow stealing authorization codes or tokens. Common examples include missing or predictable state parameters (OAuth CSRF), permissive redirect_uri validation (open redirect leakage), or pre-account takeover via unverified email linking.',
    remediationAdvice: 'Enforce exact matching on redirect_uri, require cryptographically random state parameter, and verify email ownership before linking accounts.',
    typicalHackerOnePayout: { minUsd: 2000, maxUsd: 9000 },
    typicalBugcrowdPayout: { minUsd: 1800, maxUsd: 7500, vrtTier: 'P1' },
    questions: [
      {
        id: 'oauth_vector',
        title: 'What OAuth flaw was triggered?',
        description: 'Exploitation vector',
        options: [
          { id: 'code_leak_redirect', label: 'Stolen authorization code via relaxed redirect_uri / Open redirect', detail: 'Attacker captures victim auth code to log in as victim on target site', scoreModifier: 0.7, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'missing_state_csrf', label: 'Missing / Static state parameter (OAuth CSRF account linking)', detail: 'Forces victim account to link with attackers social profile', scoreModifier: 0.1, cvssImpact: { i: 'H' } },
          { id: 'pre_account_takeover', label: 'Pre-Account Takeover (Signing up with target email before victim registers)', detail: 'Links social login without email verification challenge', scoreModifier: 0.4, cvssImpact: { c: 'H', i: 'H' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 6. BUSINESS LOGIC
  // -------------------------------------------------------------
  {
    id: 'race_condition',
    name: 'Race Condition (TOCTOU / Double Spend)',
    cwe: 'CWE-362',
    category: 'Business Logic',
    baseSeverity: 'High',
    baseCvssScore: 8.0,
    isPopular: true,
    shortDesc: 'Time-of-check to time-of-use flaw allowing multiple simultaneous executions',
    fullDesc: 'Race conditions occur when multi-threaded applications check a state (e.g. account balance, coupon usage, gift card balance) and then mutate that state without database row locking or atomic transactions. Sending synchronized parallel HTTP requests allows exploiting the window between check and use.',
    remediationAdvice: 'Use database transactions with pessimistic locking (SELECT FOR UPDATE) or atomic operations (UPDATE balance = balance - 10 WHERE balance >= 10).',
    typicalHackerOnePayout: { minUsd: 1500, maxUsd: 8500 },
    typicalBugcrowdPayout: { minUsd: 1200, maxUsd: 7000, vrtTier: 'P2' },
    questions: [
      {
        id: 'race_financial',
        title: 'What can be duplicated or bypassed via parallel requests?',
        description: 'The real-world business impact demonstrated',
        options: [
          { id: 'double_withdraw', label: 'Financial Double Spend / Multiple withdrawals of single account balance', detail: 'Direct monetary theft by draining funds multiple times in parallel', scoreModifier: 1.2, cvssImpact: { i: 'H' } },
          { id: 'coupon_reuse', label: 'Single-use discount code / voucher applied 10x times in one checkout', detail: 'Reduces cart price to zero using one promo code multiple times', scoreModifier: 0.3, cvssImpact: { i: 'H' } },
          { id: 'vote_like', label: 'Duplicated votes / likes / rating counts on items', detail: 'Inflates popularity metrics without financial impact', scoreModifier: -2.0, cvssImpact: { i: 'L' } },
          { id: 'invite_limit', label: 'Bypassed workspace user seat limit on free tier', detail: 'Add more team members than permitted by subscription tier', scoreModifier: -0.8, cvssImpact: { i: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'price_manipulation',
    name: 'Price / Quantity Tampering',
    cwe: 'CWE-472',
    category: 'Business Logic',
    baseSeverity: 'High',
    baseCvssScore: 8.2,
    shortDesc: 'Manipulating product prices, discounts, or negative quantities in checkout',
    fullDesc: 'Occurs when an e-commerce platform relies on client-side requests to submit unit prices (e.g. price: 0.01) or accepts negative quantities (e.g. quantity: -5) that offset total order prices, allowing users to purchase goods for free or receive positive refunds.',
    remediationAdvice: 'Always calculate final order totals server-side using authoritative database pricing; enforce positive non-zero integers on all quantity fields.',
    typicalHackerOnePayout: { minUsd: 1200, maxUsd: 6000 },
    typicalBugcrowdPayout: { minUsd: 1000, maxUsd: 5000, vrtTier: 'P2' },
    questions: [
      {
        id: 'price_impact',
        title: 'Did the tampered checkout successfully complete payment?',
        description: 'Status of order fulfillment',
        options: [
          { id: 'completed_zero', label: 'Order shipped / fulfilled with $0.00 or negative total payment', detail: 'Physical or digital goods delivered without legitimate payment', scoreModifier: 0.8, cvssImpact: { i: 'H' } },
          { id: 'currency_arbitrage', label: 'Currency rounding or exchange rate discrepancy arbitrage', detail: 'Artificially profited from fractional penny rounding conversions', scoreModifier: -0.4, cvssImpact: { i: 'L' } },
          { id: 'ui_only_rejected', label: 'UI showed modified price but payment gateway failed/rejected transaction', detail: 'Backend or payment gateway caught discrepancy and refused charge', scoreModifier: -3.5, cvssImpact: { i: 'N' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 7. FILE HANDLING & UPLOAD
  // -------------------------------------------------------------
  {
    id: 'unrestricted_file_upload',
    name: 'Unrestricted File Upload',
    cwe: 'CWE-434',
    category: 'File Handling & Deserialization',
    baseSeverity: 'Critical',
    baseCvssScore: 9.7,
    isPopular: true,
    shortDesc: 'Uploading executable server scripts (php, jsp, aspx) leading to web shell',
    fullDesc: 'Occurs when an application allows users to upload files without properly verifying file extensions, MIME types, or contents. If uploaded files are saved inside a web-accessible directory with execution permissions, an attacker can upload a web shell and achieve full system compromise.',
    remediationAdvice: 'Store uploaded files outside web root or in cloud object storage (S3); rename files with random UUIDs; whitelist safe file extensions strictly.',
    typicalHackerOnePayout: { minUsd: 3500, maxUsd: 18000 },
    typicalBugcrowdPayout: { minUsd: 3000, maxUsd: 15000, vrtTier: 'P1' },
    questions: [
      {
        id: 'upload_exec',
        title: 'Can the uploaded file be executed on the server?',
        description: 'Execution capability of uploaded file',
        options: [
          { id: 'webshell_exec', label: 'Executed as server script (PHP/ASPX/JSP) granting remote web shell', detail: 'Full interactive terminal execution on server host', scoreModifier: 0.5, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'svg_xss', label: 'Stored XSS via uploaded SVG image file containing JavaScript', detail: 'Executes in victims browser when viewing avatar or attachment', scoreModifier: -1.8, cvssImpact: { c: 'L', i: 'L' } },
          { id: 'html_phishing', label: 'Uploaded HTML file served with text/html on main domain', detail: 'Can host phishing pages under legitimate company domain', scoreModifier: -2.2, cvssImpact: { c: 'L' } },
          { id: 'safe_storage', label: 'Saved on S3 with Content-Disposition: attachment (No server execution)', detail: 'Stored safely without direct execution or XSS potential', scoreModifier: -4.0, cvssImpact: { c: 'N' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 8. INFORMATION DISCLOSURE
  // -------------------------------------------------------------
  {
    id: 'exposed_git',
    name: 'Exposed .git Repository / Source Code Leak',
    cwe: 'CWE-538',
    category: 'Information Disclosure',
    baseSeverity: 'High',
    baseCvssScore: 7.5,
    isPopular: true,
    shortDesc: 'Publicly accessible /.git/ folder allowing reconstruction of full source code',
    fullDesc: 'When deployment processes accidentally leave the .git folder in the web root, attackers can download objects, commits, and trees to rebuild the complete application source code, revealing internal endpoints, hardcoded credentials, and hidden vulnerabilities.',
    remediationAdvice: 'Block access to all dot-directories in web server configuration (Nginx: location ~ /\\. { deny all; }); do not copy .git folders to production containers.',
    typicalHackerOnePayout: { minUsd: 1000, maxUsd: 6000 },
    typicalBugcrowdPayout: { minUsd: 800, maxUsd: 5000, vrtTier: 'P2' },
    questions: [
      {
        id: 'git_secrets',
        title: 'What was discovered inside the reconstructed source repository?',
        description: 'Findings from commit history',
        options: [
          { id: 'live_secrets', label: 'Live production database passwords, AWS secret keys, or private SSH keys', detail: 'Immediate lateral movement into production servers', scoreModifier: 1.5, cvssImpact: { c: 'H', i: 'H' } },
          { id: 'source_only', label: 'Proprietary backend business logic code without active credentials', detail: 'Source code revealed but credentials managed via external vaults', scoreModifier: 0.0, cvssImpact: { c: 'H' } },
          { id: 'frontend_bundle', label: 'Open-source frontend JavaScript bundle already visible in browser', detail: 'Only public client-side files with no proprietary backend secrets', scoreModifier: -3.0, cvssImpact: { c: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'debug_endpoints',
    name: 'Exposed Actuator / Debug & Profiler Endpoints',
    cwe: 'CWE-200',
    category: 'Information Disclosure',
    baseSeverity: 'Medium',
    baseCvssScore: 6.8,
    isPopular: true,
    shortDesc: 'Exposed Spring Boot Actuator, Swagger UI, Django Debug, or PHPinfo',
    fullDesc: 'Occurs when development or administration diagnostics endpoints (/actuator/env, /actuator/heapdump, /metrics, /phpinfo.php, /_debug) are inadvertently exposed to the public internet without authentication, revealing memory dumps, environment secrets, and stack traces.',
    remediationAdvice: 'Disable debug endpoints in production builds; bind monitoring endpoints to internal loopback or private management VPCs.',
    typicalHackerOnePayout: { minUsd: 500, maxUsd: 3500 },
    typicalBugcrowdPayout: { minUsd: 400, maxUsd: 3000, vrtTier: 'P3' },
    questions: [
      {
        id: 'debug_type',
        title: 'Which endpoint was exposed and what data did it leak?',
        description: 'Diagnostic exposure level',
        options: [
          { id: 'heapdump_env', label: '/actuator/env or /actuator/heapdump leaking decrypted secrets from memory', detail: 'Contains active database credentials and tokens extracted from JVM heap', scoreModifier: 1.6, cvssImpact: { c: 'H' } },
          { id: 'actuator_health', label: 'Only /actuator/health returning {"status":"UP"}', detail: 'Basic health check status without configuration variables or secrets', scoreModifier: -4.0, cvssImpact: { c: 'N' } },
          { id: 'swagger_docs', label: 'Swagger / OpenAPI documentation with no direct auth bypass', detail: 'Public API documentation schema with no sensitive secret keys', scoreModifier: -3.0, cvssImpact: { c: 'L' } },
        ],
      },
    ],
  },
  {
    id: 'info_banner',
    name: 'Server Banner / Version Information Disclosure',
    cwe: 'CWE-200',
    category: 'Information Disclosure',
    baseSeverity: 'Informational',
    baseCvssScore: 0.0,
    isPopular: false,
    shortDesc: 'Server reveals software version headers (e.g. Server: Apache/2.4.41)',
    fullDesc: 'Application headers disclose web server or framework version numbers (e.g. Server: nginx/1.18.0, X-Powered-By: PHP/7.4). While informative during reconnaissance, it is classified as Informational on Bugcrowd and HackerOne unless chained with an exploit for that specific unpatched CVE.',
    remediationAdvice: 'Configure server_tokens off in Nginx or ServerTokens Prod in Apache; disable X-Powered-By headers in framework config.',
    typicalHackerOnePayout: { minUsd: 0, maxUsd: 0 },
    typicalBugcrowdPayout: { minUsd: 0, maxUsd: 0, vrtTier: 'P5' },
    questions: [
      {
        id: 'banner_exploit',
        title: 'Is this version vulnerable to an unpatched exploit on this server?',
        description: 'Actionability of disclosed version banner',
        options: [
          { id: 'info_only', label: 'Banner disclosure only (No working exploit proven)', detail: 'Standard version header with no proven exploitation', scoreModifier: 0.0, cvssImpact: { c: 'N', i: 'N', a: 'N' } },
          { id: 'known_cve', label: 'Version has a proven critical 1-day CVE exploited on this host', detail: 'Demonstrated execution using known exploit matching banner', scoreModifier: 8.5, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 9. API & MICROSERVICES
  // -------------------------------------------------------------
  {
    id: 'graphql_introspection',
    name: 'GraphQL Introspection & Mutation Exposure',
    cwe: 'CWE-200',
    category: 'API & Microservices',
    baseSeverity: 'Medium',
    baseCvssScore: 5.5,
    shortDesc: 'GraphQL __schema introspection exposes hidden fields, mutations, and models',
    fullDesc: 'Occurs when GraphQL schema introspection is left enabled in production, allowing researchers to download the full schema of queries, internal types, and mutations. If mutations lack backend authorization, attackers can call administrative functions.',
    remediationAdvice: 'Disable introspection in production environments; enforce field-level authorization on all mutations.',
    typicalHackerOnePayout: { minUsd: 400, maxUsd: 2500 },
    typicalBugcrowdPayout: { minUsd: 300, maxUsd: 2000, vrtTier: 'P3' },
    questions: [
      {
        id: 'gql_action',
        title: 'Did the exposed mutations allow unauthorized actions?',
        description: 'Mutation execution capability',
        options: [
          { id: 'unauth_mutation', label: 'Unprotected mutation executes administrative state changes without auth', detail: 'Triggered sensitive actions directly through discovered mutation', scoreModifier: 2.5, cvssImpact: { i: 'H' } },
          { id: 'batch_dos', label: 'GraphQL query batching / circular depth denial of service', detail: 'Overloaded backend database using nested queries', scoreModifier: 0.5, cvssImpact: { a: 'H' } },
          { id: 'schema_only', label: 'Introspection schema downloaded only (All mutations require valid auth)', detail: 'Disclosed API schema structure without executing unauthorized actions', scoreModifier: -2.0, cvssImpact: { c: 'L' } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 10. CLOUD & INFRASTRUCTURE
  // -------------------------------------------------------------
  {
    id: 'cloud_bucket_open',
    name: 'Publicly Writable / Readable Cloud Storage Bucket (S3/GCS/Azure)',
    cwe: 'CWE-284',
    category: 'Cloud & Infrastructure',
    baseSeverity: 'High',
    baseCvssScore: 8.4,
    isPopular: true,
    shortDesc: 'Misconfigured AWS S3 or GCP bucket allows public listing, reading, or writing',
    fullDesc: 'Storage buckets configured with public ACLs or open IAM policies allow anonymous users to list files, download private user data, or upload malicious files to be hosted on company assets.',
    remediationAdvice: 'Enable AWS S3 "Block Public Access" at the account level; apply least-privilege IAM policies on bucket objects.',
    typicalHackerOnePayout: { minUsd: 1000, maxUsd: 8000 },
    typicalBugcrowdPayout: { minUsd: 800, maxUsd: 7000, vrtTier: 'P2' },
    questions: [
      {
        id: 'bucket_permission',
        title: 'What permission was granted to anonymous internet users?',
        description: 'The permissions verified on the storage bucket',
        options: [
          { id: 'public_write', label: 'Public Write / Overwrite (Can upload, overwrite, or delete arbitrary files)', detail: 'Allows poisoning company static assets, JavaScript, or downloads', scoreModifier: 1.0, cvssImpact: { i: 'H' } },
          { id: 'public_read_pii', label: 'Public Read containing sensitive customer PII, database backups, or keys', detail: 'Direct exposure of confidential user records and business data', scoreModifier: 0.5, cvssImpact: { c: 'H' } },
          { id: 'public_read_static', label: 'Public Read of intended public assets (Website images, marketing logos)', detail: 'Files intentionally made public for public website display', scoreModifier: -4.5, cvssImpact: { c: 'N' } },
        ],
      },
    ],
  },
  {
    id: 'prototype_pollution',
    name: 'Prototype Pollution (Server-Side / Client-Side)',
    cwe: 'CWE-1321',
    category: 'Client-Side Attacks',
    baseSeverity: 'High',
    baseCvssScore: 8.5,
    isPopular: true,
    shortDesc: 'Modifying Object.prototype via __proto__ or constructor.prototype injection',
    fullDesc: 'Occurs in JavaScript runtimes when deep merge, clone, or object assignment functions recursively set properties without sanitizing __proto__ or constructor keys. On Node.js servers, it can lead to remote code execution (child_process spawning gadget). On client browsers, it leads to DOM XSS.',
    remediationAdvice: 'Use Object.create(null) for dictionary objects; freeze Object.prototype; validate user keys against dangerous properties.',
    typicalHackerOnePayout: { minUsd: 2000, maxUsd: 9000 },
    typicalBugcrowdPayout: { minUsd: 1500, maxUsd: 7500, vrtTier: 'P1' },
    questions: [
      {
        id: 'proto_context',
        title: 'Where was prototype pollution triggered and what was the impact?',
        description: 'Execution context',
        options: [
          { id: 'server_rce', label: 'Server-side Node.js leading to Remote Code Execution', detail: 'Polluted child_process or template options to execute shell commands', scoreModifier: 0.9, cvssImpact: { c: 'H', i: 'H', a: 'H' } },
          { id: 'client_xss', label: 'Client-side leading to DOM Cross-Site Scripting (DOM XSS)', detail: 'Polluted client script source or config object to trigger script execution', scoreModifier: -0.2, cvssImpact: { c: 'L', i: 'L' } },
          { id: 'server_dos', label: 'Server-side Denial of Service (Crashed process or infinite loop)', detail: 'Crashed Node.js event loop requiring process restart', scoreModifier: -1.0, cvssImpact: { a: 'H' } },
          { id: 'benign_pollute', label: 'Property reflected in console (e.g. {}.polluted === true) without exploit gadget', detail: 'Proved prototype pollution theoretically without security impact', scoreModifier: -3.0, cvssImpact: { c: 'L' } },
        ],
      },
    ],
  },
];

import { ADDITIONAL_VULNERABILITIES } from './moreVulnerabilities';

export const ALL_VULNERABILITIES: VulnerabilityDefinition[] = [
  ...VULNERABILITIES,
  ...ADDITIONAL_VULNERABILITIES,
];
