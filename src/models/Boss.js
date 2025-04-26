export class Boss {
    constructor(data) {
        this.id = data.id || Math.random().toString(36).substring(2)
        this.name = data.name
        this.maxHealth = data.maxHealth || 200
        this.currentHealth = data.currentHealth || this.maxHealth
        this.attack = data.attack || 15
        this.defense = data.defense || 8
        this.speed = data.speed || 3
        this.level = data.level || 1
        this.imgUrl = data.imgUrl || 'https://placehold.co/300x300'
        this.attacks = data.attacks || []
        this.phases = data.phases || [
            { healthThreshold: 1, attackMultiplier: 1, defenseMultiplier: 1 },
            { healthThreshold: 0.5, attackMultiplier: 1.5, defenseMultiplier: 1.2 },
            { healthThreshold: 0.25, attackMultiplier: 2, defenseMultiplier: 0.8 }
        ]
        this.currentPhase = 0
        this.statusEffects = data.statusEffects || []
        this.description = data.description || 'A fearsome boss enemy'
    }
}