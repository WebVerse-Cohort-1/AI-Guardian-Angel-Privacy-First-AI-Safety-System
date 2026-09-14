import React, { useState, useEffect } from 'react';
import { useSafety } from './context/SafetyContext';
import Dashboard from './components/Dashboard';
import Configuration from './components/Configuration';
import LockScreenAlert from './components/LockScreenAlert';
import EmergencyActive from './components/EmergencyActive';
import BlogHub from './components/BlogHub';
import { Shield, Settings, AlertTriangle, Home, Mic, Sun, Moon, BookOpen } from 'lucide-react';

function App() {
  const { alertStatus, isListening, voiceActive, setVoiceActive } = useSafety();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  const micClass = alertStatus === 'active'
    ? 'icon-btn active-danger'
    : voiceActive ? 'icon-btn active-safe' : 'icon-btn';

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-left">
          <span className="label">AI Safety System</span>
          <span className="title">Guardian Angel</span>
        </div>
        <div className="app-header-right">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={micClass}
            onClick={() => setVoiceActive(!voiceActive)}
            aria-label="Toggle voice"
          >
            <Mic
              size={18}
              style={{ animation: (isListening || alertStatus === 'active') ? 'iconPulse 1.5s infinite' : 'none' }}
            />
          </button>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="page-scroll">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'config'    && <Configuration />}
        {activeTab === 'blogs'     && <BlogHub />}
        {activeTab === 'settings'  && (
          <div style={{ padding: '8px 0' }}>
            <p className="section-label">Global Settings</p>
            <Configuration showGlobalsOnly />
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-dot" />
          <Home size={20} />
          <span>Monitor</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <span className="nav-dot" />
          <AlertTriangle size={20} />
          <span>Scenarios</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          <span className="nav-dot" />
          <BookOpen size={20} />
          <span>Blogs</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-dot" />
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      {/* ── Overlays ── */}
      {alertStatus === 'confirming' && <LockScreenAlert />}
      {alertStatus === 'active'     && <EmergencyActive />}
    </div>
  );
}

export default App;
