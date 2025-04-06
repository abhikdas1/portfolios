/**
 * Form JavaScript for Template 10 - Dark Knight Theme
 * Handles form validation, submission, and feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // DOM Elements
    const contactForm = document.getElementById('contact-form');
    const inputs = document.querySelectorAll('.input-group input, .input-group textarea');
    
    // Initialize floating label behavior
    inputs.forEach(input => {
        // Check if the input has a value on page load
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Add input event listener
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    /**
     * Validate form fields
     * @returns {boolean} - Form validity
     */
    function validateForm() {
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Remove any existing error messages
        removeErrors();
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} - Email validity
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Show error message
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        // Create error message element if it doesn't exist
        if (!formGroup.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
            
            // Add error style to the form group if not already in CSS
            if (!document.getElementById('error-style')) {
                const style = document.createElement('style');
                style.id = 'error-style';
                style.textContent = `
                    .input-group.error input,
                    .input-group.error textarea {
                        border-color: #ff3333;
                        box-shadow: 0 0 0 2px rgba(255, 51, 51, 0.2);
                    }
                    
                    .error-message {
                        color: #ff3333;
                        font-size: var(--font-size-xs);
                        margin-top: 6px;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    /**
     * Remove all error messages
     */
    function removeErrors() {
        // Remove error class from form groups
        document.querySelectorAll('.input-group.error').forEach(group => {
            group.classList.remove('error');
        });
        
        // Remove error message elements
        document.querySelectorAll('.error-message').forEach(message => {
            message.remove();
        });
    }
    
    /**
     * Submit form (simulation)
     */
    function submitForm() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        
        // Add loading spinner style if needed
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .loading-spinner {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spinner 0.8s linear infinite;
                    margin-right: 8px;
                }
                
                @keyframes spinner {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .success-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: var(--space-8);
                    background-color: var(--bg-secondary);
                    border-radius: var(--border-radius);
                    animation: fadeIn 0.5s ease-out;
                }
                
                .success-icon {
                    font-size: 48px;
                    color: var(--accent-primary);
                    margin-bottom: var(--space-4);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Simulate API request delay
        setTimeout(() => {
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = {};
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Log form data to console (in a real app, would be sent to server)
            console.log('Form submitted with data:', formValues);
            
            // Hide form and show success message
            contactForm.style.opacity = '0';
            contactForm.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // Hide form
                contactForm.style.display = 'none';
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for your message. I'll get back to you soon.</p>
                    <div style="margin-top: var(--space-6);">
                        <button class="btn primary-btn" id="send-another">Send Another Message</button>
                    </div>
                `;
                
                // Add success message to DOM
                const formCard = document.querySelector('.form-card');
                formCard.appendChild(successMessage);
                
                // Setup send another button
                document.getElementById('send-another').addEventListener('click', () => {
                    // Reset form
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Remove success message
                    successMessage.remove();
                    
                    // Show form again
                    contactForm.style.display = 'block';
                    setTimeout(() => {
                        contactForm.style.opacity = '1';
                        contactForm.style.transform = 'translateY(0)';
                    }, 10);
                    
                    // Reset input states
                    inputs.forEach(input => {
                        input.classList.remove('has-value');
                    });
                });
            }, 300);
        }, 2000);
    }
    
    /**
     * Handle CV download simulation
     */
    const downloadBtns = document.querySelectorAll('a[href="#"].primary-btn:not([class*="contact"])');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if it's a CV download button by looking at the text content
            if (this.textContent.toLowerCase().includes('cv') || 
                this.textContent.toLowerCase().includes('resume')) {
                
                // Add a downloading class
                this.classList.add('downloading');
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="loading-spinner"></span> Downloading...';
                
                // Simulate download
                setTimeout(() => {
                    this.classList.remove('downloading');
                    this.innerHTML = originalText;
                    
                    // Show a toast notification
                    showToast('Download Complete', 'Your file has been downloaded successfully.', 'success');
                }, 2000);
            }
        });
    });
    
    /**
     * Show toast notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'info')
     */
    function showToast(title, message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast styles
            const toastStyle = document.createElement('style');
            toastStyle.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .toast {
                    background-color: var(--bg-secondary);
                    color: var(--text-primary);
                    border-radius: var(--border-radius);
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    min-width: 250px;
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    flex-direction: column;
                    animation: toastIn 0.3s ease, toastOut 0.3s ease 3s forwards;
                    position: relative;
                    overflow: hidden;
                }
                
                .toast.success {
                    border-left: 4px solid var(--accent-primary);
                }
                
                .toast.error {
                    border-left: 4px solid #ff3333;
                }
                
                .toast.info {
                    border-left: 4px solid #3399ff;
                }
                
                .toast-title {
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .toast-message {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }
                
                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background-color: rgba(255, 255, 255, 0.2);
                    width: 100%;
                }
                
                .toast-progress-bar {
                    height: 100%;
                    width: 100%;
                    background-color: var(--accent-primary);
                    animation: progress 3s linear forwards;
                }
                
                @keyframes toastIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes toastOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `;
            document.head.appendChild(toastStyle);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after animation completes
        setTimeout(() => {
            toast.remove();
        }, 3300);
    }
});
