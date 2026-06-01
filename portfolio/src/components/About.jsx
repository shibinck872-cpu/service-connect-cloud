import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Settings, Eye } from 'lucide-react';

export default function About() {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cards = [
    {
      icon: <Terminal className="w-6 h-6 text-accent-teal" />,
      title: "Hands-on Learning",
      desc: "I believe the best way to learn cloud infrastructure is by building it. I focus on containerizing applications, configuring network rules, and writing infrastructure scripts rather than just reviewing high-level slide decks."
    },
    {
      icon: <Settings className="w-6 h-6 text-accent-teal" />,
      title: "Automation Focus",
      desc: "My main goal is to simplify how code goes from a local machine to a running environment. I enjoy building automation pipelines that automatically test, build, and deploy changes so that development steps are repeatable."
    },
    {
      icon: <Eye className="w-6 h-6 text-accent-teal" />,
      title: "Humble Mindset",
      desc: "As a computer applications (BCA) student looking for my first cloud role, I recognize that the cloud space is vast. I focus on mastering core system fundamentals, Linux commands, network protocols, and secure setups."
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
              <span>My Technical Focus</span>
            </h3>
            
            <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
              During my BCA studies, I developed a strong interest in understanding how software is packaged, automated, and run in the cloud. Instead of focusing solely on application coding, I shifted my attention to systems deployment, networking, and configuration management.
            </p>
            
            <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
              I spent time containerizing full-stack applications with Docker, managing routing with local Nginx proxies, and automating builds using GitHub Actions. To learn cloud deployment, I configured core AWS network subnets, gateways, and container services using Terraform to make my projects functional and accessible.
            </p>

            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              I am highly motivated to join a team where I can support day-to-day deployment scripts, maintain container environments, automate builds, and continue growing as an engineer.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-xl p-6 font-mono text-xs text-text-secondary">
            <div className="flex gap-1.5 pb-3 border-b border-white/5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal"></span>
              <span className="text-[10px] text-text-muted">learning_path.json</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-accent-teal/90">
{`{
  "currently_learning": [
    "Linux Administration",
    "Terraform",
    "AWS ECS & Fargate",
    "Docker Networking"
  ],
  "interests": [
    "CI/CD Pipelines",
    "Infrastructure Automation",
    "Cloud Deployments",
    "Containerization"
  ]
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
