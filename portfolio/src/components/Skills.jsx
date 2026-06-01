import React from 'react';
import { Box, Cloud, Code, GitBranch, Terminal, Globe, HelpCircle } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      icon: <Box className="w-5 h-5 text-accent-teal" />,
      title: "Containers & Virtualization",
      skills: ["Docker", "Docker Compose"]
    },
    {
      icon: <Cloud className="w-5 h-5 text-accent-teal" />,
      title: "Cloud Platforms (AWS)",
      skills: ["AWS ECS", "AWS Fargate", "EC2", "S3", "IAM", "ECR", "CloudWatch"]
    },
    {
      icon: <Code className="w-5 h-5 text-accent-teal" />,
      title: "Infrastructure as Code",
      skills: ["Terraform HCL", "VPC Subnet Planning", "ALB Target Groups"]
    },
    {
      icon: <GitBranch className="w-5 h-5 text-accent-teal" />,
      title: "CI/CD & Automation",
      skills: ["GitHub Actions", "Git / GitHub Workflow", "Docker Buildx / QEMU"]
    },
    {
      icon: <Terminal className="w-5 h-5 text-accent-teal" />,
      title: "Linux & Networking",
      skills: ["Linux Fundamentals", "Shell Scripting", "Nginx Reverse Proxy", "CORS & Proxying"]
    },
    {
      icon: <Globe className="w-5 h-5 text-accent-teal" />,
      title: "Backend & Web",
      skills: ["Node.js (TypeScript)", "Express.js", "MongoDB Atlas", "React & Vite"]
    }
  ];

  return (
    <section id="skills" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Technical Skills</h2>
          <p className="text-text-secondary max-w-md text-sm">Categorized hands-on technical skills and fundamental learning areas without arbitrary expertise bars.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {skillCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-white/5 bg-bg-card/30 hover:border-accent-teal/10 hover:bg-bg-card/50 transition-all duration-300 flex flex-col gap-5"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="p-2 bg-white/5 rounded-md">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-text-primary text-sm sm:text-base">{cat.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-md text-xs font-mono text-text-secondary hover:text-accent-teal hover:border-accent-teal/20 transition-all duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Learning Block */}
        <div className="p-6 rounded-xl border border-accent-teal/15 bg-accent-teal/5 max-w-xl mx-auto flex items-start gap-4 shadow-sm">
          <HelpCircle className="w-6 h-6 text-accent-teal shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="font-mono text-sm font-semibold text-accent-teal uppercase tracking-wider">Kubernetes Fundamentals</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              To broaden my container coordination skills, I am **Currently Learning Kubernetes Fundamentals**, focusing on Pod definitions, Service abstractions, ConfigMaps, and local Minikube cluster management.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
