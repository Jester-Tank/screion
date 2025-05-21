// src/models/Attack.js

export class Attack {
    constructor(data) {
        this.id = data.id || Math.random().toString(36).substring(2)
        this.name = data.name || 'Basic Attack'
        this.damage = data.damage || 0
        this.type = data.type || 'physical' // physical, magical, support
        this.cooldown = data.cooldown || 0
        this.currentCooldown = data.currentCooldown || 0

        // Special effects
        this.heal = data.heal || 0
        this.selfHeal = data.selfHeal || 0
        this.barrier = data.barrier || 0
        this.burn = data.burn || false
        this.stun = data.stun || false
        this.slow = data.slow || false
        this.dodge = data.dodge || false
        this.multi = data.multi || 0
        this.crit = data.crit || false

        // Status effect properties
        this.statusEffect = data.statusEffect || null
        this.statusEffectChance = data.statusEffectChance || 40

        // Accuracy (chance to hit)
        this.accuracy = data.accuracy || 95
    }
}