/**
 * Asset Generator for Template 5
 * Creates placeholder assets for the cyberpunk portfolio theme
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if assets exist, if not create placeholder elements
    checkAndCreatePlaceholders();

    function checkAndCreatePlaceholders() {
        // List of required images
        const requiredImages = [
            'profile-placeholder.jpg',
            'project-1.jpg',
            'project-2.jpg',
            'project-3.jpg',
            'project-4.jpg',
            'project-5.jpg',
            'project-6.jpg'
        ];

        // Check each image
        requiredImages.forEach(imageName => {
            const img = new Image();
            img.src = `assets/${imageName}`;
            
            img.onerror = function() {
                console.log(`Creating placeholder for missing image: ${imageName}`);
                createPlaceholder(imageName);
            };
        });
    }

    function createPlaceholder(imageName) {
        // Determine type of placeholder needed
        let width, height, text, color;
        
        if (imageName === 'profile-placeholder.jpg') {
            width = 300;
            height = 350;
            text = 'PROFILE';
            color = '#00fff9';
        } else if (imageName.includes('project-')) {
            width = 350;
            height = 200;
            text = imageName.replace('.jpg', '').toUpperCase();
            
            // Different colors for different project types
            const projectNumber = parseInt(imageName.split('-')[1]);
            const colors = ['#00fff9', '#bd00ff', '#ff00ff', '#00ff66', '#ffff00', '#0088ff'];
            color = colors[(projectNumber - 1) % colors.length];
        }
        
        // Create canvas placeholder
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw cyber-themed placeholder
        ctx.fillStyle = '#070715';
        ctx.fillRect(0, 0, width, height);
        
        // Add grid pattern
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        
        // Horizontal lines
        for (let y = 0; y < height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Vertical lines
        for (let x = 0; x < width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Add glow effect
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        
        // Add text
        ctx.font = 'bold 24px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(text, width/2, height/2);
        
        // Convert to data URL and create image element
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        // Find all img elements with this src and replace
        document.querySelectorAll(`img[src="assets/${imageName}"]`).forEach(img => {
            img.src = dataUrl;
        });
    }
});
