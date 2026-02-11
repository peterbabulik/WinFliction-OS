
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Monitor, 
  FileText, 
  Globe, 
  Settings, 
  RotateCcw, 
  AlertCircle,
  X,
  Minimize2,
  Maximize2,
  MousePointer2,
  Search,
  LayoutGrid,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryCharging,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Wrench,
  Zap,
  Cpu,
  MessageSquare,
  Send,
  Bot,
  Calculator,
  Folder,
  Terminal,
  Trash2,
  Mail,
  Image,
  Gamepad2,
  Bell,
  Bluetooth,
  Sun,
  Moon,
  Power,
  Lock,
  User,
  Calendar,
  Cloud,
  CloudOff
} from 'lucide-react';
import { SystemState, WindowApp, Ad } from './types';

// Mock implementations for removed gemini service
const getAnnoyingCommentary = async (action: string) => {
  const comments = [
    "Are you sure you want to do that?",
    "Interesting choice... for someone with your skill level.",
    "We've logged this action for quality improvement purposes.",
    "This action may require additional updates.",
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

const getFakeAds = async () => {
  return [
    "Enlarge your RAM with one click!",
    "Download more internet speed now!",
    "10 ways to slow down your PC - #7 will shock you!",
  ];
};

const chatWithAssistant = async (message: string) => {
  return {
    text: "I'm sorry, I'm currently busy calculating how much RAM you're wasting. Please try again later.",
    functionCalls: undefined
  };
};

// Jarring sound library
const SOUNDS = {
  ERROR: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  POP: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
  GLITCH: 'https://actions.google.com/sounds/v1/scifi/glitch_low.ogg',
  STARTUP: 'https://actions.google.com/sounds/v1/foley/beating_metal.ogg',
  SUCCESS: 'https://actions.google.com/sounds/v1/cartoon/conga_drum_hit.ogg',
  FAN: 'https://actions.google.com/sounds/v1/office/fan_clicking.ogg'
};

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>(SystemState.BOOTING);
  const [apps, setApps] = useState<WindowApp[]>([
    { id: 'doc-1', title: 'Important_Document.docx', icon: 'FileText', isOpen: false, isMinimized: false, zIndex: 1, type: 'DOC' },
    { id: 'browser-1', title: 'Edge (Not Chrome)', icon: 'Globe', isOpen: false, isMinimized: false, zIndex: 1, type: 'BROWSER' },
    { id: 'calc-1', title: 'Calculator', icon: 'Calculator', isOpen: false, isMinimized: false, zIndex: 1, type: 'CALCULATOR' },
    { id: 'notepad-1', title: 'Notepad', icon: 'FileText', isOpen: false, isMinimized: false, zIndex: 1, type: 'NOTEPAD' },
    { id: 'explorer-1', title: 'File Explorer', icon: 'Folder', isOpen: false, isMinimized: false, zIndex: 1, type: 'FILE_EXPLORER' },
    { id: 'terminal-1', title: 'Terminal', icon: 'Terminal', isOpen: false, isMinimized: false, zIndex: 1, type: 'TERMINAL' },
    { id: 'games-1', title: 'Games', icon: 'Gamepad2', isOpen: false, isMinimized: false, zIndex: 1, type: 'GAMES' },
    { id: 'trash-1', title: 'Recycle Bin', icon: 'Trash2', isOpen: false, isMinimized: false, zIndex: 1, type: 'TRASH' },
    { id: 'mail-1', title: 'Mail', icon: 'Mail', isOpen: false, isMinimized: false, zIndex: 1, type: 'MAIL' },
    { id: 'photos-1', title: 'Photos', icon: 'Image', isOpen: false, isMinimized: false, zIndex: 1, type: 'PHOTOS' },
  ]);
  
  // System tray state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [wifiConnected, setWifiConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(67);
  const [isCharging, setIsCharging] = useState(false);
  const [showTrayPopup, setShowTrayPopup] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{id: string; title: string; message: string; time: Date}[]>([
    { id: 'n1', title: 'WinFliction Update', message: 'Your PC will restart in 15 minutes. No, you cannot cancel.', time: new Date() },
    { id: 'n2', title: 'Security Alert', message: 'We found 47,000 threats. Click here to panic.', time: new Date() },
  ]);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [assistantMessage, setAssistantMessage] = useState<string>("");
  const [nextZIndex, setNextZIndex] = useState(10);
  const [restartCount, setRestartCount] = useState(0);
  const [showLowDiskWarning, setShowLowDiskWarning] = useState(false);
  const [recoveryMenuLevel, setRecoveryMenuLevel] = useState(1);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  
  // AI Assistant Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Helper to play sound
  const playSound = (url: string, volume: number = 0.5) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {
      // Browsers may block audio until first interaction, which is fine for this masochistic app.
    });
  };

  // Initial Boot
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSystemState(SystemState.DESKTOP);
      playSound(SOUNDS.SUCCESS, 0.3);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Update Logic
  const triggerForcedUpdate = useCallback(() => {
    setShowStartMenu(false);
    setShowLowDiskWarning(false);
    setSystemState(SystemState.UPDATING);
    setUpdateProgress(0);
    playSound(SOUNDS.STARTUP, 0.6);
    
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 5;
      
      // Occasionally play glitch sounds during update
      if (Math.random() > 0.9) {
        playSound(SOUNDS.GLITCH, 0.2);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setUpdateProgress(100);
        setTimeout(() => {
          setSystemState(SystemState.RESTARTING);
          playSound(SOUNDS.ERROR, 0.4);
          setTimeout(() => {
            const nextRestartCount = restartCount + 1;
            setRestartCount(nextRestartCount);
            setUpdateProgress(0);
            
            if (nextRestartCount >= 5) {
              setSystemState(SystemState.RECOVERY);
              setRecoveryMenuLevel(1);
              setRecoveryError(null);
              playSound(SOUNDS.FAN, 0.8);
            } else {
              setSystemState(SystemState.DESKTOP);
              playSound(SOUNDS.SUCCESS, 0.3);
              if (nextRestartCount >= 3) {
                setShowLowDiskWarning(true);
                playSound(SOUNDS.ERROR, 0.5);
              }
              setAssistantMessage("System successfully bloated. You're welcome.");
            }
          }, 4000);
        }, 1500);
      } else {
        setUpdateProgress(progress);
      }
    }, 500);
  }, [restartCount]);

  const triggerSpawnAds = async (count: number = 3) => {
    const adLines = await getFakeAds();
    const newAds: Ad[] = adLines.slice(0, count).map((line, i) => {
      // Staggered sound for multiple ads
      setTimeout(() => playSound(SOUNDS.POP, 0.4), i * 150);
      return {
        id: `ad-${Date.now()}-${i}`,
        title: "AI SUGGESTED",
        content: line,
        top: Math.random() * 60 + 10,
        left: Math.random() * 60 + 10
      };
    });
    setAds(prev => [...prev, ...newAds]);
  };

  const handleAssistantChat = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await chatWithAssistant(userMsg);
    setIsTyping(false);

    if (response) {
      playSound(SOUNDS.POP, 0.3);
      if (response.text) {
        setChatHistory(prev => [...prev, { role: 'assistant', text: response.text }]);
      }

      if (response.functionCalls) {
        for (const call of response.functionCalls) {
          switch (call.name) {
            case 'triggerUpdate':
              setChatHistory(prev => [...prev, { role: 'assistant', text: "Updating for your own good. Goodbye for now." }]);
              setTimeout(triggerForcedUpdate, 1000);
              break;
            case 'spawnAds':
              const count = (call.args as any).count || 3;
              setChatHistory(prev => [...prev, { role: 'assistant', text: `Here are ${count} helpful deals I found for you!` }]);
              triggerSpawnAds(count);
              break;
            case 'minimizeAll':
              setChatHistory(prev => [...prev, { role: 'assistant', text: "Minimizing everything to improve your attention span." }]);
              setApps(prev => prev.map(a => ({ ...a, isMinimized: true })));
              playSound(SOUNDS.POP, 0.2);
              break;
            case 'insultUser':
              const sev = (call.args as any).severity || 'mild';
              setChatHistory(prev => [...prev, { role: 'assistant', text: `[System Observation: ${sev}] You seem to be clicking things very inefficiently.` }]);
              playSound(SOUNDS.GLITCH, 0.1);
              break;
          }
        }
      }
    } else {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "I'm sorry, I was busy calculating how much RAM you're wasting." }]);
    }
  };

  const openApp = async (appId: string) => {
    if (Math.random() > 0.4) {
      playSound(SOUNDS.ERROR, 0.4);
      const msg = await getAnnoyingCommentary(`open ${appId}`);
      setAssistantMessage(msg);
      setTimeout(triggerForcedUpdate, 1500);
      return;
    }
    playSound(SOUNDS.POP, 0.3);
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, isOpen: true, isMinimized: false, zIndex: nextZIndex } : app
    ));
    setNextZIndex(prev => prev + 1);
  };

  const closeApp = (appId: string) => {
    playSound(SOUNDS.POP, 0.2);
    setApps(prev => prev.map(app => app.id === appId ? { ...app, isOpen: false } : app));
  };

  const toggleMinimize = (appId: string) => {
    playSound(SOUNDS.POP, 0.15);
    setApps(prev => prev.map(app => app.id === appId ? { ...app, isMinimized: !app.isMinimized } : app));
  };

  const handleStartClick = async () => {
    setShowStartMenu(!showStartMenu);
    playSound(SOUNDS.POP, 0.2);
    if (!showStartMenu) {
      await triggerSpawnAds(2);
      if (Math.random() > 0.5) setTimeout(triggerForcedUpdate, 3000);
    }
  };

  const closeAd = (id: string) => {
    playSound(SOUNDS.POP, 0.1);
    setAds(prev => prev.filter(ad => ad.id !== id));
  };

  const handleRecoveryOption = (level: number, special?: string) => {
    if (special === 'BACK') {
      playSound(SOUNDS.POP, 0.2);
      setRecoveryMenuLevel(prev => Math.max(1, prev - 1));
      return;
    }
    if (special === 'WINNER') {
      playSound(SOUNDS.STARTUP, 0.5);
      setSystemState(SystemState.BOOTING);
      setRestartCount(0);
      setTimeout(() => setSystemState(SystemState.DESKTOP), 3000);
      return;
    }
    if (level === 2 && special === 'TROUBLESHOOT') { playSound(SOUNDS.POP, 0.3); setRecoveryMenuLevel(2); return; }
    if (level === 3 && special === 'ADVANCED') { playSound(SOUNDS.POP, 0.3); setRecoveryMenuLevel(3); return; }
    if (level === 4 && special === 'MORE') { playSound(SOUNDS.POP, 0.3); setRecoveryMenuLevel(4); return; }
    if (level === 5 && special === 'STARTUP_SETTINGS') { playSound(SOUNDS.POP, 0.3); setRecoveryMenuLevel(5); return; }
    
    playSound(SOUNDS.ERROR, 0.7);
    setRecoveryError("An unexpected error occurred. (Error Code: 0x80042069)");
    setTimeout(() => setRecoveryError(null), 3000);
  };

  if (systemState === SystemState.BOOTING) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="mb-8"><Monitor size={120} className="text-blue-500 animate-pulse" /></div>
        <div className="loading-spinner"></div>
        <p className="mt-4 text-xl font-light">WinFliction</p>
      </div>
    );
  }

  if (systemState === SystemState.UPDATING) {
    return (
      <div className="h-screen w-screen bg-[#0078d7] flex flex-col items-center justify-center text-white p-12 text-center">
        <div className="loading-spinner mb-12 border-4 w-16 h-16"></div>
        <h1 className="text-3xl mb-4">Working on updates {Math.round(updateProgress)}% complete</h1>
        <p className="text-lg opacity-80">Don't turn off your PC. This will take a while.</p>
        <p className="mt-8 italic text-sm">"Installing features you didn't ask for to improve your lack of productivity."</p>
      </div>
    );
  }

  if (systemState === SystemState.RESTARTING) {
    return (
      <div className="h-screen w-screen bg-[#0078d7] flex flex-col items-center justify-center text-white">
        <div className="loading-spinner mb-8"></div>
        <h1 className="text-4xl font-light">Restarting</h1>
      </div>
    );
  }

  if (systemState === SystemState.RECOVERY) {
    return (
      <div className="h-screen w-screen bg-[#0078d7] text-white p-20 font-light flex flex-col items-start justify-start overflow-auto">
        {recoveryError && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-600 px-6 py-3 rounded-md shadow-2xl animate-bounce flex items-center gap-3 z-[6000]">
            <AlertCircle size={20} />
            <span>{recoveryError}</span>
          </div>
        )}
        <h1 className="text-4xl mb-12">Choose an option</h1>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {recoveryMenuLevel === 1 && (
            <>
              <button onClick={() => handleRecoveryOption(1)} className="flex items-start gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
                <div className="mt-1"><Zap size={32} /></div>
                <div><p className="text-xl">Continue</p><p className="text-sm opacity-70">Exit and continue to WinFliction OS (Likely to fail again)</p></div>
              </button>
              <button onClick={() => handleRecoveryOption(2, 'TROUBLESHOOT')} className="flex items-start gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
                <div className="mt-1"><Wrench size={32} /></div>
                <div><p className="text-xl">Troubleshoot</p><p className="text-sm opacity-70">Reset your PC or see advanced options</p></div>
              </button>
              <button onClick={() => setSystemState(SystemState.BOOTING)} className="flex items-start gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
                <div className="mt-1"><RotateCcw size={32} /></div>
                <div><p className="text-xl">Turn off your PC</p><p className="text-sm opacity-70">Give up and go outside</p></div>
              </button>
            </>
          )}
          {recoveryMenuLevel === 5 && (
            <div className="bg-white/5 p-8 border border-white/20">
              <h2 className="text-2xl mb-6">Startup Settings</h2>
              <button onClick={() => handleRecoveryOption(5, 'WINNER')} className="px-8 py-2 bg-white text-[#0078d7] font-semibold hover:bg-gray-200 transition-colors">Restart</button>
            </div>
          )}
          {recoveryMenuLevel !== 1 && recoveryMenuLevel !== 5 && (
             <button onClick={() => handleRecoveryOption(1, 'BACK')} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-4"><ArrowLeft size={16} /> Back</button>
          )}
          {recoveryMenuLevel === 2 && (
             <button onClick={() => handleRecoveryOption(3, 'ADVANCED')} className="flex items-start gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
               <div className="mt-1"><Settings size={32} /></div>
               <div><p className="text-xl">Advanced options</p></div>
             </button>
          )}
          {recoveryMenuLevel === 3 && (
             <button onClick={() => handleRecoveryOption(4, 'MORE')} className="p-6 bg-white/5 hover:bg-white/10 border border-white/20 text-left flex items-center justify-between group">
               <span className="text-lg">See more recovery options</span><ChevronRight />
             </button>
          )}
          {recoveryMenuLevel === 4 && (
             <button onClick={() => handleRecoveryOption(5, 'STARTUP_SETTINGS')} className="flex items-start gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
               <div className="mt-1"><Cpu size={32} /></div>
               <div><p className="text-xl">Startup Settings</p></div>
             </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-cover bg-center relative overflow-hidden flex flex-col select-none min-h-0" 
         style={{ backgroundImage: 'url(https://picsum.photos/id/10/1920/1080)' }}>
      
      {/* Desktop Icons */}
      <div className="flex-1 p-4 flex flex-col gap-2 w-fit content-start overflow-y-auto min-h-0">
        {apps.map(app => (
          <div key={app.id} className="flex flex-col items-center justify-center p-2 w-24 rounded hover:bg-white/20 cursor-default group" onDoubleClick={() => openApp(app.id)}>
            <div className="mb-1 text-white drop-shadow-lg">
              {app.type === 'DOC' && <FileText size={40} />}
              {app.type === 'BROWSER' && <Globe size={40} />}
              {app.type === 'CALCULATOR' && <Calculator size={40} />}
              {app.type === 'NOTEPAD' && <FileText size={40} />}
              {app.type === 'FILE_EXPLORER' && <Folder size={40} />}
              {app.type === 'TERMINAL' && <Terminal size={40} />}
              {app.type === 'GAMES' && <Gamepad2 size={40} />}
              {app.type === 'TRASH' && <Trash2 size={40} />}
              {app.type === 'MAIL' && <Mail size={40} />}
              {app.type === 'PHOTOS' && <Image size={40} />}
            </div>
            <span className="text-white text-xs text-center leading-tight drop-shadow-md font-semibold truncate w-full">{app.title}</span>
          </div>
        ))}
      </div>

      {/* AI Assistant Button */}
      <button 
        className="absolute bottom-20 right-8 w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-[5000] border-4 border-white"
        onClick={() => { setChatOpen(!chatOpen); playSound(SOUNDS.POP, 0.2); }}
      >
        <Bot size={32} />
      </button>

      {/* AI Assistant Chat Window */}
      {chatOpen && (
        <div className="absolute bottom-40 right-8 w-80 h-96 bg-white rounded-2xl shadow-2xl z-[5000] flex flex-col overflow-hidden border">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold text-sm">WinFliction AI</span>
            </div>
            <button onClick={() => setChatOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-gray-400 italic">WinFliction AI is ignoring you...</div>}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text" 
              className="flex-1 border rounded-full px-4 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" 
              placeholder="Ask for help (not recommended)"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssistantChat()}
            />
            <button onClick={handleAssistantChat} className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Low Disk Warning */}
      {showLowDiskWarning && (
        <div className="absolute bottom-16 right-4 w-72 bg-white border border-yellow-500 shadow-2xl p-4 rounded-lg cursor-pointer animate-bounce z-[5000]" onClick={triggerForcedUpdate}>
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm font-bold">Low Disk Space</p>
              <p className="text-xs text-gray-600">Click to install mandatory updates to clear 0.02KB of space.</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowLowDiskWarning(false); }} className="ml-auto"><X size={12} /></button>
          </div>
        </div>
      )}

      {/* Windows Overlay */}
      {apps.filter(a => a.isOpen && !a.isMinimized).map(app => (
        <div key={app.id} className="absolute win-glass shadow-2xl rounded-t-lg overflow-hidden flex flex-col" style={{ zIndex: app.zIndex, top: '15%', left: '20%', width: '60%', height: '60%' }}>
          <div className="bg-white/80 h-10 flex items-center justify-between px-3 border-b">
            <div className="flex items-center gap-2">
              {app.type === 'DOC' && <FileText size={16} className="text-blue-600" />}
              {app.type === 'BROWSER' && <Globe size={16} className="text-blue-600" />}
              {app.type === 'CALCULATOR' && <Calculator size={16} className="text-orange-600" />}
              {app.type === 'NOTEPAD' && <FileText size={16} className="text-gray-600" />}
              {app.type === 'FILE_EXPLORER' && <Folder size={16} className="text-yellow-600" />}
              {app.type === 'TERMINAL' && <Terminal size={16} className="text-green-600" />}
              {app.type === 'GAMES' && <Gamepad2 size={16} className="text-purple-600" />}
              {app.type === 'TRASH' && <Trash2 size={16} className="text-gray-500" />}
              {app.type === 'MAIL' && <Mail size={16} className="text-blue-500" />}
              {app.type === 'PHOTOS' && <Image size={16} className="text-pink-500" />}
              <span className="text-xs font-semibold text-gray-700">{app.title}</span>
            </div>
            <div className="flex h-full">
              <button className="w-12 h-full hover:bg-black/5 flex items-center justify-center" onClick={() => toggleMinimize(app.id)}><Minimize2 size={14} /></button>
              <button className="w-12 h-full hover:bg-red-500 hover:text-white flex items-center justify-center" onClick={() => closeApp(app.id)}><X size={16} /></button>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-auto">
            {/* Document Editor */}
            {app.type === 'DOC' && (
              <textarea className="w-full h-full p-8 border-none focus:ring-0 text-lg resize-none outline-none" defaultValue="Sales Report 2024..." />
            )}
            
            {/* Browser */}
            {app.type === 'BROWSER' && (
              <div className="h-full flex flex-col">
                <div className="bg-gray-100 p-2 flex items-center gap-2 border-b">
                  <button className="p-1 hover:bg-gray-200 rounded">←</button>
                  <button className="p-1 hover:bg-gray-200 rounded">→</button>
                  <button className="p-1 hover:bg-gray-200 rounded">↻</button>
                  <div className="flex-1 bg-white rounded-full px-4 py-1 text-sm text-gray-500">
                    https://www.bing.com/search?q=why+does+my+pc+update+so+much
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-12 text-center">
                  <AlertCircle size={64} className="text-yellow-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Internal Server Frustration</h2>
                  <p className="text-gray-500 mb-4">Error Code: 0x80042069</p>
                  <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow-lg" onClick={triggerForcedUpdate}>Diagnose & Restart</button>
                </div>
              </div>
            )}
            
            {/* Calculator */}
            {app.type === 'CALCULATOR' && (
              <div className="h-full bg-gray-800 p-4 flex flex-col">
                <div className="bg-gray-900 text-white text-right text-3xl p-4 rounded mb-4 font-mono">
                  0
                </div>
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn, i) => (
                    <button key={i} className={`rounded text-xl font-semibold transition-all active:scale-95 ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-orange-500 text-white hover:bg-orange-400' : btn === 'C' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'} ${btn === '0' ? 'col-span-2' : ''}`}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notepad */}
            {app.type === 'NOTEPAD' && (
              <div className="h-full flex flex-col">
                <div className="bg-gray-100 border-b px-4 py-1 text-xs flex gap-4 text-gray-600">
                  <span className="hover:text-black cursor-pointer">File</span>
                  <span className="hover:text-black cursor-pointer">Edit</span>
                  <span className="hover:text-black cursor-pointer">Format</span>
                  <span className="hover:text-black cursor-pointer">View</span>
                  <span className="hover:text-black cursor-pointer">Help</span>
                </div>
                <textarea className="flex-1 p-4 font-mono text-sm resize-none outline-none" defaultValue="Untitled Document - Not yet saved, never will be..." />
              </div>
            )}
            
            {/* File Explorer */}
            {app.type === 'FILE_EXPLORER' && (
              <div className="h-full flex">
                <div className="w-48 bg-gray-100 border-r p-2">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Quick Access</div>
                  {['Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos'].map((folder, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer text-sm">
                      <Folder size={16} className="text-yellow-600" />
                      <span>{folder}</span>
                    </div>
                  ))}
                  <div className="text-xs font-semibold text-gray-500 mt-4 mb-2">This PC</div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer text-sm">
                    <HardDrive size={16} className="text-blue-500" />
                    <span>Local Disk (C:)</span>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="text-sm text-gray-500 mb-4">This folder is empty. Just like your patience.</div>
                  <div className="grid grid-cols-4 gap-4">
                    {['System32', 'Windows.old', 'Temp', 'Cache'].map((item, i) => (
                      <div key={i} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                        <Folder size={40} className="text-yellow-600" />
                        <span className="text-xs mt-1 text-center">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Terminal */}
            {app.type === 'TERMINAL' && (
              <div className="h-full bg-black p-4 font-mono text-sm text-green-400">
                <div>WinFliction Terminal [Version 10.0.42069.69420]</div>
                <div className="text-gray-500">(c) WinFliction Corporation. All rights reserved.</div>
                <div className="mt-2 text-red-400">WARNING: System updates pending. Terminal access may be interrupted.</div>
                <div className="mt-4">
                  <span className="text-green-400">C:\Users\Victim&gt;</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}
            
            {/* Games */}
            {app.type === 'GAMES' && (
              <div className="h-full bg-gradient-to-br from-purple-900 to-blue-900 p-6 flex flex-col items-center justify-center text-white">
                <Gamepad2 size={80} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">WinFliction Games</h2>
                <p className="text-gray-300 mb-6 text-center">Your games are currently being updated.<br />Estimated time remaining: ∞</p>
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse" style={{ width: '23%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">23% complete (will reset at 99%)</p>
              </div>
            )}
            
            {/* Recycle Bin */}
            {app.type === 'TRASH' && (
              <div className="h-full bg-gray-50 p-6">
                <div className="text-center mb-6">
                  <Trash2 size={48} className="mx-auto text-gray-400 mb-2" />
                  <h2 className="text-lg font-semibold">Recycle Bin</h2>
                  <p className="text-sm text-gray-500">3 items (4.2 GB of regrets)</p>
                </div>
                <div className="space-y-2">
                  {['old_resume_2019.doc', 'family_photos_RESTORE.zip', 'taxes_final_FINAL_v2.xlsx'].map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <FileText size={20} className="text-blue-500" />
                      <span className="text-sm">{file}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                  Empty Recycle Bin (Warning: Files will be sent to the cloud)
                </button>
              </div>
            )}
            
            {/* Mail */}
            {app.type === 'MAIL' && (
              <div className="h-full flex">
                <div className="w-48 bg-blue-50 border-r p-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-100 rounded mb-2">
                    <Mail size={16} />
                    <span className="text-sm font-semibold">Inbox</span>
                    <span className="ml-auto bg-red-500 text-white text-xs px-1 rounded">99+</span>
                  </div>
                  {['Drafts', 'Sent', 'Spam', 'Trash'].map((folder, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer text-sm text-gray-600">
                      <span>{folder}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <div className="text-center text-gray-500 mt-8">
                    <Mail size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Your inbox is overflowing with spam.</p>
                    <p className="text-sm mt-2">99+ unread messages about extending your warranty.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Photos */}
            {app.type === 'PHOTOS' && (
              <div className="h-full bg-gray-900 p-4">
                <div className="text-center text-white mb-4">
                  <h2 className="text-lg font-semibold">WinFliction Photos</h2>
                  <p className="text-sm text-gray-400">Your memories are being synced to the cloud...</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-700 rounded flex items-center justify-center">
                      <Image size={32} className="text-gray-500" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-500">Syncing 2,847 photos... 0.01% complete</div>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '0.01%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Ads */}
      {ads.map(ad => (
        <div key={ad.id} className="absolute w-64 h-48 bg-white shadow-2xl border-2 border-yellow-400 z-[2000] flex flex-col" style={{ top: `${ad.top}%`, left: `${ad.left}%` }}>
          <div className="bg-yellow-400 px-2 py-1 flex justify-between items-center cursor-move text-[10px] font-bold">
            <span>{ad.title}</span>
            <button onClick={() => closeAd(ad.id)}><X size={10} /></button>
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-red-600 mb-2">{ad.content}</p>
            <button className="px-4 py-1 bg-green-500 text-white text-xs rounded animate-pulse font-bold">DOWNLOAD NOW</button>
          </div>
        </div>
      ))}

      {/* Taskbar */}
      <div className="h-12 win-taskbar flex items-center justify-between px-2 z-[4000] border-t border-white/30 flex-shrink-0">
        <div className="flex items-center h-full gap-1">
          <button className={`h-10 w-10 flex items-center justify-center rounded ${showStartMenu ? 'bg-white shadow-inner' : 'hover:bg-white/50'}`} onClick={handleStartClick}>
            <div className="grid grid-cols-2 gap-[2px]">
              <div className="w-[6px] h-[6px] bg-[#f25022]"></div>
              <div className="w-[6px] h-[6px] bg-[#7fba00]"></div>
              <div className="w-[6px] h-[6px] bg-[#00a4ef]"></div>
              <div className="w-[6px] h-[6px] bg-[#ffb900]"></div>
            </div>
          </button>
          <div className="h-8 w-40 win-glass rounded-full flex items-center px-3 gap-2 mx-1 border-none shadow-sm group">
            <Search size={14} className="text-gray-500" />
            <input type="text" placeholder="Search..." className="bg-transparent text-xs w-full focus:outline-none" />
          </div>
          <div className="flex items-center h-full ml-2 gap-1 overflow-x-auto">
            {apps.filter(app => app.isOpen).map(app => (
              <button key={app.id} className={`h-10 px-3 flex items-center justify-center rounded border-b-2 transition-all flex-shrink-0 ${!app.isMinimized ? 'bg-white/50 border-blue-600 shadow-sm' : 'border-transparent hover:bg-white/30'}`} onClick={() => toggleMinimize(app.id)}>
                {app.type === 'DOC' && <FileText size={16} className="text-blue-600" />}
                {app.type === 'BROWSER' && <Globe size={16} className="text-blue-400" />}
                {app.type === 'CALCULATOR' && <Calculator size={16} className="text-orange-600" />}
                {app.type === 'NOTEPAD' && <FileText size={16} className="text-gray-600" />}
                {app.type === 'FILE_EXPLORER' && <Folder size={16} className="text-yellow-600" />}
                {app.type === 'TERMINAL' && <Terminal size={16} className="text-green-600" />}
                {app.type === 'GAMES' && <Gamepad2 size={16} className="text-purple-600" />}
                {app.type === 'TRASH' && <Trash2 size={16} className="text-gray-500" />}
                {app.type === 'MAIL' && <Mail size={16} className="text-blue-500" />}
                {app.type === 'PHOTOS' && <Image size={16} className="text-pink-500" />}
              </button>
            ))}
          </div>
        </div>
        
        {/* System Tray */}
        <div className="flex items-center h-full gap-0.5 px-2 flex-shrink-0">
          {/* Hidden Icons Arrow */}
          <button className="p-1 hover:bg-white/20 rounded">
            <ChevronRight size={12} className="text-gray-600" />
          </button>
          
          {/* Status Icons */}
          <div className="flex items-center gap-0.5">
            {/* Bluetooth */}
            <button 
              className="p-1 hover:bg-white/20 rounded relative"
              onClick={() => setBluetoothOn(!bluetoothOn)}
            >
              <Bluetooth size={14} className={bluetoothOn ? "text-blue-500" : "text-gray-400"} />
            </button>
            
            {/* Cloud Sync */}
            <button className="p-1 hover:bg-white/20 rounded">
              <Cloud size={14} className="text-blue-400" />
            </button>
            
            {/* Notifications */}
            <button 
              className="p-1 hover:bg-white/20 rounded relative"
              onClick={() => setShowTrayPopup(showTrayPopup === 'notifications' ? null : 'notifications')}
            >
              <Bell size={14} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {/* WiFi */}
            <button 
              className="p-1 hover:bg-white/20 rounded"
              onClick={() => setShowTrayPopup(showTrayPopup === 'wifi' ? null : 'wifi')}
            >
              {wifiConnected ? <Wifi size={14} className="text-gray-600" /> : <WifiOff size={14} className="text-red-500" />}
            </button>
            
            {/* Volume */}
            <button 
              className="p-1 hover:bg-white/20 rounded"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX size={14} className="text-red-500" /> : <Volume2 size={14} className="text-gray-600" />}
            </button>
            
            {/* Battery */}
            <button 
              className="p-1 hover:bg-white/20 rounded flex items-center gap-0.5"
              onClick={() => setShowTrayPopup(showTrayPopup === 'battery' ? null : 'battery')}
            >
              {isCharging ? (
                <BatteryCharging size={14} className="text-green-500" />
              ) : batteryLevel < 20 ? (
                <BatteryLow size={14} className="text-red-500" />
              ) : (
                <Battery size={14} className="text-gray-600" />
              )}
              <span className="text-[9px] text-gray-600">{batteryLevel}%</span>
            </button>
          </div>
          
          {/* Date/Time */}
          <button 
            className="flex flex-col items-end px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] text-gray-700 leading-tight"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[9px]">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </button>
          
          {/* Show Desktop */}
          <div className="w-1 h-full hover:bg-blue-500/50 cursor-pointer border-l border-gray-300"></div>
        </div>
      </div>
      
      {/* System Tray Popups */}
      {showTrayPopup === 'notifications' && (
        <div className="absolute bottom-14 right-4 w-80 bg-white rounded-lg shadow-2xl z-[5000] overflow-hidden border">
          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
            <span className="font-semibold text-sm">Notifications</span>
            <button className="text-xs text-blue-500 hover:underline">Clear all</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-gray-500">{n.message}</div>
                <div className="text-[10px] text-gray-400 mt-1">{n.time.toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showTrayPopup === 'wifi' && (
        <div className="absolute bottom-14 right-24 w-72 bg-white rounded-lg shadow-2xl z-[5000] overflow-hidden border">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm">Wi-Fi</span>
              <button 
                className={`w-10 h-5 rounded-full transition-colors ${wifiConnected ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setWifiConnected(!wifiConnected)}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${wifiConnected ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
            {wifiConnected && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Wifi size={16} className="text-blue-500" />
                  <span className="text-sm">Home_Network_5G</span>
                  <span className="text-xs text-gray-400 ml-auto">Connected</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Wifi size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Neighbor's WiFi</span>
                  <span className="text-xs text-gray-400 ml-auto">🔒</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Wifi size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">FBI Surveillance Van</span>
                  <span className="text-xs text-gray-400 ml-auto">🔒</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {showTrayPopup === 'battery' && (
        <div className="absolute bottom-14 right-32 w-64 bg-white rounded-lg shadow-2xl z-[5000] overflow-hidden border">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              {isCharging ? <BatteryCharging size={24} className="text-green-500" /> : <Battery size={24} className="text-gray-600" />}
              <div>
                <div className="font-semibold text-sm">{batteryLevel}% remaining</div>
                <div className="text-xs text-gray-500">{isCharging ? 'Charging' : 'On battery'}</div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${batteryLevel < 20 ? 'bg-red-500' : batteryLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${batteryLevel}%` }}></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {isCharging ? '2 hours until full' : '47 minutes remaining (if you\'re lucky)'}
            </div>
            <button 
              className="mt-3 w-full py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              onClick={() => setIsCharging(!isCharging)}
            >
              Toggle Charging (Debug)
            </button>
          </div>
        </div>
      )}
      
      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute bottom-14 right-8 w-80 bg-white rounded-lg shadow-2xl z-[5000] overflow-hidden border">
          <div className="p-4 bg-blue-500 text-white">
            <div className="text-2xl font-light">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-sm opacity-80">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-gray-400 font-semibold">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                const isToday = day === new Date().getDate();
                return (
                  <div key={i} className={`p-1 rounded ${isToday ? 'bg-blue-500 text-white' : day > 0 && day <= 31 ? 'hover:bg-gray-100 cursor-pointer' : 'text-gray-300'}`}>
                    {day > 0 && day <= 31 ? day : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-14 left-2 w-[500px] max-h-[calc(100vh-60px)] win-glass rounded-xl shadow-2xl z-[3000] overflow-y-auto flex flex-col border border-white/40">
          {/* Header */}
          <div className="p-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Victim User</div>
                <div className="text-xs text-gray-500">victim@winfliction.local</div>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="p-3 border-b border-white/20">
            <div className="bg-white/80 rounded-full px-4 py-2 flex items-center gap-2">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Type here to search..." className="bg-transparent text-sm w-full focus:outline-none" />
            </div>
          </div>
          
          {/* Pinned Apps */}
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-700">Pinned</span>
              <button className="text-xs text-blue-500 hover:underline">All apps →</button>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {[
                { icon: <Globe size={18} />, name: 'Edge', type: 'BROWSER', color: 'text-blue-500' },
                { icon: <Folder size={18} />, name: 'Explorer', type: 'FILE_EXPLORER', color: 'text-yellow-600' },
                { icon: <Calculator size={18} />, name: 'Calculator', type: 'CALCULATOR', color: 'text-orange-500' },
                { icon: <FileText size={18} />, name: 'Notepad', type: 'NOTEPAD', color: 'text-gray-600' },
                { icon: <Terminal size={18} />, name: 'Terminal', type: 'TERMINAL', color: 'text-green-600' },
                { icon: <Mail size={18} />, name: 'Mail', type: 'MAIL', color: 'text-blue-400' },
                { icon: <Image size={18} />, name: 'Photos', type: 'PHOTOS', color: 'text-pink-500' },
                { icon: <Gamepad2 size={18} />, name: 'Games', type: 'GAMES', color: 'text-purple-500' },
                { icon: <Settings size={18} />, name: 'Settings', type: 'SETTINGS', color: 'text-gray-500' },
                { icon: <Trash2 size={18} />, name: 'Recycle', type: 'TRASH', color: 'text-gray-400' },
                { icon: <FileText size={18} />, name: 'Documents', type: 'DOC', color: 'text-blue-600' },
                { icon: <Cpu size={18} />, name: 'Task Mgr', type: 'SETTINGS', color: 'text-red-500' },
              ].map((app, i) => (
                <button 
                  key={i} 
                  className="flex flex-col items-center p-1.5 hover:bg-white/40 rounded-lg transition-colors"
                  onClick={() => {
                    const appToOpen = apps.find(a => a.type === app.type);
                    if (appToOpen) openApp(appToOpen.id);
                    setShowStartMenu(false);
                  }}
                >
                  <div className={app.color}>{app.icon}</div>
                  <span className="text-[9px] mt-0.5 text-gray-700 truncate w-full text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Recommended */}
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-700">Recommended</span>
              <button className="text-xs text-blue-500 hover:underline">More →</button>
            </div>
            <div className="space-y-1">
              {[
                { name: 'Important_Document.docx', desc: 'Yesterday', icon: <FileText size={14} className="text-blue-500" /> },
                { name: 'Family_Photos.zip', desc: '3 days ago', icon: <Folder size={14} className="text-yellow-600" /> },
                { name: 'taxes_final_FINAL_v2.xlsx', desc: 'Last week', icon: <FileText size={14} className="text-green-600" /> },
                { name: 'passwords.txt', desc: 'Never (please delete)', icon: <FileText size={14} className="text-red-500" /> },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-2 p-1.5 hover:bg-white/40 rounded-lg transition-colors text-left">
                  {item.icon}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-700 truncate">{item.name}</div>
                    <div className="text-[9px] text-gray-400">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-white/20 flex justify-between items-center">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/40 rounded-lg transition-colors">
              <User size={14} className="text-gray-600" />
              <span className="text-xs text-gray-700">Victim User</span>
            </button>
            <div className="flex items-center gap-0.5">
              <button 
                className="p-1.5 hover:bg-white/40 rounded-lg transition-colors"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={14} className="text-gray-600" /> : <Moon size={14} className="text-gray-600" />}
              </button>
              <button 
                className="p-1.5 hover:bg-white/40 rounded-lg transition-colors"
                onClick={() => playSound(SOUNDS.GLITCH, 0.3)}
              >
                <Lock size={14} className="text-gray-600" />
              </button>
              <button 
                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group"
                onClick={() => {
                  playSound(SOUNDS.ERROR, 0.5);
                  triggerForcedUpdate();
                }}
              >
                <Power size={14} className="text-gray-600 group-hover:text-red-500" />
              </button>
            </div>
          </div>
          
          {/* Restart Counter */}
          <div className="px-3 pb-2 text-center">
            <span className="text-[9px] text-gray-400">Restart Count: {restartCount}/5 until Recovery Mode</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
