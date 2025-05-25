<template>
  <div class="container-fluid account-page">
    <div class="row">
      <div class="col-12">
        <h1>Account</h1>
        <p>Manage your game progress and settings.</p>
        
        <div class="card mt-4">
          <div class="card-header">
            <h3>Game Progress</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <h5>Gold</h5>
                <p class="display-4 text-warning">{{ gameProgress.gold }}</p>
              </div>
              <div class="col-md-4">
                <h5>Current Location</h5>
                <p class="h4">{{ gameProgress.currentLocation }}</p>
              </div>
              <div class="col-md-4">
                <h5>Game Day</h5>
                <p class="h4">{{ gameProgress.gameDay }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card mt-4">
          <div class="card-header">
            <h3>Characters</h3>
          </div>
          <div class="card-body">
            <p>You have <strong>{{ totalCharacters }}</strong> characters</p>
            <ul>
              <li>Paladins: {{ paladins.length }}</li>
              <li>Archers: {{ archers.length }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'

export default {
  name: 'AccountPage',
  setup() {
    const gameProgress = computed(() => AppState.gameProgress)
    const paladins = computed(() => AppState.paladins)
    const archers = computed(() => AppState.archers)
    const totalCharacters = computed(() => AppState.paladins.length + AppState.archers.length)
    
    return {
      gameProgress,
      paladins,
      archers,
      totalCharacters
    }
  }
}
</script>

<style scoped lang="scss">
.account-page {
  padding: 40px 20px;
}
</style>