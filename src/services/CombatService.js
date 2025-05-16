// src/services/CombatService.js
import { AppState } from "../AppState.js"
// Import models only if actually needed for type checking (not just for JSDoc)
// import { Player } from "../models/Player.js"
// import { Boss } from "../models/Boss.js"
// import { Attack } from "../models/Attack.js"

class CombatService {
    /**
     * Performs an attack from the attacker to the target
     */
    performAttack(attacker, target, attack) {
        console.log('Performing attack:', {
            attacker: attacker.name,
            target: target.name,
            attack: attack.name
        })

        if (!attacker || !target) {
            console.error('Invalid attacker or target:', { attacker, target })
            return { hit: false, damage: 0 }
        }

        // Check if attack hits based on accuracy
        const accuracy = attack.accuracy || 95 // Default 95% accuracy if not specified
        const hitRoll = Math.random() * 100
        if (hitRoll > accuracy) {
            console.log(`Attack missed: roll ${hitRoll} > accuracy ${accuracy}`)
            AppState.battleLog.push(`${attacker.name}'s ${attack.name} missed!`)
            return { hit: false, damage: 0 }
        }

        // Multi-hit attack handling
        if (attack.multi) {
            return this.handleMultiHitAttack(attacker, target, attack)
        }

        // Calculate base damage
        let damage = attack.damage + (attacker.attack / 10)

        // Apply defense reduction
        damage = Math.max(1, damage - (target.defense / 20))

        // Handle critical hit
        let isCrit = false
        const critChance = attack.crit ? 0.4 : 0.15  // Higher crit chance for critical-focused attacks
        if (Math.random() < critChance) {
            damage *= 1.5  // 50% bonus damage on crit
            isCrit = true
        }

        // Round damage to integer
        damage = Math.floor(damage)

        console.log('Attack hit:', {
            baseDamage: attack.damage,
            attackerBonus: attacker.attack / 10,
            defenseReduction: target.defense / 20,
            finalDamage: damage,
            isCrit
        })

        // Apply damage to target
        target.currentHealth = Math.max(0, target.currentHealth - damage)

        // Log the attack
        let logMessage = `${attacker.name} used ${attack.name} and dealt ${damage} damage to ${target.name}!`
        if (isCrit) {
            logMessage += ' CRITICAL HIT!'
        }
        AppState.battleLog.push(logMessage)

        // Apply any status effects from the attack
        this.applyStatusEffect(attacker, target, attack)

        // Apply any healing or special effects to the attacker
        this.applyAttackEffects(attacker, attack)

        // Set attack on cooldown
        attack.currentCooldown = attack.cooldown

        // Check if target is defeated
        if (target.currentHealth <= 0) {
            console.log(`${target.name} has been defeated!`)
            AppState.battleLog.push(`${target.name} has been defeated!`)
            AppState.battleActive = false
        }

        return { hit: true, damage, isCrit }
    }

    /**
     * Handles multi-hit attacks
     */
    handleMultiHitAttack(attacker, target, attack) {
        let hits = 0
        let totalDamage = 0
        const hitChance = 0.8 // 80% hit chance per hit
        const baseDamage = Math.floor((attack.damage + (attacker.attack / 10)) * 0.8) // Each hit does 80% damage

        for (let i = 0; i < attack.multi; i++) {
            if (Math.random() < hitChance) {
                hits++
                // Apply defense reduction per hit
                const hitDamage = Math.max(1, baseDamage - (target.defense / 30))
                totalDamage += Math.floor(hitDamage)
            }
        }

        if (hits > 0) {
            // Apply total damage
            target.currentHealth = Math.max(0, target.currentHealth - totalDamage)
            AppState.battleLog.push(`${attacker.name} used ${attack.name} and hit ${hits}/${attack.multi} times for ${totalDamage} total damage!`)
        } else {
            AppState.battleLog.push(`${attacker.name} used ${attack.name} but missed all ${attack.multi} hits!`)
        }

        // Set attack on cooldown
        attack.currentCooldown = attack.cooldown

        // Check for target defeat
        if (target.currentHealth <= 0) {
            console.log(`${target.name} has been defeated!`)
            AppState.battleLog.push(`${target.name} has been defeated!`)
            AppState.battleActive = false
        }

        return { hit: hits > 0, damage: totalDamage, hits }
    }

    /**
     * Applies status effects from an attack
     */
    applyStatusEffect(attacker, target, attack) {
        // Handle burn effect
        if (attack.burn && Math.random() < 0.4) {
            if (target === AppState.boss) {
                target.burning = true
                AppState.battleLog.push(`${target.name} is burning!`)
            } else {
                AppState.playerBurning = true
                AppState.battleLog.push(`${target.name} is burning!`)
            }
        }

        // Handle stun effect
        if (attack.stun && Math.random() < 0.4) {
            if (target === AppState.boss) {
                AppState.bossStunned = true
                AppState.battleLog.push(`${target.name} is stunned!`)
            } else {
                // If we need to add player stun in the future
                AppState.battleLog.push(`${target.name} is stunned!`)
            }
        }

        // Handle slow effect
        if (attack.slow && Math.random() < 0.4) {
            if (target === AppState.player) {
                AppState.playerSlowed = true
                AppState.battleLog.push(`${target.name} is slowed!`)
            }
        }

        // Handle explicit status effects if provided
        if (attack.statusEffect) {
            const effectChance = attack.statusEffectChance || 40
            if (Math.random() * 100 < effectChance) {
                // Create status effect object
                const newEffect = {
                    name: attack.statusEffect,
                    duration: 3, // Default 3 turns
                    source: attacker.name
                }

                // Add effect-specific properties
                switch (attack.statusEffect) {
                    case 'burn':
                        newEffect.damagePerTurn = Math.floor(attacker.attack * 0.2)
                        break
                    case 'stun':
                        newEffect.skipTurn = true
                        break
                    case 'slow':
                        newEffect.speedReduction = 5
                        break
                }

                // Add to target's status effects
                if (!target.statusEffects) {
                    target.statusEffects = []
                }
                target.statusEffects.push(newEffect)
                AppState.battleLog.push(`${target.name} is afflicted with ${attack.statusEffect}!`)
            }
        }
    }

    /**
     * Applies healing or barrier effects from an attack to the attacker
     */
    applyAttackEffects(attacker, attack) {
        // Apply healing
        if (attack.heal) {
            const healAmount = attack.heal
            attacker.currentHealth = Math.min(attacker.maxHealth, attacker.currentHealth + healAmount)
            AppState.battleLog.push(`${attacker.name} healed for ${healAmount} health!`)
        }

        // Apply self healing (for enemies)
        if (attack.selfHeal) {
            const healAmount = Math.floor(attack.selfHeal + (attacker.attack / 20))
            attacker.currentHealth = Math.min(attacker.maxHealth, attacker.currentHealth + healAmount)
            AppState.battleLog.push(`${attacker.name} healed for ${healAmount} health!`)
        }

        // Apply barrier
        if (attack.barrier) {
            AppState.playerBarrier = attack.barrier
            AppState.battleLog.push(`${attacker.name} gained a barrier of ${attack.barrier}!`)
        }

        // Apply dodge
        if (attack.dodge) {
            AppState.playerDodging = true
            AppState.battleLog.push(`${attacker.name} is dodging attacks!`)
        }
    }

    /**
     * Process status effects at the start of an entity's turn
     */
    processStatusEffects(entity) {
        // Special case for burning boss (legacy system)
        if (entity === AppState.boss && entity.burning) {
            const burnDamage = Math.floor(AppState.player.attack / 4)
            entity.currentHealth = Math.max(0, entity.currentHealth - burnDamage)
            AppState.battleLog.push(`${entity.name} takes ${burnDamage} burn damage!`)

            // Check for defeat from burn damage
            if (entity.currentHealth <= 0) {
                AppState.battleLog.push(`${entity.name} has been defeated by burn damage!`)
                AppState.battleActive = false
                return
            }

            // 30% chance to remove burning
            if (Math.random() < 0.3) {
                entity.burning = false
                AppState.battleLog.push(`${entity.name} is no longer burning.`)
            }
        }

        // Process standard status effects array if present
        if (entity.statusEffects && entity.statusEffects.length > 0) {
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
    }

    /**
     * Checks if an entity should skip their turn due to status effects
     */
    shouldSkipTurn(entity) {
        // Check for legacy stun on boss
        if (entity === AppState.boss && AppState.bossStunned) {
            return true
        }

        // Check status effects array
        return entity.statusEffects && entity.statusEffects.some(effect => effect.skipTurn)
    }

    /**
     * Utility function to calculate health percentage
     */
    healthPercent(current, max) {
        return (current / max) * 100
    }

    /**
     * Utility function to get health bar color based on percentage
     */
    healthColor(current, max) {
        const percent = (current / max) * 100
        if (percent > 70) return '#4CAF50' // Green
        if (percent > 40) return '#FFC107' // Yellow
        return '#F44336' // Red
    }
}

export const combatService = new CombatService()