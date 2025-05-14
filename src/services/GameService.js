import { AppState } from "../AppState.js"
import { Player } from "../models/Player.js"
import { Boss } from "../models/Boss.js"
import { Attack } from "../models/Attack.js"
import { bossService } from "./BossService.js"
import { playerService } from "./PlayerService.js"
import { combatService } from "./CombatService.js"

class GameService {
    /**
     * Starts a new battle with selected player and boss
     */
    startBattle() {
        if (!AppState.selectedHero || !AppState.selectedEnemy) return

        console.log('Starting battle with:', {
            hero: AppState.selectedHero,
            enemy: AppState.selectedEnemy
        })

        // Get player and boss templates
        const playerTemplate = AppState.playerTemplates.find(p => p.id === AppState.selectedHero)
        const bossTemplate = AppState.bossTemplates.find(b => b.id === AppState.selectedEnemy)

        if (!playerTemplate || !bossTemplate) {
            console.error('Template not found:', {
                playerTemplate,
                bossTemplate,
                selectedHero: AppState.selectedHero,
                selectedEnemy: AppState.selectedEnemy
            })
            return
        }

        // Initialize battle state
        AppState.turnCount = 0
        AppState.bossStunned = false
        AppState.playerBurning = false
        AppState.playerSlowed = false
        AppState.playerBarrier = 0
        AppState.playerDodging = false
        AppState.battleLog = [`Battle started! ${playerTemplate.name} vs ${bossTemplate.name}`]

        // Create new instances to avoid modifying templates
        AppState.player = new Player(JSON.parse(JSON.stringify(playerTemplate)))
        AppState.boss = new Boss(JSON.parse(JSON.stringify(bossTemplate)))

        // Reset health and convert attacks to Attack models
        AppState.player.currentHealth = AppState.player.maxHealth
        AppState.boss.currentHealth = AppState.boss.maxHealth

        AppState.player.attacks = AppState.player.attacks.map(attack => {
            const attackModel = new Attack(attack)
            attackModel.currentCooldown = 0
            return attackModel
        })

        AppState.boss.attacks = AppState.boss.attacks.map(attack => {
            const attackModel = new Attack(attack)
            attackModel.currentCooldown = 0
            return attackModel
        })

        // Initialize status effects arrays
        AppState.player.statusEffects = []
        AppState.boss.statusEffects = []

        // Determine who goes first based on speed
        AppState.playerTurn = AppState.player.speed >= AppState.boss.speed

        // Set battle as active
        AppState.battleActive = true

        // Switch to battle mode
        AppState.battleMode = true

        // If boss goes first, start boss turn
        if (!AppState.playerTurn) {
            setTimeout(() => {
                this.processBossTurn()
            }, 1000)
        }
    }

    /**
     * Ends player's turn and begins boss's turn
     */
    endPlayerTurn() {
        if (!AppState.battleActive || !AppState.playerTurn) return

        // Process cooldowns and status effects for player
        playerService.processEndOfTurn()

        // Switch turn
        AppState.playerTurn = false

        // Process boss turn after a slight delay
        setTimeout(() => {
            this.processBossTurn()
        }, 1000)
    }

    /**
     * Handles boss's turn logic
     */
    processBossTurn() {
        // Check if battle should continue
        if (!AppState.battleActive) return

        // Process status effects at start of boss turn
        combatService.processStatusEffects(AppState.boss)

        // Check if boss should skip turn
        if (combatService.shouldSkipTurn(AppState.boss)) {
            AppState.battleLog.push(`${AppState.boss.name} is stunned and cannot attack!`)
            AppState.bossStunned = false // Remove stun after one turn
            AppState.playerTurn = true // Back to player's turn
            return
        }

        // Select and perform boss attack
        const bossAttack = bossService.selectBossAttack()

        // Check for dodge
        if (AppState.playerDodging) {
            AppState.battleLog.push(`${AppState.boss.name} attacks but ${AppState.player.name} dodges!`)
            AppState.playerDodging = false // Remove dodge after one use
            AppState.playerTurn = true // Back to player's turn
            return
        }

        // Boss attack miss chance
        if (Math.random() > AppState.boss.attackChance) {
            AppState.battleLog.push(`${AppState.boss.name}'s attack missed!`)
            AppState.playerTurn = true // Back to player's turn
            return
        }

        // Perform the attack
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

        // Clear player slowed effect after one turn
        if (AppState.playerSlowed) {
            AppState.playerSlowed = false
            AppState.battleLog.push(`${AppState.player.name} is no longer slowed.`)
        }
    }

    /**
     * Ends the battle and handles outcome
     * @param {boolean} playerWon - Whether the player won
     */
    endBattle(playerWon) {
        AppState.battleActive = false

        if (playerWon) {
            AppState.battleLog.push(`${AppState.player.name} has defeated ${AppState.boss.name}!`)
            this.awardVictory()
        } else {
            AppState.battleLog.push(`${AppState.player.name} has been defeated by ${AppState.boss.name}!`)
        }
    }

    /**
     * Awards victory rewards to the player
     */
    awardVictory() {
        // Award gold based on boss
        const goldEarned = AppState.boss.goldReward
        AppState.gold += goldEarned
        AppState.battleLog.push(`You earned ${goldEarned} gold!`)

        // Increase player level
        AppState.playerLevel++
        AppState.battleLog.push(`Your player level increased to ${AppState.playerLevel}!`)

        // Save game progress
        playerService.saveGameData()
    }

    /**
     * Resets the battle to return to selection screen
     */
    resetBattle() {
        // Reset battle state
        AppState.battleMode = false
        AppState.battleActive = false
        AppState.selectedHero = null
        AppState.selectedEnemy = null
        AppState.battleLog = ['Prepare for battle!']
        AppState.turnCount = 0
        AppState.bossStunned = false
        AppState.playerBurning = false
        AppState.playerSlowed = false
        AppState.playerBarrier = 0
        AppState.playerDodging = false

        // Clear player and boss
        AppState.player = null
        AppState.boss = null
    }

    /**
     * Checks if player is ready to start a battle
     * @returns {boolean} - Whether both hero and enemy are selected
     */
    isReadyToFight() {
        return AppState.selectedHero && AppState.selectedEnemy
    }
}

export const gameService = new GameService()