// src/services/GameService.js
import { AppState } from "../AppState.js"

class GameService {
    constructor() {
        this.isInitialized = false
        this.dependencies = new Map()
        this.initializationPromise = null
        this.errorRetryCount = 0
        this.maxRetries = 3
    }

    async initializeGame() {
        // Prevent multiple initializations
        if (this.initializationPromise) {
            return this.initializationPromise
        }

        this.initializationPromise = this._performInitialization()
        return this.initializationPromise
    }

    async _performInitialization() {
        try {
            console.log('Initializing game...')
            
            // Load game data first
            const loadSuccess = AppState.loadGameData()
            if (!loadSuccess) {
                console.warn('Game data load had issues, continuing with defaults')
            }

            // Initialize services with retry logic
            await this.initializeServicesWithRetry()
            
            this.isInitialized = true
            console.log('Game initialized successfully')
            return true
        } catch (error) {
            console.error('Game initialization failed:', error)
            AppState.handleError('initializeGame', error)
            
            // Attempt fallback initialization
            return this.fallbackInitialization()
        }
    }

    async initializeServicesWithRetry() {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                await this.initializeServices()
                return true
            } catch (error) {
                console.warn(`Service initialization attempt ${attempt} failed:`, error)
                
                if (attempt === this.maxRetries) {
                    throw new Error(`Failed to initialize services after ${this.maxRetries} attempts: ${error.message}`)
                }
                
                // Wait before retry with exponential backoff
                await this.delay(1000 * attempt)
            }
        }
    }

    async initializeServices() {
        try {
            // Initialize character service
            if (!this.dependencies.has('characterService')) {
                const charModule = await import('./CharacterService.js')
                this.dependencies.set('characterService', charModule.characterService)
            }

            // Initialize boss data service
            if (!this.dependencies.has('bossDataService')) {
                const bossModule = await import('./BossDataService.js')
                this.dependencies.set('bossDataService', bossModule.bossDataService)
            }

            // Initialize combat service
            if (!this.dependencies.has('combatService')) {
                const combatModule = await import('./CombatService.js')
                this.dependencies.set('combatService', combatModule.combatService)
            }

            // Initialize experience service
            if (!this.dependencies.has('experienceService')) {
                const expModule = await import('./ExperienceService.js')
                this.dependencies.set('experienceService', expModule.experienceService)
            }

            // Initialize data if not already done
            const characterService = this.dependencies.get('characterService')
            const bossDataService = this.dependencies.get('bossDataService')

            if (AppState.playerTemplates.length === 0) {
                if (typeof characterService.initializeCharacterData === 'function') {
                    characterService.initializeCharacterData()
                } else {
                    console.warn('Character service missing initializeCharacterData method')
                }
            }

            if (AppState.bossTemplates.length === 0) {
                if (typeof bossDataService.initializeBossData === 'function') {
                    bossDataService.initializeBossData()
                } else {
                    console.warn('Boss data service missing initializeBossData method')
                }
            }

            console.log('Services initialized successfully')
        } catch (error) {
            console.error('Error initializing services:', error)
            throw error
        }
    }

    async fallbackInitialization() {
        try {
            console.warn('Attempting fallback initialization')
            
            // Basic initialization without external services
            this.isInitialized = true
            AppState.validateCriticalState()
            
            console.log('Fallback initialization completed')
            return false // Indicate partial success
        } catch (error) {
            console.error('Fallback initialization failed:', error)
            AppState.handleError('fallbackInitialization', error)
            return false
        }
    }

    async startBattle(heroId, bossId) {
        try {
            console.log(`Starting battle: ${heroId} vs ${bossId}`)

            // Validate inputs
            if (!heroId || !bossId) {
                throw new Error('Both hero ID and boss ID are required')
            }

            // Ensure services are initialized
            if (!this.isInitialized) {
                const initResult = await this.initializeGame()
                if (!initResult) {
                    throw new Error('Game initialization failed')
                }
            }

            const characterService = this.dependencies.get('characterService')
            const bossDataService = this.dependencies.get('bossDataService')

            if (!characterService || !bossDataService) {
                throw new Error('Required services are not available')
            }

            // Create player instance with error handling
            const player = this.createPlayerInstanceSafely(characterService, heroId)
            if (!player) {
                throw new Error(`Failed to create player instance: ${heroId}`)
            }

            // Create boss instance with error handling
            const boss = this.createBossInstanceSafely(bossDataService, bossId)
            if (!boss) {
                throw new Error(`Failed to create boss instance: ${bossId}`)
            }

            // Initialize battle state
            this.initializeBattleState(player, boss)

            console.log('Battle started successfully')
            return true
        } catch (error) {
            console.error('Error starting battle:', error)
            AppState.handleError('startBattle', error)
            
            // Clean up battle state on error
            this.cleanupBattleState()
            throw error
        }
    }

    createPlayerInstanceSafely(characterService, heroId) {
        try {
            if (typeof characterService.createPlayerInstance !== 'function') {
                throw new Error('Character service missing createPlayerInstance method')
            }
            
            const player = characterService.createPlayerInstance(heroId)
            
            // Validate player instance
            if (!player || !player.name || !player.maxHealth) {
                throw new Error('Invalid player instance created')
            }
            
            return player
        } catch (error) {
            console.error('Failed to create player instance:', error)
            AppState.handleError('createPlayerInstance', error)
            return null
        }
    }

    createBossInstanceSafely(bossDataService, bossId) {
        try {
            if (typeof bossDataService.createBossInstance !== 'function') {
                throw new Error('Boss data service missing createBossInstance method')
            }
            
            const boss = bossDataService.createBossInstance(bossId)
            
            // Validate boss instance
            if (!boss || !boss.name || !boss.maxHealth) {
                throw new Error('Invalid boss instance created')
            }
            
            return boss
        } catch (error) {
            console.error('Failed to create boss instance:', error)
            AppState.handleError('createBossInstance', error)
            return null
        }
    }

    initializeBattleState(player, boss) {
        try {
            // Reset battle state
            Object.assign(AppState.battleState, {
                player: player,
                boss: boss,
                battleActive: true,
                playerTurn: true,
                turnCount: 0,
                battleLog: [],
                playerBarrier: 0,
                playerDodging: false,
                playerBurning: false,
                playerSlowed: false,
                bossStunned: false
            })

            // Add initial battle log entries
            AppState.battleLog.push(`Level ${player.level} ${player.name} faces off against ${boss.name}!`)
            AppState.battleLog.push(`${player.name}: ${player.maxHealth} HP, ${player.attack} ATK, ${player.defense} DEF`)
            AppState.battleLog.push(`The battle begins!`)
        } catch (error) {
            console.error('Failed to initialize battle state:', error)
            AppState.handleError('initializeBattleState', error)
            throw error
        }
    }

    cleanupBattleState() {
        try {
            Object.assign(AppState.battleState, {
                player: null,
                boss: null,
                battleActive: false,
                playerTurn: true,
                turnCount: 0,
                battleLog: [],
                playerBarrier: 0,
                playerDodging: false,
                playerBurning: false,
                playerSlowed: false,
                bossStunned: false
            })
            
            AppState.selectedHero = null
            AppState.selectedEnemy = null
        } catch (error) {
            console.error('Failed to cleanup battle state:', error)
            AppState.handleError('cleanupBattleState', error)
        }
    }

    endPlayerTurn() {
        try {
            if (!AppState.battleActive) {
                console.warn('Attempted to end player turn when battle is not active')
                return
            }
            
            console.log('Ending player turn')
            AppState.playerTurn = false

            setTimeout(() => {
                this.processBossTurnSafely()
            }, 1000)
        } catch (error) {
            console.error('Error ending player turn:', error)
            AppState.handleError('endPlayerTurn', error)
        }
    }

    processBossTurnSafely() {
        try {
            if (!AppState.battleActive || AppState.playerTurn) {
                console.warn('Boss turn processing called at invalid time')
                return
            }
            
            this.processBossTurn()
        } catch (error) {
            console.error('Error processing boss turn:', error)
            AppState.handleError('processBossTurn', error)
            
            // Attempt to recover by ending boss turn
            this.endBossTurn()
        }
    }

    processBossTurn() {
        console.log('Processing boss turn')

        const boss = AppState.boss
        const player = AppState.player

        if (!boss || !player) {
            throw new Error('Missing boss or player during boss turn')
        }

        // Validate boss attacks
        if (!boss.attacks || !Array.isArray(boss.attacks) || boss.attacks.length === 0) {
            console.warn('Boss has no valid attacks, using basic attack')
            this.performBasicBossAttack(boss, player)
        } else {
            this.performBossAttack(boss, player)
        }

        // Check for player defeat
        if (player.currentHealth <= 0) {
            this.endBattle(false)
            return
        }

        this.endBossTurn()
    }

    performBossAttack(boss, player) {
        try {
            const availableAttacks = boss.attacks.filter(attack => 
                attack && attack.currentCooldown === 0
            )
            
            if (availableAttacks.length === 0) {
                this.performBasicBossAttack(boss, player)
                return
            }

            const attack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)]
            const baseDamage = attack.damage || boss.attack || 20
            const damage = Math.max(1, baseDamage - Math.floor((player.defense || 0) / 2))

            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss.name} uses ${attack.name} and deals ${damage} damage to ${player.name}!`)

            // Set attack on cooldown
            if (attack.cooldown > 0) {
                attack.currentCooldown = attack.cooldown
            }
        } catch (error) {
            console.error('Error performing boss attack:', error)
            this.performBasicBossAttack(boss, player)
        }
    }

    performBasicBossAttack(boss, player) {
        try {
            const damage = Math.max(1, (boss.attack || 20) - Math.floor((player.defense || 0) / 2))
            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss.name} attacks for ${damage} damage!`)
        } catch (error) {
            console.error('Error performing basic boss attack:', error)
            AppState.battleLog.push(`${boss.name} attacks but something went wrong!`)
        }
    }

    endBossTurn() {
        try {
            if (!AppState.battleActive) return
            
            console.log('Ending boss turn')

            // Reduce cooldowns on boss attacks
            if (AppState.boss && AppState.boss.attacks) {
                AppState.boss.attacks.forEach(attack => {
                    if (attack && attack.currentCooldown > 0) {
                        attack.currentCooldown--
                    }
                })
            }

            AppState.playerTurn = true
            AppState.turnCount++

            console.log(`Turn ${AppState.turnCount} - Player's turn`)
        } catch (error) {
            console.error('Error ending boss turn:', error)
            AppState.handleError('endBossTurn', error)
        }
    }

    async endBattle(playerWon) {
        try {
            console.log('Ending battle:', playerWon ? 'Player Victory' : 'Player Defeat')
            AppState.battleActive = false

            if (playerWon) {
                await this.handleVictory()
            } else {
                await this.handleDefeat()
            }

            // Save game state
            AppState.saveGameData()
        } catch (error) {
            console.error('Error ending battle:', error)
            AppState.handleError('endBattle', error)
        }
    }

    async handleVictory() {
        try {
            const boss = AppState.boss
            const player = AppState.player
            
            if (!boss || !player) {
                throw new Error('Missing boss or player data during victory handling')
            }

            const baseGold = boss.goldReward || 50
            const goldReward = Math.floor(baseGold)

            // Award XP to the actual character
            await this.awardExperiencePoints(player)

            // Award gold and record victory
            AppState.addGold(goldReward)
            if (boss.id) {
                AppState.recordDefeat(boss.id)
            }

            // Check for player level up
            const oldLevel = AppState.playerLevel
            AppState.levelUp()
            const leveledUp = AppState.playerLevel > oldLevel

            // Add victory messages
            AppState.battleLog.push(`🏆 Victory! ${boss.name} has been defeated!`)
            AppState.battleLog.push(`💰 You earned ${goldReward} gold!`)

            if (leveledUp) {
                AppState.battleLog.push(`🎖️ Player Level Up! You are now level ${AppState.playerLevel}!`)
                AppState.battleLog.push(`🔓 New content may be unlocked!`)
            }

            console.log(`Victory! Earned ${goldReward} gold`)
        } catch (error) {
            console.error('Error handling victory:', error)
            AppState.handleError('handleVictory', error)
        }
    }

    async handleDefeat() {
        try {
            const consolationGold = Math.floor(10 + (AppState.playerLevel * 2))
            const consolationXP = 10

            AppState.addGold(consolationGold)
            AppState.recordLoss()

            // Award small XP even for losing
            await this.awardExperiencePoints(AppState.player, consolationXP)

            AppState.battleLog.push(`💥 Defeat! ${AppState.player?.name || 'Your hero'} has fallen in battle...`)
            AppState.battleLog.push(`💰 You earned ${consolationGold} consolation gold for your effort.`)
            AppState.battleLog.push(`💡 Don't give up! Train and try again!`)
            
            console.log('Player defeated')
        } catch (error) {
            console.error('Error handling defeat:', error)
            AppState.handleError('handleDefeat', error)
        }
    }

    async awardExperiencePoints(player, overrideXP = null) {
        try {
            const experienceService = this.dependencies.get('experienceService')
            if (!experienceService) {
                console.warn('Experience service not available, using basic XP system')
                AppState.battleLog.push(`Experience gained from battle!`)
                return
            }

            const boss = AppState.boss
            const xpReward = overrideXP || experienceService.calculateBattleXP(boss, player)

            // Find the actual character in AppState and award XP
            let actualCharacter = null
            if (player.characterClass === 'paladin') {
                actualCharacter = AppState.paladins.find(p => p.name === player.name)
            } else if (player.characterClass === 'archer') {
                actualCharacter = AppState.archers.find(a => a.name === player.name)
            }

            if (actualCharacter) {
                const xpResult = experienceService.awardXP(actualCharacter, xpReward, 'boss_battle')

                AppState.battleLog.push(`${actualCharacter.name} gained ${xpReward} XP!`)

                if (xpResult.leveledUp) {
                    if (xpResult.levelsGained > 1) {
                        AppState.battleLog.push(`🎉 MULTIPLE LEVEL UPS! ${actualCharacter.name} gained ${xpResult.levelsGained} levels and reached Level ${xpResult.newLevel}!`)
                    } else {
                        AppState.battleLog.push(`🎉 LEVEL UP! ${actualCharacter.name} reached Level ${xpResult.newLevel}!`)
                    }
                    AppState.battleLog.push(`💪 ${actualCharacter.name} has become stronger!`)
                }

                if (xpResult.maxLevel) {
                    AppState.battleLog.push(`⭐ ${actualCharacter.name} has reached the maximum level!`)
                } else {
                    const xpNeeded = experienceService.getXPForNextLevel(actualCharacter)
                    AppState.battleLog.push(`📊 ${xpNeeded} XP needed for Level ${actualCharacter.level + 1}`)
                }
            } else {
                AppState.battleLog.push(`Experience gained from battle!`)
            }
        } catch (error) {
            console.error('Error awarding experience points:', error)
            AppState.handleError('awardExperiencePoints', error)
        }
    }

    resetGame() {
        try {
            console.log('Resetting game')
            this.cleanupBattleState()
            console.log('Game reset complete')
        } catch (error) {
            console.error('Error resetting game:', error)
            AppState.handleError('resetGame', error)
        }
    }

    getBattleStatus() {
        try {
            return {
                active: AppState.battleActive,
                playerTurn: AppState.playerTurn,
                turnCount: AppState.turnCount,
                player: AppState.player,
                boss: AppState.boss,
                isInitialized: this.isInitialized
            }
        } catch (error) {
            console.error('Error getting battle status:', error)
            AppState.handleError('getBattleStatus', error)
            return {
                active: false,
                playerTurn: true,
                turnCount: 0,
                player: null,
                boss: null,
                isInitialized: false
            }
        }
    }

    // Character management methods with error handling
    getAllCharacters() {
        try {
            const paladins = Array.isArray(AppState.paladins) ? AppState.paladins : []
            const archers = Array.isArray(AppState.archers) ? AppState.archers : []
            return [...paladins, ...archers]
        } catch (error) {
            console.error('Error getting all characters:', error)
            AppState.handleError('getAllCharacters', error)
            return []
        }
    }

    getActiveCharacter() {
        try {
            return AppState.activeCharacter
        } catch (error) {
            console.error('Error getting active character:', error)
            AppState.handleError('getActiveCharacter', error)
            return null
        }
    }

    getCharacterById(characterId) {
        try {
            if (!characterId) return null
            
            let character = AppState.paladins.find(p => p && p.id === characterId)
            if (!character) {
                character = AppState.archers.find(a => a && a.id === characterId)
            }
            return character || null
        } catch (error) {
            console.error('Error getting character by ID:', error)
            AppState.handleError('getCharacterById', error)
            return null
        }
    }

    clearActiveCharacter() {
        try {
            AppState.paladins.forEach(p => {
                if (p) p.isActive = false
            })
            AppState.archers.forEach(a => {
                if (a) a.isActive = false
            })
            AppState.activeCharacter = null
        } catch (error) {
            console.error('Error clearing active character:', error)
            AppState.handleError('clearActiveCharacter', error)
        }
    }

    // Service management
    getService(serviceName) {
        return this.dependencies.get(serviceName)
    }

    isServiceAvailable(serviceName) {
        return this.dependencies.has(serviceName)
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Health check for debugging
    performHealthCheck() {
        const health = {
            initialized: this.isInitialized,
            servicesLoaded: this.dependencies.size,
            appStateValid: typeof AppState === 'object',
            battleStateValid: typeof AppState.battleState === 'object',
            errorCount: AppState.errorState?.errorCount || 0,
            timestamp: new Date().toISOString()
        }

        console.log('GameService Health Check:', health)
        return health
    }
}

export const gameService = new GameService()