const oracle = require('../config/oracle');

// In-memory data store replicating the 14 Oracle Database tables
const defaultState = {
  users: [
    {
      USER_ID: 1,
      USERNAME: 'admin',
      EMAIL: 'admin@example.com',
      ROLE: 'SOC_ADMIN',
      FULL_NAME: 'SOC Lead Security Architect',
      LAST_LOGIN: new Date().toISOString()
    },
    {
      USER_ID: 2,
      USERNAME: 'analyst',
      EMAIL: 'analyst@example.com',
      ROLE: 'SOC_ANALYST',
      FULL_NAME: 'Tier-2 Threat Hunter',
      LAST_LOGIN: new Date().toISOString()
    }
  ],

  assets: [
    {
      ASSET_ID: 'internet',
      NAME: 'Public Internet',
      DEVICE_TYPE: 'External Gateway',
      IP_ADDRESS: '198.51.100.1',
      OPERATING_SYSTEM: 'N/A (Untrusted)',
      ZONE: 'EXTERNAL',
      CRITICALITY: 'LOW',
      SECURITY_STATE: 'SECURE',
      OPEN_PORTS: '0',
      VULNERABILITY_COUNT: 0,
      RISK_SCORE: 15.0,
      POSITION_X: 50,
      POSITION_Y: 220,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'fw-ext',
      NAME: 'Perimeter Firewall',
      DEVICE_TYPE: 'Firewall',
      IP_ADDRESS: '10.0.0.1',
      OPERATING_SYSTEM: 'FortiOS 7.4 Enterprise',
      ZONE: 'PERIMETER',
      CRITICALITY: 'HIGH',
      SECURITY_STATE: 'LOW_RISK',
      OPEN_PORTS: '443, 80, 53',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 32.5,
      POSITION_X: 240,
      POSITION_Y: 220,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'web-server',
      NAME: 'Web Server (DMZ)',
      DEVICE_TYPE: 'Web Server',
      IP_ADDRESS: '10.0.1.10',
      OPERATING_SYSTEM: 'Ubuntu Linux 22.04 LTS (Nginx 1.24)',
      ZONE: 'DMZ',
      CRITICALITY: 'HIGH',
      SECURITY_STATE: 'CRITICAL',
      OPEN_PORTS: '80, 443, 8080',
      VULNERABILITY_COUNT: 2,
      RISK_SCORE: 88.5,
      POSITION_X: 440,
      POSITION_Y: 100,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'emp-pc',
      NAME: 'Employee PC (Office)',
      DEVICE_TYPE: 'Workstation',
      IP_ADDRESS: '10.0.4.22',
      OPERATING_SYSTEM: 'Windows 11 Pro 23H2',
      ZONE: 'USER_LAN',
      CRITICALITY: 'MEDIUM',
      SECURITY_STATE: 'MEDIUM_RISK',
      OPEN_PORTS: '445, 139, 3389',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 55.0,
      POSITION_X: 440,
      POSITION_Y: 340,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'fw-int',
      NAME: 'Internal Firewall',
      DEVICE_TYPE: 'Firewall',
      IP_ADDRESS: '10.0.2.1',
      OPERATING_SYSTEM: 'Cisco ASA OS 9.18',
      ZONE: 'INTERNAL',
      CRITICALITY: 'HIGH',
      SECURITY_STATE: 'LOW_RISK',
      OPEN_PORTS: '443, 8080, 1521',
      VULNERABILITY_COUNT: 0,
      RISK_SCORE: 24.0,
      POSITION_X: 630,
      POSITION_Y: 220,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'app-server',
      NAME: 'Application Server',
      DEVICE_TYPE: 'Application Server',
      IP_ADDRESS: '10.0.2.15',
      OPERATING_SYSTEM: 'Red Hat Enterprise Linux 9.2 (Tomcat 10)',
      ZONE: 'INTERNAL_APP',
      CRITICALITY: 'HIGH',
      SECURITY_STATE: 'HIGH_RISK',
      OPEN_PORTS: '8080, 8443, 22',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 74.0,
      POSITION_X: 820,
      POSITION_Y: 100,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'admin-pc',
      NAME: 'Admin Workstation',
      DEVICE_TYPE: 'Workstation',
      IP_ADDRESS: '10.0.4.99',
      OPERATING_SYSTEM: 'Windows Server 2022 Datacenter',
      ZONE: 'PRIVILEGED_LAN',
      CRITICALITY: 'CRITICAL',
      SECURITY_STATE: 'HIGH_RISK',
      OPEN_PORTS: '22, 3389, 445',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 71.0,
      POSITION_X: 820,
      POSITION_Y: 340,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'db-server',
      NAME: 'Database Server (Oracle)',
      DEVICE_TYPE: 'Database Server',
      IP_ADDRESS: '10.0.3.50',
      OPERATING_SYSTEM: 'Oracle Linux 8.8 (Oracle Database 11g/19c XE)',
      ZONE: 'SECURE_DATA',
      CRITICALITY: 'CRITICAL',
      SECURITY_STATE: 'CRITICAL',
      OPEN_PORTS: '1521, 22',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 91.0,
      POSITION_X: 1020,
      POSITION_Y: 100,
      LAST_UPDATED: new Date().toISOString()
    },
    {
      ASSET_ID: 'cloud-vpc',
      NAME: 'Cloud VPC Server',
      DEVICE_TYPE: 'Cloud Instance',
      IP_ADDRESS: '172.16.0.5',
      OPERATING_SYSTEM: 'Amazon Linux 2023 (Microservices Gateway)',
      ZONE: 'CLOUD_VPC',
      CRITICALITY: 'HIGH',
      SECURITY_STATE: 'MEDIUM_RISK',
      OPEN_PORTS: '443, 8443',
      VULNERABILITY_COUNT: 1,
      RISK_SCORE: 62.0,
      POSITION_X: 630,
      POSITION_Y: 40,
      LAST_UPDATED: new Date().toISOString()
    }
  ],

  connections: [
    { CONNECTION_ID: 1, SOURCE_ASSET_ID: 'internet', TARGET_ASSET_ID: 'fw-ext', PROTOCOL: 'HTTPS', PORT: 443, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 2, SOURCE_ASSET_ID: 'fw-ext', TARGET_ASSET_ID: 'web-server', PROTOCOL: 'HTTP/HTTPS', PORT: 443, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 3, SOURCE_ASSET_ID: 'fw-ext', TARGET_ASSET_ID: 'emp-pc', PROTOCOL: 'TCP', PORT: 445, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 4, SOURCE_ASSET_ID: 'web-server', TARGET_ASSET_ID: 'fw-int', PROTOCOL: 'TCP', PORT: 8080, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 5, SOURCE_ASSET_ID: 'web-server', TARGET_ASSET_ID: 'emp-pc', PROTOCOL: 'TCP', PORT: 445, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 6, SOURCE_ASSET_ID: 'emp-pc', TARGET_ASSET_ID: 'admin-pc', PROTOCOL: 'RDP/SMB', PORT: 3389, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 7, SOURCE_ASSET_ID: 'fw-int', TARGET_ASSET_ID: 'app-server', PROTOCOL: 'HTTP/TCP', PORT: 8080, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 8, SOURCE_ASSET_ID: 'app-server', TARGET_ASSET_ID: 'db-server', PROTOCOL: 'Oracle TNS', PORT: 1521, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 9, SOURCE_ASSET_ID: 'admin-pc', TARGET_ASSET_ID: 'app-server', PROTOCOL: 'SSH', PORT: 22, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 10, SOURCE_ASSET_ID: 'admin-pc', TARGET_ASSET_ID: 'db-server', PROTOCOL: 'Oracle TNS', PORT: 1521, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 11, SOURCE_ASSET_ID: 'cloud-vpc', TARGET_ASSET_ID: 'fw-int', PROTOCOL: 'HTTPS', PORT: 8443, STATUS: 'ACTIVE' },
    { CONNECTION_ID: 12, SOURCE_ASSET_ID: 'cloud-vpc', TARGET_ASSET_ID: 'app-server', PROTOCOL: 'HTTPS', PORT: 8443, STATUS: 'ACTIVE' }
  ],

  vulnerabilities: [
    {
      VULN_ID: 'CVE-2024-21887',
      NAME: 'Web Application Command Injection',
      CVSS_SCORE: 9.1,
      SEVERITY: 'CRITICAL',
      DESCRIPTION: 'Command injection vulnerability in web-tier endpoints allowing unauthenticated remote code execution via crafting malicious URI headers.',
      REMEDIATION: 'Apply security update K-8812 and enforce strict input sanitation rules.',
      EXPLOITABILITY: 'FUNCTIONAL',
      IS_ZERO_DAY: 'N'
    },
    {
      VULN_ID: 'CVE-2021-44228',
      NAME: 'Apache Log4j JNDI Remote Code Execution',
      CVSS_SCORE: 9.8,
      SEVERITY: 'CRITICAL',
      DESCRIPTION: 'JNDI lookups in logging requests permit remote unauthenticated attackers to execute arbitrary Java code via nested log payload interpolation.',
      REMEDIATION: 'Upgrade to Log4j v2.17.1 or set log4j2.formatMsgNoLookups=true.',
      EXPLOITABILITY: 'HIGH',
      IS_ZERO_DAY: 'N'
    },
    {
      VULN_ID: 'CVE-2023-38606',
      NAME: 'Lateral Movement Service Privilege Escalation',
      CVSS_SCORE: 8.4,
      SEVERITY: 'HIGH',
      DESCRIPTION: 'Flaw in RPC daemon state transitions allows standard users to impersonate local service accounts and pivot through trusted application channels.',
      REMEDIATION: 'Patch RPC daemon to v3.4.1 and restrict cross-subnet RPC bindings.',
      EXPLOITABILITY: 'FUNCTIONAL',
      IS_ZERO_DAY: 'N'
    },
    {
      VULN_ID: 'CVE-2024-38112',
      NAME: 'Spoofed Protocol Handler Execution (Phishing)',
      CVSS_SCORE: 7.5,
      SEVERITY: 'HIGH',
      DESCRIPTION: 'MSHTML spoofing vector where malicious shortcuts invoke underlying browser rendering engines to silently download remote stages.',
      REMEDIATION: 'Deploy Windows Security cumulative update and enforce Defender Attack Surface Reduction.',
      EXPLOITABILITY: 'PROOFOFCONCEPT',
      IS_ZERO_DAY: 'N'
    },
    {
      VULN_ID: 'CVE-2024-6387',
      NAME: 'regreSSHion Signal Handler RCE',
      CVSS_SCORE: 8.1,
      SEVERITY: 'HIGH',
      DESCRIPTION: 'Signal handler race condition in OpenSSH server allowing unauthenticated code execution as root in default configurations.',
      REMEDIATION: 'Upgrade OpenSSH to version 9.8p1 or set LoginGraceTime 0.',
      EXPLOITABILITY: 'FUNCTIONAL',
      IS_ZERO_DAY: 'N'
    },
    {
      VULN_ID: 'CVE-2024-3400',
      NAME: 'Firewall OS Command Injection',
      CVSS_SCORE: 10.0,
      SEVERITY: 'CRITICAL',
      DESCRIPTION: 'Critical flaw in firewall telemetry processing allows remote root execution without prior authentication.',
      REMEDIATION: 'Apply vendor hotfix HF-09 and disable telemetry daemon.',
      EXPLOITABILITY: 'FUNCTIONAL',
      IS_ZERO_DAY: 'Y'
    }
  ],

  assetVulnerabilities: [
    { ID: 1, ASSET_ID: 'web-server', VULN_ID: 'CVE-2024-21887', EXPOSED_PORT: 443, STATUS: 'UNPATCHED' },
    { ID: 2, ASSET_ID: 'web-server', VULN_ID: 'CVE-2021-44228', EXPOSED_PORT: 8080, STATUS: 'UNPATCHED' },
    { ID: 3, ASSET_ID: 'app-server', VULN_ID: 'CVE-2023-38606', EXPOSED_PORT: 8080, STATUS: 'UNPATCHED' },
    { ID: 4, ASSET_ID: 'emp-pc', VULN_ID: 'CVE-2024-38112', EXPOSED_PORT: 445, STATUS: 'UNPATCHED' },
    { ID: 5, ASSET_ID: 'admin-pc', VULN_ID: 'CVE-2024-6387', EXPOSED_PORT: 22, STATUS: 'UNPATCHED' },
    { ID: 6, ASSET_ID: 'db-server', VULN_ID: 'CVE-2023-38606', EXPOSED_PORT: 1521, STATUS: 'UNPATCHED' },
    { ID: 7, ASSET_ID: 'cloud-vpc', VULN_ID: 'CVE-2021-44228', EXPOSED_PORT: 8443, STATUS: 'UNPATCHED' }
  ],

  securityControls: [
    { CONTROL_ID: 'CTRL-WAF', NAME: 'Enterprise Web Application Firewall', CONTROL_TYPE: 'WAF', APPLIED_TO_ASSET: 'web-server', STATUS: 'ACTIVE', EFFECTIVENESS_PCT: 70.0, DESCRIPTION: 'Inspects HTTP requests for SQLi, XSS, and known exploit patterns.' },
    { CONTROL_ID: 'CTRL-SEG', NAME: 'DMZ-to-Data Tier Microsegmentation', CONTROL_TYPE: 'Network Segmentation', APPLIED_TO_ASSET: 'fw-int', STATUS: 'DISABLED', EFFECTIVENESS_PCT: 30.0, DESCRIPTION: 'Strict zone isolation between DMZ web tier and internal database subnet.' },
    { CONTROL_ID: 'CTRL-EDR', NAME: 'CrowdStrike Falcon Endpoint EDR', CONTROL_TYPE: 'EDR', APPLIED_TO_ASSET: 'emp-pc', STATUS: 'ACTIVE', EFFECTIVENESS_PCT: 85.0, DESCRIPTION: 'Behavioral process tracking and ransomware heuristic interception.' },
    { CONTROL_ID: 'CTRL-MFA', NAME: 'FIDO2 / TOTP Privileged MFA', CONTROL_TYPE: 'MFA', APPLIED_TO_ASSET: 'admin-pc', STATUS: 'PARTIAL', EFFECTIVENESS_PCT: 60.0, DESCRIPTION: 'Hardware token verification for administrative sessions.' },
    { CONTROL_ID: 'CTRL-IPS', NAME: 'Intrusion Prevention Deep Inspection', CONTROL_TYPE: 'IDS/IPS', APPLIED_TO_ASSET: 'fw-ext', STATUS: 'ACTIVE', EFFECTIVENESS_PCT: 80.0, DESCRIPTION: 'Snort-based protocol anomaly and known signature blocking.' }
  ],

  attackTechniques: [
    { TECHNIQUE_ID: 'T1190', NAME: 'Exploit Public-Facing Application', TACTIC: 'Initial Access', DESCRIPTION: 'Adversaries may attempt to exploit a vulnerability in an Internet-facing service or application to gain initial system access.', SEVERITY_WEIGHT: 0.95 },
    { TECHNIQUE_ID: 'T1059', NAME: 'Command and Scripting Interpreter', TACTIC: 'Execution', DESCRIPTION: 'Adversaries may abuse command and script interpreters to execute arbitrary commands, scripts, or binaries.', SEVERITY_WEIGHT: 0.88 },
    { TECHNIQUE_ID: 'T1078', NAME: 'Valid Accounts', TACTIC: 'Defense Evasion / Persistence', DESCRIPTION: 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, or Privilege Escalation.', SEVERITY_WEIGHT: 0.82 },
    { TECHNIQUE_ID: 'T1021', NAME: 'Remote Services (SSH/RDP/SMB)', TACTIC: 'Lateral Movement', DESCRIPTION: 'Adversaries may use valid accounts to log into a service specifically designed to accept remote connections across internal subnets.', SEVERITY_WEIGHT: 0.85 },
    { TECHNIQUE_ID: 'T1003', NAME: 'OS Credential Dumping', TACTIC: 'Credential Access', DESCRIPTION: 'Adversaries may attempt to dump credentials to obtain account login information from the operating system security subsystems.', SEVERITY_WEIGHT: 0.90 },
    { TECHNIQUE_ID: 'T1048', NAME: 'Exfiltration Over Alternative Protocol', TACTIC: 'Exfiltration', DESCRIPTION: 'Adversaries may steal sensitive enterprise data by redirecting traffic through secondary protocol tunnels to external control servers.', SEVERITY_WEIGHT: 0.92 },
    { TECHNIQUE_ID: 'T1046', NAME: 'Network Service Discovery', TACTIC: 'Discovery', DESCRIPTION: 'Adversaries may attempt to get a listing of services running on hosts across the network to locate viable exploitation targets.', SEVERITY_WEIGHT: 0.70 },
    { TECHNIQUE_ID: 'T1566', NAME: 'Phishing: Spearphishing Link', TACTIC: 'Initial Access', DESCRIPTION: 'Adversaries may send spearphishing emails with malicious links to induce users to execute malicious code or provide credentials.', SEVERITY_WEIGHT: 0.80 }
  ],

  attackPaths: [
    {
      PATH_ID: 'PATH-01',
      NAME: 'DMZ Web Ingress to Core Database Crown Jewel',
      ENTRY_POINT: 'internet',
      TARGET_ASSET: 'db-server',
      HOP_COUNT: 3,
      RISK_SCORE: 91.0,
      CONFIDENCE_SCORE: 94.5,
      VULNERABILITY_COUNT: 3,
      CRITICAL_ASSETS_AFFECTED: 2,
      PRIORITY: 'CRITICAL',
      STATUS: 'ACTIVE',
      EXPLANATION: 'The Web Server is the primary vulnerable entry point exposed to the public Internet with unpatched CVE-2024-21887 and Log4Shell on port 443/8080. Upon web compromise, the absence of strict microsegmentation on the internal firewall permits lateral movement into Tomcat Application Server, which holds active database connection pool credentials to the Oracle Database Server, exposing enterprise customer records.',
      STEPS: [
        { STEP_ORDER: 1, FROM_ASSET: 'internet', TO_ASSET: 'web-server', TECHNIQUE_ID: 'T1190', VULN_ID: 'CVE-2024-21887', STEP_RISK: 92.0, DESCRIPTION: 'Attacker delivers remote command injection payload to public-facing Web Server on port 443.' },
        { STEP_ORDER: 2, FROM_ASSET: 'web-server', TO_ASSET: 'app-server', TECHNIQUE_ID: 'T1021', VULN_ID: 'CVE-2023-38606', STEP_RISK: 84.0, DESCRIPTION: 'Attacker pivots from Web Server across Internal Firewall into Application Server via Tomcat RPC.' },
        { STEP_ORDER: 3, FROM_ASSET: 'app-server', TO_ASSET: 'db-server', TECHNIQUE_ID: 'T1048', VULN_ID: null, STEP_RISK: 96.0, DESCRIPTION: 'Attacker leverages existing SQL connection pool to execute queries and exfiltrate database records.' }
      ]
    },
    {
      PATH_ID: 'PATH-02',
      NAME: 'Web Breach to Workstation Lateral Traversal to Admin Core',
      ENTRY_POINT: 'internet',
      TARGET_ASSET: 'admin-pc',
      HOP_COUNT: 3,
      RISK_SCORE: 73.0,
      CONFIDENCE_SCORE: 82.0,
      VULNERABILITY_COUNT: 2,
      CRITICAL_ASSETS_AFFECTED: 1,
      PRIORITY: 'HIGH',
      STATUS: 'ACTIVE',
      EXPLANATION: 'Adversaries breaching the Web Server pivot laterally into user workstations via unauthenticated SMB/RPC calls on port 445. Once established on the Employee PC, cached Kerberos tickets or SSH keys enable lateral pivoting into the Admin Workstation, facilitating domain credential takeover.',
      STEPS: [
        { STEP_ORDER: 1, FROM_ASSET: 'internet', TO_ASSET: 'web-server', TECHNIQUE_ID: 'T1190', VULN_ID: 'CVE-2024-21887', STEP_RISK: 92.0, DESCRIPTION: 'Initial compromise of Web Server via unauthenticated external request.' },
        { STEP_ORDER: 2, FROM_ASSET: 'web-server', TO_ASSET: 'emp-pc', TECHNIQUE_ID: 'T1021', VULN_ID: 'CVE-2024-38112', STEP_RISK: 68.0, DESCRIPTION: 'Lateral SMB probe from DMZ Web Server into User LAN employee workstation.' },
        { STEP_ORDER: 3, FROM_ASSET: 'emp-pc', TO_ASSET: 'admin-pc', TECHNIQUE_ID: 'T1003', VULN_ID: 'CVE-2024-6387', STEP_RISK: 82.0, DESCRIPTION: 'Attacker harvests administrative session tokens and connects to Admin Workstation via RDP.' }
      ]
    },
    {
      PATH_ID: 'PATH-03',
      NAME: 'Phished Employee Endpoint to Enterprise Database Pivot',
      ENTRY_POINT: 'emp-pc',
      TARGET_ASSET: 'db-server',
      HOP_COUNT: 2,
      RISK_SCORE: 58.0,
      CONFIDENCE_SCORE: 75.0,
      VULNERABILITY_COUNT: 2,
      CRITICAL_ASSETS_AFFECTED: 1,
      PRIORITY: 'MEDIUM',
      STATUS: 'ACTIVE',
      EXPLANATION: 'Initial spearphishing compromise of an office employee PC allows adversaries to discover internal application endpoints over port 8080. Utilizing unpatched RPC privilege escalation, the attacker moves through the Application Server directly into the Oracle Database Server.',
      STEPS: [
        { STEP_ORDER: 1, FROM_ASSET: 'emp-pc', TO_ASSET: 'app-server', TECHNIQUE_ID: 'T1021', VULN_ID: 'CVE-2023-38606', STEP_RISK: 60.0, DESCRIPTION: 'Attacker scans and invokes internal Tomcat application from compromised workstation.' },
        { STEP_ORDER: 2, FROM_ASSET: 'app-server', TO_ASSET: 'db-server', TECHNIQUE_ID: 'T1048', VULN_ID: null, STEP_RISK: 94.0, DESCRIPTION: 'Direct database exfiltration via application queries.' }
      ]
    },
    {
      PATH_ID: 'PATH-04',
      NAME: 'Cloud VPC API Breach to Internal Application & Database',
      ENTRY_POINT: 'cloud-vpc',
      TARGET_ASSET: 'db-server',
      HOP_COUNT: 2,
      RISK_SCORE: 64.0,
      CONFIDENCE_SCORE: 80.0,
      VULNERABILITY_COUNT: 2,
      CRITICAL_ASSETS_AFFECTED: 2,
      PRIORITY: 'HIGH',
      STATUS: 'ACTIVE',
      EXPLANATION: 'Vulnerable microservices within the Cloud VPC gateway allow remote exploit execution. Via the trusted cross-cloud tunnel into the internal firewall, attackers reach Tomcat microservices on the Application Server and query the Oracle Database tier.',
      STEPS: [
        { STEP_ORDER: 1, FROM_ASSET: 'cloud-vpc', TO_ASSET: 'app-server', TECHNIQUE_ID: 'T1190', VULN_ID: 'CVE-2021-44228', STEP_RISK: 75.0, DESCRIPTION: 'Compromise of cloud container pivoting into internal app server.' },
        { STEP_ORDER: 2, FROM_ASSET: 'app-server', TO_ASSET: 'db-server', TECHNIQUE_ID: 'T1048', VULN_ID: null, STEP_RISK: 91.0, DESCRIPTION: 'Database access via internal connection string.' }
      ]
    }
  ],

  riskAssessment: {
    OVERALL_SECURITY_SCORE: 78.0,
    NETWORK_RISK_SCORE: 82.5,
    VULNERABILITY_HEALTH: 68.0,
    NETWORK_SEGMENTATION: 62.0,
    ASSET_EXPOSURE: 74.0,
    ATTACK_PATH_RISK: 91.0,
    SECURITY_CONTROLS_SCORE: 75.0,
    ASSESSED_AT: new Date().toISOString()
  },

  defenseRecommendations: [
    {
      REC_ID: 'REC-01',
      TITLE: 'Patch Web Server Remote Code Execution Vulnerabilities',
      AFFECTED_ASSET_ID: 'web-server',
      ACTION_TYPE: 'PATCH',
      REASON: 'Apply security patches for CVE-2024-21887 and Apache Log4j (CVE-2021-44228) on the DMZ Web Server. Eliminating initial remote execution collapses the highest-probability entry vector.',
      ESTIMATED_RISK_REDUCTION: 49.45,
      PRIORITY: 'CRITICAL',
      STATUS: 'PENDING'
    },
    {
      REC_ID: 'REC-02',
      TITLE: 'Enable Zero-Trust Microsegmentation between Web & Database Tiers',
      AFFECTED_ASSET_ID: 'fw-int',
      ACTION_TYPE: 'SEGMENTATION',
      REASON: 'Enforce strict egress filtering on the Internal Firewall, disallowing any direct communication from the DMZ web subnet to the secure Oracle database tier.',
      ESTIMATED_RISK_REDUCTION: 35.0,
      PRIORITY: 'HIGH',
      STATUS: 'PENDING'
    },
    {
      REC_ID: 'REC-03',
      TITLE: 'Restrict Unnecessary Exposed Ports on Perimeter Gateway',
      AFFECTED_ASSET_ID: 'fw-ext',
      ACTION_TYPE: 'PORT_RESTRICTION',
      REASON: 'Close unneeded management ports and block plaintext HTTP port 80 to restrict external attack surface discovery.',
      ESTIMATED_RISK_REDUCTION: 25.0,
      PRIORITY: 'MEDIUM',
      STATUS: 'PENDING'
    },
    {
      REC_ID: 'REC-04',
      TITLE: 'Enforce FIDO2 Multi-Factor Authentication on Admin Workstations',
      AFFECTED_ASSET_ID: 'admin-pc',
      ACTION_TYPE: 'MFA_ENFORCE',
      REASON: 'Require hardware-backed token authorization for all RDP and SSH sessions connecting to Admin Workstation and Database host.',
      ESTIMATED_RISK_REDUCTION: 30.0,
      PRIORITY: 'HIGH',
      STATUS: 'PENDING'
    },
    {
      REC_ID: 'REC-05',
      TITLE: 'Deploy Deep EDR & Honeypot Monitoring on Tomcat Application Server',
      AFFECTED_ASSET_ID: 'app-server',
      ACTION_TYPE: 'ENHANCED_MONITORING',
      REASON: 'Instrument memory-space behavioral monitoring and honeypot database credentials to immediately trap lateral movement attempts.',
      ESTIMATED_RISK_REDUCTION: 18.0,
      PRIORITY: 'LOW',
      STATUS: 'PENDING'
    }
  ],

  simulations: [
    {
      SIMULATION_ID: 'SIM-HIST-01',
      SIMULATION_NAME: 'Baseline Public Web Breach Simulation',
      ENTRY_POINT: 'internet',
      TARGET_ASSET: 'db-server',
      DEFENSE_APPLIED: 'None (Unmitigated Baseline)',
      RISK_BEFORE: 91.0,
      RISK_AFTER: 91.0,
      RISK_REDUCTION_PCT: 0.0,
      OUTCOME: 'BREACH_SIMULATED',
      SIMULATED_AT: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      SIMULATION_ID: 'SIM-HIST-02',
      SIMULATION_NAME: 'Simulated Web Patch & Port Restriction Trial',
      ENTRY_POINT: 'internet',
      TARGET_ASSET: 'db-server',
      DEFENSE_APPLIED: 'Patch CVE-2024-21887 + Strict Port Restriction',
      RISK_BEFORE: 91.0,
      RISK_AFTER: 46.0,
      RISK_REDUCTION_PCT: 49.45,
      OUTCOME: 'ATTACK_BLOCKED',
      SIMULATED_AT: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      SIMULATION_ID: 'SIM-HIST-03',
      SIMULATION_NAME: 'Employee PC Spearphishing Containment Test',
      ENTRY_POINT: 'emp-pc',
      TARGET_ASSET: 'admin-pc',
      DEFENSE_APPLIED: 'EDR Automated Host Quarantine',
      RISK_BEFORE: 73.0,
      RISK_AFTER: 28.0,
      RISK_REDUCTION_PCT: 61.64,
      OUTCOME: 'BREACH_PREVENTED',
      SIMULATED_AT: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],

  simulationEvents: [
    { EVENT_ID: 1, SIMULATION_ID: 'SIM-HIST-02', STEP_NUMBER: 1, TIMESTAMP_OFFSET_MS: 0, CURRENT_ASSET: 'internet', NEXT_ASSET: 'web-server', TECHNIQUE_ID: 'T1190', EVENT_TYPE: 'EXPLOIT', DETAILS: 'Attacker dispatches command injection payload across port 443.' },
    { EVENT_ID: 2, SIMULATION_ID: 'SIM-HIST-02', STEP_NUMBER: 2, TIMESTAMP_OFFSET_MS: 850, CURRENT_ASSET: 'web-server', NEXT_ASSET: 'web-server', TECHNIQUE_ID: 'T1190', EVENT_TYPE: 'BLOCKED', DETAILS: 'Patched web server rejects command injection; signature dropped by virtual patch.' },
    { EVENT_ID: 3, SIMULATION_ID: 'SIM-HIST-02', STEP_NUMBER: 3, TIMESTAMP_OFFSET_MS: 1400, CURRENT_ASSET: 'web-server', NEXT_ASSET: 'fw-int', TECHNIQUE_ID: 'T1021', EVENT_TYPE: 'BLOCKED', DETAILS: 'Lateral traversal blocked. Downstream database remains untouched.' }
  ],

  alerts: [
    {
      ALERT_ID: 'ALT-101',
      TITLE: 'Critical Multi-Hop Attack Path Predicted',
      SEVERITY: 'CRITICAL',
      ALERT_TYPE: 'ATTACK_PATH_DETECTED',
      AFFECTED_ASSET_ID: 'db-server',
      MESSAGE: 'AI Prediction engine identified a 91% risk trajectory traversing Internet -> Web Server -> Application Server -> Oracle Database Server.',
      STATUS: 'ACTIVE',
      CREATED_AT: new Date(Date.now() - 1800000).toISOString()
    },
    {
      ALERT_ID: 'ALT-102',
      TITLE: 'High-Severity Vulnerability on Exposed Asset',
      SEVERITY: 'HIGH',
      ALERT_TYPE: 'HIGH_VULNERABILITY',
      AFFECTED_ASSET_ID: 'web-server',
      MESSAGE: 'CVE-2024-21887 (CVSS 9.1) detected on DMZ Web Server with exposed port 443 active.',
      STATUS: 'ACTIVE',
      CREATED_AT: new Date(Date.now() - 3600000).toISOString()
    },
    {
      ALERT_ID: 'ALT-103',
      TITLE: 'Database Server Crown Jewel Exposure',
      SEVERITY: 'CRITICAL',
      ALERT_TYPE: 'CRITICAL_EXPOSURE',
      AFFECTED_ASSET_ID: 'db-server',
      MESSAGE: 'Oracle Database Server holding customer PII is reachable via 2 unsegmented lateral network links.',
      STATUS: 'ACTIVE',
      CREATED_AT: new Date(Date.now() - 7200000).toISOString()
    },
    {
      ALERT_ID: 'ALT-104',
      TITLE: 'Privileged Account Traversal Vector Detected',
      SEVERITY: 'HIGH',
      ALERT_TYPE: 'RISK_INCREASE',
      AFFECTED_ASSET_ID: 'admin-pc',
      MESSAGE: 'Kerberos session caching on Employee PC exposes Admin Workstation via SMB port 445.',
      STATUS: 'ACTIVE',
      CREATED_AT: new Date(Date.now() - 10800000).toISOString()
    },
    {
      ALERT_ID: 'ALT-105',
      TITLE: 'Defense Mitigation Rule Ready for Verification',
      SEVERITY: 'INFO',
      ALERT_TYPE: 'DEFENSE_APPLIED',
      AFFECTED_ASSET_ID: 'web-server',
      MESSAGE: 'Virtual patch recommendation REC-01 computed: estimated 49.45% risk reduction upon deployment.',
      STATUS: 'ACKNOWLEDGED',
      CREATED_AT: new Date(Date.now() - 14400000).toISOString()
    }
  ]
};

// Clone deep initial state
let state = JSON.parse(JSON.stringify(defaultState));

// Database access helper that queries Oracle when available, otherwise state
async function getAssets() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM ASSETS ORDER BY POSITION_X ASC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {
    console.warn('[DB] Oracle query fallback to state for assets:', err.message);
  }
  return state.assets;
}

async function getAssetById(id) {
  try {
    const res = await oracle.executeQuery('SELECT * FROM ASSETS WHERE ASSET_ID = :id', { id });
    if (res && res.rows && res.rows.length > 0) return res.rows[0];
  } catch (err) {}
  return state.assets.find(a => a.ASSET_ID === id) || null;
}

async function updateAssetSecurityState(id, securityState, riskScore) {
  try {
    await oracle.executeQuery(
      'UPDATE ASSETS SET SECURITY_STATE = :securityState, RISK_SCORE = :riskScore, LAST_UPDATED = CURRENT_TIMESTAMP WHERE ASSET_ID = :id',
      { securityState, riskScore, id }
    );
  } catch (err) {}
  const asset = state.assets.find(a => a.ASSET_ID === id);
  if (asset) {
    asset.SECURITY_STATE = securityState;
    if (riskScore !== undefined) asset.RISK_SCORE = riskScore;
    asset.LAST_UPDATED = new Date().toISOString();
  }
}

async function getConnections() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM ASSET_CONNECTIONS ORDER BY CONNECTION_ID ASC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.connections;
}

async function getVulnerabilities() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM VULNERABILITIES ORDER BY CVSS_SCORE DESC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.vulnerabilities;
}

async function getAssetVulnerabilities(assetId = null) {
  try {
    let sql = `
      SELECT av.ID, av.ASSET_ID, av.VULN_ID, av.EXPOSED_PORT, av.STATUS,
             v.NAME, v.CVSS_SCORE, v.SEVERITY, v.DESCRIPTION, v.REMEDIATION, v.EXPLOITABILITY
      FROM ASSET_VULNERABILITIES av
      JOIN VULNERABILITIES v ON av.VULN_ID = v.VULN_ID
    `;
    const binds = {};
    if (assetId) {
      sql += ' WHERE av.ASSET_ID = :assetId';
      binds.assetId = assetId;
    }
    const res = await oracle.executeQuery(sql, binds);
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}

  let list = state.assetVulnerabilities.map(av => {
    const vuln = state.vulnerabilities.find(v => v.VULN_ID === av.VULN_ID) || {};
    return { ...av, ...vuln };
  });
  if (assetId) list = list.filter(item => item.ASSET_ID === assetId);
  return list;
}

async function getSecurityControls() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM SECURITY_CONTROLS ORDER BY CONTROL_ID ASC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.securityControls;
}

async function getAttackTechniques() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM ATTACK_TECHNIQUES ORDER BY TECHNIQUE_ID ASC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.attackTechniques;
}

async function getAttackPaths() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM ATTACK_PATHS ORDER BY RISK_SCORE DESC');
    if (res && res.rows && res.rows.length > 0) {
      const paths = res.rows;
      for (const p of paths) {
        const stepRes = await oracle.executeQuery('SELECT * FROM ATTACK_PATH_STEPS WHERE PATH_ID = :id ORDER BY STEP_ORDER ASC', { id: p.PATH_ID });
        p.STEPS = stepRes?.rows || [];
      }
      return paths;
    }
  } catch (err) {}
  return state.attackPaths;
}

async function saveAttackPaths(newPaths) {
  state.attackPaths = newPaths;
  try {
    // Sync to Oracle if connected
    for (const p of newPaths) {
      await oracle.executeQuery(
        `MERGE INTO ATTACK_PATHS ap
         USING (SELECT :id AS PATH_ID FROM DUAL) src
         ON (ap.PATH_ID = src.PATH_ID)
         WHEN MATCHED THEN
           UPDATE SET RISK_SCORE = :risk, CONFIDENCE_SCORE = :conf, STATUS = :status, EXPLANATION = :expl
         WHEN NOT MATCHED THEN
           INSERT (PATH_ID, NAME, ENTRY_POINT, TARGET_ASSET, HOP_COUNT, RISK_SCORE, CONFIDENCE_SCORE, VULNERABILITY_COUNT, CRITICAL_ASSETS_AFFECTED, PRIORITY, STATUS, EXPLANATION)
           VALUES (:id, :name, :entry, :target, :hops, :risk, :conf, :vcnt, :crit, :pri, :status, :expl)`,
        {
          id: p.PATH_ID,
          name: p.NAME || p.PATH_ID,
          entry: p.ENTRY_POINT,
          target: p.TARGET_ASSET,
          hops: p.HOP_COUNT || (p.STEPS ? p.STEPS.length : 1),
          risk: p.RISK_SCORE,
          conf: p.CONFIDENCE_SCORE || 85.0,
          vcnt: p.VULNERABILITY_COUNT || 1,
          crit: p.CRITICAL_ASSETS_AFFECTED || 1,
          pri: p.PRIORITY || 'HIGH',
          status: p.STATUS || 'ACTIVE',
          expl: (typeof p.EXPLANATION === 'object' ? (p.EXPLANATION?.narrative || '') : (p.EXPLANATION || '')).substring(0, 4000)
        }
      );
    }
  } catch (err) {
    console.warn('[DB] Oracle sync paths note:', err.message);
  }
}

async function getRiskAssessment() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM (SELECT * FROM RISK_ASSESSMENTS ORDER BY ASSESSMENT_ID DESC) WHERE ROWNUM = 1');
    if (res && res.rows && res.rows.length > 0) return res.rows[0];
  } catch (err) {}
  return state.riskAssessment;
}

async function updateRiskAssessment(newScores) {
  state.riskAssessment = { ...state.riskAssessment, ...newScores, ASSESSED_AT: new Date().toISOString() };
  try {
    await oracle.executeQuery(
      `INSERT INTO RISK_ASSESSMENTS (ASSESSMENT_ID, OVERALL_SECURITY_SCORE, NETWORK_RISK_SCORE, VULNERABILITY_HEALTH, NETWORK_SEGMENTATION, ASSET_EXPOSURE, ATTACK_PATH_RISK, SECURITY_CONTROLS_SCORE)
       VALUES (SEQ_RISK_ASSESS.NEXTVAL, :oss, :nrs, :vh, :ns, :ae, :apr, :scs)`,
      {
        oss: state.riskAssessment.OVERALL_SECURITY_SCORE,
        nrs: state.riskAssessment.NETWORK_RISK_SCORE,
        vh: state.riskAssessment.VULNERABILITY_HEALTH,
        ns: state.riskAssessment.NETWORK_SEGMENTATION,
        ae: state.riskAssessment.ASSET_EXPOSURE,
        apr: state.riskAssessment.ATTACK_PATH_RISK,
        scs: state.riskAssessment.SECURITY_CONTROLS_SCORE
      }
    );
  } catch (err) {}
}

async function getDefenseRecommendations() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM DEFENSE_RECOMMENDATIONS ORDER BY ESTIMATED_RISK_REDUCTION DESC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.defenseRecommendations;
}

async function updateDefenseStatus(recId, status) {
  const rec = state.defenseRecommendations.find(r => r.REC_ID === recId);
  if (rec) {
    rec.STATUS = status;
    rec.APPLIED_AT = status === 'APPLIED' ? new Date().toISOString() : null;
  }
  try {
    await oracle.executeQuery(
      'UPDATE DEFENSE_RECOMMENDATIONS SET STATUS = :status, APPLIED_AT = CURRENT_TIMESTAMP WHERE REC_ID = :recId',
      { status, recId }
    );
  } catch (err) {}
}

async function getSimulations() {
  try {
    const res = await oracle.executeQuery('SELECT * FROM SIMULATIONS ORDER BY SIMULATED_AT DESC');
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}
  return state.simulations;
}

async function saveSimulation(simData) {
  const sim = {
    SIMULATION_ID: simData.SIMULATION_ID || `SIM-${Date.now().toString().slice(-6)}`,
    SIMULATION_NAME: simData.SIMULATION_NAME || 'What-If Simulation Run',
    ENTRY_POINT: simData.ENTRY_POINT || 'internet',
    TARGET_ASSET: simData.TARGET_ASSET || 'db-server',
    DEFENSE_APPLIED: simData.DEFENSE_APPLIED || 'None',
    RISK_BEFORE: Number(simData.RISK_BEFORE || 91.0),
    RISK_AFTER: Number(simData.RISK_AFTER || 46.0),
    RISK_REDUCTION_PCT: Number(simData.RISK_REDUCTION_PCT || 49.45),
    OUTCOME: simData.OUTCOME || 'ATTACK_BLOCKED',
    SIMULATED_AT: new Date().toISOString()
  };
  state.simulations.unshift(sim);

  try {
    await oracle.executeQuery(
      `INSERT INTO SIMULATIONS (SIMULATION_ID, SIMULATION_NAME, ENTRY_POINT, TARGET_ASSET, DEFENSE_APPLIED, RISK_BEFORE, RISK_AFTER, RISK_REDUCTION_PCT, OUTCOME)
       VALUES (:id, :name, :entry, :target, :def, :rb, :ra, :rr, :outc)`,
      {
        id: sim.SIMULATION_ID,
        name: sim.SIMULATION_NAME,
        entry: sim.ENTRY_POINT,
        target: sim.TARGET_ASSET,
        def: sim.DEFENSE_APPLIED,
        rb: sim.RISK_BEFORE,
        ra: sim.RISK_AFTER,
        rr: sim.RISK_REDUCTION_PCT,
        outc: sim.OUTCOME
      }
    );
  } catch (err) {
    console.warn('[DB] Oracle save simulation note:', err.message);
  }
  return sim;
}

async function getAlerts(filter = 'ALL') {
  try {
    let sql = 'SELECT * FROM ALERTS';
    const binds = {};
    if (filter !== 'ALL') {
      sql += ' WHERE SEVERITY = :filter';
      binds.filter = filter.toUpperCase();
    }
    sql += ' ORDER BY CREATED_AT DESC';
    const res = await oracle.executeQuery(sql, binds);
    if (res && res.rows && res.rows.length > 0) return res.rows;
  } catch (err) {}

  let list = state.alerts;
  if (filter !== 'ALL') {
    list = list.filter(a => a.SEVERITY === filter.toUpperCase());
  }
  return list;
}

async function resolveAlert(alertId) {
  const alert = state.alerts.find(a => a.ALERT_ID === alertId);
  if (alert) alert.STATUS = 'RESOLVED';
  try {
    await oracle.executeQuery('UPDATE ALERTS SET STATUS = \'RESOLVED\' WHERE ALERT_ID = :alertId', { alertId });
  } catch (err) {}
}

async function addAlert(alertData) {
  const alert = {
    ALERT_ID: `ALT-${Date.now().toString().slice(-4)}`,
    TITLE: alertData.TITLE || 'New Security Event',
    SEVERITY: alertData.SEVERITY || 'MEDIUM',
    ALERT_TYPE: alertData.ALERT_TYPE || 'RISK_INCREASE',
    AFFECTED_ASSET_ID: alertData.AFFECTED_ASSET_ID || 'web-server',
    MESSAGE: alertData.MESSAGE || 'Security threshold breached.',
    STATUS: 'ACTIVE',
    CREATED_AT: new Date().toISOString()
  };
  state.alerts.unshift(alert);

  try {
    await oracle.executeQuery(
      'INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS) VALUES (:id, :title, :sev, :type, :asset, :msg, :status)',
      {
        id: alert.ALERT_ID,
        title: alert.TITLE,
        sev: alert.SEVERITY,
        type: alert.ALERT_TYPE,
        asset: alert.AFFECTED_ASSET_ID,
        msg: alert.MESSAGE,
        status: alert.STATUS
      }
    );
  } catch (err) {}
  return alert;
}

function resetToDefault() {
  state = JSON.parse(JSON.stringify(defaultState));
  return true;
}

module.exports = {
  getAssets,
  getAssetById,
  updateAssetSecurityState,
  getConnections,
  getVulnerabilities,
  getAssetVulnerabilities,
  getSecurityControls,
  getAttackTechniques,
  getAttackPaths,
  saveAttackPaths,
  getRiskAssessment,
  updateRiskAssessment,
  getDefenseRecommendations,
  updateDefenseStatus,
  getSimulations,
  saveSimulation,
  getAlerts,
  resolveAlert,
  addAlert,
  resetToDefault,
  getState: () => state
};
