iimport { AppState } from "../AppState.js"
import { gameService } from "./GameService.js"
import { combatService } from "./CombatService.js"

class PlayerService {
    /**
     * Handles when the player uses an attack
     * @param {Attack} attack - The attack to use
     */
    usePlayerAttack(attack) {
        if (!AppState.battleActive || !AppState.playerTurn) return

        // Check if player is stunned
        if (combatService.shouldSkipTurn(AppState.player)) {
            AppState.battleLog.push(`${AppState.player.name} is stunned and cannot attack!`)
            gameService.endPlayerTurn()
            return
        }

        // Perform the attack
        combatService.performAttack(AppState.player, AppState.boss, attack)

        // Check if boss is defeated
        if (AppState.boss.currentHealth <= 0) {
            gameService.endBattle(true)
            return
        }

        // End player turn
        gameService.endPlayerTurn()
    }

    /**
     * Handles when the player uses an item
     * @param {Item} item - The item to use
     */
    usePlayerItem(item) {
        if (!AppState.battleActive || !AppState.playerTurn) return

        // Check if player is stunned
        if (combatService.shouldSkipTurn(AppState.player)) {
            AppState.battleLog.push(`${AppState.player.name} is stunned and cannot use items!`)
            gameService.endPlayerTurn()
            return
        }

        // Apply item effect
        this.applyItemEffect(item)

        // Remove item from inventory
        const itemIndex = AppState.player.items.findIndex(i => i.id === item.id)
        if (itemIndex > -1) {
            AppState.player.items.splice(itemIndex, 1)
        }

        // End player turn
        gameService.endPlayerTurn()
    }

    /**
     * Applies an item's effect
     * @param {Item} item - The item to apply
     */
    applyItemEffect(item) {
        let healAmount;

        switch (item.type) {
            case 'health':
                healAmount = item.value;
                AppState.player.currentHealth = Math.min(
                    AppState.player.maxHealth,
                    AppState.player.currentHealth + healAmount
                )
                AppState.battleLog.push(`${AppState.player.name} used ${item.name} and healed for ${healAmount} health!`)
                break
            case 'attack':
                AppState.player.attack += item.value
                AppState.battleLog.push(`${AppState.player.name} used ${item.name} and gained ${item.value} attack!`)
                break
            case 'defense':
                AppState.player.defense += item.value
                AppState.battleLog.push(`${AppState.player.name} used ${item.name} and gained ${item.value} defense!`)
                break
            case 'cleanse':
                AppState.player.statusEffects = []
                AppState.battleLog.push(`${AppState.player.name} used ${item.name} and removed all status effects!`)
                break
        }
    }

    /**
     * Processes effects at the end of player's turn
     */
    processEndOfTurn() {
        // Process cooldowns on attacks
        AppState.player.attacks.forEach(attack => {
            if (attack.currentCooldown > 0) {
                attack.currentCooldown--
            }
        })
    }

    /**
     * Awards victory rewards to the player
     * @param {Boss} boss - The defeated boss
     */
    awardVictory(boss) {
        // Award experience
        const expGain = boss.level * 50
        AppState.player.exp += expGain
        AppState.battleLog.push(`${AppState.player.name} gained ${expGain} experience!`)

        // Check for level up
        this.checkLevelUp()

        // Could add item drops, currency, etc. here
    }

    /**
     * Checks if player has enough exp to level up
     */
    checkLevelUp() {
        const expNeeded = AppState.player.level * 100

        if (AppState.player.exp >= expNeeded) {
            // Level up
            AppState.player.level++
            AppState.player.exp -= expNeeded

            // Improve stats
            AppState.player.maxHealth += 10
            AppState.player.currentHealth = AppState.player.maxHealth
            AppState.player.attack += 2
            AppState.player.defense += 1

            AppState.battleLog.push(`${AppState.player.name} leveled up to level ${AppState.player.level}!`)

            // Check for another level up (in case gained a lot of exp)
            this.checkLevelUp()
        }
    }
}

export const playerService = new PlayerService()