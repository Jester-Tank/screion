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
     * Create a fresh player instance from actual character data for battle
     * @param {string} characterId - The ID of the character template
     * @returns {Player|null} A new player instance ready for battle
     */
    createPlayerInstance(characterId) {
        // First try to find an existing leveled character
        let existingCharacter = null

        if (characterId === 'paladin') {
            // Find the paladin character
            existingCharacter = AppState.paladins.find(p => p.id || p.name)
        } else if (characterId === 'archer') {
            // Find the archer character  
            existingCharacter = AppState.archers.find(a => a.id || a.name)
        }

        // If we found an existing character, use their stats and level
        if (existingCharacter) {
            console.log(`Using existing ${existingCharacter.name} at level ${existingCharacter.level}`)

            // Create battle instance from existing character
            const playerData = {
                id: characterId,
                name: existingCharacter.name,
                characterClass: existingCharacter.characterClass || characterId,
                maxHealth: existingCharacter.maxHealth,
                currentHealth: existingCharacter.maxHealth, // Start with full health for battle
                attack: existingCharacter.attack,
                defense: existingCharacter.defense,
                speed: existingCharacter.speed || 10,
                level: existingCharacter.level,
                imgUrl: existingCharacter.imageUrl || existingCharacter.imgUrl,
                description: existingCharacter.description,
                title: existingCharacter.title,
                holyPower: existingCharacter.holyPower,
                range: existingCharacter.range,
                attacks: this.getCharacterAttacks(characterId, existingCharacter.level),
                items: this.getCharacterItems(characterId, existingCharacter.level),
                statusEffects: []
            }

            const player = new Player(playerData)

            console.log(`Created battle instance for ${player.name}:`, {
                level: player.level,
                health: player.maxHealth,
                attack: player.attack,
                defense: player.defense
            })

            return player
        }

        // Fallback to template system if no existing character found
        const template = this.getCharacterTemplate(characterId)
        if (!template) {
            console.error(`Character template not found: ${characterId}`)
            return null
        }

        // Create from template and apply player level scaling
        const playerData = {
            ...template,
            attacks: template.attacks.map(attack => ({
                ...attack,
                currentCooldown: 0
            })),
            items: template.items.map(item => ({ ...item })),
            statusEffects: []
        }

        const player = new Player(playerData)
        this.applyLevelScaling(player, AppState.playerLevel)

        return player
    }

    /**
     * Get character attacks scaled for their level
     * @param {string} characterId - The character class ID
     * @param {number} characterLevel - The character's current level
     * @returns {Attack[]} Array of scaled attacks
     */
    getCharacterAttacks(characterId, characterLevel) {
        const baseAttacks = this.createCharacterAttacks()
        let characterAttacks = []

        switch (characterId) {
            case 'paladin':
                characterAttacks = [
                    baseAttacks.holyStrike,
                    baseAttacks.divineShield,
                    baseAttacks.smite,
                    baseAttacks.layOnHands
                ]
                break
            case 'archer':
                characterAttacks = [
                    baseAttacks.quickShot,
                    baseAttacks.preciseAim,
                    baseAttacks.multiShot,
                    baseAttacks.evasiveManeuvers
                ]
                break
            case 'knight':
                characterAttacks = [
                    baseAttacks.swordStrike,
                    baseAttacks.shieldBash,
                    baseAttacks.battleCry,
                    baseAttacks.defensiveStance
                ]
                break
            case 'mage':
                characterAttacks = [
                    baseAttacks.fireball,
                    baseAttacks.iceShards,
                    baseAttacks.lightningBolt,
                    baseAttacks.magicalBarrier
                ]
                break
            default:
                characterAttacks = [baseAttacks.holyStrike]
        }

        // Scale attacks based on character level
        const bonusLevels = Math.max(0, characterLevel - 1)
        characterAttacks.forEach(attack => {
            const originalDamage = attack.damage
            const originalHeal = attack.heal
            const originalSelfHeal = attack.selfHeal
            const originalBarrier = attack.barrier

            if (originalDamage > 0) {
                attack.damage = originalDamage + Math.floor(originalDamage * 0.15 * bonusLevels)
            }
            if (originalHeal > 0) {
                attack.heal = originalHeal + Math.floor(originalHeal * 0.15 * bonusLevels)
            }
            if (originalSelfHeal > 0) {
                attack.selfHeal = originalSelfHeal + Math.floor(originalSelfHeal * 0.15 * bonusLevels)
            }
            if (originalBarrier > 0) {
                attack.barrier = originalBarrier + Math.floor(originalBarrier * 0.15 * bonusLevels)
            }
            attack.currentCooldown = 0
        })

        return characterAttacks
    }

    /**
     * Get character items appropriate for their level
     * @param {string} characterId - The character class ID  
     * @param {number} characterLevel - The character's current level
     * @returns {Item[]} Array of items
     */
    getCharacterItems(characterId, characterLevel) {
        const characterItems = this.createCharacterItems()
        let items = []

        // Base items for all characters
        items.push(characterItems.healthPotion)

        // Class-specific items
        switch (characterId) {
            case 'paladin':
                items.push(characterItems.holyWater)
                break
            case 'archer':
                items.push(characterItems.arrowPoison)
                break
            case 'knight':
                items.push(characterItems.strengthPotion)
                break
            case 'mage':
                items.push(characterItems.manaPotion)
                break
        }

        // Add level-based items
        if (characterLevel >= 3) {
            items.push(characterItems.superHealthPotion)
        }
        if (characterLevel >= 5) {
            items.push(characterItems.elixirOfPower)
        }
        if (characterLevel >= 7) {
            items.push(characterItems.phoenixFeather)
        }
        if (characterLevel >= 10) {
            items.push(characterItems.dragonScale)
        }

        return items
    }

    /**
     * Apply level scaling to boost character stats (fallback method)
     * @param {Player} character - The character to boost
     * @param {number} playerLevel - The current player level
     */
    applyLevelScaling(character, playerLevel) {
        const level = Math.max(1, playerLevel)
        const bonusLevels = level - 1 // No bonus at level 1

        if (bonusLevels <= 0) return character

        console.log(`Applying level ${level} scaling to ${character.name} (${bonusLevels} bonus levels)`)

        // Base stats to calculate bonuses from
        const baseHealth = character.maxHealth
        const baseAttack = character.attack
        const baseDefense = character.defense

        // Calculate bonuses based on character class
        let healthMultiplier, attackMultiplier, defenseMultiplier

        switch (character.characterClass) {
            case 'paladin':
                healthMultiplier = 0.15    // +15% HP per level
                attackMultiplier = 0.12    // +12% ATK per level
                defenseMultiplier = 0.18   // +18% DEF per level
                break
            case 'knight':
                healthMultiplier = 0.18    // +18% HP per level (tankiest)
                attackMultiplier = 0.10    // +10% ATK per level
                defenseMultiplier = 0.20   // +20% DEF per level (most defensive)
                break
            case 'mage':
                healthMultiplier = 0.12    // +12% HP per level (squishiest)
                attackMultiplier = 0.18    // +18% ATK per level (highest damage)
                defenseMultiplier = 0.08   // +8% DEF per level (lowest defense)
                break
            case 'archer':
                healthMultiplier = 0.14    // +14% HP per level
                attackMultiplier = 0.15    // +15% ATK per level
                defenseMultiplier = 0.12   // +12% DEF per level
                break
            default:
                healthMultiplier = 0.15
                attackMultiplier = 0.12
                defenseMultiplier = 0.15
        }

        // Apply percentage-based bonuses
        const healthBonus = Math.floor(baseHealth * healthMultiplier * bonusLevels)
        const attackBonus = Math.floor(baseAttack * attackMultiplier * bonusLevels)
        const defenseBonus = Math.floor(baseDefense * defenseMultiplier * bonusLevels)

        character.maxHealth += healthBonus
        character.currentHealth = character.maxHealth // Start with full health
        character.attack += attackBonus
        character.defense += defenseBonus
        character.level = level

        // Enhance attacks based on level
        this.enhanceAttacks(character, bonusLevels)

        // Add more items based on level
        this.addLevelItems(character, level)

        console.log(`${character.name} scaled to level ${level}:`, {
            healthBonus,
            attackBonus,
            defenseBonus,
            finalStats: {
                health: character.maxHealth,
                attack: character.attack,
                defense: character.defense
            }
        })

        return character
    }

    /**
     * Enhance character attacks based on level (fallback method)
     * @param {Player} character - The character whose attacks to enhance
     * @param {number} bonusLevels - Number of bonus levels
     */
    enhanceAttacks(character, bonusLevels) {
        if (bonusLevels <= 0) return

        character.attacks.forEach(attack => {
            const baseDamage = attack.damage
            const baseHeal = attack.heal
            const baseSelfHeal = attack.selfHeal
            const baseBarrier = attack.barrier

            if (baseDamage > 0) {
                // Increase attack damage by 15% per level
                const damageBonus = Math.floor(baseDamage * 0.15 * bonusLevels)
                attack.damage += damageBonus
            }
            if (baseHeal > 0) {
                // Increase healing by 15% per level
                const healBonus = Math.floor(baseHeal * 0.15 * bonusLevels)
                attack.heal += healBonus
            }
            if (baseSelfHeal > 0) {
                // Increase self healing by 15% per level
                const selfHealBonus = Math.floor(baseSelfHeal * 0.15 * bonusLevels)
                attack.selfHeal += selfHealBonus
            }
            if (baseBarrier > 0) {
                // Increase barrier by 15% per level
                const barrierBonus = Math.floor(baseBarrier * 0.15 * bonusLevels)
                attack.barrier += barrierBonus
            }
        })
    }

    /**
     * Add additional items based on level (fallback method)
     * @param {Player} character - The character to give items to
     * @param {number} level - The player level
     */
    addLevelItems(character, level) {
        const characterItems = this.createCharacterItems()

        // Add better potions at higher levels
        if (level >= 3) {
            character.items.push(characterItems.superHealthPotion)
        }

        if (level >= 5) {
            character.items.push(characterItems.elixirOfPower)
        }

        if (level >= 7) {
            character.items.push(characterItems.phoenixFeather)
        }

        if (level >= 10) {
            character.items.push(characterItems.dragonScale)
        }
    }

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
                type: 'health',
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
            }),

            // High-level items
            superHealthPotion: new Item({
                id: 'super-health-potion',
                name: 'Super Health Potion',
                type: 'health',
                value: 80,
                description: 'Restores 80 health points.',
                imgUrl: 'https://placehold.co/100x100?text=Super+HP',
                cost: 150
            }),

            elixirOfPower: new Item({
                id: 'elixir-of-power',
                name: 'Elixir of Power',
                type: 'attack',
                value: 10,
                description: 'Increases attack power by 10.',
                imgUrl: 'https://placehold.co/100x100?text=Power',
                cost: 200
            }),

            phoenixFeather: new Item({
                id: 'phoenix-feather',
                name: 'Phoenix Feather',
                type: 'health',
                value: 120,
                description: 'Restores 120 health and removes all debuffs.',
                imgUrl: 'https://placehold.co/100x100?text=Phoenix',
                cost: 300
            }),

            dragonScale: new Item({
                id: 'dragon-scale',
                name: 'Dragon Scale',
                type: 'defense',
                value: 8,
                description: 'Increases defense by 8 for the entire battle.',
                imgUrl: 'https://placehold.co/100x100?text=Scale',
                cost: 400
            })
        }
    }

    getCharacterTemplate(characterId) {
        return AppState.playerTemplates.find(char => char.id === characterId) || null
    }

    getAvailableCharacters() {
        return AppState.playerTemplates.filter(char =>
            AppState.unlockedCharacters.includes(char.id)
        )
    }

    getAllCharacters() {
        return AppState.playerTemplates
    }

    saveGameData() {
        AppState.saveGameData()
    }

    loadGameData() {
        AppState.loadGameData()
    }
}

export const characterService = new CharacterService()