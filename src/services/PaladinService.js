import { AppState } from "../AppState.js"
import { Paladin } from "../models/Paladin.js"

class PaladinService {
    createPaladin(paladinData) {
        const newPaladin = new Paladin(paladinData)
        AppState.paladins.push(newPaladin)
        return newPaladin
    }

    getPaladinById(paladinId) {
        const paladin = AppState.paladins.find(p => p.id === paladinId)
        return paladin
    }

    getAllPaladins() {
        return AppState.paladins
    }

    setActivePaladin(paladinId) {
        // Clear all active characters
        AppState.paladins.forEach(paladin => paladin.isActive = false)
        AppState.archers.forEach(archer => archer.isActive = false)

        // Set the selected paladin to active
        const paladin = this.getPaladinById(paladinId)
        if (paladin) {
            paladin.isActive = true
            AppState.activeCharacter = paladin
        }
        return AppState.activeCharacter
    }

    levelUpPaladin(paladinId) {
        const paladin = this.getPaladinById(paladinId)
        if (paladin && paladin.experience >= paladin.level * 100) {
            paladin.level++
            paladin.maxHealth += 12
            paladin.currentHealth = paladin.maxHealth // Restore health on level up
            paladin.attack += 4
            paladin.defense += 4
            paladin.holyPower += 5
            paladin.experience = 0

            // Add new skill every 3 levels
            if (paladin.level % 3 === 0) {
                const newSkills = ['Divine Strike', 'Lay on Hands', 'Aura of Protection', 'Holy Shield', 'Divine Judgment']
                const newSkillIndex = Math.floor(paladin.level / 3) - 1
                if (newSkillIndex < newSkills.length) {
                    paladin.skills.push(newSkills[newSkillIndex])
                }
            }

            return true
        }
        return false
    }

    addExperience(paladinId, amount) {
        const paladin = this.getPaladinById(paladinId)
        if (paladin) {
            paladin.experience += amount
            // Check if paladin can level up
            this.levelUpPaladin(paladinId)
        }
    }

    healAlly(paladinId, targetCharacterId) {
        const paladin = this.getPaladinById(paladinId)
        if (!paladin || paladin.holyPower < 10) return false

        let targetCharacter = null
        // Find the target character (could be any character type)
        if (AppState.paladins.find(p => p.id === targetCharacterId)) {
            targetCharacter = AppState.paladins.find(p => p.id === targetCharacterId)
        } else if (AppState.archers.find(a => a.id === targetCharacterId)) {
            targetCharacter = AppState.archers.find(a => a.id === targetCharacterId)
        }

        if (targetCharacter) {
            paladin.holyPower -= 10
            const healAmount = 5 + Math.floor(paladin.level * 2)
            targetCharacter.currentHealth = Math.min(targetCharacter.maxHealth, targetCharacter.currentHealth + healAmount)
            return healAmount
        }

        return false
    }
}

export const paladinService = new PaladinService()