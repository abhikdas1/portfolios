/**
 * Windows.js - Handles window management for Windows-themed Portfolio
 * Manages windows creation, movement, resizing, and taskbar integration
 */

class WindowManager {
    constructor() {
        this.windows = {};
        this.activeWindow = null;
        this.taskItems = {};
        this.startMenuVisible = false;
        
        // DOM Elements
        this.taskItemsContainer = document.querySelector('.task-items');
        this.startMenuButton = document.querySelector('.start-menu-button');
        this.startMenu = document.querySelector('.start-menu');
        
        // Window states tracking
        this.movingWindow = null;
        this.resizingWindow = null;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Initialize
        this.initWindows();
        this.initDesktopIcons();
        this.initStartMenu();
        this.initTaskbar();
        this.setupGlobalEvents();
        this.addWelcomeNotification();
        
        // Do NOT open welcome window by default anymore
        // Instead, show a welcome notification
    }
    
    initWindows() {
        // Add each window to the windows object
        document.querySelectorAll('.window').forEach(windowEl => {
            const windowId = windowEl.getAttribute('data-window-id');
            
            // Create resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'window-resize-handle';
            windowEl.appendChild(resizeHandle);
            
            // Store window data
            this.windows[windowId] = {
                element: windowEl,
                minimized: false,
                maximized: false
            };
            
            // Setup window controls
            this.setupWindowControls(windowId);
            
            // Setup window movement
            this.setupWindowMovement(windowId);
            
            // Setup window resizing
            this.setupWindowResizing(windowId);
            
            // Add to taskbar
            this.addTaskbarItem(windowId);
        });
    }
    
    setupWindowControls(windowId) {
        const windowEl = this.windows[windowId].element;
        
        // Minimize button
        windowEl.querySelector('.window-control.minimize').addEventListener('click', () => {
            this.minimizeWindow(windowId);
        });
        
        // Maximize button
        windowEl.querySelector('.window-control.maximize').addEventListener('click', () => {
            this.toggleMaximizeWindow(windowId);
        });
        
        // Close button
        windowEl.querySelector('.window-control.close').addEventListener('click', () => {
            this.closeWindow(windowId);
        });
        
        // Double click header to maximize
        windowEl.querySelector('.window-header').addEventListener('dblclick', (e) => {
            // Only trigger if not clicking on controls
            if (!e.target.closest('.window-control')) {
                this.toggleMaximizeWindow(windowId);
            }
        });
        
        // Focus window on click
        windowEl.addEventListener('mousedown', () => {
            this.activateWindow(windowId);
        });
    }
    
    setupWindowMovement(windowId) {
        const windowEl = this.windows[windowId].element;
        const header = windowEl.querySelector('.window-header');
        
        header.addEventListener('mousedown', (e) => {
            // Only start dragging if not clicking on controls
            if (!e.target.closest('.window-control') && !this.windows[windowId].maximized) {
                e.preventDefault();
                this.startWindowMove(windowId, e.clientX, e.clientY);
            }
        });
    }
    
    setupWindowResizing(windowId) {
        const windowEl = this.windows[windowId].element;
        const resizeHandle = windowEl.querySelector('.window-resize-handle');
        
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startWindowResize(windowId, e.clientX, e.clientY);
        });
    }
    
    startWindowMove(windowId, initialX, initialY) {
        const windowEl = this.windows[windowId].element;
        
        // Calculate offset from the top-left corner of the window
        const rect = windowEl.getBoundingClientRect();
        this.offsetX = initialX - rect.left;
        this.offsetY = initialY - rect.top;
        
        this.movingWindow = windowId;
        windowEl.classList.add('moving');
        
        document.addEventListener('mousemove', this.handleWindowMove);
        document.addEventListener('mouseup', this.stopWindowMove);
    }
    
    handleWindowMove = (e) => {
        if (!this.movingWindow) return;
        
        const windowEl = this.windows[this.movingWindow].element;
        const windowsContainer = document.querySelector('.windows-container');
        const containerRect = windowsContainer.getBoundingClientRect();
        
        // Calculate new position
        let newX = e.clientX - this.offsetX;
        let newY = e.clientY - this.offsetY;
        
        // Constrain to container boundaries
        newX = Math.max(0, Math.min(newX, containerRect.width - windowEl.offsetWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - windowEl.offsetHeight));
        
        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;
    }
    
    stopWindowMove = () => {
        if (this.movingWindow) {
            const windowEl = this.windows[this.movingWindow].element;
            windowEl.classList.remove('moving');
            this.movingWindow = null;
            
            document.removeEventListener('mousemove', this.handleWindowMove);
            document.removeEventListener('mouseup', this.stopWindowMove);
        }
    }
    
    startWindowResize(windowId, initialX, initialY) {
        this.resizingWindow = windowId;
        const windowEl = this.windows[windowId].element;
        this.initialWidth = windowEl.offsetWidth;
        this.initialHeight = windowEl.offsetHeight;
        this.initialX = initialX;
        this.initialY = initialY;
        
        document.addEventListener('mousemove', this.handleWindowResize);
        document.addEventListener('mouseup', this.stopWindowResize);
    }
    
    handleWindowResize = (e) => {
        if (!this.resizingWindow) return;
        
        const windowEl = this.windows[this.resizingWindow].element;
        
        // Calculate width and height change
        const deltaX = e.clientX - this.initialX;
        const deltaY = e.clientY - this.initialY;
        
        // Set new dimensions with minimum size constraints
        const newWidth = Math.max(300, this.initialWidth + deltaX);
        const newHeight = Math.max(200, this.initialHeight + deltaY);
        
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
    }
    
    stopWindowResize = () => {
        this.resizingWindow = null;
        document.removeEventListener('mousemove', this.handleWindowResize);
        document.removeEventListener('mouseup', this.stopWindowResize);
    }
    
    openWindow(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        const windowEl = windowData.element;
        
        // Position window if it hasn't been positioned yet
        if (!windowEl.style.top) {
            this.positionWindowCenter(windowId);
        }
        
        // Update window state
        windowData.minimized = false;
        windowEl.classList.add('visible');
        
        // Activate the window
        this.activateWindow(windowId);
        
        // Update taskbar
        this.updateTaskbarItem(windowId);
    }
    
    closeWindow(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        const windowEl = windowData.element;
        
        // Reset window state
        windowData.minimized = false;
        windowData.maximized = false;
        windowEl.classList.remove('visible', 'maximized');
        
        // If this was the active window, clear active state
        if (this.activeWindow === windowId) {
            this.activeWindow = null;
            
            // Activate the top-most visible window, if any
            const visibleWindows = Object.keys(this.windows).filter(id => 
                this.windows[id].element.classList.contains('visible') && !this.windows[id].minimized
            );
            
            if (visibleWindows.length > 0) {
                // Find the window with the highest z-index
                const topWindow = visibleWindows.reduce((prev, curr) => {
                    const prevZ = parseInt(getComputedStyle(this.windows[prev].element).zIndex) || 0;
                    const currZ = parseInt(getComputedStyle(this.windows[curr].element).zIndex) || 0;
                    return currZ > prevZ ? curr : prev;
                }, visibleWindows[0]);
                
                this.activateWindow(topWindow);
            }
        }
        
        // Update taskbar
        this.updateTaskbarItem(windowId);
    }
    
    minimizeWindow(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        
        windowData.minimized = true;
        windowData.element.classList.add('minimized');
        
        // If this is the active window, find another window to activate
        if (this.activeWindow === windowId) {
            this.activeWindow = null;
            
            // Find another visible non-minimized window
            const nextWindow = Object.keys(this.windows).find(id => 
                id !== windowId && 
                this.windows[id].element.classList.contains('visible') && 
                !this.windows[id].minimized
            );
            
            if (nextWindow) {
                this.activateWindow(nextWindow);
            }
        }
        
        // Update taskbar
        this.updateTaskbarItem(windowId);
    }
    
    toggleMaximizeWindow(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        const windowEl = windowData.element;
        
        // Toggle maximized state
        windowData.maximized = !windowData.maximized;
        
        if (windowData.maximized) {
            // Store current size and position before maximizing
            windowData.prevSize = {
                width: windowEl.style.width,
                height: windowEl.style.height,
                top: windowEl.style.top,
                left: windowEl.style.left
            };
            
            windowEl.classList.add('maximized');
        } else {
            // Restore previous size and position
            if (windowData.prevSize) {
                windowEl.style.width = windowData.prevSize.width;
                windowEl.style.height = windowData.prevSize.height;
                windowEl.style.top = windowData.prevSize.top;
                windowEl.style.left = windowData.prevSize.left;
            }
            
            windowEl.classList.remove('maximized');
        }
        
        // Make sure the window is activated
        this.activateWindow(windowId);
    }
    
    activateWindow(windowId) {
        if (!this.windows[windowId]) return;
        
        // Deactivate current active window
        if (this.activeWindow && this.activeWindow !== windowId) {
            const prevActive = this.windows[this.activeWindow].element;
            prevActive.classList.remove('active');
            this.updateTaskbarItem(this.activeWindow);
        }
        
        // Activate new window
        this.activeWindow = windowId;
        const windowEl = this.windows[windowId].element;
        
        windowEl.classList.add('active');
        
        // Ensure window is visible and not minimized
        this.windows[windowId].element.classList.add('visible');
        
        if (this.windows[windowId].minimized) {
            this.windows[windowId].minimized = false;
            windowEl.classList.remove('minimized');
        }
        
        // Update z-index to bring window to front
        const maxZ = Math.max(
            ...Object.values(this.windows).map(w => 
                parseInt(getComputedStyle(w.element).zIndex) || 0
            )
        );
        
        windowEl.style.zIndex = maxZ + 1;
        
        // Update taskbar
        this.updateTaskbarItem(windowId);
        
        // Hide start menu when activating a window
        this.hideStartMenu();
    }
    
    positionWindowRandomly(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowEl = this.windows[windowId].element;
        const container = document.querySelector('.windows-container');
        
        // Calculate safe areas to ensure window is fully visible
        const maxLeft = container.offsetWidth - windowEl.offsetWidth;
        const maxTop = container.offsetHeight - windowEl.offsetHeight;
        
        // Random position within safe areas
        const left = Math.min(Math.max(20, Math.random() * maxLeft), maxLeft - 20);
        const top = Math.min(Math.max(20, Math.random() * maxTop), maxTop - 20);
        
        windowEl.style.left = `${left}px`;
        windowEl.style.top = `${top}px`;
    }
    
    // New method to center windows properly on screen
    positionWindowCenter(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowEl = this.windows[windowId].element;
        const container = document.querySelector('.windows-container');
        
        // Get window and container dimensions
        const windowWidth = windowEl.offsetWidth;
        const windowHeight = windowEl.offsetHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Calculate center position
        const left = (containerWidth - windowWidth) / 2;
        const top = (containerHeight - windowHeight) / 2;
        
        // Apply position with small random offset to prevent exact overlap
        const randomOffset = 30; // pixels
        windowEl.style.left = `${left + (Math.random() * randomOffset - randomOffset/2)}px`;
        windowEl.style.top = `${top + (Math.random() * randomOffset - randomOffset/2)}px`;
    }
    
    // New method to cascade windows
    cascadeWindows() {
        const windowIds = Object.keys(this.windows);
        const offsetStep = 30; // pixels between each window
        
        windowIds.forEach((windowId, index) => {
            const windowEl = this.windows[windowId].element;
            
            // Only position visible, non-maximized windows
            if (windowEl.classList.contains('visible') && !this.windows[windowId].maximized) {
                windowEl.style.left = `${100 + index * offsetStep}px`;
                windowEl.style.top = `${50 + index * offsetStep}px`;
            }
        });
        
        // Show notification about window arrangement
        this.showNotification("Windows Arranged", "Windows have been cascaded for better visibility", "info");
    }
    
    // New method to tile windows
    tileWindows() {
        const visibleWindows = Object.keys(this.windows).filter(id => 
            this.windows[id].element.classList.contains('visible') && 
            !this.windows[id].minimized
        );
        
        if (visibleWindows.length === 0) return;
        
        const container = document.querySelector('.windows-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Determine grid layout based on number of windows
        let cols, rows;
        if (visibleWindows.length <= 2) {
            cols = visibleWindows.length;
            rows = 1;
        } else if (visibleWindows.length <= 4) {
            cols = 2;
            rows = Math.ceil(visibleWindows.length / 2);
        } else {
            cols = 3;
            rows = Math.ceil(visibleWindows.length / 3);
        }
        
        // Calculate dimensions
        const width = containerWidth / cols;
        const height = containerHeight / rows;
        
        // Position each window
        visibleWindows.forEach((windowId, index) => {
            const windowEl = this.windows[windowId].element;
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            // Position and resize
            windowEl.style.left = `${col * width}px`;
            windowEl.style.top = `${row * height}px`;
            windowEl.style.width = `${width}px`;
            windowEl.style.height = `${height}px`;
        });
        
        // Show notification about window arrangement
        this.showNotification("Windows Tiled", "Windows have been arranged in a grid", "info");
    }
    
    // New method to minimize all windows
    minimizeAllWindows() {
        Object.keys(this.windows).forEach(windowId => {
            if (this.windows[windowId].element.classList.contains('visible') && 
                !this.windows[windowId].minimized) {
                this.minimizeWindow(windowId);
            }
        });
        
        // Show notification
        this.showNotification("Windows Minimized", "All windows have been minimized", "info");
    }
    
    addTaskbarItem(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowEl = this.windows[windowId].element;
        const windowTitle = windowEl.querySelector('.window-title span').textContent;
        const windowIcon = windowEl.querySelector('.window-icon').cloneNode(true);
        
        // Create task item
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-window-id', windowId);
        
        // Add content
        taskItem.innerHTML = `
            <div class="task-item-icon">${windowIcon.outerHTML}</div>
            <span>${windowTitle}</span>
        `;
        
        // Add click handler
        taskItem.addEventListener('click', () => {
            this.toggleWindowFromTaskbar(windowId);
        });
        
        // Add to taskbar
        this.taskItemsContainer.appendChild(taskItem);
        
        // Store reference
        this.taskItems[windowId] = taskItem;
    }
    
    updateTaskbarItem(windowId) {
        if (!this.taskItems[windowId]) return;
        
        const taskItem = this.taskItems[windowId];
        const windowData = this.windows[windowId];
        
        // Update active state
        if (this.activeWindow === windowId) {
            taskItem.classList.add('active');
        } else {
            taskItem.classList.remove('active');
        }
        
        // Update visibility
        if (windowData.element.classList.contains('visible')) {
            taskItem.classList.add('visible');
        } else {
            taskItem.classList.remove('visible');
        }
    }
    
    toggleWindowFromTaskbar(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        
        if (this.activeWindow === windowId && !windowData.minimized) {
            // If already active, minimize it
            this.minimizeWindow(windowId);
        } else if (windowData.minimized) {
            // If minimized, restore it
            windowData.minimized = false;
            windowData.element.classList.remove('minimized');
            this.activateWindow(windowId);
        } else {
            // Otherwise activate it
            this.activateWindow(windowId);
        }
    }
    
    initDesktopIcons() {
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        
        desktopIcons.forEach(icon => {
            const windowId = icon.getAttribute('data-window');
            
            // Double click to open window
            icon.addEventListener('dblclick', () => {
                this.openWindow(windowId);
            });
            
            // Single click to select icon
            icon.addEventListener('click', (e) => {
                // First deselect all
                desktopIcons.forEach(i => i.classList.remove('selected'));
                
                // Then select this one
                icon.classList.add('selected');
                
                // Prevent event from bubbling to document
                e.stopPropagation();
            });
        });
        
        // Click on desktop to deselect all icons
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.desktop-icon')) {
                desktopIcons.forEach(i => i.classList.remove('selected'));
            }
            
            // Close start menu if clicking outside
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-menu-button')) {
                this.hideStartMenu();
            }
        });
        
        // Add desktop context menu
        this.setupDesktopContextMenu();
    }
    
    // New method for desktop right-click menu
    setupDesktopContextMenu() {
        const desktopBg = document.querySelector('.desktop-bg');
        
        // Create context menu if it doesn't exist
        if (!document.querySelector('.context-menu')) {
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" data-action="refresh">
                    <i class="fas fa-sync-alt"></i> Refresh
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="view">
                    <i class="fas fa-th-large"></i> View
                </div>
                <div class="context-menu-item" data-action="sort">
                    <i class="fas fa-sort"></i> Sort by
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="cascade">
                    <i class="fas fa-layer-group"></i> Cascade Windows
                </div>
                <div class="context-menu-item" data-action="tile">
                    <i class="fas fa-th"></i> Tile Windows
                </div>
                <div class="context-menu-item" data-action="minimize-all">
                    <i class="fas fa-window-minimize"></i> Minimize All Windows
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="welcome">
                    <i class="fas fa-home"></i> Open Welcome
                </div>
            `;
            document.body.appendChild(contextMenu);
            
            // Handle context menu actions
            contextMenu.addEventListener('click', (e) => {
                const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
                
                if (action) {
                    switch (action) {
                        case 'refresh':
                            this.showNotification("Refreshed", "Desktop refreshed", "info");
                            break;
                        case 'cascade':
                            this.cascadeWindows();
                            break;
                        case 'tile':
                            this.tileWindows();
                            break;
                        case 'minimize-all':
                            this.minimizeAllWindows();
                            break;
                        case 'welcome':
                            this.openWindow('welcome');
                            break;
                    }
                }
                
                // Hide the context menu
                contextMenu.classList.remove('visible');
            });
        }
        
        // Add right-click handler to desktop
        desktopBg.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            const contextMenu = document.querySelector('.context-menu');
            
            // Position the menu at the cursor
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            
            // Show the menu
            contextMenu.classList.add('visible');
        });
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', () => {
            document.querySelector('.context-menu')?.classList.remove('visible');
        });
    }
    
    initStartMenu() {
        // Toggle start menu
        this.startMenuButton.addEventListener('click', () => {
            this.toggleStartMenu();
        });
        
        // Handle menu item clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            const windowId = item.getAttribute('data-window');
            if (windowId) {
                item.addEventListener('click', () => {
                    this.openWindow(windowId);
                    this.hideStartMenu();
                });
            }
        });
        
        // Handle power button
        document.querySelector('.power-button').addEventListener('click', () => {
            this.showNotification('System message', 'Thanks for visiting my portfolio!', 'info');
            this.hideStartMenu();
        });
        
        // Add "All Windows" section to start menu
        this.enhanceStartMenu();
    }
    
    // New method to enhance start menu functionality
    enhanceStartMenu() {
        const startContent = document.querySelector('.start-content');
        
        // Add window management section
        const windowManagementCategory = document.createElement('div');
        windowManagementCategory.className = 'menu-category';
        windowManagementCategory.innerHTML = `
            <h3>Window Management</h3>
            <div class="menu-items window-management-items">
                <div class="menu-item" data-action="cascade">
                    <div class="menu-icon"><i class="fas fa-layer-group"></i></div>
                    <div class="menu-text">Cascade Windows</div>
                </div>
                <div class="menu-item" data-action="tile">
                    <div class="menu-icon"><i class="fas fa-th"></i></div>
                    <div class="menu-text">Tile Windows</div>
                </div>
                <div class="menu-item" data-action="minimize-all">
                    <div class="menu-icon"><i class="fas fa-window-minimize"></i></div>
                    <div class="menu-text">Minimize All</div>
                </div>
            </div>
        `;
        
        startContent.appendChild(windowManagementCategory);
        
        // Add event listeners for window management actions
        const managementItems = document.querySelectorAll('.window-management-items .menu-item');
        managementItems.forEach(item => {
            const action = item.getAttribute('data-action');
            
            item.addEventListener('click', () => {
                switch (action) {
                    case 'cascade':
                        this.cascadeWindows();
                        break;
                    case 'tile':
                        this.tileWindows();
                        break;
                    case 'minimize-all':
                        this.minimizeAllWindows();
                        break;
                }
                
                this.hideStartMenu();
            });
        });
    }
    
    toggleStartMenu() {
        this.startMenuVisible = !this.startMenuVisible;
        
        if (this.startMenuVisible) {
            this.startMenu.classList.add('visible');
            this.startMenuButton.classList.add('active');
        } else {
            this.hideStartMenu();
        }
    }
    
    hideStartMenu() {
        this.startMenuVisible = false;
        this.startMenu.classList.remove('visible');
        this.startMenuButton.classList.remove('active');
    }
    
    initTaskbar() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Add taskbar context menu
        this.setupTaskbarContextMenu();
    }
    
    // New method for taskbar right-click menu
    setupTaskbarContextMenu() {
        const taskbar = document.querySelector('.taskbar');
        
        taskbar.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.task-item')) return; // Don't show for task items
            
            e.preventDefault();
            
            // Create and show taskbar context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu taskbar-context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" data-action="cascade">
                    <i class="fas fa-layer-group"></i> Cascade Windows
                </div>
                <div class="context-menu-item" data-action="tile">
                    <i class="fas fa-th"></i> Tile Windows
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="minimize-all">
                    <i class="fas fa-window-minimize"></i> Minimize All Windows
                </div>
                <div class="context-menu-item" data-action="task-manager">
                    <i class="fas fa-tasks"></i> Task Manager
                </div>
            `;
            
            // Position the menu
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY - contextMenu.offsetHeight}px`;
            
            // Add to document
            document.body.appendChild(contextMenu);
            
            // Show the menu
            contextMenu.classList.add('visible');
            
            // Handle menu item clicks
            contextMenu.addEventListener('click', (e) => {
                const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
                
                if (action) {
                    switch (action) {
                        case 'cascade':
                            this.cascadeWindows();
                            break;
                        case 'tile':
                            this.tileWindows();
                            break;
                        case 'minimize-all':
                            this.minimizeAllWindows();
                            break;
                        case 'task-manager':
                            this.showTaskManager();
                            break;
                    }
                }
                
                // Remove the menu
                contextMenu.remove();
            });
            
            // Remove menu when clicking elsewhere
            const removeMenu = () => {
                contextMenu.remove();
                document.removeEventListener('click', removeMenu);
            };
            
            document.addEventListener('click', removeMenu);
        });
    }
    
    // New method to show a simple task manager
    showTaskManager() {
        // Create a task manager window if it doesn't exist
        if (!document.getElementById('task-manager-window')) {
            const taskManagerWindow = document.createElement('div');
            taskManagerWindow.className = 'window';
            taskManagerWindow.id = 'task-manager-window';
            taskManagerWindow.setAttribute('data-window-id', 'task-manager');
            
            taskManagerWindow.innerHTML = `
                <div class="window-header">
                    <div class="window-title">
                        <i class="fas fa-tasks window-icon"></i>
                        <span>Task Manager</span>
                    </div>
                    <div class="window-controls">
                        <button class="window-control minimize"><i class="fas fa-window-minimize"></i></button>
                        <button class="window-control maximize"><i class="fas fa-window-maximize"></i></button>
                        <button class="window-control close"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="window-content">
                    <div class="task-manager-container">
                        <h3>Running Processes</h3>
                        <div class="task-list">
                            <div class="task-header">
                                <div class="task-name">Name</div>
                                <div class="task-status">Status</div>
                                <div class="task-memory">Memory</div>
                                <div class="task-actions">Actions</div>
                            </div>
                            <div class="task-items-list">
                                <!-- Task items will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="window-statusbar">
                    <div class="status-item">System running normally</div>
                </div>
            `;
            
            document.querySelector('.windows-container').appendChild(taskManagerWindow);
            
            // Add CSS for task manager
            const style = document.createElement('style');
            style.textContent = `
                .task-manager-container {
                    padding: var(--space-md);
                }
                
                .task-list {
                    background-color: white;
                    border: 1px solid var(--win-border);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                }
                
                .task-header {
                    display: grid;
                    grid-template-columns: 3fr 1fr 1fr 1fr;
                    background-color: var(--win-primary);
                    color: white;
                    font-weight: 600;
                    padding: var(--space-xs);
                }
                
                .task-items-list {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .task-item-row {
                    display: grid;
                    grid-template-columns: 3fr 1fr 1fr 1fr;
                    padding: var(--space-xs);
                    border-bottom: 1px solid var(--win-border);
                    align-items: center;
                }
                
                .task-item-row:hover {
                    background-color: var(--win-btn-hover);
                }
                
                .task-actions button {
                    background-color: var(--win-btn-hover);
                    border: 1px solid var(--win-border);
                    padding: 2px 8px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                }
                
                .task-actions button:hover {
                    background-color: var(--win-btn-active);
                }
            `;
            document.head.appendChild(style);
            
            // Set up the window
            this.windows['task-manager'] = {
                element: taskManagerWindow,
                minimized: false,
                maximized: false
            };
            
            // Setup window controls
            this.setupWindowControls('task-manager');
            
            // Setup window movement
            this.setupWindowMovement('task-manager');
            
            // Setup window resizing
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'window-resize-handle';
            taskManagerWindow.appendChild(resizeHandle);
            this.setupWindowResizing('task-manager');
            
            // Add to taskbar
            this.addTaskbarItem('task-manager');
        }
        
        // Populate running processes list
        this.updateTaskManagerList();
        
        // Open the task manager window
        this.openWindow('task-manager');
    }
    
    // Helper method to update task manager list
    updateTaskManagerList() {
        const taskItemsList = document.querySelector('.task-items-list');
        if (!taskItemsList) return;
        
        // Clear existing items
        taskItemsList.innerHTML = '';
        
        // Add an item for each open window
        Object.keys(this.windows).forEach(windowId => {
            const windowData = this.windows[windowId];
            const windowTitle = windowData.element.querySelector('.window-title span').textContent;
            const isMinimized = windowData.minimized;
            const isActive = this.activeWindow === windowId;
            
            // Create task item row
            const taskRow = document.createElement('div');
            taskRow.className = 'task-item-row';
            
            taskRow.innerHTML = `
                <div class="task-name">${windowTitle}</div>
                <div class="task-status">${isMinimized ? 'Minimized' : (isActive ? 'Active' : 'Running')}</div>
                <div class="task-memory">${Math.floor(Math.random() * 100)}MB</div>
                <div class="task-actions">
                    <button data-action="switch" data-window="${windowId}">Switch to</button>
                    <button data-action="end" data-window="${windowId}">End Task</button>
                </div>
            `;
            
            // Add event listeners
            taskRow.querySelectorAll('button').forEach(button => {
                const action = button.getAttribute('data-action');
                const targetWindowId = button.getAttribute('data-window');
                
                button.addEventListener('click', () => {
                    if (action === 'switch') {
                        this.activateWindow(targetWindowId);
                    } else if (action === 'end') {
                        this.closeWindow(targetWindowId);
                        this.updateTaskManagerList();
                    }
                });
            });
            
            taskItemsList.appendChild(taskRow);
        });
    }
    
    updateClock() {
        const timeDisplay = document.getElementById('current-time');
        const dateDisplay = document.getElementById('current-date');
        
        const now = new Date();
        
        // Update time (12-hour format)
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert to 12-hour format
        
        timeDisplay.textContent = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        // Update date
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    showNotification(title, message, type = 'info') {
        const notificationCenter = document.querySelector('.notification-center');
        
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <h4 class="notification-title">${title}</h4>
                <p class="notification-message">${message}</p>
            </div>
        `;
        
        // Add to notification center
        notificationCenter.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info':
            default: return 'fa-info-circle';
        }
    }
    
    // New method to show welcome notification
    addWelcomeNotification() {
        setTimeout(() => {
            this.showNotification(
                'Welcome to Windows Portfolio',
                'Double-click on desktop icons or use the Start Menu to navigate',
                'info'
            );
        }, 1500);
    }
    
    setupGlobalEvents() {
        // Handle ESC key to close start menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideStartMenu();
                
                // Also close contextmenus
                document.querySelectorAll('.context-menu').forEach(menu => {
                    menu.classList.remove('visible');
                });
                
                // Also close active window if Ctrl+Esc is pressed
                if (e.ctrlKey && this.activeWindow) {
                    this.closeWindow(this.activeWindow);
                }
            }
            
            // Add Keyboard shortcuts
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'd': // Minimize all windows (like Win+D)
                        e.preventDefault();
                        this.minimizeAllWindows();
                        break;
                    case 'w': // Close active window
                        if (this.activeWindow) {
                            e.preventDefault();
                            this.closeWindow(this.activeWindow);
                        }
                        break;
                }
            }
        });
        
        // Prevent drag and drop from opening files
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }
}

// Initialize window manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.windowManager = new WindowManager();
});
