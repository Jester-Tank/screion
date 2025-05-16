<template>
  <div class="container-fluid">
    <!-- Character Selection Screen -->
    <div v-if="!battleMode" class="selection-screen">
      <div class="row justify-content-center">
        <div class="col-12 text-center mb-4">
          <h1 class="my-3">BOSS BATTLE</h1>
          <p>Defeat the fearsome enemies to become a hero!</p>
          
          <!-- Player Stats -->
          <div class="player-stats mb-3">
            <span class="badge bg-warning text-dark me-2">
              <i class="fas fa-coins"></i> Gold: {{ gold }}
            </span>
            <span class="badge bg-info">
              <i class="fas fa-star"></i> Level: {{ playerLevel }}
            </span>
            <button @click="resetProgress" class="btn btn-sm btn-outline-danger ms-2">Reset Progress</button>
          </div>
        </div>
        
        <!-- Character Selection -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Choose Your Hero</h2>
            </div>
            <div class="card-body">
              <h5>Unlocked Heroes</h5>
              <div class="d-flex flex-wrap justify-content-center">
                <div 
                  v-for="character in filteredCharacters" 
                  :key="character.id" 
                  class="character-card m-2"
                  :class="{ 'selected': selectedHero === character.id }"
                  @click="selectHero(character.id)"
                >
                  <img :src="character.imgUrl" :alt="character.name" class="character-img" />
                  <div class="p-2">
                    <h5>{{ character.name }}</h5>
                    <div class="d-flex justify-content-between">
                      <span>HP: {{ character.maxHealth }}</span>
                      <span>ATK: {{ character.attack }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Locked Characters -->
              <h5 class="mt-4">Locked Heroes</h5>
              <div class="d-flex flex-wrap justify-content-center">
                <div 
                  v-for="character in lockedCharacters" 
                  :key="character.id" 
                  class="character-card locked m-2"
                >
                  <div class="lock-overlay">
                    <span class="lock-price">{{ characterCosts[character.id] }} <i class="fas fa-coins"></i></span>
                    <button 
                      @click="unlockCharacter(character.id)" 
                      class="btn btn-sm btn-warning"
                      :disabled="gold < characterCosts[character.id]"
                    >
                      Unlock
                    </button>
                  </div>
                  <img :src="character.imgUrl" :alt="character.name" class="character-img" />
                  <div class="p-2">
                    <h5>{{ character.name }}</h5>
                    <div class="d-flex justify-content-between">
                      <span>HP: {{ character.maxHealth }}</span>
                      <span>ATK: {{ character.attack }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boss Selection -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Choose Your Enemy</h2>
            </div>
            <div class="card-body">
              <h5>Unlocked Enemies</h5>
              <div class="d-flex flex-wrap justify-content-center">
                <div 
                  v-for="enemy in filteredEnemies" 
                  :key="enemy.id" 
                  class="boss-card m-2"
                  :class="{ 'selected': selectedEnemy === enemy.id }"
                  @click="selectEnemy(enemy.id)"
                >
                  <div class="reward-badge">
                    {{ enemy.goldReward }} <i class="fas fa-coins"></i>
                  </div>
                  <img :src="enemy.imgUrl" :alt="enemy.name" class="boss-img" />
                  <div class="p-2">
                    <h5>{{ enemy.name }}</h5>
                    <p>{{ enemy.description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Locked Enemies -->
              <h5 class="mt-4">Locked Enemies</h5>
              <div class="d-flex flex-wrap justify-content-center">
                <div 
                  v-for="enemy in lockedEnemies" 
                  :key="enemy.id" 
                  class="boss-card locked m-2"
                >
                  <div class="lock-overlay">
                    <span class="lock-price">{{ enemyCosts[enemy.id] }} <i class="fas fa-coins"></i></span>
                    <button 
                      @click="unlockEnemy(enemy.id)" 
                      class="btn btn-sm btn-warning"
                      :disabled="gold < enemyCosts[enemy.id]"
                    >
                      Unlock
                    </button>
                  </div>
                  <div class="reward-badge">
                    {{ enemy.goldReward }} <i class="fas fa-coins"></i>
                  </div>
                  <img :src="enemy.imgUrl" :alt="enemy.name" class="boss-img" />
                  <div class="p-2">
                    <h5>{{ enemy.name }}</h5>
                    <p>{{ enemy.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Start Battle Button -->
        <div class="col-12 col-md-8 text-center mb-4">
          <button 
            class="btn btn-danger btn-lg"
            :disabled="!isReadyToFight"
            @click="startBattle"
          >
            START BATTLE
          </button>
          <p v-if="!isReadyToFight" class="mt-2 text-muted">
            Please select a character and a boss to begin
          </p>
        </div>
        
        <!-- How to Play -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>How to Play</h2>
            </div>
            <div class="card-body">
              <ol>
                <li>
                  <h5>Choose Your Character</h5>
                  <p>Select a character with unique abilities and stats.</p>
                </li>
                <li>
                  <h5>Choose Your Enemy</h5>
                  <p>Select a boss to battle against.</p>
                </li>
                <li>
                  <h5>Battle!</h5>
                  <p>Use your attacks strategically to defeat the boss. Some attacks have cooldowns before they can be used again.</p>
                </li>
                <li>
                  <h5>Earn Gold</h5>
                  <p>Defeat bosses to earn gold, which can be used to unlock new characters and enemies.</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Battle Screen -->
    <div v-if="battleMode" class="battle-screen">
      <div class="row justify-content-center">
        <div class="col-12 text-center mb-4">
          <h1 class="my-3">BOSS BATTLE</h1>
        </div>
        
        <!-- Battle Arena -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>Battle Arena</span>
              <span v-if="battleActive" class="turn-indicator">
                {{ playerTurn ? 'Your Turn' : 'Enemy Turn' }}
              </span>
            </div>
            <div class="card-body">
              <!-- Boss Section -->
              <div class="enemy-section mb-4" v-if="boss">
                <h4>{{ boss.name }}</h4>
                <div class="health-bar">
                  <div 
                    class="health-fill" 
                    :style="{
                      width: healthPercent(boss.currentHealth, boss.maxHealth) + '%',
                      backgroundColor: healthColor(boss.currentHealth, boss.maxHealth)
                    }"
                  ></div>
                  <span class="health-text">{{ boss.currentHealth }} / {{ boss.maxHealth }}</span>
                </div>
                <img :src="boss.imgUrl" :alt="boss.name" class="battle-img my-3" />
                
                <!-- Status Effects -->
                <div class="status-effects" v-if="boss.burning || bossStunned">
                  <span v-if="boss.burning" class="badge bg-danger me-1">Burning</span>
                  <span v-if="bossStunned" class="badge bg-warning text-dark">Stunned</span>
                </div>
              </div>
              
              <!-- Player Section -->
              <div class="player-section" v-if="player">
                <h4>{{ player.name }}</h4>
                <div class="health-bar">
                  <div 
                    class="health-fill" 
                    :style="{
                      width: healthPercent(player.currentHealth, player.maxHealth) + '%',
                      backgroundColor: healthColor(player.currentHealth, player.maxHealth)
                    }"
                  ></div>
                  <span class="health-text">{{ player.currentHealth }} / {{ player.maxHealth }}</span>
                </div>
                <img :src="player.imgUrl" :alt="player.name" class="battle-img my-3" />
                
                <!-- Status Effects -->
                <div class="status-effects">
                  <span v-if="playerBarrier > 0" class="badge bg-primary me-1">Barrier: {{ playerBarrier }}</span>
                  <span v-if="playerDodging" class="badge bg-info me-1">Dodging</span>
                  <span v-if="playerBurning" class="badge bg-danger me-1">Burning</span>
                  <span v-if="playerSlowed" class="badge bg-secondary">Slowed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Battle Controls -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Actions</h2>
            </div>
            <div class="card-body">
              <!-- Attack Buttons -->
              <div v-if="battleActive && playerTurn" class="attack-buttons">
                <h5 class="mb-3">Choose your attack:</h5>
                <div class="d-flex flex-wrap">
                  <button 
                    v-for="attack in availableAttacks" 
                    :key="attack.id"
                    @click="useAttack(attack)"
                    class="btn m-1"
                    :class="{ 
                      'btn-danger': attack.type === 'physical',
                      'btn-primary': attack.type === 'magical',
                      'btn-success': attack.type === 'support'
                    }"
                  >
                    {{ attack.name }} 
                    <span v-if="attack.damage > 0">(DMG: {{ attack.damage }})</span>
                    <span v-if="attack.heal">(HEAL: {{ attack.heal }})</span>
                    <span v-if="attack.stun" class="badge bg-warning text-dark ms-1">Stun</span>
                    <span v-if="attack.burn" class="badge bg-danger ms-1">Burn</span>
                    <span v-if="attack.slow" class="badge bg-info ms-1">Slow</span>
                    <span v-if="attack.multi" class="badge bg-secondary ms-1">Multi: {{ attack.multi }}</span>
                    <span v-if="attack.barrier" class="badge bg-primary ms-1">Barrier</span>
                    <span v-if="attack.dodge" class="badge bg-info ms-1">Dodge</span>
                  </button>
                </div>
                
                <!-- Attacks on Cooldown -->
                <h5 class="my-3">Attacks on Cooldown:</h5>
                <div class="d-flex flex-wrap">
                  <div 
                    v-for="attack in attacksOnCooldown" 
                    :key="attack.id"
                    class="attack-cooldown m-1"
                  >
                    {{ attack.name }} 
                    <span class="badge bg-secondary">{{ attack.currentCooldown }} turns</span>
                  </div>
                </div>
              </div>
              
              <!-- Enemy Turn Message -->
              <div v-else-if="battleActive && !playerTurn" class="enemy-turn">
                <p class="text-center">{{ boss.name }} is making their move...</p>
              </div>
              
              <!-- Battle Results -->
              <div v-else class="battle-results text-center">
                <h3 v-if="player && player.currentHealth <= 0" class="text-danger">Defeat!</h3>
                <h3 v-else-if="boss && boss.currentHealth <= 0" class="text-success">Victory!</h3>
                <button @click="resetBattle" class="btn btn-primary mt-3">Play Again</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Battle Log -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Battle Log</h2>
            </div>
            <div class="card-body">
              <div class="battle-log">
                <div v-for="(log, index) in battleLog" :key="index" class="log-entry">
                  {{ log }}
                </div>
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
import { AppState } from '../AppState.js'
import { characterService } from '../services/CharacterService.js'
import { enemyService } from '../services/EnemyService.js'
import { gameService } from '../services/GameService.js'
import { playerService } from '../services/PlayerService.js'
import { combatService } from '../services/CombatService.js'

export default {
  name: 'HomePage',
  setup() {
    // Load saved data on page load
    characterService.loadGameData()
    
    return {
      // AppState data (computed properties)
      gold: computed(() => AppState.gold),
      playerLevel: computed(() => AppState.playerLevel),
      selectedHero: computed(() => AppState.selectedHero),
      selectedEnemy: computed(() => AppState.selectedEnemy),
      battleMode: computed(() => AppState.battleMode),
      battleActive: computed(() => AppState.battleActive),
      playerTurn: computed(() => AppState.playerTurn),
      battleLog: computed(() => AppState.battleLog),
      characterCosts: computed(() => AppState.characterCosts),
      enemyCosts: computed(() => AppState.enemyCosts),
      player: computed(() => AppState.player),
      boss: computed(() => AppState.boss),
      bossStunned: computed(() => AppState.bossStunned),
      playerBarrier: computed(() => AppState.playerBarrier),
      playerDodging: computed(() => AppState.playerDodging),
      playerBurning: computed(() => AppState.playerBurning),
      playerSlowed: computed(() => AppState.playerSlowed),
      
      // Computed properties for filtering and calculations
      filteredCharacters: computed(() => characterService.getFilteredCharacters()),
      lockedCharacters: computed(() => characterService.getLockedCharacters()),
      filteredEnemies: computed(() => enemyService.getFilteredEnemies()),
      lockedEnemies: computed(() => enemyService.getLockedEnemies()),
      availableAttacks: computed(() => AppState.player ? AppState.player.attacks.filter(a => a.currentCooldown === 0) : []),
      attacksOnCooldown: computed(() => AppState.player ? AppState.player.attacks.filter(a => a.currentCooldown > 0) : []),
      isReadyToFight: computed(() => gameService.isReadyToFight()),
      
      // Coordinator functions that call service methods
      selectHero(id) {
        characterService.selectHero(id)
      },
      
      selectEnemy(id) {
        enemyService.selectEnemy(id)
      },
      
      unlockCharacter(id) {
        characterService.unlockCharacter(id)
      },
      
      unlockEnemy(id) {
        enemyService.unlockEnemy(id)
      },
      
      startBattle() {
        gameService.startBattle()
      },
      
      resetBattle() {
        gameService.resetBattle()
      },
      
      resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
          const message = characterService.resetProgress()
          alert(message)
        }
      },
      
      useAttack(attack) {
        playerService.usePlayerAttack(attack)
      },
      
      healthPercent(current, max) {
        return combatService.healthPercent(current, max)
      },
      
      healthColor(current, max) {
        return combatService.healthColor(current, max)
      }
    }
  }
}
</script>

<style scoped>
/* Card Styles */
.character-card, .boss-card {
  width: 200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.character-card:hover, .boss-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.character-card.selected, .boss-card.selected {
  border-color: #dc3545;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

/* Locked character styles */
.character-card.locked, .boss-card.locked {
  filter: grayscale(70%);
  opacity: 0.8;
  cursor: default;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: white;
}

.lock-price {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #ffc107;
}

/* Gold reward badge */
.reward-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffc107;
  color: #212529;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 1;
}

/* Player stats */
.player-stats {
  font-size: 1.2rem;
}

.character-img, .boss-img, .battle-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.battle-img {
  max-width: 200px;
  margin: 0 auto;
  display: block;
}

/* Health Bar Styles */
.health-bar {
  width: 100%;
  height: 24px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid #dee2e6;
  margin: 10px 0;
}

.health-fill {
  height: 100%;
  background-color: #28a745;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212529;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

/* Status Effects */
.status-effects {
  margin-top: 10px;
}

/* Battle Log Styles */
.battle-log {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  background-color: #f8f9fa;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.log-entry:last-child {
  border-bottom: none;
}

/* Turn Indicator */
.turn-indicator {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

/* Battle Screen Specific Styles */
.enemy-section, .player-section {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.enemy-section {
  background-color: #f8d7da;
}

.player-section {
  background-color: #d1ecf1;
}

/* Attack Buttons */
.attack-buttons {
  text-align: center;
}

/* Attack Cooldowns */
.attack-cooldown {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  opacity: 0.7;
}

/* Battle Results */
.battle-results {
  padding: 20px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .character-card, .boss-card {
    width: 160px;
  }
  
  .character-img, .boss-img {
    height: 100px;
  }
  
  .lock-price {
    font-size: 1rem;
  }
  
  .reward-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
}
</style>