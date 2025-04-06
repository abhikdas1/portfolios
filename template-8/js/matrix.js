/**
 * Matrix rain animation for the background
 * Creates a cascading green "Matrix" style effect
 */

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call initially and on resize
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Matrix character set
    const characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Columns setup
    const font_size = 14;
    let columns; // number of columns for the rain
    let drops = []; // array of drops - one per column
    
    // Initialize columns
    function initDrops() {
        columns = Math.floor(canvas.width / font_size);
        drops = [];
        
        // Initialize an array of drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -canvas.height / font_size); // Start position varies
        }
    }
    initDrops();
    
    // Function to draw the rain
    function draw() {
        // Slightly translucent black to show motion
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Green text
        ctx.fillStyle = "#00FF41";
        ctx.font = font_size + "px monospace";
        
        // Draw rain character by character
        for (let i = 0; i < drops.length; i++) {
            // Choose a random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // Calculate x position
            const x = i * font_size;
            
            // Calculate y position
            const y = drops[i] * font_size;
            
            // Draw the character
            ctx.fillText(text, x, y);
            
            // Send the drop back to the top randomly after it has crossed the screen
            // Adding a randomness to the reset to make the drops scattered on the Y axis
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Increment y coordinate
            drops[i]++;
        }
    }
    
    // Detect low-performance devices
    const isLowPerfDevice = () => {
        // Simple heuristic based on navigator properties
        const userAgent = navigator.userAgent;
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
        );
    };
    
    // Adjust animation based on device performance
    const frameRate = isLowPerfDevice() ? 15 : 30;
    const interval = 1000 / frameRate;
    
    // Set up the animation loop
    let lastTime = 0;
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        
        const elapsed = timestamp - lastTime;
        
        if (elapsed > interval) {
            lastTime = timestamp;
            draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start the animation
    requestAnimationFrame(animate);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initDrops();
    });
});
