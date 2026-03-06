import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { MessageSquare, Phone, MapPin, ShieldAlert } from 'lucide-react';

const EmergencyActive = () => {
   const { activeScenario, contacts, resetSystem } = useSafety();

   return (
      <div className="overlay animate-fade-in" style={{ 
         background: 'rgba(239, 68, 68, 0.95)',
         alignItems: 'center', /* Center vertically for this specific modal */
         padding: '1rem'
      }}>
         <div className="card glass-panel animate-slide-up" style={{ 
            maxWidth: '100%', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem 1.5rem', 
            textAlign: 'center', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
            background: 'var(--bg-secondary)', 
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '24px'
         }}>
            
            <div className="animate-pulse" style={{ background: 'var(--risk-emergency)', width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(239, 68, 68, 0.8)' }}>
               <ShieldAlert size={36} color="white" />
            </div>

            <h1 style={{ color: 'var(--risk-emergency)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.05em', fontWeight: 800 }}>PROTOCOL ACTIVE</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Help is on the way. Keep your device safe.</p>

            {/* Custom Message Dispatched */}
            {activeScenario?.customMessage && (
               <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--risk-emergency)' }}>
                     <MessageSquare size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Alert Message Sent</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', fontStyle: 'italic', fontWeight: 500, color: '#ffb3b3', maxHeight: '150px', overflowY: 'auto' }}>
                     "{activeScenario.customMessage}"
                  </p>
               </div>
            )}

            <div style={{ textAlign: 'left', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               
               <div className="status-item animate-slide-up" style={{ animationDelay: '0.1s', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="status-icon success"><Phone size={14} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>SOS Sent to Contacts</span>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {activeScenario?.notifyContacts?.length > 0 
                           ? activeScenario.notifyContacts.join(', ') 
                           : 'None specified'}
                     </span>
                  </div>
               </div>

               {activeScenario?.sendLocation && (
                  <div className="status-item animate-slide-up" style={{ animationDelay: '0.4s', background: 'rgba(255,255,255,0.02)' }}>
                     <div className="status-icon success"><MapPin size={14} /></div>
                     <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Live GPS Tracking Active</span>
                  </div>
               )}

               {activeScenario?.notifyPolice && (
                  <div className="status-item animate-slide-up" style={{ animationDelay: '0.7s', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                     <div className="status-icon" style={{ background: 'var(--risk-emergency-transparent)', color: 'var(--risk-emergency)' }}><ShieldAlert size={14} /></div>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--risk-emergency)' }}>Authorities Notified</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(239, 68, 68, 0.8)' }}>Direct dispatch alerted.</span>
                     </div>
                  </div>
               )}
            </div>

            {/* Simulating End Emergency */}
            <div style={{ marginTop: '2rem' }}>
               <button onClick={resetSystem} className="btn-outline" style={{ width: '100%', padding: '12px', fontSize: '0.875rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  End Simulation / Reset System
               </button>
            </div>
         </div>
      </div>
   );
};

export default EmergencyActive;
