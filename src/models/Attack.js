// src/models/Attack.js
export class Attack {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.damage = data.damage || 0
        this.type = data.type || 'physical'
        this.cooldown = data.cooldown || 0
        this.currentCooldown = data.currentCooldown || 0
        this.heal = data.heal || 0
        this.selfHeal = data.selfHeal || 0
        this.stun = data.stun || false
        this.burn = data.burn || false
        this.slow = data.slow || false
        this.multi = data.multi || 0
        this.barrier = data.barrier || 0
        this.dodge = data.dodge || false
        this.crit = data.crit || false
        this.statusEffect = data.statusEffect || null
        this.statusEffectChance = data.statusEffectChance || 50
        this.accuracy = data.accuracy || 95
    }
}