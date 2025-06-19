import { Player } from "./Player.js"
import { Attack } from "./Attack.js"

export class Paladin extends Player {
    constructor(data) {
        super(data)
        this.holyPower = data.holyPower || 30
        this.range = null
        this.characterClass = 'paladin'

        if (!data.attacks || data.attacks.length === 0) {
            this.attacks = [
                new Attack({
                    id: 'smite',
                    name: 'Smite',
                    damage: 20,
                    type: 'magical',
                    cooldown: 0,
                    currentCooldown: 0,
                    accuracy: 95,
                    description: 'A righteous strike infused with holy power.'
                }),
                new Attack({
                    id: 'divine-shield',
                    name: 'Divine Shield',
                    damage: 0,
                    type: 'support',
                    cooldown: 3,
                    currentCooldown: 0,
                    barrier: 40,
                    accuracy: 100,
                    description: 'Creates a protective barrier of divine light.'
                }),
                new Attack({
                    id: 'judgment',
                    name: 'Judgment',
                    damage: 35,
                    type: 'magical',
                    cooldown: 4,
                    currentCooldown: 0,
                    accuracy: 90,
                    description: 'Calls down divine wrath upon the enemy.'
                }),
                new Attack({
                    id: 'lay-hands',
                    name: 'Lay on Hands',
                    damage: 0,
                    type: 'support',
                    cooldown: 5,
                    currentCooldown: 0,
                    heal: 50,
                    accuracy: 100,
                    description: 'Channels divine energy to heal wounds.'
                })
            ]
        }
    }

    /**
     * Calculate total XP needed to reach a specific level
     * @param {number} level - Target level (defaults to current level)
     * @returns {number} Total XP needed for that level
     */
    getTotalXPForLevel(level = this.level) {
        if (level <= 1) return 0
        let totalXP = 0
        for (let i = 1; i < level; i++) {
            totalXP += i * 100
        }
        return totalXP
    }

    /**
     * Calculate XP needed for next level
     * @param {number} fromLevel - Starting level (defaults to current level)
     * @returns {number} XP needed for next level
     */
    calculateXPNeeded(fromLevel = this.level) {
        return fromLevel * 100
    }

    /**
     * Get current progress toward next level as percentage
     * @returns {number} Percentage (0-100)
     */
    getXPProgress() {
        const totalForCurrentLevel = this.getTotalXPForLevel(this.level)
        const totalForNextLevel = this.getTotalXPForLevel(this.level + 1)
        const currentLevelXP = this.experience - totalForCurrentLevel
        const neededForNext = totalForNextLevel - totalForCurrentLevel

        if (neededForNext <= 0) return 100
        return Math.min(100, Math.max(0, (currentLevelXP / neededForNext) * 100))
    }
}