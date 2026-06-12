import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { TerminalWidget } from './components/TerminalWidget';

function App() {
  return (
    <>
      {/* Interactive Utilities */}
      <CustomCursor />
      <ThemeSwitcher />

      {/* Experiential Overlays */}
      <div className="cyber-grid" />
      <div className="crt-overlay" />

      {/* Navigation header */}
      <Navigation />

      {/* Portfolio sections */}
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Collapsible retro-developer terminal shell */}
      <TerminalWidget />
    </>
  );
}

export default App;
