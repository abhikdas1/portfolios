/**
 * Main JavaScript file for ProfileCraft template-4
 * Handles navigation, animations, particle effects, theme switching and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Add preload class to prevent animations on page load
    document.body.classList.add('preload');
    
    // ------- DOM Elements ------- //
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const sidePanel = document.querySelector('.side-panel');
    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const skillProgressBars = document.querySelectorAll('.skill-progress-fill');
    const counterItems = document.querySelectorAll('.counter-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    const paginationContainer = document.querySelector('.swiper-pagination');
    
    // Create menu toggle button for mobile
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);

    // Create close button for mobile menu
    const closeMenuBtn = document.createElement('button');
    closeMenuBtn.classList.add('close-menu-btn');
    closeMenuBtn.setAttribute('aria-label', 'Close menu');
    closeMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    sidePanel.appendChild(closeMenuBtn);
    
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.classList.add('loading-screen');
    loadingScreen.innerHTML = '<div class="loading-animation"></div>';
    document.body.appendChild(loadingScreen);
    
    // Remove the preload class after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('preload');
            loadingScreen.classList.add('hidden');
            
            // Initialize animations now that the page is loaded
            initAnimations();
        }, 500);
    });

    // ------- Theme Toggle ------- //
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Save theme preference to localStorage
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
    }
    
    // ------- Mobile Menu Toggle ------- //
    menuToggle.addEventListener('click', function() {
        sidePanel.classList.add('active');
        body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        sidePanel.classList.remove('active');
        body.style.overflow = '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (sidePanel.classList.contains('active') && 
            !sidePanel.contains(event.target) && 
            event.target !== menuToggle) {
            sidePanel.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // ------- Smooth Scrolling ------- //
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (!element) return;
        
        window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }
    
    // Nav link click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (sidePanel.classList.contains('active')) {
                sidePanel.classList.remove('active');
                body.style.overflow = '';
            }
            
            const target = this.getAttribute('href');
            smoothScroll(target);
            
            // Update URL without page jump
            history.pushState(null, null, target);
        });
    });
    
    // Mobile nav link click handler
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = this.getAttribute('href');
            smoothScroll(target);
            
            // Update URL without page jump
            history.pushState(null, null, target);
            
            // Update active state
            mobileNavLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ------- Scroll Spy ------- //
    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update side panel navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update mobile navigation
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Activate current section
                sections.forEach(s => s.classList.remove('active'));
                section.classList.add('active');
            }
        });
    }
    
    // Update active section on scroll
    window.addEventListener('scroll', function() {
        updateActiveSection();
    });
    
    // ------- Particle.js Initialization ------- //
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#6366f1' // primary color
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.2,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.4
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // ------- Typing Effect for Hero Section ------- //
    function rotateTexts() {
        const element = document.querySelector('.txt-rotate');
        if (!element) return;
        
        const period = element.getAttribute('data-period');
        const toRotate = JSON.parse(element.getAttribute('data-rotate'));
        let loopNum = 0;
        let txt = '';
        let isDeleting = false;
        
        function tick() {
            const i = loopNum % toRotate.length;
            const fullTxt = toRotate[i];
            
            if (isDeleting) {
                txt = fullTxt.substring(0, txt.length - 1);
            } else {
                txt = fullTxt.substring(0, txt.length + 1);
            }
            
            element.textContent = txt;
            
            let delta = 200 - Math.random() * 100;
            
            if (isDeleting) {
                delta /= 2;
            }
            
            if (!isDeleting && txt === fullTxt) {
                delta = parseInt(period);
                isDeleting = true;
            } else if (isDeleting && txt === '') {
                isDeleting = false;
                loopNum++;
                delta = 500;
            }
            
            setTimeout(() => {
                tick();
            }, delta);
        }
        
        tick();
    }
    
    // ------- Skill Progress Animation ------- //
    function animateSkillBars() {
        skillProgressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    }
    
    // ------- Counter Animation ------- //
    function animateCounters() {
        counterItems.forEach(item => {
            const target = parseInt(item.getAttribute('data-count'));
            const counterElement = item.querySelector('.counter-number');
            let current = 0;
            const increment = target / 100;
            const duration = 2000; // 2 seconds
            const step = Math.ceil(duration / (target / increment));
            
            const timer = setInterval(() => {
                current += increment;
                counterElement.textContent = Math.floor(current);
                
                if (current >= target) {
                    clearInterval(timer);
                    counterElement.textContent = target;
                }
            }, step);
        });
    }
    
    // ------- Portfolio Filter ------- //
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ------- Experience/Education Tabs ------- //
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId + '-pane') {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // ------- Testimonial Slider ------- //
    function initTestimonialSlider() {
        if (!testimonialItems.length) return;
        
        let currentSlide = 0;
        
        // Hide all testimonials except the first one
        testimonialItems.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
        
        // Create pagination dots
        if (paginationContainer) {
            testimonialItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('swiper-pagination-bullet');
                if (index === 0) {
                    dot.classList.add('swiper-pagination-bullet-active');
                }
                
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                paginationContainer.appendChild(dot);
            });
        }
        
        // Previous button handler
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = testimonialItems.length - 1;
                }
                goToSlide(currentSlide);
            });
        }
        
        // Next button handler
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide++;
                if (currentSlide >= testimonialItems.length) {
                    currentSlide = 0;
                }
                goToSlide(currentSlide);
            });
        }
        
        // Function to show specific slide
        function goToSlide(index) {
            testimonialItems.forEach((slide, i) => {
                slide.style.display = 'none';
                
                if (paginationContainer) {
                    paginationContainer.children[i].classList.remove('swiper-pagination-bullet-active');
                }
            });
            
            testimonialItems[index].style.display = 'block';
            
            if (paginationContainer) {
                paginationContainer.children[index].classList.add('swiper-pagination-bullet-active');
            }
            
            currentSlide = index;
        }
        
        // Auto slide
        let slideInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= testimonialItems.length) {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        }, 5000);
        
        // Pause on hover
        const swiperContainer = document.querySelector('.swiper-container');
        if (swiperContainer) {
            swiperContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            swiperContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    currentSlide++;
                    if (currentSlide >= testimonialItems.length) {
                        currentSlide = 0;
                    }
                    goToSlide(currentSlide);
                }, 5000);
            });
        }
    }
    
    // ------- Google Map Initialization ------- //
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        // Check if Google Maps API is loaded
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            const map = new google.maps.Map(mapElement, {
                center: { lat: 40.7128, lng: -74.0060 }, // New York by default
                zoom: 12,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [{"weight": "2.00"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#9c9c9c"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [{"visibility": "on"}]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{"color": "#f2f2f2"}]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#ffffff"}]
                    },
                    {
                        "featureType": "landscape.man_made",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#ffffff"}]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{"visibility": "off"}]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [{"saturation": -100}, {"lightness": 45}]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#eeeeee"}]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#7b7b7b"}]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"color": "#ffffff"}]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{"visibility": "simplified"}]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{"visibility": "off"}]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{"visibility": "off"}]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#c8d7d4"}]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#070707"}]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"color": "#ffffff"}]
                    }
                ]
            });
            
            // Add a marker
            new google.maps.Marker({
                position: { lat: 40.7128, lng: -74.0060 },
                map: map,
                title: 'My Location'
            });
        }
    }
    
    // ------- Scroll Reveal Animation ------- //
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-top, .reveal-bottom');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1
        });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ------- Initialize All Animations ------- //
    function initAnimations() {
        // Update active section on page load
        updateActiveSection();
        
        // Initialize typing effect
        rotateTexts();
        
        // Activate first section
        if (sections.length) {
            sections[0].classList.add('active');
        }
        
        // Initialize testimonial slider
        initTestimonialSlider();
        
        // Initialize Google Map
        initMap();
        
        // Initialize scroll reveal animations
        initScrollReveal();
        
        // Animate skill bars when skills section becomes visible
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(skillsSection);
        }
        
        // Animate counters when about section becomes visible
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(aboutSection);
        }
    }
});
