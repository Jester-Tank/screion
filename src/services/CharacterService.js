// src/services/CharacterService.js
import { AppState } from "../AppState.js"
import { Player } from "../models/Player.js"
import { Attack } from "../models/Attack.js"
import { Item } from "../models/Item.js"

class CharacterService {
    /**
     * Initialize all character templates and their data
     */
    initializeCharacterData() {
        // Create character attacks
        const characterAttacks = this.createCharacterAttacks()

        // Create character items
        const characterItems = this.createCharacterItems()

        // Create character templates
        const playerTemplates = [
            new Player({
                id: 'paladin',
                name: 'Sir Galahad',
                characterClass: 'paladin',
                maxHealth: 120,
                currentHealth: 120,
                attack: 25,
                defense: 20,
                speed: 12,
                level: 1,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A holy warrior blessed with divine power and unwavering faith.',
                title: 'Divine Protector',
                attacks: [
                    characterAttacks.holyStrike,
                    characterAttacks.divineShield,
                    characterAttacks.smite,
                    characterAttacks.layOnHands
                ],
                items: [
                    characterItems.healthPotion,
                    characterItems.holyWater
                ]
            }),

            new Player({
                id: 'knight',
                name: 'Sir Gareth',
                characterClass: 'knight',
                maxHealth: 140,
                currentHealth: 140,
                attack: 30,
                defense: 25,
                speed: 10,
                level: 1,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A heavily armored warrior with unmatched defensive capabilities.',
                title: 'Stalwart Defender',
                attacks: [
                    characterAttacks.swordStrike,
                    characterAttacks.shieldBash,
                    characterAttacks.battleCry,
                    characterAttacks.defensiveStance
                ],
                items: [
                    characterItems.healthPotion,
                    characterItems.strengthPotion
                ]
            }),

            new Player({
                id: 'mage',
                name: 'Eldara the Wise',
                characterClass: 'mage',
                maxHealth: 90,
                currentHealth: 90,
                attack: 35,
                defense: 10,
                speed: 18,
                level: 1,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A master of arcane arts with devastating magical attacks.',
                title: 'Arcane Scholar',
                attacks: [
                    characterAttacks.fireball,
                    characterAttacks.iceShards,
                    characterAttacks.lightningBolt,
                    characterAttacks.magicalBarrier
                ],
                items: [
                    characterItems.manaPotion,
                    characterItems.healthPotion
                ]
            }),

            new Player({
                id: 'archer',
                name: 'Sylvia Swiftbow',
                characterClass: 'archer',
                maxHealth: 100,
                currentHealth: 100,
                attack: 28,
                defense: 15,
                speed: 20,
                level: 1,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A skilled marksman with deadly precision and agility.',
                title: 'Master Archer',
                attacks: [
                    characterAttacks.quickShot,
                    characterAttacks.preciseAim,
                    characterAttacks.multiShot,
                    characterAttacks.evasiveManeuvers
                ],
                items: [
                    characterItems.healthPotion,
                    characterItems.arrowPoison
                ]
            })
        ]

        // Set player templates in AppState
        AppState.setPlayerTemplates(playerTemplates)
        console.log('Character templates initialized:', playerTemplates.length, 'characters loaded')
    }

    /**
     * Create all character attacks
     */
    createCharacterAttacks() {
        return {
            // Paladin attacks
            holyStrike: new Attack({
                id: 'holy-strike',
                name: 'Holy Strike',
                damage: 22,
                type: 'magical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 95,
                description: 'A righteous attack infused with divine power.'
            }),

            divineShield: new Attack({
                id: 'divine-shield',
                name: 'Divine Shield',
                damage: 0,
                type: 'support',
                cooldown: 4,
                currentCooldown: 0,
                barrier: 40,
                accuracy: 100,
                description: 'Creates a protective barrier of holy light.'
            }),

            smite: new Attack({
                id: 'smite',
                name: 'Smite',
                damage: 35,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                accuracy: 90,
                description: 'Calls down divine judgment upon the enemy.'
            }),

            layOnHands: new Attack({
                id: 'lay-on-hands',
                name: 'Lay on Hands',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                heal: 45,
                accuracy: 100,
                description: 'Channels divine energy to heal wounds.'
            }),

            // Knight attacks
            swordStrike: new Attack({
                id: 'sword-strike',
                name: 'Sword Strike',
                damage: 25,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 95,
                description: 'A powerful sword attack.'
            }),

            shieldBash: new Attack({
                id: 'shield-bash',
                name: 'Shield Bash',
                damage: 18,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                stun: true,
                accuracy: 85,
                description: 'Strikes with the shield, potentially stunning the enemy.'
            }),

            battleCry: new Attack({
                id: 'battle-cry',
                name: 'Battle Cry',
                damage: 15,
                type: 'physical',
                cooldown: 4,
                currentCooldown: 0,
                statusEffect: 'weaken',
                statusEffectChance: 60,
                accuracy: 100,
                description: 'A intimidating war cry that may weaken enemies.'
            }),

            defensiveStance: new Attack({
                id: 'defensive-stance',
                name: 'Defensive Stance',
                damage: 0,
                type: 'support',
                cooldown: 3,
                currentCooldown: 0,
                barrier: 30,
                accuracy: 100,
                description: 'Takes a defensive position, reducing incoming damage.'
            }),

            // Mage attacks
            fireball: new Attack({
                id: 'fireball',
                name: 'Fireball',
                damage: 30,
                type: 'magical',
                cooldown: 1,
                currentCooldown: 0,
                burn: true,
                accuracy: 90,
                description: 'Hurls a ball of fire that may burn the target.'
            }),

            iceShards: new Attack({
                id: 'ice-shards',
                name: 'Ice Shards',
                damage: 24,
                type: 'magical',
                cooldown: 2,
                currentCooldown: 0,
                slow: true,
                accuracy: 92,
                description: 'Launches sharp ice projectiles that may slow the enemy.'
            }),

            lightningBolt: new Attack({
                id: 'lightning-bolt',
                name: 'Lightning Bolt',
                damage: 38,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                accuracy: 85,
                description: 'Strikes with a powerful bolt of lightning.'
            }),

            magicalBarrier: new Attack({
                id: 'magical-barrier',
                name: 'Magical Barrier',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                barrier: 50,
                accuracy: 100,
                description: 'Creates a protective magical barrier.'
            }),

            // Archer attacks
            quickShot: new Attack({
                id: 'quick-shot',
                name: 'Quick Shot',
                damage: 20,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 98,
                description: 'A fast, accurate arrow shot.'
            }),

            preciseAim: new Attack({
                id: 'precise-aim',
                name: 'Precise Aim',
                damage: 28,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                crit: true,
                accuracy: 95,
                description: 'A carefully aimed shot with high critical chance.'
            }),

            multiShot: new Attack({
                id: 'multi-shot',
                name: 'Multi Shot',
                damage: 18,
                type: 'physical',
                cooldown: 3,
                currentCooldown: 0,
                multi: 3,
                accuracy: 80,
                description: 'Fires multiple arrows at once.'
            }),

            evasiveManeuvers: new Attack({
                id: 'evasive-maneuvers',
                name: 'Evasive Maneuvers',
                damage: 12,
                type: 'physical',
                cooldown: 4,
                currentCooldown: 0,
                dodge: true,
                accuracy: 100,
                description: 'Performs evasive moves while counterattacking.'
            })
        }
    }

    /**
     * Create character items
     */
    createCharacterItems() {
        return {
            healthPotion: new Item({
                id: 'health-potion',
                name: 'Health Potion',
                type: 'health',
                value: 40,
                description: 'Restores 40 health points.',
                imgUrl: 'https://placehold.co/100x100?text=Health',
                cost: 50
            }),

            holyWater: new Item({
                id: 'holy-water',
                name: 'Holy Water',
                type: 'cleanse',
                value: 0,
                description: 'Removes all status effects.',
                imgUrl: 'https://placehold.co/100x100?text=Holy',
                cost: 75
            }),

            strengthPotion: new Item({
                id: 'strength-potion',
                name: 'Strength Potion',
                type: 'attack',
                value: 5,
                description: 'Increases attack power by 5.',
                imgUrl: 'https://placehold.co/100x100?text=Strength',
                cost: 100
            }),

            manaPotion: new Item({
                id: 'mana-potion',
                name: 'Mana Potion',
                type: 'heal',
                value: 30,
                description: 'Restores 30 health and removes burn effects.',
                imgUrl: 'https://placehold.co/100x100?text=Mana',
                cost: 60
            }),

            arrowPoison: new Item({
                id: 'arrow-poison',
                name: 'Poison Arrows',
                type: 'attack',
                value: 3,
                description: 'Increases attack by 3 and may poison enemies.',
                imgUrl: 'https://placehold.co/100x100?text=Poison',
                cost: 80
            })
        }
    }

    /**
     * Get a character template by ID
     * @param {string} characterId - The ID of the character
     * @returns {Player|null} The character template or null if not found
     */
    getCharacterTemplate(characterId) {
        return AppState.playerTemplates.find(char => char.id === characterId) || null
    }

    /**
     * Create a fresh player instance from template for battle
     * @param {string} characterId - The ID of the character template
     * @returns {Player|null} A new player instance ready for battle
     */
    createPlayerInstance(characterId) {
        const template = this.getCharacterTemplate(characterId)
        if (!template) {
            console.error(`Character template not found: ${characterId}`)
            return null
        }

        // Create a deep copy of the character
        const playerData = {
            ...template,
            currentHealth: template.maxHealth,
            attacks: template.attacks.map(attack => ({
                ...attack,
                currentCooldown: 0
            })),
            items: template.items.map(item => ({ ...item })),
            statusEffects: []
        }

        return new Player(playerData)
    }

    /**
     * Get all available characters (unlocked ones)
     * @returns {Player[]} Array of available character templates
     */
    getAvailableCharacters() {
        return AppState.playerTemplates.filter(char =>
            AppState.unlockedCharacters.includes(char.id)
        )
    }

    /**
     * Get all character templates
     * @returns {Player[]} Array of all character templates
     */
    getAllCharacters() {
        return AppState.playerTemplates
    }

    /**
     * Save game data to localStorage
     */
    saveGameData() {
        AppState.saveGameData()
    }

    /**
     * Load game data from localStorage
     */
    loadGameData() {
        AppState.loadGameData()
    }
}

export const characterService = new CharacterService()