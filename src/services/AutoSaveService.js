// src/services/AutoSaveService.js
import { AppState } from "../AppState.js"

class AutoSaveService {
    constructor() {
        this.saveInterval = null
        this.lastSaveTime = Date.now()
        this.unsavedChanges = false
        this.isInitialized = false
    }

    /**
     * Initialize the auto-save system
     */
    initialize() {
        if (this.isInitialized) return

        console.log('Initializing auto-save system...')

        // Set up periodic auto-save (every 30 seconds)
        this.startPeriodicSave()

        // Set up event listeners for page unload
        this.setupUnloadListeners()

        // Set up visibility change listener (when tab becomes hidden)
        this.setupVisibilityListener()

        // Set up beforeunload warning if there are unsaved changes
        this.setupBeforeUnloadWarning()

        this.isInitialized = true
        console.log('Auto-save system initialized')
    }

    /**
     * Start periodic auto-save every 30 seconds
     */
    startPeriodicSave() {
        if (this.saveInterval) return

        this.saveInterval = setInterval(() => {
            if (AppState.gameSettings.autoSave && this.hasUnsavedChanges()) {
                this.performSave('periodic')
            }
        }, 30000) // Save every 30 seconds

        console.log('Periodic auto-save started (30 second intervals)')
    }

    /**
     * Stop periodic auto-save
     */
    stopPeriodicSave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval)
            this.saveInterval = null
            console.log('Periodic auto-save stopped')
        }
    }

    /**
     * Set up listeners for when the page is about to unload
     */
    setupUnloadListeners() {
        // Save when the page is being unloaded
        window.addEventListener('beforeunload', (event) => {
            console.log('Page unloading - performing final save...')
            this.performSave('page_unload')
        })

        // Save when the page loses focus (user switches tabs/apps)
        window.addEventListener('blur', () => {
            if (this.hasUnsavedChanges()) {
                console.log('Window lost focus - saving progress...')
                this.performSave('window_blur')
            }
        })

        // Also save on pagehide event (more reliable on mobile)
        window.addEventListener('pagehide', () => {
            console.log('Page hidden - performing save...')
            this.performSave('page_hide')
        })
    }

    /**
     * Set up listener for when the page visibility changes
     */
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page became hidden (tab switched, minimized, etc.)
                if (this.hasUnsavedChanges()) {
                    console.log('Page became hidden - saving progress...')
                    this.performSave('visibility_hidden')
                }
            } else {
                // Page became visible again
                console.log('Page became visible again')
                this.markAsChanged() // Reset the change tracking
            }
        })
    }

    /**
     * Set up warning message if user tries to leave with unsaved changes
     */
    setupBeforeUnloadWarning() {
        window.addEventListener('beforeunload', (event) => {
            // Only show warning if auto-save is disabled and there are unsaved changes
            if (!AppState.gameSettings.autoSave && this.hasUnsavedChanges()) {
                const message = 'You have unsaved progress. Are you sure you want to leave?'
                event.preventDefault()
                event.returnValue = message
                return message
            }
        })
    }

    /**
     * Perform the actual save operation
     * @param {string} trigger - What triggered this save
     */
    performSave(trigger = 'manual') {
        try {
            // Update play time before saving
            this.updatePlayTime()

            // Perform the save
            AppState.saveGameData()

            // Mark as saved
            this.lastSaveTime = Date.now()
            this.unsavedChanges = false

            console.log(`✅ Game saved successfully (trigger: ${trigger})`)

            // Show save indicator if it's not a background save
            if (trigger === 'manual') {
                this.showSaveIndicator()
            }

            return true
        } catch (error) {
            console.error('❌ Failed to save game:', error)

            // Show error notification
            this.showSaveError()

            return false
        }
    }

    /**
     * Mark that there are unsaved changes
     */
    markAsChanged() {
        this.unsavedChanges = true
    }

    /**
     * Check if there are unsaved changes
     * @returns {boolean} True if there are unsaved changes
     */
    hasUnsavedChanges() {
        // Consider changes unsaved if more than 5 seconds have passed since last action
        const timeSinceLastSave = Date.now() - this.lastSaveTime
        return this.unsavedChanges || timeSinceLastSave > 5000
    }

    /**
     * Update the total play time
     */
    updatePlayTime() {
        const now = Date.now()
        const sessionStart = this.sessionStartTime || now
        const sessionTime = Math.floor((now - sessionStart) / 60000) // Convert to minutes

        if (sessionTime > 0) {
            AppState.updatePlayTime(sessionTime)
            this.sessionStartTime = now // Reset session timer
        }
    }

    /**
     * Start tracking session time
     */
    startSession() {
        this.sessionStartTime = Date.now()
        console.log('Session tracking started')
    }

    /**
     * End session tracking and save
     */
    endSession() {
        this.updatePlayTime()
        this.performSave('session_end')
        console.log('Session ended')
    }

    /**
     * Force an immediate save
     * @returns {boolean} True if save was successful
     */
    forceSave() {
        console.log('Force saving game...')
        return this.performSave('manual')
    }

    /**
     * Show a visual indicator that the game was saved
     */
    showSaveIndicator() {
        // Create a temporary save indicator
        const indicator = document.createElement('div')
        indicator.textContent = '💾 Game Saved'
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `

        // Add animation keyframes if not already added
        if (!document.getElementById('save-indicator-styles')) {
            const styles = document.createElement('style')
            styles.id = 'save-indicator-styles'
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `
            document.head.appendChild(styles)
        }

        document.body.appendChild(indicator)

        // Remove the indicator after 3 seconds
        setTimeout(() => {
            indicator.style.animation = 'fadeOut 0.3s ease-out'
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator)
                }
            }, 300)
        }, 2700)
    }

    /**
     * Show an error indicator when save fails
     */
    showSaveError() {
        const indicator = document.createElement('div')
        indicator.textContent = '⚠️ Save Failed!'
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
        `

        indicator.addEventListener('click', () => {
            if (confirm('Save failed. Would you like to try saving again?')) {
                this.forceSave()
            }
            indicator.remove()
        })

        document.body.appendChild(indicator)

        // Remove after 5 seconds if not clicked
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator)
            }
        }, 5000)
    }

    /**
     * Get save status information
     * @returns {Object} Save status info
     */
    getSaveStatus() {
        return {
            lastSaveTime: this.lastSaveTime,
            unsavedChanges: this.hasUnsavedChanges(),
            autoSaveEnabled: AppState.gameSettings.autoSave,
            timeSinceLastSave: Date.now() - this.lastSaveTime
        }
    }

    /**
     * Toggle auto-save on/off
     * @param {boolean} enabled - Whether to enable auto-save
     */
    setAutoSave(enabled) {
        AppState.gameSettings.autoSave = enabled

        if (enabled) {
            this.startPeriodicSave()
            console.log('Auto-save enabled')
        } else {
            this.stopPeriodicSave()
            console.log('Auto-save disabled')
        }

        // Save the settings change
        this.performSave('settings_change')
    }

    /**
     * Clean up the auto-save service
     */
    destroy() {
        this.stopPeriodicSave()
        this.endSession()
        this.isInitialized = false
        console.log('Auto-save service destroyed')
    }
}

export const autoSaveService = new AutoSaveService()