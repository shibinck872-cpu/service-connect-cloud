import React from 'react';
import { Calendar, GitCommit, PlayCircle, ShieldCheck, Zap } from 'lucide-react';

export default function Journey() {
  const steps = [
    {
      phase: "01",
      icon: <PlayCircle className="w-5 h-5 text-accent-teal" />,
      title: "Full-Stack Development Foundations",
      subtitle: "Focus: Application Code & REST Principles",
      desc: "Built full-stack React and Express MERN applications from scratch. Mastered frontend state handling, JWT authorization systems, router protection schemes, and database queries. This experience gave me a deep appreciation for the software that runs inside the infrastructure."
    },
    {
      phase: "02",
      icon: <GitCommit className="w-5 h-5 text-accent-teal" />,
      title: "Containerization & Environment Isolation",
      subtitle: "Focus: Docker & Compose Orchestrations",
      desc: "Isolated runtimes by writing modular, multi-stage Dockerfiles to decouple development dependencies from production serving binaries. Engineered local multi-container environments using Docker Compose network bridges and anonymous volumes to prevent host dependency corruption."
    },
    {
      phase: "03",
      icon: <Zap className="w-5 h-5 text-accent-teal" />,
      title: "Unified Ingress & Networking",
      subtitle: "Focus: Nginx Reverse Proxies & Ingress Security",
      desc: "Configured Nginx edge reverse-proxies as local API gateways. Learned how to parse standard URL paths, upgrade HTTP traffic to WebSocket protocols (Socket.io), and handle ingress requests locally to fully bypass standard browser-side CORS configuration errors."
    },
    {
      phase: "04",
      icon: <ShieldCheck className="w-5 h-5 text-accent-teal" />,
      title: "Automation Pipelines & Build Speeds",
      subtitle: "Focus: GitHub Actions CI/CD Automations",
      desc: "Programmed deployment triggers using GitHub Actions. Integrated linting, security audits, and multi-architecture Docker compilations (AMD64 & ARM64) using Docker Buildx and QEMU cache mounts to minimize build times and securely push packages to AWS ECR."
    },
    {
      phase: "05",
      icon: <Calendar className="w-5 h-5 text-accent-teal" />,
      title: "Infrastructure as Code & Cloud Services",
      subtitle: "Focus: Declarative Terraform & Serverless AWS",
      desc: "Learned VPC subnetting, public load balancer routing, private subnets, NAT Gateways, and serverless compute setups. Automated 100% of these resources—including task configurations, IAM policies, and CloudWatch streams—using declarative Terraform HCL scripts."
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
        <div className="flex flex-col gap-12 relative border-l border-white/5 pl-6 sm:pl-8 ml-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Point indicator */}
              <div className="absolute top-1.5 left-[-42px] sm:left-[-50px] w-8 h-8 rounded-full border border-white/10 bg-bg-primary flex items-center justify-center group-hover:border-accent-teal/30 transition-all duration-300">
                {step.icon}
              </div>

              {/* Box card */}
              <div className="p-6 rounded-xl border border-white/5 bg-bg-card/20 group-hover:border-white/10 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-accent-teal font-bold">PHASE {step.phase}</span>
                  <span className="text-[10px] font-mono text-text-muted">{step.subtitle}</span>
                </div>
                
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-teal transition-colors">{step.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
