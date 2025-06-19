// src/services/GameService.js
import { AppState } from "../AppState.js"

class GameService {
    initializeGame() {
        console.log('Initializing game...')
        AppState.loadGameData()
        this.initializeServices()
        console.log('Game initialized successfully')
    }

    async initializeServices() {
        try {
            if (!this.characterService) {
                const charModule = await import('./CharacterService.js')
                this.characterService = charModule.characterService
            }

            if (!this.bossDataService) {
                const bossModule = await import('./BossDataService.js')
                this.bossDataService = bossModule.bossDataService
            }

            if (AppState.playerTemplates.length === 0) {
                this.characterService.initializeCharacterData()
            }

            if (AppState.bossTemplates.length === 0) {
                this.bossDataService.initializeBossData()
            }
        } catch (error) {
            console.error('Error initializing services:', error)
        }
    }

    async startBattle(heroId, bossId) {
        console.log(`Starting battle: ${heroId} vs ${bossId}`)

        try {
            await this.initializeServices()

            const player = this.characterService.createPlayerInstance(heroId)
            if (!player) {
                throw new Error(`Failed to create player instance: ${heroId}`)
            }

            const boss = this.bossDataService.createBossInstance(bossId)
            if (!boss) {
                throw new Error(`Failed to create boss instance: ${bossId}`)
            }

            AppState.battleState.player = player
            AppState.battleState.boss = boss
            AppState.battleState.battleActive = true
            AppState.battleState.playerTurn = true
            AppState.battleState.turnCount = 0
            AppState.battleState.battleLog = []

            AppState.battleState.playerBarrier = 0
            AppState.battleState.playerDodging = false
            AppState.battleState.playerBurning = false
            AppState.battleState.playerSlowed = false
            AppState.battleState.bossStunned = false

            AppState.battleLog.push(`Level ${player.level} ${player.name} faces off against ${boss.name}!`)
            AppState.battleLog.push(`${player.name}: ${player.maxHealth} HP, ${player.attack} ATK, ${player.defense} DEF`)
            AppState.battleLog.push(`The battle begins!`)

            console.log('Battle started successfully')
        } catch (error) {
            console.error('Error starting battle:', error)
            throw error
        }
    }

    endPlayerTurn() {
        if (!AppState.battleActive) return
        console.log('Ending player turn')

        AppState.playerTurn = false

        setTimeout(() => {
            this.processBossTurn()
        }, 1000)
    }

    processBossTurn() {
        if (!AppState.battleActive || AppState.playerTurn) return
        console.log('Processing boss turn')

        const boss = AppState.boss
        const player = AppState.player

        if (boss && player && boss.attacks && boss.attacks.length > 0) {
            const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)]
            const baseDamage = attack.damage || boss.attack
            const damage = Math.max(1, baseDamage - Math.floor(player.defense / 2))

            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss.name} uses ${attack.name} and deals ${damage} damage to ${player.name}!`)

            if (player.currentHealth <= 0) {
                this.endBattle(false)
                return
            }
        } else {
            const damage = Math.max(1, (boss?.attack || 20) - Math.floor((player?.defense || 0) / 2))
            player.currentHealth = Math.max(0, player.currentHealth - damage)
            AppState.battleLog.push(`${boss?.name || 'Enemy'} attacks for ${damage} damage!`)

            if (player.currentHealth <= 0) {
                this.endBattle(false)
                return
            }
        }

        this.endBossTurn()
    }

    endBossTurn() {
        if (!AppState.battleActive) return
        console.log('Ending boss turn')

        AppState.playerTurn = true
        AppState.turnCount++

        console.log(`Turn ${AppState.turnCount} - Player's turn`)
    }

    async endBattle(playerWon) {
        console.log('Ending battle:', playerWon ? 'Player Victory' : 'Player Defeat')
        AppState.battleActive = false

        if (playerWon) {
            const boss = AppState.boss
            const player = AppState.player
            const baseGold = boss?.goldReward || 50
            const goldReward = Math.floor(baseGold)

            try {
                const experienceModule = await import('./ExperienceService.js')
                const experienceService = experienceModule.experienceService

                if (experienceService && player) {
                    const xpReward = experienceService.calculateBattleXP(boss, player)

                    let actualCharacter = null
                    if (player.characterClass === 'paladin') {
                        actualCharacter = AppState.paladins.find(p => p.name === player.name)
                    } else if (player.characterClass === 'archer') {
                        actualCharacter = AppState.archers.find(a => a.name === player.name)
                    }

                    if (actualCharacter) {
                        const xpResult = experienceService.awardXP(actualCharacter, xpReward, 'boss_battle')

                        AppState.battleLog.push(`${actualCharacter.name} gained ${xpReward} XP!`)
                        if (xpResult.leveledUp) {
                            AppState.battleLog.push(`🎉 LEVEL UP! ${actualCharacter.name} reached Level ${xpResult.newLevel}!`)
                        }
                    }
                }
            } catch (error) {
                console.warn('ExperienceService not available:', error)
            }

            AppState.addGold(goldReward)
            if (boss?.id) {
                AppState.recordDefeat(boss.id)
            }

            const oldLevel = AppState.playerLevel
            AppState.levelUp()
            const leveledUp = AppState.playerLevel > oldLevel

            AppState.battleLog.push(`Victory! ${boss?.name || 'The enemy'} has been defeated!`)
            AppState.battleLog.push(`You earned ${goldReward} gold!`)

            if (leveledUp) {
                AppState.battleLog.push(`Player Level Up! You are now level ${AppState.playerLevel}!`)
            }

            console.log(`Victory! Earned ${goldReward} gold`)
        } else {
            const consolationGold = Math.floor(10 + (AppState.playerLevel * 2))
            AppState.addGold(consolationGold)

            AppState.battleLog.push(`Defeat! ${AppState.player?.name || 'Your hero'} has fallen in battle...`)
            AppState.battleLog.push(`You earned ${consolationGold} consolation gold for your effort.`)
            console.log('Player defeated')
        }

        AppState.saveGameData()
    }

    resetGame() {
        console.log('Resetting game')
        AppState.battleState.player = null
        AppState.battleState.boss = null
        AppState.battleState.battleActive = false
        AppState.battleState.playerTurn = true
        AppState.battleState.turnCount = 0
        AppState.battleState.battleLog = []
        AppState.battleState.playerBarrier = 0
        AppState.battleState.playerDodging = false
        AppState.battleState.playerBurning = false
        AppState.battleState.playerSlowed = false
        AppState.battleState.bossStunned = false
        AppState.selectedHero = null
        AppState.selectedEnemy = null
        console.log('Game reset complete')
    }

    getBattleStatus() {
        return {
            active: AppState.battleActive,
            playerTurn: AppState.playerTurn,
            turnCount: AppState.turnCount,
            player: AppState.player,
            boss: AppState.boss
        }
    }

    getAllCharacters() {
        return [...AppState.paladins, ...AppState.archers]
    }

    getActiveCharacter() {
        return AppState.activeCharacter
    }

    getCharacterById(characterId) {
        let character = AppState.paladins.find(p => p.id === characterId)
        if (!character) {
            character = AppState.archers.find(a => a.id === characterId)
        }
        return character
    }

    clearActiveCharacter() {
        AppState.paladins.forEach(p => p.isActive = false)
        AppState.archers.forEach(a => a.isActive = false)
        AppState.activeCharacter = null
    }
}

export const gameService = new GameService()