/**
 * Main JavaScript file for ProfileCraft template-2
 * Handles navigation, animations, dark/light theme toggle, projects filtering,
 * testimonials, scroll effects, and other interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const body = document.body;
    const sideNav = document.querySelector('.side-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const sections = document.querySelectorAll('section');
    const heroName = document.querySelector('.hero-name');
    
    // ------- Create UI Elements ------- //
    
    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    document.body.appendChild(menuOverlay);
    
    // Create close menu button
    const closeMenu = document.createElement('div');
    closeMenu.classList.add('close-menu');
    closeMenu.innerHTML = '<i class="fas fa-times"></i>';
    sideNav.appendChild(closeMenu);
    
    // Create back to top button
    const backToTop = document.createElement('div');
    backToTop.classList.add('back-to-top');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    // Create page transition element
    const pageTransition = document.createElement('div');
    pageTransition.classList.add('page-transition');
    document.body.appendChild(pageTransition);
    
    // ------- Create Placeholder Assets ------- //
    createPlaceholderAssets();
    
    // ------- Theme Toggle ------- //
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Update icon
        if (body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // ------- Mobile Menu Toggle ------- //
    menuToggle.addEventListener('click', function() {
        sideNav.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeNavMenu() {
        sideNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeMenu.addEventListener('click', closeNavMenu);
    menuOverlay.addEventListener('click', closeNavMenu);
    
    // ------- Smooth Scrolling ------- //
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu if open
            closeNavMenu();
            
            // Smooth scroll to section
            if (this.hash !== '') {
                e.preventDefault();
                const hash = this.hash;
                
                // Simulate page transition
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    const targetSection = document.querySelector(hash);
                    const headerOffset = 70; // Account for mobile header
                    const targetPosition = targetSection.offsetTop - headerOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, hash);
                    
                    // Update active link
                    updateActiveNavLink();
                    
                    // Hide transition
                    setTimeout(() => {
                        pageTransition.classList.remove('active');
                    }, 300);
                }, 300);
            }
        });
    });
    
    // ------- Scroll Events ------- //
    window.addEventListener('scroll', function() {
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Back to top button click event
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ------- Projects Filter ------- //
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                // Add animation to visible items
                setTimeout(() => {
                    if (card.style.display === 'block') {
                        card.classList.add('animate-fadeIn');
                    } else {
                        card.classList.remove('animate-fadeIn');
                    }
                }, 100);
            });
        });
    });
    
    // ------- Testimonials Slider ------- //
    let currentSlide = 0;
    const mobileView = window.matchMedia('(max-width: 767px)').matches;
    
    // Hide all testimonials except the first one in mobile view
    if (mobileView) {
        testimonialCards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
            }
        });
        
        // Create dots for testimonials
        testimonialCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Previous button functionality
        prevBtn.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = testimonialCards.length - 1;
            }
            goToSlide(currentSlide);
        });
        
        // Next button functionality
        nextBtn.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide >= testimonialCards.length) {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        });
        
        // Function to go to a specific slide
        function goToSlide(slideIndex) {
            testimonialCards.forEach((card, index) => {
                card.style.display = 'none';
                dotsContainer.children[index].classList.remove('active');
            });
            
            testimonialCards[slideIndex].style.display = 'block';
            dotsContainer.children[slideIndex].classList.add('active');
            testimonialCards[slideIndex].classList.add('animate-fadeIn');
            currentSlide = slideIndex;
        }
        
        // Auto slide testimonials every 5 seconds
        let testimonialInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= testimonialCards.length) {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        }, 5000);
    }
    
    // ------- Typing Effect for Hero Name ------- //
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        heroName.classList.add('typing');
        
        let i = 0;
        const typingSpeed = 100; // milliseconds
        
        function typeWriter() {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                heroName.classList.remove('typing');
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // ------- Scroll Animations ------- //
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observe all sections
    sections.forEach(section => {
        section.style.opacity = 0;
        observer.observe(section);
    });
    
    // ------- Helper Functions ------- //
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Create placeholder assets function
    function createPlaceholderAssets() {
        // This function is simulating placeholder images creation
        // In a real environment, you would check if the files exist and create them if they don't
        console.log('Placeholder assets would be created here in a real environment.');
        
        // List of placeholder images needed
        const placeholderImages = [
            'profile-placeholder.jpg',
            'about-placeholder.jpg',
            'project-placeholder-1.jpg',
            'project-placeholder-2.jpg',
            'project-placeholder-3.jpg',
            'testimonial-placeholder-1.jpg',
            'testimonial-placeholder-2.jpg',
            'testimonial-placeholder-3.jpg'
        ];
        
        // Log the placeholder images that would be created
        placeholderImages.forEach(image => {
            console.log(`Creating placeholder image: assets/${image}`);
        });
    }
    
    // ------- Initialize the page ------- //
    function init() {
        // Set first section to be visible initially
        if (sections.length > 0) {
            sections[0].style.opacity = 1;
            sections[0].classList.add('animate-fadeIn');
        }
        
        // Set first nav link as active initially
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
        
        // Update active nav link on load
        updateActiveNavLink();
    }
    
    // Initialize
    init();
});
