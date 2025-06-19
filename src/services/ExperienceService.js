// src/services/ExperienceService.js
import { AppState } from "../AppState.js"

class ExperienceService {
    /**
     * Award XP to a character
     * @param {Object} character - The character to award XP to
     * @param {number} xpAmount - Amount of XP to award
     * @param {string} source - Source of XP (battle, training, etc.)
     */
    awardXP(character, xpAmount, source = 'unknown') {
        if (!character || xpAmount <= 0) return false

        console.log(`Awarding ${xpAmount} XP to ${character.name} from ${source}`)

        const oldLevel = character.level
        character.experience += xpAmount

        // Check for level ups
        let leveledUp = false
        while (this.canLevelUp(character)) {
            this.levelUp(character)
            leveledUp = true
        }

        // Save progress
        AppState.saveGameData()

        return {
            xpGained: xpAmount,
            leveledUp,
            oldLevel,
            newLevel: character.level,
            source
        }
    }

    /**
     * Check if a character can level up
     * @param {Object} character - The character to check
     * @returns {boolean} True if can level up
     */
    canLevelUp(character) {
        const totalXPForCurrentLevel = character.getTotalXPForLevel()
        const xpNeededForNext = character.calculateXPNeeded(character.level)
        return character.experience >= (totalXPForCurrentLevel + xpNeededForNext)
    }

    /**
     * Level up a character
     * @param {Object} character - The character to level up
     */
    levelUp(character) {
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

        // Class-specific bonuses
        switch (character.characterClass) {
            case 'paladin':
                return {
                    health: baseGains.health + 4,  // +12 total
                    attack: baseGains.attack + 1,  // +3 total
                    defense: baseGains.defense + 2, // +4 total
                    holyPower: baseGains.holyPower + 2 // +5 total
                }
            case 'knight':
                return {
                    health: baseGains.health + 6,  // +14 total
                    attack: baseGains.attack + 2,  // +4 total
                    defense: baseGains.defense + 3, // +5 total
                }
            case 'archer':
                return {
                    health: baseGains.health + 2,  // +10 total
                    attack: baseGains.attack + 3,  // +5 total
                    defense: baseGains.defense + 1, // +3 total
                }
            case 'mage':
                return {
                    health: baseGains.health,      // +8 total
                    attack: baseGains.attack + 4,  // +6 total
                    defense: baseGains.defense,    // +2 total
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

        // Add skills based on level milestones
        if (character.level === 3 && !character.skills.includes('Enhanced Combat')) {
            newSkills.push('Enhanced Combat')
        }
        if (character.level === 5 && !character.skills.includes('Veteran Fighter')) {
            newSkills.push('Veteran Fighter')
        }
        if (character.level === 7 && !character.skills.includes('Master Warrior')) {
            newSkills.push('Master Warrior')
        }
        if (character.level === 10 && !character.skills.includes('Legendary Hero')) {
            newSkills.push('Legendary Hero')
        }

        // Class-specific skills
        if (character.characterClass === 'paladin') {
            if (character.level === 4 && !character.skills.includes('Divine Favor')) {
                newSkills.push('Divine Favor')
            }
            if (character.level === 8 && !character.skills.includes('Aura of Protection')) {
                newSkills.push('Aura of Protection')
            }
        }

        if (newSkills.length > 0) {
            character.skills = character.skills || []
            character.skills.push(...newSkills)
            console.log(`${character.name} learned new skills:`, newSkills)
        }
    }

    /**
     * Calculate XP reward for defeating an enemy
     * @param {Object} enemy - The defeated enemy
     * @param {Object} player - The player character
     * @returns {number} XP reward
     */
    calculateBattleXP(enemy, player) {
        const baseXP = 25
        const enemyStrength = (enemy.maxHealth || 100) + (enemy.attack || 10) + (enemy.defense || 5)
        const playerStrength = (player.maxHealth || 100) + (player.attack || 10) + (player.defense || 5)

        // More XP for fighting stronger enemies
        const difficultyMultiplier = Math.max(0.5, enemyStrength / playerStrength)

        // Level difference bonus/penalty
        const levelDifference = (enemy.level || 1) - player.level
        const levelMultiplier = Math.max(0.3, 1 + (levelDifference * 0.2))

        return Math.floor(baseXP * difficultyMultiplier * levelMultiplier)
    }

    /**
     * Award training XP
     * @param {Object} character - The character training
     * @returns {Object} Training result
     */
    awardTrainingXP(character) {
        // Training gives modest XP but costs resources
        const baseTrainingXP = 15 + Math.floor(Math.random() * 10) // 15-25 XP
        const trainingCost = character.level * 5 // Cost increases with level

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
}

export const experienceService = new ExperienceService()