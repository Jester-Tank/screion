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
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/characters">Characters</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
        
        <div class="d-flex">
          <div v-if="activeCharacter" class="d-flex align-items-center text-light me-3">
            <span>{{ activeCharacter.name }}</span>
          </div>
          
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
  setup() {
    const activeCharacter = computed(() => AppState.activeCharacter)
    
    return {
      activeCharacter
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
}
</style>