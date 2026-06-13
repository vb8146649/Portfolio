import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

type TabType = 'TERMINAL' | 'PROBLEMS' | 'OUTPUT' | 'DEBUG_CONSOLE';

export const TerminalWidget: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('terminalOpen');
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth > 768; // Default to closed on mobile
  });
  const [activeTab, setActiveTab] = useState<TabType>('TERMINAL');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<LogEntry[]>([
    { type: 'output', text: "Vishal's Portfolio Shell v1.0.0 initialized." },
    { type: 'output', text: 'Type "help" to list available commands.' },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resize listener for responsive layout adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist terminal open state and update layout class
  useEffect(() => {
    localStorage.setItem('terminalOpen', JSON.stringify(isOpen));
    if (isOpen) {
      document.body.classList.add('terminal-open');
    } else {
      document.body.classList.remove('terminal-open');
    }
    return () => {
      document.body.classList.remove('terminal-open');
    };
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    if (terminalEndRef.current && activeTab === 'TERMINAL') {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, activeTab]);

  // Focus input when clicking terminal tab body
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newLogs: LogEntry[] = [...history, { type: 'input', text: `visitor@vishal-portfolio:~$ ${input}` }];

    switch (cmd) {
      case 'help':
        newLogs.push(
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  about        - View developer profile' },
          { type: 'output', text: '  skills       - Query technical skills' },
          { type: 'output', text: '  projects     - Query code projects' },

          { type: 'output', text: '  easter-egg   - Trigger confetti celebration' },
          { type: 'output', text: '  clear        - Clear console buffer' },
          { type: 'output', text: '  help         - Print command list' }
        );
        break;
      case 'about':
        newLogs.push(
          { type: 'output', text: 'Name: Vishal' },
          { type: 'output', text: 'Education: B.Tech in Software Engineering, Delhi Technological University (Class of 2027)' },
          { type: 'output', text: 'GPA: 8.86 / 10.0' }
        );
        break;
      case 'skills':
        newLogs.push(
          { type: 'output', text: 'Languages: JavaScript, Python, C++, C, TypeScript, SQL, HTML, CSS' },
          { type: 'output', text: 'Libraries & Frameworks: React, OpenCV, GSAP, Tailwind CSS, Framer Motion, Selenium, NumPy, Pandas, FFmpeg, Raylib, OpenGL' },
          { type: 'output', text: 'Practices: Test-Driven Development, Git, GitHub Actions, Jest' }
        );
        break;
      case 'projects':
        newLogs.push(
          { type: 'output', text: '1. YouTube Playlist Finder Extension - Chrome extension to find video playlists' },
          { type: 'output', text: '2. AI-Powered YouTube Bot - Automated video creator pipeline (FFmpeg, Selenium)' },
          { type: 'output', text: '3. FPS Shooter VR Game - VR 3D game in C++ using Raylib and OpenGL' },
          { type: 'output', text: '4. Robotics CV Track - OpenCV and Python target detection' }
        );
        break;

      case 'easter-egg':
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.9 },
          colors: ['#00f3ff', '#ff007f', '#b026ff']
        });
        newLogs.push({ type: 'output', text: '🎉 Confetti celebration triggered!' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newLogs.push({ type: 'error', text: `Command not found: "${cmd}". Type "help" to view directory commands.` });
    }

    setHistory(newLogs);
    setInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 999,
        background: '#040710',
        borderTop: '1px solid var(--card-border)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
        fontFamily: 'JetBrains Mono, monospace',
        display: 'flex',
        flexDirection: 'column',
        height: isOpen ? (isMobile ? '185px' : '280px') : '36px',
        transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* VSCode Header / Tab bar */}
      <div
        style={{
          height: '36px',
          backgroundColor: '#070c18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          userSelect: 'none',
          borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '1.2rem', height: '100%', alignItems: 'center' }}>
          {/* Collapse toggle click zone */}
          <div
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="clickable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            <span>IDE DIAGNOSTICS</span>
          </div>

          {isOpen && (
            <div style={{ display: 'flex', gap: '0.5rem', height: '100%', alignItems: 'center' }}>
              {(['TERMINAL', 'PROBLEMS', 'OUTPUT', 'DEBUG_CONSOLE'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0 0.6rem',
                    height: '100%',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tab.replace('_', ' ')}
                  {tab === 'PROBLEMS' && (
                    <span style={{ marginLeft: '4px', background: '#ef4444', color: '#fff', padding: '1px 5px', borderRadius: '10px', fontSize: '0.6rem' }}>
                      0
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action controls */}
        {isOpen && (
          <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--text-secondary)' }}>
            <button
              onClick={() => {
                setHistory([]);
              }}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              title="Clear Terminal Buffer"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* VSCode Panel Content */}
      {isOpen && (
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#040710', padding: '0.8rem' }}>
          
          {/* Tab: TERMINAL */}
          {activeTab === 'TERMINAL' && (
            <div
              onClick={focusInput}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.8rem',
                cursor: 'text',
              }}
            >
              {history.map((log, index) => (
                <div
                  key={index}
                  style={{
                    color:
                      log.type === 'input'
                        ? 'var(--text-primary)'
                        : log.type === 'error'
                        ? '#ff007f'
                        : 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {log.text}
                </div>
              ))}


              <div ref={terminalEndRef} />

              <form
                onSubmit={handleCommand}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: 'auto',
                  paddingTop: '0.4rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                }}
              >
                <span style={{ color: 'var(--accent-secondary)' }}>root@orbit-deck:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8rem',
                  }}
                  autoFocus
                  placeholder="type a diagnostic command (e.g. help)..."
                />
              </form>
            </div>
          )}

          {/* Tab: PROBLEMS */}
          {activeTab === 'PROBLEMS' && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>No problems have been detected in the workspace workspace-orbit-deck.</span>
              <br /><br />
              <span style={{ color: '#10b981' }}>✓ All solar grids operating within optimal parameters.</span>
            </div>
          )}

          {/* Tab: OUTPUT */}
          {activeTab === 'OUTPUT' && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <span>[info - 14:39:10] Loaded user settings: data-theme: electric-obsidian.</span>
              <br />
              <span>[info - 14:39:12] Web Audio Synthesizer successfully initialized in scope 'UI-oscillators'.</span>
              <br />
              <span>[info - 14:39:15] Solar Grid telemetry charts connected. Listening on port 5173.</span>
            </div>
          )}

          {/* Tab: DEBUG CONSOLE */}
          {activeTab === 'DEBUG_CONSOLE' && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>&gt; debug session started.</span>
              <br />
              <span>&gt; await developer.sleep(Infinity);</span>
              <br />
              <span style={{ color: '#f59e0b' }}>⚠️ Warning: infinite recursion loop is active. Developer is currently coding in deep space.</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
