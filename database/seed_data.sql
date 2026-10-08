-- =============================================================================
-- AI-BASED CYBERSECURITY DIGITAL TWIN WITH ATTACK PREDICTION
-- Oracle Database 11g / 12c / 19c / 21c XE Seed Data for SQL*Plus
-- =============================================================================

SET DEFINE OFF;
SET ECHO ON;
SET FEEDBACK ON;

PROMPT [Seeding 1/14] USERS
INSERT INTO USERS (USER_ID, USERNAME, EMAIL, PASSWORD_HASH, ROLE, FULL_NAME, LAST_LOGIN)
VALUES (SEQ_USERS.NEXTVAL, 'admin', 'admin@example.com', '$2a$10$v73XqWqjCqH1mZkWVwZt6uS7eZ.9C4GgD5aB7uF.8i7Y7nK.6L7yC', 'SOC_ADMIN', 'SOC Lead Security Architect', CURRENT_TIMESTAMP);

INSERT INTO USERS (USER_ID, USERNAME, EMAIL, PASSWORD_HASH, ROLE, FULL_NAME, LAST_LOGIN)
VALUES (SEQ_USERS.NEXTVAL, 'analyst', 'analyst@example.com', '$2a$10$v73XqWqjCqH1mZkWVwZt6uS7eZ.9C4GgD5aB7uF.8i7Y7nK.6L7yC', 'SOC_ANALYST', 'Tier-2 Threat Hunter', CURRENT_TIMESTAMP);

PROMPT [Seeding 2/14] ASSETS (Digital Twin Nodes)
INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('internet', 'Public Internet', 'External Gateway', '198.51.100.1', 'N/A (Untrusted)', 'EXTERNAL', 'LOW', 'SECURE', '0', 0, 15.0, 50, 220);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('fw-ext', 'Perimeter Firewall', 'Firewall', '10.0.0.1', 'FortiOS 7.4 Enterprise', 'PERIMETER', 'HIGH', 'LOW_RISK', '443, 80, 53', 1, 32.5, 230, 220);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('web-server', 'Web Server (DMZ)', 'Web Server', '10.0.1.10', 'Ubuntu Linux 22.04 LTS (Nginx 1.24)', 'DMZ', 'HIGH', 'CRITICAL', '80, 443, 8080', 2, 88.5, 420, 120);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('emp-pc', 'Employee PC (Office)', 'Workstation', '10.0.4.22', 'Windows 11 Pro 23H2', 'USER_LAN', 'MEDIUM', 'MEDIUM_RISK', '445, 139, 3389', 1, 55.0, 420, 340);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('fw-int', 'Internal Firewall', 'Firewall', '10.0.2.1', 'Cisco ASA OS 9.18', 'INTERNAL', 'HIGH', 'LOW_RISK', '443, 8080, 1521', 0, 24.0, 600, 220);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('app-server', 'Application Server', 'Application Server', '10.0.2.15', 'Red Hat Enterprise Linux 9.2 (Tomcat 10)', 'INTERNAL_APP', 'HIGH', 'HIGH_RISK', '8080, 8443, 22', 1, 74.0, 780, 120);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('admin-pc', 'Admin Workstation', 'Workstation', '10.0.4.99', 'Windows Server 2022 Datacenter', 'PRIVILEGED_LAN', 'CRITICAL', 'HIGH_RISK', '22, 3389, 445', 1, 71.0, 780, 340);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('db-server', 'Database Server (Oracle)', 'Database Server', '10.0.3.50', 'Oracle Linux 8.8 (Oracle Database Enterprise)', 'SECURE_DATA', 'CRITICAL', 'CRITICAL', '1521, 22', 1, 91.0, 980, 120);

INSERT INTO ASSETS (ASSET_ID, NAME, DEVICE_TYPE, IP_ADDRESS, OPERATING_SYSTEM, ZONE, CRITICALITY, SECURITY_STATE, OPEN_PORTS, VULNERABILITY_COUNT, RISK_SCORE, POSITION_X, POSITION_Y)
VALUES ('cloud-vpc', 'Cloud VPC Server', 'Cloud Instance', '172.16.0.5', 'Amazon Linux 2023 (Microservices Gateway)', 'CLOUD_VPC', 'HIGH', 'MEDIUM_RISK', '443, 8443', 1, 62.0, 600, 40);

PROMPT [Seeding 3/14] ASSET_CONNECTIONS
INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'internet', 'fw-ext', 'HTTPS', 443, 10000, 'Y', 'Y', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'fw-ext', 'web-server', 'HTTP/HTTPS', 443, 1000, 'Y', 'Y', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'fw-ext', 'emp-pc', 'TCP', 445, 1000, 'N', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'web-server', 'fw-int', 'TCP', 8080, 1000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'web-server', 'emp-pc', 'TCP', 445, 1000, 'N', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'emp-pc', 'admin-pc', 'RDP/SMB', 3389, 1000, 'N', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'fw-int', 'app-server', 'HTTP/TCP', 8080, 10000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'app-server', 'db-server', 'Oracle TNS', 1521, 10000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'admin-pc', 'app-server', 'SSH', 22, 1000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'admin-pc', 'db-server', 'Oracle TNS', 1521, 1000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'cloud-vpc', 'fw-int', 'HTTPS', 8443, 5000, 'Y', 'N', 'ACTIVE');

INSERT INTO ASSET_CONNECTIONS (CONNECTION_ID, SOURCE_ASSET_ID, TARGET_ASSET_ID, PROTOCOL, PORT, BANDWIDTH_MBPS, IS_ENCRYPTED, IS_EXPOSED, STATUS)
VALUES (SEQ_ASSET_CONNECTIONS.NEXTVAL, 'cloud-vpc', 'app-server', 'HTTPS', 8443, 5000, 'Y', 'N', 'ACTIVE');

PROMPT [Seeding 4/14] VULNERABILITIES (CVEs)
INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2024-21887', 'Web Application Command Injection', 9.1, 'CRITICAL', 'Command injection vulnerability in web-tier endpoints allowing unauthenticated remote code execution via crafting malicious URI headers.', 'Apply security update K-8812 and enforce strict input sanitation rules.', 'FUNCTIONAL', 'N');

INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2021-44228', 'Apache Log4j JNDI Remote Code Execution', 9.8, 'CRITICAL', 'JNDI lookups in logging requests permit remote unauthenticated attackers to execute arbitrary Java code via nested log payload interpolation.', 'Upgrade to Log4j v2.17.1 or set log4j2.formatMsgNoLookups=true.', 'HIGH', 'N');

INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2023-38606', 'Lateral Movement Service Privilege Escalation', 8.4, 'HIGH', 'Flaw in RPC daemon state transitions allows standard users to impersonate local service accounts and pivot through trusted application channels.', 'Patch RPC daemon to v3.4.1 and restrict cross-subnet RPC bindings.', 'FUNCTIONAL', 'N');

INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2024-38112', 'Spoofed Protocol Handler Execution (Phishing)', 7.5, 'HIGH', 'MSHTML spoofing vector where malicious shortcuts invoke underlying browser rendering engines to silently download remote stages.', 'Deploy Windows Security cumulative update and enforce Defender Attack Surface Reduction.', 'PROOFOFCONCEPT', 'N');

INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2024-6387', 'regreSSHion Signal Handler RCE', 8.1, 'HIGH', 'Signal handler race condition in OpenSSH server allowing unauthenticated code execution as root in default configurations.', 'Upgrade OpenSSH to version 9.8p1 or set LoginGraceTime 0.', 'FUNCTIONAL', 'N');

INSERT INTO VULNERABILITIES (VULN_ID, NAME, CVSS_SCORE, SEVERITY, DESCRIPTION, REMEDIATION, EXPLOITABILITY, IS_ZERO_DAY)
VALUES ('CVE-2024-3400', 'Firewall OS Command Injection', 10.0, 'CRITICAL', 'Critical flaw in firewall telemetry processing allows remote root execution without prior authentication.', 'Apply vendor hotfix HF-09 and disable telemetry daemon.', 'FUNCTIONAL', 'Y');

PROMPT [Seeding 5/14] ASSET_VULNERABILITIES
INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'web-server', 'CVE-2024-21887', 443, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'web-server', 'CVE-2021-44228', 8080, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'app-server', 'CVE-2023-38606', 8080, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'emp-pc', 'CVE-2024-38112', 445, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'admin-pc', 'CVE-2024-6387', 22, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'db-server', 'CVE-2023-38606', 1521, 'UNPATCHED');

INSERT INTO ASSET_VULNERABILITIES (ID, ASSET_ID, VULN_ID, EXPOSED_PORT, STATUS)
VALUES (SEQ_ASSET_VULN.NEXTVAL, 'cloud-vpc', 'CVE-2021-44228', 8443, 'UNPATCHED');

PROMPT [Seeding 6/14] SECURITY_CONTROLS
INSERT INTO SECURITY_CONTROLS (CONTROL_ID, NAME, CONTROL_TYPE, APPLIED_TO_ASSET, STATUS, EFFECTIVENESS_PCT, DESCRIPTION)
VALUES ('CTRL-WAF', 'Enterprise Web Application Firewall', 'WAF', 'web-server', 'ACTIVE', 70.0, 'Inspects HTTP requests for SQLi, XSS, and known exploit patterns.');

INSERT INTO SECURITY_CONTROLS (CONTROL_ID, NAME, CONTROL_TYPE, APPLIED_TO_ASSET, STATUS, EFFECTIVENESS_PCT, DESCRIPTION)
VALUES ('CTRL-SEG', 'DMZ-to-Data Tier Microsegmentation', 'Network Segmentation', 'fw-int', 'DISABLED', 30.0, 'Strict zone isolation between DMZ web tier and internal database subnet.');

INSERT INTO SECURITY_CONTROLS (CONTROL_ID, NAME, CONTROL_TYPE, APPLIED_TO_ASSET, STATUS, EFFECTIVENESS_PCT, DESCRIPTION)
VALUES ('CTRL-EDR', 'CrowdStrike Falcon Endpoint EDR', 'EDR', 'emp-pc', 'ACTIVE', 85.0, 'Behavioral process tracking and ransomware heuristic interception.');

INSERT INTO SECURITY_CONTROLS (CONTROL_ID, NAME, CONTROL_TYPE, APPLIED_TO_ASSET, STATUS, EFFECTIVENESS_PCT, DESCRIPTION)
VALUES ('CTRL-MFA', 'FIDO2 / TOTP Privileged MFA', 'MFA', 'admin-pc', 'PARTIAL', 60.0, 'Hardware token verification for administrative sessions.');

INSERT INTO SECURITY_CONTROLS (CONTROL_ID, NAME, CONTROL_TYPE, APPLIED_TO_ASSET, STATUS, EFFECTIVENESS_PCT, DESCRIPTION)
VALUES ('CTRL-IPS', 'Intrusion Prevention Deep Inspection', 'IDS/IPS', 'fw-ext', 'ACTIVE', 80.0, 'Snort-based protocol anomaly and known signature blocking.');

PROMPT [Seeding 7/14] ATTACK_TECHNIQUES (MITRE ATT&CK)
INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1190', 'Exploit Public-Facing Application', 'Initial Access', 'Adversaries may attempt to exploit a vulnerability in an Internet-facing service or application to gain initial system access.', 0.95);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1059', 'Command and Scripting Interpreter', 'Execution', 'Adversaries may abuse command and script interpreters to execute arbitrary commands, scripts, or binaries.', 0.88);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1078', 'Valid Accounts', 'Defense Evasion / Persistence', 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, or Privilege Escalation.', 0.82);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1021', 'Remote Services (SSH/RDP/SMB)', 'Lateral Movement', 'Adversaries may use valid accounts to log into a service specifically designed to accept remote connections across internal subnets.', 0.85);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1003', 'OS Credential Dumping', 'Credential Access', 'Adversaries may attempt to dump credentials to obtain account login information from the operating system security subsystems.', 0.90);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1048', 'Exfiltration Over Alternative Protocol', 'Exfiltration', 'Adversaries may steal sensitive enterprise data by redirecting traffic through secondary protocol tunnels to external control servers.', 0.92);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1046', 'Network Service Discovery', 'Discovery', 'Adversaries may attempt to get a listing of services running on hosts across the network to locate viable exploitation targets.', 0.70);

INSERT INTO ATTACK_TECHNIQUES (TECHNIQUE_ID, NAME, TACTIC, DESCRIPTION, SEVERITY_WEIGHT)
VALUES ('T1566', 'Phishing: Spearphishing Link', 'Initial Access', 'Adversaries may send spearphishing emails with malicious links to induce users to execute malicious code or provide credentials.', 0.80);

PROMPT [Seeding 8/14] ATTACK_PATHS (Predicted Trajectories)
INSERT INTO ATTACK_PATHS (PATH_ID, NAME, ENTRY_POINT, TARGET_ASSET, HOP_COUNT, RISK_SCORE, CONFIDENCE_SCORE, VULNERABILITY_COUNT, CRITICAL_ASSETS_AFFECTED, PRIORITY, STATUS, EXPLANATION)
VALUES ('PATH-01', 'DMZ Web Ingress to Core Database Crown Jewel', 'internet', 'db-server', 3, 91.0, 94.5, 3, 2, 'CRITICAL', 'ACTIVE',
'The Web Server is the primary vulnerable entry point exposed to the public Internet with unpatched CVE-2024-21887 and Log4Shell on port 443/8080. Upon web compromise, the absence of strict microsegmentation on the internal firewall permits lateral movement into Tomcat Application Server, which holds active database connection pool credentials to the Oracle Database Server, exposing enterprise customer records.');

INSERT INTO ATTACK_PATHS (PATH_ID, NAME, ENTRY_POINT, TARGET_ASSET, HOP_COUNT, RISK_SCORE, CONFIDENCE_SCORE, VULNERABILITY_COUNT, CRITICAL_ASSETS_AFFECTED, PRIORITY, STATUS, EXPLANATION)
VALUES ('PATH-02', 'Web Breach to Workstation Lateral Traversal to Admin Core', 'internet', 'admin-pc', 3, 73.0, 82.0, 2, 1, 'HIGH', 'ACTIVE',
'Adversaries breaching the Web Server pivot laterally into user workstations via unauthenticated SMB/RPC calls on port 445. Once established on the Employee PC, cached Kerberos tickets or SSH keys enable lateral pivoting into the Admin Workstation, facilitating domain credential takeover.');

INSERT INTO ATTACK_PATHS (PATH_ID, NAME, ENTRY_POINT, TARGET_ASSET, HOP_COUNT, RISK_SCORE, CONFIDENCE_SCORE, VULNERABILITY_COUNT, CRITICAL_ASSETS_AFFECTED, PRIORITY, STATUS, EXPLANATION)
VALUES ('PATH-03', 'Phished Employee Endpoint to Enterprise Database Pivot', 'emp-pc', 'db-server', 2, 58.0, 75.0, 2, 1, 'MEDIUM', 'ACTIVE',
'Initial spearphishing compromise of an office employee PC allows adversaries to discover internal application endpoints over port 8080. Utilizing unpatched RPC privilege escalation, the attacker moves through the Application Server directly into the Oracle Database Server.');

INSERT INTO ATTACK_PATHS (PATH_ID, NAME, ENTRY_POINT, TARGET_ASSET, HOP_COUNT, RISK_SCORE, CONFIDENCE_SCORE, VULNERABILITY_COUNT, CRITICAL_ASSETS_AFFECTED, PRIORITY, STATUS, EXPLANATION)
VALUES ('PATH-04', 'Cloud VPC API Breach to Internal Application & Database', 'cloud-vpc', 'db-server', 2, 64.0, 80.0, 2, 2, 'HIGH', 'ACTIVE',
'Vulnerable microservices within the Cloud VPC gateway allow remote exploit execution. Via the trusted cross-cloud tunnel into the internal firewall, attackers reach Tomcat microservices on the Application Server and query the Oracle Database tier.');

PROMPT [Seeding 9/14] ATTACK_PATH_STEPS
-- PATH-01 Steps
INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-01', 1, 'internet', 'web-server', 'T1190', 'CVE-2024-21887', 92.0, 'Attacker delivers remote command injection payload to public-facing Web Server on port 443.');

INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-01', 2, 'web-server', 'app-server', 'T1021', 'CVE-2023-38606', 84.0, 'Attacker pivots from Web Server across Internal Firewall into Application Server via Tomcat RPC.');

INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-01', 3, 'app-server', 'db-server', 'T1048', NULL, 96.0, 'Attacker leverages existing SQL connection pool to execute queries and exfiltrate database records.');

-- PATH-02 Steps
INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-02', 1, 'internet', 'web-server', 'T1190', 'CVE-2024-21887', 92.0, 'Initial compromise of Web Server via unauthenticated external request.');

INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-02', 2, 'web-server', 'emp-pc', 'T1021', 'CVE-2024-38112', 68.0, 'Lateral SMB probe from DMZ Web Server into User LAN employee workstation.');

INSERT INTO ATTACK_PATH_STEPS (STEP_ID, PATH_ID, STEP_ORDER, FROM_ASSET, TO_ASSET, TECHNIQUE_ID, VULN_ID, STEP_RISK, DESCRIPTION)
VALUES (SEQ_PATH_STEPS.NEXTVAL, 'PATH-02', 3, 'emp-pc', 'admin-pc', 'T1003', 'CVE-2024-6387', 82.0, 'Attacker harvests administrative session tokens and connects to Admin Workstation via RDP.');

PROMPT [Seeding 10/14] RISK_ASSESSMENTS
INSERT INTO RISK_ASSESSMENTS (ASSESSMENT_ID, OVERALL_SECURITY_SCORE, NETWORK_RISK_SCORE, VULNERABILITY_HEALTH, NETWORK_SEGMENTATION, ASSET_EXPOSURE, ATTACK_PATH_RISK, SECURITY_CONTROLS_SCORE)
VALUES (SEQ_RISK_ASSESS.NEXTVAL, 78.0, 82.5, 68.0, 62.0, 74.0, 91.0, 75.0);

PROMPT [Seeding 11/14] DEFENSE_RECOMMENDATIONS
INSERT INTO DEFENSE_RECOMMENDATIONS (REC_ID, TITLE, AFFECTED_ASSET_ID, ACTION_TYPE, REASON, ESTIMATED_RISK_REDUCTION, PRIORITY, STATUS)
VALUES ('REC-01', 'Patch Web Server Remote Code Execution Vulnerabilities', 'web-server', 'PATCH',
'Apply security patches for CVE-2024-21887 and Apache Log4j (CVE-2021-44228) on the DMZ Web Server. Eliminating initial remote execution collapses the highest-probability entry vector.', 49.45, 'CRITICAL', 'PENDING');

INSERT INTO DEFENSE_RECOMMENDATIONS (REC_ID, TITLE, AFFECTED_ASSET_ID, ACTION_TYPE, REASON, ESTIMATED_RISK_REDUCTION, PRIORITY, STATUS)
VALUES ('REC-02', 'Enable Zero-Trust Microsegmentation between Web & Database Tiers', 'fw-int', 'SEGMENTATION',
'Enforce strict egress filtering on the Internal Firewall, disallowing any direct communication from the DMZ web subnet to the secure Oracle database tier.', 35.0, 'HIGH', 'PENDING');

INSERT INTO DEFENSE_RECOMMENDATIONS (REC_ID, TITLE, AFFECTED_ASSET_ID, ACTION_TYPE, REASON, ESTIMATED_RISK_REDUCTION, PRIORITY, STATUS)
VALUES ('REC-03', 'Restrict Unnecessary Exposed Ports on Perimeter Gateway', 'fw-ext', 'PORT_RESTRICTION',
'Close unneeded management ports and block plaintext HTTP port 80 to restrict external attack surface discovery.', 25.0, 'MEDIUM', 'PENDING');

INSERT INTO DEFENSE_RECOMMENDATIONS (REC_ID, TITLE, AFFECTED_ASSET_ID, ACTION_TYPE, REASON, ESTIMATED_RISK_REDUCTION, PRIORITY, STATUS)
VALUES ('REC-04', 'Enforce FIDO2 Multi-Factor Authentication on Admin Workstations', 'admin-pc', 'MFA_ENFORCE',
'Require hardware-backed token authorization for all RDP and SSH sessions connecting to Admin Workstation and Database host.', 30.0, 'HIGH', 'PENDING');

INSERT INTO DEFENSE_RECOMMENDATIONS (REC_ID, TITLE, AFFECTED_ASSET_ID, ACTION_TYPE, REASON, ESTIMATED_RISK_REDUCTION, PRIORITY, STATUS)
VALUES ('REC-05', 'Deploy Deep EDR & Honeypot Monitoring on Tomcat Application Server', 'app-server', 'ENHANCED_MONITORING',
'Instrument memory-space behavioral monitoring and honeypot database credentials to immediately trap lateral movement attempts.', 18.0, 'LOW', 'PENDING');

PROMPT [Seeding 12/14] SIMULATIONS (What-If History)
INSERT INTO SIMULATIONS (SIMULATION_ID, SIMULATION_NAME, ENTRY_POINT, TARGET_ASSET, DEFENSE_APPLIED, RISK_BEFORE, RISK_AFTER, RISK_REDUCTION_PCT, OUTCOME)
VALUES ('SIM-HIST-01', 'Baseline Public Web Breach Simulation', 'internet', 'db-server', 'None (Unmitigated Baseline)', 91.0, 91.0, 0.0, 'BREACH_SIMULATED');

INSERT INTO SIMULATIONS (SIMULATION_ID, SIMULATION_NAME, ENTRY_POINT, TARGET_ASSET, DEFENSE_APPLIED, RISK_BEFORE, RISK_AFTER, RISK_REDUCTION_PCT, OUTCOME)
VALUES ('SIM-HIST-02', 'Simulated Web Patch & Port Restriction Trial', 'internet', 'db-server', 'Patch CVE-2024-21887 + Strict Port Restriction', 91.0, 46.0, 49.45, 'ATTACK_BLOCKED');

INSERT INTO SIMULATIONS (SIMULATION_ID, SIMULATION_NAME, ENTRY_POINT, TARGET_ASSET, DEFENSE_APPLIED, RISK_BEFORE, RISK_AFTER, RISK_REDUCTION_PCT, OUTCOME)
VALUES ('SIM-HIST-03', 'Employee PC Spearphishing Containment Test', 'emp-pc', 'admin-pc', 'EDR Automated Host Quarantine', 73.0, 28.0, 61.64, 'BREACH_PREVENTED');

PROMPT [Seeding 13/14] SIMULATION_EVENTS
INSERT INTO SIMULATION_EVENTS (EVENT_ID, SIMULATION_ID, STEP_NUMBER, TIMESTAMP_OFFSET_MS, CURRENT_ASSET, NEXT_ASSET, TECHNIQUE_ID, EVENT_TYPE, DETAILS)
VALUES (SEQ_SIM_EVENTS.NEXTVAL, 'SIM-HIST-02', 1, 0, 'internet', 'web-server', 'T1190', 'EXPLOIT', 'Attacker dispatches command injection payload across port 443.');

INSERT INTO SIMULATION_EVENTS (EVENT_ID, SIMULATION_ID, STEP_NUMBER, TIMESTAMP_OFFSET_MS, CURRENT_ASSET, NEXT_ASSET, TECHNIQUE_ID, EVENT_TYPE, DETAILS)
VALUES (SEQ_SIM_EVENTS.NEXTVAL, 'SIM-HIST-02', 2, 850, 'web-server', 'web-server', 'T1190', 'BLOCKED', 'Patched web server rejects command injection; signature dropped by virtual patch.');

INSERT INTO SIMULATION_EVENTS (EVENT_ID, SIMULATION_ID, STEP_NUMBER, TIMESTAMP_OFFSET_MS, CURRENT_ASSET, NEXT_ASSET, TECHNIQUE_ID, EVENT_TYPE, DETAILS)
VALUES (SEQ_SIM_EVENTS.NEXTVAL, 'SIM-HIST-02', 3, 1400, 'web-server', 'fw-int', 'T1021', 'BLOCKED', 'Lateral traversal blocked. Downstream database remains untouched.');

PROMPT [Seeding 14/14] ALERTS
INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS)
VALUES ('ALT-101', 'Critical Multi-Hop Attack Path Predicted', 'CRITICAL', 'ATTACK_PATH_DETECTED', 'db-server',
'AI Prediction engine identified a 91% risk trajectory traversing Internet -> Web Server -> Application Server -> Oracle Database Server.', 'ACTIVE');

INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS)
VALUES ('ALT-102', 'High-Severity Vulnerability on Exposed Asset', 'HIGH', 'HIGH_VULNERABILITY', 'web-server',
'CVE-2024-21887 (CVSS 9.1) detected on DMZ Web Server with exposed port 443 active.', 'ACTIVE');

INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS)
VALUES ('ALT-103', 'Database Server Crown Jewel Exposure', 'CRITICAL', 'CRITICAL_EXPOSURE', 'db-server',
'Oracle Database Server holding customer PII is reachable via 2 unsegmented lateral network links.', 'ACTIVE');

INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS)
VALUES ('ALT-104', 'Privileged Account Traversal Vector Detected', 'HIGH', 'RISK_INCREASE', 'admin-pc',
'Kerberos session caching on Employee PC exposes Admin Workstation via SMB port 445.', 'ACTIVE');

INSERT INTO ALERTS (ALERT_ID, TITLE, SEVERITY, ALERT_TYPE, AFFECTED_ASSET_ID, MESSAGE, STATUS)
VALUES ('ALT-105', 'Defense Mitigation Rule Ready for Verification', 'INFO', 'DEFENSE_APPLIED', 'web-server',
'Virtual patch recommendation REC-01 computed: estimated 49.45% risk reduction upon deployment.', 'ACKNOWLEDGED');

COMMIT;
PROMPT =========================================================================
PROMPT Oracle Database Enterprise Seed Data Loaded Successfully for SQL*Plus!
PROMPT =========================================================================
