/**
 * Terminal functionality for the hacker-themed portfolio
 * Handles terminal initialization, input processing, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const cursor = document.querySelector('.cursor');
    const loadingProgress = document.querySelector('.progress');
    const loadingMessage = document.querySelector('.loading-message');
    const toggleSoundBtn = document.getElementById('toggle-sound');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Sound elements
    const keypressSound = document.getElementById('keypress-sound');
    const commandSound = document.getElementById('command-sound');
    const errorSound = document.getElementById('error-sound');
    
    // State variables
    let soundEnabled = false;
    let commandHistory = [];
    let historyIndex = -1;
    let commandsEnabled = false;
    
    // Initialize the terminal
    initTerminal();
    
    /**
     * Initialize the terminal
     */
    function initTerminal() {
        // Simulate system boot
        simulateBootSequence();
        
        // Focus input
        terminalInput.focus();
        
        // Events
        terminalInput.addEventListener('input', updateCursorPosition);
        terminalInput.addEventListener('keydown', handleInputKeydown);
        window.addEventListener('click', () => terminalInput.focus());
        toggleSoundBtn.addEventListener('click', toggleSound);
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Prevent cursor from showing in the input field
        terminalInput.style.caretColor = 'transparent';
        
        // Initial cursor position
        updateCursorPosition();
    }
    
    /**
     * Simulate a boot sequence for the terminal
     */
    function simulateBootSequence() {
        // Start progress bar animation
        setTimeout(() => {
            loadingProgress.style.width = '100%';
        }, 500);
        
        // Show boot messages
        const bootMessages = [
            "Initializing system components...",
            "Loading kernel modules...",
            "Establishing secure connection...",
            "Running security protocols...",
            "Mounting file systems...",
            "Starting terminal services...",
            "System ready."
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            loadingMessage.textContent = bootMessages[messageIndex];
            
            messageIndex++;
            if (messageIndex >= bootMessages.length) {
                clearInterval(messageInterval);
                
                // Complete boot sequence
                setTimeout(completeBootSequence, 1000);
            }
        }, 600);
    }
    
    /**
     * Complete the boot sequence and enable commands
     */
    function completeBootSequence() {
        // Hide the loading elements
        document.querySelector('.loading-message').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        
        // Show initial message
        addOutput("Welcome to the terminal portfolio. Type 'help' for a list of available commands.");
        addOutput("Type 'about' to learn more about me.");
        addOutput("");
        
        // Enable commands
        commandsEnabled = true;
    }
    
    /**
     * Handle keydown events in the input field
     */
    function handleInputKeydown(e) {
        // Play keypress sound
        playSound(keypressSound);
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                processCommand();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                navigateHistory('up');
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                navigateHistory('down');
                break;
                
            case 'Tab':
                e.preventDefault();
                autocompleteCommand();
                break;
                
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    handleCtrlC();
                }
                break;
                
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    clearTerminal();
                }
                break;
        }
    }
    
    /**
     * Process the entered command
     */
    function processCommand() {
        const command = terminalInput.value.trim();
        
        if (!command) {
            // If empty command, just add prompt
            addOutput(`<span class="prompt">user@portfolio:~$</span> `);
            terminalInput.value = '';
            return;
        }
        
        // Add command to output
        addOutput(`<span class="prompt">user@portfolio:~$</span> ${command}`);
        
        // Add to history
        commandHistory.unshift(command);
        historyIndex = -1;
        
        // Clear input
        terminalInput.value = '';
        
        // Process command if commands are enabled
        if (commandsEnabled) {
            executeCommand(command);
        } else {
            addOutput("System is still initializing. Please wait...");
        }
        
        // Update cursor
        updateCursorPosition();
        
        // Auto-scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    /**
     * Execute a specific command
     */
    function executeCommand(command) {
        // Play command sound
        playSound(commandSound);
        
        // Convert to lowercase for case-insensitive comparison
        const cmd = command.toLowerCase();
        const args = cmd.split(' ');
        const mainCommand = args[0];
        
        // Lookup in commands object (defined in commands.js)
        if (typeof commands !== 'undefined' && commands[mainCommand]) {
            commands[mainCommand](args.slice(1));
        } else if (cmd === 'help') {
            showHelp();
        } else if (cmd === 'clear' || cmd === 'cls') {
            clearTerminal();
        } else if (cmd === 'about') {
            showAbout();
        } else if (cmd === 'skills') {
            showSkills();
        } else if (cmd === 'projects') {
            showProjects();
        } else if (cmd === 'experience') {
            showExperience();
        } else if (cmd === 'education') {
            showEducation();
        } else if (cmd === 'contact') {
            showContact();
        } else if (cmd.startsWith('echo ')) {
            echo(command.substring(5));
        } else if (cmd === 'whoami') {
            whoami();
        } else if (cmd === 'date') {
            showDate();
        } else if (cmd === 'social') {
            showSocial();
        } else if (cmd === 'download resume' || cmd === 'download cv') {
            downloadResume();
        } else {
            // Command not found
            playSound(errorSound);
            addOutput(`<span class="error">Command not found: ${command}</span>`);
            addOutput(`Type <span class="command">help</span> to see available commands.`);
        }
    }
    
    /**
     * Add text to the terminal output
     */
    function addOutput(text) {
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.innerHTML = text;
        terminalOutput.appendChild(outputLine);
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    /**
     * Add a section of HTML content to the terminal output
     */
    function addOutputSection(htmlContent) {
        const outputSection = document.createElement('div');
        outputSection.className = 'output-section';
        outputSection.innerHTML = htmlContent;
        terminalOutput.appendChild(outputSection);
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    /**
     * Clear the terminal output
     */
    function clearTerminal() {
        terminalOutput.innerHTML = '';
    }
    
    /**
     * Update the cursor position based on input text
     */
    function updateCursorPosition() {
        // Get the text content up to where the cursor is
        const inputValue = terminalInput.value;
        const cursorPosition = terminalInput.selectionStart;
        
        // Create a temporary span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = getComputedStyle(terminalInput).font;
        tempSpan.textContent = inputValue.substring(0, cursorPosition);
        document.body.appendChild(tempSpan);
        
        // Set cursor position
        cursor.style.left = tempSpan.offsetWidth + 'px';
        
        // Clean up
        document.body.removeChild(tempSpan);
    }
    
    /**
     * Navigate through command history
     */
    function navigateHistory(direction) {
        if (commandHistory.length === 0) return;
        
        if (direction === 'up') {
            historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        } else {
            historyIndex = Math.max(historyIndex - 1, -1);
        }
        
        if (historyIndex === -1) {
            terminalInput.value = '';
        } else {
            terminalInput.value = commandHistory[historyIndex];
            
            // Move cursor to end of input
            setTimeout(() => {
                terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
                updateCursorPosition();
            }, 0);
        }
    }
    
    /**
     * Autocomplete command
     */
    function autocompleteCommand() {
        const input = terminalInput.value.toLowerCase();
        
        if (!input) return;
        
        // List of available commands
        const availableCommands = [
            'about', 'clear', 'cls', 'contact', 'date', 'download', 
            'echo', 'education', 'experience', 'help', 'projects', 'skills', 
            'social', 'whoami'
        ];
        
        // Find matching commands
        const matches = availableCommands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            // Exact match - complete the command
            terminalInput.value = matches[0];
            updateCursorPosition();
        } else if (matches.length > 1) {
            // Multiple matches - show possibilities
            addOutput(`<span class="prompt">user@portfolio:~$</span> ${input}`);
            addOutput(`Possible commands: ${matches.join(', ')}`);
            
            // Find common prefix
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > input.length) {
                terminalInput.value = commonPrefix;
                updateCursorPosition();
            }
        }
    }
    
    /**
     * Find common prefix among an array of strings
     */
    function findCommonPrefix(strings) {
        if (strings.length === 0) return '';
        if (strings.length === 1) return strings[0];
        
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            let j = 0;
            while (j < prefix.length && j < strings[i].length && 
                   prefix[j] === strings[i][j]) {
                j++;
            }
            prefix = prefix.substring(0, j);
        }
        
        return prefix;
    }
    
    /**
     * Handle Ctrl+C command interruption
     */
    function handleCtrlC() {
        addOutput(`<span class="prompt">user@portfolio:~$</span> ^C`);
        terminalInput.value = '';
        updateCursorPosition();
    }
    
    /**
     * Toggle sound effects
     */
    function toggleSound() {
        soundEnabled = !soundEnabled;
        toggleSoundBtn.innerHTML = soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
            
        // Add notification
        const message = soundEnabled ? "Sound effects enabled" : "Sound effects disabled";
        addOutput(`<span class="info">${message}</span>`);
    }
    
    /**
     * Play a sound effect if sound is enabled
     */
    function playSound(audioElement) {
        if (soundEnabled && audioElement) {
            // Reset audio to beginning
            audioElement.currentTime = 0;
            
            // Some browsers require user interaction before playing audio
            try {
                audioElement.play().catch(error => {
                    // Silence the error - this is expected if no user interaction yet
                });
            } catch (error) {
                // Fallback for older browsers
            }
        }
    }
    
    /**
     * Toggle fullscreen mode
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen().catch(err => {
                addOutput(`<span class="error">Error attempting to enable fullscreen: ${err.message}</span>`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            // Exit fullscreen
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    
    // Listen for fullscreen change to update button
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    /**
     * Command implementations
     */
    
    function showHelp() {
        const helpContent = document.getElementById('help-content').innerHTML;
        addOutputSection(helpContent);
    }
    
    function showAbout() {
        const aboutContent = document.getElementById('about-content').innerHTML;
        addOutputSection(aboutContent);
    }
    
    function showSkills() {
        const skillsContent = document.getElementById('skills-content').innerHTML;
        addOutputSection(skillsContent);
    }
    
    function showProjects() {
        const projectsContent = document.getElementById('projects-content').innerHTML;
        addOutputSection(projectsContent);
    }
    
    function showExperience() {
        const experienceContent = document.getElementById('experience-content').innerHTML;
        addOutputSection(experienceContent);
    }
    
    function showEducation() {
        const educationContent = document.getElementById('education-content').innerHTML;
        addOutputSection(educationContent);
    }
    
    function showContact() {
        const contactContent = document.getElementById('contact-content').innerHTML;
        addOutputSection(contactContent);
        
        // Initialize contact form handling
        initContactForm();
    }
    
    function echo(text) {
        addOutput(text);
    }
    
    function whoami() {
        addOutput(`<span class="highlight">user</span> - Portfolio Terminal Access`);
        addOutput(`Access Level: <span class="highlight">Visitor</span>`);
    }
    
    function showDate() {
        const now = new Date();
        addOutput(`Current Date: <span class="highlight">${now.toLocaleDateString()}</span>`);
        addOutput(`Current Time: <span class="highlight">${now.toLocaleTimeString()}</span>`);
    }
    
    function showSocial() {
        addOutput(`<h3>Social Links</h3>`);
        addOutput(`<ul class="social-links">
            <li><span class="label">GitHub:</span> <a href="https://github.com/your-username" target="_blank">github.com/your-username</a></li>
            <li><span class="label">LinkedIn:</span> <a href="https://linkedin.com/in/your-profile" target="_blank">linkedin.com/in/your-profile</a></li>
            <li><span class="label">Twitter:</span> <a href="https://twitter.com/your-handle" target="_blank">@your-handle</a></li>
        </ul>`);
    }
    
    function downloadResume() {
        addOutput(`<span class="processing">Initiating secure download</span>`);
        
        setTimeout(() => {
            addOutput(`<span class="success">Download complete: resume.pdf</span>`);
            
            // Simulate download by creating a link and clicking it
            const link = document.createElement('a');
            link.href = 'assets/resume.pdf'; // Path to your resume file
            link.download = 'YourName_Resume.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // Try to download the file
            try {
                link.click();
            } catch (error) {
                addOutput(`<span class="error">Download failed. Please try again later.</span>`);
            }
            
            document.body.removeChild(link);
        }, 2000);
    }
    
    /**
     * Initialize contact form handling
     */
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                if (!name || !email || !message) {
                    addOutput(`<span class="error">All fields are required.</span>`);
                    return;
                }
                
                // Simulate sending the message
                addOutput(`<span class="processing">Encrypting and sending message</span>`);
                
                setTimeout(() => {
                    // Hide the form and show success message
                    contactForm.style.display = 'none';
                    document.querySelector('.contact-response').style.display = 'block';
                    
                    // Add success message to terminal
                    addOutput(`<span class="success">Message sent successfully!</span>`);
                }, 2000);
            });
        }
    }
    
    // Expose necessary functions to window object for global access
    window.terminalFunctions = {
        addOutput,
        addOutputSection,
        clearTerminal,
        playSound
    };
});
