// src/services/BossDataService.js
import { AppState } from "../AppState.js"
import { Boss } from "../models/Boss.js"
import { Attack } from "../models/Attack.js"

class BossDataService {
    /**
     * Initialize all boss templates and attacks
     */
    initializeBossData() {
        // Create boss attacks first
        const bossAttacks = this.createBossAttacks()

        // Create boss templates
        const bossTemplates = [
            new Boss({
                id: 'dragon',
                name: 'Ancient Fire Dragon',
                maxHealth: 200,
                currentHealth: 200,
                attack: 25,
                defense: 15,
                speed: 12,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A fearsome ancient dragon with scales like molten rock and breath of pure fire.',
                goldReward: 100,
                attacks: [
                    bossAttacks.fireBreath,
                    bossAttacks.clawStrike,
                    bossAttacks.dragonRoar,
                    bossAttacks.heal
                ],
                phases: [
                    {
                        healthThreshold: 0.5,
                        attackMultiplier: 1.3,
                        defenseMultiplier: 1.1
                    }
                ]
            }),

            new Boss({
                id: 'necromancer',
                name: 'Dark Necromancer Vex',
                maxHealth: 150,
                currentHealth: 150,
                attack: 20,
                defense: 10,
                speed: 15,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A master of dark magic who commands the undead and drains life force.',
                goldReward: 150,
                attacks: [
                    bossAttacks.darkBolt,
                    bossAttacks.lifeDrain,
                    bossAttacks.shadowStun,
                    bossAttacks.necroHeal
                ]
            }),

            new Boss({
                id: 'golem',
                name: 'Stone Titan Golem',
                maxHealth: 300,
                currentHealth: 300,
                attack: 30,
                defense: 25,
                speed: 8,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A massive construct of living stone, nearly indestructible but slow.',
                goldReward: 200,
                attacks: [
                    bossAttacks.stoneFist,
                    bossAttacks.rockThrow,
                    bossAttacks.earthquake,
                    bossAttacks.stoneWall
                ]
            }),

            new Boss({
                id: 'dragon_king',
                name: 'Inferno Dragon King',
                maxHealth: 400,
                currentHealth: 400,
                attack: 35,
                defense: 20,
                speed: 18,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'The most powerful dragon in existence, ruler of all dragonkind.',
                goldReward: 500,
                attacks: [
                    bossAttacks.infernoBlast,
                    bossAttacks.dragonClaw,
                    bossAttacks.meteorStrike,
                    bossAttacks.dragonHeal
                ],
                phases: [
                    {
                        healthThreshold: 0.75,
                        attackMultiplier: 1.2,
                        defenseMultiplier: 1.0
                    },
                    {
                        healthThreshold: 0.5,
                        attackMultiplier: 1.4,
                        defenseMultiplier: 1.1
                    },
                    {
                        healthThreshold: 0.25,
                        attackMultiplier: 1.6,
                        defenseMultiplier: 1.2
                    }
                ]
            }),

            new Boss({
                id: 'shadow_lord',
                name: 'Shadow Lord Malachar',
                maxHealth: 180,
                currentHealth: 180,
                attack: 28,
                defense: 12,
                speed: 20,
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A being of pure darkness who manipulates shadows and fear itself.',
                goldReward: 250,
                attacks: [
                    bossAttacks.shadowSlash,
                    bossAttacks.fearAura,
                    bossAttacks.voidStrike,
                    bossAttacks.shadowHeal
                ]
            })
        ]

        // Set boss templates in AppState
        AppState.bossTemplates = bossTemplates
        console.log('Boss templates initialized:', bossTemplates.length, 'bosses loaded')
    }

    /**
     * Create all boss attacks
     */
    createBossAttacks() {
        return {
            // Dragon attacks
            fireBreath: new Attack({
                id: 'fire-breath',
                name: 'Fire Breath',
                damage: 35,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                burn: true,
                accuracy: 90,
                description: 'Breathes scorching flames that may burn the target.'
            }),

            clawStrike: new Attack({
                id: 'claw-strike',
                name: 'Claw Strike',
                damage: 28,
                type: 'physical',
                cooldown: 1,
                currentCooldown: 0,
                crit: true,
                accuracy: 95,
                description: 'A vicious claw attack with high critical chance.'
            }),

            dragonRoar: new Attack({
                id: 'dragon-roar',
                name: 'Dragon Roar',
                damage: 20,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                stun: true,
                accuracy: 85,
                description: 'A terrifying roar that may stun the opponent.'
            }),

            heal: new Attack({
                id: 'dragon-heal',
                name: 'Ancient Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 40,
                accuracy: 100,
                description: 'Channels ancient magic to restore health.'
            }),

            // Necromancer attacks
            darkBolt: new Attack({
                id: 'dark-bolt',
                name: 'Dark Bolt',
                damage: 25,
                type: 'magical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 90,
                description: 'A bolt of dark energy.'
            }),

            lifeDrain: new Attack({
                id: 'life-drain',
                name: 'Life Drain',
                damage: 22,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                selfHeal: 15,
                accuracy: 85,
                description: 'Drains life force from the target to heal self.'
            }),

            shadowStun: new Attack({
                id: 'shadow-stun',
                name: 'Shadow Binding',
                damage: 15,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                stun: true,
                accuracy: 80,
                description: 'Binds the target in shadows, potentially stunning them.'
            }),

            necroHeal: new Attack({
                id: 'necro-heal',
                name: 'Dark Ritual',
                damage: 0,
                type: 'support',
                cooldown: 6,
                currentCooldown: 0,
                selfHeal: 50,
                accuracy: 100,
                description: 'Performs a dark ritual to restore health.'
            }),

            // Golem attacks
            stoneFist: new Attack({
                id: 'stone-fist',
                name: 'Stone Fist',
                damage: 32,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 85,
                description: 'A crushing blow with a massive stone fist.'
            }),

            rockThrow: new Attack({
                id: 'rock-throw',
                name: 'Rock Throw',
                damage: 28,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                accuracy: 90,
                description: 'Hurls a massive boulder at the target.'
            }),

            earthquake: new Attack({
                id: 'earthquake',
                name: 'Earthquake',
                damage: 25,
                type: 'physical',
                cooldown: 5,
                currentCooldown: 0,
                stun: true,
                accuracy: 95,
                description: 'Shakes the ground violently, potentially stunning the target.'
            }),

            stoneWall: new Attack({
                id: 'stone-wall',
                name: 'Stone Barrier',
                damage: 0,
                type: 'support',
                cooldown: 4,
                currentCooldown: 0,
                selfHeal: 30,
                accuracy: 100,
                description: 'Creates a protective stone barrier.'
            }),

            // Dragon King attacks
            infernoBlast: new Attack({
                id: 'inferno-blast',
                name: 'Inferno Blast',
                damage: 45,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                burn: true,
                accuracy: 85,
                description: 'An explosive blast of infernal flames.'
            }),

            dragonClaw: new Attack({
                id: 'dragon-claw',
                name: 'Royal Dragon Claw',
                damage: 38,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                crit: true,
                accuracy: 90,
                description: 'A devastating claw attack from the Dragon King.'
            }),

            meteorStrike: new Attack({
                id: 'meteor-strike',
                name: 'Meteor Strike',
                damage: 50,
                type: 'magical',
                cooldown: 6,
                currentCooldown: 0,
                accuracy: 80,
                description: 'Calls down a meteor from the heavens.'
            }),

            dragonHeal: new Attack({
                id: 'king-heal',
                name: 'Dragon King Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 60,
                accuracy: 100,
                description: 'The ultimate draconic healing magic.'
            }),

            // Shadow Lord attacks
            shadowSlash: new Attack({
                id: 'shadow-slash',
                name: 'Shadow Slash',
                damage: 30,
                type: 'magical',
                cooldown: 1,
                currentCooldown: 0,
                accuracy: 92,
                description: 'A slash of pure shadow energy.'
            }),

            fearAura: new Attack({
                id: 'fear-aura',
                name: 'Aura of Fear',
                damage: 18,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                slow: true,
                accuracy: 85,
                description: 'Projects an aura of terror that may slow the target.'
            }),

            voidStrike: new Attack({
                id: 'void-strike',
                name: 'Void Strike',
                damage: 35,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                accuracy: 88,
                description: 'Strikes with the power of the void itself.'
            }),

            shadowHeal: new Attack({
                id: 'shadow-heal',
                name: 'Shadow Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 45,
                accuracy: 100,
                description: 'Draws power from shadows to heal.'
            })
        }
    }

    /**
     * Get a boss template by ID
     * @param {string} bossId - The ID of the boss
     * @returns {Boss|null} The boss template or null if not found
     */
    getBossTemplate(bossId) {
        return AppState.bossTemplates.find(boss => boss.id === bossId) || null
    }

    /**
     * Create a fresh boss instance from template for battle
     * @param {string} bossId - The ID of the boss template
     * @returns {Boss|null} A new boss instance ready for battle
     */
    createBossInstance(bossId) {
        const template = this.getBossTemplate(bossId)
        if (!template) {
            console.error(`Boss template not found: ${bossId}`)
            return null
        }

        // Create a deep copy of the boss
        const bossData = {
            ...template,
            currentHealth: template.maxHealth,
            attacks: template.attacks.map(attack => ({
                ...attack,
                currentCooldown: 0
            })),
            phases: template.phases ? [...template.phases] : [],
            currentPhase: 0,
            burning: false,
            statusEffects: []
        }

        return new Boss(bossData)
    }

    /**
     * Get all available bosses (unlocked ones)
     * @returns {Boss[]} Array of available boss templates
     */
    getAvailableBosses() {
        return AppState.bossTemplates.filter(boss =>
            AppState.unlockedEnemies.includes(boss.id)
        )
    }

    /**
     * Get all boss templates
     * @returns {Boss[]} Array of all boss templates
     */
    getAllBosses() {
        return AppState.bossTemplates
    }
}

export const bossDataService = new BossDataService()