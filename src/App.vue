<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>

    <!-- Enhanced Save Status Indicator -->
    <div v-if="showSaveStatus" class="save-status" :class="saveStatusClass">
      <i :class="saveStatusIcon"></i>
      {{ saveStatusText }}
    </div>

    <!-- Error Status Indicator -->
    <div v-if="showErrorStatus" class="error-status" @click="showErrorDetails">
      <i class="mdi mdi-alert-circle"></i>
      {{ errorCount }} error{{ errorCount !== 1 ? 's' : '' }}
    </div>

    <!-- Health Status (Development Mode) -->
    <div v-if="isDevelopment && showHealthStatus" class="health-status" @click="toggleHealthDetails">
      <i :class="healthStatusIcon"></i>
      System {{ systemHealth }}
    </div>

    <!-- Health Details Modal -->
    <div v-if="showHealthModal" class="health-modal-overlay" @click="closeHealthModal">
      <div class="health-modal" @click.stop>
        <div class="health-modal-header">
          <h3>System Health</h3>
          <button class="close-btn" @click="closeHealthModal">
            <i class="mdi mdi-close"></i>
          </button>
        </div>
        <div class="health-modal-body">
          <div class="health-section" v-for="(health, service) in serviceHealth" :key="service">
            <div class="service-name">{{ service }}</div>
            <div class="service-status" :class="health.status">
              <i :class="getHealthIcon(health.status)"></i>
              {{ health.status }}
            </div>
            <div v-if="health.error" class="service-error">{{ health.error }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import { AppState } from './AppState.js'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const autoSaveService = ref(null)
    const gameService = ref(null)
    const showSaveStatus = ref(false)
    const saveStatus = ref(null)
    const showErrorStatus = ref(false)
    const showHealthStatus = ref(false)
    const showHealthModal = ref(false)
    const systemHealth = ref('unknown')
    const serviceHealth = ref({})
    const errorCount = ref(0)
    
    // Fixed: Use Vite's import.meta.env instead of process.env
    const isDevelopment = ref(import.meta.env.DEV || false)

    // Computed properties for status indicators
    const saveStatusClass = computed(() => {
      if (!saveStatus.value) return ''

      return {
        'save-status-saving': saveStatus.value.saving,
        'save-status-saved': saveStatus.value.saved,
        'save-status-error': saveStatus.value.error,
        'save-status-unsaved': saveStatus.value.unsaved
      }
    })

    const saveStatusIcon = computed(() => {
      if (!saveStatus.value) return ''

      if (saveStatus.value.saving) return 'mdi mdi-loading mdi-spin'
      if (saveStatus.value.saved) return 'mdi mdi-check-circle'
      if (saveStatus.value.error) return 'mdi mdi-alert-circle'
      if (saveStatus.value.unsaved) return 'mdi mdi-content-save-alert'

      return 'mdi mdi-content-save'
    })

    const saveStatusText = computed(() => {
      if (!saveStatus.value) return ''

      if (saveStatus.value.saving) return 'Saving...'
      if (saveStatus.value.saved) return 'Saved'
      if (saveStatus.value.error) return 'Save Failed'
      if (saveStatus.value.unsaved) return 'Unsaved Changes'

      return ''
    })

    const healthStatusIcon = computed(() => {
      switch (systemHealth.value) {
        case 'healthy': return 'mdi mdi-check-circle text-success'
        case 'degraded': return 'mdi mdi-alert text-warning'
        case 'unhealthy': return 'mdi mdi-close-circle text-danger'
        default: return 'mdi mdi-help-circle text-info'
      }
    })

    // Watch for errors in AppState
    watch(() => AppState?.errorState?.errorCount || 0, (newCount) => {
      errorCount.value = newCount
      showErrorStatus.value = newCount > 0
    }, { immediate: true })

    onMounted(async () => {
      if (isDevelopment.value) {
        console.log('🚀 App mounted - initializing game systems...')
      }

      try {
        await initializeGameSystems()
        await setupMonitoring()
        
        if (isDevelopment.value) {
          console.log('✅ All game systems initialized successfully')
        }

        // Perform initial health check
        if (isDevelopment.value) {
          performHealthCheck()
        }

      } catch (error) {
        console.error('❌ Error initializing game systems:', error)
        handleGlobalError({ error, info: 'App initialization', instance: null })
      }
    })

    onUnmounted(() => {
      if (isDevelopment.value) {
        console.log('App unmounting - cleaning up...')
      }
      cleanup()
    })

    async function initializeGameSystems() {
      try {
        // Load game data first
        const loadSuccess = AppState.loadGameData()
        if (!loadSuccess && isDevelopment.value) {
          console.warn('Game data load had issues, continuing with defaults')
        }

        // Initialize auto-save service (simplified version)
        autoSaveService.value = {
          initialize: () => {
            if (isDevelopment.value) {
              console.log('Auto-save initialized')
            }
          },
          startSession: () => {
            AppState.startSession()
          },
          getSaveStatus: () => ({
            lastSaveTime: Date.now(),
            unsavedChanges: false,
            autoSaveEnabled: AppState.gameSettings?.autoSave || true
          }),
          destroy: () => {
            if (isDevelopment.value) {
              console.log('Auto-save destroyed')
            }
          }
        }

        // Initialize game service (simplified version)
        gameService.value = {
          initializeGame: async () => {
            if (isDevelopment.value) {
              console.log('Game service initialized')
            }
            return true
          }
        }

        // Start services
        if (autoSaveService.value) {
          autoSaveService.value.initialize()
          autoSaveService.value.startSession()
        }

        if (gameService.value) {
          await gameService.value.initializeGame()
        }

      } catch (error) {
        console.error('Failed to initialize game systems:', error)
        throw new Error(`Game initialization failed: ${error.message}`)
      }
    }

    async function setupMonitoring() {
      // Set up save status monitoring
      setupSaveStatusMonitoring()

      // Set up error monitoring
      setupErrorMonitoring()

      // Set up health monitoring (development only)
      if (isDevelopment.value) {
        setupHealthMonitoring()
      }
    }

    function setupSaveStatusMonitoring() {
      // Monitor save status every few seconds
      setInterval(() => {
        if (autoSaveService.value) {
          const status = autoSaveService.value.getSaveStatus()

          // Show status if there are unsaved changes
          if (status.unsavedChanges && AppState.gameSettings?.autoSave) {
            showSaveStatus.value = true
            saveStatus.value = { unsaved: true }

            // Hide after 3 seconds
            setTimeout(() => {
              showSaveStatus.value = false
            }, 3000)
          }
        }
      }, 5000) // Check every 5 seconds
    }

    function setupErrorMonitoring() {
      // Monitor AppState for errors
      const checkErrors = () => {
        if (AppState.getErrorInfo) {
          const errorInfo = AppState.getErrorInfo()
          errorCount.value = errorInfo.errorCount || 0
          showErrorStatus.value = errorInfo.hasErrors || false
        }
      }

      // Check every 10 seconds
      setInterval(checkErrors, 10000)
      
      // Initial check
      checkErrors()
    }

    function setupHealthMonitoring() {
      showHealthStatus.value = true

      // Perform health check every minute
      setInterval(performHealthCheck, 60000)
    }

    async function performHealthCheck() {
      try {
        const health = {
          overall: 'healthy',
          services: {
            appState: { status: 'healthy' },
            gameService: { status: autoSaveService.value ? 'healthy' : 'degraded' },
            autoSave: { status: autoSaveService.value ? 'healthy' : 'unhealthy' }
          }
        }

        systemHealth.value = health.overall
        serviceHealth.value = health.services

        // Log health issues in development
        if (health.overall !== 'healthy' && isDevelopment.value) {
          console.warn('System health issues detected:', health)
        }
      } catch (error) {
        if (isDevelopment.value) {
          console.error('Health check failed:', error)
        }
        systemHealth.value = 'unhealthy'
      }
    }

    function handleGlobalError({ error, info, instance }) {
      if (isDevelopment.value) {
        console.error('Global error caught:', { error, info, instance })
      }
      
      // Log to AppState error system if available
      if (AppState.handleError) {
        AppState.handleError('GlobalErrorBoundary', error)
      }

      // Show error status
      showErrorStatus.value = true
      errorCount.value = (AppState.errorState?.errorCount || 0) + 1

      // In development, show additional debugging info
      if (isDevelopment.value) {
        console.table({
          message: error.message,
          context: info,
          component: instance?.$?.type?.name || 'Unknown',
          stack: error.stack?.split('\n')[1] || 'No stack trace'
        })
      }
    }

    function handleRetry() {
      if (isDevelopment.value) {
        console.log('Retrying after global error...')
      }
      
      // Clear error states
      showErrorStatus.value = false
      errorCount.value = 0
      
      if (AppState.clearErrors) {
        AppState.clearErrors()
      }

      // Attempt to re-initialize critical services
      initializeGameSystems().catch(error => {
        if (isDevelopment.value) {
          console.error('Retry initialization failed:', error)
        }
      })
    }

    function showErrorDetails() {
      let errorInfo = null
      
      if (AppState.getErrorInfo) {
        errorInfo = AppState.getErrorInfo()
      }
      
      if (errorInfo && errorInfo.lastError) {
        alert(`Last Error: ${errorInfo.lastError.message}\nContext: ${errorInfo.lastError.context}\nTime: ${errorInfo.lastError.timestamp}`)
      } else {
        alert(`${errorCount.value} errors have occurred. Check the console for details.`)
      }
    }

    function toggleHealthDetails() {
      showHealthModal.value = !showHealthModal.value
      
      if (showHealthModal.value) {
        performHealthCheck()
      }
    }

    function closeHealthModal() {
      showHealthModal.value = false
    }

    function getHealthIcon(status) {
      switch (status) {
        case 'healthy': return 'mdi mdi-check-circle'
        case 'degraded': return 'mdi mdi-alert'
        case 'unhealthy': return 'mdi mdi-close-circle'
        default: return 'mdi mdi-help-circle'
      }
    }

    function cleanup() {
      if (autoSaveService.value && autoSaveService.value.destroy) {
        autoSaveService.value.destroy()
      }
    }

    // Expose methods for debugging
    if (isDevelopment.value) {
      window.gameDebug = {
        performHealthCheck,
        getAppState: () => AppState,
        getErrorInfo: () => AppState.getErrorInfo ? AppState.getErrorInfo() : { errorCount: 0 },
        clearErrors: () => AppState.clearErrors ? AppState.clearErrors() : null,
        triggerTestError: () => {
          throw new Error('Test error for debugging')
        },
        saveGame: () => AppState.saveGameData ? AppState.saveGameData() : null,
        loadGame: () => AppState.loadGameData ? AppState.loadGameData() : null
      }
      
      console.log('🛠️ Debug tools available at window.gameDebug')
    }

    return {
      showSaveStatus,
      saveStatusClass,
      saveStatusIcon,
      saveStatusText,
      showErrorStatus,
      showHealthStatus,
      showHealthModal,
      systemHealth,
      serviceHealth,
      errorCount,
      isDevelopment,
      healthStatusIcon,
      handleGlobalError,
      handleRetry,
      showErrorDetails,
      toggleHealthDetails,
      closeHealthModal,
      getHealthIcon
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}

/* Enhanced Status Indicators */
.save-status,
.error-status,
.health-status {
  position: fixed;
  bottom: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-status {
  right: 20px;
}

.error-status {
  right: 20px;
  bottom: 80px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: 2px solid #dc3545;
  animation: pulse-error 2s infinite;
}

.health-status {
  right: 20px;
  bottom: 140px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 2px solid #28a745;
  font-size: 0.8rem;
}

.save-status-saving {
  background: rgba(0, 123, 255, 0.9);
  color: white;
  border: 2px solid #007bff;
}

.save-status-saved {
  background: rgba(40, 167, 69, 0.9);
  color: white;
  border: 2px solid #28a745;
}

.save-status-error {
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: 2px solid #dc3545;
  cursor: pointer;
}

.save-status-unsaved {
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  border: 2px solid #ffc107;
}

/* Health Modal */
.health-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.health-modal {
  background: #2d3748;
  color: white;
  border-radius: 12px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.health-modal-header {
  background: #1a202c;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #4a5568;
}

.health-modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.health-modal-body {
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.health-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 4px solid #4a5568;
}

.health-section:last-child {
  margin-bottom: 0;
}

.service-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.service-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.service-status.healthy {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.service-status.degraded {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.service-status.unhealthy {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.service-error {
  grid-column: 1 / -1;
  color: #ff6b6b;
  font-size: 0.9rem;
  font-family: monospace;
  background: rgba(220, 53, 69, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

/* Animations */
@keyframes pulse-error {
  0% {
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(220, 53, 69, 0.6);
  }
  100% {
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Status indicator hover effects */
.save-status:hover,
.error-status:hover,
.health-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .save-status,
  .error-status,
  .health-status {
    right: 10px;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .error-status {
    bottom: 70px;
  }
  
  .health-status {
    bottom: 120px;
  }
  
  .health-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .health-modal-header {
    padding: 1rem;
  }
  
  .health-modal-body {
    padding: 1rem;
  }
  
  .health-section {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .service-status {
    justify-self: start;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .health-modal {
    background: #1a202c;
  }
  
  .health-modal-header {
    background: #111827;
  }
}

/* Ensure status indicators appear above everything */
.save-status,
.error-status,
.health-status {
  z-index: 10001;
}

.health-modal-overlay {
  z-index: 10002;
}

/* Accessibility improvements */
.save-status:focus,
.error-status:focus,
.health-status:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Loading state for status indicators */
.save-status-saving .mdi-spin {
  color: #87ceeb;
}

/* Success state animation */
.save-status-saved {
  animation: success-flash 0.5s ease-out;
}

@keyframes success-flash {
  0% {
    background: rgba(40, 167, 69, 0.3);
  }
  50% {
    background: rgba(40, 167, 69, 1);
  }
  100% {
    background: rgba(40, 167, 69, 0.9);
  }
}
</style>