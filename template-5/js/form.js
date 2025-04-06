/**
 * Form handling JavaScript file for ProfileCraft template-5
 * Handles form validation, submission and cyberpunk-themed feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Contact Form ------- //
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Create form error message container
        const formErrorContainer = document.createElement('div');
        formErrorContainer.classList.add('cyber-form-error');
        formErrorContainer.style.display = 'none';
        contactForm.appendChild(formErrorContainer);
        
        // Create form success message container
        const formSuccessContainer = document.createElement('div');
        formSuccessContainer.classList.add('cyber-form-success');
        formSuccessContainer.style.display = 'none';
        contactForm.appendChild(formSuccessContainer);
        
        // Add status message styles
        const formMessageStyle = document.createElement('style');
        formMessageStyle.textContent = `
            .cyber-form-error,
            .cyber-form-success {
                margin-top: 2rem;
                padding: 1.5rem;
                border: 1px solid var(--cyber-border);
                font-family: var(--font-secondary);
                animation: message-flicker 0.5s ease;
            }
            
            .cyber-form-error {
                background-color: rgba(255, 0, 0, 0.1);
                color: #ff4d4d;
                border-color: #ff4d4d;
            }
            
            .cyber-form-success {
                background-color: rgba(0, 255, 0, 0.1);
                color: #00ff66;
                border-color: #00ff66;
            }
            
            @keyframes message-flicker {
                0% {
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                20% {
                    opacity: 0.5;
                }
                30% {
                    opacity: 1;
                }
                100% {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(formMessageStyle);
        
        // Form submission handler
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
                showFieldError(name, 'SYSTEM ERROR: NAME FIELD REQUIRED');
                isValid = false;
            }
            
            // Validate email
            if (!email || email.value.trim() === '') {
                showFieldError(email, 'SYSTEM ERROR: EMAIL FIELD REQUIRED');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showFieldError(email, 'SYSTEM ERROR: INVALID EMAIL FORMAT');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.value.trim() === '') {
                showFieldError(message, 'SYSTEM ERROR: MESSAGE FIELD REQUIRED');
                isValid = false;
            }
            
            return isValid;
        }
        
        // Show field error
        function showFieldError(field, errorMessage) {
            if (!field) return;
            
            const formGroup = field.closest('.cyber-form-group');
            
            // Add error class to form group
            formGroup.classList.add('error');
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.classList.add('field-error');
            errorElement.textContent = errorMessage;
            
            // Add error styles
            const errorStyle = document.createElement('style');
            errorStyle.textContent = `
                .cyber-form-group.error input,
                .cyber-form-group.error textarea {
                    border-color: #ff4d4d;
                    box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
                }
                
                .field-error {
                    color: #ff4d4d;
                    font-size: 1.2rem;
                    margin-top: 0.5rem;
                    font-family: var(--font-secondary);
                    animation: error-flicker 1s ease;
                }
                
                @keyframes error-flicker {
                    0% {
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    20% {
                        opacity: 0.5;
                    }
                    30% {
                        opacity: 1;
                    }
                    40% {
                        opacity: 0.7;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                .input-shake {
                    animation: input-shake 0.5s ease;
                }
                
                @keyframes input-shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    20%, 60% {
                        transform: translateX(-5px);
                    }
                    40%, 80% {
                        transform: translateX(5px);
                    }
                }
            `;
            document.head.appendChild(errorStyle);
            
            // Add shake animation to field
            field.classList.add('input-shake');
            
            // Remove shake animation after it completes
            setTimeout(() => {
                field.classList.remove('input-shake');
            }, 500);
            
            // Append error message
            formGroup.appendChild(errorElement);
        }
        
        // Reset form errors
        function resetFormErrors() {
            // Remove error class from form groups
            const errorGroups = contactForm.querySelectorAll('.cyber-form-group.error');
            errorGroups.forEach(group => {
                group.classList.remove('error');
            });
            
            // Remove error messages
            const errorMessages = contactForm.querySelectorAll('.field-error');
            errorMessages.forEach(message => {
                message.remove();
            });
            
            // Hide form error container
            formErrorContainer.style.display = 'none';
            
            // Hide form success container
            formSuccessContainer.style.display = 'none';
        }
        
        // Check if email is valid
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Submit form
        function submitForm() {
            // Show loading state
            const submitBtn = contactForm.querySelector('.cyber-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="cyber-loading">
                    <span>TRANSMITTING</span>
                    <span class="dots">...</span>
                </div>
            `;
            
            // Add loading animation styles
            const loadingStyle = document.createElement('style');
            loadingStyle.textContent = `
                .cyber-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .cyber-loading .dots {
                    animation: dots-animation 1.5s infinite;
                    width: 30px;
                    text-align: left;
                }
                
                @keyframes dots-animation {
                    0% {
                        content: ".";
                    }
                    33% {
                        content: "..";
                    }
                    66% {
                        content: "...";
                    }
                    100% {
                        content: ".";
                    }
                }
            `;
            document.head.appendChild(loadingStyle);
            
            // Simulate API call
            setTimeout(() => {
                // 90% chance of success for demo purposes
                const isSuccess = Math.random() < 0.9;
                
                if (isSuccess) {
                    // Show success message
                    formSuccessContainer.textContent = "MESSAGE TRANSMISSION SUCCESSFUL. DATA RECEIVED.";
                    formSuccessContainer.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error message
                    formErrorContainer.textContent = "ERROR: MESSAGE TRANSMISSION FAILED. PLEASE TRY AGAIN LATER.";
                    formErrorContainer.style.display = 'block';
                }
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Scroll to message
                if (isSuccess) {
                    formSuccessContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Auto hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccessContainer.style.display = 'none';
                    }, 5000);
                } else {
                    formErrorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Console log for demonstration
                console.log('Form submitted with data:', {
                    name: document.getElementById('name')?.value,
                    email: document.getElementById('email')?.value,
                    subject: document.getElementById('subject')?.value,
                    message: document.getElementById('message')?.value
                });
                
            }, 2000); // 2 second delay to simulate server response
        }
        
        // ------- Real-time Validation ------- //
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Remove focus animation if empty
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.parentElement.classList.remove('focused');
                    
                    // Validate on blur for required fields
                    if (this.hasAttribute('required')) {
                        const fieldName = this.id.charAt(0).toUpperCase() + this.id.slice(1);
                        showFieldError(this, `SYSTEM ERROR: ${fieldName.toUpperCase()} FIELD REQUIRED`);
                    }
                }
                
                // Validate email format
                if (this.id === 'email' && this.value.trim() !== '' && !isValidEmail(this.value)) {
                    showFieldError(this, 'SYSTEM ERROR: INVALID EMAIL FORMAT');
                }
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                const formGroup = this.closest('.cyber-form-group');
                if (formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    const errorMessage = formGroup.querySelector('.field-error');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        });
    }
});
