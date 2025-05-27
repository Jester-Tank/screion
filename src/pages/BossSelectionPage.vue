<template>
    <div class="boss-selection-page container-fluid">
        <div class="row">
            <div class="col-12">
                <h1 class="text-center mb-4">Choose Your Boss Challenge</h1>
                <p class="text-center text-muted mb-5">Select a formidable foe to test your skills against</p>
            </div>
        </div>

        <!-- Player Selection Section -->
        <div class="row mb-4" v-if="!selectedHero">
            <div class="col-12">
                <div class="card bg-warning">
                    <div class="card-body text-center">
                        <h4>Select Your Hero First</h4>
                        <p>Choose which character you want to fight with:</p>
                        <div class="hero-selection d-flex justify-content-center gap-3 flex-wrap">
                            <button v-for="template in playerTemplates" :key="template.id"
                                class="btn btn-outline-primary" @click="selectHero(template.id)">
                                <img :src="template.imgUrl" :alt="template.name" class="hero-avatar me-2">
                                {{ template.name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Hero Display -->
        <div class="row mb-4" v-if="selectedHero">
            <div class="col-12">
                <div class="card bg-success">
                    <div class="card-body text-center text-white">
                        <h5>Selected Hero: {{ getSelectedHeroName() }}</h5>
                        <button class="btn btn-outline-light btn-sm" @click="clearHeroSelection">
                            Change Hero
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Boss Selection Grid -->
        <div class="row">
            <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="boss in availableBosses" :key="boss.id">
                <div class="boss-card card h-100" :class="{ 'selected': selectedEnemy === boss.id }">
                    <div class="boss-image">
                        <img :src="boss.imgUrl" :alt="boss.name" class="card-img-top">
                        <div class="difficulty-badge" :class="getDifficultyClass(boss)">
                            {{ getDifficulty(boss) }}
                        </div>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ boss.name }}</h5>
                        <p class="card-text">{{ boss.description }}</p>

                        <div class="boss-stats mb-3">
                            <div class="stat-row">
                                <span class="stat-label">Health:</span>
                                <span class="stat-value">{{ boss.maxHealth }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Attack:</span>
                                <span class="stat-value">{{ boss.attack }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Defense:</span>
                                <span class="stat-value">{{ boss.defense }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Reward:</span>
                                <span class="stat-value text-warning">{{ boss.goldReward }} Gold</span>
                            </div>
                        </div>

                        <div class="boss-abilities mb-3">
                            <h6>Special Abilities:</h6>
                            <div class="abilities-list">
                                <span v-for="attack in boss.attacks.slice(0, 3)" :key="attack.id"
                                    class="badge bg-secondary me-1 mb-1">
                                    {{ attack.name }}
                                </span>
                            </div>
                        </div>

                        <div class="defeated-status mb-2" v-if="isBossDefeated(boss.id)">
                            <span class="badge bg-success">
                                <i class="mdi mdi-check"></i> Defeated
                            </span>
                        </div>

                        <div class="mt-auto">
                            <button class="btn btn-primary w-100" :class="{ 'btn-success': selectedEnemy === boss.id }"
                                @click="selectBoss(boss.id)" :disabled="!selectedHero">
                                {{ selectedEnemy === boss.id ? 'Selected' : 'Select Boss' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Locked Bosses Section -->
        <div class="row mt-5" v-if="lockedBosses.length > 0">
            <div class="col-12">
                <h3 class="text-center mb-4">Locked Challenges</h3>
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="boss in lockedBosses" :key="boss.id">
                        <div class="boss-card card h-100 locked-boss">
                            <div class="boss-image">
                                <img :src="boss.imgUrl" :alt="boss.name" class="card-img-top locked-image">
                                <div class="lock-overlay">
                                    <i class="mdi mdi-lock text-white" style="font-size: 3rem;"></i>
                                </div>
                            </div>

                            <div class="card-body">
                                <h5 class="card-title">{{ boss.name }}</h5>
                                <p class="card-text">{{ boss.description }}</p>
                                <div class="unlock-info">
                                    <p class="text-warning">
                                        <strong>Unlock Cost: {{ getUnlockCost(boss.id) }} Gold</strong>
                                    </p>
                                    <button class="btn btn-warning w-100" @click="unlockBoss(boss.id)"
                                        :disabled="!canUnlockBoss(boss.id)">
                                        {{ canUnlockBoss(boss.id) ? 'Unlock Boss' : 'Insufficient Gold' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Battle Start Section -->
        <div class="row mt-5" v-if="selectedHero && selectedEnemy">
            <div class="col-12">
                <div class="card bg-danger text-white">
                    <div class="card-body text-center">
                        <h3>Ready for Battle!</h3>
                        <p>{{ getSelectedHeroName() }} vs {{ getSelectedBossName() }}</p>
                        <button class="btn btn-light btn-lg" @click="startBattle">
                            <i class="mdi mdi-sword-cross"></i> Begin Battle!
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Player Stats -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <h5>Your Stats</h5>
                        <div class="row">
                            <div class="col-md-3">
                                <strong>Gold:</strong> {{ gold }}
                            </div>
                            <div class="col-md-3">
                                <strong>Level:</strong> {{ playerLevel }}
                            </div>
                            <div class="col-md-3">
                                <strong>Bosses Defeated:</strong> {{ defeatedBosses.length }}
                            </div>
                            <div class="col-md-3">
                                <strong>Heroes Unlocked:</strong> {{ unlockedCharacters.length }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import { bossDataService } from '../services/BossDataService'
import { characterService } from '../services/CharacterService'
import { gameService } from '../services/GameService'
import { router } from '../router'

export default {
    setup() {
        onMounted(() => {
            // Initialize boss data if not already done
            if (AppState.bossTemplates.length === 0) {
                bossDataService.initializeBossData()
            }

            // Initialize character data if not already done
            if (AppState.playerTemplates.length === 0) {
                characterService.initializeCharacterData()
            }

            console.log('Boss selection page loaded')
        })

        // Computed properties
        const availableBosses = computed(() => bossDataService.getAvailableBosses())
        const lockedBosses = computed(() =>
            AppState.bossTemplates.filter(boss => !AppState.unlockedEnemies.includes(boss.id))
        )
        const playerTemplates = computed(() =>
            AppState.playerTemplates.filter(template => AppState.unlockedCharacters.includes(template.id))
        )
        const selectedHero = computed(() => AppState.selectedHero)
        const selectedEnemy = computed(() => AppState.selectedEnemy)
        const gold = computed(() => AppState.gold)
        const playerLevel = computed(() => AppState.playerLevel)
        const defeatedBosses = computed(() => AppState.defeatedBosses)
        const unlockedCharacters = computed(() => AppState.unlockedCharacters)

        // Methods
        function selectHero(heroId) {
            AppState.selectHero(heroId)
            console.log('Selected hero:', heroId)
        }

        function clearHeroSelection() {
            AppState.selectedHero = null
            AppState.selectedEnemy = null
        }

        function selectBoss(bossId) {
            AppState.selectEnemy(bossId)
            console.log('Selected boss:', bossId)
        }

        function getSelectedHeroName() {
            if (!selectedHero.value) return ''
            const hero = AppState.playerTemplates.find(h => h.id === selectedHero.value)
            return hero ? hero.name : ''
        }

        function getSelectedBossName() {
            if (!selectedEnemy.value) return ''
            const boss = AppState.bossTemplates.find(b => b.id === selectedEnemy.value)
            return boss ? boss.name : ''
        }

        function getDifficulty(boss) {
            const totalStats = boss.maxHealth + boss.attack + boss.defense
            if (totalStats < 150) return 'Easy'
            if (totalStats < 250) return 'Medium'
            if (totalStats < 350) return 'Hard'
            return 'Extreme'
        }

        function getDifficultyClass(boss) {
            const difficulty = getDifficulty(boss)
            return {
                'easy': difficulty === 'Easy',
                'medium': difficulty === 'Medium',
                'hard': difficulty === 'Hard',
                'extreme': difficulty === 'Extreme'
            }
        }

        function isBossDefeated(bossId) {
            return AppState.defeatedBosses.includes(bossId)
        }

        function getUnlockCost(bossId) {
            return AppState.enemyCosts[bossId] || 0
        }

        function canUnlockBoss(bossId) {
            return AppState.gold >= getUnlockCost(bossId)
        }

        function unlockBoss(bossId) {
            if (AppState.unlockEnemy(bossId)) {
                console.log(`Unlocked boss: ${bossId}`)
            } else {
                console.log('Failed to unlock boss - insufficient gold')
            }
        }

        function startBattle() {
            if (!selectedHero.value || !selectedEnemy.value) {
                console.error('Must select both hero and boss before starting battle')
                return
            }

            try {
                gameService.startBattle(selectedHero.value, selectedEnemy.value)
                router.push('/battle')
            } catch (error) {
                console.error('Failed to start battle:', error)
            }
        }

        return {
            availableBosses,
            lockedBosses,
            playerTemplates,
            selectedHero,
            selectedEnemy,
            gold,
            playerLevel,
            defeatedBosses,
            unlockedCharacters,
            selectHero,
            clearHeroSelection,
            selectBoss,
            getSelectedHeroName,
            getSelectedBossName,
            getDifficulty,
            getDifficultyClass,
            isBossDefeated,
            getUnlockCost,
            canUnlockBoss,
            unlockBoss,
            startBattle
        }
    }
}
</script>

<style scoped lang="scss">
.boss-selection-page {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #fff;
}

.boss-card {
    background-color: #333;
    border: 2px solid #555;
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover:not(.locked-boss) {
        transform: translateY(-5px);
        border-color: #007bff;
        box-shadow: 0 10px 20px rgba(0, 123, 255, 0.3);
    }

    &.selected {
        border-color: #28a745;
        background-color: rgba(40, 167, 69, 0.1);
    }

    &.locked-boss {
        opacity: 0.7;

        .locked-image {
            filter: grayscale(100%) blur(2px);
        }
    }
}

.boss-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .difficulty-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;

        &.easy {
            background-color: #28a745;
        }

        &.medium {
            background-color: #ffc107;
            color: #000;
        }

        &.hard {
            background-color: #fd7e14;
        }

        &.extreme {
            background-color: #dc3545;
        }
    }

    .lock-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.boss-stats {
    .stat-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;

        .stat-label {
            font-weight: 500;
        }

        .stat-value {
            font-weight: bold;
        }
    }
}

.abilities-list {
    .badge {
        font-size: 0.7rem;
    }
}

.hero-selection {
    .hero-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
    }
}

.card {
    &.bg-warning {
        color: #000;
    }
}

h1,
h3 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.unlock-info {
    margin-top: auto;
}
</style>