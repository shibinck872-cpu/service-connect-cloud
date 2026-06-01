import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Box, Server, Cpu, CheckCircle, Network, GitPullRequest } from 'lucide-react';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('local');

  const specs = {
    local: [
      {
        title: "Multi-Stage Dockerfiles",
        desc: "Designed multi-stage builds. In the React frontend, static files are compiled via Vite and served from a minimal Nginx Alpine runner image (~18MB). In the TypeScript backend, dev dependencies are stripped, running Express via a secure, unprivileged node user."
      },
      {
        title: "Unified Ingress Gateway",
        desc: "Created a dedicated Nginx container mapping traffic locally on port 80. It handles proxy passes for /api/ and socket connections, bypassing browser-side CORS configuration errors entirely."
      },
      {
        title: "Orchestration & Health checks",
        desc: "Managed the stack using Docker Compose. Built dependency boundaries where the Express API container pings MongoDB and waits for a healthy status return before initiating execution."
      }
    ],
    cloud: [
      {
        title: "Infrastructure as Code (IaC)",
        desc: "Coded 100% of the AWS infrastructure using Terraform modules, including VPC subnets, Application Load Balancers, Target Groups, ECS Task definitions, and CloudWatch log groups."
      },
      {
        title: "Zero-Trust Private Networks",
        desc: "Constructed isolated private subnets. The ECS Fargate tasks run in these subnets, accepting network requests originating solely from the Application Load Balancer's security group."
      },
      {
        title: "Multi-Arch CI/CD Pipeline",
        desc: "Engineered a GitHub Actions workflow using Docker Buildx and QEMU cache targets. It builds AMD64/ARM64 images, pushes them to Amazon ECR, and automatically triggers an ECS Task definition rolling update."
      }
    ]
  };

  return (
    <section id="projects" className="py-24 bg-bg-secondary/40 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Infrastructures</h2>
          <p className="text-text-secondary max-w-md text-sm">Case study of containerization, continuous integration, and infrastructure deployments.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        {/* Project Card */}
        <div className="rounded-2xl border border-white/5 bg-bg-card/40 overflow-hidden glow-glow">
          
          {/* Project Title Block */}
          <div className="p-8 border-b border-white/5">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">Docker</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">Nginx</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">Terraform</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">AWS Fargate</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-text-secondary">GitHub Actions</span>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-2">Containerized MERN Cloud Deployment Platform</h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              Transformed a standard monolithic MERN (MongoDB, Express, React, Node) application into a decoupled, secure, and production-ready cloud system. The project showcases how to containerize local environments and scale them to serverless AWS services using automation.
            </p>
          </div>

          {/* Project Body & Tabs */}
          <div className="p-8 bg-bg-secondary/20">
            
            {/* Tabs Selector */}
            <div className="flex gap-4 border-b border-white/5 mb-8">
              <button 
                onClick={() => setActiveTab('local')}
                className={`pb-3 font-mono text-sm font-semibold transition-all relative ${activeTab === 'local' ? 'text-accent-teal' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <span>Local Compose Stack</span>
                {activeTab === 'local' && (
                  <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-teal" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('cloud')}
                className={`pb-3 font-mono text-sm font-semibold transition-all relative ${activeTab === 'cloud' ? 'text-accent-teal' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <span>AWS Production Cloud</span>
                {activeTab === 'cloud' && (
                  <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-teal" />
                )}
              </button>
            </div>

            {/* Architecture Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[220px]">
              <AnimatePresence mode="wait">
                {specs[activeTab].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="p-5 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-3"
                  >
                    <h4 className="font-mono text-sm font-bold text-accent-teal flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-teal"></span>
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/5">
              <a 
                href="https://github.com/shibinck872-cpu/service-connect-cloud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded border border-white/10 bg-white/5 text-xs font-mono font-medium hover:bg-white/10 hover:border-accent-teal/30 hover:text-accent-teal transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
              <span className="text-xs font-mono text-text-muted flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>IaC Code Validated & Pushed</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
