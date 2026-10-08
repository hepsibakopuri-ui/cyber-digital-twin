import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Shield,
  Cpu,
  ArrowRight,
  Database,
  Lock,
  User,
  Sparkles,
  Activity,
  Layers,
  Key
} from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('CyberTwin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      if (res && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

        {/* Subtle Network Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), radial-gradient(rgba(139,92,246,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 flex h-20 items-center justify-between px-8 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Network className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white font-mono-code">
              CYBER TWIN
            </span>
            <span className="ml-2 rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300 font-mono-code">
              ENTERPRISE SOC 2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400 font-mono-code">
            <Database className="h-3.5 w-3.5 text-amber-400" />
            Oracle XE Connected
          </span>
          <a
            href="#auth"
            className="rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 px-3.5 py-1.5 font-semibold text-cyan-300 transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Main Hero & Console Login */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs text-cyan-300 font-mono-code backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Oracle Database XE & Explainable AI Prediction
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            AI-Powered Cybersecurity <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Digital Twin & Threat Prediction
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light"
          >
            Predict attack paths. Understand risk. Simulate defense. Continuous closed-loop digital twin
            posture evaluation with automated risk recalculation.
          </motion.p>
        </div>

        {/* Interactive Console Login Card */}
        <motion.div
          id="auth"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white">Enter Security Console</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select preconfigured SOC analyst credentials to launch platform
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Analyst Email</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/90 pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Access Token / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/90 pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono-code"
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5 text-[11px] font-mono-code text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Demo Account:</span>
                <span className="text-cyan-300">admin@example.com</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-cyan-300">CyberTwin@2026</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
            >
              <span>{loading ? 'Initializing SOC Workspace...' : 'Launch SOC Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-8 text-center text-xs text-slate-500 font-mono-code">
        AI-Based Cybersecurity Digital Twin Platform • Oracle Database 11g/19c XE Relational Architecture • MITRE ATT&CK Integrated
      </footer>
    </div>
  );
}
