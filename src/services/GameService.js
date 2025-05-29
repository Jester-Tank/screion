// src/services/GameService.js
import { AppState } from "../AppState.js"

class GameService {
    /**
     * Initialize the game - load data and set up initial state
     */
    initializeGame() {
        console.log('Initializing game...')

        // Load saved game data
        AppState.loadGameData()

        // Initialize services after they're loaded
        this.initializeServices()

        console.log('Game initialized successfully')
    }

    /**
     * Initialize services to avoid circular dependencies
     */
    async initializeServices() {
        try {
            // Dynamic imports to avoid circular dependencies
            if (!this.characterService) {
                const charModule = await import('./CharacterService.js')
                this.characterService = charModule.characterService
            }

            if (!this.bossDataService) {
                const bossModule = await import('./BossDataService.js')
                this.bossDataService = bossModule.bossDataService
            }

            // Initialize data
            if (AppState.playerTemplates.length === 0) {
                this.characterService.initializeCharacterData()
            }

            if (AppState.bossTemplates.length === 0) {
                this.bossDataService.initializeBossData()
            }
        } catch (error) {
            console.error('Error initializing services:', error)
        }
    }

    /**
     * Start a battle between selected hero and boss
     * @param {string} heroId - The ID of the selected hero
     * @param {string} bossId - The ID of the selected boss
     */
    async startBattle(heroId, bossId) {
        console.log(`Starting battle: ${heroId} vs ${bossId}`)

        try {
            // Ensure services are initialized
            await this.initializeServices()

            // Create fresh player instance with level scaling
            const player = this.characterService.createPlayerInstance(heroId)
            if (!player) {
                throw new Error(`Failed to create player instance: ${heroId}`)
            }

            // Create fresh boss instance
            const boss = this.bossDataService.createBossInstance(bossId)
            if (!boss) {
                throw new Error(`Failed to create boss instance: ${bossId}`)
            }

            // Set up battle state
            AppState.battleState.player = player
            AppState.battleState.boss = boss
            AppState.battleState.battleActive = true
            AppState.battleState.playerTurn = true
            AppState.battleState.turnCount = 0
            AppState.battleState.battleLog = []

            // Reset status effects
            AppState.battleState.playerBarrier = 0
            AppState.battleState.playerDodging = false
            AppState.battleState.playerBurning = false
            AppState.battleState.playerSlowed = false
            AppState.battleState.bossStunned = false

            // Add initial battle log entry
            AppState.battleLog.push(`Level ${player.level} ${player.name} faces off against ${boss.name}!`)
            AppState.battleLog.push(`${player.name}: ${player.maxHealth} HP, ${player.attack} ATK, ${player.defense} DEF`)
            AppState.battleLog.push(`The battle begins!`)

            console.log('Battle started successfully:', {
                player: `${player.name} (Lv.${player.level})`,
                playerStats: { hp: player.maxHealth, atk: player.attack, def: player.defense },
                boss: boss.name,
                bossStats: { hp: boss.maxHealth, atk: boss.attack, def: boss.defense }
            })
        } catch (error) {
            console.error('Error starting battle:', error)
            throw error
        }
    }

    /**
     * End the player's turn and start boss turn
     */
    endPlayerTurn() {
        if (!AppState.battleActive) return
        console.log('Ending player turn')

        // Switch to boss turn
        AppState.playerTurn = false

        // Start boss turn after a short delay
        setTimeout(() => {
            this.processBossTurn()
        }, 1000)
    }

    /**
     * Process the boss's turn (simplified AI)
     */
    processBossTurn() {
        if (!AppState.battleActive || AppState.playerTurn) return
        console.log('Processing boss turn')

        const boss = AppState.boss
        const player = AppState.player

        if (boss && player && boss.attacks && boss.attacks.length > 0) {
            // Pick a random attack
            const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)]

            // Calculate damage
            const baseDamage = attack.damage || boss.attack
            const damage = Math.max(1, baseDamage - Math.floor(player.defense / 2))

            // Apply damage
            player.currentHealth = Math.max(0, player.currentHealth - damage)

            AppState.battleLog.push(`${boss.name} uses ${attack.name} and deals ${damage} damage to ${player.name}!`)

            // Check if player is defeated
            if (player.currentHealth <= 0) {
                this.endBattle(false)
                return
            }
        } else {
            // Fallback basic attack
            const damage = Math.max(1, (boss?.attack || 20) - Math.floor((player?.defense || 0) / 2))
            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss?.name || 'Enemy'} attacks for ${damage} damage!`)

            if (player.currentHealth <= 0) {
                this.endBattle(false)
                return
            }
        }

        this.endBossTurn()
    }

    /**
     * End the boss's turn and return to player turn
     */
    endBossTurn() {
        if (!AppState.battleActive) return
        console.log('Ending boss turn')

        // Switch back to player turn
        AppState.playerTurn = true
        AppState.turnCount++

        console.log(`Turn ${AppState.turnCount} - Player's turn`)
    }

    /**
     * End the battle with victory or defeat
     * @param {boolean} playerWon - Whether the player won
     */
    endBattle(playerWon) {
        console.log('Ending battle:', playerWon ? 'Player Victory' : 'Player Defeat')
        AppState.battleActive = false

        if (playerWon) {
            const boss = AppState.boss
            const baseGold = boss?.goldReward || 50
            const goldReward = Math.floor(baseGold)

            AppState.addGold(goldReward)
            if (boss?.id) {
                AppState.recordDefeat(boss.id)
            }

            const oldLevel = AppState.playerLevel
            AppState.levelUp()
            const leveledUp = AppState.playerLevel > oldLevel

            AppState.battleLog.push(`Victory! ${boss?.name || 'The enemy'} has been defeated!`)
            AppState.battleLog.push(`You earned ${goldReward} gold!`)

            if (leveledUp) {
                AppState.battleLog.push(`Level Up! You are now level ${AppState.playerLevel}!`)
                AppState.battleLog.push(`Your heroes have become stronger!`)
            }

            console.log(`Victory! Earned ${goldReward} gold, level ${AppState.playerLevel}`)
        } else {
            const consolationGold = Math.floor(10 + (AppState.playerLevel * 2))
            AppState.addGold(consolationGold)

            AppState.battleLog.push(`Defeat! ${AppState.player?.name || 'Your hero'} has fallen in battle...`)
            AppState.battleLog.push(`You earned ${consolationGold} consolation gold for your effort.`)
            console.log('Player defeated')
        }

        AppState.saveGameData()
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        console.log('Resetting game')
        AppState.battleState.player = null
        AppState.battleState.boss = null
        AppState.battleState.battleActive = false
        AppState.battleState.playerTurn = true
        AppState.battleState.turnCount = 0
        AppState.battleState.battleLog = []
        AppState.battleState.playerBarrier = 0
        AppState.battleState.playerDodging = false
        AppState.battleState.playerBurning = false
        AppState.battleState.playerSlowed = false
        AppState.battleState.bossStunned = false
        AppState.selectedHero = null
        AppState.selectedEnemy = null
        console.log('Game reset complete')
    }

    /**
     * Get current battle status
     */
    getBattleStatus() {
        return {
            active: AppState.battleActive,
            playerTurn: AppState.playerTurn,
            turnCount: AppState.turnCount,
            player: AppState.player,
            boss: AppState.boss
        }
    }

    // Legacy methods for compatibility
    getAllCharacters() {
        return [...AppState.paladins, ...AppState.archers]
    }

    getActiveCharacter() {
        return AppState.activeCharacter
    }

    getCharacterById(characterId) {
        let character = AppState.paladins.find(p => p.id === characterId)
        if (!character) {
            character = AppState.archers.find(a => a.id === characterId)
        }
        return character
    }

    clearActiveCharacter() {
        AppState.paladins.forEach(p => p.isActive = false)
        AppState.archers.forEach(a => a.isActive = false)
        AppState.activeCharacter = null
    }
}

// Export the service instance
export const gameService = new GameService()