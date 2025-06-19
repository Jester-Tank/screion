import { Character } from "./Character.js"

export class Player extends Character {
    constructor(data) {
        super(data)
        this.exp = data.exp || 0
        this.experience = data.experience || data.exp || 0
        this.level = data.level || 1
        this.items = data.items || []
        this.inventory = data.inventory || data.items || []
        this.title = data.title || ''
        this.description = data.description || ''
        this.skills = data.skills || []
        this.isActive = data.isActive || false
        this.characterClass = data.characterClass || 'player'
    }

    /**
     * Calculate total XP needed to reach a specific level
     * @param {number} level - Target level (defaults to current level)
     * @returns {number} Total XP needed for that level
     */
    getTotalXPForLevel(level = this.level) {
        if (level <= 1) return 0
        // XP required: Level 1->2 = 100, Level 2->3 = 200, Level 3->4 = 300, etc.
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

    /**
     * Check if the player can level up
     * @returns {boolean} True if can level up
     */
    canLevelUp() {
        const neededForNext = this.getTotalXPForLevel(this.level + 1)
        return this.experience >= neededForNext
    }

    /**
     * Get current XP progress for the current level
     * @returns {number} Current XP in this level
     */
    getCurrentLevelXP() {
        const totalForCurrentLevel = this.getTotalXPForLevel(this.level)
        return Math.max(0, this.experience - totalForCurrentLevel)
    }

    /**
     * Get XP needed for next level from current position
     * @returns {number} XP needed for next level
     */
    getXPNeededForNext() {
        const totalForNext = this.getTotalXPForLevel(this.level + 1)
        return Math.max(0, totalForNext - this.experience)
    }
}