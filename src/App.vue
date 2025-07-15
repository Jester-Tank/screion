<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>

    <!-- Save Status Indicator -->
    <div v-if="showSaveStatus" class="save-status" :class="saveStatusClass">
      {{ saveStatusText }}
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import { AppState } from './AppState.js'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const autoSaveService = ref(null)
    const showSaveStatus = ref(false)
    const saveStatus = ref(null)

    const saveStatusClass = computed(() => {
      if (!saveStatus.value) return ''

      return {
        'save-status-saving': saveStatus.value.saving,
        'save-status-saved': saveStatus.value.saved,
        'save-status-error': saveStatus.value.error,
        'save-status-unsaved': saveStatus.value.unsaved
      }
    })

    const saveStatusText = computed(() => {
      if (!saveStatus.value) return ''

      if (saveStatus.value.saving) return '💾 Saving...'
      if (saveStatus.value.saved) return '✅ Saved'
      if (saveStatus.value.error) return '❌ Save Failed'
      if (saveStatus.value.unsaved) return '⚠️ Unsaved Changes'

      return ''
    })

    onMounted(async () => {
      console.log('App mounted - initializing game systems...')

      try {
        // Load game data first
        AppState.loadGameData()

        // Initialize auto-save service
        const autoSaveModule = await import('./services/AutoSaveService.js')
        autoSaveService.value = autoSaveModule.autoSaveService

        // Initialize the auto-save system
        autoSaveService.value.initialize()
        autoSaveService.value.startSession()

        // Set up save status monitoring
        setupSaveStatusMonitoring()

        console.log('✅ All game systems initialized successfully')

      } catch (error) {
        console.error('❌ Error initializing game systems:', error)
      }
    })

    onUnmounted(() => {
      console.log('App unmounting - cleaning up...')

      if (autoSaveService.value) {
        autoSaveService.value.destroy()
      }
    })

    function setupSaveStatusMonitoring() {
      // Monitor save status every few seconds
      setInterval(() => {
        if (autoSaveService.value) {
          const status = autoSaveService.value.getSaveStatus()

          // Show status if there are unsaved changes
          if (status.unsavedChanges && AppState.gameSettings.autoSave) {
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

    // Expose manual save function for debugging/settings
    window.manualSave = () => {
      if (autoSaveService.value) {
        const success = autoSaveService.value.forceSave()
        console.log('Manual save:', success ? 'success' : 'failed')
        return success
      }
      return false
    }

    // Expose save status for debugging
    window.getSaveStatus = () => {
      if (autoSaveService.value) {
        return autoSaveService.value.getSaveStatus()
      }
      return null
    }

    return {
      showSaveStatus,
      saveStatusClass,
      saveStatusText
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
}

.save-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.save-status-saving {
  background-color: #007bff;
  color: white;
}

.save-status-saved {
  background-color: #28a745;
  color: white;
}

.save-status-error {
  background-color: #dc3545;
  color: white;
  cursor: pointer;
}

.save-status-unsaved {
  background-color: #ffc107;
  color: #000;
}

/* Ensure save indicator appears above everything */
.save-status {
  z-index: 10001;
}
</style>