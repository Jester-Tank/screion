<template>
  <div class="container-fluid">
    <!-- Character Selection Screen -->
    <div v-if="!battleMode" class="selection-screen">
      <div class="row justify-content-center">
        <div class="col-12 text-center mb-4">
          <h1 class="my-3">BOSS BATTLE</h1>
          <p>Defeat the fearsome enemies to become a hero!</p>
        </div>
        
        <!-- Character Selection -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Choose Your Hero</h2>
            </div>
            <div class="card-body d-flex flex-wrap justify-content-center">
              <div 
                v-for="character in characters" 
                :key="character.id" 
                class="character-card m-2"
                :class="{ 'selected': selectedHero === character.id }"
                @click="selectHero(character.id)"
              >
                <img :src="character.imgUrl" :alt="character.name" class="character-img">
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
        
        <!-- Boss Selection -->
        <div class="col-12 col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h2>Choose Your Enemy</h2>
            </div>
            <div class="card-body d-flex flex-wrap justify-content-center">
              <div 
                v-for="enemy in enemies" 
                :key="enemy.id" 
                class="boss-card m-2"
                :class="{ 'selected': selectedEnemy === enemy.id }"
                @click="selectEnemy(enemy.id)"
              >
                <img :src="enemy.imgUrl" :alt="enemy.name" class="boss-img">
                <div class="p-2">
                  <h5>{{ enemy.name }}</h5>
                  <p>{{ enemy.description }}</p>
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
                  <p>Use your attacks strategically to defeat the boss.</p>
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
                <img :src="boss.imgUrl" :alt="boss.name" class="battle-img my-3">
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
                <img :src="player.imgUrl" :alt="player.name" class="battle-img my-3">
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
                  </button>
                </div>
              </div>
              
              <!-- Enemy Turn Message -->
              <div v-else-if="battleActive && !playerTurn" class="enemy-turn">
                <p class="text-center">{{ boss.name }} is making their move...</p>
              </div>
              
              <!-- Battle Results -->
              <div v-else class="battle-results text-center">
                <h3 v-if="player.currentHealth <= 0" class="text-danger">Defeat!</h3>
                <h3 v-else-if="boss.currentHealth <= 0" class="text-success">Victory!</h3>
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
export default {
  name: 'HomePage',
  data() {
    return {
      selectedHero: null,
      selectedEnemy: null,
      battleMode: false,
      characters: [
        {
          id: 'knight',
          name: 'Knight',
          maxHealth: 150,          // Increased health
          currentHealth: 150,
          attack: 15,              // Increased attack
          defense: 10,             // Increased defense
          imgUrl: 'https://placehold.co/200x200?text=Knight',
          attacks: [
            { id: 'slash', name: 'Slash', damage: 20, type: 'physical' },
            { id: 'shield-bash', name: 'Shield Bash', damage: 15, type: 'physical', stun: true },
            { id: 'heavy-blow', name: 'Heavy Blow', damage: 30, type: 'physical' },
            { id: 'rally', name: 'Rally', damage: 0, type: 'support', heal: 25 }
          ]
        },
        {
          id: 'mage',
          name: 'Mage',
          maxHealth: 120,          // Increased health
          currentHealth: 120,
          attack: 20,              // Increased attack
          defense: 5,
          imgUrl: 'https://placehold.co/200x200?text=Mage',
          attacks: [
            { id: 'fireball', name: 'Fireball', damage: 25, type: 'magical', burn: true },
            { id: 'ice-shard', name: 'Ice Shard', damage: 20, type: 'magical', slow: true },
            { id: 'arcane-blast', name: 'Arcane Blast', damage: 35, type: 'magical' },
            { id: 'heal', name: 'Heal', damage: 0, type: 'support', heal: 30 }
          ]
        }
      ],
      enemies: [
        {
          id: 'dragon',
          name: 'Ancient Dragon',
          maxHealth: 200,
          currentHealth: 200,
          attack: 12,              // Decreased attack
          defense: 8,
          description: 'A fearsome dragon with fire breath and thick scales',
          imgUrl: 'https://placehold.co/200x200?text=Dragon',
          attackChance: 0.7        // 70% chance to hit
        },
        {
          id: 'necromancer',
          name: 'Dark Necromancer',
          maxHealth: 180,
          currentHealth: 180,
          attack: 15,              // Decreased attack
          defense: 5,
          description: 'A sinister spellcaster with command over the dead',
          imgUrl: 'https://placehold.co/200x200?text=Necromancer',
          attackChance: 0.8        // 80% chance to hit
        }
      ],
      // Battle state
      playerTurn: true,
      battleLog: ['Prepare for battle!'],
      battleActive: false,
      turnCount: 0,
      bossStunned: false,
      playerBurning: false,
      playerSlowed: false
    }
  },
  computed: {
    isReadyToFight() {
      return this.selectedHero && this.selectedEnemy
    },
    player() {
      if (!this.selectedHero) return null
      return this.characters.find(c => c.id === this.selectedHero)
    },
    boss() {
      if (!this.selectedEnemy) return null
      return this.enemies.find(e => e.id === this.selectedEnemy)
    },
    availableAttacks() {
      if (!this.player) return []
      return this.player.attacks
    }
  },
  methods: {
    selectHero(id) {
      console.log('Selecting hero:', id)
      this.selectedHero = id
    },
    selectEnemy(id) {
      console.log('Selecting enemy:', id)
      this.selectedEnemy = id
    },
    startBattle() {
      if (!this.isReadyToFight) return
      
      console.log('Starting battle with:', { 
        hero: this.selectedHero, 
        enemy: this.selectedEnemy 
      })
      
      // Initialize battle state
      this.battleActive = true
      this.playerTurn = true
      this.turnCount = 0
      this.bossStunned = false
      this.playerBurning = false
      this.playerSlowed = false
      this.battleLog = [`Battle started! ${this.player.name} vs ${this.boss.name}`]
      
      // Reset health
      this.player.currentHealth = this.player.maxHealth
      this.boss.currentHealth = this.boss.maxHealth
      
      // Switch to battle mode
      this.battleMode = true
    },
    useAttack(attack) {
      if (!this.battleActive || !this.playerTurn) return
      
      this.turnCount++
      
      // Calculate base damage (increased player damage)
      let damage = attack.damage + (this.player.attack / 5)  // Increased from /10 to /5
      
      // Apply defense reduction (reduced boss defense effect)
      const defenseReduction = this.boss.defense / 30  // Reduced from /20 to /30
      damage = Math.max(1, damage - defenseReduction)
      
      // Add some randomness
      const critChance = 0.15  // 15% chance to critical hit
      let isCrit = false
      
      if (Math.random() < critChance) {
        damage *= 1.5  // 50% bonus damage on crit
        isCrit = true
      }
      
      // Round damage to integer
      damage = Math.floor(damage)
      
      // Apply damage
      this.boss.currentHealth = Math.max(0, this.boss.currentHealth - damage)
      
      // Add to battle log
      let logMessage = `${this.player.name} used ${attack.name} and dealt ${damage} damage!`
      if (isCrit) {
        logMessage += ' CRITICAL HIT!'
      }
      this.battleLog.push(logMessage)
      
      // Apply special effects
      if (attack.stun && Math.random() < 0.4) {  // 40% chance to stun
        this.bossStunned = true
        this.battleLog.push(`${this.boss.name} is stunned!`)
      }
      
      if (attack.burn && Math.random() < 0.4) {  // 40% chance to burn
        this.boss.burning = true
        this.battleLog.push(`${this.boss.name} is burning!`)
      }
      
      // Apply healing
      if (attack.heal) {
        const healAmount = attack.heal
        this.player.currentHealth = Math.min(this.player.maxHealth, this.player.currentHealth + healAmount)
        this.battleLog.push(`${this.player.name} healed for ${healAmount} health!`)
      }
      
      // Check for boss defeat
      if (this.boss.currentHealth <= 0) {
        this.battleLog.push(`${this.boss.name} has been defeated!`)
        this.battleActive = false
        return
      }
      
      // Switch turn
      this.playerTurn = false
      
      // Boss attacks after a short delay
      setTimeout(() => {
        this.bossTurn()
      }, 1000)
    },
    bossTurn() {
      if (!this.battleActive) return
      
      // Check if boss is stunned
      if (this.bossStunned) {
        this.battleLog.push(`${this.boss.name} is stunned and cannot attack!`)
        this.bossStunned = false  // Remove stun after one turn
        this.playerTurn = true  // Back to player's turn
        return
      }
      
      // Apply burn damage if boss is burning
      if (this.boss.burning) {
        const burnDamage = Math.floor(this.player.attack / 4)
        this.boss.currentHealth = Math.max(0, this.boss.currentHealth - burnDamage)
        this.battleLog.push(`${this.boss.name} takes ${burnDamage} burn damage!`)
        
        // Check for boss defeat from burn damage
        if (this.boss.currentHealth <= 0) {
          this.battleLog.push(`${this.boss.name} has been defeated by burn damage!`)
          this.battleActive = false
          return
        }
        
        // 30% chance to remove burning
        if (Math.random() < 0.3) {
          this.boss.burning = false
          this.battleLog.push(`${this.boss.name} is no longer burning.`)
        }
      }
      
      // Boss attack miss chance
      if (Math.random() > this.boss.attackChance) {
        this.battleLog.push(`${this.boss.name}'s attack missed!`)
        this.playerTurn = true
        return
      }
      
      // Boss attack (reduced damage and more randomness)
      const minDamage = Math.floor(this.boss.attack * 0.7)
      const maxDamage = Math.floor(this.boss.attack * 1.2)
      const damageRange = maxDamage - minDamage
      let damage = minDamage + Math.floor(Math.random() * damageRange)
      
      // Apply player defense (increased effect)
      const defenseReduction = this.player.defense / 15  // Increased from base level
      damage = Math.max(1, damage - defenseReduction)
      
      // Apply damage
      this.player.currentHealth = Math.max(0, this.player.currentHealth - damage)
      
      // Add to battle log
      this.battleLog.push(`${this.boss.name} attacks and deals ${damage} damage!`)
      
      // Every 3rd turn, boss does something special
      if (this.turnCount % 3 === 0) {
        // 50% chance to heal a bit
        if (Math.random() < 0.5) {
          const healAmount = Math.floor(this.boss.maxHealth * 0.05)  // Only heal 5% of max health
          this.boss.currentHealth = Math.min(this.boss.maxHealth, this.boss.currentHealth + healAmount)
          this.battleLog.push(`${this.boss.name} recovers ${healAmount} health!`)
        }
      }
      
      // Check for player defeat
      if (this.player.currentHealth <= 0) {
        this.battleLog.push(`${this.player.name} has been defeated!`)
        this.battleActive = false
        return
      }
      
      // Switch turn back to player
      this.playerTurn = true
      
      // Clear player slowed effect after one turn
      if (this.playerSlowed) {
        this.playerSlowed = false
        this.battleLog.push(`${this.player.name} is no longer slowed.`)
      }
    },
    resetBattle() {
      // Reset battle state
      this.battleMode = false
      this.battleActive = false
      this.selectedHero = null
      this.selectedEnemy = null
      this.battleLog = ['Prepare for battle!']
      this.turnCount = 0
      this.bossStunned = false
      this.playerBurning = false
      this.playerSlowed = false
    },
    healthPercent(current, max) {
      return (current / max) * 100
    },
    healthColor(current, max) {
      const percent = (current / max) * 100
      if (percent > 70) return '#4CAF50' // Green
      if (percent > 40) return '#FFC107' // Yellow
      return '#F44336' // Red
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

/* Battle Results */
.battle-results {
  padding: 20px;
}
</style>