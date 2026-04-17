import React, { useState, useEffect } from 'react';
import { useSafety } from './context/SafetyContext';
import Dashboard from './components/Dashboard';
import Configuration from './components/Configuration';
import LockScreenAlert from './components/LockScreenAlert';
import EmergencyActive from './components/EmergencyActive';
import { Shield, Settings, AlertTriangle, Home, Mic, Sun, Moon } from 'lucide-react';

function App() {
    const { alertStatus, isListening, voiceActive, setVoiceActive } = useSafety();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="app-title">
          <Shield style={{ color: 'var(--accent-blue)' }} size={28} />
          <span>Ai Guardian Angel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button 
            onClick={() => setVoiceActive(!voiceActive)}
            className={`status-icon ${alertStatus === 'active' ? 'danger' : (voiceActive ? 'success' : '')}`}
            style={{ 
              width: 40, 
              height: 40, 
              background: voiceActive ? 'var(--risk-safe-transparent)' : 'var(--glass-pill)',
              border: voiceActive ? '1px solid var(--risk-safe)' : '1px solid var(--glass-border)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: alertStatus === 'active' ? 'var(--risk-emergency)' : (voiceActive ? 'var(--risk-safe)' : 'var(--text-muted)')
            }}
          >
             <Mic 
               size={20} 
               style={{ 
                 animation: (isListening || alertStatus === 'active') ? 'pulse 1.5s infinite' : 'none',
               }} 
             />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'config' && <Configuration />}
        {activeTab === 'settings' && (
           <div className="card animate-fade-in" style={{ paddingBottom: '3rem' }}>
             <h2 className="card-header">System Settings</h2>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Global monitoring defaults and privacy controls. All processing happens on-device.</p>
             <Configuration showGlobalsOnly />
           </div>
        )}
        <div style={{ height: '150px', flexShrink: 0 }} /> {/* Spacer to prevent content hiding behind bottom nav */}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Home size={24} />
          <span>Monitor</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <AlertTriangle size={24} />
          <span>Scenarios</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={24} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Overlays */}
      {alertStatus === 'confirming' && <LockScreenAlert />}
      {alertStatus === 'active' && <EmergencyActive />}
    </div>
  );
}

export default App;
