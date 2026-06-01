import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, CheckCircle } from 'lucide-react';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('local');

  const specs = {
    local: [
      {
        title: "Multi-Stage Dockerfiles",
        desc: "Dockerized both the frontend and backend. The React static bundles compile using Vite and serve from a lightweight Nginx Alpine base. The TypeScript Express backend strips dev dependencies, running inside an isolated node process with low permissions."
      },
      {
        title: "Nginx Ingress Proxy",
        desc: "Configured an Nginx container running on port 80. It acts as a local reverse proxy that directs client traffic to the frontend and proxies `/api` and WebSockets to the backend, bypassing CORS concerns entirely."
      },
      {
        title: "Docker Compose Setup",
        desc: "Configured local orchestration using Docker Compose. Set up private container network bridges and defined container dependency rules so the Express API waits for a successful MongoDB ping before starting."
      }
    ],
    cloud: [
      {
        title: "Terraform Provisioning",
        desc: "Wrote declarative Terraform configs to deploy and connect core cloud services, including custom VPC networks, security groups, public load balancers, private subnets, target groups, and CloudWatch log groups."
      },
      {
        title: "VPC & ALB Networking",
        desc: "Constructed isolated private subnets where Fargate container tasks run safely. They are inaccessible directly from the internet, only receiving traffic forwarded from the Application Load Balancer."
      },
      {
        title: "Pipeline Automation",
        desc: "Implemented a GitHub Actions workflow using Docker Buildx and layers caching. On push to main, the runner builds standard container images for AMD64/ARM64 architectures, uploads them to Amazon ECR, and runs ECS task updates."
      }
    ]
  };

  return (
    <section id="projects" className="py-24 bg-bg-secondary/40 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Projects</h2>
          <p className="text-text-secondary max-w-md text-sm">A hands-on case study of packaging a MERN stack application, building automated pipelines, and automating deployments.</p>
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

            <h3 className="text-2xl font-bold text-text-primary mb-2">Containerized MERN Deployment Platform</h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              I containerized a full-stack MERN (MongoDB, Express, React, Node) application and migrated it to AWS. The project focuses on setting up container boundaries, configuring Nginx path routing, automating image builds, and provisioning serverless cloud environments.
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
                <span>Codebase Configured & Synced</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
