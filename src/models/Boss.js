// src/models/Boss.js
import { Character } from "./Character.js"

export class Boss extends Character {
    constructor(data) {
        super(data)
        this.description = data.description || ''
        this.goldReward = data.goldReward || 50
        this.attackChance = data.attackChance || 0.7
        this.burning = data.burning || false
        this.currentPhase = data.currentPhase || 0
        this.phases = data.phases || []
    }
}