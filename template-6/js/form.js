/**
 * Form JavaScript file for Windows-themed Portfolio Template 6
 * Handles form validation, submission, and feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Contact Form Handling ------- //
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Add focus effects to form inputs
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // Add focus class on focus
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Remove focus class if empty
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value.trim() !== '') {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    /**
     * Validates the contact form
     * @returns {boolean} True if form is valid
     */
    function validateForm() {
        let isValid = true;
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Clear previous error states
        resetFormErrors();
        
        // Validate name
        if (!name || name.value.trim() === '') {
            showError(name, 'Please enter your name');
            isValid = false;
        }
        
        // Validate email
        if (!email || email.value.trim() === '') {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!message || message.value.trim() === '') {
            showError(message, 'Please enter your message');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Show error message for an input field
     * @param {HTMLElement} input The input element with error
     * @param {string} message Error message to display
     */
    function showError(input, message) {
        // Get the form group element
        const formGroup = input.parentElement;
        
        // Add error class
        formGroup.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        // Add error message after input
        formGroup.appendChild(errorElement);
        
        // Add error styling CSS if it doesn't exist yet
        if (!document.getElementById('form-error-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'form-error-styles';
            styleEl.textContent = `
                .form-group.error .form-control {
                    border-color: #e81123;
                }
                
                .form-error {
                    color: #e81123;
                    font-size: 12px;
                    margin-top: 5px;
                    animation: errorFadeIn 0.3s ease;
                }
                
                @keyframes errorFadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .form-group.error .form-control:focus {
                    box-shadow: 0 0 0 2px rgba(232, 17, 35, 0.2);
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
    
    /**
     * Reset all form error states
     */
    function resetFormErrors() {
        // Remove error classes
        const errorGroups = document.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
        });
        
        // Remove error messages
        const errorMessages = document.querySelectorAll('.form-error');
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    /**
     * Check if email is valid
     * @param {string} email Email to validate
     * @returns {boolean} True if email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Handle form submission
     */
    function submitForm() {
        // Create loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Change button to loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner-small"></div>
            Sending...
        `;
        
        // Add loading spinner styles if not already present
        if (!document.getElementById('loading-spinner-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'loading-spinner-styles';
            styleEl.textContent = `
                .loading-spinner-small {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Simulate form submission (in a real application, you would make an AJAX call to your server)
        setTimeout(() => {
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject')?.value || 'Contact Form Message',
                message: document.getElementById('message').value
            };
            
            // Log form data for demonstration purposes
            console.log('Form submitted with data:', formData);
            
            // Reset form
            contactForm.reset();
            
            // Reset focused classes
            document.querySelectorAll('.form-group.focused').forEach(group => {
                group.classList.remove('focused');
            });
            
            // Show success notification
            if (typeof window.windowManager !== 'undefined') {
                window.windowManager.showNotification(
                    'Message Sent',
                    'Your message has been sent successfully. I will get back to you soon!',
                    'success'
                );
            }
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000); // Simulate network delay
    }
    
    // ------- Resume Window Handler ------- //
    // For the Resume.pdf icon on desktop or start menu
    function handleResumeClick() {
        // Get all elements that open the resume
        const resumeOpeners = document.querySelectorAll('[data-window="resume"]');
        
        resumeOpeners.forEach(opener => {
            opener.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Instead of opening a window, show a notification for download
                if (typeof window.windowManager !== 'undefined') {
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
                }
            });
        });
    }
    
    // Initialize resume handler
    handleResumeClick();
});
