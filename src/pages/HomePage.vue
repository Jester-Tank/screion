<template>
  <div class="home-page container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 text-center mb-4">
        <h1 class="game-title">BOSS BATTLE</h1>
        <p class="game-subtitle">Defeat the fearsome enemies to become a hero!</p>
      </div>
      
      <!-- Character Selection -->
      <div class="col-12 col-md-10 col-lg-8 mb-5">
        <div class="section-container">
          <h2 class="section-title">Choose Your Hero</h2>
          <div class="character-selection">
            <div 
              v-for="character in playerTemplates" 
              :key="character.id" 
              class="character-card"
              :class="{ 'selected': selectedPlayer === character.id }"
              @click="selectPlayer(character.id)"
            >
              <div class="character-image">
                <img :src="character.imgUrl" :alt="character.name">
              </div>
              <div class="character-info">
                <h3>{{ character.name }}</h3>
                <div class="stats">
                  <div class="stat">
                    <span class="stat-label">HP</span>
                    <span class="stat-value">{{ character.maxHealth }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">ATK</span>
                    <span class="stat-value">{{ character.attack }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">DEF</span>
                    <span class="stat-value">{{ character.defense }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">SPD</span>
                    <span class="stat-value">{{ character.speed }}</span>
                  </div>
                </div>
                <div class="attacks-preview">
                  <h4>Attacks:</h4>
                  <p v-for="attack in character.attacks" :key="attack.id">
                    {{ attack.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Boss Selection -->
      <div class="col-12 col-md-10 col-lg-8 mb-5">
        <div class="section-container">
          <h2 class="section-title">Choose Your Enemy</h2>
          <div class="boss-selection">
            <div 
              v-for="boss in bossTemplates" 
              :key="boss.id" 
              class="boss-card"
              :class="{ 'selected': selectedBoss === boss.id }"
              @click="selectBoss(boss.id)"
            >
              <div class="boss-image">
                <img :src="boss.imgUrl" :alt="boss.name">
              </div>
              <div class="boss-info">
                <h3>{{ boss.name }}</h3>
                <p class="boss-description">{{ boss.description }}</p>
                <div class="stats">
                  <div class="stat">
                    <span class="stat-label">HP</span>
                    <span class="stat-value">{{ boss.maxHealth }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">ATK</span>
                    <span class="stat-value">{{ boss.attack }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">DEF</span>
                    <span class="stat-value">{{ boss.defense }}</span>
                  </div>
                </div>
                <div class="difficulty">
                  <span>Difficulty: </span>
                  <span class="difficulty-stars">
                    {{ '★'.repeat(getDifficultyRating(boss)) }}{{ '☆'.repeat(5 - getDifficultyRating(boss)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Start Game Button -->
      <div class="col-12 text-center mb-5">
        <button 
          class="start-game-btn"
          :disabled="!canStartGame"
          @click="startGame"
        >
          START BATTLE
        </button>
        <p v-if="!canStartGame" class="select-prompt">
          Please select a character and a boss to begin
        </p>
      </div>
      
      <!-- How to Play Section -->
      <div class="col-12 col-md-10 col-lg-8 mb-5">
        <div class="section-container">
          <h2 class="section-title">How to Play</h2>
          <div class="how-to-play">
            <div class="instruction">
              <div class="instruction-icon">1</div>
              <div class="instruction-text">
                <h4>Choose Your Character</h4>
                <p>Select a character with unique abilities and stats.</p>
              </div>
            </div>
            <div class="instruction">
              <div class="instruction-icon">2</div>
              <div class="instruction-text">
                <h4>Choose Your Enemy</h4>
                <p>Select a boss to battle against. Each has unique attacks and difficulty.</p>
              </div>
            </div>
            <div class="instruction">
              <div class="instruction-icon">3</div>
              <div class="instruction-text">
                <h4>Battle!</h4>
                <p>Use your attacks strategically. Some attacks have cooldowns before they can be used again.</p>
              </div>
            </div>
            <div class="instruction">
              <div class="instruction-icon">4</div>
              <div class="instruction-text">
                <h4>Watch for Phase Changes</h4>
                <p>Bosses will change tactics as their health decreases. Be prepared!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { AppState } from '../AppState'
import { gameService } from '../services/GameService'
import { router } from '../router'

export default {
  setup() {
    const selectedPlayer = ref(null)
    const selectedBoss = ref(null)
    
    // Get templates from AppState
    const playerTemplates = computed(() => AppState.playerTemplates)
    const bossTemplates = computed(() => AppState.bossTemplates)
    
    // Check if can start game
    const canStartGame = computed(() => selectedPlayer.value && selectedBoss.value)
    
    // Character selection
    function selectPlayer(playerId) {
      selectedPlayer.value = playerId
    }
    
    // Boss selection
    function selectBoss(bossId) {
      selectedBoss.value = bossId
    }
    
    // Get difficulty rating for boss (1-5 stars)
    function getDifficultyRating(boss) {
      // Simple formula based on boss stats
      const statSum = boss.maxHealth / 50 + boss.attack / 5 + boss.defense / 3
      return Math.max(1, Math.min(5, Math.floor(statSum / 2)))
    }
    
    // Start the game
    function startGame() {
      if (!canStartGame.value) return
      
      gameService.startGame(selectedPlayer.value, selectedBoss.value)
      router.push({ name: 'Battle' })
    }
    
    return {
      selectedPlayer,
      selectedBoss,
      playerTemplates,
      bossTemplates,
      canStartGame,
      selectPlayer,
      selectBoss,
      getDifficultyRating,
      startGame
    }
  }
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #232323;
  color: #fff;
}

.game-title {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 0 0 10px #ff7700, 0 0 20px #ff7700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
}

.game-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.section-container {
  background-color: #333;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background-color: #ff7700;
    margin: 0.5rem auto;
  }
}

// Character Selection
.character-selection, .boss-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.character-card, .boss-card {
  width: 280px;
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 119, 0, 0.3);
  }
  
  &.selected {
    border: 3px solid #ff7700;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 119, 0, 0.5);
  }
}

.character-image, .boss-image {
  height: 150px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.character-info, .boss-info {
  padding: 1rem;
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  padding: 0.5rem;
  border-radius: 5px;
  flex: 1;
  min-width: 50px;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.boss-description {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.attacks-preview {
  margin-top: 1rem;
  
  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

.difficulty {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  
  .difficulty-stars {
    color: #ff7700;
  }
}

// Start Game Button
.start-game-btn {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  background-color: #ff7700;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.1rem;
  box-shadow: 0 0 20px rgba(255, 119, 0, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 119, 0, 0.5);
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.select-prompt {
  margin-top: 1rem;
  opacity: 0.7;
  font-style: italic;
}

// How to Play Section
.how-to-play {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instruction {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.instruction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ff7700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.instruction-text {
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .game-title {
    font-size: 3rem;
  }
  
  .character-card, .boss-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>