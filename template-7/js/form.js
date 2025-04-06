/**
 * Form JavaScript file for Windows 10 Portfolio Template 7
 * Handles form validation, submission, and feedback in Windows 10 style
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
        
        // Add Windows 10 style focus effects
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // Create floating labels for Windows 10 feel
            const formGroup = input.parentElement;
            const inputId = input.id;
            const inputPlaceholder = input.placeholder;
            
            // Clear placeholder and add label
            if (!formGroup.querySelector('label')) {
                input.placeholder = '';
                
                const label = document.createElement('label');
                label.setAttribute('for', inputId);
                label.textContent = inputPlaceholder;
                label.classList.add('floating-label');
                
                formGroup.insertBefore(label, input);
                
                // Add focused class if input already has value
                if (input.value.trim() !== '') {
                    formGroup.classList.add('has-value');
                }
                
                // Add dynamic behavior
                input.addEventListener('focus', function() {
                    formGroup.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    formGroup.classList.remove('focused');
                    if (this.value.trim() !== '') {
                        formGroup.classList.add('has-value');
                    } else {
                        formGroup.classList.remove('has-value');
                    }
                });
            }
        });
        
        // Add Windows 10 style to form elements - append CSS if not already in stylesheet
        if (!document.getElementById('win10-form-styles')) {
            const formStyles = document.createElement('style');
            formStyles.id = 'win10-form-styles';
            formStyles.textContent = `
                /* Windows 10 Form Styling */
                .form-group {
                    position: relative;
                    margin-bottom: 20px;
                }
                
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    font-size: 16px;
                    border: 2px solid #d1d1d1;
                    background-color: white;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                
                .form-group.focused input, .form-group.focused textarea {
                    border-color: var(--win10-primary);
                    box-shadow: 0 0 0 1px var(--win10-primary);
                }
                
                .form-group .floating-label {
                    position: absolute;
                    left: 10px;
                    top: 10px;
                    font-size: 16px;
                    color: #6e6e6e;
                    pointer-events: none;
                    transition: all 0.2s ease;
                }
                
                .form-group.focused .floating-label, 
                .form-group.has-value .floating-label {
                    top: -10px;
                    left: 5px;
                    font-size: 12px;
                    background-color: white;
                    padding: 0 5px;
                    color: var(--win10-primary);
                }
                
                .form-group.error input, .form-group.error textarea {
                    border-color: #E81123;
                }
                
                .form-group.error .floating-label {
                    color: #E81123;
                }
                
                .error-message {
                    color: #E81123;
                    font-size: 12px;
                    margin-top: 5px;
                    display: block;
                }
                
                /* Windows 10 submit button spin animation */
                @keyframes win10Spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .sending-indicator {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: win10Spin 1s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
            `;
            document.head.appendChild(formStyles);
        }
    }
    
    /**
     * Validates the contact form
     * @returns {boolean} True if the form is valid
     */
    function validateForm() {
        let isValid = true;
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Clear previous errors
        removeAllErrors();
        
        // Validate name
        if (!name || name.value.trim() === '') {
            showError(name, 'Please enter your name');
            isValid = false;
        }
        
        // Validate email
        if (!email || email.value.trim() === '') {
            showError(email, 'Please enter your email address');
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
     * Shows an error message for a form field
     * @param {HTMLElement} input - The input element with the error
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        // Create error message element if it doesn't exist
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    /**
     * Removes all error states and messages from the form
     */
    function removeAllErrors() {
        // Remove error classes
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(message => {
            message.remove();
        });
    }
    
    /**
     * Validates email format
     * @param {string} email - The email to validate
     * @returns {boolean} True if the email is valid
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Handles form submission (simulated)
     */
    function submitForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="sending-indicator"></span> Sending...`;
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject')?.value || 'Contact Form Message',
                message: document.getElementById('message').value
            };
            
            // For demo purposes, log to console
            console.log('Form submitted with data:', formData);
            
            // Reset form
            form.reset();
            
            // Remove has-value classes
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-value');
            });
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Show Windows 10 notification using the win10Manager
            if (window.win10Manager) {
                window.win10Manager.showNotification(
                    'Message Sent',
                    'Your message has been sent successfully. I will get back to you soon!',
                    'success'
                );
            } else {
                // Fallback if win10Manager is not available
                showFormSuccess();
            }
        }, 2000); // Simulate 2 second API call
    }
    
    /**
     * Fallback success message if win10Manager is not available
     */
    function showFormSuccess() {
        const formContainer = document.querySelector('.contact-form');
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'win10-success-message';
        successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Message Sent!</h3>
            <p>Your message has been sent successfully. I will get back to you soon!</p>
            <button class="win10-btn primary" id="reset-form-btn">Send Another Message</button>
        `;
        
        // Add styles if not already in stylesheet
        if (!document.getElementById('form-success-styles')) {
            const successStyles = document.createElement('style');
            successStyles.id = 'form-success-styles';
            successStyles.textContent = `
                .win10-success-message {
                    background-color: #f9f9f9;
                    border-left: 4px solid #107C10;
                    padding: 20px;
                    margin-top: 20px;
                    text-align: center;
                    animation: fadeIn 0.5s;
                }
                
                .success-icon {
                    font-size: 48px;
                    color: #107C10;
                    margin-bottom: 15px;
                }
                
                .win10-success-message h3 {
                    margin-bottom: 10px;
                    color: #107C10;
                }
                
                .win10-success-message p {
                    margin-bottom: 20px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(successStyles);
        }
        
        // Hide the form
        const formElement = document.getElementById('contact-form');
        formElement.style.display = 'none';
        
        // Add success message
        formContainer.appendChild(successMessage);
        
        // Add event listener to reset button
        document.getElementById('reset-form-btn').addEventListener('click', () => {
            formElement.style.display = 'block';
            successMessage.remove();
        });
    }
    
    /**
     * Handle form reset button if present
     */
    const resetFormBtn = document.getElementById('reset-form-btn');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            const form = document.getElementById('contact-form');
            form.reset();
            removeAllErrors();
            
            // Remove has-value classes
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-value');
            });
        });
    }
    
    /**
     * Special handling for resume link - simulate download
     * in Windows 10 style notification
     */
    const resumeLinks = document.querySelectorAll('a[href*="resume"], a[data-window="resume"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (window.win10Manager) {
                // First notification - preparing download
                window.win10Manager.showNotification(
                    'Resume Download',
                    'Preparing to download resume...',
                    'info'
                );
                
                // After a delay, show download complete notification
                setTimeout(() => {
                    window.win10Manager.showNotification(
                        'Download Complete',
                        'Resume has been downloaded successfully!',
                        'success'
                    );
                }, 2000);
            } else {
                // Fallback if win10Manager is not available
                alert('Resume download is simulated in this demo.');
            }
        });
    });
});
