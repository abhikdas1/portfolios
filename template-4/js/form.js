/**
 * Form handling JavaScript file for ProfileCraft template-4
 * Handles form validation, submission, and feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Create success and error message elements
    const successMessage = document.createElement('div');
    successMessage.classList.add('form-success-message');
    successMessage.style.display = 'none';
    successMessage.textContent = 'Your message has been sent successfully! I will get back to you soon.';
    
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('form-error-message');
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'There was a problem sending your message. Please try again later.';
    
    contactForm.appendChild(successMessage);
    contactForm.appendChild(errorMessage);
    
    // ------- Form Validation ------- //
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset messages
        resetMessages();
        
        // Validate form
        if (validateForm()) {
            // Submit the form if valid
            submitForm();
        }
    });
    
    // Validate form inputs
    function validateForm() {
        let isValid = true;
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Reset previous errors
        resetErrors();
        
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
    
    // Show error message for a specific field
    function showError(field, message) {
        if (!field) return;
        
        const formGroup = field.parentElement;
        formGroup.classList.add('error');
        
        // Create error message element if it doesn't exist
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Focus on the first field with an error
        field.focus();
    }
    
    // Reset all error messages
    function resetErrors() {
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
    
    // Reset success and error messages
    function resetMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }
    
    // Check if email is valid
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ------- Form Submission ------- //
    function submitForm() {
        // Get the submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Store original button text
        const originalBtnHtml = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        
        // Simulate form submission with a timeout (replace with actual AJAX in production)
        setTimeout(() => {
            // Simulate successful submission
            const success = Math.random() > 0.1; // 90% chance of success
            
            if (success) {
                // Show success message
                successMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Scroll to message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Auto-hide message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                // Show error message
                errorMessage.style.display = 'block';
                
                // Scroll to message
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            
        }, 1500); // Simulate 1.5s server delay
    }
    
    // ------- Real-time Form Validation ------- //
    
    // Add blur event listeners to form fields for real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea');
    
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            // Skip empty fields that are not required
            if (!this.required && this.value.trim() === '') {
                return;
            }
            
            // Validate email field
            if (this.type === 'email' && this.value.trim() !== '') {
                if (!isValidEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                } else {
                    resetFieldError(this);
                }
            }
            
            // Validate required fields
            if (this.required && this.value.trim() === '') {
                showError(this, `Please enter your ${this.id}`);
            } else if (this.required && this.value.trim() !== '') {
                resetFieldError(this);
            }
        });
        
        // Remove error when user starts typing
        field.addEventListener('input', function() {
            resetFieldError(this);
        });
    });
    
    // Reset error for a specific field
    function resetFieldError(field) {
        const formGroup = field.parentElement;
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // ------- Focus Effect for Form Inputs ------- //
    
    // Add focus effect for form inputs and textareas
    formFields.forEach(field => {
        // Check if field has value on load
        if (field.value.trim() !== '') {
            field.classList.add('has-value');
        }
        
        // Focus event
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Blur event
        field.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.parentElement.classList.remove('focused');
                this.classList.remove('has-value');
            } else {
                this.classList.add('has-value');
            }
        });
    });
});
