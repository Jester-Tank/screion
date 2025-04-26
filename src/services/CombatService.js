import { AppState } from "../AppState.js"

class CombatService {
    /**
     * Performs an attack from the attacker to the target
     * @param {Player|Boss} attacker - The entity performing the attack
     * @param {Player|Boss} target - The entity receiving the attack
     * @param {Attack} attack - The attack being performed
     * @returns {Object} - Result of the attack (damage dealt, effects, etc)
     */
    performAttack(attacker, target, attack) {
        // Check if attack hits based on accuracy
        const hitRoll = Math.random() * 100
        if (hitRoll > attack.accuracy) {
            AppState.battleLog.push(`${attacker.name}'s ${attack.name} missed!`)
            return { hit: false, damage: 0 }
        }

        // Calculate base damage
        let damage = attack.damage + (attacker.attack / 10)

        // Apply defense reduction
        damage = Math.max(1, damage - (target.defense / 20))

        // Round damage to integer
        damage = Math.floor(damage)

        // Apply damage to target
        target.currentHealth = Math.max(0, target.currentHealth - damage)

        // Log the attack
        AppState.battleLog.push(`${attacker.name} used ${attack.name} and dealt ${damage} damage to ${target.name}!`)

        // Apply any status effects from the attack
        this.applyStatusEffect(attacker, target, attack)

        // Apply any self-healing from the attack
        if (attack.selfHeal > 0) {
            const healAmount = Math.floor(attack.selfHeal + (attacker.attack / 20))
            attacker.currentHealth = Math.min(attacker.maxHealth, attacker.currentHealth + healAmount)
            AppState.battleLog.push(`${attacker.name} healed for ${healAmount} health!`)
        }

        // Set attack on cooldown
        attack.currentCooldown = attack.cooldown

        // Check if target is defeated
        if (target.currentHealth <= 0) {
            AppState.battleLog.push(`${target.name} has been defeated!`)

            // Handle end of battle based on who was defeated
            if (target === AppState.player) {
                // Player lost
                AppState.battleActive = false
            } else if (target === AppState.boss) {
                // Boss lost
                AppState.battleActive = false
            }
        }

        return { hit: true, damage }
    }

    /**
     * Applies status effects from an attack
     * @param {Player|Boss} attacker - The entity performing the attack
     * @param {Player|Boss} target - The entity receiving the attack
     * @param {Attack} attack - The attack being performed
     */
    applyStatusEffect(attacker, target, attack) {
        if (!attack.statusEffect) return

        // Check if status effect applies based on chance
        const effectRoll = Math.random() * 100
        if (effectRoll > attack.statusEffectChance) return

        // Apply the status effect
        const effectDuration = 3 // Default duration in turns
        const newEffect = {
            name: attack.statusEffect,
            duration: effectDuration,
            source: attacker.name
        }

        // Add effect details based on type
        switch (attack.statusEffect) {
            case 'burn':
                newEffect.damagePerTurn = Math.floor(attacker.attack * 0.2)
                break
            case 'poison':
                newEffect.damagePerTurn = Math.floor(target.maxHealth * 0.05)
                break
            case 'stun':
                newEffect.skipTurn = true
                break
            case 'weaken':
                newEffect.statMod = { defense: -2 }
                break
        }

        // Add to target's status effects
        target.statusEffects.push(newEffect)

        AppState.battleLog.push(`${target.name} is afflicted with ${attack.statusEffect}!`)
    }

    /**
     * Process status effects at the start of an entity's turn
     * @param {Player|Boss} entity - The entity whose turn is starting
     */
    processStatusEffects(entity) {
        if (!entity.statusEffects.length) return

        // Process each status effect
        entity.statusEffects.forEach(effect => {
            // Apply damage over time effects
            if (effect.damagePerTurn) {
                entity.currentHealth = Math.max(0, entity.currentHealth - effect.damagePerTurn)
                AppState.battleLog.push(`${entity.name} took ${effect.damagePerTurn} damage from ${effect.name}!`)
            }

            // Reduce duration
            effect.duration--
        })

        // Remove expired effects
        entity.statusEffects = entity.statusEffects.filter(effect => effect.duration > 0)
    }

    /**
     * Checks if an entity should skip their turn due to status effects
     * @param {Player|Boss} entity - The entity to check
     * @returns {boolean} - Whether the entity should skip their turn
     */
    shouldSkipTurn(entity) {
        return entity.statusEffects.some(effect => effect.skipTurn)
    }
}

export const combatService = new CombatService()