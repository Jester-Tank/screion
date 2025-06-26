import { Character } from "./Character.js"
import { experienceService } from "../services/ExperienceService.js"

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
        return experienceService.getXPRequiredForLevel(level)
    }

    /**
     * Calculate XP needed for next level
     * @param {number} fromLevel - Starting level (defaults to current level)
     * @returns {number} XP needed for next level
     */
    calculateXPNeeded(fromLevel = this.level) {
        return experienceService.getXPForNextLevel(this)
    }

    /**
     * Get current progress toward next level as percentage
     * @returns {number} Percentage (0-100)
     */
    getXPProgress() {
        return experienceService.getXPProgress(this)
    }

    /**
     * Check if the player can level up
     * @returns {boolean} True if can level up
     */
    canLevelUp() {
        return experienceService.canLevelUp(this)
    }

    /**
     * Get current XP progress for the current level
     * @returns {number} Current XP in this level
     */
    getCurrentLevelXP() {
        return experienceService.getCurrentLevelXP(this)
    }

    /**
     * Get XP needed for next level from current position
     * @returns {number} XP needed for next level
     */
    getXPNeededForNext() {
        return experienceService.getXPForNextLevel(this)
    }

    /**
     * Check if at max level
     * @returns {boolean} True if at max level
     */
    isMaxLevel() {
        return experienceService.isMaxLevel(this)
    }

    /**
     * Get max level
     * @returns {number} Maximum possible level
     */
    getMaxLevel() {
        return experienceService.getMaxLevel()
    }
}