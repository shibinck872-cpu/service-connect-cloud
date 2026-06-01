import React from 'react';
import { Calendar, GitCommit, PlayCircle, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

export default function Journey() {
  const steps = [
    {
      phase: "01",
      icon: <PlayCircle className="w-5 h-5 text-accent-teal" />,
      title: "Learned Linux & Networking Fundamentals",
      subtitle: "Focus: Systems & Protocols Foundations",
      desc: "Mastered Linux systems administration fundamentals, terminal operations, file systems permissions, and shell scripting basics. Configured local networks, TCP/IP boundaries, HTTP protocols, and DNS resolutions."
    },
    {
      phase: "02",
      icon: <GitCommit className="w-5 h-5 text-accent-teal" />,
      title: "Started Containerization using Docker",
      subtitle: "Focus: Docker & Compose Orchestrations",
      desc: "Isolated application layers by building multi-stage Dockerfiles. Configured microservice clusters locally using Docker Compose networks and volumes, decoupling frontend static bundles from Node backend systems."
    },
    {
      phase: "03",
      icon: <Zap className="w-5 h-5 text-accent-teal" />,
      title: "Built CI/CD Pipelines using GitHub Actions",
      subtitle: "Focus: Automation & Package Registries",
      desc: "Automated standard build phases on code pushes. Created CI workflows handling code lints, multi-architecture packaging (AMD64/ARM64) via Docker Buildx/QEMU caching, and secure distribution to image vaults."
    },
    {
      phase: "04",
      icon: <ShieldCheck className="w-5 h-5 text-accent-teal" />,
      title: "Learned Terraform for Infrastructure Automation",
      subtitle: "Focus: Declarative Infrastructure as Code (IaC)",
      desc: "Designed and versioned multi-resource networks using Terraform HCL. Formulated declarative infrastructure layouts including custom virtual networks, routing rules, access policies, and load balancers."
    },
    {
      phase: "05",
      icon: <Calendar className="w-5 h-5 text-accent-teal" />,
      title: "Deployed Applications using AWS ECS/Fargate",
      subtitle: "Focus: Serverless ECS Clusters & ALB Routing",
      desc: "Hosted the completed container stack live in the cloud. Provisioned secure VPC boundaries, private subnet groupings, Application Load Balancers, IAM security policies, and serverless compute runtimes."
    }
  ];

  return (
    <section id="journey" className="py-24 bg-bg-secondary/40 relative">
      <div className="w-full max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Cloud Learning Journey</h2>
          <p className="text-text-secondary max-w-md text-sm">Chronological outline of hands-on technical concepts mastered by building infrastructure.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        {/* Timeline List */}
        <div className="flex flex-col gap-12 relative border-l border-white/5 pl-6 sm:pl-8 ml-4 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Point indicator */}
              <div className="absolute top-1.5 left-[-42px] sm:left-[-50px] w-8 h-8 rounded-full border border-white/10 bg-bg-primary flex items-center justify-center group-hover:border-accent-teal/30 transition-all duration-300">
                {step.icon}
              </div>

              {/* Box card */}
              <div className="p-6 rounded-xl border border-white/5 bg-bg-card/20 group-hover:border-white/10 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-accent-teal font-bold">STAGE {step.phase}</span>
                  <span className="text-[10px] font-mono text-text-muted">{step.subtitle}</span>
                </div>
                
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-teal transition-colors">{step.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>

            </div>
          ))}
        </div>

        {/* Learning Target Indicator */}
        <div className="p-6 rounded-xl border border-accent-teal/15 bg-accent-teal/5 max-w-2xl mx-auto flex items-start gap-4 shadow-sm">
          <HelpCircle className="w-6 h-6 text-accent-teal shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="font-mono text-sm font-semibold text-accent-teal uppercase tracking-wider">Active Roadmap: Kubernetes Fundamentals</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Having mastered core containers and serverless orchestration, my immediate roadmap is focused on **learning Kubernetes fundamentals** (deployments, replica sets, cluster network services, and container volumes) to round out my infrastructure engineering skills.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
