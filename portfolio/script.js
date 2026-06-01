document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       ARCHITECTURE PANEL TABS
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const localPanel = document.getElementById('localPanel');
    const cloudPanel = document.getElementById('cloudPanel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active classes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            localPanel.classList.remove('active');
            cloudPanel.classList.remove('active');
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Toggle corresponding panel
            const tabTarget = button.getAttribute('data-tab');
            if (tabTarget === 'local') {
                localPanel.classList.add('active');
            } else if (tabTarget === 'cloud') {
                cloudPanel.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       TYPEWRITER SUBTITLE EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        "Cloud & DevOps Engineer",
        "Container Specialist",
        "Infrastructure Developer"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Wait before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Launch typewriter
    typeEffect();

    /* ==========================================================================
       INTERACTIVE DEVOPS TERMINAL CONSOLE
       ========================================================================== */
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    const promptTemplate = document.getElementById('promptTemplate');

    // Focus input on terminal body click
    document.querySelector('.terminal-body').addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCommand = terminalInput.value.trim();
            const command = rawCommand.toLowerCase();
            
            // Create prompt copy for history
            const historyLine = document.createElement('div');
            historyLine.className = 'terminal-line';
            historyLine.innerHTML = `<span class="terminal-prompt">shibin@devops-node:~$</span> ${escapeHTML(rawCommand)}`;
            
            // Append history and clear input
            terminalBody.insertBefore(historyLine, promptTemplate);
            terminalInput.value = '';
            
            if (command !== '') {
                parseCommand(command);
            }
            
            // Auto scroll down
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function writeLine(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line log-${type}`;
        line.textContent = text;
        terminalBody.insertBefore(line, promptTemplate);
    }

    function parseCommand(cmd) {
        switch (cmd) {
            case 'help':
                writeLine('Available Commands:', 'accent');
                writeLine('  about              - Display a short professional background bio');
                writeLine('  skills             - Display the technical stack in Terraform format');
                writeLine('  docker compose up  - Run simulated boot log of MERN container stack');
                writeLine('  terraform apply    - Run simulated deployment of AWS infrastructure');
                writeLine('  contact            - View instructions to establish contact');
                writeLine('  clear              - Clear terminal console history');
                break;
                
            case 'clear':
                // Remove all lines except prompt
                const lines = terminalBody.querySelectorAll('.terminal-line');
                lines.forEach(line => line.remove());
                break;
                
            case 'about':
                writeLine('Identity: Shibin CK', 'accent');
                writeLine('Role: Cloud & DevOps Engineer');
                writeLine('Bio: Transitioned from MERN Stack development to Infrastructure as Code and cloud systems design.');
                writeLine('Core Focus: Container isolation, unprivileged runtimes, automated CI/CD builds, and secure multi-subnet cloud networks.');
                break;
                
            case 'skills':
                writeLine('variable "technical_skills" {', 'accent');
                writeLine('  type    = list(string)');
                writeLine('  default = [');
                writeLine('    "Docker & Multi-Stage Builds",');
                writeLine('    "Terraform Infrastructure as Code",');
                writeLine('    "Nginx Ingress Proxy & WebSocket Routing",');
                writeLine('    "GitHub Actions Automation Pipelines",');
                writeLine('    "AWS VPC, ECS Fargate, ALB & ACM",');
                writeLine('    "Express (TypeScript) & React (Vite)"');
                writeLine('  ]');
                writeLine('}', 'accent');
                break;
                
            case 'docker compose up':
                writeLine('Creating network "serviceconnectapp_service-network" with driver "bridge"...', 'normal');
                writeLine('Creating volume "serviceconnectapp_mongodb_data" with local driver...', 'normal');
                setTimeout(() => writeLine('Creating Container service-connect-db ... Starting', 'normal'), 300);
                setTimeout(() => writeLine('Creating Container service-connect-db ... Healthy', 'success'), 900);
                setTimeout(() => writeLine('Creating Container service-connect-backend ... Starting', 'normal'), 1200);
                setTimeout(() => {
                    writeLine('service-connect-backend | Connected to MongoDB successfully', 'success');
                    writeLine('service-connect-backend | Server running on port 5000', 'success');
                }, 2000);
                setTimeout(() => writeLine('Creating Container service-connect-frontend ... Starting', 'normal'), 2300);
                setTimeout(() => writeLine('Creating Container service-connect-gateway ... Starting', 'normal'), 2600);
                setTimeout(() => {
                    writeLine('service-connect-gateway | Ingress router loaded on port 80', 'success');
                    writeLine('Apply completed. Local cluster running successfully at http://localhost', 'success');
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }, 3200);
                break;
                
            case 'terraform apply':
                writeLine('aws_vpc.main: Creating...', 'normal');
                setTimeout(() => writeLine('aws_vpc.main: Creation complete after 1s [id=vpc-094720f2f7ee1b058]', 'success'), 800);
                setTimeout(() => writeLine('aws_subnet.private_1: Creating...', 'normal'), 1100);
                setTimeout(() => writeLine('aws_subnet.public_1: Creating...', 'normal'), 1100);
                setTimeout(() => writeLine('aws_internet_gateway.gw: Creating...', 'normal'), 1400);
                setTimeout(() => writeLine('aws_internet_gateway.gw: Creation complete after 1s', 'success'), 2000);
                setTimeout(() => writeLine('aws_nat_gateway.nat: Creating...', 'normal'), 2300);
                setTimeout(() => writeLine('aws_nat_gateway.nat: Still creating... [10s elapsed]', 'normal'), 3300);
                setTimeout(() => writeLine('aws_nat_gateway.nat: Creation complete after 12s', 'success'), 4500);
                setTimeout(() => writeLine('aws_lb.main: Creating...', 'normal'), 4800);
                setTimeout(() => writeLine('aws_lb.main: Creation complete after 3m24s', 'success'), 6000);
                setTimeout(() => {
                    writeLine('aws_ecs_service.backend: Creation complete after 1s', 'success');
                    writeLine('aws_ecs_service.frontend: Creation complete after 1s', 'success');
                    writeLine('Apply complete! Resources: 36 added, 0 changed, 0 destroyed.', 'success');
                    writeLine('Outputs:', 'accent');
                    writeLine('load_balancer_dns = "service-connect-alb-19582.ap-south-1.elb.amazonaws.com"', 'success');
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }, 7200);
                break;
                
            case 'contact':
                writeLine('Routing configuration target detected:', 'accent');
                writeLine('Please scroll down to the "Let\'s Connect" section of the page and fill out the contact form.');
                writeLine('Alternatively, email me directly at: shibin@example.com');
                break;
                
            default:
                writeLine(`shell: command not found: ${cmd}. Type 'help' for options.`, 'error');
                break;
        }
    }

    /* ==========================================================================
       CONTACT FORM VERIFICATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Faux send transition
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<span>Sending Message...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
            if (window.lucide) lucide.createIcons();
            
            setTimeout(() => {
                formSubmitBtn.className = "btn btn-primary btn-block success-btn";
                formSubmitBtn.innerHTML = `<span>Message Sent Successfully</span> <i data-lucide="check-circle"></i>`;
                if (window.lucide) lucide.createIcons();
                contactForm.reset();
                
                setTimeout(() => {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.className = "btn btn-primary btn-block";
                    formSubmitBtn.innerHTML = `<span>Send Message</span> <i data-lucide="send"></i>`;
                    if (window.lucide) lucide.createIcons();
                }, 4000);
            }, 1500);
        });
    }
});
