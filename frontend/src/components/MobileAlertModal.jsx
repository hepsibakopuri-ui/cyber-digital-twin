import React, { useState, useEffect } from 'react';
import { Smartphone, Send, Bell, QrCode, CheckCircle, AlertTriangle, X, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MobileAlertModal({ isOpen, onClose }) {
  const [config, setConfig] = useState({
    enabled: true,
    channel: 'telegram',
    telegramBotToken: '',
    telegramChatId: '',
    webhookUrl: '',
    minSeverity: 'HIGH',
    cooldownSeconds: 15
  });
  const [networkInfo, setNetworkInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [browserNotificationStatus, setBrowserNotificationStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (!isOpen) return;

    // Fetch config
    fetch('/api/mobile-alerts/config')
      .then(r => r.json())
      .then(data => {
        if (data) setConfig(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.warn('Could not fetch mobile alert config:', err));

    // Fetch network IP for mobile browser QR link
    fetch('/api/mobile-alerts/network-info')
      .then(r => r.json())
      .then(data => {
        if (data) setNetworkInfo(data);
      })
      .catch(err => console.warn('Could not fetch network info:', err));
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setSaveStatus('Saving...');
      const res = await fetch('/api/mobile-alerts/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Error saving: ' + e.message);
    }
  };

  const handleTestAlert = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/mobile-alerts/test', { method: 'POST' });
      const data = await res.json();
      setTestResult(data.result);
    } catch (e) {
      setTestResult({ error: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const requestBrowserPush = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported in this browser.');
      return;
    }
    const perm = await Notification.requestPermission();
    setBrowserNotificationStatus(perm);
    if (perm === 'granted') {
      new Notification('Cyber Digital Twin Mobile Alerts Active', {
        body: 'You will receive instant alerts when Weka AI detects cyber attacks!',
        icon: '/favicon.ico'
      });
    }
  };

  if (!isOpen) return null;

  const mobileUrl = networkInfo?.mobileUrl || 'http://localhost:3000';
  // Standard QR code URL generator for instant camera scanning
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}&bgcolor=0b101d&color=38bdf8`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d1424] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-cyber-border/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Mobile Threat Alert Center</h3>
              <p className="text-[11px] text-slate-400">Receive instant attack alerts & monitor the digital twin on your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Method 1: Instant Browser Notification / Open on Mobile via QR */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0 bg-slate-950 p-2 rounded-lg border border-cyan-500/30">
              <img
                src={qrCodeUrl}
                alt="Scan to open on phone"
                className="w-28 h-28 rounded"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Method 1: Scan & Open Live Digital Twin on Phone
              </span>
              <p className="text-[11px] text-slate-300">
                Scan the QR code with your phone camera or navigate to:
              </p>
              <div className="font-mono-code text-cyan-300 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs break-all">
                {mobileUrl}
              </div>
              <p className="text-[10px] text-slate-400">
                Connected over Wi-Fi ({networkInfo?.localIp || 'Local LAN'}). You can monitor the digital twin and execute mitigations right from your phone.
              </p>
              <div>
                <button
                  onClick={requestBrowserPush}
                  className="mt-1 px-3 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold transition flex items-center gap-1.5 mx-auto md:mx-0"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {browserNotificationStatus === 'granted'
                      ? 'Browser Notifications Enabled ✓'
                      : 'Enable Lock-Screen Notifications'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Method 2: Telegram Bot Mobile Alerts */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-xs">Method 2: Telegram Bot Mobile Push Alerts</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                100% Free & Instant
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Receive instant rich messages on your Telegram app the exact second Weka AI detects an attack on the digital twin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="password"
                  placeholder="e.g. 7123456789:AAH..."
                  value={config.telegramBotToken}
                  onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono-code text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789"
                  value={config.telegramChatId}
                  onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono-code text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Quick 2-step setup hint */}
            <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">How to get a free Telegram Bot in 1 minute:</span>
              <p>1. In Telegram, message <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-cyan-400 underline">@BotFather</a> and send <code className="text-cyan-300">/newbot</code> to get your Bot Token.</p>
              <p>2. Send any message to <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-cyan-400 underline">@userinfobot</a> to see your Chat ID.</p>
            </div>
          </div>

          {/* Method 3: Webhook URL (Discord / Slack / Pushover / SMS) */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <span className="font-bold text-white text-xs block">Method 3: Custom Webhook (Discord / Slack / Pushover)</span>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/... or Slack webhook"
                value={config.webhookUrl}
                onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono-code text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Test Alert Feedback */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs font-mono-code ${
              testResult.sent ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200' : 'bg-amber-950/80 border-amber-700 text-amber-200'
            }`}>
              <span className="font-bold block mb-1">
                {testResult.sent ? '✓ Test Alert Dispatched to Mobile!' : 'Notice regarding alert test:'}
              </span>
              <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-cyber-border/80 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleTestAlert}
            disabled={isTesting}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isTesting ? 'Dispatching...' : 'Send Test Mobile Alert'}</span>
          </button>

          <div className="flex items-center space-x-3">
            {saveStatus && (
              <span className="text-xs font-mono-code text-cyan-400">{saveStatus}</span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
