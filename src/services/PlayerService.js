import { AppState } from "../AppState.js"
import { gameService } from "./GameService.js"
import { combatService } from "./CombatService.js"
import { characterService } from "./CharacterService.js"

class PlayerService {
    /**
     * Handles player using an attack in battle
     * @param {Attack} attack - The attack to use
     */
    usePlayerAttack(attack) {
        if (!AppState.battleActive || !AppState.playerTurn) return

        AppState.turnCount++

        // Check for status effects that would prevent attacking
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
     * Processes effects at the end of player's turn
     */
    processEndOfTurn() {
        // Process status effects
        combatService.processStatusEffects(AppState.player)

        // Process cooldowns on attacks
        AppState.player.attacks.forEach(attack => {
            if (attack.currentCooldown > 0) {
                attack.currentCooldown--
            }
        })
    }

    /**
     * Handles using an item from inventory
     * @param {Item} item - The item to use
     */
    usePlayerItem(item) {
        if (!AppState.battleActive || !AppState.playerTurn) return

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
     * Save game data to localStorage
     */
    saveGameData() {
        characterService.saveGameData()
    }
}

export const playerService = new PlayerService()