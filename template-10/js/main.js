/**
 * Main JavaScript for Template 10 - Dark Knight Theme
 * Handles animations, interactions, and UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // DOM elements
    const preloader = document.querySelector('.preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const skillProgress = document.querySelectorAll('.skill-progress');
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');
    const revealTitles = document.querySelectorAll('.reveal-title');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const backToTop = document.querySelector('.back-to-top');
    
    // Initialize functions
    initPreloader();
    initScrollEvents();
    initNavigation();
    initFilterButtons();
    initRevealAnimations();
    
    /**
     * Initialize preloader
     */
    function initPreloader() {
        // Animate progress bar
        loadingProgress.style.width = '100%';
        
        // Simulate loading
        setTimeout(() => {
            preloader.classList.add('loaded');
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // When preloader is gone, trigger initial animations
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Trigger hero animations
                const heroElements = document.querySelector('.hero-section').querySelectorAll('.reveal-left, .reveal-right');
                heroElements.forEach(el => {
                    el.classList.add('active');
                });
                
                // Trigger reveal title animation
                const heroTitle = document.querySelector('.hero-section').querySelectorAll('.reveal-title');
                animateRevealTitles(heroTitle);
            }, 500);
        }, 2000);
    }
    
    /**
     * Initialize scroll events
     */
    function initScrollEvents() {
        // Throttle scroll function to improve performance
        let lastScrollTime = 0;
        const scrollThrottle = 100; // milliseconds
        
        window.addEventListener('scroll', function() {
            const now = Date.now();
            if (now - lastScrollTime >= scrollThrottle) {
                lastScrollTime = now;
                
                handleHeaderScroll();
                handleSectionVisibility();
                handleScrollToTop();
            }
        });
        
        // Initial check for sections in view
        setTimeout(handleSectionVisibility, 500);
    }
    
    /**
     * Handle header style on scroll
     */
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    /**
     * Handle section visibility and animations
     */
    function handleSectionVisibility() {
        const triggerPoint = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerPoint) {
                // Animate skill bars if in skills section
                if (section.id === 'skills') {
                    animateSkillBars();
                }
                
                // Animate reveal elements in this section
                const revealEls = section.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');
                revealEls.forEach(el => {
                    el.classList.add('active');
                });
                
                // Animate section titles
                const titleEls = section.querySelectorAll('.reveal-title');
                animateRevealTitles(titleEls);
            }
        });
    }
    
    /**
     * Handle back-to-top button visibility
     */
    function handleScrollToTop() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }
    
    /**
     * Initialize navigation interactions
     */
    function initNavigation() {
        // Hamburger toggle
        hamburger.addEventListener('click', function() {
            this.classList.toggle('open');
            mainNav.classList.toggle('show');
        });
        
        // Nav link click - close mobile menu
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('open');
                mainNav.classList.remove('show');
            });
        });
        
        // Nav link active state on scroll
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Initialize project filter buttons
     */
    function initFilterButtons() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(filterBtn => {
                    filterBtn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filter projects
                const filterValue = this.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        
                        // Add animation for appearing items
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        // Fade out first
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        // Then hide
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }
    
    /**
     * Initialize reveal animations
     */
    function initRevealAnimations() {
        // Set initial state of reveal elements
        revealElements.forEach(element => {
            element.style.opacity = '0';
            
            // Apply different initial transforms based on reveal type
            if (element.classList.contains('reveal-left')) {
                element.style.transform = 'translateX(-50px)';
            } else if (element.classList.contains('reveal-right')) {
                element.style.transform = 'translateX(50px)';
            } else if (element.classList.contains('reveal-bottom')) {
                element.style.transform = 'translateY(50px)';
            }
        });
    }
    
    /**
     * Animate reveal titles with wipe effect
     */
    function animateRevealTitles(titles) {
        titles.forEach(title => {
            if (!title.classList.contains('animated')) {
                const layer = title.querySelector('.reveal-layer');
                
                // Add the animated class to prevent re-animation
                title.classList.add('animated');
                
                // Check if the title has the reveal layer
                if (layer) {
                    layer.style.transform = 'translateX(-100%)';
                    
                    // Trigger animation
                    setTimeout(() => {
                        layer.style.transform = 'translateX(100%)';
                        
                        // Cleanup after animation
                        setTimeout(() => {
                            layer.style.display = 'none';
                        }, 1500);
                    }, 100);
                }
            }
        });
    }
    
    /**
     * Animate skill bars
     */
    function animateSkillBars() {
        skillProgress.forEach(progress => {
            if (!progress.classList.contains('animated')) {
                const percent = progress.getAttribute('data-percent') + '%';
                // Set CSS variable for use in animation
                progress.style.setProperty('--percent', percent);
                // Set width based on percentage
                setTimeout(() => {
                    progress.style.width = percent;
                    progress.classList.add('animated');
                }, 100);
            }
        });
    }
    
    /**
     * Add ripple effect to buttons
     */
    document.addEventListener('click', function(e) {
        const target = e.target;
        const isBtn = target.classList.contains('btn') || 
                      target.classList.contains('filter-btn');
        
        if (isBtn) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    /**
     * Initialize glitch effect for hero image
     */
    function initGlitchEffect() {
        const glitchImgs = document.querySelectorAll('.glitch-img');
        
        // Set random glitch intervals
        setInterval(() => {
            glitchImgs.forEach((img, index) => {
                // Apply random transforms
                const randomX = (Math.random() - 0.5) * 10;
                const randomY = (Math.random() - 0.5) * 10;
                
                // Different effect for each layer
                if (index === 0) {
                    img.style.transform = `translate(${randomX}px, ${randomY}px)`;
                    img.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(2)`;
                } else if (index === 1) {
                    img.style.transform = `translate(${-randomX}px, ${-randomY}px)`;
                    img.style.filter = `saturate(2) contrast(2)`;
                }
                
                // Reset after short time
                setTimeout(() => {
                    img.style.transform = 'translate(0)';
                    img.style.filter = '';
                }, 200);
            });
        }, 3000);
    }
    
    // Call glitch effect initialization
    initGlitchEffect();
});
