/**
 * Main JavaScript for Template 9 - Glassmorphism Theme
 * Handles animations, interactions, and UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const backToTopButton = document.querySelector('.back-to-top');
    const glassNav = document.querySelector('.glass-nav');
    const skillProgress = document.querySelectorAll('.skill-progress');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card');
    const sections = document.querySelectorAll('section');
    
    // Initialize Particles.js
    initParticles();
    
    // Initialize Typed.js effect for profession text
    initTypedText();
    
    // Navigation toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('open');
        mainNav.classList.toggle('show');
    });
    
    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('open');
            mainNav.classList.remove('show');
            
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Activate nav links based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Back to top button visibility
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
        
        // Change nav style on scroll
        if (window.pageYOffset > 50) {
            glassNav.classList.add('scrolled');
        } else {
            glassNav.classList.remove('scrolled');
        }
        
        // Animate skill bars when in viewport
        animateSkillBars();
        
        // Reveal animations for elements when scrolled into view
        revealElements();
    });
    
    // Projects filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Set active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Button ripple effect
    document.addEventListener('click', function(e) {
        if (e.target.closest('.glass-btn')) {
            const button = e.target.closest('.glass-btn');
            const ripple = document.createElement('span');
            
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            ripple.addEventListener('animationend', function() {
                ripple.remove();
            });
        }
    });
    
    // Image tilt effect
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', tiltEffect);
        element.addEventListener('mouseleave', resetTilt);
    });
    
    function tiltEffect(e) {
        const element = this;
        const elementRect = element.getBoundingClientRect();
        const elementWidth = elementRect.width;
        const elementHeight = elementRect.height;
        const mouseX = e.clientX - elementRect.left;
        const mouseY = e.clientY - elementRect.top;
        
        const rotateX = 20 * ((mouseY - elementHeight / 2) / elementHeight);
        const rotateY = -20 * ((mouseX - elementWidth / 2) / elementWidth);
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    
    // Initialize particles.js
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.2,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.1,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 0.5
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 4,
                            "duration": 2,
                            "opacity": 0.8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Initialize typed text effect
    function initTypedText() {
        const typed = document.querySelector('.typed-text');
        if (!typed) return;
        
        const strings = ['Frontend Developer', 'UI/UX Designer', 'Web Developer', 'Creative Thinker'];
        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentString = strings[stringIndex];
            
            if (isDeleting) {
                // Deleting text
                typed.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Typing text
                typed.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            // Check if word is complete
            if (!isDeleting && charIndex === currentString.length) {
                // Pause at end of word
                typingSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Move to next word
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing effect
        setTimeout(type, 1000);
    }
    
    // Animate skill bars when in viewport
    function animateSkillBars() {
        skillProgress.forEach(progress => {
            const progressValue = progress.getAttribute('data-progress');
            const elementTop = progress.getBoundingClientRect().top;
            
            if (elementTop < window.innerHeight - 100) {
                progress.style.setProperty('--progress-width', `${progressValue}%`);
            }
        });
    }
    
    // Reveal elements on scroll
    function revealElements() {
        const revealElements = document.querySelectorAll('.reveal');
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (elementTop < window.innerHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    // Add reveal class to elements
    function setupRevealAnimations() {
        document.querySelectorAll('.glass-card, .section-title, .project-card, .skill-item, .contact-item').forEach(element => {
            if (!element.classList.contains('reveal')) {
                element.classList.add('reveal');
            }
        });
    }
    
    // Call setup functions
    setupRevealAnimations();
    
    // Trigger initial animations
    setTimeout(() => {
        animateSkillBars();
        revealElements();
    }, 500);
});
