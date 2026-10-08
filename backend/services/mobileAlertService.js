const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'data', 'mobile_alert_config.json');

class MobileAlertService {
  constructor() {
    this.config = {
      enabled: true,
      channel: 'telegram', // 'telegram', 'webhook', 'browser'
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
      webhookUrl: process.env.MOBILE_WEBHOOK_URL || '',
      minSeverity: 'HIGH', // 'CRITICAL', 'HIGH', 'ALL'
      cooldownSeconds: 15,
      alertHistory: []
    };
    this.lastAlertTime = 0;
    this.loadConfig();
  }

  loadConfig() {
    try {
      const dataDir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(CONFIG_FILE)) {
        const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        this.config = { ...this.config, ...saved };
      }
    } catch (e) {
      console.warn('[MobileAlert] Could not load saved config:', e.message);
    }
  }

  saveConfig() {
    try {
      const dataDir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (e) {
      console.error('[MobileAlert] Error saving config:', e.message);
    }
  }

  getConfig() {
    return {
      enabled: this.config.enabled,
      channel: this.config.channel,
      telegramBotToken: this.config.telegramBotToken ? '••••••••' + this.config.telegramBotToken.slice(-4) : '',
      hasTelegramToken: Boolean(this.config.telegramBotToken),
      telegramChatId: this.config.telegramChatId || '',
      webhookUrl: this.config.webhookUrl || '',
      minSeverity: this.config.minSeverity,
      cooldownSeconds: this.config.cooldownSeconds,
      recentAlerts: this.config.alertHistory.slice(0, 10)
    };
  }

  updateConfig(newConfig) {
    if (newConfig.enabled !== undefined) this.config.enabled = Boolean(newConfig.enabled);
    if (newConfig.channel) this.config.channel = newConfig.channel;
    if (newConfig.telegramBotToken && !newConfig.telegramBotToken.includes('••••')) {
      this.config.telegramBotToken = newConfig.telegramBotToken.trim();
    }
    if (newConfig.telegramChatId) this.config.telegramChatId = newConfig.telegramChatId.trim();
    if (newConfig.webhookUrl !== undefined) this.config.webhookUrl = newConfig.webhookUrl.trim();
    if (newConfig.minSeverity) this.config.minSeverity = newConfig.minSeverity;
    if (newConfig.cooldownSeconds) this.config.cooldownSeconds = parseInt(newConfig.cooldownSeconds);

    this.saveConfig();
    return this.getConfig();
  }

  async sendMobileAlert(incident) {
    if (!this.config.enabled) return { sent: false, reason: 'Alerts disabled' };

    // Check severity threshold
    if (this.config.minSeverity === 'CRITICAL' && incident.severity !== 'CRITICAL') {
      return { sent: false, reason: 'Below severity threshold' };
    }

    // Cooldown check to prevent alerting every second
    const now = Date.now();
    if (now - this.lastAlertTime < this.config.cooldownSeconds * 1000) {
      return { sent: false, reason: 'Cooldown active' };
    }

    this.lastAlertTime = now;

    const alertPayload = {
      title: `🚨 [CYBERSECURITY ALERT] ${incident.attackType || 'INTRUSION DETECTED'}`,
      targetNode: incident.nodeName || incident.nodeId || 'Network Asset',
      ip: incident.ip || 'Internal Subnet',
      severity: incident.severity || 'CRITICAL',
      confidence: incident.confidence ? `${incident.confidence}%` : 'High',
      riskScore: incident.riskScore ? `${incident.riskScore}/100` : 'Elevated',
      indicators: Array.isArray(incident.indicators) ? incident.indicators.join('; ') : incident.indicators || 'Anomalous traffic',
      recommendation: incident.mitigation || 'Isolate compromised node and inspect edge firewall logs.',
      timestamp: new Date().toLocaleTimeString()
    };

    const textMessage = 
`🚨 CYBER DIGITAL TWIN ALERT!
━━━━━━━━━━━━━━━━━━━━
⚠️ Attack: ${alertPayload.title.replace('🚨 [CYBERSECURITY ALERT] ', '')}
🎯 Target: ${alertPayload.targetNode} (${alertPayload.ip})
🔥 Severity: ${alertPayload.severity} | Score: ${alertPayload.riskScore}
🤖 AI Confidence: ${alertPayload.confidence} (Weka RF)
🔍 Signatures: ${alertPayload.indicators}
🛡️ Mitigation: ${alertPayload.recommendation}
⏰ Time: ${alertPayload.timestamp}`;

    let result = { sent: false, channel: this.config.channel, timestamp: new Date().toISOString() };

    // 1. Dispatch via Telegram Bot
    if (this.config.telegramBotToken && this.config.telegramChatId) {
      try {
        const tgUrl = `https://api.telegram.org/bot${this.config.telegramBotToken}/sendMessage`;
        const resp = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.config.telegramChatId,
            text: textMessage,
            parse_mode: 'HTML'
          }),
          signal: AbortSignal.timeout(5000)
        });
        const tgData = await resp.json();
        result.telegram = tgData.ok ? 'SUCCESS' : tgData.description;
        if (tgData.ok) result.sent = true;
      } catch (err) {
        result.telegram = 'Error: ' + err.message;
        console.error('[MobileAlert] Telegram dispatch error:', err.message);
      }
    }

    // 2. Dispatch via Generic Webhook (Slack / Discord / Zapier / Pushover / SMS service)
    if (this.config.webhookUrl) {
      try {
        const resp = await fetch(this.config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'CYBER_ATTACK_PREDICTED',
            content: textMessage,
            text: textMessage,
            alert: alertPayload
          }),
          signal: AbortSignal.timeout(5000)
        });
        result.webhook = resp.ok ? 'SUCCESS' : `HTTP ${resp.status}`;
        if (resp.ok) result.sent = true;
      } catch (err) {
        result.webhook = 'Error: ' + err.message;
        console.error('[MobileAlert] Webhook dispatch error:', err.message);
      }
    }

    // Record in history
    this.config.alertHistory.unshift({
      id: Date.now(),
      attackType: incident.attackType,
      targetNode: alertPayload.targetNode,
      severity: alertPayload.severity,
      timestamp: new Date().toISOString(),
      dispatched: result
    });
    if (this.config.alertHistory.length > 50) this.config.alertHistory.pop();
    this.saveConfig();

    return result;
  }

  async sendTestAlert() {
    return this.sendMobileAlert({
      attackType: 'TEST_VERIFICATION_ALERT',
      nodeName: 'Perimeter Firewall FW-01',
      nodeId: 'node-firewall',
      ip: '10.0.0.1',
      severity: 'HIGH',
      confidence: 99.8,
      riskScore: 84.5,
      indicators: 'Mobile verification ping test sent from SOC Dashboard',
      mitigation: 'Mobile alert channel is operational and ready to receive real-time attack predictions.'
    });
  }
}

module.exports = new MobileAlertService();
