/**
 * Main JavaScript file for ProfileCraft portfolio template
 * Handles navigation, animations, projects filtering, testimonials slider,
 * scroll effects, and other interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const sections = document.querySelectorAll('section');
    
    // ------- Create Overlay for Mobile Menu ------- //
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    // ------- Create Close Button for Mobile Menu ------- //
    const closeMenu = document.createElement('div');
    closeMenu.classList.add('close-menu');
    closeMenu.innerHTML = '<i class="fas fa-times"></i>';
    mainNav.appendChild(closeMenu);
    
    // ------- Create Back to Top Button ------- //
    const backToTop = document.createElement('div');
    backToTop.classList.add('back-to-top');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    // ------- Create Placeholder Assets ------- //
    createPlaceholderAssets();
    
    // ------- Navigation & Menu Toggle ------- //
    menuToggle.addEventListener('click', function() {
        mainNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeNavMenu() {
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeMenu.addEventListener('click', closeNavMenu);
    overlay.addEventListener('click', closeNavMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu when a link is clicked
            closeNavMenu();
            
            // Smooth scroll to section
            if (this.hash !== '') {
                e.preventDefault();
                const hash = this.hash;
                const targetSection = document.querySelector(hash);
                
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, hash);
            }
        });
    });
    
    // ------- Sticky Header ------- //
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            backToTop.classList.add('active');
        } else {
            header.classList.remove('sticky');
            backToTop.classList.remove('active');
        }
        
        // Activate nav link based on scroll position
        updateActiveNavLink();
    });
    
    // ------- Back to Top Button ------- //
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
            
            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
                
                // Add animation to visible items
                setTimeout(() => {
                    if (item.style.display === 'block') {
                        item.classList.add('animate-fadeIn');
                    } else {
                        item.classList.remove('animate-fadeIn');
                    }
                }, 100);
            });
        });
    });
    
    // ------- Testimonials Slider ------- //
    let currentSlide = 0;
    
    // Hide all testimonials except the first one
    testimonialItems.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
        }
    });
    
    // Create dots for testimonials
    testimonialItems.forEach((_, index) => {
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
            currentSlide = testimonialItems.length - 1;
        }
        goToSlide(currentSlide);
    });
    
    // Next button functionality
    nextBtn.addEventListener('click', () => {
        currentSlide++;
        if (currentSlide >= testimonialItems.length) {
            currentSlide = 0;
        }
        goToSlide(currentSlide);
    });
    
    // Auto slide testimonials every 5 seconds
    let testimonialInterval = setInterval(() => {
        currentSlide++;
        if (currentSlide >= testimonialItems.length) {
            currentSlide = 0;
        }
        goToSlide(currentSlide);
    }, 5000);
    
    // Pause auto slide on hover
    testimonialsSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    // Resume auto slide when mouse leaves
    testimonialsSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= testimonialItems.length) {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        }, 5000);
    });
    
    // Function to go to a specific slide
    function goToSlide(slideIndex) {
        testimonialItems.forEach((item, index) => {
            item.style.display = 'none';
            dotsContainer.children[index].classList.remove('active');
        });
        
        testimonialItems[slideIndex].style.display = 'flex';
        dotsContainer.children[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    }
    
    // ------- Add Animation to Sections on Scroll ------- //
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        // Initial state - hidden
        section.style.opacity = '0';
        observer.observe(section);
    });
    
    // ------- Update Active Nav Link on Scroll ------- //
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ------- Create Placeholder Assets ------- //
    function createPlaceholderAssets() {
        // Create the assets directory if it doesn't exist
        const assetsDir = 'assets';
        
        // This function is simulating placeholder images creation
        // In a real environment, you would check if the files exist and create them if they don't
        console.log('Placeholder assets would be created here in a real environment.');
        
        // List of placeholder images needed
        const placeholderImages = [
            'profile-placeholder.jpg',
            'project-placeholder-1.jpg',
            'project-placeholder-2.jpg',
            'project-placeholder-3.jpg',
            'testimonial-placeholder-1.jpg',
            'testimonial-placeholder-2.jpg',
            'testimonial-placeholder-3.jpg'
        ];
        
        // Log the placeholder images that would be created
        placeholderImages.forEach(image => {
            console.log(`Creating placeholder image: ${assetsDir}/${image}`);
        });
        
        // In a real implementation, you might create these assets using Canvas API
        // or fetch them from a placeholder service
    }
    
    // ------- Initialize the page ------- //
    function init() {
        // Set first section to be visible initially
        if (sections.length > 0) {
            sections[0].style.opacity = '1';
            sections[0].classList.add('animate-fadeIn');
        }
        
        // Set first nav link as active initially
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
        
        // Update active nav link on load
        updateActiveNavLink();
    }
    
    // Initialize the page
    init();
});
