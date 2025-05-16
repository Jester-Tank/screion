// src/services/EnemyService.js
import { AppState } from "../AppState.js"
import { Boss } from "../models/Boss.js"
import { Attack } from "../models/Attack.js"
import { characterService } from "./CharacterService.js"

class EnemyService {
    constructor() {
        // Initialize enemy templates when service is created
        this.initializeEnemyTemplates()
    }

    initializeEnemyTemplates() {
        const enemies = [
            {
                id: 'dragon',
                name: 'Ancient Dragon',
                maxHealth: 200,
                attack: 12,
                defense: 8,
                speed: 8,
                description: 'A fearsome dragon with fire breath and thick scales',
                imgUrl: 'https://placehold.co/200x200?text=Dragon',
                attackChance: 0.7,
                goldReward: 50,
                phases: [
                    { healthThreshold: 0.5, attackMultiplier: 1.2, defenseMultiplier: 0.9 }
                ],
                attacks: [
                    { id: 'claw', name: 'Dragon Claw', damage: 15, type: 'physical', cooldown: 0, accuracy: 90 },
                    { id: 'breath', name: 'Fire Breath', damage: 25, type: 'magical', cooldown: 3, statusEffect: 'burn', statusEffectChance: 60 }
                ],
                statusEffects: []
            },
            {
                id: 'necromancer',
                name: 'Dark Necromancer',
                maxHealth: 180,
                attack: 15,
                defense: 5,
                speed: 10,
                description: 'A sinister spellcaster with command over the dead',
                imgUrl: 'https://placehold.co/200x200?text=Necromancer',
                attackChance: 0.8,
                goldReward: 100,
                phases: [
                    { healthThreshold: 0.5, attackMultiplier: 1.3, defenseMultiplier: 0.8 }
                ],
                attacks: [
                    { id: 'shadow', name: 'Shadow Bolt', damage: 18, type: 'magical', cooldown: 0, accuracy: 95 },
                    { id: 'drain', name: 'Life Drain', damage: 15, type: 'magical', cooldown: 2, selfHeal: 10 }
                ],
                statusEffects: []
            },
            {
                id: 'golem',
                name: 'Stone Golem',
                maxHealth: 300,
                attack: 18,
                defense: 15,
                speed: 5,
                description: 'A massive construct of animated stone with incredible defense',
                imgUrl: 'https://placehold.co/200x200?text=Golem',
                attackChance: 0.65,
                goldReward: 200,
                phases: [
                    { healthThreshold: 0.3, attackMultiplier: 1.5, defenseMultiplier: 0.7 }
                ],
                attacks: [
                    { id: 'smash', name: 'Stone Smash', damage: 25, type: 'physical', cooldown: 0, accuracy: 80 },
                    { id: 'slam', name: 'Ground Slam', damage: 20, type: 'physical', cooldown: 3, statusEffect: 'stun', statusEffectChance: 40 }
                ],
                statusEffects: []
            },
            {
                id: 'dragon_king',
                name: 'Dragon King',
                maxHealth: 400,
                attack: 25,
                defense: 12,
                speed: 12,
                description: 'The legendary king of all dragons, wielding ancient power',
                imgUrl: 'https://placehold.co/200x200?text=DragonKing',
                attackChance: 0.75,
                goldReward: 500,
                phases: [
                    { healthThreshold: 0.7, attackMultiplier: 1.2, defenseMultiplier: 1.0 },
                    { healthThreshold: 0.3, attackMultiplier: 1.5, defenseMultiplier: 0.8 }
                ],
                attacks: [
                    { id: 'roar', name: 'Terrifying Roar', damage: 20, type: 'magical', cooldown: 0, accuracy: 95 },
                    { id: 'inferno', name: 'Inferno', damage: 35, type: 'magical', cooldown: 4, statusEffect: 'burn', statusEffectChance: 80 }
                ],
                statusEffects: []
            }
        ]

        // Convert plain objects to Boss instances with Attack instances
        AppState.bossTemplates = enemies.map(enemy => {
            const boss = new Boss(enemy)
            boss.attacks = enemy.attacks.map(attack => new Attack(attack))
            return boss
        })
    }

    // Enemy selection
    selectEnemy(id) {
        console.log('Selecting enemy:', id)
        AppState.selectedEnemy = id
    }

    // Enemy unlocking
    unlockEnemy(id) {
        const cost = AppState.enemyCosts[id]
        if (AppState.gold >= cost) {
            AppState.gold -= cost
            AppState.unlockedEnemies.push(id)
            characterService.saveGameData()
            return true
        }
        return false
    }

    // Get enemies that are available for selection
    getFilteredEnemies() {
        return AppState.bossTemplates.filter(e => AppState.unlockedEnemies.includes(e.id))
    }

    // Get enemies that need to be unlocked
    getLockedEnemies() {
        return AppState.bossTemplates.filter(e => !AppState.unlockedEnemies.includes(e.id))
    }

    // Record when an enemy is defeated
    recordDefeat(enemyId) {
        if (!AppState.defeatedBosses) {
            AppState.defeatedBosses = []
        }

        if (!AppState.defeatedBosses.includes(enemyId)) {
            AppState.defeatedBosses.push(enemyId)
            characterService.saveGameData()
        }
    }

    // Get enemy by ID
    getEnemyById(id) {
        return AppState.bossTemplates.find(e => e.id === id)
    }
}

export const enemyService = new EnemyService()