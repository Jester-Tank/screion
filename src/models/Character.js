// src/models/Character.js
export class Character {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.maxHealth = data.maxHealth
        this.currentHealth = data.currentHealth || data.maxHealth
        this.attack = data.attack
        this.defense = data.defense || 0
        this.imgUrl = data.imgUrl || 'https://placehold.co/200x200?text=' + data.name
        this.attacks = data.attacks || []
        this.statusEffects = data.statusEffects || []
        this.speed = data.speed || 10
    }
}