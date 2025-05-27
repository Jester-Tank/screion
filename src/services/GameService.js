// src/services/GameService.js
import { AppState } from "../AppState.js"
import { combatService } from "./CombatService.js"
import { bossService } from "./BossService.js"
import { bossDataService } from "./BossDataService.js"
import { characterService } from "./CharacterService.js"
import { playerService } from "./PlayerService.js"

class GameService {
    /**
     * Initialize the game - load data and set up initial state
     */
    initializeGame() {
        console.log('Initializing game...')

        // Load saved game data
        AppState.loadGameData()

        // Initialize character and boss templates
        characterService.initializeCharacterData()
        bossDataService.initializeBossData()

        console.log('Game initialized successfully')
    }

    /**
     * Start a battle between selected hero and boss
     * @param {string} heroId - The ID of the selected hero
     * @param {string} bossId - The ID of the selected boss
     */
    startBattle(heroId, bossId) {
        console.log(`Starting battle: ${heroId} vs ${bossId}`)

        // Get hero template and create instance
        const heroTemplate = characterService.getCharacterTemplate(heroId)
        if (!heroTemplate) {
            throw new Error(`Hero template not found: ${heroId}`)
        }

        // Create fresh player instance
        const player = characterService.createPlayerInstance(heroId)
        if (!player) {
            throw new Error(`Failed to create player instance: ${heroId}`)
        }

        // Create fresh boss instance
        const boss = bossDataService.createBossInstance(bossId)
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
        AppState.battleLog.push(`${player.name} faces off against ${boss.name}!`)
        AppState.battleLog.push(`The battle begins!`)

        console.log('Battle started successfully:', {
            player: player.name,
            boss: boss.name,
            playerHealth: player.currentHealth,
            bossHealth: boss.currentHealth
        })
    }

    /**
     * End the player's turn and start boss turn
     */
    endPlayerTurn() {
        if (!AppState.battleActive) return

        console.log('Ending player turn')

        // Process end of player turn effects
        playerService.processEndOfTurn()

        // Switch to boss turn
        AppState.playerTurn = false

        // Start boss turn after a short delay
        setTimeout(() => {
            this.processBossTurn()
        }, 1000)
    }

    /**
     * Process the boss's turn
     */
    processBossTurn() {
        if (!AppState.battleActive || AppState.playerTurn) return

        console.log('Processing boss turn')

        // Process status effects at start of boss turn
        combatService.processStatusEffects(AppState.boss)

        // Check if boss should skip turn due to status effects
        if (combatService.shouldSkipTurn(AppState.boss)) {
            AppState.battleLog.push(`${AppState.boss.name} is stunned and skips their turn!`)
            this.endBossTurn()
            return
        }

        // Select and perform boss attack
        const selectedAttack = bossService.selectBossAttack()
        if (selectedAttack) {
            setTimeout(() => {
                combatService.performAttack(AppState.boss, AppState.player, selectedAttack)

                // Check if player is defeated
                if (AppState.player.currentHealth <= 0) {
                    this.endBattle(false)
                    return
                }

                this.endBossTurn()
            }, 500)
        } else {
            // Fallback if no attack selected
            AppState.battleLog.push(`${AppState.boss.name} hesitates...`)
            this.endBossTurn()
        }
    }

    /**
     * End the boss's turn and return to player turn
     */
    endBossTurn() {
        if (!AppState.battleActive) return

        console.log('Ending boss turn')

        // Process boss end of turn effects
        bossService.processEndOfTurn()

        // Reset status effects for next turn
        if (AppState.bossStunned) {
            AppState.bossStunned = false
            AppState.battleLog.push(`${AppState.boss.name} is no longer stunned.`)
        }

        if (AppState.playerSlowed) {
            AppState.playerSlowed = false
            AppState.battleLog.push(`${AppState.player.name} is no longer slowed.`)
        }

        if (AppState.playerDodging) {
            AppState.playerDodging = false
        }

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
            const goldReward = boss.goldReward || 50

            // Award gold
            AppState.addGold(goldReward)

            // Record boss defeat
            AppState.recordDefeat(boss.id)

            // Level up player
            AppState.levelUp()

            // Add victory messages
            AppState.battleLog.push(`Victory! ${boss.name} has been defeated!`)
            AppState.battleLog.push(`You earned ${goldReward} gold!`)
            AppState.battleLog.push(`You leveled up! Now level ${AppState.playerLevel}`)

            console.log(`Victory! Earned ${goldReward} gold, now level ${AppState.playerLevel}`)
        } else {
            AppState.battleLog.push(`Defeat! ${AppState.player.name} has fallen in battle...`)
            console.log('Player defeated')
        }

        // Save game progress
        AppState.saveGameData()
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        console.log('Resetting game')

        // Clear battle state
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

        // Clear selections
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
        // Search in both character collections
        let character = AppState.paladins.find(p => p.id === characterId)
        if (!character) {
            character = AppState.archers.find(a => a.id === characterId)
        }
        return character
    }

    clearActiveCharacter() {
        // Clear all active flags
        AppState.paladins.forEach(p => p.isActive = false)
        AppState.archers.forEach(a => a.isActive = false)
        AppState.activeCharacter = null
    }

    randomEncounter() {
        if (!AppState.activeCharacter) return null

        const enemies = [
            { name: 'Goblin', health: 30, attack: 8, xpReward: 25 },
            { name: 'Orc Warrior', health: 50, attack: 12, xpReward: 40 },
            { name: 'Dark Elf Assassin', health: 35, attack: 15, xpReward: 45 },
            { name: 'Forest Troll', health: 60, attack: 10, xpReward: 50 },
            { name: 'Skeleton Archer', health: 25, attack: 13, xpReward: 35 }
        ]

        // Choose a random enemy
        const enemy = enemies[Math.floor(Math.random() * enemies.length)]
        return enemy
    }
}

export const gameService = new GameService()