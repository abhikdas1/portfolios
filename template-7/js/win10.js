/**
 * Windows 10 JavaScript for Portfolio Template 7
 * Handles windows management, taskbar, start menu, and other UI interactions
 */

class Win10Manager {
    constructor() {
        this.windows = {};
        this.activeWindow = null;
        this.taskItems = {};
        this.startMenuVisible = false;
        this.actionCenterVisible = false;
        
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
        this.initActionCenter();
        this.initContextMenu();
        this.setupGlobalEvents();
        
        // Show welcome notification
        this.showWelcomeNotification();
    }
    
    initWindows() {
        // Add each window to the windows object
        document.querySelectorAll('.window').forEach(windowEl => {
            const windowId = windowEl.getAttribute('data-window-id');
            
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
                this.movingWindow = windowId;
                
                // Calculate offset from the top-left corner of the window
                const rect = windowEl.getBoundingClientRect();
                this.offsetX = e.clientX - rect.left;
                this.offsetY = e.clientY - rect.top;
                
                document.addEventListener('mousemove', this.handleWindowMove);
                document.addEventListener('mouseup', this.stopWindowMove);
            }
        });
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
        windowEl.style.transform = 'none';
    }
    
    stopWindowMove = () => {
        this.movingWindow = null;
        document.removeEventListener('mousemove', this.handleWindowMove);
        document.removeEventListener('mouseup', this.stopWindowMove);
    }
    
    setupWindowResizing(windowId) {
        const windowEl = this.windows[windowId].element;
        
        // Create resize handle if it doesn't exist
        if (!windowEl.querySelector('.window-resize-handle')) {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'window-resize-handle';
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.right = '0';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.width = '15px';
            resizeHandle.style.height = '15px';
            resizeHandle.style.cursor = 'nwse-resize';
            windowEl.appendChild(resizeHandle);
            
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resizingWindow = windowId;
                this.initialWidth = windowEl.offsetWidth;
                this.initialHeight = windowEl.offsetHeight;
                this.initialX = e.clientX;
                this.initialY = e.clientY;
                
                document.addEventListener('mousemove', this.handleWindowResize);
                document.addEventListener('mouseup', this.stopWindowResize);
            });
        }
    }
    
    handleWindowResize = (e) => {
        if (!this.resizingWindow) return;
        
        const windowEl = this.windows[this.resizingWindow].element;
        
        // Calculate width and height change
        const deltaX = e.clientX - this.initialX;
        const deltaY = e.clientY - this.initialY;
        
        // Set new dimensions with minimum size constraints
        const newWidth = Math.max(400, this.initialWidth + deltaX);
        const newHeight = Math.max(300, this.initialHeight + deltaY);
        
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
        if (!windowEl.style.left && !windowEl.style.right) {
            this.positionWindowCenter(windowId);
        }
        
        // Update window state
        windowData.minimized = false;
        windowEl.classList.add('visible');
        windowEl.classList.remove('minimized');
        
        // Activate the window
        this.activateWindow(windowId);
        
        // Update taskbar
        this.updateTaskbarItem(windowId);
        
        // Close start menu if open
        this.hideStartMenu();
        
        // Add opening sound
        this.playSound('open');
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
        
        // Add closing sound
        this.playSound('close');
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
        
        // Add minimize sound
        this.playSound('minimize');
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
                left: windowEl.style.left,
                transform: windowEl.style.transform
            };
            
            windowEl.classList.add('maximized');
        } else {
            // Restore previous size and position
            if (windowData.prevSize) {
                windowEl.style.width = windowData.prevSize.width;
                windowEl.style.height = windowData.prevSize.height;
                windowEl.style.top = windowData.prevSize.top;
                windowEl.style.left = windowData.prevSize.left;
                windowEl.style.transform = windowData.prevSize.transform;
            }
            
            windowEl.classList.remove('maximized');
        }
        
        // Make sure the window is activated
        this.activateWindow(windowId);
        
        // Play sound
        this.playSound('maximize');
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
        windowEl.classList.add('visible');
        
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
        this.hideActionCenter();
    }
    
    positionWindowCenter(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowEl = this.windows[windowId].element;
        const container = document.querySelector('.windows-container');
        
        // Reset transform to properly calculate dimensions
        windowEl.style.transform = 'none';
        
        // Get window and container dimensions
        const windowWidth = windowEl.offsetWidth || 800;
        const windowHeight = windowEl.offsetHeight || 600;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Calculate center position
        const left = (containerWidth - windowWidth) / 2;
        const top = (containerHeight - windowHeight) / 2;
        
        // Apply position with small random offset for staggered appearance
        const offsetRange = 30;
        const randomOffsetX = Math.floor(Math.random() * offsetRange) - offsetRange / 2;
        const randomOffsetY = Math.floor(Math.random() * offsetRange) - offsetRange / 2;
        
        windowEl.style.left = `${left + randomOffsetX}px`;
        windowEl.style.top = `${top + randomOffsetY}px`;
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
            <div class="task-item-title">${windowTitle}</div>
        `;
        
        // Add click handler
        taskItem.addEventListener('click', () => {
            this.toggleWindowFromTaskbar(windowId);
        });
        
        // Add to taskbar
        document.querySelector('.task-items').appendChild(taskItem);
        
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
        if (windowData.element.classList.contains('visible') && !windowData.minimized) {
            taskItem.classList.add('running');
        } else {
            taskItem.classList.remove('running');
        }
    }
    
    toggleWindowFromTaskbar(windowId) {
        if (!this.windows[windowId]) return;
        
        const windowData = this.windows[windowId];
        
        if (!windowData.element.classList.contains('visible')) {
            // If not visible, open it
            this.openWindow(windowId);
        } else if (this.activeWindow === windowId && !windowData.minimized) {
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
                // Special case for recycle bin
                if (windowId === 'recycle') {
                    this.showRecycleBin();
                    return;
                }
                
                this.openWindow(windowId);
            });
            
            // Single click to select icon
            icon.addEventListener('click', (e) => {
                // Deselect all icons
                desktopIcons.forEach(i => i.classList.remove('selected'));
                
                // Select this one
                icon.classList.add('selected');
                
                // Prevent event from bubbling to document
                e.stopPropagation();
            });
        });
        
        // Click on desktop to deselect all icons
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.desktop-icon') && !e.target.closest('.context-menu')) {
                desktopIcons.forEach(i => i.classList.remove('selected'));
            }
        });
    }
    
    showRecycleBin() {
        // Show a notification that this is just for demo purposes
        this.showNotification(
            'Recycle Bin',
            'This is a demo feature. The Recycle Bin is empty.',
            'info'
        );
    }
    
    initStartMenu() {
        const startBtn = document.querySelector('.start-btn');
        const startMenu = document.querySelector('.start-menu');
        
        // Toggle start menu when clicking the start button
        startBtn.addEventListener('click', () => {
            this.toggleStartMenu();
        });
        
        // Handle start menu items
        document.querySelectorAll('.start-menu-item, .start-tile').forEach(item => {
            const windowId = item.getAttribute('data-window');
            if (windowId) {
                item.addEventListener('click', () => {
                    // Special case for recycle bin
                    if (windowId === 'recycle') {
                        this.showRecycleBin();
                        this.hideStartMenu();
                        return;
                    }
                    
                    this.openWindow(windowId);
                    this.hideStartMenu();
                });
            }
        });
        
        // Handle power button
        document.querySelector('.power-btn').addEventListener('click', () => {
            this.showPowerDialog();
        });
        
        // Handle settings button
        document.querySelector('.settings-btn').addEventListener('click', () => {
            this.showNotification(
                'Settings',
                'The settings menu is not available in this demo.',
                'info'
            );
        });
        
        // Hide start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.startMenuVisible && !e.target.closest('.start-menu') && !e.target.closest('.start-btn')) {
                this.hideStartMenu();
            }
        });
    }
    
    toggleStartMenu() {
        this.startMenuVisible = !this.startMenuVisible;
        
        const startMenu = document.querySelector('.start-menu');
        const startBtn = document.querySelector('.start-btn');
        
        if (this.startMenuVisible) {
            startMenu.classList.add('visible');
            startBtn.classList.add('active');
            
            // Close action center if open
            this.hideActionCenter();
            
            // Play sound
            this.playSound('startMenu');
        } else {
            this.hideStartMenu();
        }
    }
    
    hideStartMenu() {
        this.startMenuVisible = false;
        
        const startMenu = document.querySelector('.start-menu');
        const startBtn = document.querySelector('.start-btn');
        
        startMenu.classList.remove('visible');
        startBtn.classList.remove('active');
    }
    
    showPowerDialog() {
        // Create a simple power dialog
        const dialog = document.createElement('div');
        dialog.className = 'power-dialog';
        dialog.innerHTML = `
            <div class="power-dialog-content">
                <div class="power-dialog-header">
                    <h3>Power Options</h3>
                    <button class="power-dialog-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="power-dialog-body">
                    <button class="power-option sleep">
                        <i class="fas fa-moon"></i>
                        <span>Sleep</span>
                    </button>
                    <button class="power-option shutdown">
                        <i class="fas fa-power-off"></i>
                        <span>Shut down</span>
                    </button>
                    <button class="power-option restart">
                        <i class="fas fa-redo"></i>
                        <span>Restart</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('power-dialog-styles')) {
            const styles = document.createElement('style');
            styles.id = 'power-dialog-styles';
            styles.textContent = `
                .power-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .power-dialog-content {
                    background-color: #222;
                    border-radius: 4px;
                    width: 300px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                
                .power-dialog-header {
                    padding: 10px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }
                
                .power-dialog-header h3 {
                    margin: 0;
                    color: white;
                    font-size: 16px;
                    font-weight: 400;
                }
                
                .power-dialog-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                .power-dialog-body {
                    padding: 15px;
                    display: flex;
                    justify-content: space-around;
                }
                
                .power-option {
                    background: none;
                    border: none;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px;
                    width: 80px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .power-option:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                
                .power-option i {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                
                .power-option.sleep i {
                    color: #0078D7;
                }
                
                .power-option.shutdown i {
                    color: #E81123;
                }
                
                .power-option.restart i {
                    color: #FFB900;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to DOM
        document.body.appendChild(dialog);
        
        // Hide start menu
        this.hideStartMenu();
        
        // Add event listeners
        dialog.querySelector('.power-dialog-close').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelectorAll('.power-option').forEach(option => {
            option.addEventListener('click', () => {
                const action = option.classList.contains('sleep') ? 'sleep' :
                               option.classList.contains('shutdown') ? 'shutdown' : 'restart';
                
                dialog.remove();
                
                this.showNotification(
                    'Power Option',
                    `This is a demo. In a real system, the computer would ${action} now.`,
                    'info'
                );
            });
        });
        
        // Close when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }
    
    initTaskbar() {
        // Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Setup search box
        this.setupSearchBox();
    }
    
    updateClock() {
        const timeDisplay = document.getElementById('current-time');
        const dateDisplay = document.getElementById('current-date');
        
        if (timeDisplay && dateDisplay) {
            const now = new Date();
            
            // Format time
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12
            
            timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
            
            // Format date
            const month = now.toLocaleString('default', { month: 'short' });
            const day = now.getDate();
            const year = now.getFullYear();
            
            dateDisplay.textContent = `${month} ${day}, ${year}`;
        }
    }
    
    setupSearchBox() {
        const searchInput = document.querySelector('.search-box input');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim().toLowerCase();
                    this.performSearch(searchTerm);
                    searchInput.value = '';
                }
            });
        }
    }
    
    performSearch(searchTerm) {
        if (!searchTerm) return;
        
        // Find windows that match the search term
        const matchedWindows = Object.keys(this.windows).filter(windowId => {
            const windowEl = this.windows[windowId].element;
            const windowTitle = windowEl.querySelector('.window-title span').textContent.toLowerCase();
            return windowTitle.includes(searchTerm);
        });
        
        if (matchedWindows.length > 0) {
            // Open the first matched window
            this.openWindow(matchedWindows[0]);
            
            // Show notification
            this.showNotification(
                'Search Result',
                `Found and opened "${this.windows[matchedWindows[0]].element.querySelector('.window-title span').textContent}"`,
                'success'
            );
        } else {
            // No matches found
            this.showNotification(
                'Search Result',
                `No matches found for "${searchTerm}"`,
                'info'
            );
        }
    }
    
    initActionCenter() {
        const actionCenterBtn = document.querySelector('.action-center');
        const actionCenter = document.querySelector('.action-center');
        
        // Toggle action center when clicking the button
        actionCenterBtn.addEventListener('click', () => {
            this.toggleActionCenter();
        });
        
        // Handle clear all button
        const clearAllBtn = actionCenter.querySelector('.clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.clearAllNotifications();
            });
        }
        
        // Setup quick action buttons
        this.setupQuickActions();
    }
    
    toggleActionCenter() {
        this.actionCenterVisible = !this.actionCenterVisible;
        
        const actionCenter = document.querySelector('.action-center');
        const actionCenterBtn = document.querySelector('.taskbar-right .action-center');
        
        if (this.actionCenterVisible) {
            actionCenter.classList.add('visible');
            actionCenterBtn.classList.add('active');
            
            // Close start menu if open
            this.hideStartMenu();
        } else {
            this.hideActionCenter();
        }
    }
    
    hideActionCenter() {
        this.actionCenterVisible = false;
        
        const actionCenter = document.querySelector('.action-center');
        const actionCenterBtn = document.querySelector('.taskbar-right .action-center');
        
        actionCenter.classList.remove('visible');
        actionCenterBtn.classList.remove('active');
    }
    
    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        
        quickActionBtns.forEach(btn => {
            const action = btn.getAttribute('data-action');
            
            btn.addEventListener('click', () => {
                // Toggle active state
                btn.classList.toggle('active');
                
                // Show notification
                this.showNotification(
                    'Quick Action',
                    `${action.charAt(0).toUpperCase() + action.slice(1)} ${btn.classList.contains('active') ? 'enabled' : 'disabled'}`,
                    'info'
                );
            });
        });
    }
    
    clearAllNotifications() {
        const notificationsContainer = document.querySelector('.notifications-container');
        
        if (notificationsContainer) {
            notificationsContainer.innerHTML = '';
            
            // Add empty state message
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-notifications';
            emptyState.innerHTML = `
                <i class="fas fa-bell-slash"></i>
                <p>No new notifications</p>
            `;
            notificationsContainer.appendChild(emptyState);
            
            // Add styles for empty state if needed
            if (!document.getElementById('empty-notifications-style')) {
                const style = document.createElement('style');
                style.id = 'empty-notifications-style';
                style.textContent = `
                    .empty-notifications {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 30px;
                        color: rgba(255, 255, 255, 0.5);
                        text-align: center;
                    }
                    
                    .empty-notifications i {
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                    
                    .empty-notifications p {
                        margin: 0;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    initContextMenu() {
        const contextMenu = document.querySelector('.context-menu');
        
        // Right-click on desktop to show context menu
        document.querySelector('.desktop-bg').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Position the menu
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            
            // Show the menu
            contextMenu.style.display = 'block';
            
            // Ensure the menu doesn't go off screen
            const rect = contextMenu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                contextMenu.style.left = `${e.clientX - rect.width}px`;
            }
            
            if (rect.bottom > window.innerHeight) {
                contextMenu.style.top = `${e.clientY - rect.height}px`;
            }
        });
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });
        
        // Handle context menu items
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                
                // Handle different actions
                switch (action) {
                    case 'refresh':
                        this.showNotification('Desktop Refresh', 'Desktop refreshed successfully', 'success');
                        break;
                    case 'view':
                        this.showNotification('View Options', 'View options would be shown here', 'info');
                        break;
                    case 'new-folder':
                        this.showNotification('New Folder', 'This is a demo feature', 'info');
                        break;
                    case 'new-file':
                        this.showNotification('New File', 'This is a demo feature', 'info');
                        break;
                    case 'personalize':
                        this.openPersonalizationSettings();
                        break;
                }
                
                // Hide the context menu
                contextMenu.style.display = 'none';
            });
        });
    }
    
    openPersonalizationSettings() {
        // Create a simple personalization dialog
        const dialog = document.createElement('div');
        dialog.className = 'personalization-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>Personalization</h3>
                    <button class="dialog-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="dialog-body">
                    <div class="setting-group">
                        <h4>Background Color</h4>
                        <div class="color-options">
                            <button class="color-option" data-color="#0078D7" style="background-color: #0078D7;"></button>
                            <button class="color-option" data-color="#107C10" style="background-color: #107C10;"></button>
                            <button class="color-option" data-color="#5C2D91" style="background-color: #5C2D91;"></button>
                            <button class="color-option" data-color="#D83B01" style="background-color: #D83B01;"></button>
                            <button class="color-option" data-color="#FFB900" style="background-color: #FFB900;"></button>
                        </div>
                    </div>
                    <div class="setting-group">
                        <h4>Theme</h4>
                        <div class="theme-options">
                            <button class="theme-option active" data-theme="light">Light</button>
                            <button class="theme-option" data-theme="dark">Dark</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        if (!document.getElementById('personalization-dialog-styles')) {
            const styles = document.createElement('style');
            styles.id = 'personalization-dialog-styles';
            styles.textContent = `
                .personalization-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .dialog-content {
                    background-color: white;
                    border-radius: 4px;
                    width: 400px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                
                .dialog-header {
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .dialog-header h3 {
                    margin: 0;
                    font-size: 18px;
                }
                
                .dialog-close {
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                }
                
                .dialog-body {
                    padding: 15px;
                }
                
                .setting-group {
                    margin-bottom: 20px;
                }
                
                .setting-group h4 {
                    margin-top: 0;
                    margin-bottom: 10px;
                }
                
                .color-options, .theme-options {
                    display: flex;
                    gap: 10px;
                }
                
                .color-option {
                    width: 30px;
                    height: 30px;
                    border: 2px solid transparent;
                    border-radius: 50%;
                    cursor: pointer;
                }
                
                .color-option:hover, .color-option.active {
                    border-color: #333;
                }
                
                .theme-option {
                    padding: 8px 16px;
                    background-color: #f0f0f0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .theme-option:hover {
                    background-color: #e0e0e0;
                }
                
                .theme-option.active {
                    background-color: #0078D7;
                    color: white;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to DOM
        document.body.appendChild(dialog);
        
        // Close button
        dialog.querySelector('.dialog-close').addEventListener('click', () => {
            dialog.remove();
        });
        
        // Color options
        dialog.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                dialog.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Change background color
                const color = option.getAttribute('data-color');
                document.querySelector('.desktop-bg').style.backgroundColor = color;
                document.querySelector('.desktop-bg').style.backgroundImage = 'none';
            });
        });
        
        // Theme options
        dialog.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                dialog.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Apply theme
                const theme = option.getAttribute('data-theme');
                if (theme === 'dark') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            });
        });
        
        // Close when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }
    
    showWelcomeNotification() {
        setTimeout(() => {
            this.showNotification(
                'Welcome',
                'Welcome to your Windows 10 Portfolio! Click on desktop icons or use the Start Menu to explore.',
                'info'
            );
        }, 1500);
    }
    
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        
        const now = new Date();
        const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-app">${title}</div>
                <div class="notification-time">${timeStr}</div>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        // Add to notifications container
        const notificationsContainer = document.querySelector('.notifications-container');
        
        // Remove empty state if present
        const emptyState = notificationsContainer.querySelector('.empty-notifications');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Add notification at the top
        notificationsContainer.insertBefore(notification, notificationsContainer.firstChild);
        
        // Add remove button click handler
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
                
                // Add empty state if there are no notifications
                if (notificationsContainer.children.length === 0) {
                    this.clearAllNotifications();
                }
            }, 300);
        });
        
        // Auto remove after some time
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                        
                        // Add empty state if there are no notifications
                        if (notificationsContainer.children.length === 0) {
                            this.clearAllNotifications();
                        }
                    }
                }, 300);
            }
        }, 8000);
        
        // Play notification sound
        this.playSound('notification');
        
        // Also show a temporary toast notification
        this.showToast(title, message, type);
    }
    
    showToast(title, message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles for toasts
            const toastStyles = document.createElement('style');
            toastStyles.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 60px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    z-index: 1000;
                    pointer-events: none;
                }
                
                .toast {
                    background-color: #333;
                    color: white;
                    padding: 12px 15px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    max-width: 300px;
                    pointer-events: auto;
                    animation: toastIn 0.3s, toastOut 0.3s 4.7s forwards;
                    position: relative;
                    overflow: hidden;
                }
                
                .toast.info {
                    border-left: 4px solid #0078D7;
                }
                
                .toast.success {
                    border-left: 4px solid #107C10;
                }
                
                .toast.error {
                    border-left: 4px solid #E81123;
                }
                
                .toast.warning {
                    border-left: 4px solid #FFB900;
                }
                
                .toast-header {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .toast-message {
                    font-size: 13px;
                    opacity: 0.9;
                }
                
                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background-color: rgba(255, 255, 255, 0.3);
                    width: 100%;
                }
                
                .toast-progress-bar {
                    height: 100%;
                    background-color: #0078D7;
                    width: 100%;
                    animation: progressShrink 5s linear forwards;
                }
                
                .toast.info .toast-progress-bar {
                    background-color: #0078D7;
                }
                
                .toast.success .toast-progress-bar {
                    background-color: #107C10;
                }
                
                .toast.error .toast-progress-bar {
                    background-color: #E81123;
                }
                
                .toast.warning .toast-progress-bar {
                    background-color: #FFB900;
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
                
                @keyframes progressShrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `;
            document.head.appendChild(toastStyles);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-header">${title}</div>
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
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.animation = 'toastOut 0.3s forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
    playSound(soundName) {
        // Define sounds
        const sounds = {
            open: 'assets/sounds/open.mp3',
            close: 'assets/sounds/close.mp3',
            minimize: 'assets/sounds/minimize.mp3',
            maximize: 'assets/sounds/maximize.mp3',
            notification: 'assets/sounds/notification.mp3',
            startMenu: 'assets/sounds/start-menu.mp3'
        };
        
        // Check if sound exists
        if (!sounds[soundName]) return;
        
        // Create audio element
        const audio = new Audio(sounds[soundName]);
        
        // Try to play the sound, but don't worry if it fails
        // (this prevents console errors if sound files don't exist)
        try {
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (error) {
            // Ignore errors
        }
    }
    
    setupGlobalEvents() {
        // Windows key to toggle start menu
        document.addEventListener('keydown', (e) => {
            // Windows key is typically not accessible via JavaScript,
            // so we'll use Alt+Space as a substitute
            if (e.altKey && e.code === 'Space') {
                e.preventDefault();
                this.toggleStartMenu();
            }
            
            // Escape key to close start menu and action center
            if (e.key === 'Escape') {
                if (this.startMenuVisible) {
                    this.hideStartMenu();
                }
                
                if (this.actionCenterVisible) {
                    this.hideActionCenter();
                }
                
                // Also close context menu
                document.querySelector('.context-menu').style.display = 'none';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create window manager
    window.win10Manager = new Win10Manager();
});
