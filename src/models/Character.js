export class Character {
    constructor(data) {
        this.id = data.id || Math.random().toString(36).substring(2)
        this.name = data.name || 'Unknown'
        this.maxHealth = data.maxHealth || 100
        this.currentHealth = data.currentHealth || data.health || data.maxHealth || 100
        this.attack = data.attack || 10
        this.defense = data.defense || 5
        this.speed = data.speed || 10
        this.imgUrl = data.imageUrl || data.imgUrl || 'https://placehold.co/200x200?text=Character'
        this.imageUrl = data.imageUrl || data.imgUrl || 'https://placehold.co/200x200?text=Character'
        this.attacks = data.attacks || []
        this.statusEffects = data.statusEffects || []
        this.characterClass = data.characterClass || 'unknown'
    }
}