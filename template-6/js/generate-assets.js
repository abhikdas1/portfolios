/**
 * Asset Generator for Windows-themed Portfolio Template 6
 * Creates placeholders for missing images
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ------- Generate Desktop Background ------- //
    function createDesktopBackground() {
        const desktopBg = document.querySelector('.desktop-bg');
        
        if (!desktopBg) return;
        
        // Check if background image is set through CSS
        const bgImage = getComputedStyle(desktopBg).backgroundImage;
        
        if (bgImage === 'none' || bgImage.includes('desktop-bg.jpg')) {
            // Create canvas for Windows-like background
            const canvas = document.createElement('canvas');
            const width = 1920;
            const height = 1080;
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            
            // Create Windows 11 style gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0078D7');
            gradient.addColorStop(1, '#00B2FF');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Add some subtle patterns
            ctx.globalAlpha = 0.1;
            
            // Draw circles
            for (let i = 0; i < 5; i++) {
                const centerX = Math.random() * width;
                const centerY = Math.random() * height;
                const radius = Math.random() * 300 + 200;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
            
            // Add a subtle light bloom effect at the center
            const radialGradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, height
            );
            radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            radialGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
            radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = radialGradient;
            ctx.fillRect(0, 0, width, height);
            
            // Set the background image
            desktopBg.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg')})`;
        }
    }
    
    // ------- Generate Profile Image ------- //
    function createProfileImage() {
        const profileImages = document.querySelectorAll('.profile-image img, .profile-img img');
        
        profileImages.forEach(img => {
            // Set error handler
            img.onerror = function() {
                // Create canvas for profile placeholder
                const canvas = document.createElement('canvas');
                const size = 200;
                canvas.width = size;
                canvas.height = size;
                
                const ctx = canvas.getContext('2d');
                
                // Fill background
                ctx.fillStyle = '#0078D7';
                ctx.fillRect(0, 0, size, size);
                
                // Add circle
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2 - 10, 0, 2 * Math.PI);
                ctx.fillStyle = '#f0f0f0';
                ctx.fill();
                
                // Add user icon
                ctx.font = 'bold 100px Arial';
                ctx.fillStyle = '#0078D7';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👤', size/2, size/2);
                
                // Set the image source to the canvas data URL
                this.src = canvas.toDataURL('image/png');
            };
            
            // Force error if src is missing or invalid
            if (!img.src || img.src.includes('profile-placeholder')) {
                img.src = 'invalid-source-to-trigger-error';
            }
        });
    }
    
    // ------- Generate Project Images ------- //
    function createProjectImages() {
        const projectImages = document.querySelectorAll('.project-img img');
        
        projectImages.forEach((img, index) => {
            // Set error handler
            img.onerror = function() {
                // Create canvas for project placeholder
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 250;
                
                const ctx = canvas.getContext('2d');
                
                // Different colors for different projects
                const colors = [
                    { bg: '#0078D7', title: 'Project 1' },
                    { bg: '#107C10', title: 'Project 2' },
                    { bg: '#5C2D91', title: 'Project 3' },
                    { bg: '#D83B01', title: 'Project 4' }
                ];
                
                const colorInfo = colors[index % colors.length];
                
                // Fill background
                ctx.fillStyle = colorInfo.bg;
                ctx.fillRect(0, 0, 400, 250);
                
                // Add grid pattern
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                
                // Horizontal lines
                for (let y = 20; y < 250; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(400, y);
                    ctx.stroke();
                }
                
                // Vertical lines
                for (let x = 20; x < 400; x += 20) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 250);
                    ctx.stroke();
                }
                
                // Add project title
                ctx.font = 'bold 30px "Segoe UI"';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(colorInfo.title, 200, 125);
                
                // Add Windows logo
                ctx.font = '40px Arial';
                ctx.fillText('🪟', 200, 70);
                
                // Set the image source to the canvas data URL
                this.src = canvas.toDataURL('image/jpeg');
            };
            
            // Force error if src is missing or contains placeholder
            if (!img.src || img.src.includes('project-') || img.src.includes('placeholder')) {
                img.src = 'invalid-source-to-trigger-error';
            }
        });
    }
    
    // Generate all required assets
    createDesktopBackground();
    createProfileImage();
    createProjectImages();
});
