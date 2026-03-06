import React from 'react';
import { useSafety } from '../context/SafetyContext';

const LockScreenAlert = () => {
  const { confirmationCountdown, detectedPhrase, activeScenario, confirmEmergency, cancelAlert } = useSafety();

  return (
    <div className="overlay animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="lock-screen-modal animate-slide-up">
        <div style={{
          background: 'var(--risk-emergency-transparent)',
          color: 'var(--risk-emergency)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          fontWeight: 600,
          marginBottom: '1rem',
          border: '1px solid var(--risk-emergency)'
        }}>
          Potential Distress Signal Detected
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Did you intend to trigger an emergency alert?
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Trigger phrase detected: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>"{detectedPhrase}"</span>
        </p>
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Confirm within the selected time window or the emergency protocol will automatically activate.
        </div>

        <div className="countdown-circle animate-pulse">
          {confirmationCountdown}s
        </div>

        {activeScenario && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginTop: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions upon timeout:</h3>
             <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                {activeScenario.notifyContacts?.length > 0 && (
                   <li>Notify: {activeScenario.notifyContacts.join(', ')}</li>
                )}
                {activeScenario.sendLocation && <li>Share Live GPS Location</li>}
                {activeScenario.notifyPolice && <li>Notify Authorities / Police</li>}
             </ul>
          </div>
        )}

        <div className="modal-actions">
           <button className="btn-outline" style={{ height: '50px' }} onClick={cancelAlert}>
             Cancel Alert
           </button>
           <button className="btn-danger" style={{ height: '50px' }} onClick={confirmEmergency}>
             Confirm Emergency
           </button>
        </div>
      </div>
    </div>
  );
};

export default LockScreenAlert;
