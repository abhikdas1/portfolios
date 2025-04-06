/**
 * Cyberpunk Effects JavaScript file for ProfileCraft template-5
 * Handles particle effects, glitching animations, and other cyberpunk theme elements
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Particles Effect ------- //
    const particlesContainer = document.querySelector('.cyber-particles');
    if (particlesContainer) {
        createParticles();
    }
    
    // Function to create particles
    function createParticles() {
        const numParticles = 50;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position, size, and color
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const colorIndex = Math.floor(Math.random() * 3);
            const colors = [
                'var(--neon-primary)',
                'var(--neon-secondary)',
                'var(--neon-accent)'
            ];
            
            // Set particle styles
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[colorIndex];
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.boxShadow = `0 0 ${size * 2}px ${colors[colorIndex]}`;
            
            // Set animation with random duration and delay
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
            
            // Add particle to container
            particlesContainer.appendChild(particle);
        }
        
        // Add float animation keyframes if not exists
        if (!document.getElementById('particle-animation-style')) {
            const style = document.createElement('style');
            style.id = 'particle-animation-style';
            style.textContent = `
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(0) translateX(20px);
                    }
                    75% {
                        transform: translateY(20px) translateX(10px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ------- System Status Bar ------- //
    updateSystemTime();
    setInterval(updateSystemTime, 1000);
    
    function updateSystemTime() {
        const timeElement = document.getElementById('system-time');
        const dateElement = document.getElementById('system-date');
        const statusElement = document.getElementById('system-status');
        
        if (timeElement && dateElement) {
            const now = new Date();
            
            // Format time as HH:MM:SS
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            
            // Format date as DD.MM.YYYY
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}.${month}.${year}`;
            
            // Flash the system status occasionally
            if (statusElement && Math.random() > 0.95) {
                statusElement.textContent = "SYS.PROCESSING";
                setTimeout(() => {
                    statusElement.textContent = "SYS.ONLINE";
                }, 500);
            }
        }
    }
    
    // ------- Theme Selector ------- //
    const themeSelector = document.getElementById('theme-selector');
    
    if (themeSelector) {
        // Set initial theme from localStorage or default to neon-blue
        const savedTheme = localStorage.getItem('cyberpunk-theme') || 'neon-blue';
        document.body.className = `cyberpunk-theme ${savedTheme}`;
        themeSelector.value = savedTheme;
        
        // Theme change event
        themeSelector.addEventListener('change', function() {
            const selectedTheme = this.value;
            document.body.className = `cyberpunk-theme ${selectedTheme}`;
            localStorage.setItem('cyberpunk-theme', selectedTheme);
            
            // Add glitch effect when changing theme
            document.querySelectorAll('.glitch').forEach(element => {
                element.classList.add('active-glitch');
                setTimeout(() => {
                    element.classList.remove('active-glitch');
                }, 1000);
            });
        });
    }
    
    // ------- Terminal Typing Effect ------- //
    // First, ensure we get all terminal lines
    const terminalLines = document.querySelectorAll('.terminal-line');
    console.log('Terminal lines found:', terminalLines.length);
    
    if (terminalLines.length > 0) {
        terminalLines.forEach((line, index) => {
            const command = line.querySelector('.terminal-command');
            if (command) {
                const originalText = command.textContent;
                command.textContent = '';
                
                // Delay based on position in the document
                const delay = index * 500 + 500; // Add extra delay to ensure DOM is ready
                
                setTimeout(() => {
                    typeText(command, originalText, 50);
                }, delay);
            }
        });
    }
    
    function typeText(element, text, speed) {
        let i = 0;
        console.log('Typing text:', text);
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // ------- Stats Counter Animation ------- //
    const statValues = document.querySelectorAll('.stat-value');
    console.log('Stat values found:', statValues.length);
    
    if (statValues.length > 0) {
        // Force immediate animation for better UX
        animateStats();
    }
    
    function animateStats() {
        console.log('Animating stats...');
        
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            console.log('Target value:', target);
            
            let current = 0;
            const increment = target / 30;
            const duration = 1500;
            const step = Math.ceil(duration / 30);
            
            // Reset to 0 first
            stat.textContent = '0';
            
            const timer = setInterval(() => {
                current += increment;
                stat.textContent = Math.min(Math.floor(current), target);
                
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = target;
                }
            }, step);
        });
    }
    
    // Also trigger on scroll to about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        window.addEventListener('scroll', function() {
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight - 100) &&
                rect.bottom >= 100
            );
            
            if (isVisible) {
                animateStats();
                // Remove this event listener once animation is triggered
                window.removeEventListener('scroll', this);
            }
        });
    }
    
    // ------- Typewriter Effect ------- //
    const typewriterElements = document.querySelectorAll('.cyber-typewriter');
    
    typewriterElements.forEach(element => {
        if (element && element.getAttribute('data-words')) {
            const words = element.getAttribute('data-words').split(', ');
            let wordIndex = 0;
            
            function updateTypewriter() {
                const currentWord = words[wordIndex];
                element.textContent = currentWord;
                
                // Move to next word
                wordIndex = (wordIndex + 1) % words.length;
                
                // Wait before changing to next word
                setTimeout(updateTypewriter, 4000);
            }
            
            // Start the animation
            updateTypewriter();
        }
    });
    
    // ------- Progress Bar Animation ------- //
    const progressBars = document.querySelectorAll('.cyber-progress-bar');
    
    if (progressBars.length > 0) {
        // First reset all to 0 width
        progressBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.setAttribute('data-width', originalWidth);
            bar.style.width = '0';
        });
        
        // Then animate when skills section becomes visible
        animateProgressBarsOnScroll();
    }
    
    function animateProgressBarsOnScroll() {
        const skillsSection = document.getElementById('skills');
        
        if (!skillsSection) return;
        
        function checkSkillsVisibility() {
            const rect = skillsSection.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight - 100) &&
                rect.bottom >= 100
            );
            
            if (isVisible) {
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 300);
                });
                
                // Remove scroll listener once animated
                window.removeEventListener('scroll', checkSkillsVisibility);
            }
        }
        
        // Check initial visibility
        checkSkillsVisibility();
        
        // Add scroll event listener
        window.addEventListener('scroll', checkSkillsVisibility);
    }
});
