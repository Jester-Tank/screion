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
        this.characterClass = 'boss'

        // Boss level for XP calculation (defaults based on difficulty)
        this.level = data.level || this.calculateBossLevel()

        // Boss difficulty tier (affects XP rewards)
        this.tier = data.tier || this.calculateTier()
    }

    /**
     * Calculate boss level based on stats for XP rewards
     * @returns {number} Estimated boss level
     */
    calculateBossLevel() {
        // Calculate level based on total stats
        const totalStats = this.maxHealth + (this.attack * 3) + (this.defense * 2)

        // Boss level tiers based on total stats
        if (totalStats < 200) return 1        // Weak boss
        if (totalStats < 300) return 3        // Normal boss  
        if (totalStats < 450) return 5        // Strong boss
        if (totalStats < 650) return 8        // Elite boss
        if (totalStats < 900) return 12       // Legendary boss
        return 15                             // Mythic boss
    }

    /**
     * Calculate boss tier for XP multipliers
     * @returns {string} Boss tier
     */
    calculateTier() {
        if (this.level <= 2) return 'Minor'
        if (this.level <= 5) return 'Normal'
        if (this.level <= 8) return 'Elite'
        if (this.level <= 12) return 'Legendary'
        return 'Mythic'
    }

    /**
     * Get boss difficulty description
     * @returns {string} Difficulty description
     */
    getDifficultyDescription() {
        const descriptions = {
            'Minor': 'A lesser threat, suitable for beginners',
            'Normal': 'A standard challenge requiring some skill',
            'Elite': 'A formidable opponent demanding strategy',
            'Legendary': 'An exceptional challenge for experienced heroes',
            'Mythic': 'The ultimate test of heroic prowess'
        }
        return descriptions[this.tier] || 'An unknown threat'
    }

    /**
     * Get estimated XP reward (for display purposes)
     * @param {Object} playerLevel - Player level for calculation
     * @returns {number} Estimated XP reward
     */
    getEstimatedXPReward(playerLevel = 1) {
        // Simplified XP calculation for display
        const baseXP = 50 + this.level * 25
        const levelDiff = this.level - playerLevel
        const levelMultiplier = Math.max(0.5, 1 + (levelDiff * 0.15))
        const bossMultiplier = 2.0 // Bosses give double XP

        return Math.floor(baseXP * levelMultiplier * bossMultiplier)
    }

    /**
     * Get recommended player level
     * @returns {number} Recommended player level
     */
    getRecommendedLevel() {
        // Recommend player level slightly below boss level
        return Math.max(1, this.level - 1)
    }

    /**
     * Check if boss is too difficult for player
     * @param {number} playerLevel - Player's current level
     * @returns {boolean} True if boss is significantly harder
     */
    isTooHard(playerLevel) {
        return this.level > playerLevel + 3
    }

    /**
     * Check if boss is too easy for player
     * @param {number} playerLevel - Player's current level
     * @returns {boolean} True if boss is significantly easier
     */
    isTooEasy(playerLevel) {
        return this.level < playerLevel - 3
    }

    /**
     * Get difficulty indicator for UI
     * @param {number} playerLevel - Player's current level
     * @returns {Object} Difficulty info with color and text
     */
    getDifficultyIndicator(playerLevel) {
        const levelDiff = this.level - playerLevel

        if (levelDiff >= 4) {
            return { color: 'danger', text: 'Extremely Hard', icon: '💀' }
        } else if (levelDiff >= 2) {
            return { color: 'warning', text: 'Very Hard', icon: '⚠️' }
        } else if (levelDiff >= 0) {
            return { color: 'info', text: 'Challenging', icon: '⚔️' }
        } else if (levelDiff >= -2) {
            return { color: 'success', text: 'Manageable', icon: '✅' }
        } else {
            return { color: 'secondary', text: 'Easy', icon: '😴' }
        }
    }
}