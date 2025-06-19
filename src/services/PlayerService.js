// src/services/PlayerService.js
import { AppState } from "../AppState.js"

class PlayerService {
    /**
     * Use a player attack during battle
     * @param {Object} attack - The attack to use
     */
    usePlayerAttack(attack) {
        if (!AppState.battleActive || !AppState.playerTurn) {
            return
        }

        const player = AppState.player
        const boss = AppState.boss

        if (!player || !boss) {
            return
        }

        // Calculate damage
        let damage = attack.damage || 0
        if (damage > 0) {
            // Apply attack bonus
            damage += Math.floor(player.attack / 10)

            // Apply boss defense
            damage = Math.max(1, damage - Math.floor(boss.defense / 20))

            // Apply damage to boss
            boss.currentHealth = Math.max(0, boss.currentHealth - damage)

            AppState.battleLog.push(`${player.name} uses ${attack.name} and deals ${damage} damage to ${boss.name}!`)
        }

        // Apply healing
        if (attack.heal > 0) {
            const healAmount = attack.heal
            player.currentHealth = Math.min(player.maxHealth, player.currentHealth + healAmount)
            AppState.battleLog.push(`${player.name} heals for ${healAmount} health!`)
        }

        // Apply barrier
        if (attack.barrier > 0) {
            AppState.playerBarrier = attack.barrier
            AppState.battleLog.push(`${player.name} gains a barrier of ${attack.barrier}!`)
        }

        // Set attack on cooldown
        if (attack.cooldown > 0) {
            attack.currentCooldown = attack.cooldown
        }

        // Check if boss is defeated
        if (boss.currentHealth <= 0) {
            AppState.battleLog.push(`${boss.name} has been defeated!`)
            this.endBattle(true)
            return
        }

        // End player turn
        this.endPlayerTurn()
    }

    /**
     * Use a player item during battle
     * @param {Object} item - The item to use
     */
    usePlayerItem(item) {
        if (!AppState.battleActive || !AppState.playerTurn) {
            return
        }

        const player = AppState.player

        if (!player) {
            return
        }

        // Apply item effects based on type
        switch (item.type) {
            case 'health': {
                const healAmount = item.value
                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + healAmount)
                AppState.battleLog.push(`${player.name} uses ${item.name} and heals for ${healAmount} health!`)
                break
            }

            case 'attack': {
                player.attack += item.value
                AppState.battleLog.push(`${player.name} uses ${item.name} and gains ${item.value} attack!`)
                break
            }

            case 'defense': {
                player.defense += item.value
                AppState.battleLog.push(`${player.name} uses ${item.name} and gains ${item.value} defense!`)
                break
            }

            case 'cleanse': {
                // Remove status effects
                AppState.playerBurning = false
                AppState.playerSlowed = false
                if (player.statusEffects) {
                    player.statusEffects = []
                }
                AppState.battleLog.push(`${player.name} uses ${item.name} and removes all status effects!`)
                break
            }

            default: {
                AppState.battleLog.push(`${player.name} uses ${item.name}!`)
                break
            }
        }

        // Remove item from inventory if it's one-time use
        if (item.oneTimeUse !== false) {
            const itemIndex = player.items.findIndex(i => i.id === item.id)
            if (itemIndex > -1) {
                player.items.splice(itemIndex, 1)
            }
        }

        // End player turn
        this.endPlayerTurn()
    }

    /**
     * End the player's turn
     */
    endPlayerTurn() {
        // Reduce cooldowns on player attacks
        if (AppState.player && AppState.player.attacks) {
            AppState.player.attacks.forEach(attack => {
                if (attack.currentCooldown > 0) {
                    attack.currentCooldown--
                }
            })
        }

        // Switch to boss turn
        AppState.playerTurn = false
        AppState.turnCount++

        // Start boss turn after a delay
        setTimeout(() => {
            this.processBossTurn()
        }, 1000)
    }

    /**
     * Process the boss's turn
     */
    processBossTurn() {
        if (!AppState.battleActive || AppState.playerTurn) return

        const boss = AppState.boss
        const player = AppState.player

        if (!boss || !player) return

        // Simple AI: pick a random attack
        if (boss.attacks && boss.attacks.length > 0) {
            const availableAttacks = boss.attacks.filter(a => a.currentCooldown === 0)
            if (availableAttacks.length > 0) {
                const attack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)]
                this.useBossAttack(boss, player, attack)
            }
        } else {
            // Basic attack
            this.useBossBasicAttack(boss, player)
        }

        // Check if player is defeated
        if (player.currentHealth <= 0) {
            AppState.battleLog.push(`${player.name} has been defeated!`)
            this.endBattle(false)
            return
        }

        // End boss turn
        this.endBossTurn()
    }

    /**
     * Boss uses an attack
     */
    useBossAttack(boss, player, attack) {
        let damage = attack.damage || boss.attack

        // Apply player defense and barrier
        if (AppState.playerBarrier > 0) {
            const blockedDamage = Math.min(damage, AppState.playerBarrier)
            AppState.playerBarrier -= blockedDamage
            damage -= blockedDamage
            AppState.battleLog.push(`${player.name}'s barrier absorbs ${blockedDamage} damage!`)
        }

        if (damage > 0) {
            damage = Math.max(1, damage - Math.floor(player.defense / 20))
            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss.name} uses ${attack.name} and deals ${damage} damage to ${player.name}!`)
        }

        // Set attack on cooldown
        if (attack.cooldown > 0) {
            attack.currentCooldown = attack.cooldown
        }
    }

    /**
     * Boss uses basic attack
     */
    useBossBasicAttack(boss, player) {
        let damage = boss.attack || 20

        // Apply player defense and barrier
        if (AppState.playerBarrier > 0) {
            const blockedDamage = Math.min(damage, AppState.playerBarrier)
            AppState.playerBarrier -= blockedDamage
            damage -= blockedDamage
            AppState.battleLog.push(`${player.name}'s barrier absorbs ${blockedDamage} damage!`)
        }

        if (damage > 0) {
            damage = Math.max(1, damage - Math.floor(player.defense / 20))
            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss.name} attacks ${player.name} for ${damage} damage!`)
        }
    }

    /**
     * End the boss's turn
     */
    endBossTurn() {
        // Reduce cooldowns on boss attacks
        if (AppState.boss && AppState.boss.attacks) {
            AppState.boss.attacks.forEach(attack => {
                if (attack.currentCooldown > 0) {
                    attack.currentCooldown--
                }
            })
        }

        // Switch back to player turn
        AppState.playerTurn = true
    }

    /**
     * End the battle
     */
    endBattle(playerWon) {
        AppState.battleActive = false

        if (playerWon) {
            const boss = AppState.boss
            const goldReward = boss?.goldReward || 50

            AppState.addGold(goldReward)
            if (boss?.id) {
                AppState.recordDefeat(boss.id)
            }

            AppState.battleLog.push(`Victory! You earned ${goldReward} gold!`)
        } else {
            const consolationGold = 10
            AppState.addGold(consolationGold)
            AppState.battleLog.push(`Defeat! You earned ${consolationGold} consolation gold.`)
        }

        AppState.saveGameData()
    }
}

export const playerService = new PlayerService()