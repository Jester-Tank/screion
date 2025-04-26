export class Attack {
    constructor(data) {
        this.id = data.id || Math.random().toString(36).substring(2)
        this.name = data.name
        this.damage = data.damage || 0
        this.accuracy = data.accuracy || 90 // percentage chance to hit
        this.cooldown = data.cooldown || 0 // turns before usable again
        this.currentCooldown = 0
        this.type = data.type || 'physical' // physical, magical, etc
        this.statusEffect = data.statusEffect || null // burn, poison, stun, etc
        this.statusEffectChance = data.statusEffectChance || 0 // percentage chance to apply
        this.description = data.description || ''
        this.imgUrl = data.imgUrl || ''
        this.isBossAttack = data.isBossAttack || false // is this attack used by a boss?
        this.aoe = data.aoe || false // area of effect (for future multiplayer)
        this.selfHeal = data.selfHeal || 0 // amount to heal self when using
    }
}