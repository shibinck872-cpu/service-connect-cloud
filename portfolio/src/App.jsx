import React, { useState } from 'react';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Diagram from './components/Diagram.jsx';
import Journey from './components/Journey.jsx';
import Contact from './components/Contact.jsx';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Journey', href: '#journey' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-height-screen bg-bg-primary text-text-primary bg-grid-pattern selection:bg-accent-teal/20 selection:text-accent-teal">
      
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full h-20 bg-bg-primary/80 backdrop-blur-md border-b border-border-color border-white/5 z-50 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-mono text-lg font-bold flex items-center gap-2 group">
            <span className="text-accent-teal group-hover:text-accent-emerald transition-colors">[</span>
            <span className="text-text-primary tracking-wide">shibin ck</span>
            <span className="text-accent-teal group-hover:text-accent-emerald transition-colors">]</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-text-secondary hover:text-accent-teal transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://github.com/shibinck872-cpu/service-connect-cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/10 rounded-md text-xs font-mono font-medium hover:bg-white/5 hover:border-accent-teal/30 hover:text-accent-teal transition-all flex items-center gap-1.5"
            >
              <span>Repository</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </nav>

          {/* Mobile toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-20 left-0 w-full bg-bg-secondary/95 border-b border-white/5 backdrop-blur-lg flex flex-col p-6 gap-4 md:hidden">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMenuOpen(false)}
                className="text-lg font-medium text-text-secondary hover:text-accent-teal transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://github.com/shibinck872-cpu/service-connect-cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 py-3 border border-white/10 rounded-md text-center text-sm font-mono hover:bg-white/5 hover:text-accent-teal transition-all flex items-center justify-center gap-2"
            >
              <span>View Repository</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </header>

      {/* ================= MAIN LAYOUT ================= */}
      <main className="pt-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Diagram />
        <Journey />
        <Contact />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/5 py-10 bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-text-muted font-mono">
            &copy; 2026 Shibin CK. Built for Cloud & DevOps roles.
          </p>
          <div className="flex gap-6 text-sm font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
              <span>Available for Roles</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
