/**
 * Form JavaScript for Template 9 - Glassmorphism Theme
 * Handles form validation, submission, and feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // DOM Elements
    const contactForm = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Initialize form if exists
    if (contactForm) {
        // Add floating label functionality
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            if (input) {
                // Check initial state
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                }
                
                // Focus and blur events
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                    if (this.value.trim() !== '') {
                        this.classList.add('has-value');
                    } else {
                        this.classList.remove('has-value');
                    }
                });
            }
        });
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    /**
     * Validate the contact form
     * @returns {boolean} True if valid, false otherwise
     */
    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        // Clear previous errors
        clearErrors();
        
        // Validate each input
        inputs.forEach(input => {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && input.value.trim() !== '') {
                if (!isValidEmail(input.value.trim())) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    /**
     * Show error message for an input
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message
     */
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        // Create error message element if it doesn't exist
        if (!formGroup.querySelector('.error-message')) {
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        }
    }
    
    /**
     * Clear all error messages
     */
    function clearErrors() {
        // Remove error classes
        const errorGroups = contactForm.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
        });
        
        // Remove error messages
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    /**
     * Submit the form (simulated)
     */
    function submitForm() {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
        
        // Add styles for loading spinner if not present
        if (!document.querySelector('#spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                    margin-right: 8px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .success-message {
                    background: rgba(16, 185, 129, 0.1);
                    backdrop-filter: blur(var(--glass-blur));
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: var(--radius-lg);
                    padding: var(--space-md);
                    margin-top: var(--space-md);
                    text-align: center;
                    animation: fadeIn 0.5s forwards;
                }
                
                .success-icon {
                    font-size: var(--font-size-3xl);
                    color: var(--accent-secondary);
                    margin-bottom: var(--space-sm);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Simulate API call
        setTimeout(() => {
            // Hide the form
            contactForm.style.opacity = '0';
            contactForm.style.transform = 'translateY(20px)';
            
            // After form fades out, show success message
            setTimeout(() => {
                contactForm.style.display = 'none';
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for your message. I'll get back to you soon.</p>
                `;
                
                // Insert after form
                contactForm.parentNode.appendChild(successMessage);
            }, 300);
            
            // Reset form state (will be hidden, but reset for future)
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);
    }
    
    // Add error styles if not already in stylesheet
    if (!document.querySelector('#form-error-styles')) {
        const style = document.createElement('style');
        style.id = 'form-error-styles';
        style.textContent = `
            .form-group.error input,
            .form-group.error textarea {
                border-color: #ef4444;
                box-shadow: 0 0 0 1px #ef4444;
            }
            
            .error-message {
                color: #ef4444;
                font-size: var(--font-size-xs);
                margin-top: var(--space-xxs);
                display: block;
            }
            
            .form-group.focused input,
            .form-group.focused textarea {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 1px var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
});
