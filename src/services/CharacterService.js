// src/services/CharacterService.js
import { AppState } from "../AppState.js"
import { Player } from "../models/Player.js"
import { Attack } from "../models/Attack.js"

class CharacterService {
    constructor() {
        // Initialize character templates when service is created
        this.initializeCharacterTemplates()
    }

    initializeCharacterTemplates() {
        const characters = [
            {
                id: 'knight',
                name: 'Knight',
                maxHealth: 150,
                attack: 15,
                defense: 10,
                speed: 10,
                imgUrl: 'https://placehold.co/200x200?text=Knight',
                attacks: [
                    { id: 'slash', name: 'Slash', damage: 20, type: 'physical', cooldown: 0 },
                    { id: 'shield-bash', name: 'Shield Bash', damage: 15, type: 'physical', stun: true, cooldown: 2 },
                    { id: 'heavy-blow', name: 'Heavy Blow', damage: 30, type: 'physical', cooldown: 3 },
                    { id: 'rally', name: 'Rally', damage: 0, type: 'support', heal: 25, cooldown: 4 }
                ]
            },
            {
                id: 'mage',
                name: 'Mage',
                maxHealth: 120,
                attack: 20,
                defense: 5,
                speed: 12,
                imgUrl: 'https://placehold.co/200x200?text=Mage',
                attacks: [
                    { id: 'fireball', name: 'Fireball', damage: 25, type: 'magical', burn: true, cooldown: 0 },
                    { id: 'ice-shard', name: 'Ice Shard', damage: 20, type: 'magical', slow: true, cooldown: 2 },
                    { id: 'arcane-blast', name: 'Arcane Blast', damage: 35, type: 'magical', cooldown: 3 },
                    { id: 'heal', name: 'Heal', damage: 0, type: 'support', heal: 30, cooldown: 4 }
                ]
            },
            {
                id: 'archer',
                name: 'Archer',
                maxHealth: 130,
                attack: 18,
                defense: 6,
                speed: 15,
                imgUrl: 'https://placehold.co/200x200?text=Archer',
                attacks: [
                    { id: 'quick-shot', name: 'Quick Shot', damage: 22, type: 'physical', cooldown: 0 },
                    { id: 'precise-aim', name: 'Precise Aim', damage: 28, type: 'physical', cooldown: 2, crit: true },
                    { id: 'barrage', name: 'Barrage', damage: 18, type: 'physical', cooldown: 3, multi: 3 },
                    { id: 'evade', name: 'Evade', damage: 0, type: 'support', cooldown: 4, dodge: true }
                ]
            },
            {
                id: 'paladin',
                name: 'Paladin',
                maxHealth: 180,
                attack: 14,
                defense: 12,
                speed: 8,
                imgUrl: 'https://placehold.co/200x200?text=Paladin',
                attacks: [
                    { id: 'smite', name: 'Smite', damage: 20, type: 'magical', cooldown: 0 },
                    { id: 'divine-shield', name: 'Divine Shield', damage: 0, type: 'support', cooldown: 3, barrier: 40 },
                    { id: 'judgment', name: 'Judgment', damage: 35, type: 'magical', cooldown: 4 },
                    { id: 'lay-hands', name: 'Lay on Hands', damage: 0, type: 'support', cooldown: 5, heal: 50 }
                ]
            }
        ]

        // Convert plain objects to Player instances with Attack instances
        AppState.playerTemplates = characters.map(char => {
            const player = new Player(char)
            player.attacks = char.attacks.map(attack => new Attack(attack))
            return player
        })
    }

    // Character selection
    selectHero(id) {
        console.log('Selecting hero:', id)
        AppState.selectedHero = id
    }

    // Character unlocking
    unlockCharacter(id) {
        const cost = AppState.characterCosts[id]
        if (AppState.gold >= cost) {
            AppState.gold -= cost
            AppState.unlockedCharacters.push(id)
            this.saveGameData()
            return true
        }
        return false
    }

    // Get characters that are available for selection
    getFilteredCharacters() {
        return AppState.playerTemplates.filter(c => AppState.unlockedCharacters.includes(c.id))
    }

    // Get characters that need to be unlocked
    getLockedCharacters() {
        return AppState.playerTemplates.filter(c => !AppState.unlockedCharacters.includes(c.id))
    }

    // Save game progress to localStorage
    saveGameData() {
        const gameData = {
            gold: AppState.gold,
            playerLevel: AppState.playerLevel,
            unlockedCharacters: AppState.unlockedCharacters,
            unlockedEnemies: AppState.unlockedEnemies,
            defeatedBosses: AppState.defeatedBosses || [],
            highestLevel: AppState.highestLevel || 1,
            totalGoldEarned: AppState.totalGoldEarned || 0
        }
        localStorage.setItem('bossBattleData', JSON.stringify(gameData))
    }

    // Load game progress from localStorage
    loadGameData() {
        const savedData = localStorage.getItem('bossBattleData')
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData)
                AppState.gold = gameData.gold || 0
                AppState.playerLevel = gameData.playerLevel || 1
                AppState.unlockedCharacters = gameData.unlockedCharacters || ['knight']
                AppState.unlockedEnemies = gameData.unlockedEnemies || ['dragon']
                AppState.defeatedBosses = gameData.defeatedBosses || []
                AppState.highestLevel = gameData.highestLevel || 1
                AppState.totalGoldEarned = gameData.totalGoldEarned || 0
            } catch (error) {
                console.error('Error loading game data:', error)
                // If data is corrupted, use defaults
                this.resetProgress()
            }
        }
    }

    // Reset all game progress
    resetProgress() {
        AppState.gold = 0
        AppState.playerLevel = 1
        AppState.unlockedCharacters = ['knight']
        AppState.unlockedEnemies = ['dragon']
        AppState.defeatedBosses = []
        AppState.highestLevel = 1
        AppState.totalGoldEarned = 0
        this.saveGameData()
        return 'Progress has been reset.'
    }
}

export const characterService = new CharacterService()