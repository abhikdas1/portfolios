/**
 * Main JavaScript file for ProfileCraft template-5
 * Handles navigation, scroll effects, filter functionality, and other interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const body = document.body;
    const navToggle = document.querySelector('.cyber-nav-toggle');
    const navLinks = document.querySelectorAll('.cyber-nav-links a');
    const navMenu = document.querySelector('.cyber-nav-links');
    const sections = document.querySelectorAll('.cyber-section');
    const projectFilterButtons = document.querySelectorAll('.cyber-filter-btn');
    const projectItems = document.querySelectorAll('.cyber-project');
    const tabButtons = document.querySelectorAll('.cyber-tab-btn');
    const tabPanes = document.querySelectorAll('.cyber-tab-pane');
    
    // ------- Add Loading Animation ------- //
    const loadingScreen = document.createElement('div');
    loadingScreen.classList.add('cyber-loading-screen');
    loadingScreen.innerHTML = `
        <div class="loading-container">
            <div class="loading-text">SYSTEM INITIALIZING</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
            <div class="loading-percentage">0%</div>
        </div>
    `;
    document.body.appendChild(loadingScreen);
    
    // Add loading screen styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .cyber-loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--cyber-bg-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .loading-container {
            text-align: center;
        }
        
        .loading-text {
            font-family: var(--font-primary);
            color: var(--neon-primary);
            font-size: 2.4rem;
            margin-bottom: 2rem;
            text-shadow: 0 0 10px var(--neon-primary);
        }
        
        .loading-bar {
            width: 300px;
            height: 6px;
            background-color: var(--cyber-bg-light);
            border: 1px solid var(--cyber-border);
            margin: 0 auto 1rem;
            position: relative;
            overflow: hidden;
        }
        
        .loading-progress {
            width: 0%;
            height: 100%;
            background-color: var(--neon-primary);
            box-shadow: 0 0 10px var(--neon-primary);
            transition: width 0.5s ease;
        }
        
        .loading-percentage {
            font-family: var(--font-secondary);
            color: var(--neon-primary);
            font-size: 1.6rem;
        }
    `;
    document.head.appendChild(loadingStyles);
    
    // Simulate loading progress
    simulateLoading();
    
    function simulateLoading() {
        const progressBar = document.querySelector('.loading-progress');
        const percentage = document.querySelector('.loading-percentage');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                hideLoadingScreen();
            } else {
                width += Math.floor(Math.random() * 10) + 1;
                if (width > 100) width = 100;
                progressBar.style.width = width + '%';
                percentage.textContent = width + '%';
            }
        }, 150);
    }
    
    function hideLoadingScreen() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 500);
    }
    
    // ------- Navigation Toggle ------- //
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Change toggle icon animation
            if (navToggle.classList.contains('active')) {
                navToggle.innerHTML = '<span></span><span></span><span></span>';
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                navToggle.innerHTML = '<span></span><span></span><span></span>';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close navigation when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ------- Smooth Scrolling ------- //
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add cyberpunk glitch transition effect
                const transitionEffect = document.createElement('div');
                transitionEffect.classList.add('cyber-transition');
                document.body.appendChild(transitionEffect);
                
                // Add transition styles
                const transitionStyles = document.createElement('style');
                transitionStyles.textContent = `
                    .cyber-transition {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: var(--neon-primary);
                        z-index: 9999;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s ease;
                    }
                    
                    .cyber-transition.active {
                        opacity: 0.2;
                    }
                `;
                document.head.appendChild(transitionStyles);
                
                // Activate transition effect
                setTimeout(() => {
                    transitionEffect.classList.add('active');
                    
                    setTimeout(() => {
                        // Scroll to target
                        window.scrollTo({
                            top: targetElement.offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Update URL
                        history.pushState(null, null, targetId);
                        
                        // Remove transition effect
                        setTimeout(() => {
                            transitionEffect.classList.remove('active');
                            
                            setTimeout(() => {
                                transitionEffect.remove();
                                transitionStyles.remove();
                            }, 300);
                        }, 300);
                    }, 300);
                }, 10);
            }
        });
    });
    
    // ------- Active Link on Scroll ------- //
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // ------- Project Filtering ------- //
    if (projectFilterButtons.length && projectItems.length) {
        projectFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                projectFilterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        // Show with a glitch animation
                        item.style.display = 'block';
                        item.classList.add('cyber-fade-in');
                        setTimeout(() => {
                            item.classList.remove('cyber-fade-in');
                        }, 500);
                    } else {
                        // Hide
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Add fade-in animation style
        const fadeInStyle = document.createElement('style');
        fadeInStyle.textContent = `
            @keyframes cyber-fade-in {
                0% {
                    opacity: 0;
                    transform: scale(0.95);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1.02);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .cyber-fade-in {
                animation: cyber-fade-in 0.5s ease forwards;
            }
        `;
        document.head.appendChild(fadeInStyle);
    }
    
    // ------- Tabs Functionality ------- //
    if (tabButtons.length && tabPanes.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get tab id
                const tabId = this.getAttribute('data-tab');
                
                // Hide all panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Show selected pane
                const selectedPane = document.getElementById(tabId + '-pane');
                if (selectedPane) {
                    selectedPane.classList.add('active');
                    
                    // Add glitch animation
                    selectedPane.classList.add('tab-glitch');
                    setTimeout(() => {
                        selectedPane.classList.remove('tab-glitch');
                    }, 500);
                }
            });
        });
        
        // Add tab glitch animation style
        const tabGlitchStyle = document.createElement('style');
        tabGlitchStyle.textContent = `
            @keyframes tab-glitch {
                0% {
                    opacity: 0.7;
                    transform: translateX(-10px);
                }
                20% {
                    opacity: 0.8;
                    transform: translateX(5px);
                }
                40% {
                    opacity: 0.9;
                    transform: translateX(-5px);
                }
                60% {
                    opacity: 1;
                    transform: translateX(2px);
                }
                80% {
                    opacity: 1;
                    transform: translateX(-2px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .tab-glitch {
                animation: tab-glitch 0.5s ease forwards;
            }
        `;
        document.head.appendChild(tabGlitchStyle);
    }
    
    // ------- Scroll Animation ------- //
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Add scroll reveal animation
    const scrollRevealStyle = document.createElement('style');
    scrollRevealStyle.textContent = `
        .scroll-reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .scroll-reveal.scrolled {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(scrollRevealStyle);
    
    // Add scroll reveal class to various elements
    document.querySelectorAll('.cyber-section > .container > *:not(.section-header)').forEach(element => {
        element.classList.add('scroll-reveal');
    });
    
    // Listen for scroll
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check on load
    handleScrollAnimation();
    
    // ------- Back to Top Button ------- //
    const backToTopBtn = document.createElement('div');
    backToTopBtn.classList.add('cyber-back-to-top');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    // Add back to top styles
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .cyber-back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--cyber-bg-medium);
            border: 1px solid var(--neon-primary);
            color: var(--neon-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 99;
            box-shadow: 0 0 10px rgba(0, 255, 249, 0.3);
            pointer-events: none;
        }
        
        .cyber-back-to-top.active {
            opacity: 1;
            pointer-events: auto;
        }
        
        .cyber-back-to-top:hover {
            background-color: var(--neon-primary);
            color: var(--cyber-bg-dark);
        }
    `;
    document.head.appendChild(backToTopStyle);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    // Back to top click event
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ------- Initialize Elements ------- //
    function initializeElements() {
        // Mark all project cards as scroll reveal elements
        document.querySelectorAll('.cyber-project').forEach(card => {
            card.classList.add('scroll-reveal');
        });
        
        // Mark all skill categories as scroll reveal elements
        document.querySelectorAll('.cyber-skill-category, .cyber-tech-card').forEach(skill => {
            skill.classList.add('scroll-reveal');
        });
        
        // Add stagger delay to skill items
        document.querySelectorAll('.cyber-skill').forEach((skill, index) => {
            skill.style.transitionDelay = `${index * 0.1}s`;
            skill.classList.add('scroll-reveal');
        });
        
        // Add stagger delay to tech cards
        document.querySelectorAll('.cyber-tech-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Initialize first tab pane as active
        if (tabPanes.length) {
            tabPanes[0].classList.add('active');
        }
        
        // Initialize first tab button as active
        if (tabButtons.length) {
            tabButtons[0].classList.add('active');
        }
        
        // Initialize all filter button as active
        if (projectFilterButtons.length) {
            projectFilterButtons[0].classList.add('active');
        }
    }
    
    // Call initialization function
    initializeElements();
});
