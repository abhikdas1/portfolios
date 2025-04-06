/**
 * Main JavaScript file for Windows 10 Portfolio Template 7
 * Handles animations, interactions, and content-specific functionalities
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Stats Counter Animation ------- //
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
    
    // Animate when welcome window is opened
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
    
    if (filterButtons.length && projectItems.length) {
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
    }
    
    // ------- Skill Bar Animation ------- //
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
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
    
    // ------- Action Buttons ------- //
    const exploreProjectsBtn = document.getElementById('explore-projects');
    const contactMeBtn = document.getElementById('contact-me');
    
    if (exploreProjectsBtn) {
        exploreProjectsBtn.addEventListener('click', () => {
            window.win10Manager.openWindow('projects');
        });
    }
    
    if (contactMeBtn) {
        contactMeBtn.addEventListener('click', () => {
            window.win10Manager.openWindow('contact');
        });
    }
    
    // ------- Download CV Functionality ------- //
    const downloadCvBtn = document.getElementById('download-cv');
    
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show notification instead of actual download for demo
            window.win10Manager.showNotification(
                'Resume Download', 
                'Your resume is being prepared for download...', 
                'info'
            );
            
            // Simulate download after delay
            setTimeout(() => {
                window.win10Manager.showNotification(
                    'Download Complete', 
                    'Resume has been downloaded successfully!', 
                    'success'
                );
            }, 2000);
        });
    }
    
    // ------- Asset Loading Management ------- //
    function generatePlaceholders() {
        // Check profile image
        const profileImages = document.querySelectorAll('.profile-image img, .profile-img img');
        
        profileImages.forEach(img => {
            img.onerror = function() {
                // Create canvas for profile placeholder
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                
                // Fill gradient background
                const gradient = ctx.createLinearGradient(0, 0, 200, 200);
                gradient.addColorStop(0, '#0078D7');
                gradient.addColorStop(1, '#0099FF');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 200, 200);
                
                // Add user silhouette
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                // Head
                ctx.arc(100, 70, 40, 0, Math.PI * 2);
                ctx.fill();
                // Body
                ctx.beginPath();
                ctx.ellipse(100, 180, 60, 70, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Set the placeholder
                this.src = canvas.toDataURL('image/png');
            };
            
            // Force error if src is missing or contains placeholder
            if (!img.src || img.src.includes('placeholder')) {
                img.src = 'missing-image-to-trigger-error';
            }
        });
        
        // Check desktop background
        const desktopBg = document.querySelector('.desktop-bg');
        if (desktopBg && getComputedStyle(desktopBg).backgroundImage === 'none') {
            // Create a gradient background as fallback
            desktopBg.style.backgroundImage = 'linear-gradient(to right bottom, #0078D7, #005A9E)';
        }
        
        // Check project images
        document.querySelectorAll('.project-img img').forEach((img, index) => {
            img.onerror = function() {
                // Create canvas for project placeholder
                const canvas = document.createElement('canvas');
                canvas.width = 350;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                
                // Different color for each project
                const colors = [
                    '#0078D7', '#107C10', '#5C2D91', '#D83B01'
                ];
                const color = colors[index % colors.length];
                
                // Fill background
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 350, 200);
                
                // Add pattern
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(0, 0, 175, 100);
                ctx.fillRect(175, 100, 175, 100);
                
                // Add text
                ctx.font = 'bold 24px "Segoe UI"';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Project ${index + 1}`, 175, 100);
                
                // Set the placeholder
                this.src = canvas.toDataURL('image/jpeg');
            };
            
            // Force error if src is missing or contains placeholder
            if (!img.src || img.src.includes('placeholder')) {
                img.src = 'missing-image-to-trigger-error';
            }
        });
    }
    
    // Generate placeholders for missing images
    generatePlaceholders();
});
