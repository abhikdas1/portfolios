/**
 * Main JavaScript file for Windows-themed Portfolio Template 6
 * Handles animations, interactions, and other functionalities
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Stats Counter ------- //
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(statEl => {
            const target = parseInt(statEl.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50; // Adjust for animation speed
            const duration = 1500;
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                current += increment;
                statEl.textContent = Math.round(current);
                
                if (current >= target) {
                    statEl.textContent = target;
                    clearInterval(counter);
                }
            }, stepTime);
        });
    }
    
    // Animate stats when welcome window is opened
    const welcomeWindow = document.getElementById('welcome-window');
    if (welcomeWindow) {
        // Set up a mutation observer to detect when the window becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' && 
                    welcomeWindow.classList.contains('visible')) {
                    setTimeout(animateStats, 500);
                }
            });
        });
        
        observer.observe(welcomeWindow, { attributes: true });
    }
    
    // ------- Typing Text Effect ------- //
    const typingTextElements = document.querySelectorAll('.typing-text');
    
    typingTextElements.forEach(element => {
        const words = element.getAttribute('data-words').split(', ');
        let wordIndex = 0;
        
        function typeWord(word, element, callback) {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < word.length) {
                    element.textContent = word.substring(0, charIndex + 1);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(callback, 1500); // Pause before deleting
                }
            }, 100);
        }
        
        function deleteWord(element, callback) {
            let text = element.textContent;
            const deleteInterval = setInterval(() => {
                if (text.length > 0) {
                    text = text.substring(0, text.length - 1);
                    element.textContent = text;
                } else {
                    clearInterval(deleteInterval);
                    callback();
                }
            }, 50);
        }
        
        function startTypingEffect() {
            const word = words[wordIndex];
            
            typeWord(word, element, () => {
                deleteWord(element, () => {
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(startTypingEffect, 500); // Delay before typing next word
                });
            });
        }
        
        // Start the typing effect
        startTypingEffect();
    });
    
    // ------- Project Filtering ------- //
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    
                    // Add animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ------- Skill Bar Animation ------- //
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const target = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = target;
            }, 300);
        });
    }
    
    // Animate when skills window is opened
    const skillsWindow = document.getElementById('skills-window');
    if (skillsWindow) {
        // Set up a mutation observer to detect when the window becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' && 
                    skillsWindow.classList.contains('visible')) {
                    setTimeout(animateSkillBars, 500);
                }
            });
        });
        
        observer.observe(skillsWindow, { attributes: true });
    }
    
    // ------- Demo Start Buttons ------- //
    const exploreProjectsBtn = document.getElementById('explore-projects');
    const contactMeBtn = document.getElementById('contact-me');
    
    if (exploreProjectsBtn) {
        exploreProjectsBtn.addEventListener('click', () => {
            window.windowManager.openWindow('projects');
        });
    }
    
    if (contactMeBtn) {
        contactMeBtn.addEventListener('click', () => {
            window.windowManager.openWindow('contact');
        });
    }
    
    // ------- Download CV Functionality ------- //
    const downloadCvBtn = document.getElementById('download-cv');
    
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show notification instead of actual download for demo
            window.windowManager.showNotification(
                'Resume Download', 
                'Your resume is being prepared for download...', 
                'info'
            );
            
            // Simulate download after delay
            setTimeout(() => {
                window.windowManager.showNotification(
                    'Download Complete', 
                    'Resume has been downloaded successfully!', 
                    'success'
                );
            }, 2000);
        });
    }
    
    // ------- Handle First-Time Visit ------- //
    function showWelcomeNotification() {
        // Check if this is the first visit
        if (!localStorage.getItem('windows_portfolio_visited')) {
            // Set the flag
            localStorage.setItem('windows_portfolio_visited', 'true');
            
            // Show welcome notification after a delay
            setTimeout(() => {
                window.windowManager.showNotification(
                    'Welcome to My Portfolio',
                    'Double-click desktop icons or use the Start Menu to navigate.',
                    'info'
                );
            }, 2000);
        }
    }
    
    // Show welcome notification if window manager is initialized
    if (typeof window.windowManager !== 'undefined') {
        showWelcomeNotification();
    } else {
        // Wait for window manager to initialize
        window.addEventListener('load', () => {
            if (typeof window.windowManager !== 'undefined') {
                showWelcomeNotification();
            }
        });
    }
    
    // ------- Asset Loading Management ------- //
    function generatePlaceholders() {
        // List of project images to check and generate placeholders for if missing
        const projectImages = [
            { src: 'assets/project-1.jpg', alt: 'E-commerce Website' },
            { src: 'assets/project-2.jpg', alt: 'Fitness Tracker App' },
            { src: 'assets/project-3.jpg', alt: 'Dashboard UI Kit' },
            { src: 'assets/project-4.jpg', alt: 'Task Management System' }
        ];
        
        // Check profile image
        const profileImage = document.querySelector('.profile-image img');
        if (profileImage) {
            profileImage.onerror = function() {
                // Create canvas for profile placeholder
                const canvas = document.createElement('canvas');
                canvas.width = 160;
                canvas.height = 160;
                const ctx = canvas.getContext('2d');
                
                // Fill gradient background
                const gradient = ctx.createLinearGradient(0, 0, 160, 160);
                gradient.addColorStop(0, '#0078D7');
                gradient.addColorStop(1, '#0099FF');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 160, 160);
                
                // Add user icon
                ctx.font = 'bold 80px "Segoe UI"';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👤', 80, 80);
                
                // Set the placeholder
                this.src = canvas.toDataURL('image/png');
            };
        }
        
        // Check desktop background
        const desktopBg = document.querySelector('.desktop-bg');
        if (desktopBg && getComputedStyle(desktopBg).backgroundImage === 'none') {
            // Create a Windows-style gradient background
            desktopBg.style.background = 'linear-gradient(135deg, #0078D7 0%, #0099FF 100%)';
        }
        
        // Check project images
        projectImages.forEach((image, index) => {
            const projectImages = document.querySelectorAll(`.project-img img[src="${image.src}"]`);
            
            projectImages.forEach(img => {
                img.onerror = function() {
                    // Create canvas for project placeholder
                    const canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 200;
                    const ctx = canvas.getContext('2d');
                    
                    // Different color for each project
                    const colors = [
                        { bg: '#0078D7', fg: '#00BAFF' },
                        { bg: '#107C10', fg: '#44C344' },
                        { bg: '#5C2D91', fg: '#9575CD' },
                        { bg: '#D83B01', fg: '#FF8C66' }
                    ];
                    
                    const colorIndex = index % colors.length;
                    
                    // Fill background
                    ctx.fillStyle = colors[colorIndex].bg;
                    ctx.fillRect(0, 0, 300, 200);
                    
                    // Add project icon
                    const icons = ['📊', '📱', '🎨', '✓'];
                    ctx.font = 'bold 60px "Segoe UI"';
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(icons[colorIndex], 150, 80);
                    
                    // Add project text
                    ctx.font = 'bold 16px "Segoe UI"';
                    ctx.fillText(image.alt, 150, 140);
                    
                    // Set the placeholder
                    this.src = canvas.toDataURL('image/png');
                };
            });
        });
    }
    
    // Generate placeholders for missing images
    generatePlaceholders();
    
    // ------- Initialize ------- //
    function initializePage() {
        // If any elements require direct interaction with the window manager,
        // initialize them here when we know window manager is ready
        if (typeof window.windowManager !== 'undefined') {
            // Add any additional initialization that depends on window manager
        }
    }
    
    // Initialize when window manager is ready
    if (typeof window.windowManager !== 'undefined') {
        initializePage();
    } else {
        // Wait for window manager to initialize
        window.addEventListener('load', () => {
            if (typeof window.windowManager !== 'undefined') {
                initializePage();
            }
        });
    }
});
