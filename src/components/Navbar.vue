<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="mdi mdi-sword-cross"></i> Heroes of the Realm
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/characters">Characters</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/bosses">Boss Battles</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <!-- Gold Display -->
          <div class="text-light me-3 d-flex align-items-center">
            <i class="mdi mdi-currency-usd text-warning me-1"></i>
            <span>{{ gold }}</span>
          </div>

          <!-- Level Display -->
          <div class="text-light me-3 d-flex align-items-center">
            <i class="mdi mdi-trophy text-success me-1"></i>
            <span>Lv.{{ playerLevel }}</span>
          </div>

          <!-- Active Character Display -->
          <div v-if="activeCharacter" class="text-light me-3 d-flex align-items-center">
            <i class="mdi mdi-account-circle me-1"></i>
            <span>{{ activeCharacter.name }}</span>
          </div>

          <!-- Settings Button -->
          <button class="btn btn-outline-light me-2" @click="openSettings" title="Toggle Auto-Save">
            <i class="mdi mdi-cog"></i>
          </button>

          <router-link class="btn btn-outline-light" to="/account">
            <i class="mdi mdi-account"></i> Account
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'

export default {
  name: 'NavbarComponent',
  setup() {
    const activeCharacter = computed(() => AppState.activeCharacter)
    const gold = computed(() => AppState.gold)
    const playerLevel = computed(() => AppState.playerLevel)

    function openSettings() {
      // Simple toggle for auto-save
      const currentAutoSave = AppState.gameSettings.autoSave
      AppState.gameSettings.autoSave = !currentAutoSave
      AppState.saveGameData()

      alert(`⚙️ Auto-save ${!currentAutoSave ? 'enabled' : 'disabled'}!`)
    }

    return {
      activeCharacter,
      gold,
      playerLevel,
      openSettings
    }
  }
}
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.3rem;

  i {
    color: #ffc107;
    margin-right: 0.5rem;
  }
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ffc107 !important;
  }

  &.router-link-active {
    color: #ffc107 !important;
    font-weight: bold;
  }
}

.text-light {
  font-size: 0.9rem;

  i {
    font-size: 1.1rem;
  }
}

.btn-outline-light {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background-color: #ffc107;
    border-color: #ffc107;
    color: #000;
  }

  i {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .text-light {
    font-size: 0.8rem;
    margin-right: 0.5rem !important;

    span {
      display: none;
    }
  }
}
</style>