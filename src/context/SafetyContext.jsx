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
  const [isListening, setIsListening] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

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
      recordVideo: true,
      recordAudio: true,
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
      recordVideo: false,
      recordAudio: true,
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
      triggerEmergencyProtocol('High Risk Context Detected');
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

  // Text to Speech Utility
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Real Voice Recognition Effect
  useEffect(() => {
    let recognition = null;

    if (voiceActive && isMonitoring && alertStatus === 'inactive') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          console.log('Voice recognition started...');
        };

        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          console.log('Recognized:', transcript);
          
          // Check if transcript contains any of our trigger phrases
          const matchedPhrase = triggerPhrases.find(p => transcript.includes(p.toLowerCase()));
          
          if (matchedPhrase) {
            simulateSpeechDetection(matchedPhrase);
            speak(`Starting safety protocol.`);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Restart if still active
          if (voiceActive && isMonitoring && alertStatus === 'inactive') {
            try { recognition.start(); } catch (e) { console.error(e); }
          }
        };

        try {
          recognition.start();
        } catch (error) {
          console.error('Recognition start error:', error);
        }
      } else {
        console.warn('Speech Recognition not supported in this browser.');
      }
    } else {
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [voiceActive, isMonitoring, alertStatus, triggerPhrases]);

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
    setRiskScore(70); // Force red status UI during confirmation
    
    // Voice feedback for detection
    if (phrase !== detectedPhrase) {
      speak(`Alert! "${phrase}" trigger detected. You have ${windowTime} seconds to cancel before emergency contacts are notified.`);
    }
  };

  const cancelAlert = () => {
    setAlertStatus('inactive');
    setConfirmationCountdown(0);
    setDetectedPhrase('');
    setActiveScenario(null);
    setRiskScore(15);
    speak("Emergency alert has been cancelled. System is now back in monitoring mode.");
  };

  const confirmEmergency = () => {
    activateEmergencyProtocol();
  };

  const triggerEmergencyProtocol = (reason) => {
    setDetectedPhrase(reason);
    setActiveScenario(scenarios[0]);
    setConfirmationCountdown(confirmationSettings);
    setAlertStatus('confirming');
    setRiskScore(70);
    speak(`Security alert! ${reason}. Safety protocol starting in ${confirmationSettings} seconds.`);
  };

  const activateEmergencyProtocol = () => {
    setAlertStatus('active');
    setConfirmationCountdown(0);
    speak("Emergency protocol activated. Sending location to your contacts and notifying authorities.");
    
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
      recordVideo: false,
      recordAudio: false,
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
    resetSystem,
    isListening,
    voiceActive,
    setVoiceActive,
    speak
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};
