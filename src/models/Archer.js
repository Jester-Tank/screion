// src/models/Archer.js
import { Player } from "./Player.js"

export class Archer extends Player {
    constructor(data) {
        super(data)
        this.range = data.range || 4
        this.characterClass = 'archer'

        // Default archer attacks if none provided
        if (!data.attacks || data.attacks.length === 0) {
            this.attacks = [
                { id: 'quick-shot', name: 'Quick Shot', damage: 22, type: 'physical', cooldown: 0 },
                { id: 'precise-aim', name: 'Precise Aim', damage: 28, type: 'physical', cooldown: 2, crit: true },
                { id: 'barrage', name: 'Barrage', damage: 18, type: 'physical', cooldown: 3, multi: 3 },
                { id: 'evade', name: 'Evade', damage: 0, type: 'support', cooldown: 4, dodge: true }
            ]
        }
    }
}