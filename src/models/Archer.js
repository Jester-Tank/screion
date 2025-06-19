import { Player } from "./Player.js"
import { Attack } from "./Attack.js"

export class Archer extends Player {
    constructor(data) {
        super(data)
        this.range = data.range || 4
        this.holyPower = null
        this.characterClass = 'archer'

        if (!data.attacks || data.attacks.length === 0) {
            this.attacks = [
                new Attack({
                    id: 'quick-shot',
                    name: 'Quick Shot',
                    damage: 22,
                    type: 'physical',
                    cooldown: 0,
                    currentCooldown: 0,
                    accuracy: 98,
                    description: 'A fast, accurate arrow shot.'
                }),
                new Attack({
                    id: 'precise-aim',
                    name: 'Precise Aim',
                    damage: 28,
                    type: 'physical',
                    cooldown: 2,
                    currentCooldown: 0,
                    crit: true,
                    accuracy: 95,
                    description: 'A carefully aimed shot with high critical chance.'
                }),
                new Attack({
                    id: 'barrage',
                    name: 'Barrage',
                    damage: 18,
                    type: 'physical',
                    cooldown: 3,
                    currentCooldown: 0,
                    multi: 3,
                    accuracy: 80,
                    description: 'Fires multiple arrows in rapid succession.'
                }),
                new Attack({
                    id: 'evade',
                    name: 'Evade',
                    damage: 0,
                    type: 'support',
                    cooldown: 4,
                    currentCooldown: 0,
                    dodge: true,
                    accuracy: 100,
                    description: 'Performs evasive maneuvers to avoid damage.'
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