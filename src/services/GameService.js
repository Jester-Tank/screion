import { AppState } from "../AppState.js"
import { Paladin } from "../models/Paladin.js"
import { Archer } from "../models/Archer.js"

class GameService {
    getAllCharacters() {
        return [...AppState.paladins, ...AppState.archers]
    }

    getActiveCharacter() {
        return AppState.activeCharacter
    }

    getCharacterById(characterId) {
        // Search in both character collections
        let character = AppState.paladins.find(p => p.id === characterId)
        if (!character) {
            character = AppState.archers.find(a => a.id === characterId)
        }
        return character
    }

    clearActiveCharacter() {
        // Clear all active flags
        AppState.paladins.forEach(p => p.isActive = false)
        AppState.archers.forEach(a => a.isActive = false)
        AppState.activeCharacter = null
    }

    randomEncounter() {
        if (!AppState.activeCharacter) return null

        const enemies = [
            { name: 'Goblin', health: 30, attack: 8, xpReward: 25 },
            { name: 'Orc Warrior', health: 50, attack: 12, xpReward: 40 },
            { name: 'Dark Elf Assassin', health: 35, attack: 15, xpReward: 45 },
            { name: 'Forest Troll', health: 60, attack: 10, xpReward: 50 },
            { name: 'Skeleton Archer', health: 25, attack: 13, xpReward: 35 }
        ]

        // Choose a random enemy
        const enemy = enemies[Math.floor(Math.random() * enemies.length)]

        return enemy
    }

    createCharacter(type, characterData) {
        let newCharacter

        if (type.toLowerCase() === 'paladin') {
            newCharacter = new Paladin(characterData)
            AppState.paladins.push(newCharacter)
        } else if (type.toLowerCase() === 'archer') {
            newCharacter = new Archer(characterData)
            AppState.archers.push(newCharacter)
        } else {
            throw new Error(`Invalid character type: ${type}`)
        }

        return newCharacter
    }
}

export const gameService = new GameService()