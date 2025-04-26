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
        // Get player and boss templates from predefined lists
        const playerTemplate = AppState.playerTemplates.find(p => p.id === playerId)
        const bossTemplate = AppState.bossTemplates.find(b => b.id === bossId)

        if (!playerTemplate || !bossTemplate) {
            throw new Error('Player or Boss not found')
        }

        // Create new instances from templates
        AppState.player = new Player(playerTemplate)
        AppState.boss = new Boss(bossTemplate)

        // Set initial game state
        AppState.battleActive = true
        AppState.playerTurn = AppState.player.speed >= AppState.boss.speed
        AppState.battleLog = [`Battle started! ${AppState.player.name} vs ${AppState.boss.name}`]

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