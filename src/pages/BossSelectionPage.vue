<template>
    <div class="boss-selection-page container-fluid">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <i class="mdi mdi-sword-cross"></i> Heroes of the Realm
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" to="/characters">Characters</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" to="/bosses">Boss Battles</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">About</router-link>
                    </li>
                </ul>

                <div class="d-flex align-items-center">
                    <!-- Gold Display -->
                    <div class="text-light me-3 d-flex align-items-center">
                        <i class="mdi mdi-currency-usd text-warning me-1"></i>
                        <span>{{ gold }}</span>
                    </div>

                    <!-- Level Display -->
                    <div class="text-light me-3 d-flex align-items-center">
                        <i class="mdi mdi-trophy text-success me-1"></i>
                        <span>Lv.{{ playerLevel }}</span>
                    </div>

                    <!-- Active Character Display -->
                    <div v-if="activeCharacter" class="text-light me-3 d-flex align-items-center">
                        <i class="mdi mdi-account-circle me-1"></i>
                        <span>{{ activeCharacter.name }}</span>
                    </div>

                    <!-- Selected Hero Display -->
                    <div v-if="selectedHero && !activeCharacter" class="text-light me-3 d-flex align-items-center">
                        <i class="mdi mdi-shield-account me-1"></i>
                        <span>{{ getSelectedHeroName() }}</span>
                    </div>

                    <!-- Settings Button -->
                    <button class="btn btn-outline-light me-2" @click="openSettings">
                        <i class="mdi mdi-cog"></i> Settings
                    </button>

                    <router-link class="btn btn-outline-light" to="/account">
                        <i class="mdi mdi-account"></i> Account
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Settings Modal -->
        <SettingsModal :showSettings="showSettingsModal" @close="closeSettings" />
        </nav>
</template>

<script>
import { computed, ref } from 'vue'
import { AppState } from '../AppState.js'
import SettingsModal from './SettingsModal.vue'

export default {
    components: {
        SettingsModal
    },
    setup() {
        const showSettingsModal = ref(false)
        const activeCharacter = computed(() => AppState.activeCharacter)
        const selectedHero = computed(() => AppState.selectedHero)
        const gold = computed(() => AppState.gold)
        const playerLevel = computed(() => AppState.playerLevel)

        function getSelectedHeroName() {
            if (!selectedHero.value) return ''
            const hero = AppState.playerTemplates.find(h => h.id === selectedHero.value)
            return hero ? hero.name : ''
        }

        function openSettings() {
            showSettingsModal.value = true
        }

        function closeSettings() {
            showSettingsModal.value = false
        }

        return {
            activeCharacter,
            selectedHero,
            gold,
            playerLevel,
            showSettingsModal,
            getSelectedHeroName,
            openSettings,
            closeSettings
        }
    }
}
</script>

<style scoped lang="scss">
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-brand {
    font-weight: bold;
    font-size: 1.3rem;

    i {
        color: #ffc107;
        margin-right: 0.5rem;
    }
}

.nav-link {
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
        color: #ffc107 !important;
    }

    &.router-link-active {
        color: #ffc107 !important;
        font-weight: bold;
    }
}

.text-light {
    font-size: 0.9rem;

    i {
        font-size: 1.1rem;
    }
}

.btn-outline-light {
    transition: all 0.3s ease;

    &:hover {
        background-color: #ffc107;
        border-color: #ffc107;
        color: #000;
    }
}
</style>
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
                            <button v-for="character in availableHeroes" :key="character.id || character.name"
                                class="btn btn-outline-primary hero-select-btn" @click="selectHero(character.heroId)">
                                <img :src="character.imageUrl || character.imgUrl" :alt="character.name"
                                    class="hero-avatar me-2" />
                                <div class="hero-info">
                                    <div class="hero-name">{{ character.name }}</div>
<div class="hero-stats">
                                        Lv.{{ character.level }} |
                                        HP: {{ character.maxHealth }} |
                                        ATK: {{ character.attack }} |
                                        DEF: {{ character.defense }}
                                    </div>
</div>
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

<!-- Recommended Boss Section -->
<div class="row mb-4" v-if="recommendedBoss">
            <div class="col-12">
                <div class="card bg-info">
                    <div class="card-body text-center text-white">
                        <h5>💡 Recommended for Your Level</h5>
                        <p class="mb-1">{{ recommendedBoss.name }} (Level {{ recommendedBoss.level }})</p>
                        <button class="btn btn-outline-light btn-sm" @click="selectBoss(recommendedBoss.id)">
                            Select Recommended Boss
                        </button>
                    </div>
</div>
</div>
</div>

<!-- Boss Selection by Difficulty Tier -->
<div v-for="tier in difficultyTiers" :key="tier.name" class="row mb-4">
            <div class="col-12">
                <div class="difficulty-header" :class="tier.headerClass">
                    <h2 class="mb-3">
                        {{ tier.icon }} {{ tier.name }} Bosses 
                        <span class="badge bg-secondary">Levels {{ tier.levelRange }}</span>
                    </h2>
                    <p class="lead">{{ tier.description }}</p>
                </div>

<div class="row">
                    <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="boss in getBossesInTier(tier.name)" :key="boss.id">
                        <div class="boss-card card h-100" 
                             :class="{ 
                                'selected': selectedEnemy === boss.id,
                                'locked': !isBossUnlocked(boss.id),
                                'defeated': isBossDefeated(boss.id)
                             }">
                            
                            <div class="boss-image">
                                <img :src="boss.imgUrl" :alt="boss.name" class="card-img-top" />
                                <div class="difficulty-badge" :class="getDifficultyClass(boss)">
                                    {{ tier.name }}
                                </div>
<div class="level-badge">
                                    Lv.{{ boss.level }}
                                </div>
<div v-if="!isBossUnlocked(boss.id)" class="lock-overlay">
                                    <i class="mdi mdi-lock text-white" style="font-size: 3rem;"></i>
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

<div class="player-match mb-2" v-if="selectedHero">
                                    <div class="difficulty-indicator" :class="getBossPlayerMatchClass(boss)">
                                        {{ getBossPlayerMatchText(boss) }}
                                    </div>
</div>

<div class="defeated-status mb-2" v-if="isBossDefeated(boss.id)">
                                    <span class="badge bg-success">
                                        <i class="mdi mdi-check"></i> Defeated
                                    </span>
                                </div>

<div class="mt-auto">
                                    <button v-if="isBossUnlocked(boss.id)" 
                                            class="btn btn-primary w-100" 
                                            :class="{ 'btn-success': selectedEnemy === boss.id }"
                                            @click="selectBoss(boss.id)" 
                                            :disabled="!selectedHero">
                                        {{ selectedEnemy === boss.id ? 'Selected' : 'Select Boss' }}
                                    </button>
                                    <button v-else 
                                            class="btn btn-warning w-100" 
                                            @click="unlockBoss(boss.id)"
                                            :disabled="!canUnlockBoss(boss.id)">
                                        <template v-if="canUnlockBoss(boss.id)">
                                            Unlock ({{ getUnlockCost(boss.id) }} Gold)
                                        </template>
                                        <template v-else>
                                            Cannot Unlock Yet
                                        </template>
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
                        <div class="battle-preview mb-3">
                            <div class="row">
                                <div class="col-md-4">
                                    <strong>Your Combat Rating:</strong> {{ getCombatRating() }}
                                </div>
<div class="col-md-4">
                                    <strong>Boss Level:</strong> {{ getSelectedBoss()?.level || 'N/A' }}
                                </div>
<div class="col-md-4">
                                    <strong>Estimated XP:</strong> {{ getEstimatedXP() }}
                                </div>
</div>
</div>
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
                        <h5>Your Progress</h5>
                        <div class="row">
                            <div class="col-md-2">
                                <strong>Gold:</strong> {{ gold }}
                            </div>
<div class="col-md-2">
                                <strong>Level:</strong> {{ playerLevel }}
                            </div>
<div class="col-md-2">
                                <strong>Combat Rating:</strong> {{ getCombatRating() }}
                            </div>
<div class="col-md-2">
                                <strong>Bosses Defeated:</strong> {{ defeatedBosses.length }}
                            </div>
<div class="col-md-2">
                                <strong>Heroes:</strong> {{ unlockedCharacters.length }}
                            </div>
<div class="col-md-2">
                                <strong>Bosses Unlocked:</strong> {{ unlockedEnemies.length }}
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

            // Process auto-unlocks
            AppState.processAutoUnlocks()

            console.log('Boss selection page loaded')
        })

        // Computed properties
        const availableBosses = computed(() => bossDataService.getAvailableBosses())
        const allBosses = computed(() => bossDataService.getAllBosses())

        const difficultyTiers = computed(() => [
            {
                name: 'Easy',
                icon: '😊',
                description: 'Perfect for new adventurers to learn the basics of combat',
                levelRange: '1-3',
                headerClass: 'text-success'
            },
            {
                name: 'Medium',
                icon: '⚔️',
                description: 'A good challenge for developing heroes with some experience',
                levelRange: '4-6',
                headerClass: 'text-warning'
            },
            {
                name: 'Hard',
                icon: '🔥',
                description: 'Requires skill, strategy, and well-developed characters',
                levelRange: '7-10',
                headerClass: 'text-danger'
            },
            {
                name: 'Extreme',
                icon: '💀',
                description: 'Only for experienced warriors with powerful abilities',
                levelRange: '11-15',
                headerClass: 'text-dark'
            },
            {
                name: 'Legendary',
                icon: '👑',
                description: 'The ultimate test of heroism - for legends only',
                levelRange: '16-20',
                headerClass: 'text-purple'
            }
        ])

        const recommendedBoss = computed(() => AppState.getRecommendedBoss())

        // Show actual leveled characters instead of templates
        const availableHeroes = computed(() => {
            const heroes = []

            // Add paladins
            AppState.paladins.forEach(paladin => {
                heroes.push({
                    ...paladin,
                    heroId: 'paladin'
                })
            })

            // Add archers  
            AppState.archers.forEach(archer => {
                heroes.push({
                    ...archer,
                    heroId: 'archer'
                })
            })

            return heroes
        })

        const selectedHero = computed(() => AppState.selectedHero)
        const selectedEnemy = computed(() => AppState.selectedEnemy)
        const gold = computed(() => AppState.gold)
        const playerLevel = computed(() => AppState.playerLevel)
        const defeatedBosses = computed(() => AppState.defeatedBosses)
        const unlockedCharacters = computed(() => AppState.unlockedCharacters)
        const unlockedEnemies = computed(() => AppState.unlockedEnemies)

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

        function getBossesInTier(tierName) {
            return allBosses.value.filter(boss => boss.tier === tierName)
        }

        function isBossUnlocked(bossId) {
            return AppState.unlockedEnemies.includes(bossId)
        }

        function getSelectedHeroName() {
            if (!selectedHero.value) return ''

            // Look for actual character name first
            if (selectedHero.value === 'paladin') {
                const paladin = AppState.paladins[0]
                if (paladin) return `${paladin.name} (Lv.${paladin.level})`
            } else if (selectedHero.value === 'archer') {
                const archer = AppState.archers[0]
                if (archer) return `${archer.name} (Lv.${archer.level})`
            }

            // Fallback to template
            const hero = AppState.playerTemplates.find(h => h.id === selectedHero.value)
            return hero ? hero.name : ''
        }

        function getSelectedBossName() {
            if (!selectedEnemy.value) return ''
            const boss = AppState.bossTemplates.find(b => b.id === selectedEnemy.value)
            return boss ? boss.name : ''
        }

        function getSelectedBoss() {
            if (!selectedEnemy.value) return null
            return AppState.bossTemplates.find(b => b.id === selectedEnemy.value)
        }

        function getDifficultyClass(boss) {
            const classes = {
                'Easy': 'difficulty-easy',
                'Medium': 'difficulty-medium',
                'Hard': 'difficulty-hard',
                'Extreme': 'difficulty-extreme',
                'Legendary': 'difficulty-legendary'
            }
            return classes[boss.tier] || 'difficulty-medium'
        }

        function getBossPlayerMatchClass(boss) {
            if (!selectedHero.value) return 'match-unknown'
            
            const heroLevel = getSelectedHeroLevel()
            const levelDiff = boss.level - heroLevel
            
            if (levelDiff >= 5) return 'match-too-hard'
            if (levelDiff >= 2) return 'match-hard' 
            if (levelDiff >= -1) return 'match-good'
            if (levelDiff >= -3) return 'match-easy'
            return 'match-too-easy'
        }

        function getBossPlayerMatchText(boss) {
            if (!selectedHero.value) return 'Select hero to see difficulty'
            
            const heroLevel = getSelectedHeroLevel()
            const levelDiff = boss.level - heroLevel
            
            if (levelDiff >= 5) return '💀 Extremely Hard'
            if (levelDiff >= 2) return '⚠️ Very Hard'
            if (levelDiff >= -1) return '⚔️ Good Challenge'
            if (levelDiff >= -3) return '✅ Easy'
            return '😴 Too Easy'
        }

        function getSelectedHeroLevel() {
            if (!selectedHero.value) return 1
            
            if (selectedHero.value === 'paladin' && AppState.paladins[0]) {
                return AppState.paladins[0].level
            } else if (selectedHero.value === 'archer' && AppState.archers[0]) {
                return AppState.archers[0].level
            }
            
            return AppState.playerLevel
        }

        function isBossDefeated(bossId) {
            return AppState.defeatedBosses.includes(bossId)
        }

        function getUnlockCost(bossId) {
            return AppState.enemyCosts[bossId] || 0
        }

        function canUnlockBoss(bossId) {
            // Check if player has enough gold
            if (AppState.gold < getUnlockCost(bossId)) return false
            
            // Check if player meets level/progression requirements
            return AppState.shouldAutoUnlock(bossId) || AppState.gold >= getUnlockCost(bossId)
        }

        function unlockBoss(bossId) {
            if (AppState.unlockEnemy(bossId)) {
                console.log(`Unlocked boss: ${bossId}`)
                
                // Show unlock notification
                const boss = AppState.bossTemplates.find(b => b.id === bossId)
                if (boss) {
                    alert(`🎉 ${boss.name} has been unlocked! You can now challenge this ${boss.tier.toLowerCase()} boss.`)
                }
            } else {
                console.log('Failed to unlock boss - insufficient gold or requirements not met')
                alert('Cannot unlock this boss yet. You may need more gold or to defeat other bosses first.')
            }
        }

        function getCombatRating() {
            return AppState.getCombatRating()
        }

        function getEstimatedXP() {
            if (!selectedEnemy.value || !selectedHero.value) return 'N/A'
            
            const boss = getSelectedBoss()
            if (!boss) return 'N/A'
            
            const heroLevel = getSelectedHeroLevel()
            const baseXP = 50 + boss.level * 25
            const levelDiff = boss.level - heroLevel
            const levelMultiplier = Math.max(0.5, 1 + (levelDiff * 0.15))
            const bossMultiplier = 2.0 // Bosses give double XP
            
            return Math.floor(baseXP * levelMultiplier * bossMultiplier)
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
            allBosses,
            difficultyTiers,
            recommendedBoss,
            availableHeroes,
            selectedHero,
            selectedEnemy,
            gold,
            playerLevel,
            defeatedBosses,
            unlockedCharacters,
            unlockedEnemies,
            selectHero,
            clearHeroSelection,
            selectBoss,
            getBossesInTier,
            isBossUnlocked,
            getSelectedHeroName,
            getSelectedBossName,
            getSelectedBoss,
            getDifficultyClass,
            getBossPlayerMatchClass,
            getBossPlayerMatchText,
            getSelectedHeroLevel,
            isBossDefeated,
            getUnlockCost,
            canUnlockBoss,
            unlockBoss,
            getCombatRating,
            getEstimatedXP,
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

.difficulty-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
}

.boss-card {
    background-color: #333;
    border: 2px solid #555;
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover:not(.locked) {
        transform: translateY(-5px);
        border-color: #007bff;
        box-shadow: 0 10px 20px rgba(0, 123, 255, 0.3);
    }

    &.selected {
        border-color: #28a745;
        background-color: rgba(40, 167, 69, 0.1);
    }

    &.locked {
        opacity: 0.7;

        .card-img-top {
            filter: grayscale(100%) blur(2px);
        }
    }

    &.defeated {
        border-color: #28a745;
        background-color: rgba(40, 167, 69, 0.05);
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

        &.difficulty-easy {
            background-color: #28a745;
            color: white;
        }

        &.difficulty-medium {
            background-color: #ffc107;
            color: #000;
        }

        &.difficulty-hard {
            background-color: #fd7e14;
            color: white;
        }

        &.difficulty-extreme {
            background-color: #dc3545;
            color: white;
        }

        &.difficulty-legendary {
            background-color: #6f42c1;
            color: white;
        }
    }

    .level-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
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

.player-match {
    .difficulty-indicator {
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;

        &.match-too-hard {
            background-color: #dc3545;
            color: white;
        }

        &.match-hard {
            background-color: #fd7e14;
            color: white;
        }

        &.match-good {
            background-color: #0d6efd;
            color: white;
        }

        &.match-easy {
            background-color: #28a745;
            color: white;
        }

        &.match-too-easy {
            background-color: #6c757d;
            color: white;
        }

        &.match-unknown {
            background-color: #6c757d;
            color: white;
        }
    }
}

.hero-selection {
    .hero-select-btn {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        margin: 0.5rem;
        border: 2px solid #007bff;
        border-radius: 8px;
        background-color: rgba(0, 123, 255, 0.1);
        color: #000;
        transition: all 0.3s ease;

        &:hover {
            background-color: rgba(0, 123, 255, 0.2);
            transform: translateY(-2px);
        }
    }

    .hero-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .hero-info {
        text-align: left;

        .hero-name {
            font-weight: bold;
            font-size: 1rem;
        }

        .hero-stats {
            font-size: 0.8rem;
            opacity: 0.8;
        }
    }
}

.battle-preview {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
}

.text-purple {
    color: #6f42c1 !important;
}

.card {
    &.bg-warning {
        color: #000;
    }
}

h1,
h2,
h3 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>