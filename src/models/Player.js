// src/models/Player.js
import { Character } from "./Character.js"

export class Player extends Character {
    constructor(data) {
        super(data)
        this.exp = data.exp || 0
        this.experience = data.experience || data.exp || 0 // Support both exp and experience
        this.level = data.level || 1
        this.items = data.items || []
        this.inventory = data.inventory || data.items || []
        this.title = data.title || ''
        this.description = data.description || ''
        this.skills = data.skills || []
        this.isActive = data.isActive || false
        this.characterClass = data.characterClass || 'player'
    }
}