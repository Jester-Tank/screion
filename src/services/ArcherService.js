import { AppState } from "../AppState.js"
import { Archer } from "../models/Archer.js"

class ArcherService {
    createArcher(archerData) {
        const newArcher = new Archer(archerData)
        AppState.archers.push(newArcher)
        return newArcher
    }

    getArcherById(archerId) {
        const archer = AppState.archers.find(a => a.id === archerId)
        return archer
    }

    getAllArchers() {
        return AppState.archers
    }

    setActiveArcher(archerId) {
        // Clear all active characters
        AppState.paladins.forEach(paladin => paladin.isActive = false)
        AppState.archers.forEach(archer => archer.isActive = false)

        // Set the selected archer to active
        const archer = this.getArcherById(archerId)
        if (archer) {
            archer.isActive = true
            AppState.activeCharacter = archer
        }
        return AppState.activeCharacter
    }

    levelUpArcher(archerId) {
        const archer = this.getArcherById(archerId)
        if (archer && archer.experience >= archer.level * 100) {
            archer.level++
            archer.health += 8
            archer.attack += 6
            archer.defense += 2
            archer.range += 0.5  // Increase range slightly with level
            archer.experience = 0

            // Add new skill every 3 levels
            if (archer.level % 3 === 0) {
                const newSkills = ['Rapid Fire', 'Snipe', 'Evasive Roll', 'Poison Arrow', 'Eagle Eye']
                const newSkillIndex = Math.floor(archer.level / 3) - 1
                if (newSkillIndex < newSkills.length) {
                    archer.skills.push(newSkills[newSkillIndex])
                }
            }

            return true
        }
        return false
    }

    addExperience(archerId, amount) {
        const archer = this.getArcherById(archerId)
        if (archer) {
            archer.experience += amount
            // Check if archer can level up
            this.levelUpArcher(archerId)
        }
    }
}

export const archerService = new ArcherService()