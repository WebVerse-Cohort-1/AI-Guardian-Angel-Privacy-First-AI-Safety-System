import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { ShieldCheck, ShieldAlert, Fingerprint, MapPin, Activity, Phone } from 'lucide-react';

const Dashboard = () => {
  const { riskScore, alertStatus, simulateEvent, simulateSpeechDetection, triggerPhrases } = useSafety();

  const getRiskStatus = () => {
    if (riskScore >= 70) return { label: 'EMERGENCY', color: 'var(--risk-emergency)' };
    if (riskScore >= 40) return { label: 'SUSPICIOUS', color: 'var(--risk-suspicious)' };
    return { label: 'SAFE', color: 'var(--risk-safe)' };
  };

  const status = getRiskStatus();
  const isSafe = riskScore < 40;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Row: Dynamic Risk / Safe State */}
      <div className="card glass-panel" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: isSafe ? '3rem 1.5rem' : '1.5rem' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%', background: `radial-gradient(circle, ${status.color}22 0%, transparent 70%)`, opacity: isSafe ? 0.5 : 1 }}></div>
        
        {isSafe ? (
          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: 'var(--risk-safe-transparent)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 30px var(--risk-safe-transparent)`,
              marginBottom: '1rem'
            }}>
               <ShieldCheck size={48} color="var(--risk-safe)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-safe)' }}>Protected</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Background monitoring is active. <br/> No contextual threats detected.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="card-header" style={{ justifyContent: 'center' }}>Contextual Risk Score</h2>
            <div className="score-circle" style={{ borderColor: status.color, boxShadow: `0 0 30px ${status.color}33`, marginTop: '1rem' }}>
              <span className="score-value" style={{ color: status.color }}>{Math.floor(riskScore)}</span>
              <span className="score-label">/ 100</span>
            </div>
            <div className="status-badge glass-pill pulse" style={{ color: status.color, border: `1px solid ${status.color}55`, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem auto 0 auto' }}>
              <Activity size={16} /> {status.label}
            </div>
          </div>
        )}
      </div>

      {/* Map (Only show if risk is elevated or we want to show active tracking) */}
      {!isSafe && (
        <div className="card animate-slide-up">
          <div className="card-header" style={{ marginBottom: '0.5rem' }}>
            <h2 className="card-title"><MapPin size={18} /> Safety Route</h2>
            <span className="scenario-badge" style={{ background: 'var(--risk-suspicious-transparent)', color: 'var(--risk-suspicious)' }}>Elevated Risk</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location is being monitored closely due to detected context anomalies.</p>
          <div className="sim-map">
             <div className="map-zone safe"></div>
             <div className="map-zone suspicious"></div>
             <div className="map-zone danger"></div>
             <div 
               className="user-dot" 
               style={{ 
                 top: riskScore >= 70 ? '30%' : '60%', 
                 left: riskScore >= 70 ? '20%' : '70%',
                 background: status.color,
                 boxShadow: `0 0 0 4px ${status.color}33, 0 0 15px ${status.color}88`
               }} 
             />
          </div>
        </div>
      )}

      {/* Simulator Tools */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '0.5rem' }}>
          <h2 className="card-title"><ShieldAlert size={18} /> Simulate Sensor Events</h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Simulates background context gathering (accelerometer, time, GPS).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button className="btn-outline" style={{ padding: '8px', fontSize: '0.8rem' }} onClick={() => simulateEvent(10)}>Night (+10)</button>
          <button className="btn-outline" style={{ padding: '8px', fontSize: '0.8rem' }} onClick={() => simulateEvent(20)}>Unsafe Loc (+20)</button>
          <button className="btn-outline" style={{ padding: '8px', fontSize: '0.8rem', borderColor: 'var(--risk-suspicious)', color: 'var(--risk-suspicious)' }} onClick={() => simulateEvent(30)}>Movement (+30)</button>
          <button className="btn-outline" style={{ padding: '8px', fontSize: '0.8rem', borderColor: 'var(--risk-emergency)', color: 'var(--risk-emergency)' }} onClick={() => simulateEvent(40)}>Scream (+40)</button>
        </div>

        <div className="card-header" style={{ marginBottom: '0.5rem' }}>
          <h2 className="card-title"><Fingerprint size={18} /> Voice Triggers</h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Simulates on-device wakeword detection.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {triggerPhrases.map((phrase, idx) => (
            <button 
              key={idx} 
              className="btn-primary" 
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                fontWeight: 'normal',
                fontSize: '0.8rem',
                padding: '8px 12px',
                color: 'var(--text-primary)'
              }}
              onClick={() => simulateSpeechDetection(phrase)}
              disabled={alertStatus !== 'inactive'}
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Panel */}
      <ContactsPanel />
    </div>
  );
};

const ContactsPanel = () => {
   const { contacts } = useSafety();
   const activeContacts = contacts.filter(c => c.notified).length;

   return (
     <div className="card">
       <div className="card-header">
         <h2 className="card-title"><Phone size={18} /> Emergency Contacts</h2>
         {activeContacts > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--risk-emergency)', fontWeight: 'bold' }}>{activeContacts} Alerted</span>}
       </div>
       <div className="status-list">
         {contacts.map((c) => (
           <div key={c.id} className="status-item" style={{ justifyContent: 'space-between', padding: '0.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <div className="glass-pill" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-blue-transparent)', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.8rem' }}>
                 {c.name.charAt(0)}
               </div>
               <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.phone}</div>
               </div>
             </div>
             <div>
               {c.notified ? (
                 <span className="scenario-badge animate-pulse" style={{ background: 'var(--risk-emergency-transparent)', color: 'var(--risk-emergency)', border: '1px solid var(--risk-emergency)' }}>
                   SOS Sent
                 </span>
               ) : (
                 <span className="scenario-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                   Standby
                 </span>
               )}
             </div>
           </div>
         ))}
       </div>
     </div>
   );
};

export default Dashboard;
