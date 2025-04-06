/**
 * Main JavaScript file for ProfileCraft template-3
 * Handles navigation, animations, cursor effects, scroll effects, and other interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.fullscreen-nav');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.querySelector('.scroll-progress');
    const cursorFollow = document.querySelector('.cursor-follow');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const resumeTabs = document.querySelectorAll('.resume-tab');
    const resumePanels = document.querySelectorAll('.resume-panel');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-btn.prev');
    const nextButton = document.querySelector('.testimonial-btn.next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const backToTopButton = document.querySelector('.back-to-top button');
    
    // Find all elements that should fade in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Mark all sections as fade-in elements if not already
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
        }
    });

    // ------- Create Placeholder Assets ------- //
    createPlaceholderAssets();
    
    // ------- Navigation Toggle ------- //
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }

    function closeNav() {
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    }

    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }

    // Close navigation when clicking outside
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                closeNav();
            }
        });
    }

    // Navigation links smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            closeNav();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // ------- Custom Cursor ------- //
    if (window.innerWidth > 991 && cursorFollow) {
        cursorFollow.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursorFollow.style.left = e.clientX + 'px';
            cursorFollow.style.top = e.clientY + 'px';
        });
        
        // Expand cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-pill, input, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollow.style.width = '50px';
                cursorFollow.style.height = '50px';
                cursorFollow.style.backgroundColor = 'rgba(238, 108, 77, 0.2)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorFollow.style.width = '30px';
                cursorFollow.style.height = '30px';
                cursorFollow.style.backgroundColor = 'rgba(238, 108, 77, 0.3)';
            });
        });
    }

    // ------- Scroll Progress ------- //
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercentage + '%';
        }
        
        // Show back to top button when scrolled down
        if (backToTopButton) {
            if (scrollTop > 500) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.visibility = 'visible';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.visibility = 'hidden';
            }
        }
        
        // Fade in elements on scroll
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    });

    // ------- Back to Top ------- //
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ------- Skills Tabs ------- //
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the data-tab attribute
            const tabId = button.getAttribute('data-tab');
            
            // Hide all tab panels
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Show the selected tab panel
            const targetPanel = document.getElementById(tabId + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ------- Project Filtering ------- //
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the filter category
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ------- Resume Tabs ------- //
    resumeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            resumeTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the data-tab attribute
            const tabId = tab.getAttribute('data-tab');
            
            // Hide all resume panels
            resumePanels.forEach(panel => panel.classList.remove('active'));
            
            // Show the selected resume panel
            const targetPanel = document.getElementById(tabId + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ------- Testimonial Slider ------- //
    // Only set up the slider if elements exist
    if (testimonialSlides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        
        // Hide all testimonials except the first one
        testimonialSlides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
        
        // Create dots for testimonials
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Previous button functionality
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = testimonialSlides.length - 1;
                }
                goToSlide(currentSlide);
            });
        }
        
        // Next button functionality
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentSlide++;
                if (currentSlide >= testimonialSlides.length) {
                    currentSlide = 0;
                }
                goToSlide(currentSlide);
            });
        }
        
        // Function to go to a specific slide
        function goToSlide(slideIndex) {
            testimonialSlides.forEach((slide, index) => {
                slide.style.display = 'none';
                const dots = dotsContainer.querySelectorAll('.dot');
                if (dots && dots.length > 0) {
                    dots[index].classList.remove('active');
                }
            });
            
            testimonialSlides[slideIndex].style.display = 'block';
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots && dots.length > 0) {
                dots[slideIndex].classList.add('active');
            }
            currentSlide = slideIndex;
        }
        
        // Auto slide testimonials every 5 seconds
        let testimonialInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= testimonialSlides.length) {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        }, 5000);
        
        // Pause auto slide on hover
        const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
        if (testimonialsWrapper) {
            testimonialsWrapper.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            // Resume auto slide when mouse leaves
            testimonialsWrapper.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(() => {
                    currentSlide++;
                    if (currentSlide >= testimonialSlides.length) {
                        currentSlide = 0;
                    }
                    goToSlide(currentSlide);
                }, 5000);
            });
        }
    }

    // ------- Horizontal Scroll for Projects ------- //
    const projectsCarousel = document.querySelector('.projects-carousel');
    
    if (projectsCarousel && window.innerWidth > 991) {
        projectsCarousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            projectsCarousel.scrollLeft += e.deltaY;
        });
    }

    // ------- Type Animation Effect ------- //
    function typeAnimation(element, text, speed) {
        if (!element) return;
        
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
            }
        }
        
        type();
    }
    
    const nameElement = document.querySelector('.hero-title .name');
    const professionElement = document.querySelector('.hero-title .profession');
    
    if (nameElement && professionElement) {
        const nameText = nameElement.textContent;
        const professionText = professionElement.textContent;
        
        window.addEventListener('load', () => {
            typeAnimation(nameElement, nameText, 100);
            setTimeout(() => {
                typeAnimation(professionElement, professionText, 100);
            }, nameText.length * 100 + 500);
        });
    }

    // ------- Initialize All Items ------- //
    function initializeElements() {
        // Make first tab section visible
        if (tabPanels.length > 0) {
            tabPanels[0].classList.add('active');
        }
        
        // Make first resume panel visible
        if (resumePanels.length > 0) {
            resumePanels[0].classList.add('active');
        }
        
        // Add animation class to hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('visible');
        }
    }
    
    // Call initialization
    initializeElements();

    // ------- Placeholder Assets Creation ------- //
    function createPlaceholderAssets() {
        console.log('Placeholder assets would be created here in a real environment.');
        
        // List of placeholder images needed
        const placeholderImages = [
            'profile-placeholder.jpg',
            'about-placeholder-1.jpg',
            'about-placeholder-2.jpg',
            'project-placeholder-1.jpg',
            'project-placeholder-2.jpg',
            'project-placeholder-3.jpg',
            'project-placeholder-4.jpg',
            'skill-design.jpg',
            'skill-frontend.jpg',
            'skill-backend.jpg',
            'skill-tools.jpg',
            'testimonial-placeholder-1.jpg',
            'testimonial-placeholder-2.jpg',
            'testimonial-placeholder-3.jpg'
        ];
        
        // Log the placeholder images that would be created
        placeholderImages.forEach(image => {
            console.log(`Creating placeholder image: assets/${image}`);
        });
    }
});
