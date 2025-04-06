/**
 * Debug Helper for Template 5
 * This script adds a debug panel to help diagnose issues
 */

(function() {
    // Only run in development mode
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.classList.add('debug-info');
    debugPanel.innerHTML = '<h4>Debug Panel</h4><div id="debug-content"></div>';
    document.body.appendChild(debugPanel);
    
    const debugContent = document.getElementById('debug-content');
    
    // Log important elements
    logElements();
    
    function logElements() {
        const criticalElements = [
            '.terminal-line',
            '.terminal-command',
            '.cyber-stats',
            '.stat-value',
            '.cyber-typewriter',
            '.cyber-avatar img',
            '.project-image img'
        ];
        
        criticalElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            log(`${selector}: ${elements.length} found`);
            
            if (selector === '.stat-value' && elements.length > 0) {
                elements.forEach(el => {
                    log(`  - data-count: ${el.getAttribute('data-count')}`);
                });
            }
        });
    }
    
    // Logger function
    function log(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        debugContent.appendChild(logEntry);
        console.log(message);
    }
    
    // Add ability to toggle debug panel
    let isVisible = true;
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Debug';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '10px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.background = '#333';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.padding = '5px 10px';
    toggleBtn.style.cursor = 'pointer';
    
    toggleBtn.addEventListener('click', () => {
        isVisible = !isVisible;
        debugPanel.style.display = isVisible ? 'block' : 'none';
    });
    
    document.body.appendChild(toggleBtn);
})();
