<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="mdi mdi-sword-cross"></i> Heroes of the Realm
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Characters' }">Characters</router-link>
          </li>
          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="gameDropdown" role="button" 
               data-bs-toggle="dropdown" aria-expanded="false">
              Game
            </a>
            <ul class="dropdown-menu" aria-labelledby="gameDropdown">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'Characters' }">
                  <i class="mdi mdi-account-group"></i> Characters
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="startNewGame">
                  <i class="mdi mdi-play"></i> New Game
                </a>
              </li>
            </ul>
          </li>
        </ul>
        
        <div class="d-flex">
          <div v-if="activeCharacter" class="d-flex align-items-center text-light me-3">
            <img :src="activeCharacter.imageUrl" alt="Active Character" class="avatar-small me-2">
            <span>{{ activeCharacter.name }}</span>
          </div>
          
          <router-link class="btn btn-outline-light" :to="{ name: 'Account' }">
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
  setup() {
    const activeCharacter = computed(() => AppState.activeCharacter)
    
    function startNewGame() {
      // This would handle starting a new game
      // For now, just alerts the user
      alert('This would start a new game. Not yet implemented.')
    }
    
    return {
      activeCharacter,
      startNewGame
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}
</style>