/**
 * Form handling JavaScript file for ProfileCraft portfolio template
 * Handles form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Create form message element
        const formMessage = document.createElement('div');
        formMessage.classList.add('form-message');
        contactForm.appendChild(formMessage);
        
        // Form submission event
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if form is valid
            if (validateForm()) {
                // Simulate form submission
                submitForm();
            }
        });
        
        // Form validation
        function validateForm() {
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Reset previous error messages
            resetFormErrors();
            
            // Validate name
            if (name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (email.value.trim() === '') {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (message.value.trim() === '') {
                showError(message, 'Message is required');
                isValid = false;
            }
            
            return isValid;
        }
        
        // Show error message
        function showError(input, message) {
            const formGroup = input.parentElement;
            
            // Create error element
            const error = document.createElement('div');
            error.classList.add('error-message');
            error.textContent = message;
            
            // Add error class to form group
            formGroup.classList.add('has-error');
            
            // Append error message
            formGroup.appendChild(error);
        }
        
        // Reset form errors
        function resetFormErrors() {
            // Remove all error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
            
            // Remove error class from form groups
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('has-error'));
            
            // Reset form message
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
            formMessage.style.display = 'none';
        }
        
        // Check if email is valid
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Submit form
        function submitForm() {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call with a timeout
            setTimeout(() => {
                // In a real implementation, you would send data to a server
                // Using fetch or XMLHttpRequest
                
                // Simulate successful submission
                showFormMessage('Your message has been sent successfully! I will get back to you soon.', 'success');
                
                // Reset the form
                contactForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Log form data (for demonstration)
                console.log('Form submitted with the following data:');
                console.log({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                });
                
            }, 1500); // Simulate 1.5s delay for server response
        }
        
        // Show form message
        function showFormMessage(message, type) {
            formMessage.textContent = message;
            formMessage.classList.add(type);
            formMessage.style.display = 'block';
            
            // Scroll to the message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto hide success message after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
        
        // Add CSS for validation errors
        addValidationStyles();
    }
    
    // Add CSS styles for form validation
    function addValidationStyles() {
        // Create style element
        const style = document.createElement('style');
        style.textContent = `
            .has-error input,
            .has-error textarea {
                border-color: #dc3545 !important;
            }
            
            .error-message {
                color: #dc3545;
                font-size: 1.2rem;
                margin-top: 0.5rem;
            }
            
            .form-group {
                position: relative;
            }
        `;
        
        // Add style to head
        document.head.appendChild(style);
    }
});
