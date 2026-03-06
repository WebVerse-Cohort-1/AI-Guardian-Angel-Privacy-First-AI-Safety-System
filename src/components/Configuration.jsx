import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { PlusCircle, Trash2, Mic, Phone } from 'lucide-react';

const Configuration = ({ showGlobalsOnly = false }) => {
   const {
     scenarios,
     setScenarios,
     triggerPhrases,
     addTriggerPhrase,
     removeTriggerPhrase,
     contacts,
     addContact,
     removeContact,
     confirmationSettings,
     setConfirmationSettings,
     addScenario,
     removeScenario
   } = useSafety();

   const [newPhrase, setNewPhrase] = useState('');
   const [newContactName, setNewContactName] = useState('');
   const [newContactPhone, setNewContactPhone] = useState('');

   const handleScenarioChange = (id, field, value) => {
     setScenarios(prev => prev.map(s => {
       if (s.id === id) {
         return { ...s, [field]: value };
       }
       return s;
     }));
   };

   const availablePhrases = Array.from(new Set([...triggerPhrases, ...scenarios.map(s => s.triggerPhrase)]));

   return (
     <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
       {/* Global Settings / Entities */}
       <div style={{ display: showGlobalsOnly ? 'flex' : 'none', flexDirection: 'column', gap: '1.5rem' }}>
         <div className="card glass-panel">
           <h2 className="card-header" style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Global Monitoring Preferences</h2>
           
           <div className="form-group">
             <label>Default Confirmation Window</label>
             <select 
               value={confirmationSettings} 
               onChange={(e) => setConfirmationSettings(Number(e.target.value))}
             >
               <option value={5}>5 seconds</option>
               <option value={10}>10 seconds</option>
               <option value={15}>15 seconds</option>
               <option value={30}>30 seconds (default)</option>
               <option value={45}>45 seconds</option>
               <option value={60}>60 seconds</option>
             </select>
             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
               How long the system waits for user response before activating emergency protocol.
             </p>
           </div>

           <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Privacy Setting: Trigger History Storage</label>
              <select disabled value="0">
                 <option value="0">Never Store (Privacy First)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
               Audio is never recorded or transmitted. On-device processing only.
             </p>
           </div>
         </div>

         {/* General Trigger Phrases Manager */}
         <div className="card glass-panel">
           <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
             <h2 className="card-title"><Mic size={18} /> Voice Triggers</h2>
           </div>
           
           <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                placeholder="New trigger phrase..." 
                value={newPhrase} 
                onChange={e => setNewPhrase(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     addTriggerPhrase(newPhrase);
                     setNewPhrase('');
                  }
                }}
              />
              <button 
                className="btn-primary" 
                onClick={() => { addTriggerPhrase(newPhrase); setNewPhrase(''); }}
                disabled={!newPhrase.trim()}
              >
                Add
              </button>
           </div>

           <div className="status-list">
             {triggerPhrases.map((phrase, idx) => (
               <div key={idx} className="status-item" style={{ justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                 <span>"{phrase}"</span>
                 <button onClick={() => removeTriggerPhrase(phrase)} style={{ background: 'none', color: 'var(--risk-emergency)' }}>
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
           </div>
         </div>

         {/* Emergency Contacts Manager */}
         <div className="card glass-panel">
           <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
             <h2 className="card-title"><Phone size={18} /> Emergency Contacts</h2>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <input placeholder="Contact Name" value={newContactName} onChange={e => setNewContactName(e.target.value)} />
              <input placeholder="Phone Number" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} />
              <button 
                className="btn-primary" 
                onClick={() => { addContact(newContactName, newContactPhone); setNewContactName(''); setNewContactPhone(''); }}
                disabled={!newContactName.trim() || !newContactPhone.trim()}
              >
                Add Contact
              </button>
           </div>

           <div className="status-list">
             {contacts.map((c) => (
               <div key={c.id} className="status-item" style={{ justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.phone}</span>
                 </div>
                 <button onClick={() => removeContact(c.id)} style={{ background: 'none', color: 'var(--risk-emergency)' }}>
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
           </div>
         </div>
       </div>

       {/* Emergency Scenarios */}
       {!showGlobalsOnly && (
         <>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '70px', zIndex: 10, background: 'var(--bg-primary)', padding: '1rem 0', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Scenarios</h2>
               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure specific trigger reactions</span>
             </div>
             <button onClick={addScenario} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
               <PlusCircle size={18} /> Add
             </button>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {scenarios.map((scenario) => (
               <div key={scenario.id} className="card glass-panel" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                 <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ flex: 1 }}>
                     <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scenario Name</label>
                     <input 
                       value={scenario.name} 
                       onChange={(e) => handleScenarioChange(scenario.id, 'name', e.target.value)}
                       style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-blue)', boxShadow: 'none', width: '100%' }}
                     />
                   </div>
                   {scenario.id !== 1 && (
                     <button onClick={() => removeScenario(scenario.id)} style={{ background: 'var(--risk-emergency-transparent)', color: 'var(--risk-emergency)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                       <Trash2 size={18} />
                     </button>
                   )}
                 </div>

                 <div className="form-group">
                   <label>Trigger Phrase</label>
                   <input 
                     placeholder="e.g. I need help"
                     value={scenario.triggerPhrase} 
                     onChange={(e) => handleScenarioChange(scenario.id, 'triggerPhrase', e.target.value)} 
                   />
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                     {availablePhrases.filter(p => p !== scenario.triggerPhrase && p !== '').slice(0, 5).map((phrase, i) => (
                        <span key={i} onClick={() => handleScenarioChange(scenario.id, 'triggerPhrase', phrase)} style={{ fontSize: '0.75rem', color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {phrase}
                        </span>
                     ))}
                   </div>
                 </div>

                 <div className="form-group">
                   <label>Custom SOS Message</label>
                   <textarea 
                     value={scenario.customMessage || ''}
                     onChange={(e) => handleScenarioChange(scenario.id, 'customMessage', e.target.value)}
                     rows={4}
                     style={{
                       width: '100%',
                       background: 'var(--bg-tertiary)',
                       border: '1px solid rgba(255, 255, 255, 0.1)',
                       color: 'var(--text-primary)',
                       padding: '12px',
                       borderRadius: 'var(--radius-md)',
                       fontFamily: "'Inter', sans-serif",
                       resize: 'vertical',
                       fontSize: '0.9rem'
                     }}
                   />
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                     The message that will be sent to your emergency contacts via SMS/WhatsApp.
                   </p>
                 </div>

                 <div className="form-group">
                   <label>Confirmation Window Duration</label>
                   <select 
                     value={scenario.confirmationWindow} 
                     onChange={(e) => handleScenarioChange(scenario.id, 'confirmationWindow', Number(e.target.value))}
                   >
                     <option value={5}>5 seconds</option>
                     <option value={10}>10 seconds</option>
                     <option value={15}>15 seconds</option>
                     <option value={30}>30 seconds</option>
                     <option value={45}>45 seconds</option>
                     <option value={60}>60 seconds</option>
                   </select>
                 </div>

                 <div className="form-group" style={{ marginTop: '2rem' }}>
                   <label style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Protocol Actions</label>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                     <label className="checkbox-wrap" style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                       <input type="checkbox" checked={scenario.sendLocation} onChange={(e) => handleScenarioChange(scenario.id, 'sendLocation', e.target.checked)} />
                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 500 }}>Share Live GPS Location</span>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuously update real-time location.</span>
                       </div>
                     </label>
                     
                     <label className="checkbox-wrap" style={{ background: 'var(--risk-emergency-transparent)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                       <input type="checkbox" checked={scenario.notifyPolice} onChange={(e) => handleScenarioChange(scenario.id, 'notifyPolice', e.target.checked)} />
                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 500, color: 'var(--risk-emergency)' }}>Notify Police / Authorities</span>
                         <span style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.8)' }}>Directly connect with local dispatch.</span>
                       </div>
                     </label>
                     
                     <div style={{ marginTop: '1rem' }}>
                       <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Contacts to Notify:</label>
                       {contacts.length === 0 ? (
                         <p style={{ fontSize: '0.8rem', color: 'var(--risk-suspicious)', marginTop: '0.5rem' }}>No contacts available. Please add them in Settings.</p>
                       ) : (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                           {contacts.map((contact) => (
                             <label key={contact.id} className="checkbox-wrap" style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                               <input 
                                 type="checkbox" 
                                 checked={scenario.notifyContacts.includes(contact.name)} 
                                 onChange={(e) => {
                                   const current = [...scenario.notifyContacts];
                                   if (e.target.checked) current.push(contact.name);
                                   else {
                                     const idx = current.indexOf(contact.name);
                                     if (idx > -1) current.splice(idx, 1);
                                   }
                                   handleScenarioChange(scenario.id, 'notifyContacts', current);
                                 }} 
                               />
                               <div style={{ display: 'flex', flexDirection: 'column' }}>
                                 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{contact.name}</span>
                                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.phone}</span>
                               </div>
                             </label>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </>
       )}
     </div>
   );
};

export default Configuration;
