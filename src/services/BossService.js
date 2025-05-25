import { AppState } from "../AppState.js"
import { Attack } from "../models/Attack.js"

class BossService {
    /**
     * Selects an attack for the boss to use
     * @returns {Attack} The selected attack
     */
    selectBossAttack() {
        const boss = AppState.boss

        // Safety check - make sure boss exists and has attacks
        if (!boss) {
            console.error('No boss found in AppState')
            return this.createBasicAttack()
        }

        // Ensure boss has attacks array
        if (!boss.attacks || boss.attacks.length === 0) {
            console.warn('Boss has no attacks, creating basic attack')
            boss.attacks = [this.createBasicAttack()]
        }

        // Get available attacks (not on cooldown)
        const availableAttacks = boss.attacks.filter(attack =>
            attack && attack.currentCooldown === 0
        )

        if (availableAttacks.length === 0) {
            // If all attacks are on cooldown, find the one with lowest cooldown
            const sortedAttacks = boss.attacks
                .filter(attack => attack) // Filter out any null/undefined attacks
                .sort((a, b) => a.currentCooldown - b.currentCooldown)

            if (sortedAttacks.length > 0) {
                const attack = sortedAttacks[0]
                AppState.battleLog.push(`${boss.name} is charging up for next attack!`)
                return attack
            } else {
                // Fallback - create a basic attack
                return this.createBasicAttack()
            }
        }

        // Check phase transition
        this.checkPhaseTransition()

        // Simple AI to select attack based on situation

        // If boss health is low and has a healing attack, prioritize it
        if (boss.currentHealth < boss.maxHealth * 0.3) {
            const healingAttack = availableAttacks.find(a => a.selfHeal > 0)
            if (healingAttack) return healingAttack
        }

        // Every 3rd turn, boss does something special if possible
        if (AppState.turnCount % 3 === 0) {
            const specialAttack = availableAttacks.find(a => a.cooldown >= 3)
            if (specialAttack) return specialAttack

            // If no special attack is available, try to heal a bit (legacy code support)
            if (Math.random() < 0.5) {
                const healAmount = Math.floor(boss.maxHealth * 0.05)  // Only heal 5% of max health
                boss.currentHealth = Math.min(boss.maxHealth, boss.currentHealth + healAmount)
                if (AppState.battleLog) {
                    AppState.battleLog.push(`${boss.name} recovers ${healAmount} health!`)
                }
            }
        }

        // If player has high health, prioritize high damage attacks
        if (AppState.player && AppState.player.currentHealth > AppState.player.maxHealth * 0.6) {
            const damageAttacks = availableAttacks.filter(a => a.damage > 20)
            if (damageAttacks.length > 0) {
                return this.getRandomAttack(damageAttacks)
            }
        }

        // If player has status effects, prioritize attacks that apply them
        if (!AppState.playerBurning && !AppState.playerSlowed) {
            const statusAttack = availableAttacks.find(a => a.statusEffect || a.burn || a.slow)
            if (statusAttack) return statusAttack
        }

        // Otherwise, select a random attack
        return this.getRandomAttack(availableAttacks)
    }

    /**
     * Creates a basic attack as fallback
     * @returns {Attack} A basic attack
     */
    createBasicAttack() {
        return new Attack({
            id: 'basic-attack',
            name: 'Basic Strike',
            damage: 10,
            type: 'physical',
            cooldown: 0,
            currentCooldown: 0
        })
    }

    /**
     * Gets a random attack from a list of attacks
     * @param {Attack[]} attacks - List of available attacks
     * @returns {Attack} A randomly selected attack
     */
    getRandomAttack(attacks) {
        if (!attacks || attacks.length === 0) {
            return this.createBasicAttack()
        }
        const randomIndex = Math.floor(Math.random() * attacks.length)
        return attacks[randomIndex]
    }

    /**
     * Checks if the boss should transition to a new phase
     */
    checkPhaseTransition() {
        const boss = AppState.boss

        if (!boss) return

        // Skip if no phases defined
        if (!boss.phases || boss.phases.length === 0) return

        // Initialize currentPhase if not set
        if (boss.currentPhase === undefined) {
            boss.currentPhase = 0
        }

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
        if (!boss || !boss.phases) return

        const newPhase = boss.phases[phaseIndex]
        if (!newPhase) return

        // Set new phase
        boss.currentPhase = phaseIndex

        // Apply phase modifiers
        const oldAttack = boss.attack
        const oldDefense = boss.defense

        boss.attack = Math.floor(boss.attack * newPhase.attackMultiplier)
        boss.defense = Math.floor(boss.defense * newPhase.defenseMultiplier)

        if (AppState.battleLog) {
            AppState.battleLog.push(`${boss.name} enters a new phase and grows stronger!`)

            // Log stat changes
            if (boss.attack > oldAttack) {
                AppState.battleLog.push(`${boss.name}'s attack increased!`)
            }

            if (boss.defense !== oldDefense) {
                const changeText = boss.defense > oldDefense ? 'increased' : 'decreased'
                AppState.battleLog.push(`${boss.name}'s defense ${changeText}!`)
            }
        }

        // Reset all cooldowns for the boss
        if (boss.attacks && boss.attacks.length > 0) {
            boss.attacks.forEach(attack => {
                if (attack) {
                    attack.currentCooldown = 0
                }
            })
        }
    }

    /**
     * Processes effects at the end of boss's turn
     */
    processEndOfTurn() {
        if (!AppState.boss || !AppState.boss.attacks) return

        // Process cooldowns on attacks
        AppState.boss.attacks.forEach(attack => {
            if (attack && attack.currentCooldown > 0) {
                attack.currentCooldown--
            }
        })
    }
}

export const bossService = new BossService()