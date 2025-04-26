<template>
  <div class="battle-page container-fluid">
    <div class="row h-100">
      <!-- Battle Arena -->
      <div class="col-12 col-md-8">
        <div class="battle-arena">
          <!-- Boss Display -->
          <div class="boss-container" v-if="boss">
            <h2>{{ boss.name }}</h2>
            <div class="health-bar">
              <div class="health-bar-fill" :style="{ width: bossHealthPercentage + '%' }"></div>
              <div class="health-text">{{ boss.currentHealth }} / {{ boss.maxHealth }}</div>
            </div>
            <div class="boss-image">
              <img :src="boss.imgUrl" :alt="boss.name" />
            </div>
            <div class="status-effects">
              <span v-for="effect in boss.statusEffects" :key="effect.name" class="status-effect-badge">
                {{ effect.name }}
              </span>
            </div>
          </div>

          <!-- Player Display -->
          <div class="player-container" v-if="player">
            <h2>{{ player.name }}</h2>
            <div class="health-bar">
              <div class="health-bar-fill" :style="{ width: playerHealthPercentage + '%' }"></div>
              <div class="health-text">{{ player.currentHealth }} / {{ player.maxHealth }}</div>
            </div>
            <div class="player-image">
              <img :src="player.imgUrl" :alt="player.name" />
            </div>
            <div class="status-effects">
              <span v-for="effect in player.statusEffects" :key="effect.name" class="status-effect-badge">
                {{ effect.name }}
              </span>
            </div>
          </div>

          <!-- Battle UI Overlay -->
          <div class="battle-ui-overlay">
            <div class="turn-indicator" v-if="battleActive">
              <span v-if="playerTurn">Your Turn</span>
              <span v-else>Boss's Turn</span>
            </div>
            <div class="game-over" v-if="!battleActive">
              <h2>{{ battleOutcome }}</h2>
              <button class="btn btn-primary" @click="resetGame">Play Again</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Battle Controls -->
      <div class="col-12 col-md-4">
        <div class="battle-controls">
          <!-- Attack Menu -->
          <div class="attack-menu" v-if="battleActive && playerTurn">
            <h3>Attacks</h3>
            <div class="attack-list">
              <button 
                v-for="attack in availableAttacks" 
                :key="attack.id" 
                class="attack-button" 
                :disabled="attack.currentCooldown > 0" 
                @click="useAttack(attack)"
              >
                {{ attack.name }}
                <span v-if="attack.currentCooldown > 0" class="cooldown">
                  ({{ attack.currentCooldown }})
                </span>
              </button>
            </div>
          </div>

          <!-- Items Menu -->
          <div class="items-menu" v-if="battleActive && playerTurn">
            <h3>Items</h3>
            <div class="item-list">
              <button 
                v-for="item in inventory" 
                :key="item.id" 
                class="item-button" 
                @click="useItem(item)"
              >
                {{ item.name }}
              </button>
            </div>
          </div>

          <!-- Battle Log -->
          <div class="battle-log">
            <h3>Battle Log</h3>
            <div class="log-container">
              <div v-for="(log, index) in battleLog" :key="index" class="log-entry">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { gameService } from '../services/GameService'
import { playerService } from '../services/PlayerService'

export default {
  setup() {
    // Computed properties
    const player = computed(() => AppState.player)
    const boss = computed(() => AppState.boss)
    const battleActive = computed(() => AppState.battleActive)
    const playerTurn = computed(() => AppState.playerTurn)
    const availableAttacks = computed(() => AppState.player?.attacks.filter(a => a.currentCooldown === 0) || [])
    const inventory = computed(() => AppState.player?.items || [])
    const battleLog = computed(() => AppState.battleLog)
    
    const playerHealthPercentage = computed(() => {
      if (!player.value) return 0
      return (player.value.currentHealth / player.value.maxHealth) * 100
    })
    
    const bossHealthPercentage = computed(() => {
      if (!boss.value) return 0
      return (boss.value.currentHealth / boss.value.maxHealth) * 100
    })
    
    const battleOutcome = computed(() => {
      if (battleActive.value) return ''
      if (player.value?.currentHealth <= 0) return 'Defeat!'
      if (boss.value?.currentHealth <= 0) return 'Victory!'
      return 'Battle Ended'
    })
    
    // Methods
    function useAttack(attack) {
      playerService.usePlayerAttack(attack)
    }
    
    function useItem(item) {
      playerService.usePlayerItem(item)
    }
    
    function resetGame() {
      gameService.resetGame()
      // Redirect to character selection or home page
    }
    
    return {
      player,
      boss,
      battleActive,
      playerTurn,
      availableAttacks,
      inventory,
      battleLog,
      playerHealthPercentage,
      bossHealthPercentage,
      battleOutcome,
      useAttack,
      useItem,
      resetGame
    }
  }
}
</script>

<style scoped lang="scss">
.battle-page {
  min-height: 100vh;
  padding: 1rem;
  background-color: #232323;
  color: #fff;
}

.battle-arena {
  position: relative;
  min-height: 60vh;
  padding: 2rem;
  background-color: #333;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.boss-container,
.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.health-bar {
  width: 100%;
  height: 20px;
  background-color: #444;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 0.5rem 0;
}

.health-bar-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s;
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.boss-image,
.player-image {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: 1rem 0;
}

.boss-image img,
.player-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.status-effect-badge {
  padding: 0.25rem 0.5rem;
  background-color: #673AB7;
  border-radius: 5px;
  font-size: 0.8rem;
}

.battle-ui-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.turn-indicator {
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
}

.game-over {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
}

.battle-controls {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #333;
  border-radius: 10px;
  padding: 1rem;
}

.attack-menu,
.items-menu {
  margin-bottom: 1rem;
}

.attack-list,
.item-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.attack-button,
.item-button {
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  background-color: #2196F3;
  color: #fff;
  
  &:hover {
    background-color: #1976D2;
  }
  
  &:disabled {
    background-color: #607D8B;
    cursor: not-allowed;
  }
}

.cooldown {
  font-size: 0.8rem;
  opacity: 0.8;
}

.battle-log {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  background-color: #222;
  border-radius: 5px;
  padding: 0.5rem;
  font-family: monospace;
}

.log-entry {
  padding: 0.25rem 0;
  border-bottom: 1px solid #444;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>