/**
 * Form handling JavaScript file for ProfileCraft template-2
 * Handles form validation and submission with modern UI feedback
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
        
        // Add input focus effects
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Create floating label effect
            const formGroup = input.parentElement;
            formGroup.classList.add('input-group');
            
            input.addEventListener('focus', function() {
                formGroup.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (input.value === '') {
                    formGroup.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value !== '') {
                formGroup.classList.add('focused');
            }
        });
        
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
        
        // Show error message with animation
        function showError(input, message) {
            const formGroup = input.parentElement;
            
            // Create error element
            const error = document.createElement('div');
            error.classList.add('error-message');
            error.textContent = message;
            
            // Add error class to form group
            formGroup.classList.add('has-error');
            
            // Add shake animation
            input.classList.add('shake');
            setTimeout(() => {
                input.classList.remove('shake');
            }, 500);
            
            // Append error message
            formGroup.appendChild(error);
        }
        
        // Reset form errors
        function resetFormErrors() {
            // Remove all error messages
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
            
            // Remove error class from form groups
            const formGroups = contactForm.querySelectorAll('.form-group');
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
        
        // Submit form with loading animation
        function submitForm() {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
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
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Remove focused class from form groups
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => group.classList.remove('focused'));
                
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
        
        // Show form message with animation
        function showFormMessage(message, type) {
            formMessage.textContent = message;
            formMessage.classList.add(type);
            formMessage.style.display = 'block';
            formMessage.classList.add('animate-fadeIn');
            
            // Scroll to the message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto hide success message after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.classList.remove('animate-fadeIn');
                    formMessage.classList.add('animate-fadeOut');
                    
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 500);
                }, 5000);
            }
        }
        
        // Add CSS for validation effects and animations
        addStyleEffects();
    }
    
    // Add CSS styles for form validation and animations
    function addStyleEffects() {
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
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            .shake {
                animation: shake 0.5s linear;
            }
            
            .animate-fadeOut {
                animation: fadeOut 0.5s ease forwards;
            }
            
            .input-group {
                position: relative;
            }
            
            .input-group.focused input,
            .input-group.focused textarea {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
            }
        `;
        
        // Add style to head
        document.head.appendChild(style);
    }
});
