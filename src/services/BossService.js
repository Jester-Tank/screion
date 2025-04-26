import { AppState } from "../AppState.js"
import { combatService } from "./CombatService.js"

class BossService {
    /**
     * Selects an attack for the boss to use
     * @returns {Attack} The selected attack
     */
    selectBossAttack() {
        const boss = AppState.boss

        // Get available attacks (not on cooldown)
        const availableAttacks = boss.attacks.filter(attack => attack.currentCooldown === 0)

        if (availableAttacks.length === 0) {
            // If all attacks are on cooldown, find the one with lowest cooldown
            const attack = boss.attacks.sort((a, b) => a.currentCooldown - b.currentCooldown)[0]
            AppState.battleLog.push(`${boss.name} is charging up for next attack!`)
            return attack
        }

        // Check phase transition
        this.checkPhaseTransition()

        // Simple AI to select attack based on situation

        // If health is low and has healing attack, prioritize it
        if (boss.currentHealth < boss.maxHealth * 0.3) {
            const healingAttack = availableAttacks.find(a => a.selfHeal > 0)
            if (healingAttack) return healingAttack
        }

        // If player has no status effects, prioritize attacks that apply them
        if (AppState.player.statusEffects.length === 0) {
            const statusAttack = availableAttacks.find(a => a.statusEffect)
            if (statusAttack) return statusAttack
        }

        // High damage attacks for when boss is in later phases
        if (boss.currentPhase > 0) {
            const highDamageAttacks = availableAttacks.filter(a => a.damage > 20)
            if (highDamageAttacks.length > 0) {
                return this.getRandomAttack(highDamageAttacks)
            }
        }

        // Otherwise, select a random attack
        return this.getRandomAttack(availableAttacks)
    }

    /**
     * Gets a random attack from a list of attacks
     * @param {Attack[]} attacks - List of available attacks
     * @returns {Attack} A randomly selected attack
     */
    getRandomAttack(attacks) {
        const randomIndex = Math.floor(Math.random() * attacks.length)
        return attacks[randomIndex]
    }

    /**
     * Checks if the boss should transition to a new phase
     */
    checkPhaseTransition() {
        const boss = AppState.boss
        const healthPercentage = boss.currentHealth / boss.maxHealth

        // Check if we should move to the next phase
        for (let i = boss.currentPhase + 1; i < boss.phases.length; i++) {
            const phase = boss.phases[i]
            if (healthPercentage <= phase.healthThreshold) {
                this.transitionToPhase(i)
                break
            }
        }
    }

    /**
     * Transitions the boss to a new phase
     * @param {number} phaseIndex - Index of the new phase
     */
    transitionToPhase(phaseIndex) {
        const boss = AppState.boss
        const newPhase = boss.phases[phaseIndex]

        if (!newPhase) return

        // Set new phase
        boss.currentPhase = phaseIndex

        // Apply phase modifiers
        const oldAttack = boss.attack
        const oldDefense = boss.defense

        boss.attack = Math.floor(boss.attack * newPhase.attackMultiplier)
        boss.defense = Math.floor(boss.defense * newPhase.defenseMultiplier)

        AppState.battleLog.push(`${boss.name} enters a new phase and grows stronger!`)

        // Log stat changes
        if (boss.attack > oldAttack) {
            AppState.battleLog.push(`${boss.name}'s attack increased!`)
        }

        if (boss.defense !== oldDefense) {
            const changeText = boss.defense > oldDefense ? 'increased' : 'decreased'
            AppState.battleLog.push(`${boss.name}'s defense ${changeText}!`)
        }

        // Reset all cooldowns for the boss
        boss.attacks.forEach(attack => {
            attack.currentCooldown = 0
        })
    }

    /**
     * Processes effects at the end of boss's turn
     */
    processEndOfTurn() {
        // Process status effects
        combatService.processStatusEffects(AppState.boss)

        // Process cooldowns on attacks
        AppState.boss.attacks.forEach(attack => {
            if (attack.currentCooldown > 0) {
                attack.currentCooldown--
            }
        })
    }
}

export const bossService = new BossService()