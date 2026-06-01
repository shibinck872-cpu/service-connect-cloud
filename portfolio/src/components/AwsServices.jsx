import React from 'react';
import { Cpu, Server, Database, Layers, Network, Shield, Eye, ShieldAlert } from 'lucide-react';

export default function AwsServices() {
  const services = [
    {
      name: "Amazon VPC",
      icon: <Network className="w-5 h-5 text-accent-teal" />,
      desc: "Isolated virtual network.",
      usage: "Configured public and private subnets, NAT gateways, and security groups to isolate backend tasks from public internet access."
    },
    {
      name: "Amazon ECS",
      icon: <Server className="w-5 h-5 text-accent-teal" />,
      desc: "Container orchestrator.",
      usage: "Used to manage tasks, coordinate container rolling updates, and execute health checks on the running frontend and backend services."
    },
    {
      name: "AWS Fargate",
      icon: <Cpu className="w-5 h-5 text-accent-teal" />,
      desc: "Serverless container compute.",
      usage: "Hosts the running container tasks without requiring manual provisioning, patching, or OS-level management of EC2 virtual servers."
    },
    {
      name: "Amazon ECR",
      icon: <Database className="w-5 h-5 text-accent-teal" />,
      desc: "Private Docker registry.",
      usage: "Acts as our secure image vault. Built Docker images are pushed here via pipelines, and ECS pulls them during task deployments."
    },
    {
      name: "Application Load Balancer (ALB)",
      icon: <Layers className="w-5 h-5 text-accent-teal" />,
      desc: "Public HTTP gateway routing.",
      usage: "Configured listeners and routing rules to direct standard client traffic to the frontend and api/websocket requests to the backend."
    },
    {
      name: "Amazon S3",
      icon: <ShieldAlert className="w-5 h-5 text-accent-teal" />,
      desc: "Secure object bucket storage.",
      usage: "Created an S3 storage bucket with public block rules to host and serve uploaded application assets and media attachments securely."
    },
    {
      name: "AWS IAM",
      icon: <Shield className="w-5 h-5 text-accent-teal" />,
      desc: "Permission identity management.",
      usage: "Provisioned specific ECS execution roles that grant permission for containers to retrieve ECR images and send log streams."
    },
    {
      name: "Amazon CloudWatch",
      icon: <Eye className="w-5 h-5 text-accent-teal" />,
      desc: "Infrastructure log streams.",
      usage: "Integrated container logging. Standard console output from Nginx and Express is aggregated here to trace server requests and errors."
    }
  ];

  return (
    <section id="aws-services" className="py-24 bg-bg-secondary/40 relative">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">AWS Services Used</h2>
          <p className="text-text-secondary max-w-md text-sm">Grounded, hands-on application of core cloud infrastructure components in this project.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-white/5 bg-bg-card/30 hover:border-accent-teal/15 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-lg w-fit">
                  {srv.icon}
                </div>
                <h3 className="font-bold text-text-primary text-sm sm:text-base">{srv.name}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-accent-teal">{srv.desc}</span>
                <p className="text-xs text-text-secondary leading-relaxed">{srv.usage}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
