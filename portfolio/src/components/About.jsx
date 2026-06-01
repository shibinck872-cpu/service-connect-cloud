import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Settings, Eye, HelpCircle } from 'lucide-react';

export default function About() {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cards = [
    {
      icon: <Terminal className="w-6 h-6 text-accent-teal" />,
      title: "Hands-on Builder",
      desc: "I believe that the best way to master Cloud Engineering is by building infrastructure from scratch. I focus on container isolation, multi-stage compilation, and writing declarative resource blocks rather than simply reading conceptual articles."
    },
    {
      icon: <Settings className="w-6 h-6 text-accent-teal" />,
      title: "DevOps Integration",
      desc: "My core goal is to bridge the gap between application code and deployment environments. I build automated workflows that automatically test, containerize, and securely deploy modifications so developers can focus solely on writing code."
    },
    {
      icon: <Eye className="w-6 h-6 text-accent-teal" />,
      title: "Humble Mindset",
      desc: "As an entry-level professional holding a BCA background, I acknowledge that cloud ecosystems are massive and constantly evolving. I emphasize mastering the core fundamentals of Linux administration, container networks, and security boundaries."
    }
  ];

  return (
    <section id="about" className="py-24 bg-bg-secondary/40 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">About Me</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full"></div>
        </div>

        {/* Core Narrative Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-semibold mb-4 text-text-primary font-mono flex items-center gap-2">
              <span className="text-accent-teal">01.</span>
              <span>My Cloud Journey & Background</span>
            </h3>
            
            <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
              Starting as a computer applications (BCA) student, I quickly realized my passion was not just writing code, but understanding exactly where that code runs, how it scales, and how it handles failures. This curiosity led me straight into the world of Cloud Engineering and DevOps.
            </p>
            
            <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
              Rather than pursuing conceptual certificates, I focused on a hands-on learning strategy. I took a standard monolithic full-stack application that I built and committed myself to containerizing it, routing it secure networks with Nginx, configuring automated build triggers, and writing modular AWS configurations using Terraform to host it live.
            </p>

            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              I am highly eager to learn and ready to contribute to core operations, deployment automations, and container orchestration tasks within collaborative platform engineering teams.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-xl p-6 font-mono text-xs text-text-secondary">
            <div className="flex gap-1.5 pb-3 border-b border-white/5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal"></span>
              <span className="text-[10px] text-text-muted">core_devops_philosophy.json</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-accent-teal/90">
{`{
  "focus_areas": [
    "Linux Systems Administration",
    "Multi-stage Containerization",
    "CI/CD Pipeline Automations",
    "Infrastructure as Code"
  ],
  "operating_principles": {
    "security": "Isolation over access",
    "deployments": "Declarative over imperative",
    "maintenance": "Automate repetitive processes",
    "learning": "Build-to-understand"
  }
}`}
            </pre>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 rounded-xl border border-white/5 bg-bg-card/40 hover:border-accent-teal/20 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="p-3 bg-white/5 rounded-lg w-fit">
                {card.icon}
              </div>
              <h4 className="text-lg font-bold text-text-primary">{card.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
