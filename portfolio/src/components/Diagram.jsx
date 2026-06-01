import React from 'react';
import { ArrowRight, GitBranch, Terminal, Layers, RefreshCw } from 'lucide-react';

export default function Diagram() {
  const deploymentSteps = [
    { label: "GitHub Push", desc: "Push to main branch triggers the CI pipeline." },
    { label: "GitHub Actions", desc: "Automated workflow runner initiates container tasks." },
    { label: "Docker Build", desc: "Builds optimized multi-stage AMD64/ARM64 images." },
    { label: "Amazon ECR", desc: "Stores secure private images in ECR repositories." },
    { label: "Terraform Infrastructure", desc: "Applies networking changes and updates task definitions." },
    { label: "ECS Fargate Deployment", desc: "Orchestrates clean rolling container replacements." }
  ];

  return (
    <section id="architecture" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">System Workflows</h2>
          <p className="text-text-secondary max-w-md text-sm">Visual systems layout of the network traffic and automated delivery pipeline.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ================= DIAGRAM 1: PRODUCTION TRAFFIC FLOW ================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/5 bg-bg-card/30 flex flex-col justify-between relative overflow-hidden glow-glow">
            <div>
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-accent-teal uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Application Traffic Route</span>
              </div>
              
              {/* Traffic Flow Blocks */}
              <div className="flex flex-col gap-5 relative">
                
                {/* 1. Public User */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-text-muted">Inbound Traffic</span>
                    <span className="text-sm font-bold text-text-primary">Public User Request</span>
                  </div>
                  <span className="text-xs font-mono text-text-muted">HTTP / HTTPS</span>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-10px]">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>

                {/* 2. ALB */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-accent-teal/20 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-accent-teal">Gateway routing</span>
                    <span className="text-sm font-bold text-text-primary">Application Load Balancer</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">Port 80</span>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-10px]">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>

                {/* 3. ECS Services in Private Subnets */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                  <span className="font-mono text-[10px] text-text-muted block mb-3">Isolated VPC Private Subnets</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-md flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-primary">Frontend Service</span>
                      <span className="text-[10px] text-text-secondary font-mono">React / Nginx</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-md flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-primary">Backend Service</span>
                      <span className="text-[10px] text-text-secondary font-mono">Node / Express</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-accent-teal/50 my-[-10px]">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>

                {/* 4. MongoDB Database */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-text-muted">Storage Layer</span>
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
              * Users route through the public ALB, which acts as the ingress proxy. The core frontend and backend services run inside secure VPC subnets with zero inbound access from raw web hosts.
            </p>
          </div>

          {/* ================= DIAGRAM 2: DEDICATED VISUAL DEPLOYMENT PIPELINE ================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/5 bg-bg-card/30 flex flex-col justify-between relative overflow-hidden glow-glow">
            <div>
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-accent-emerald uppercase tracking-wider">
                <GitBranch className="w-4 h-4" />
                <span>Automated Deployment Flow</span>
              </div>
              
              {/* Build Pipeline Steps */}
              <div className="flex flex-col gap-3 relative">
                {deploymentSteps.map((step, idx) => (
                  <React.Fragment key={step.label}>
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] text-text-muted">STAGE {idx + 1}</span>
                        <span className="text-xs font-bold text-text-primary">{step.label}</span>
                        <span className="text-[11px] text-text-secondary leading-normal mt-0.5">{step.desc}</span>
                      </div>
                    </div>
                    {idx < deploymentSteps.length - 1 && (
                      <div className="flex justify-center text-accent-emerald/40 my-[-4px]">
                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed mt-6 pt-4 border-t border-white/5">
              * Commits trigger automated GitHub Actions runners. Docker builds compile standard static files and server code, pushing them to Amazon ECR, followed by a Terraform apply task execution update.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
