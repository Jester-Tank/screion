import { Player } from "./Player.js"

export class Paladin extends Player {
    constructor(data) {
        super(data)
        this.holyPower = data.holyPower || 30
        this.range = null
        this.characterClass = 'paladin'

        if (!data.attacks || data.attacks.length === 0) {
            this.attacks = [
                { id: 'smite', name: 'Smite', damage: 20, type: 'magical', cooldown: 0 },
                { id: 'divine-shield', name: 'Divine Shield', damage: 0, type: 'support', cooldown: 3, barrier: 40 },
                { id: 'judgment', name: 'Judgment', damage: 35, type: 'magical', cooldown: 4 },
                { id: 'lay-hands', name: 'Lay on Hands', damage: 0, type: 'support', cooldown: 5, heal: 50 }
            ]
        }
    }
}