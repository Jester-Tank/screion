<template>
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