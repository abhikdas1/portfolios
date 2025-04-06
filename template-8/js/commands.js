/**
 * Commands for the terminal portfolio
 * Contains additional command handlers and implementations
 */

// Initialize the commands object
const commands = {};

/**
 * Display system information
 */
commands.system = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    // If functions not available, show error
    if (!terminalFunctions) {
        console.error("Terminal functions not available");
        return;
    }
    
    // Header
    terminalFunctions.addOutput(`<h3>System Information</h3>`);
    
    // Create a table for system info
    const infoTable = [
        { label: "OS", value: "TerminalOS 1.0" },
        { label: "Kernel", value: "Portfolio.js 5.4.2" },
        { label: "Shell", value: "hack.sh 3.2.1" },
        { label: "Resolution", value: `${window.innerWidth}x${window.innerHeight}` },
        { label: "Browser", value: navigator.userAgent.split(' ').slice(-1)[0] },
        { label: "Memory", value: "64MB / 128MB" },
        { label: "Uptime", value: getUptime() }
    ];
    
    // Display system info
    terminalFunctions.addOutput(`<div class="system-info">`);
    infoTable.forEach(info => {
        terminalFunctions.addOutput(`<div class="system-row"><span class="label">${info.label}:</span> <span>${info.value}</span></div>`);
    });
    terminalFunctions.addOutput(`</div>`);
    
    // Display ASCII art logo
    terminalFunctions.addOutput(`
<pre class="ascii-small">
  _______                    _             _    ___  ____  
 |__   __|                  (_)           | |  / _ \\/ __ \\ 
    | | ___ _ __ _ __ ___    _ _ __   __ _| | | | | | |  | |
    | |/ _ \\ '__| '_ \` _ \\  | | '_ \\ / _\` | | | | | | |  | |
    | |  __/ |  | | | | | | | | | | | (_| | | | |_| | |__| |
    |_|\\___|_|  |_| |_| |_| |_|_| |_|\\__,_|_|  \\___/ \\____/ 
</pre>`);
};

/**
 * Calculate system uptime
 */
function getUptime() {
    // Use a fake start time since page load
    if (!window.fakeStartTime) {
        // Create a fake start time from 1-24 hours ago
        const hoursAgo = Math.floor(Math.random() * 24) + 1;
        window.fakeStartTime = Date.now() - (hoursAgo * 60 * 60 * 1000);
    }
    
    const uptime = Date.now() - window.fakeStartTime;
    const seconds = Math.floor(uptime / 1000) % 60;
    const minutes = Math.floor(uptime / (1000 * 60)) % 60;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    
    return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Matrix effect command
 */
commands.matrix = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    terminalFunctions.addOutput(`<span class="success">Initiating Matrix sequence...</span>`);
    
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.className = 'matrix-overlay';
    overlay.innerHTML = `
        <div class="matrix-content">
            <pre class="matrix-text"></pre>
            <div class="matrix-close">Press ESC or click here to exit</div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Add styles if not already present
    if (!document.getElementById('matrix-styles')) {
        const style = document.createElement('style');
        style.id = 'matrix-styles';
        style.textContent = `
            .matrix-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #00FF00;
                font-family: monospace;
                overflow: hidden;
            }
            
            .matrix-content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .matrix-text {
                overflow: hidden;
                font-size: 14px;
                line-height: 1.2;
                white-space: pre;
                text-align: left;
                margin: 0;
                flex: 1;
                width: 100%;
                padding: 20px;
            }
            
            .matrix-close {
                padding: 10px;
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                animation: blink 1s infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const matrixText = overlay.querySelector('.matrix-text');
    const width = Math.floor(window.innerWidth / 14); // Approximate character width
    const height = Math.floor(window.innerHeight / 20); // Approximate character height
    
    // Create initial matrix
    let matrix = [];
    for (let i = 0; i < height; i++) {
        let row = '';
        for (let j = 0; j < width; j++) {
            row += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        matrix.push(row);
    }
    
    // Update matrix
    function updateMatrix() {
        // Shift rows up
        matrix.shift();
        
        // Add new row at bottom
        let newRow = '';
        for (let j = 0; j < width; j++) {
            newRow += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        matrix.push(newRow);
        
        // Update display
        matrixText.textContent = matrix.join('\n');
    }
    
    // Start matrix animation
    const matrixInterval = setInterval(updateMatrix, 100);
    
    // Close matrix
    function closeMatrix() {
        clearInterval(matrixInterval);
        overlay.remove();
    }
    
    // Add close event listeners
    overlay.querySelector('.matrix-close').addEventListener('click', closeMatrix);
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeMatrix();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
};

/**
 * Edit a file (simulated)
 */
commands.edit = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    if (!args || args.length === 0) {
        terminalFunctions.addOutput(`<span class="error">Usage: edit [filename]</span>`);
        return;
    }
    
    const filename = args[0];
    terminalFunctions.addOutput(`<span class="info">Opening ${filename} in editor...</span>`);
    
    // Create a simple text editor
    const editorContent = document.createElement('div');
    editorContent.className = 'editor-content';
    editorContent.innerHTML = `
        <div class="editor-header">
            <div class="editor-title">${filename}</div>
            <div class="editor-controls">
                <button class="editor-save">Save</button>
                <button class="editor-close">Close</button>
            </div>
        </div>
        <div class="editor-body">
            <textarea class="editor-textarea" spellcheck="false">// This is a simulated file.
// You can edit this content, but changes won't be saved.

function helloWorld() {
    console.log("Hello, World!");
    return true;
}

// Edit me!
</textarea>
        </div>
    `;
    
    // Add styles for editor
    if (!document.getElementById('editor-styles')) {
        const style = document.createElement('style');
        style.id = 'editor-styles';
        style.textContent = `
            .editor-content {
                background-color: #1E1E1E;
                border: 1px solid #333;
                border-radius: 4px;
                margin: 10px 0;
                height: 300px;
                display: flex;
                flex-direction: column;
            }
            
            .editor-header {
                background-color: #333;
                padding: 5px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .editor-title {
                color: #fff;
                font-weight: bold;
            }
            
            .editor-controls {
                display: flex;
                gap: 5px;
            }
            
            .editor-controls button {
                background-color: #444;
                color: #fff;
                border: none;
                padding: 3px 8px;
                border-radius: 3px;
                cursor: pointer;
            }
            
            .editor-controls button:hover {
                background-color: #555;
            }
            
            .editor-body {
                flex: 1;
                padding: 5px;
            }
            
            .editor-textarea {
                width: 100%;
                height: 100%;
                background-color: #1E1E1E;
                color: #00FF00;
                border: none;
                resize: none;
                font-family: monospace;
                font-size: 14px;
                padding: 5px;
            }
            
            .editor-textarea:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add editor to terminal output
    terminalFunctions.addOutput(editorContent.outerHTML);
    
    // Setup event listeners
    const editorElements = document.querySelectorAll('.editor-content');
    const editor = editorElements[editorElements.length - 1]; // Get the last one we just added
    
    editor.querySelector('.editor-save').addEventListener('click', function() {
        terminalFunctions.addOutput(`<span class="success">File saved: ${filename}</span>`);
    });
    
    editor.querySelector('.editor-close').addEventListener('click', function() {
        editor.remove();
        terminalFunctions.addOutput(`<span class="info">Editor closed</span>`);
    });
};

/**
 * Fake directory listing
 */
commands.ls = commands.dir = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    // Fake file structure
    const files = [
        { name: "about.txt", type: "file", size: "4.2 KB", date: "01/15/2023" },
        { name: "contact.md", type: "file", size: "2.1 KB", date: "03/20/2023" },
        { name: "projects", type: "directory", size: "-", date: "05/10/2023" },
        { name: "resume.pdf", type: "file", size: "1.8 MB", date: "04/05/2023" },
        { name: "skills.json", type: "file", size: "8.7 KB", date: "02/28/2023" },
        { name: "images", type: "directory", size: "-", date: "01/30/2023" },
        { name: "blog", type: "directory", size: "-", date: "06/12/2023" },
        { name: ".hidden", type: "file", size: "0.1 KB", date: "12/25/2022" }
    ];
    
    // Check for flags
    const showHidden = args && args.includes('-a');
    const showDetails = args && args.includes('-l');
    
    if (showDetails) {
        // Detailed listing
        terminalFunctions.addOutput(`<div class="file-list-header">
            <span class="file-type">Type</span>
            <span class="file-size">Size</span>
            <span class="file-date">Date</span>
            <span class="file-name">Name</span>
        </div>`);
        
        files.forEach(file => {
            // Skip hidden files unless -a flag is provided
            if (file.name.startsWith('.') && !showHidden) return;
            
            const iconClass = file.type === 'directory' ? 'fa-folder' : 'fa-file-alt';
            const nameClass = file.type === 'directory' ? 'directory-name' : 'file-name';
            
            terminalFunctions.addOutput(`<div class="file-item">
                <span class="file-type"><i class="fas ${iconClass}"></i> ${file.type}</span>
                <span class="file-size">${file.size}</span>
                <span class="file-date">${file.date}</span>
                <span class="${nameClass}">${file.name}</span>
            </div>`);
        });
    } else {
        // Simple listing
        let output = '<div class="simple-file-list">';
        
        files.forEach(file => {
            // Skip hidden files unless -a flag is provided
            if (file.name.startsWith('.') && !showHidden) return;
            
            const iconClass = file.type === 'directory' ? 'fa-folder' : 'fa-file-alt';
            const nameClass = file.type === 'directory' ? 'directory-name' : 'file-name';
            
            output += `<span class="file-item-simple">
                <i class="fas ${iconClass}"></i> <span class="${nameClass}">${file.name}</span>
            </span>`;
        });
        
        output += '</div>';
        terminalFunctions.addOutput(output);
    }
    
    // Add styles for file listing if not already present
    if (!document.getElementById('file-list-styles')) {
        const style = document.createElement('style');
        style.id = 'file-list-styles';
        style.textContent = `
            .file-list-header, .file-item {
                display: grid;
                grid-template-columns: 100px 100px 100px 1fr;
                gap: 10px;
                padding: 5px 0;
            }
            
            .file-list-header {
                border-bottom: 1px solid #333;
                font-weight: bold;
                color: var(--terminal-highlight);
            }
            
            .directory-name {
                color: var(--terminal-highlight);
                font-weight: bold;
            }
            
            .simple-file-list {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .file-item-simple {
                margin-right: 10px;
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Fake cat command to display file contents
 */
commands.cat = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    if (!args || args.length === 0) {
        terminalFunctions.addOutput(`<span class="error">Usage: cat [filename]</span>`);
        return;
    }
    
    const filename = args[0];
    
    // Fake file contents
    const fileContents = {
        'about.txt': `
# About Me

Hi there! I'm a developer specializing in web technologies and cybersecurity.
With a passion for creating secure, efficient applications, I focus on delivering
high-quality solutions that meet modern standards.

## Core Competencies

- Full-stack web development
- Cybersecurity & penetration testing
- Performance optimization
- Responsive design

Feel free to explore my portfolio to see examples of my work!
        `,
        'skills.json': `
{
  "technical": {
    "languages": [
      {"name": "JavaScript", "proficiency": 90},
      {"name": "Python", "proficiency": 85},
      {"name": "HTML/CSS", "proficiency": 95},
      {"name": "Java", "proficiency": 75}
    ],
    "frameworks": [
      {"name": "React", "proficiency": 85},
      {"name": "Node.js", "proficiency": 80},
      {"name": "Express", "proficiency": 75}
    ],
    "databases": [
      {"name": "MongoDB", "proficiency": 80},
      {"name": "MySQL", "proficiency": 75},
      {"name": "PostgreSQL", "proficiency": 70}
    ]
  },
  "soft": [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Adaptability"
  ]
}
        `,
        'contact.md': `
# Contact Information

Feel free to reach out through any of the following channels:

- **Email**: your.email@example.com
- **LinkedIn**: linkedin.com/in/your-profile
- **GitHub**: github.com/your-username
- **Twitter**: @your-handle

## Preferred Contact Method

The best way to reach me is via email. I typically respond within 24 hours.

---
Looking forward to connecting with you!
        `
    };
    
    if (fileContents[filename]) {
        // Display file content
        terminalFunctions.addOutput(`<div class="file-content"><pre>${fileContents[filename]}</pre></div>`);
        
        // Add styles for file content
        if (!document.getElementById('file-content-styles')) {
            const style = document.createElement('style');
            style.id = 'file-content-styles';
            style.textContent = `
                .file-content {
                    background-color: rgba(0, 255, 0, 0.05);
                    border: 1px solid #333;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 4px;
                    overflow-x: auto;
                }
                
                .file-content pre {
                    margin: 0;
                    white-space: pre-wrap;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        terminalFunctions.addOutput(`<span class="error">File not found: ${filename}</span>`);
    }
};

/**
 * Fake network status
 */
commands.ifconfig = commands.ipconfig = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    const interfaces = [
        {
            name: "eth0",
            status: "UP",
            mac: "00:1A:2B:3C:4D:5E",
            ipv4: "192.168.1.100",
            netmask: "255.255.255.0",
            ipv6: "fe80::1a2b:3c4d:5e6f:7a8b"
        },
        {
            name: "wlan0",
            status: "UP",
            mac: "01:2C:3D:4E:5F:6A",
            ipv4: "10.0.0.150",
            netmask: "255.255.0.0",
            ipv6: "fe80::12c3:d4e5:f6a7:b8c9"
        }
    ];
    
    terminalFunctions.addOutput(`<div class="network-info">`);
    
    interfaces.forEach(iface => {
        terminalFunctions.addOutput(`<div class="interface-header">${iface.name}: <span class="highlight">${iface.status}</span></div>`);
        terminalFunctions.addOutput(`<div class="interface-details">
            <div class="interface-detail"><span class="label">MAC Address:</span> ${iface.mac}</div>
            <div class="interface-detail"><span class="label">IPv4 Address:</span> ${iface.ipv4}</div>
            <div class="interface-detail"><span class="label">Subnet Mask:</span> ${iface.netmask}</div>
            <div class="interface-detail"><span class="label">IPv6 Address:</span> ${iface.ipv6}</div>
        </div>`);
    });
    
    terminalFunctions.addOutput(`</div>`);
    
    // Add styles for network info
    if (!document.getElementById('network-info-styles')) {
        const style = document.createElement('style');
        style.id = 'network-info-styles';
        style.textContent = `
            .network-info {
                margin: 10px 0;
            }
            
            .interface-header {
                font-weight: bold;
                margin-top: 10px;
            }
            
            .interface-details {
                margin-left: 20px;
                margin-bottom: 10px;
            }
            
            .interface-detail {
                display: flex;
                margin: 5px 0;
            }
            
            .interface-detail .label {
                min-width: 120px;
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Simulate ping command
 */
commands.ping = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    if (!args || args.length === 0) {
        terminalFunctions.addOutput(`<span class="error">Usage: ping [host]</span>`);
        return;
    }
    
    const host = args[0];
    
    terminalFunctions.addOutput(`<span class="info">PING ${host} (127.0.0.1) 56(84) bytes of data.</span>`);
    
    let pingCount = 0;
    const pingInterval = setInterval(() => {
        const time = Math.floor(Math.random() * 100) + 10;
        
        terminalFunctions.addOutput(`<span>64 bytes from ${host} (127.0.0.1): icmp_seq=${pingCount + 1} ttl=64 time=${time} ms</span>`);
        
        pingCount++;
        if (pingCount >= 4) {
            clearInterval(pingInterval);
            
            setTimeout(() => {
                terminalFunctions.addOutput(`
                <span class="info">--- ${host} ping statistics ---</span>
                <span>4 packets transmitted, 4 received, 0% packet loss, time 3005ms</span>
                <span>rtt min/avg/max/mdev = ${Math.floor(Math.random() * 50) + 10}/${Math.floor(Math.random() * 50) + 50}/${Math.floor(Math.random() * 50) + 100}/${Math.floor(Math.random() * 10) + 5} ms</span>
                `);
            }, 200);
        }
    }, 1000);
};

/**
 * ASCII art generator
 */
commands.ascii = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    // Different ASCII art options
    const artOptions = {
        "hacker": `
 _   _            _             
| | | | __ _  ___| | _____ _ __ 
| |_| |/ _\` |/ __| |/ / _ \\ '__|
|  _  | (_| | (__|   <  __/ |   
|_| |_|\\__,_|\\___|_|\\_\\___|_|   
`,
        "computer": `
  _____                            _            
 / ____|                          | |           
| |     ___  _ __ ___  _ __  _   _| |_ ___ _ __ 
| |    / _ \\| '_ \` _ \\| '_ \\| | | | __/ _ \\ '__|
| |___| (_) | | | | | | |_) | |_| | ||  __/ |   
 \\_____\\___/|_| |_| |_| .__/ \\__,_|\\__\\___|_|   
                      | |                       
                      |_|                       
`,
        "terminal": `
 _______                    _             _ 
|__   __|                  (_)           | |
   | | ___ _ __ _ __ ___    _ _ __   __ _| |
   | |/ _ \\ '__| '_ \` _ \\  | | '_ \\ / _\` | |
   | |  __/ |  | | | | | | | | | | | (_| | |
   |_|\\___|_|  |_| |_| |_| |_|_| |_|\\__,_|_|
`,
        "code": `
  _____          _      
 / ____|        | |     
| |     ___   __| | ___ 
| |    / _ \\ / _\` |/ _ \\
| |___| (_) | (_| |  __/
 \\_____\\___/ \\__,_|\\___|
`,
        "portfolio": `
 _____           _    __       _ _       
|  __ \\         | |  / _|     | (_)      
| |__) |__  _ __| |_| |_ _   _| |_  ___  
|  ___/ _ \\| '__| __|  _| | | | | |/ _ \\ 
| |  | (_) | |  | |_| | | |_| | | | (_) |
|_|   \\___/|_|   \\__|_|  \\__,_|_|_|\\___/ 
`
    };
    
    // If no args, show list of available art
    if (!args || args.length === 0) {
        terminalFunctions.addOutput(`<span class="info">Available ASCII art:</span>`);
        terminalFunctions.addOutput(`<span>${Object.keys(artOptions).join(', ')}</span>`);
        return;
    }
    
    const artName = args[0].toLowerCase();
    
    if (artOptions[artName]) {
        terminalFunctions.addOutput(`<pre class="ascii-art">${artOptions[artName]}</pre>`);
    } else {
        terminalFunctions.addOutput(`<span class="error">ASCII art not found: ${artName}</span>`);
        terminalFunctions.addOutput(`<span class="info">Available options: ${Object.keys(artOptions).join(', ')}</span>`);
    }
};

/**
 * Display weather (simulated)
 */
commands.weather = function(args) {
    const terminalFunctions = window.terminalFunctions;
    const location = args && args.length > 0 ? args[0] : "localhost";
    
    // Simulate weather fetching
    terminalFunctions.addOutput(`<span class="processing">Fetching weather for ${location}...</span>`);
    
    setTimeout(() => {
        // Random weather conditions
        const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm", "Snowy", "Foggy", "Clear"];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const temperature = Math.floor(Math.random() * 35) + 5; // 5-40°C
        const humidity = Math.floor(Math.random() * 50) + 30; // 30-80%
        const windSpeed = Math.floor(Math.random() * 30) + 5; // 5-35 km/h
        
        // ASCII art for weather condition
        let weatherArt = '';
        switch (randomCondition) {
            case "Sunny":
                weatherArt = `
    \\   /
     .-.
  ― (   ) ―
     \`-'
    /   \\
`;
                break;
            case "Partly Cloudy":
            case "Cloudy":
                weatherArt = `
   \\  /
 _ /\"\".-.
   \\_(   ).
   /(___(__) 
`;
                break;
            case "Rainy":
                weatherArt = `
     .-.
    (   ).
   (___(__)
    ' ' ' '
   ' ' ' '
`;
                break;
            case "Thunderstorm":
                weatherArt = `
     .-.
    (   ).
   (___(__)
  ⚡' '⚡' ⚡
   ' ' ' '
`;
                break;
            default:
                weatherArt = `
    .-.
   (   ).
  (___(__)
`;
                break;
        }
        
        // Display weather info
        terminalFunctions.addOutput(`
<div class="weather-display">
    <pre class="weather-art">${weatherArt}</pre>
    <div class="weather-info">
        <div class="weather-location">${location}</div>
        <div class="weather-condition">${randomCondition}</div>
        <div class="weather-temp">${temperature}°C</div>
        <div class="weather-details">
            <span>Humidity: ${humidity}%</span>
            <span>Wind: ${windSpeed} km/h</span>
        </div>
    </div>
</div>
`);
        
        // Add styles for weather display
        if (!document.getElementById('weather-styles')) {
            const style = document.createElement('style');
            style.id = 'weather-styles';
            style.textContent = `
                .weather-display {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin: 10px 0;
                    padding: 10px;
                    background-color: rgba(0, 255, 0, 0.05);
                    border-radius: 4px;
                }
                
                .weather-art {
                    font-family: monospace;
                    color: var(--terminal-highlight);
                    margin: 0;
                }
                
                .weather-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .weather-location {
                    font-weight: bold;
                    font-size: 1.2em;
                    color: var(--terminal-highlight);
                }
                
                .weather-condition {
                    margin: 5px 0;
                }
                
                .weather-temp {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .weather-details {
                    display: flex;
                    gap: 15px;
                    color: var(--terminal-text-dim);
                }
            `;
            document.head.appendChild(style);
        }
    }, 1500);
};

/**
 * Simulate hacking (just for fun)
 */
commands.hack = function(args) {
    const terminalFunctions = window.terminalFunctions;
    
    if (!args || args.length === 0) {
        terminalFunctions.addOutput(`<span class="error">Usage: hack [target]</span>`);
        return;
    }
    
    const target = args[0];
    
    // Show warning
    terminalFunctions.addOutput(`<span class="warning">WARNING: This is a simulated hacking demonstration for entertainment purposes only.</span>`);
    terminalFunctions.addOutput(`<span class="warning">No actual hacking is taking place.</span>`);
    
    // Start "hacking" sequence
    terminalFunctions.addOutput(`<span class="info">Initializing hack on target: ${target}</span>`);
    
    const hackingSteps = [
        "Scanning target for vulnerabilities...",
        "Running port scan on target system...",
        "Identifying open services and versions...",
        "Checking for known exploits in database...",
        "Attempting exploit #1...",
        "Exploit failed. Trying alternative approach...",
        "Executing brute force on detected services...",
        "Gaining initial access...",
        "Elevating privileges...",
        "Establishing persistent backdoor...",
        "Covering tracks and removing logs...",
        "Extracting sensitive data..."
    ];
    
    let currentStep = 0;
    
    const hackInterval = setInterval(() => {
        if (currentStep < hackingSteps.length) {
            const step = hackingSteps[currentStep];
            terminalFunctions.addOutput(`<span class="processing">${step}</span>`);
            currentStep++;
        } else {
            clearInterval(hackInterval);
            
            // Finish the sequence
            setTimeout(() => {
                terminalFunctions.addOutput(`<span class="success">Hack complete!</span>`);
                terminalFunctions.addOutput(`<span class="info">Just kidding! This was just a harmless simulation.</span>`);
                
                // ASCII art
                terminalFunctions.addOutput(`
<pre class="ascii-small">
  _   _            _     _____  _             _      _           _ _ 
 | | | | __ _  ___| | __/ ____|(_)           | |    | |         | | |
 | |_| |/ _\` |/ __| |/ / (___   _ _ __ ___  _| | ___| |_ ___  __| | |
 |  _  | (_| | (__|   <\\___ \\  | | '_ \` _ \\/ / |/ _ \\ __/ _ \\/ _\` | |
 | | | |\\__,_|\\___|_|\\_\\____/  | | | | | | | | |  __/ ||  __/ (_| |_|
 |_| |_|               |______/ |_|_| |_| |_|_|\\___|\\__\\___|\\__,_(_)
</pre>`);
            }, 500);
        }
    }, 800);
};

// Export the commands object (if using modules)
// If not using modules, it's already available globally
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = commands;
}
