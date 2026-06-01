import React from 'react';
import { ArrowRight, GitBranch, Terminal, ShieldAlert, Layers } from 'lucide-react';

export default function Diagram() {
  return (
    <section id="architecture" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">System Architectures</h2>
          <p className="text-text-secondary max-w-md text-sm">Visual representations of the live traffic flow and automated CI/CD pipeline.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ================= DIAGRAM 1: PRODUCTION INGRESS TRAFFIC ================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/5 bg-bg-card/30 flex flex-col justify-between relative overflow-hidden glow-glow">
            <div>
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-accent-teal uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>AWS Production Traffic Flow</span>
              </div>
              
              {/* Traffic Flow Blocks */}
              <div className="flex flex-col gap-6 relative">
                
                {/* 1. Public User */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">Inbound Request</span>
                    <span className="text-sm font-bold text-text-primary">Public Ingress (User)</span>
                  </div>
                  <span className="text-xs font-mono text-text-muted">port 80 / 443</span>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 2. ALB */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-accent-teal/20 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-accent-teal">Security Boundary</span>
                    <span className="text-sm font-bold text-text-primary">Application Load Balancer</span>
                  </div>
                  <span className="text-[10px] text-text-secondary bg-accent-teal/10 px-1.5 py-0.5 rounded border border-accent-teal/25 uppercase font-mono">Routing</span>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 3. ECS Services in Private Subnets */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                  <span className="font-mono text-xs text-text-muted block mb-3">ECS Fargate Private Subnets (No Inbound Internet Access)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-md flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-primary">Frontend Task</span>
                      <span className="text-[10px] text-text-secondary font-mono">Nginx | HTML</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-md flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-primary">Backend Task</span>
                      <span className="text-[10px] text-text-secondary font-mono">Node.js | REST</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 4. MongoDB Database */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">Storage Tier</span>
                    <span className="text-sm font-bold text-text-primary">MongoDB Atlas Cluster</span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
                    <span>Cloud SaaS</span>
                  </span>
                </div>

              </div>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed mt-6 pt-4 border-t border-white/5">
              * The Load Balancer accepts HTTP requests and evaluates paths. External access to ECS Tasks is blocked; tasks exclusively communicate internally in private VPC networks.
            </p>
          </div>

          {/* ================= DIAGRAM 2: AUTOMATED DEPLOYMENT PIPELINE ================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/5 bg-bg-card/30 flex flex-col justify-between relative overflow-hidden glow-glow">
            <div>
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-accent-emerald uppercase tracking-wider">
                <GitBranch className="w-4 h-4" />
                <span>CI/CD Automations</span>
              </div>
              
              {/* Build Pipeline Blocks */}
              <div className="flex flex-col gap-6 relative">
                
                {/* 1. Git Push */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">Trigger Event</span>
                    <span className="text-sm font-bold text-text-primary">Git Commit Push</span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary">main branch</span>
                </div>

                <div className="flex justify-center text-accent-emerald/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 2. GitHub Actions */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-accent-emerald/20 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-accent-emerald">Runner Job</span>
                    <span className="text-sm font-bold text-text-primary">GitHub Actions Runner</span>
                  </div>
                  <span className="text-[10px] text-accent-emerald bg-accent-emerald/10 px-1.5 py-0.5 rounded border border-accent-emerald/25 uppercase font-mono">Workflow</span>
                </div>

                <div className="flex justify-center text-accent-emerald/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 3. Docker build */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">Compilation</span>
                    <span className="text-sm font-bold text-text-primary">Docker Buildx (Multi-Arch)</span>
                  </div>
                  <span className="text-xs font-mono text-text-muted">AMD64 / ARM64</span>
                </div>

                <div className="flex justify-center text-accent-emerald/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 4. ECR Registry */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">Private Registry</span>
                    <span className="text-sm font-bold text-text-primary">Amazon ECR</span>
                  </div>
                  <span className="text-[10px] text-text-secondary uppercase">Image Store</span>
                </div>

                <div className="flex justify-center text-accent-emerald/50 my-[-8px]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>

                {/* 5. ECS Deployment rolling */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-text-muted">ECS Update</span>
                    <span className="text-sm font-bold text-text-primary">Fargate Task Execution</span>
                  </div>
                  <span className="text-xs font-mono text-accent-emerald">Rolling Upgrade</span>
                </div>

              </div>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed mt-6 pt-4 border-t border-white/5">
              * A git push initiates automated linting, builds multi-platform Docker layers utilizing layer caches to optimize compilation speed, pushes them to AWS, and updates the task model securely.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
