import React from 'react';
import { Mail, Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const contacts = [
    {
      icon: <Mail className="w-5 h-5 text-accent-teal" />,
      label: "Direct Email",
      value: "shibinck872@gmail.com",
      href: "mailto:shibinck872@gmail.com"
    },
    {
      icon: <Linkedin className="w-5 h-5 text-accent-teal" />,
      label: "LinkedIn Profile",
      value: "shibin-ck-446b6b247",
      href: "https://www.linkedin.com/in/shibin-ck-446b6b247"
    },
    {
      icon: <Github className="w-5 h-5 text-accent-teal" />,
      label: "GitHub Repositories",
      value: "shibinck872-cpu",
      href: "https://github.com/shibinck872-cpu"
    },
    {
      icon: <FileText className="w-5 h-5 text-accent-teal" />,
      label: "Professional Resume",
      value: "Download Shibin_CK_Resume.docx",
      href: "Shibin_CK_Resume.docx"
    }
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="w-full max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Let's Connect</h2>
          <p className="text-text-secondary max-w-md text-sm">I am actively seeking entry-level Cloud & DevOps roles. Reach out to discuss open opportunities.</p>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald rounded-full mt-4"></div>
        </div>

        {/* Recruiter Friendly Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contacts.map((c, idx) => (
            <a 
              key={idx}
              href={c.href}
              target={c.href.startsWith('mailto') ? undefined : "_blank"}
              rel="noopener noreferrer"
              download={c.href === "Shibin_CK_Resume.docx" ? true : undefined}
              className="p-6 rounded-xl border border-white/5 bg-bg-card/20 hover:border-accent-teal/20 hover:bg-bg-card/40 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-lg w-fit group-hover:bg-accent-teal/10 transition-colors">
                  {c.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">{c.label}</span>
                  <span className="text-sm font-bold text-text-primary group-hover:text-accent-teal transition-colors mt-0.5">{c.value}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
