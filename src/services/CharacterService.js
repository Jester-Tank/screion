import { AppState } from "../AppState.js"

class CharacterService {
    // ========================================
    // PURE BUSINESS LOGIC METHODS (READ-ONLY)
    // ========================================

    /**
     * Get all characters from AppState (paladins + archers)
     */
    getAllCharacters() {
        return [...AppState.paladins, ...AppState.archers]
    }

    /**
     * Get active character
     */
    getActiveCharacter() {
        return AppState.activeCharacter
    }

    /**
     * Get character by ID from the actual character instances
     */
    getCharacterById(characterId) {
        const allCharacters = this.getAllCharacters()
        return allCharacters.find(char => char.id === characterId)
    }

    /**
     * Get characters by class type
     */
    getCharactersByClass(characterClass) {
        if (characterClass === 'paladin') {
            return AppState.paladins
        } else if (characterClass === 'archer') {
            return AppState.archers
        }
        return []
    }

    /**
     * Get character statistics summary
     */
    getCharacterStats(characterId) {
        const character = this.getCharacterById(characterId)
        if (!character) return null

        return {
            id: character.id,
            name: character.name,
            title: character.title,
            level: character.level,
            maxHealth: character.maxHealth,
            currentHealth: character.currentHealth,
            attack: character.attack,
            defense: character.defense,
            experience: character.experience,
            characterClass: character.characterClass,
            skills: character.skills,
            inventory: character.inventory,
            isActive: character.isActive,
            // Special stats based on class
            ...(character.holyPower && { holyPower: character.holyPower }),
            ...(character.range && { range: character.range })
        }
    }

    /**
     * Get recommended character based on current state
     */
    getRecommendedCharacter() {
        const allCharacters = this.getAllCharacters()
        if (allCharacters.length === 0) return null

        // Return highest level character
        return allCharacters.reduce((prev, current) =>
            (current.level > prev.level) ? current : prev
        )
    }

    /**
     * Calculate character power level
     */
    getCharacterPowerLevel(characterId) {
        const character = this.getCharacterById(characterId)
        if (!character) return 0

        let basePower = character.attack + character.defense + (character.maxHealth / 10)

        // Add level multiplier
        basePower *= (1 + character.level * 0.1)

        // Add class-specific bonuses
        if (character.characterClass === 'paladin' && character.holyPower) {
            basePower += character.holyPower * 0.5
        }
        if (character.characterClass === 'archer' && character.range) {
            basePower += character.range * 2
        }

        return Math.round(basePower)
    }

    /**
     * Get character build suggestions based on actual character
     */
    getCharacterBuildSuggestions(characterId) {
        const character = this.getCharacterById(characterId)
        if (!character) return []

        const suggestions = []

        // Level-based suggestions
        if (character.level < 5) {
            suggestions.push('Focus on basic training to gain experience')
        }

        // Class-specific suggestions
        if (character.characterClass === 'paladin') {
            suggestions.push('Use holy powers for both offense and healing')
            if (character.holyPower < 30) {
                suggestions.push('Work on increasing holy power reserves')
            }
        }

        if (character.characterClass === 'archer') {
            suggestions.push('Maintain distance and use ranged advantages')
            if (character.range < 5) {
                suggestions.push('Improve shooting range through training')
            }
        }

        // General suggestions based on stats
        if (character.attack < character.defense) {
            suggestions.push('Consider focusing on offensive capabilities')
        }
        if (character.currentHealth < character.maxHealth * 0.8) {
            suggestions.push('Rest or heal before major battles')
        }

        return suggestions
    }

    /**
     * Analyze character vs enemy matchup
     */
    analyzeBattleMatchup(characterId, enemyId) {
        const character = this.getCharacterById(characterId)
        const enemy = AppState.bossTemplates?.find(e => e.id === enemyId)

        if (!character || !enemy) return null

        const characterPower = this.getCharacterPowerLevel(characterId)
        const enemyPower = enemy.attack + enemy.defense + (enemy.maxHealth / 10)

        const advantage = characterPower - enemyPower
        let verdict = 'balanced'

        if (advantage > 20) verdict = 'character_favored'
        else if (advantage < -20) verdict = 'enemy_favored'

        return {
            characterPower,
            enemyPower,
            advantage,
            verdict,
            winChance: Math.max(10, Math.min(90, 50 + advantage)),
            suggestions: this.getBattleSuggestions(character, enemy)
        }
    }

    /**
     * Get battle suggestions for character vs enemy
     */
    getBattleSuggestions(character, enemy) {
        const suggestions = []

        // Health comparison
        if (character.currentHealth < character.maxHealth * 0.5) {
            suggestions.push('Heal before engaging in battle')
        }

        // Class-specific tactics
        if (character.characterClass === 'paladin') {
            suggestions.push('Use divine abilities for both damage and healing')
            if (enemy.maxHealth > 200) {
                suggestions.push('This will be a long fight - manage holy power carefully')
            }
        }

        if (character.characterClass === 'archer') {
            suggestions.push('Use range advantage to avoid damage')
            if (enemy.speed > 10) {
                suggestions.push('Enemy is fast - focus on evasive maneuvers')
            }
        }

        // Stat-based suggestions
        if (enemy.defense > character.attack) {
            suggestions.push('Enemy has high defense - consider using special abilities')
        }
        if (enemy.attack > character.defense + 10) {
            suggestions.push('Enemy hits hard - prioritize defensive positioning')
        }

        return suggestions
    }

    /**
     * Get character progression suggestions
     */
    getProgressionSuggestions(characterId) {
        const character = this.getCharacterById(characterId)
        if (!character) return []

        const suggestions = []

        // Experience-based suggestions
        const expToNext = (character.level * 100) - character.experience
        if (expToNext <= 50) {
            suggestions.push(`Close to level up! Need ${expToNext} more experience`)
        }

        // Inventory suggestions
        if (character.inventory.length < 3) {
            suggestions.push('Consider acquiring more equipment')
        }

        // Skill suggestions
        if (character.skills.length < character.level) {
            suggestions.push('You can learn more skills at your current level')
        }

        return suggestions
    }

    /**
     * Get all available character classes
     */
    getAvailableClasses() {
        const classes = new Set()
        this.getAllCharacters().forEach(char => {
            classes.add(char.characterClass)
        })
        return Array.from(classes)
    }

    /**
     * Get characters sorted by power level
     */
    getCharactersByPower() {
        const allCharacters = this.getAllCharacters()
        return allCharacters
            .map(char => ({
                ...char,
                powerLevel: this.getCharacterPowerLevel(char.id)
            }))
            .sort((a, b) => b.powerLevel - a.powerLevel)
    }

    /**
     * Check if character is ready for battle
     */
    isCharacterReady(characterId) {
        const character = this.getCharacterById(characterId)
        if (!character) return false

        return {
            ready: character.currentHealth > character.maxHealth * 0.3,
            issues: [
                ...(character.currentHealth <= character.maxHealth * 0.3 ? ['Low health'] : []),
                ...(character.level < 2 ? ['Low level - consider training'] : []),
                ...(character.inventory.length === 0 ? ['No equipment'] : [])
            ]
        }
    }

    /**
     * Get character comparison between two characters
     */
    compareCharacters(characterId1, characterId2) {
        const char1 = this.getCharacterById(characterId1)
        const char2 = this.getCharacterById(characterId2)

        if (!char1 || !char2) return null

        return {
            character1: {
                name: char1.name,
                powerLevel: this.getCharacterPowerLevel(characterId1),
                strengths: this.getCharacterStrengths(char1),
                weaknesses: this.getCharacterWeaknesses(char1)
            },
            character2: {
                name: char2.name,
                powerLevel: this.getCharacterPowerLevel(characterId2),
                strengths: this.getCharacterStrengths(char2),
                weaknesses: this.getCharacterWeaknesses(char2)
            }
        }
    }

    /**
     * Get character strengths
     */
    getCharacterStrengths(character) {
        const strengths = []

        if (character.attack > 25) strengths.push('High Attack')
        if (character.defense > 15) strengths.push('Good Defense')
        if (character.maxHealth > 100) strengths.push('High Health')
        if (character.level > 5) strengths.push('Experienced')
        if (character.skills?.length > 3) strengths.push('Many Skills')

        return strengths
    }

    /**
     * Get character weaknesses
     */
    getCharacterWeaknesses(character) {
        const weaknesses = []

        if (character.attack < 15) weaknesses.push('Low Attack')
        if (character.defense < 10) weaknesses.push('Low Defense')
        if (character.currentHealth < character.maxHealth * 0.5) weaknesses.push('Injured')
        if (character.level < 3) weaknesses.push('Inexperienced')
        if (!character.inventory?.length) weaknesses.push('No Equipment')

        return weaknesses
    }
}

export const characterService = new CharacterService()