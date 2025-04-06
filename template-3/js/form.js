/**
 * Form handling JavaScript file for ProfileCraft template-3
 * Handles form validation and submission with smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- DOM Elements ------- //
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Add input focus/blur events for label animation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Add style for form animations
        addFormAnimations();
        
        formInputs.forEach(input => {
            // Check if input has value on load
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
                input.parentElement.classList.add('focused');
            }
            
            // Focus event
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Blur event
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.remove('has-value');
                    this.parentElement.classList.remove('focused');
                } else {
                    this.classList.add('has-value');
                }
            });
            
            // Input event
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });
        
        // Create success/error message element
        const formMessage = document.createElement('div');
        formMessage.classList.add('form-message');
        contactForm.appendChild(formMessage);
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Form validation
        function validateForm() {
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Reset previous errors
            resetFormErrors();
            
            // Validate name
            if (!name || name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!email || email.value.trim() === '') {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.value.trim() === '') {
                showError(message, 'Message is required');
                isValid = false;
            }
            
            return isValid;
        }
        
        // Show error message
        function showError(input, message) {
            if (!input) return;
            
            const formGroup = input.parentElement;
            formGroup.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = message;
            
            formGroup.appendChild(errorMessage);
            
            // Add shake animation
            input.classList.add('shake');
            
            // Remove shake animation after it completes
            setTimeout(() => {
                input.classList.remove('shake');
            }, 600);
        }
        
        // Reset form errors
        function resetFormErrors() {
            const errorMessages = contactForm.querySelectorAll('.error-message');
            const inputGroups = contactForm.querySelectorAll('.input-group');
            
            errorMessages.forEach(error => error.remove());
            inputGroups.forEach(group => group.classList.remove('error'));
            
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
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
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            
            // Create loading spinner if it doesn't exist
            if (!submitBtn.querySelector('.loading-spinner')) {
                const spinner = document.createElement('span');
                spinner.classList.add('loading-spinner');
                submitBtn.innerHTML = '';
                submitBtn.appendChild(spinner);
                submitBtn.appendChild(document.createTextNode(' Sending...'));
            } else {
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            }
            
            // Simulate API call with setTimeout
            setTimeout(() => {
                // Show success message
                formMessage.textContent = 'Your message has been sent successfully! I will get back to you soon.';
                formMessage.classList.add('success');
                
                // Reset form
                contactForm.reset();
                
                // Reset form input states
                formInputs.forEach(input => {
                    input.classList.remove('has-value');
                    input.parentElement.classList.remove('focused');
                });
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Auto hide success message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.remove('success');
                    formMessage.textContent = '';
                }, 5000);
                
                // Log form submission (for demonstration purposes)
                console.log('Form submitted with the following data:');
                console.log({
                    name: document.getElementById('name')?.value,
                    email: document.getElementById('email')?.value,
                    subject: document.getElementById('subject')?.value,
                    message: document.getElementById('message')?.value
                });
                
            }, 1500); // Simulate server delay
        }
    }
    
    // Add CSS animations for form
    function addFormAnimations() {
        const styleExists = document.getElementById('form-animation-styles');
        
        if (!styleExists) {
            const style = document.createElement('style');
            style.id = 'form-animation-styles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .shake {
                    animation: shake 0.6s ease-in-out;
                }
                
                .input-group.focused label {
                    transform: translateY(-20px);
                    font-size: 1.2rem;
                    color: var(--color-primary);
                }
                
                .input-group label {
                    position: absolute;
                    left: 12px;
                    top: 12px;
                    transition: all var(--transition-fast);
                    pointer-events: none;
                    color: var(--color-text-light);
                }
                
                .input-group.focused input,
                .input-group.focused textarea {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(238, 108, 77, 0.1);
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .error-message {
                    color: #f44336;
                    font-size: 1.2rem;
                    margin-top: 5px;
                }
                
                .input-group.error input,
                .input-group.error textarea {
                    border-color: #f44336;
                }
                
                .form-message {
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-top: 2rem;
                    font-weight: 500;
                    display: none;
                }
                
                .form-message.success {
                    display: block;
                    background-color: rgba(76, 175, 80, 0.1);
                    border: 1px solid #4caf50;
                    color: #4caf50;
                }
                
                .form-message.error {
                    display: block;
                    background-color: rgba(244, 67, 54, 0.1);
                    border: 1px solid #f44336;
                    color: #f44336;
                }
            `;
            
            document.head.appendChild(style);
        }
    }
});
