import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, FileText, Github, Linkedin, ArrowRight, Server, Shield, Cpu } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-20 overflow-hidden">
      
      {/* Decorative Grid Mesh & Ambient Light */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-teal/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent-emerald/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Content Side */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Tagline Indicator */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse"></span>
            <span className="text-xs font-mono tracking-wider uppercase text-text-secondary">Seeking Entry-Level Roles</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 text-text-primary"
          >
            Hi, I'm <span className="bg-gradient-to-r from-accent-teal to-accent-emerald bg-clip-text text-transparent">Shibin CK</span>
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl font-mono text-accent-teal font-semibold mb-6 flex items-center gap-2"
          >
            <Terminal className="w-6 h-6 animate-pulse" />
            <span>Cloud & DevOps Engineer</span>
          </motion.h2>

          {/* Clean Fresher Bio */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-text-secondary mb-8 leading-relaxed max-w-xl"
          >
            Fresher Cloud & DevOps Engineer focused on Docker, AWS, Terraform, CI/CD pipelines, and cloud deployment workflows. I focus on learning-by-building and understanding how core systems run under the hood.
          </motion.p>

          {/* CTAs & Socials */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <a 
              href="#projects" 
              className="px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-emerald text-bg-primary font-semibold rounded-md shadow-lg shadow-accent-teal/15 hover:shadow-accent-teal/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 group"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a 
              href="Shibin_CK_Resume.pdf" 
              download
              className="px-6 py-3 border border-white/10 bg-white/5 font-semibold text-text-primary rounded-md hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-accent-teal" />
              <span>Download Resume (PDF)</span>
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6"
          >
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Connect:</span>
            <a 
              href="https://github.com/shibinck872-cpu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-teal transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/shibin-ck-446b6b247" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-teal transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Graphical Visuals Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:flex justify-center"
        >
          <div className="relative w-full max-w-[360px] aspect-square rounded-2xl border border-white/5 bg-bg-secondary/40 backdrop-blur-md p-6 overflow-hidden glow-glow">
            
            {/* Minimal Code Terminal Look */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 font-mono text-xs text-text-muted select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <span>shibin_cluster_logs</span>
            </div>

            {/* Simulated Server/Infrastructure Stack Visuals */}
            <div className="flex flex-col gap-4 font-mono text-xs">
              
              {/* Load Balancer node */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                <span className="text-accent-teal flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>ingress_alb</span>
                </span>
                <span className="text-accent-emerald text-[10px] bg-accent-emerald/10 px-1.5 py-0.5 rounded border border-accent-emerald/20 uppercase">healthy</span>
              </div>

              {/* Connector lines visual */}
              <div className="flex justify-around items-center h-4 text-text-muted opacity-30 select-none">
                <span>│</span>
                <span>│</span>
              </div>

              {/* Services block */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-1.5">
                  <span className="text-text-primary text-[11px] font-semibold flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-accent-teal" />
                    <span>ecs_frontend</span>
                  </span>
                  <span className="text-[10px] text-text-secondary">fargate | port 80</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-1.5">
                  <span className="text-text-primary text-[11px] font-semibold flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-accent-teal" />
                    <span>ecs_backend</span>
                  </span>
                  <span className="text-[10px] text-text-secondary">fargate | port 5000</span>
                </div>
              </div>

              {/* Connector lines visual */}
              <div className="flex justify-around items-center h-4 text-text-muted opacity-30 select-none">
                <span>│</span>
                <span>│</span>
              </div>

              {/* Secure database boundary */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-emerald" />
                  <span>isolated_db_tier</span>
                </span>
                <span className="text-[10px] text-text-muted">mongo_atlas</span>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
