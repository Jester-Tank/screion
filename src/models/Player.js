export class Player {
    constructor(data) {
        this.id = data.id || Math.random().toString(36).substring(2)
        this.name = data.name
        this.maxHealth = data.maxHealth || 100
        this.currentHealth = data.currentHealth || this.maxHealth
        this.attack = data.attack || 10
        this.defense = data.defense || 5
        this.speed = data.speed || 5
        this.level = data.level || 1
        this.exp = data.exp || 0
        this.imgUrl = data.imgUrl || 'https://placehold.co/200x200'
        this.attacks = data.attacks || []
        this.items = data.items || []
        this.statusEffects = data.statusEffects || []
    }
}