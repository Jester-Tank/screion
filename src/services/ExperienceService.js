// src/services/ExperienceService.js
import { AppState } from "../AppState.js"

class ExperienceService {
    constructor() {
        // Maximum level characters can reach
        this.MAX_LEVEL = 20

        // XP requirements scale exponentially
        this.BASE_XP_REQUIREMENT = 100
        this.XP_MULTIPLIER = 1.2
    }

    /**
     * Award XP to a character
     * @param {Object} character - The character to award XP to
     * @param {number} xpAmount - Amount of XP to award
     * @param {string} source - Source of XP (battle, training, etc.)
     */
    awardXP(character, xpAmount, source = 'unknown') {
        if (!character || xpAmount <= 0) return false

        // Check if character is already at max level
        if (character.level >= this.MAX_LEVEL) {
            console.log(`${character.name} is already at max level ${this.MAX_LEVEL}!`)
            return {
                xpGained: 0,
                leveledUp: false,
                oldLevel: character.level,
                newLevel: character.level,
                source,
                maxLevel: true
            }
        }

        console.log(`Awarding ${xpAmount} XP to ${character.name} from ${source}`)

        const oldLevel = character.level
        character.experience += xpAmount

        // Check for level ups (but respect max level)
        let leveledUp = false
        let levelsGained = 0

        while (this.canLevelUp(character) && character.level < this.MAX_LEVEL) {
            this.levelUp(character)
            leveledUp = true
            levelsGained++
        }

        // Save progress
        AppState.saveGameData()

        return {
            xpGained: xpAmount,
            leveledUp,
            levelsGained,
            oldLevel,
            newLevel: character.level,
            source,
            maxLevel: character.level >= this.MAX_LEVEL
        }
    }

    /**
     * Check if a character can level up
     * @param {Object} character - The character to check
     * @returns {boolean} True if can level up
     */
    canLevelUp(character) {
        if (character.level >= this.MAX_LEVEL) return false

        const xpNeeded = this.getXPRequiredForLevel(character.level + 1)
        return character.experience >= xpNeeded
    }

    /**
     * Calculate total XP required to reach a specific level
     * @param {number} targetLevel - The level to calculate XP for
     * @returns {number} Total XP needed
     */
    getXPRequiredForLevel(targetLevel) {
        if (targetLevel <= 1) return 0

        let totalXP = 0
        for (let level = 2; level <= targetLevel; level++) {
            totalXP += Math.floor(this.BASE_XP_REQUIREMENT * Math.pow(this.XP_MULTIPLIER, level - 2))
        }
        return totalXP
    }

    /**
     * Get XP needed for next level from current XP
     * @param {Object} character - The character
     * @returns {number} XP needed for next level
     */
    getXPForNextLevel(character) {
        if (character.level >= this.MAX_LEVEL) return 0

        const currentTotal = this.getXPRequiredForLevel(character.level)
        const nextTotal = this.getXPRequiredForLevel(character.level + 1)
        const currentProgress = character.experience - currentTotal
        const needed = nextTotal - currentTotal

        return Math.max(0, needed - currentProgress)
    }

    /**
     * Get current XP progress in current level
     * @param {Object} character - The character
     * @returns {number} Current XP in this level
     */
    getCurrentLevelXP(character) {
        const totalForLevel = this.getXPRequiredForLevel(character.level)
        return Math.max(0, character.experience - totalForLevel)
    }

    /**
     * Get XP progress as percentage
     * @param {Object} character - The character
     * @returns {number} Percentage (0-100)
     */
    getXPProgress(character) {
        if (character.level >= this.MAX_LEVEL) return 100

        const currentLevelXP = this.getCurrentLevelXP(character)
        const nextLevelXP = this.getXPRequiredForLevel(character.level + 1) - this.getXPRequiredForLevel(character.level)

        return nextLevelXP > 0 ? (currentLevelXP / nextLevelXP) * 100 : 0
    }

    /**
     * Level up a character
     * @param {Object} character - The character to level up
     */
    levelUp(character) {
        if (character.level >= this.MAX_LEVEL) return false

        const oldLevel = character.level
        character.level++

        // Calculate stat increases based on class
        const statGains = this.getStatGains(character)

        character.maxHealth += statGains.health
        character.currentHealth = character.maxHealth // Full heal on level up
        character.attack += statGains.attack
        character.defense += statGains.defense

        // Special class bonuses
        if (character.holyPower !== undefined) {
            character.holyPower += statGains.holyPower || 5
        }

        console.log(`${character.name} leveled up! ${oldLevel} -> ${character.level}`, {
            healthGain: statGains.health,
            attackGain: statGains.attack,
            defenseGain: statGains.defense
        })

        // Learn new skills every few levels
        this.checkForNewSkills(character)

        return true
    }

    /**
     * Get stat gains for level up based on character class
     * @param {Object} character - The character
     * @returns {Object} Stat gains
     */
    getStatGains(character) {
        const baseGains = {
            health: 8,
            attack: 2,
            defense: 2,
            holyPower: 3
        }

        // Higher level characters get slightly better gains
        const levelBonus = Math.floor(character.level / 5)

        // Class-specific bonuses
        switch (character.characterClass) {
            case 'paladin':
                return {
                    health: baseGains.health + 4 + levelBonus,  // +12-14 total
                    attack: baseGains.attack + 1,              // +3 total
                    defense: baseGains.defense + 2 + levelBonus, // +4-6 total
                    holyPower: baseGains.holyPower + 2         // +5 total
                }
            case 'knight':
                return {
                    health: baseGains.health + 6 + levelBonus,  // +14-16 total
                    attack: baseGains.attack + 2,              // +4 total
                    defense: baseGains.defense + 3 + levelBonus, // +5-7 total
                }
            case 'archer':
                return {
                    health: baseGains.health + 2,              // +10 total
                    attack: baseGains.attack + 3 + levelBonus, // +5-7 total
                    defense: baseGains.defense + 1,            // +3 total
                }
            case 'mage':
                return {
                    health: baseGains.health,                  // +8 total
                    attack: baseGains.attack + 4 + levelBonus, // +6-8 total
                    defense: baseGains.defense,                // +2 total
                }
            default:
                return baseGains
        }
    }

    /**
     * Check if character learns new skills
     * @param {Object} character - The character
     */
    checkForNewSkills(character) {
        const newSkills = []

        // Universal skills based on level
        if (character.level === 5 && !character.skills.includes('Veteran Fighter')) {
            newSkills.push('Veteran Fighter')
        }
        if (character.level === 10 && !character.skills.includes('Master Warrior')) {
            newSkills.push('Master Warrior')
        }
        if (character.level === 15 && !character.skills.includes('Legendary Hero')) {
            newSkills.push('Legendary Hero')
        }
        if (character.level === 20 && !character.skills.includes('Mythic Champion')) {
            newSkills.push('Mythic Champion')
        }

        // Class-specific skills
        if (character.characterClass === 'paladin') {
            if (character.level === 3 && !character.skills.includes('Divine Favor')) {
                newSkills.push('Divine Favor')
            }
            if (character.level === 7 && !character.skills.includes('Aura of Protection')) {
                newSkills.push('Aura of Protection')
            }
            if (character.level === 12 && !character.skills.includes('Divine Wrath')) {
                newSkills.push('Divine Wrath')
            }
        }

        if (character.characterClass === 'archer') {
            if (character.level === 3 && !character.skills.includes('Eagle Eye')) {
                newSkills.push('Eagle Eye')
            }
            if (character.level === 7 && !character.skills.includes('Rapid Fire')) {
                newSkills.push('Rapid Fire')
            }
            if (character.level === 12 && !character.skills.includes('Master Archer')) {
                newSkills.push('Master Archer')
            }
        }

        if (newSkills.length > 0) {
            character.skills = character.skills || []
            character.skills.push(...newSkills)
            console.log(`${character.name} learned new skills:`, newSkills)
        }
    }

    /**
     * Calculate XP reward for defeating an enemy based on difficulty
     * @param {Object} enemy - The defeated enemy
     * @param {Object} player - The player character
     * @returns {number} XP reward
     */
    calculateBattleXP(enemy, player) {
        // Base XP scales with enemy difficulty
        const baseXP = 50 + (enemy.level || 1) * 25

        // Enemy strength calculation
        const enemyStrength = (enemy.maxHealth || 100) + (enemy.attack || 10) * 2 + (enemy.defense || 5)
        const playerStrength = (player.maxHealth || 100) + (player.attack || 10) * 2 + (player.defense || 5)

        // More XP for fighting stronger enemies
        const difficultyMultiplier = Math.max(0.5, Math.min(3.0, enemyStrength / playerStrength))

        // Level difference bonus/penalty
        const enemyLevel = enemy.level || 1
        const levelDifference = enemyLevel - player.level
        const levelMultiplier = Math.max(0.3, 1 + (levelDifference * 0.15))

        // Boss bonus
        const bossMultiplier = enemy.characterClass === 'boss' ? 2.0 : 1.0

        const finalXP = Math.floor(baseXP * difficultyMultiplier * levelMultiplier * bossMultiplier)

        console.log(`XP Calculation for ${enemy.name}:`, {
            baseXP,
            difficultyMultiplier: difficultyMultiplier.toFixed(2),
            levelMultiplier: levelMultiplier.toFixed(2),
            bossMultiplier,
            finalXP
        })

        return finalXP
    }

    /**
     * Award training XP (limited to prevent abuse)
     * @param {Object} character - The character training
     * @returns {Object} Training result
     */
    awardTrainingXP(character) {
        if (character.level >= this.MAX_LEVEL) {
            return {
                success: false,
                message: `${character.name} is already at maximum level!`,
                maxLevel: true
            }
        }

        // Training gives modest XP but costs resources
        const baseTrainingXP = 20 + Math.floor(Math.random() * 15) // 20-35 XP
        const trainingCost = Math.floor(character.level * 8) // Cost increases with level

        if (AppState.gold < trainingCost) {
            return { success: false, message: 'Not enough gold for training!' }
        }

        AppState.spendGold(trainingCost)
        const result = this.awardXP(character, baseTrainingXP, 'training')

        return {
            success: true,
            ...result,
            goldSpent: trainingCost,
            message: `${character.name} trained and gained ${baseTrainingXP} XP!`
        }
    }

    /**
     * Get max level
     * @returns {number} Maximum level
     */
    getMaxLevel() {
        return this.MAX_LEVEL
    }

    /**
     * Check if character is at max level
     * @param {Object} character - The character to check
     * @returns {boolean} True if at max level
     */
    isMaxLevel(character) {
        return character.level >= this.MAX_LEVEL
    }
}

export const experienceService = new ExperienceService()