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

        // Create boss templates from easy to legendary
        const bossTemplates = [
            // ==== EASY BOSSES (Level 1-3) ====
            new Boss({
                id: 'giant_rat',
                name: 'Giant Rat',
                maxHealth: 80,
                currentHealth: 80,
                attack: 12,
                defense: 5,
                speed: 15,
                level: 1,
                tier: 'Easy',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A large, aggressive rodent with sharp teeth. Perfect for new adventurers.',
                goldReward: 25,
                attacks: [
                    bossAttacks.bite,
                    bossAttacks.scratch,
                    bossAttacks.squeak
                ]
            }),

            new Boss({
                id: 'forest_spider',
                name: 'Forest Spider',
                maxHealth: 100,
                currentHealth: 100,
                attack: 15,
                defense: 8,
                speed: 18,
                level: 2,
                tier: 'Easy',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A venomous spider that lurks in the deep woods.',
                goldReward: 40,
                attacks: [
                    bossAttacks.venomBite,
                    bossAttacks.webShot,
                    bossAttacks.leap
                ]
            }),

            new Boss({
                id: 'bandit_leader',
                name: 'Bandit Leader',
                maxHealth: 120,
                currentHealth: 120,
                attack: 18,
                defense: 12,
                speed: 14,
                level: 3,
                tier: 'Easy',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A cunning outlaw who terrorizes travelers on forest roads.',
                goldReward: 60,
                attacks: [
                    bossAttacks.swordSlash,
                    bossAttacks.dirtyFighting,
                    bossAttacks.bandage
                ]
            }),

            // ==== MEDIUM BOSSES (Level 4-6) ====
            new Boss({
                id: 'orc_warrior',
                name: 'Orc Warrior',
                maxHealth: 180,
                currentHealth: 180,
                attack: 22,
                defense: 15,
                speed: 12,
                level: 4,
                tier: 'Medium',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A brutal orc warrior wielding a massive club.',
                goldReward: 80,
                attacks: [
                    bossAttacks.clubSmash,
                    bossAttacks.battleRage,
                    bossAttacks.intimidate
                ]
            }),

            new Boss({
                id: 'ice_elemental',
                name: 'Ice Elemental',
                maxHealth: 160,
                currentHealth: 160,
                attack: 25,
                defense: 10,
                speed: 16,
                level: 5,
                tier: 'Medium',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A being of pure ice that freezes everything in its path.',
                goldReward: 100,
                attacks: [
                    bossAttacks.iceShard,
                    bossAttacks.frostBreath,
                    bossAttacks.freeze,
                    bossAttacks.iceArmor
                ]
            }),

            new Boss({
                id: 'troll_shaman',
                name: 'Troll Shaman',
                maxHealth: 200,
                currentHealth: 200,
                attack: 20,
                defense: 18,
                speed: 10,
                level: 6,
                tier: 'Medium',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A mystical troll that commands nature magic and regeneration.',
                goldReward: 120,
                attacks: [
                    bossAttacks.natureStrike,
                    bossAttacks.regeneration,
                    bossAttacks.entangle,
                    bossAttacks.healingTotem
                ]
            }),

            // ==== HARD BOSSES (Level 7-10) ====
            new Boss({
                id: 'dragon',
                name: 'Ancient Fire Dragon',
                maxHealth: 280,
                currentHealth: 280,
                attack: 30,
                defense: 20,
                speed: 12,
                level: 8,
                tier: 'Hard',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A fearsome ancient dragon with scales like molten rock and breath of pure fire.',
                goldReward: 200,
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
                maxHealth: 220,
                currentHealth: 220,
                attack: 28,
                defense: 15,
                speed: 15,
                level: 9,
                tier: 'Hard',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A master of dark magic who commands the undead and drains life force.',
                goldReward: 250,
                attacks: [
                    bossAttacks.darkBolt,
                    bossAttacks.lifeDrain,
                    bossAttacks.shadowStun,
                    bossAttacks.necroHeal,
                    bossAttacks.summonUndead
                ]
            }),

            new Boss({
                id: 'demon_lord',
                name: 'Lesser Demon Lord',
                maxHealth: 320,
                currentHealth: 320,
                attack: 35,
                defense: 22,
                speed: 14,
                level: 10,
                tier: 'Hard',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A powerful demon from the underworld, wreathed in hellfire.',
                goldReward: 300,
                attacks: [
                    bossAttacks.hellfire,
                    bossAttacks.demonClaw,
                    bossAttacks.fearAura,
                    bossAttacks.demonHeal
                ],
                phases: [
                    {
                        healthThreshold: 0.4,
                        attackMultiplier: 1.4,
                        defenseMultiplier: 0.9
                    }
                ]
            }),

            // ==== EXTREME BOSSES (Level 11-15) ====
            new Boss({
                id: 'golem',
                name: 'Stone Titan Golem',
                maxHealth: 450,
                currentHealth: 450,
                attack: 32,
                defense: 30,
                speed: 8,
                level: 12,
                tier: 'Extreme',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A massive construct of living stone, nearly indestructible but slow.',
                goldReward: 400,
                attacks: [
                    bossAttacks.stoneFist,
                    bossAttacks.rockThrow,
                    bossAttacks.earthquake,
                    bossAttacks.stoneWall,
                    bossAttacks.golemRage
                ]
            }),

            new Boss({
                id: 'shadow_lord',
                name: 'Shadow Lord Malachar',
                maxHealth: 380,
                currentHealth: 380,
                attack: 40,
                defense: 18,
                speed: 20,
                level: 13,
                tier: 'Extreme',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'A being of pure darkness who manipulates shadows and fear itself.',
                goldReward: 450,
                attacks: [
                    bossAttacks.shadowSlash,
                    bossAttacks.fearAura,
                    bossAttacks.voidStrike,
                    bossAttacks.shadowHeal,
                    bossAttacks.shadowClone
                ],
                phases: [
                    {
                        healthThreshold: 0.6,
                        attackMultiplier: 1.2,
                        defenseMultiplier: 1.0
                    },
                    {
                        healthThreshold: 0.3,
                        attackMultiplier: 1.5,
                        defenseMultiplier: 0.8
                    }
                ]
            }),

            new Boss({
                id: 'lich_king',
                name: 'The Lich King',
                maxHealth: 500,
                currentHealth: 500,
                attack: 38,
                defense: 25,
                speed: 16,
                level: 15,
                tier: 'Extreme',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'An undead sorcerer-king of immense power, master of death magic.',
                goldReward: 600,
                attacks: [
                    bossAttacks.deathRay,
                    bossAttacks.soulDrain,
                    bossAttacks.undeadArmy,
                    bossAttacks.lichHeal,
                    bossAttacks.timeFreeze
                ],
                phases: [
                    {
                        healthThreshold: 0.75,
                        attackMultiplier: 1.1,
                        defenseMultiplier: 1.0
                    },
                    {
                        healthThreshold: 0.5,
                        attackMultiplier: 1.3,
                        defenseMultiplier: 1.1
                    },
                    {
                        healthThreshold: 0.25,
                        attackMultiplier: 1.6,
                        defenseMultiplier: 1.2
                    }
                ]
            }),

            // ==== LEGENDARY BOSSES (Level 16-20) ====
            new Boss({
                id: 'dragon_king',
                name: 'Inferno Dragon King',
                maxHealth: 600,
                currentHealth: 600,
                attack: 45,
                defense: 28,
                speed: 18,
                level: 18,
                tier: 'Legendary',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'The most powerful dragon in existence, ruler of all dragonkind.',
                goldReward: 800,
                attacks: [
                    bossAttacks.infernoBlast,
                    bossAttacks.dragonClaw,
                    bossAttacks.meteorStrike,
                    bossAttacks.dragonHeal,
                    bossAttacks.apocalypseFlame
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
                id: 'void_emperor',
                name: 'Void Emperor Azathoth',
                maxHealth: 750,
                currentHealth: 750,
                attack: 50,
                defense: 32,
                speed: 22,
                level: 20,
                tier: 'Legendary',
                imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
                description: 'An entity from beyond reality itself, wielding the power of the void.',
                goldReward: 1200,
                attacks: [
                    bossAttacks.voidBlast,
                    bossAttacks.realityTear,
                    bossAttacks.cosmicHorror,
                    bossAttacks.voidHeal,
                    bossAttacks.dimensionalRift
                ],
                phases: [
                    {
                        healthThreshold: 0.8,
                        attackMultiplier: 1.1,
                        defenseMultiplier: 1.0
                    },
                    {
                        healthThreshold: 0.6,
                        attackMultiplier: 1.3,
                        defenseMultiplier: 1.1
                    },
                    {
                        healthThreshold: 0.4,
                        attackMultiplier: 1.5,
                        defenseMultiplier: 1.2
                    },
                    {
                        healthThreshold: 0.2,
                        attackMultiplier: 2.0,
                        defenseMultiplier: 1.3
                    }
                ]
            })
        ]

        // Set boss templates in AppState
        AppState.bossTemplates = bossTemplates
        console.log('Boss templates initialized:', bossTemplates.length, 'bosses loaded')
    }

    /**
     * Create all boss attacks (existing + new ones)
     */
    createBossAttacks() {
        return {
            // ==== EASY BOSS ATTACKS ====
            bite: new Attack({
                id: 'bite',
                name: 'Bite',
                damage: 15,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 95,
                description: 'A simple but effective bite attack.'
            }),

            scratch: new Attack({
                id: 'scratch',
                name: 'Scratch',
                damage: 12,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 98,
                description: 'Quick scratching attacks.'
            }),

            squeak: new Attack({
                id: 'squeak',
                name: 'Intimidating Squeak',
                damage: 8,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                statusEffect: 'weaken',
                statusEffectChance: 30,
                accuracy: 100,
                description: 'A surprisingly intimidating sound.'
            }),

            venomBite: new Attack({
                id: 'venom-bite',
                name: 'Venom Bite',
                damage: 18,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                statusEffect: 'poison',
                statusEffectChance: 60,
                accuracy: 90,
                description: 'A bite that injects venom.'
            }),

            webShot: new Attack({
                id: 'web-shot',
                name: 'Web Shot',
                damage: 10,
                type: 'physical',
                cooldown: 3,
                currentCooldown: 0,
                slow: true,
                accuracy: 85,
                description: 'Shoots sticky webs to slow enemies.'
            }),

            leap: new Attack({
                id: 'leap',
                name: 'Leap Attack',
                damage: 22,
                type: 'physical',
                cooldown: 4,
                currentCooldown: 0,
                accuracy: 80,
                description: 'Leaps at the enemy with surprising force.'
            }),

            swordSlash: new Attack({
                id: 'sword-slash',
                name: 'Sword Slash',
                damage: 20,
                type: 'physical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 92,
                description: 'A basic sword attack.'
            }),

            dirtyFighting: new Attack({
                id: 'dirty-fighting',
                name: 'Dirty Fighting',
                damage: 16,
                type: 'physical',
                cooldown: 2,
                currentCooldown: 0,
                statusEffect: 'stun',
                statusEffectChance: 40,
                accuracy: 88,
                description: 'Fights dirty with sand in the eyes.'
            }),

            bandage: new Attack({
                id: 'bandage',
                name: 'Quick Bandage',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 25,
                accuracy: 100,
                description: 'Quickly bandages wounds.'
            }),

            // ==== MEDIUM BOSS ATTACKS ====
            clubSmash: new Attack({
                id: 'club-smash',
                name: 'Club Smash',
                damage: 28,
                type: 'physical',
                cooldown: 1,
                currentCooldown: 0,
                accuracy: 85,
                description: 'A devastating club attack.'
            }),

            battleRage: new Attack({
                id: 'battle-rage',
                name: 'Battle Rage',
                damage: 35,
                type: 'physical',
                cooldown: 4,
                currentCooldown: 0,
                accuracy: 90,
                description: 'Enters a berserker rage, dealing massive damage.'
            }),

            intimidate: new Attack({
                id: 'intimidate',
                name: 'Intimidate',
                damage: 10,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                statusEffect: 'weaken',
                statusEffectChance: 70,
                accuracy: 100,
                description: 'Intimidates the enemy, reducing their effectiveness.'
            }),

            iceShard: new Attack({
                id: 'ice-shard',
                name: 'Ice Shard',
                damage: 24,
                type: 'magical',
                cooldown: 0,
                currentCooldown: 0,
                accuracy: 90,
                description: 'Hurls sharp ice projectiles.'
            }),

            frostBreath: new Attack({
                id: 'frost-breath',
                name: 'Frost Breath',
                damage: 30,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                slow: true,
                accuracy: 85,
                description: 'Breathes freezing air that slows enemies.'
            }),

            freeze: new Attack({
                id: 'freeze',
                name: 'Freeze',
                damage: 20,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                stun: true,
                accuracy: 75,
                description: 'Attempts to freeze the enemy solid.'
            }),

            iceArmor: new Attack({
                id: 'ice-armor',
                name: 'Ice Armor',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 30,
                accuracy: 100,
                description: 'Creates protective ice armor.'
            }),

            natureStrike: new Attack({
                id: 'nature-strike',
                name: 'Nature Strike',
                damage: 26,
                type: 'magical',
                cooldown: 1,
                currentCooldown: 0,
                accuracy: 88,
                description: 'Channels the power of nature.'
            }),

            regeneration: new Attack({
                id: 'regeneration',
                name: 'Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 3,
                currentCooldown: 0,
                selfHeal: 40,
                accuracy: 100,
                description: 'Rapidly heals wounds using troll regeneration.'
            }),

            entangle: new Attack({
                id: 'entangle',
                name: 'Entangle',
                damage: 15,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                stun: true,
                accuracy: 80,
                description: 'Summons vines to entangle the enemy.'
            }),

            healingTotem: new Attack({
                id: 'healing-totem',
                name: 'Healing Totem',
                damage: 0,
                type: 'support',
                cooldown: 6,
                currentCooldown: 0,
                selfHeal: 60,
                accuracy: 100,
                description: 'Places a totem that provides healing.'
            }),

            // ==== HARD BOSS ATTACKS (existing) ====
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

            summonUndead: new Attack({
                id: 'summon-undead',
                name: 'Summon Undead',
                damage: 30,
                type: 'magical',
                cooldown: 5,
                currentCooldown: 0,
                accuracy: 85,
                description: 'Summons undead minions to attack.'
            }),

            hellfire: new Attack({
                id: 'hellfire',
                name: 'Hellfire',
                damage: 40,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                burn: true,
                accuracy: 85,
                description: 'Calls forth flames from the underworld.'
            }),

            demonClaw: new Attack({
                id: 'demon-claw',
                name: 'Demon Claw',
                damage: 35,
                type: 'physical',
                cooldown: 1,
                currentCooldown: 0,
                crit: true,
                accuracy: 90,
                description: 'Razor-sharp claws infused with demonic power.'
            }),

            fearAura: new Attack({
                id: 'fear-aura',
                name: 'Aura of Fear',
                damage: 18,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                slow: true,
                accuracy: 85,
                description: 'Projects an aura of terror that may slow the target.'
            }),

            demonHeal: new Attack({
                id: 'demon-heal',
                name: 'Demonic Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 55,
                accuracy: 100,
                description: 'Draws power from the underworld to heal.'
            }),

            // ==== EXTREME BOSS ATTACKS ====
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

            golemRage: new Attack({
                id: 'golem-rage',
                name: 'Golem Rage',
                damage: 50,
                type: 'physical',
                cooldown: 6,
                currentCooldown: 0,
                accuracy: 80,
                description: 'Enters a destructive rage, dealing massive damage.'
            }),

            shadowSlash: new Attack({
                id: 'shadow-slash',
                name: 'Shadow Slash',
                damage: 35,
                type: 'magical',
                cooldown: 1,
                currentCooldown: 0,
                accuracy: 92,
                description: 'A slash of pure shadow energy.'
            }),

            voidStrike: new Attack({
                id: 'void-strike',
                name: 'Void Strike',
                damage: 42,
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
            }),

            shadowClone: new Attack({
                id: 'shadow-clone',
                name: 'Shadow Clone',
                damage: 30,
                type: 'magical',
                cooldown: 7,
                currentCooldown: 0,
                multi: 2,
                accuracy: 85,
                description: 'Creates shadow clones that attack simultaneously.'
            }),

            deathRay: new Attack({
                id: 'death-ray',
                name: 'Death Ray',
                damage: 45,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                accuracy: 85,
                description: 'A beam of pure death energy.'
            }),

            soulDrain: new Attack({
                id: 'soul-drain',
                name: 'Soul Drain',
                damage: 35,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                selfHeal: 25,
                accuracy: 90,
                description: 'Drains the soul to heal and weaken the enemy.'
            }),

            undeadArmy: new Attack({
                id: 'undead-army',
                name: 'Raise Undead Army',
                damage: 40,
                type: 'magical',
                cooldown: 6,
                currentCooldown: 0,
                multi: 3,
                accuracy: 80,
                description: 'Raises an army of undead to attack.'
            }),

            lichHeal: new Attack({
                id: 'lich-heal',
                name: 'Lich Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 5,
                currentCooldown: 0,
                selfHeal: 70,
                accuracy: 100,
                description: 'Channels undead energy to heal.'
            }),

            timeFreeze: new Attack({
                id: 'time-freeze',
                name: 'Time Freeze',
                damage: 25,
                type: 'magical',
                cooldown: 8,
                currentCooldown: 0,
                stun: true,
                accuracy: 75,
                description: 'Freezes time around the enemy.'
            }),

            // ==== LEGENDARY BOSS ATTACKS ====
            infernoBlast: new Attack({
                id: 'inferno-blast',
                name: 'Inferno Blast',
                damage: 50,
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
                damage: 45,
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
                damage: 60,
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
                selfHeal: 80,
                accuracy: 100,
                description: 'The ultimate draconic healing magic.'
            }),

            apocalypseFlame: new Attack({
                id: 'apocalypse-flame',
                name: 'Apocalypse Flame',
                damage: 75,
                type: 'magical',
                cooldown: 8,
                currentCooldown: 0,
                burn: true,
                accuracy: 75,
                description: 'Flames that could end the world itself.'
            }),

            voidBlast: new Attack({
                id: 'void-blast',
                name: 'Void Blast',
                damage: 55,
                type: 'magical',
                cooldown: 3,
                currentCooldown: 0,
                accuracy: 85,
                description: 'A blast of pure nothingness.'
            }),

            realityTear: new Attack({
                id: 'reality-tear',
                name: 'Reality Tear',
                damage: 65,
                type: 'magical',
                cooldown: 5,
                currentCooldown: 0,
                accuracy: 80,
                description: 'Tears a hole in reality itself.'
            }),

            cosmicHorror: new Attack({
                id: 'cosmic-horror',
                name: 'Cosmic Horror',
                damage: 40,
                type: 'magical',
                cooldown: 4,
                currentCooldown: 0,
                stun: true,
                slow: true,
                accuracy: 85,
                description: 'Reveals cosmic truths that terrify the mind.'
            }),

            voidHeal: new Attack({
                id: 'void-heal',
                name: 'Void Regeneration',
                damage: 0,
                type: 'support',
                cooldown: 4,
                currentCooldown: 0,
                selfHeal: 100,
                accuracy: 100,
                description: 'Draws energy from the void to heal.'
            }),

            dimensionalRift: new Attack({
                id: 'dimensional-rift',
                name: 'Dimensional Rift',
                damage: 80,
                type: 'magical',
                cooldown: 10,
                currentCooldown: 0,
                accuracy: 70,
                description: 'Opens a rift to another dimension, dealing catastrophic damage.'
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
     * Get bosses by difficulty tier
     * @param {string} tier - The difficulty tier ('Easy', 'Medium', 'Hard', 'Extreme', 'Legendary')
     * @returns {Boss[]} Array of bosses in that tier
     */
    getBossesByTier(tier) {
        return AppState.bossTemplates.filter(boss => boss.tier === tier)
    }

    /**
     * Get bosses appropriate for player level
     * @param {number} playerLevel - The player's current level
     * @returns {Boss[]} Array of appropriate bosses
     */
    getBossesForLevel(playerLevel) {
        return AppState.bossTemplates.filter(boss => {
            const levelDiff = Math.abs(boss.level - playerLevel)
            return levelDiff <= 3 // Bosses within 3 levels
        })
    }

    /**
     * Get next unlockable boss based on player progress
     * @returns {Boss|null} The next boss that should be unlocked
     */
    getNextUnlockableBoss() {
        const unlockedBosses = AppState.unlockedEnemies
        const allBosses = AppState.bossTemplates.sort((a, b) => a.level - b.level)

        return allBosses.find(boss => !unlockedBosses.includes(boss.id)) || null
    }

    /**
     * Get all boss templates
     * @returns {Boss[]} Array of all boss templates
     */
    getAllBosses() {
        return AppState.bossTemplates
    }

    /**
     * Get boss difficulty description
     * @param {Boss} boss - The boss to get difficulty for
     * @returns {Object} Difficulty info with color and description
     */
    getBossDifficulty(boss) {
        const difficulties = {
            'Easy': {
                color: 'success',
                description: 'Perfect for new adventurers',
                icon: '😊',
                levelRange: '1-3'
            },
            'Medium': {
                color: 'warning',
                description: 'A good challenge for developing heroes',
                icon: '⚔️',
                levelRange: '4-6'
            },
            'Hard': {
                color: 'danger',
                description: 'Requires skill and strategy',
                icon: '🔥',
                levelRange: '7-10'
            },
            'Extreme': {
                color: 'dark',
                description: 'Only for experienced warriors',
                icon: '💀',
                levelRange: '11-15'
            },
            'Legendary': {
                color: 'purple',
                description: 'The ultimate test of heroism',
                icon: '👑',
                levelRange: '16-20'
            }
        }

        return difficulties[boss.tier] || difficulties['Medium']
    }
}

export const bossDataService = new BossDataService()