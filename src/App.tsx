import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
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
      <ScrollProgress />

      {/* Experiential Overlays */}
      <div className="cyber-grid" />
      <div className="crt-overlay" />

      {/* Navigation header */}
      <Navigation />

      {/* Portfolio sections */}
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* Collapsible retro-developer terminal shell */}
      <TerminalWidget />
    </>
  );
}

export default App;
