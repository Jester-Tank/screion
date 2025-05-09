import { AppState } from "../AppState.js"
import { Boss } from "../models/Boss.js"
import { Player } from "../models/Player.js"
import { Attack } from "../models/Attack.js"
import { bossService } from "./BossService.js"
import { playerService } from "./PlayerService.js"
import { combatService } from "./CombatService.js"

class GameService {
    /**
     * Initializes a new game with selected player and boss
     * @param {string} playerId - ID of the selected player template
     * @param {string} bossId - ID of the selected boss
     */
    startGame(playerId, bossId) {
        console.log('Starting game with playerId:', playerId, 'and bossId:', bossId)

        // Get player and boss templates from predefined lists
        const playerTemplate = AppState.playerTemplates.find(p => p.id === playerId)
        const bossTemplate = AppState.bossTemplates.find(b => b.id === bossId)

        if (!playerTemplate) {
            console.error('Player template not found for ID:', playerId)
            console.log('Available templates:', AppState.playerTemplates.map(p => p.id))
            throw new Error(`Player with ID ${playerId} not found`)
        }

        if (!bossTemplate) {
            console.error('Boss template not found for ID:', bossId)
            console.log('Available templates:', AppState.bossTemplates.map(b => b.id))
            throw new Error(`Boss with ID ${bossId} not found`)
        }

        // Create new instances from templates with deep copy to avoid reference issues
        AppState.player = new Player(JSON.parse(JSON.stringify(playerTemplate)))
        AppState.boss = new Boss(JSON.parse(JSON.stringify(bossTemplate)))

        // Make sure attacks are properly instantiated
        AppState.player.attacks = AppState.player.attacks.map(a => new Attack(a))
        AppState.boss.attacks = AppState.boss.attacks.map(a => new Attack(a))

        // Set initial game state
        AppState.battleActive = true
        AppState.playerTurn = AppState.player.speed >= AppState.boss.speed
        AppState.battleLog = [`Battle started! ${AppState.player.name} vs ${AppState.boss.name}`]

        console.log('Game initialized with:', {
            player: AppState.player,
            boss: AppState.boss,
            battleActive: AppState.battleActive,
            playerTurn: AppState.playerTurn
        })

        // If boss goes first, trigger boss turn
        if (!AppState.playerTurn) {
            this.processBossTurn()
        }
    }

    /**
     * Ends player's turn and begins boss's turn
     */
    endPlayerTurn() {
        if (!AppState.battleActive || !AppState.playerTurn) return

        // Process cooldowns and status effects
        playerService.processEndOfTurn()

        // Switch turn
        AppState.playerTurn = false

        // Process boss turn
        this.processBossTurn()
    }

    /**
     * Handles boss's turn logic
     */
    processBossTurn() {
        // Check if battle should continue
        if (!AppState.battleActive) return

        // Add slight delay for better UX
        setTimeout(() => {
            // Boss selects and performs an attack
            const bossAttack = bossService.selectBossAttack()
            combatService.performAttack(AppState.boss, AppState.player, bossAttack)

            // Process boss end of turn effects
            bossService.processEndOfTurn()

            // Check if player is defeated
            if (AppState.player.currentHealth <= 0) {
                this.endBattle(false)
                return
            }

            // Switch turn back to player
            AppState.playerTurn = true
        }, 1000)
    }

    /**
     * Ends the battle and sets the outcome
     * @param {boolean} playerWon - Whether the player won
     */
    endBattle(playerWon) {
        AppState.battleActive = false

        if (playerWon) {
            AppState.battleLog.push(`${AppState.player.name} has defeated ${AppState.boss.name}!`)
            // Handle rewards, experience, etc.
            playerService.awardVictory(AppState.boss)
        } else {
            AppState.battleLog.push(`${AppState.player.name} has been defeated by ${AppState.boss.name}!`)
        }
    }

    /**
     * Resets the game to start a new battle
     */
    resetGame() {
        AppState.player = null
        AppState.boss = null
        AppState.battleActive = false
        AppState.playerTurn = false
        AppState.battleLog = []
    }
}

export const gameService = new GameService()