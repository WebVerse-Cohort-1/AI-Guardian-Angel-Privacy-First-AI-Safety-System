import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { ShieldCheck, ShieldAlert, Fingerprint, MapPin, Activity, Phone, Zap, RefreshCw } from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────── */
const getStatus = (score) => {
  if (score >= 70) return { key: 'danger', label: 'EMERGENCY',  title: 'Alert',      color: 'var(--danger)', stroke: '#EF4444' };
  if (score >= 40) return { key: 'warn',   label: 'SUSPICIOUS', title: 'Caution',    color: 'var(--warn)',   stroke: '#F59E0B' };
  return               { key: 'safe',   label: 'PROTECTED',  title: 'Protected',  color: 'var(--safe)',   stroke: '#10B981' };
};

/* ── Score Ring ──────────────────────────────────────── */
const ScoreRing = ({ score, status }) => {
  const r = 56, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="score-wrap">
      <svg className="score-ring-svg" viewBox="0 0 140 140">
        <circle className="score-ring-track" cx="70" cy="70" r={r} strokeWidth="8" />
        <circle
          className="score-ring-fill"
          cx="70" cy="70" r={r}
          strokeWidth="8"
          stroke={status.stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-inner">
        <span className="score-value" style={{ color: status.color }}>{Math.floor(score)}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
};

/* ── Guardian Ring ───────────────────────────────────── */
const GuardianRing = ({ statusKey }) => (
  <div className="guardian-ring-wrap">
    <div className="guardian-ring-outer" />
    <div className="guardian-ring-mid" />
    <div className={`guardian-ring-glow ${statusKey}`}>
      <div className={`guardian-icon ${statusKey}`}>
        {statusKey === 'safe'   && <ShieldCheck size={32} />}
        {statusKey === 'warn'   && <Activity    size={32} />}
        {statusKey === 'danger' && <ShieldAlert size={32} />}
      </div>
    </div>
  </div>
);

/* ── Dashboard ───────────────────────────────────────── */
const Dashboard = () => {
  const {
    riskScore,
    alertStatus,
    confirmationCountdown,
    resetSystem,
    simulateEvent,
    simulateSpeechDetection,
    triggerPhrases,
    contacts,
  } = useSafety();

  const status = getStatus(riskScore);
  const isSafe = riskScore < 40;

  return (
    <div className="anim-fade">

      {/* ── Hero Section ── */}
      <section className="hero-section">
        {alertStatus === 'confirming' ? (
          /* Countdown mode */
          <div style={{ textAlign: 'center' }} className="anim-fade">
            <div className="countdown-ring-wrap">
              <svg className="countdown-ring-svg" viewBox="0 0 120 120">
                <circle className="countdown-track" cx="60" cy="60" r="48" strokeWidth="6" />
                <circle
                  className="countdown-fill"
                  cx="60" cy="60" r="48"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - confirmationCountdown / 30)}
                />
              </svg>
              <div className="countdown-inner">
                <span className="countdown-num">{confirmationCountdown}</span>
                <span className="countdown-unit">sec</span>
              </div>
            </div>
            <h1 className="hero-title danger" style={{ fontSize: 24, marginBottom: 8 }}>Confirm Emergency?</h1>
            <p className="hero-subtitle">Trigger detected. Auto-activating if no response.</p>
          </div>
        ) : isSafe ? (
          /* Safe state — guardian ring */
          <>
            <GuardianRing statusKey="safe" />
            <h1 className="hero-title safe">{status.title}</h1>
            <p className="hero-subtitle">
              Background monitoring is active.<br />No contextual threats detected.
            </p>
            <span className="status-pill safe">{status.label}</span>
          </>
        ) : (
          /* Elevated risk */
          <>
            <GuardianRing statusKey={status.key} />
            <ScoreRing score={riskScore} status={status} />
            <h1 className="hero-title" style={{ color: status.color, marginTop: 16 }}>{status.title}</h1>
            <p className="hero-subtitle">Contextual anomalies detected.</p>
            <span className={`status-pill ${status.key}`}>{status.label}</span>
          </>
        )}
      </section>

      {/* ── Map (elevated risk only) ── */}
      {!isSafe && (
        <div className="card anim-up">
          <div className="card-title">
            <span className="icon-badge"><MapPin size={16} /></span>
            Safety Route
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'var(--warn)',
              background: 'var(--warn-dim)', padding: '3px 10px', borderRadius: 999,
              border: '1px solid rgba(245,158,11,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Elevated Risk
            </span>
          </div>
          <div className="map-wrap">
            <div className="map-zone safe" />
            <div className="map-zone warn" />
            <div className="map-zone danger" />
            <div
              className="map-dot"
              style={{
                top:  riskScore >= 70 ? '30%' : '58%',
                left: riskScore >= 70 ? '22%' : '68%',
                background: status.stroke,
                color: status.stroke,
                boxShadow: `0 0 0 3px rgba(0,0,0,0.6), 0 0 20px ${status.stroke}88`,
              }}
            />
            <div className="map-fade" />
          </div>
        </div>
      )}

      {/* ── Simulator ── */}
      <p className="section-label anim-up">Simulate Sensor Events</p>
      <div className="card anim-up-1">
        <div className="card-title">
          <span className="icon-badge"><Zap size={16} /></span>
          Context Signals
        </div>
        <div className="sim-grid">
          <button
            className="sim-btn"
            disabled={alertStatus !== 'inactive'}
            onClick={() => simulateEvent(10)}
          >
            🌙 Night
            <span className="delta">+10 risk</span>
          </button>
          <button
            className="sim-btn"
            disabled={alertStatus !== 'inactive'}
            onClick={() => simulateEvent(20)}
          >
            📍 Unsafe Loc
            <span className="delta">+20 risk</span>
          </button>
          <button
            className="sim-btn warn-btn"
            disabled={alertStatus !== 'inactive'}
            onClick={() => simulateEvent(30)}
          >
            🏃 Movement
            <span className="delta">+30 risk</span>
          </button>
          <button
            className="sim-btn danger-btn"
            disabled={alertStatus !== 'inactive'}
            onClick={() => simulateEvent(40)}
          >
            😱 Scream
            <span className="delta">+40 risk</span>
          </button>
        </div>
      </div>

      {/* ── Voice Triggers ── */}
      <p className="section-label anim-up-1">Voice Triggers</p>
      <div className="card anim-up-2">
        <div className="card-title">
          <span className="icon-badge"><Fingerprint size={16} /></span>
          Wakeword Detection
        </div>
        <div className="chips-wrap">
          {triggerPhrases.map((phrase, i) => (
            <button
              key={i}
              className="chip"
              disabled={alertStatus !== 'inactive'}
              onClick={() => simulateSpeechDetection(phrase)}
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {alertStatus !== 'inactive' && (
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <button className="reset-btn" onClick={resetSystem}>
            <RefreshCw size={16} /> Emergency Reset
          </button>
        </div>
      )}

      {/* ── Contacts ── */}
      <p className="section-label anim-up-2">Emergency Contacts</p>
      <ContactsPanel contacts={contacts} />
    </div>
  );
};

/* ── Contacts ────────────────────────────────────────── */
const ContactsPanel = ({ contacts }) => {
  const alerted = contacts.filter(c => c.notified).length;
  return (
    <div className="card anim-up-3">
      <div className="card-title">
        <span className="icon-badge"><Phone size={16} /></span>
        Contacts
        {alerted > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700,
            color: 'var(--danger)', background: 'var(--danger-dim)',
            padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(239,68,68,0.3)',
            letterSpacing: '0.05em' }}>
            {alerted} ALERTED
          </span>
        )}
      </div>
      <div className="contacts-list">
        {contacts.map((c) => (
          <div key={c.id} className="contact-row">
            <div className="contact-avatar">{c.name.charAt(0).toUpperCase()}</div>
            <div className="contact-info">
              <div className="contact-name">{c.name}</div>
              <div className="contact-phone">{c.phone}</div>
            </div>
            <span className={`contact-badge ${c.notified ? 'sos' : 'standby'}`}>
              {c.notified ? 'SOS Sent' : 'Standby'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
