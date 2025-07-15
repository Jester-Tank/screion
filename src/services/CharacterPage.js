<template>
  <div class="container-fluid character-page">
    <div class="row">
      <div class="col-md-4">
        <h2>Available Heroes</h2>

        <div class="character-section">
          <h3 class="text-success">Paladins</h3>
          <div class="character-list">
            <div
              v-for="paladin in paladins" 
              :key="paladin.id"
            class="character-card"
            :class="{'active': paladin.isActive }"
            @click="setActivePaladin(paladin.id)"
            >
            <div class="character-info">
              <h4>{{ paladin.name }}</h4>
              <p class="character-title">{{ paladin.title }} - Level {{ paladin.level }}</p>
              <div class="character-xp">
                <small>XP: {{ paladin.experience || 0 }}</small>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary mb-3" @click="openNewPaladinForm">+ New Paladin</button>
    </div>

    <div class="character-section">
      <h3 class="text-info">Archers</h3>
      <div class="character-list">
        <div
          v-for="archer in archers" 
              :key="archer.id"
        class="character-card"
        :class="{'active': archer.isActive }"
        @click="setActiveArcher(archer.id)"
            >
        <div class="character-info">
          <h4>{{ archer.name }}</h4>
          <p class="character-title">{{ archer.title }} - Level {{ archer.level }}</p>
          <div class="character-xp">
            <small>XP: {{ archer.experience || 0 }}</small>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-info mb-3" @click="openNewArcherForm">+ New Archer</button>
</div>
      </div >
      
      <div class="col-md-8">
        <div v-if="activeCharacter" class="character-details">
          <div class="character-header">
            <div class="character-title-section">
              <h1>{{ activeCharacter.name }}</h1>
              <h4 class="text-muted">{{ activeCharacter.title }} - Level {{ activeCharacter.level }}</h4>
              <p>{{ activeCharacter.description }}</p>
            </div>
          </div>
          
          <div class="xp-section card mb-4">
            <div class="card-header">
              <h5>Experience Progress</h5>
            </div>
            <div class="card-body">
              <div class="progress mb-3" style="height: 25px;">
                <div 
                  class="progress-bar bg-warning progress-bar-striped" 
                  :style="{ width: getXPProgressPercent() + '%' }"
                >
                  {{ Math.round(getXPProgressPercent()) }}%
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <strong>Current XP:</strong> {{ activeCharacter.experience || 0 }}
                </div>
                <div class="col-md-4">
                  <strong>Level:</strong> {{ activeCharacter.level }}
                </div>
                <div class="col-md-4">
                  <strong>Max Level:</strong> 20
                </div>
              </div>
              
              <div class="mt-3">
                <button 
                  class="btn btn-warning me-2" 
                  @click="trainCharacter"
                  :disabled="!canAffordTraining() || isMaxLevel()"
                >
                  Train ({{ getTrainingCost() }} Gold) - Get XP
                </button>
                <div v-if="isMaxLevel()" class="alert alert-success mt-2">
                  <strong>Maximum Level Reached!</strong> {{ activeCharacter.name }} has reached the maximum level.
                </div>
                <small v-else class="text-muted">Training gives experience to level up your character</small>
              </div>
            </div>
          </div>
          
          <div class="stats-section">
            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5>Stats</h5>
                  </div>
                  <div class="card-body">
                    <div class="stat-row">
                      <span>Health:</span>
                      <span>{{ activeCharacter.currentHealth || activeCharacter.maxHealth }} / {{ activeCharacter.maxHealth }}</span>
                    </div>
                    <div class="stat-row">
                      <span>Attack:</span>
                      <span>{{ activeCharacter.attack }}</span>
                    </div>
                    <div class="stat-row">
                      <span>Defense:</span>
                      <span>{{ activeCharacter.defense }}</span>
                    </div>
                    <div v-if="activeCharacter.characterClass === 'paladin'" class="stat-row">
                      <span>Holy Power:</span>
                      <span>{{ activeCharacter.holyPower }}</span>
                    </div>
                    <div v-if="activeCharacter.characterClass === 'archer'" class="stat-row">
                      <span>Range:</span>
                      <span>{{ activeCharacter.range }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5>Skills</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="activeCharacter.skills && activeCharacter.skills.length > 0">
                      <div 
                        v-for="skill in activeCharacter.skills" 
                        :key="skill" 
                        class="skill-badge"
                      >
                        {{ skill }}
                      </div>
                    </div>
                    <p v-else class="text-muted">
                      No special skills yet. Level up to learn new abilities!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div >
          
          <div class="action-buttons mt-4">
            <button 
              class="btn btn-success me-2" 
              @click="fullHeal"
              :disabled="!canAffordHeal()"
            >
              Full Heal ({{ getHealCost() }} Gold)
            </button>
            <router-link to="/bosses" class="btn btn-danger">
              Fight Bosses
            </router-link>
          </div >
        </div >

  <div v-else class="character-details">
    <div class="character-header">
      <div class="character-title-section">
        <h1>Select a Character</h1>
        <h4 class="text-muted">Choose a hero from the left</h4>
        <p>Character details will appear here.</p>
      </div>
    </div>
  </div>
      </div >
    </div >
  </div >
</template >

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState.js'
import { paladinService } from '../services/PaladinService.js'
import { archerService } from '../services/ArcherService.js'

export default {
  name: 'CharacterPage',
  setup() {
    onMounted(() => {
      if (AppState.paladins.length > 0 && !AppState.activeCharacter) {
        paladinService.setActivePaladin(AppState.paladins[0].id)
      }
    })

    const paladins = computed(() => AppState.paladins)
    const archers = computed(() => AppState.archers)
    const activeCharacter = computed(() => AppState.activeCharacter)
    const gold = computed(() => AppState.gold)

    function setActivePaladin(paladinId) {
      paladinService.setActivePaladin(paladinId)
    }

    function setActiveArcher(archerId) {
      archerService.setActiveArcher(archerId)
    }

    function trainCharacter() {
      if (!activeCharacter.value) return

      const cost = getTrainingCost()
      if (AppState.gold >= cost && !isMaxLevel()) {
        AppState.spendGold(cost)
        
        // Add XP (20-35)
        const xpGain = 20 + Math.floor(Math.random() * 16)
        activeCharacter.value.experience += xpGain
        
        // Check for level up (simple system)
        const xpNeeded = activeCharacter.value.level * 100
        if (activeCharacter.value.experience >= xpNeeded && activeCharacter.value.level < 20) {
          activeCharacter.value.level++
          activeCharacter.value.experience = 0
          
          // Increase stats on level up
          activeCharacter.value.maxHealth += 10
          activeCharacter.value.currentHealth = activeCharacter.value.maxHealth
          activeCharacter.value.attack += 3
          activeCharacter.value.defense += 2
          
          if (activeCharacter.value.holyPower !== undefined) {
            activeCharacter.value.holyPower += 5
          }
          
          alert(`🎉 Level Up! ${activeCharacter.value.name} reached Level ${activeCharacter.value.level}!`)
        } else {
          alert(`${activeCharacter.value.name} gained ${xpGain} XP!`)
        }
        
        AppState.saveGameData()
      }
    }

    function fullHeal() {
      if (!activeCharacter.value) return

      const healCost = getHealCost()
      if (AppState.gold >= healCost) {
        AppState.spendGold(healCost)
        activeCharacter.value.currentHealth = activeCharacter.value.maxHealth
        alert(`${activeCharacter.value.name} fully healed!`)
        AppState.saveGameData()
      } else {
        alert('Not enough gold!')
      }
    }

    function getXPProgressPercent() {
      if (!activeCharacter.value) return 0
      if (isMaxLevel()) return 100
      
      const xpNeeded = activeCharacter.value.level * 100
      const currentXP = activeCharacter.value.experience || 0
      return Math.min(100, (currentXP / xpNeeded) * 100)
    }

    function isMaxLevel() {
      return activeCharacter.value && activeCharacter.value.level >= 20
    }

    function getTrainingCost() {
      if (!activeCharacter.value) return 0
      return Math.floor(activeCharacter.value.level * 8)
    }

    function getHealCost() {
      return 10
    }

    function canAffordTraining() {
      return gold.value >= getTrainingCost()
    }

    function canAffordHeal() {
      return gold.value >= getHealCost()
    }

    function openNewPaladinForm() {
      alert('Paladin creation form - this would be implemented with a modal or navigation')
    }

    function openNewArcherForm() {
      alert('Archer creation form - this would be implemented with a modal or navigation')
    }

    return {
      paladins,
      archers,
      activeCharacter,
      gold,
      setActivePaladin,
      setActiveArcher,
      trainCharacter,
      fullHeal,
      getXPProgressPercent,
      isMaxLevel,
      getTrainingCost,
      getHealCost,
      canAffordTraining,
      canAffordHeal,
      openNewPaladinForm,
      openNewArcherForm
    }
  }
}
</script>

<style scoped lang="scss">
.character-page {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.character-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #28a745;
    background-color: rgba(40, 167, 69, 0.1);
  }
}

.character-info {
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .character-title {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  .character-xp {
    margin-top: 0.25rem;
    
    small {
      color: #888;
      font-size: 0.75rem;
    }
  }
}

.character-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}

.skill-badge {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin: 0.25rem;
}

.progress {
  position: relative;
  
  .progress-bar {
    transition: width 0.5s ease;
  }
}

.action-buttons {
  .btn {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>