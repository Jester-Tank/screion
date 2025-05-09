<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #232323;
  color: #fff;
}

.game-title, .battle-title {
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

// Character & Boss Selection Styles
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

// Buttons
.start-game-btn, .test-battle-btn {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.1rem;
  margin: 0 0.5rem 1rem 0.5rem;
}

.start-game-btn {
  background-color: #ff7700;
  box-shadow: 0 0 20px rgba(255, 119, 0, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 119, 0, 0.5);
  }
}

.test-battle-btn {
  background-color: #2196F3;
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(33, 150, 243, 0.5);
  }
}

.start-game-btn:disabled, .test-battle-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
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

// BATTLE INTERFACE STYLES
.battle-interface {
  min-height: 100vh;
  background-color: #232323;
}

.battle-title {
  margin-bottom: 1.5rem;
  font-size: 3rem;
}

.battle-arena {
  background-color: #333;
  border-radius: 10px;
  padding: 2rem;
  margin: 0 auto 2rem;
  max-width: 900px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.boss-section, .player-section {
  text-align: center;
  
  h2 {
    color: #ff7700;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  .boss-image, .player-image {
    width: 150px;
    height: 150px;
    margin: 1rem auto;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #555;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.health-bar {
  height: 25px;
  background-color: #444;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 400px;
  border: 1px solid #555;
}

.health-bar-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.status-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.status-badge {
  background-color: #673AB7;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  animation: pulsate 1.5s infinite alternate;
}

.battle-announcements {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.turn-indicator {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px #ff7700, 0 0 20px #ff7700;
  animation: pulse 1.5s infinite;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
}

// Game Controls
.game-controls {
  background-color: #333;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 0 auto 2rem;
  max-width: 900px;
}

.attack-controls {
  h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #ff7700;
  }
}

.attack-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.attack-button {
  background-color: #3F51B5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 120px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(63, 81, 181, 0.5);
  }
  
  &.physical {
    background-color: #F44336;
    
    &:hover {
      box-shadow: 0 5px 15px rgba(244, 67, 54, 0.5);
    }
  }
  
  &.magical {
    background-color: #3F51B5;
    
    &:hover {
      box-shadow: 0 5px 15px rgba(63, 81, 181, 0.5);
    }
  }
  
  &.support {
    background-color: #4CAF50;
    
    &:hover {
      box-shadow: 0 5px 15px rgba(76, 175, 80, 0.5);
    }
  }
}

.attack-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.attack-details {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.attack-desc {
  font-size: 0.8rem;
  opacity: 0.8;
  flex-grow: 1;
}

.boss-turn {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  font-style: italic;
}

// Battle Log
.battle-log-container {
  background-color: #333;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 0 auto 2rem;
  max-width: 900px;
  
  h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: #ff7700;
  }
}

.battle-log {
  background-color: #222;
  border-radius: 5px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
}

.log-entry {
  padding: 0.5rem;
  border-bottom: 1px solid #444;
  font-size: 0.9rem;
  
  &.important {
    color: #ff7700;
    font-weight: bold;
  }
}

// Game Over
.game-over {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 2rem;
  margin: 0 auto 2rem;
  max-width: 600px;
  text-align: center;
  
  h2 {
    font-size: 3rem;
    color: #ff7700;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px rgba(255, 119, 0, 0.5);
  }
}

.game-over-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  
  h3 {
    color: #ff7700;
    margin-bottom: 0.5rem;
  }
}

.restart-button {
  background-color: #ff7700;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 119, 0, 0.5);
  }
}

.back-section {
  margin: 2rem auto;
  text-align: center;
}

.back-button {
  background-color: #555;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #777;
  }
}

// Animations
@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.7;
    transform: scale(0.98);
  }
}

@keyframes pulsate {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .game-title, .battle-title {
    font-size: 2.5rem;
  }
  
  .character-card, .boss-card {
    width: 100%;
    max-width: 400px;
  }
  
  .attack-buttons {
    grid-template-columns: 1fr;
  }
  
  .game-over-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style><template>
  <div class="home-page container-fluid">
    <!-- Game Selection Interface -->
    <div v-if="!battleMode" class="row justify-content-center">
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
          @click="startGameInPage"
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
    
    <!-- Battle Interface (Integrated in HomePage) -->
    <div v-if="battleMode" class="battle-interface">
      <div class="row justify-content-center">
        <div class="col-12 text-center">
          <h1 class="battle-title">BOSS BATTLE</h1>
          
          <!-- Battle Arena -->
          <div class="battle-arena">
            <!-- Boss Info -->
            <div class="boss-section" v-if="player && boss">
              <h2>{{ boss.name }}</h2>
              <div class="health-bar">
                <div 
                  class="health-bar-fill" 
                  :style="{ 
                    width: (boss.currentHealth / boss.maxHealth * 100) + '%',
                    backgroundColor: getHealthColor(boss.currentHealth, boss.maxHealth)
                  }"
                ></div>
                <div class="health-text">{{ boss.currentHealth }} / {{ boss.maxHealth }}</div>
              </div>
              <div class="boss-image">
                <img :src="boss.imgUrl" :alt="boss.name">
              </div>
              <div class="status-effects" v-if="boss.statusEffects && boss.statusEffects.length > 0">
                <div 
                  v-for="effect in boss.statusEffects" 
                  :key="effect.name"
                  class="status-badge"
                >
                  {{ effect.name }}
                </div>
              </div>
            </div>
            
            <!-- Battle Announcements -->
            <div class="battle-announcements" v-if="battleActive">
              <div class="turn-indicator">
                {{ playerTurn ? 'Your Turn' : 'Boss Turn' }}
              </div>
            </div>
            
            <!-- Player Info -->
            <div class="player-section" v-if="player && boss">
              <h2>{{ player.name }}</h2>
              <div class="health-bar">
                <div 
                  class="health-bar-fill" 
                  :style="{ 
                    width: (player.currentHealth / player.maxHealth * 100) + '%',
                    backgroundColor: getHealthColor(player.currentHealth, player.maxHealth)
                  }"
                ></div>
                <div class="health-text">{{ player.currentHealth }} / {{ player.maxHealth }}</div>
              </div>
              <div class="player-image">
                <img :src="player.imgUrl" :alt="player.name">
              </div>
              <div class="status-effects" v-if="player.statusEffects && player.statusEffects.length > 0">
                <div 
                  v-for="effect in player.statusEffects" 
                  :key="effect.name"
                  class="status-badge"
                >
                  {{ effect.name }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Game Controls -->
          <div class="game-controls" v-if="battleActive">
            <div v-if="playerTurn" class="attack-controls">
              <h3>Choose Your Attack</h3>
              <div class="attack-buttons">
                <button 
                  v-for="attack in availableAttacks" 
                  :key="attack.id"
                  class="attack-button"
                  :class="attack.type"
                  @click="useAttack(attack)"
                >
                  <div class="attack-name">{{ attack.name }}</div>
                  <div class="attack-details">
                    <span v-if="attack.damage > 0">DMG: {{ attack.damage }}</span>
                    <span v-if="attack.selfHeal > 0">HEAL: {{ attack.selfHeal }}</span>
                  </div>
                  <div class="attack-desc">{{ attack.description }}</div>
                </button>
              </div>
            </div>
            
            <div v-else class="boss-turn">
              <p>Boss is making a move...</p>
            </div>
          </div>
          
          <!-- Battle Log -->
          <div class="battle-log-container">
            <h3>Battle Log</h3>
            <div class="battle-log">
              <div 
                v-for="(log, index) in battleLog"
                :key="index"
                class="log-entry"
                :class="{ 'important': isImportantLogEntry(log) }"
              >
                {{ log }}
              </div>
            </div>
          </div>
          
          <!-- Game Over Screen -->
          <div class="game-over" v-if="!battleActive && player && boss">
            <h2 v-if="player.currentHealth <= 0">DEFEAT!</h2>
            <h2 v-else-if="boss.currentHealth <= 0">VICTORY!</h2>
            
            <div class="game-over-stats">
              <div class="player-stats">
                <h3>{{ player.name }}</h3>
                <p>Final Health: {{ player.currentHealth }} / {{ player.maxHealth }}</p>
              </div>
              
              <div class="boss-stats">
                <h3>{{ boss.name }}</h3>
                <p>Final Health: {{ boss.currentHealth }} / {{ boss.maxHealth }}</p>
              </div>
            </div>
            
            <button @click="resetBattle" class="restart-button">Play Again</button>
          </div>
          
          <!-- Back to Selection -->
          <div class="back-section">
            <button @click="battleMode = false" class="back-button">
              Back to Selection Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { AppState } from 'AppState'
import { gameService } from 'services/GameService'
import { playerService } from 'services/PlayerService'

export default {
  name: 'HomePage',
  setup() {
    // Character selection state
    const selectedPlayer = ref(null)
    const selectedBoss = ref(null)
    
    // Battle mode state
    const battleMode = ref(false)
    
    // Game state references
    const player = computed(() => AppState.player)
    const boss = computed(() => AppState.boss)
    const battleActive = computed(() => AppState.battleActive)
    const playerTurn = computed(() => AppState.playerTurn)
    const battleLog = computed(() => AppState.battleLog)
    const availableAttacks = computed(() => {
      if (!player.value || !player.value.attacks) return []
      return player.value.attacks.filter(a => a.currentCooldown === 0)
    })
    
    // Get templates from AppState
    const playerTemplates = computed(() => AppState.playerTemplates)
    const bossTemplates = computed(() => AppState.bossTemplates)
    
    // Check if can start game
    const canStartGame = computed(() => selectedPlayer.value && selectedBoss.value)
    
    // Watch for battle end
    watch(battleActive, (isActive) => {
      console.log('Battle active state changed:', isActive)
    })
    
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
    
    // Start game in the same page
    function startGameInPage() {
      if (!canStartGame.value) return
      
      try {
        console.log('Starting game with:', { 
          player: selectedPlayer.value, 
          boss: selectedBoss.value 
        })
        
        // Initialize the game with selected player and boss
        gameService.startGame(selectedPlayer.value, selectedBoss.value)
        
        // Switch to battle mode
        battleMode.value = true
        
        console.log('Game started. Battle state:', {
          player: player.value,
          boss: boss.value,
          battleActive: battleActive.value
        })
      } catch (error) {
        console.error('Error starting game:', error)
        alert('There was an error starting the game. Please try again.')
      }
    }
    
    // Use attack in battle
    function useAttack(attack) {
      if (!battleActive.value || !playerTurn.value) return
      
      console.log('Using attack:', attack.name)
      playerService.usePlayerAttack(attack)
    }
    
    // Reset battle and go back to selection
    function resetBattle() {
      gameService.resetGame()
      battleMode.value = false
      selectedPlayer.value = null
      selectedBoss.value = null
    }
    
    // Get health bar color based on percentage
    function getHealthColor(current, max) {
      const percentage = (current / max) * 100
      if (percentage >= 70) return '#4CAF50' // Green
      if (percentage >= 40) return '#FFC107' // Yellow
      return '#F44336' // Red
    }
    
    // Check if a log entry is important
    function isImportantLogEntry(log) {
      const importantKeywords = [
        'victory', 'defeat', 'defeated', 'won', 'lost', 'level up', 
        'phase', 'critical'
      ]
      return importantKeywords.some(keyword => 
        log.toLowerCase().includes(keyword)
      )
    }
    
    return {
      // Selection state
      selectedPlayer,
      selectedBoss,
      playerTemplates,
      bossTemplates,
      canStartGame,
      
      // Battle state
      battleMode,
      player,
      boss,
      battleActive,
      playerTurn,
      battleLog,
      availableAttacks,
      
      // Methods
      selectPlayer,
      selectBoss,
      getDifficultyRating,
      startGameInPage,
      useAttack,
      resetBattle,
      getHealthColor,
      isImportantLogEntry
    }
  }
}
</script>
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

.start-game-btn, .test-battle-btn {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.1rem;
  margin: 0 0.5rem 1rem 0.5rem;
}

.start-game-btn {
  background-color: #ff7700;
  box-shadow: 0 0 20px rgba(255, 119, 0, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 119, 0, 0.5);
  }
}

.test-battle-btn {
  background-color: #2196F3;
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(33, 150, 243, 0.5);
  }
}

.start-game-btn:disabled, .test-battle-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
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