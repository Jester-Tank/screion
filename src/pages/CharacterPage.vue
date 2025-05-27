<template>
  <div class="container-fluid characters-page">
    <div class="row my-3">
      <div class="col-12 text-center">
        <h1>Heroes of the Realm</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3>Available Heroes</h3>
          </div>
          <div class="card-body characters-list">
            <div class="mb-3">
              <h4 class="text-primary">Paladins</h4>
              <div v-for="paladin in paladins" :key="paladin.id" class="character-item p-2 my-2"
                :class="{ 'active-character': paladin.isActive }" @click="setActivePaladin(paladin.id)">
                <div class="d-flex align-items-center">
                  <img :src="paladin.imageUrl" alt="Paladin" class="character-avatar me-2">
                  <div>
                    <h5 class="mb-0">{{ paladin.name }}</h5>
                    <p class="mb-0">{{ paladin.title }} - Level {{ paladin.level }}</p>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm mt-2" @click="openNewPaladinForm">
                <i class="mdi mdi-plus"></i> New Paladin
              </button>
            </div>

            <div>
              <h4 class="text-success">Archers</h4>
              <div v-for="archer in archers" :key="archer.id" class="character-item p-2 my-2"
                :class="{ 'active-character': archer.isActive }" @click="setActiveArcher(archer.id)">
                <div class="d-flex align-items-center">
                  <img :src="archer.imageUrl" alt="Archer" class="character-avatar me-2">
                  <div>
                    <h5 class="mb-0">{{ archer.name }}</h5>
                    <p class="mb-0">{{ archer.title }} - Level {{ archer.level }}</p>
                  </div>
                </div>
              </div>
              <button class="btn btn-success btn-sm mt-2" @click="openNewArcherForm">
                <i class="mdi mdi-plus"></i> New Archer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div v-if="activeCharacter" class="card">
          <div class="card-header d-flex justify-content-between align-items-center" :class="{
            'bg-primary text-white': activeCharacter.characterClass === 'paladin',
            'bg-success text-white': activeCharacter.characterClass === 'archer'
          }">
            <h2>{{ activeCharacter.name }}, {{ activeCharacter.title }}</h2>
            <span class="badge bg-light text-dark">Level {{ activeCharacter.level }}</span>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <img :src="activeCharacter.imageUrl" :alt="activeCharacter.name" class="img-fluid rounded mb-3">
                <div class="progress mb-2">
                  <div class="progress-bar bg-danger" role="progressbar"
                    :style="{ width: ((activeCharacter.currentHealth / activeCharacter.maxHealth) * 100) + '%' }"
                    :aria-valuenow="activeCharacter.currentHealth" aria-valuemin="0"
                    :aria-valuemax="activeCharacter.maxHealth">
                    HP: {{ activeCharacter.currentHealth || activeCharacter.maxHealth }} / {{ activeCharacter.maxHealth
                    }}
                  </div>
                </div>
                <div class="progress mb-3">
                  <div class="progress-bar bg-info" role="progressbar"
                    :style="{ width: (activeCharacter.experience / (activeCharacter.level * 100) * 100) + '%' }"
                    :aria-valuenow="activeCharacter.experience" aria-valuemin="0"
                    :aria-valuemax="activeCharacter.level * 100">
                    XP: {{ activeCharacter.experience }} / {{ activeCharacter.level * 100 }}
                  </div>
                </div>
              </div>

              <div class="col-md-8">
                <p class="lead">{{ activeCharacter.description }}</p>

                <div class="row stats mt-3">
                  <div class="col-md-6">
                    <h5>Stats</h5>
                    <ul class="list-group">
                      <li class="list-group-item d-flex justify-content-between">
                        <span>Attack:</span> <span>{{ activeCharacter.attack }}</span>
                      </li>
                      <li class="list-group-item d-flex justify-content-between">
                        <span>Defense:</span> <span>{{ activeCharacter.defense }}</span>
                      </li>
                      <li v-if="activeCharacter.characterClass === 'archer'"
                        class="list-group-item d-flex justify-content-between">
                        <span>Range:</span> <span>{{ activeCharacter.range }}</span>
                      </li>
                      <li v-if="activeCharacter.characterClass === 'paladin'"
                        class="list-group-item d-flex justify-content-between">
                        <span>Holy Power:</span> <span>{{ activeCharacter.holyPower }}</span>
                      </li>
                    </ul>
                  </div>

                  <div class="col-md-6">
                    <h5>Skills</h5>
                    <ul class="list-group">
                      <li v-for="skill in activeCharacter.skills" :key="skill" class="list-group-item">
                        {{ skill }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-3">
                  <h5>Inventory</h5>
                  <div class="inventory d-flex flex-wrap">
                    <span v-for="item in activeCharacter.inventory" :key="item" class="badge bg-secondary m-1 p-2">{{
                      item }}</span>
                  </div>
                </div>

                <div class="mt-4">
                  <button class="btn btn-primary me-2" @click="addExperience(50)">
                    Train (+50 XP)
                  </button>
                  <button class="btn btn-success me-2" @click="equipItem">
                    Find Equipment
                  </button>
                  <button v-if="activeCharacter.characterClass === 'paladin'" class="btn btn-info" @click="castHeal"
                    :disabled="activeCharacter.holyPower < 10">
                    Heal (10 Holy Power)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card">
          <div class="card-body text-center p-5">
            <h3>Select a character to view their details</h3>
            <p>Choose a paladin or archer from the list on the left.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState.js'
import { paladinService } from '../services/PaladinService.js'
import { archerService } from '../services/ArcherService.js'

export default {
  setup() {
    onMounted(() => {
      if (AppState.paladins.length > 0 && !AppState.activeCharacter) {
        paladinService.setActivePaladin(AppState.paladins[0].id)
      }
    })

    const paladins = computed(() => AppState.paladins)
    const archers = computed(() => AppState.archers)
    const activeCharacter = computed(() => AppState.activeCharacter)

    function setActivePaladin(paladinId) {
      paladinService.setActivePaladin(paladinId)
    }

    function setActiveArcher(archerId) {
      archerService.setActiveArcher(archerId)
    }

    function addExperience(amount) {
      if (activeCharacter.value) {
        if (activeCharacter.value.characterClass === 'paladin') {
          paladinService.addExperience(activeCharacter.value.id, amount)
        } else if (activeCharacter.value.characterClass === 'archer') {
          archerService.addExperience(activeCharacter.value.id, amount)
        }
      }
    }

    function equipItem() {
      if (!activeCharacter.value) return

      const randomItems = {
        paladin: ['Holy Longsword', 'Divine Shield', 'Blessed Armor', 'Consecrated Gauntlets', 'Halo Crown'],
        archer: ['Elven Bow', 'Quiver of Striking', 'Leather Armor', 'Hunter\'s Cloak', 'Silver Arrows']
      }

      const characterType = activeCharacter.value.characterClass
      const randomItem = randomItems[characterType][Math.floor(Math.random() * randomItems[characterType].length)]

      if (!activeCharacter.value.inventory.includes(randomItem)) {
        activeCharacter.value.inventory.push(randomItem)
      }
    }

    function castHeal() {
      if (!activeCharacter.value || activeCharacter.value.characterClass !== 'paladin') return

      if (activeCharacter.value.holyPower >= 10) {
        activeCharacter.value.holyPower -= 10
        const healAmount = 5 + Math.floor(activeCharacter.value.level * 2)
        activeCharacter.value.currentHealth = Math.min(
          activeCharacter.value.maxHealth,
          (activeCharacter.value.currentHealth || activeCharacter.value.maxHealth) + healAmount
        )
        alert(`Healed for ${healAmount} health!`)
      } else {
        alert('Not enough holy power!')
      }
    }

    function openNewPaladinForm() {
      alert('Open paladin creation form - this would be implemented with a modal or navigation')
    }

    function openNewArcherForm() {
      alert('Open archer creation form - this would be implemented with a modal or navigation')
    }

    return {
      paladins,
      archers,
      activeCharacter,
      setActivePaladin,
      setActiveArcher,
      addExperience,
      equipItem,
      castHeal,
      openNewPaladinForm,
      openNewArcherForm
    }
  }
}
</script>

<style scoped lang="scss">
.characters-page {
  padding: 20px 0;
}

.characters-list {
  max-height: 600px;
  overflow-y: auto;
}

.character-item {
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }

  &.active-character {
    background-color: #e0e0e0;
    border-left: 4px solid #007bff;
  }
}

.character-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.inventory {
  gap: 5px;
}
</style>