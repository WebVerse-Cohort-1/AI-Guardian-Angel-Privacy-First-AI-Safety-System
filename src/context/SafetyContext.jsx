import React, { createContext, useState, useEffect, useContext } from 'react';

const SafetyContext = createContext();

export const useSafety = () => useContext(SafetyContext);

export const SafetyProvider = ({ children }) => {
  const [riskScore, setRiskScore] = useState(15);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alertStatus, setAlertStatus] = useState('inactive'); // inactive, confirming, active
  const [confirmationCountdown, setConfirmationCountdown] = useState(0);
  const [detectedPhrase, setDetectedPhrase] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);

  // Default Scenarios
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Primary Emergency',
      triggerPhrase: 'Help',
      confirmationWindow: 15,
      notifyContacts: ['Mom', 'Best Friend'],
      sendLocation: true,
      notifyPolice: true,
      customMessage: 'Help me, I am in an emergency situation.',
    },
    {
      id: 2,
      name: 'Discreet Alert',
      triggerPhrase: 'I forgot my charger',
      confirmationWindow: 30,
      notifyContacts: ['Roommate'],
      sendLocation: true,
      notifyPolice: false,
      customMessage: 'Hey, I am not feeling comfortable. Please check my location.',
    }
  ]);

  const [triggerPhrases, setTriggerPhrases] = useState([
    'Help',
    'Emergency',
    'I need help',
    'I forgot my keys',
    'I am not feeling safe',
    'Call my sister',
    'I forgot my charger'
  ]);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '555-0100', notified: false },
    { id: 2, name: 'Best Friend', phone: '555-0101', notified: false },
    { id: 3, name: 'Roommate', phone: '555-0102', notified: false },
    { id: 4, name: 'Campus Security', phone: '555-0103', notified: false }
  ]);

  const [confirmationSettings, setConfirmationSettings] = useState(30);

  // Risk Score Decay
  useEffect(() => {
    let interval;
    if (isMonitoring && alertStatus === 'inactive') {
      interval = setInterval(() => {
        setRiskScore((prev) => (prev > 0 ? prev - 1 : 0));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, alertStatus]);

  // Handle Risk Score Auto-Trigger
  useEffect(() => {
    if (riskScore >= 70 && alertStatus === 'inactive') {
      triggerEmergencyProtocol('Auto-Detected High Risk Situation');
    }
  }, [riskScore, alertStatus]);

  // Confirmation Countdown Timer
  useEffect(() => {
    let interval;
    if (alertStatus === 'confirming' && confirmationCountdown > 0) {
      interval = setInterval(() => {
        setConfirmationCountdown((prev) => prev - 1);
      }, 1000);
    } else if (alertStatus === 'confirming' && confirmationCountdown === 0) {
      activateEmergencyProtocol();
    }
    return () => clearInterval(interval);
  }, [alertStatus, confirmationCountdown]);

  const simulateEvent = (scoreIncrease) => {
    setRiskScore((prev) => {
      const newScore = prev + scoreIncrease;
      return newScore > 100 ? 100 : newScore;
    });
  };

  const simulateSpeechDetection = (phrase) => {
    if (alertStatus !== 'inactive') return;
    
    // Find matching scenario explicitly, otherwise see if it's just a general trigger
    const matchedScenario = scenarios.find(
      s => s.triggerPhrase.toLowerCase() === phrase.toLowerCase()
    ) || scenarios[0];

    setDetectedPhrase(phrase);
    setActiveScenario(matchedScenario);
    
    const windowTime = matchedScenario?.confirmationWindow || confirmationSettings;
    setConfirmationCountdown(windowTime);
    setAlertStatus('confirming');
  };

  const cancelAlert = () => {
    setAlertStatus('inactive');
    setConfirmationCountdown(0);
    setDetectedPhrase('');
    setActiveScenario(null);
    setRiskScore(15);
  };

  const confirmEmergency = () => {
    activateEmergencyProtocol();
  };

  const triggerEmergencyProtocol = (reason) => {
    setDetectedPhrase(reason);
    setActiveScenario(scenarios[0]);
    activateEmergencyProtocol();
  };

  const activateEmergencyProtocol = () => {
    setAlertStatus('active');
    setConfirmationCountdown(0);
    
    if (activeScenario || scenarios[0]) {
      const scenarioToUse = activeScenario || scenarios[0];
      setContacts(prev => prev.map(c => ({
        ...c,
        notified: scenarioToUse.notifyContacts.includes(c.name)
      })));
    }
    
    setRiskScore(100);
  };
  
  const resetSystem = () => {
      setAlertStatus('inactive');
      setRiskScore(15);
      setContacts(prev => prev.map(c => ({...c, notified: false})));
      setDetectedPhrase('');
      setActiveScenario(null);
  };

  // Scenarios CRUD
  const addScenario = () => {
    const newId = Date.now();
    setScenarios([{
      id: newId,
      name: 'New Custom Scenario',
      triggerPhrase: '',
      confirmationWindow: confirmationSettings,
      notifyContacts: [],
      sendLocation: true,
      notifyPolice: false,
      customMessage: 'Emergency alert! Please check my location.',
    }, ...scenarios]);
  };
  const removeScenario = (id) => setScenarios(scenarios.filter(s => s.id !== id));

  // Contacts CRUD
  const addContact = (name, phone) => {
    if (!name || !phone) return;
    const newId = Date.now();
    setContacts([...contacts, { id: newId, name, phone, notified: false }]);
  };
  const removeContact = (id) => setContacts(contacts.filter(c => c.id !== id));

  // Trigger Phrases CRUD
  const addTriggerPhrase = (phrase) => {
    if (phrase && !triggerPhrases.includes(phrase)) {
      setTriggerPhrases([...triggerPhrases, phrase]);
    }
  };
  const removeTriggerPhrase = (phraseToRemove) => {
    setTriggerPhrases(triggerPhrases.filter(p => p !== phraseToRemove));
  };


  const value = {
    riskScore,
    isMonitoring,
    setIsMonitoring,
    alertStatus,
    confirmationCountdown,
    detectedPhrase,
    activeScenario,
    scenarios,
    setScenarios,
    addScenario,
    removeScenario,
    triggerPhrases,
    addTriggerPhrase,
    removeTriggerPhrase,
    contacts,
    addContact,
    removeContact,
    confirmationSettings,
    setConfirmationSettings,
    simulateEvent,
    simulateSpeechDetection,
    cancelAlert,
    confirmEmergency,
    resetSystem
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};
