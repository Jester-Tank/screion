// src/AppState.js
import { reactive } from 'vue'
import { Paladin } from './models/Paladin.js'
import { Archer } from './models/Archer.js'

// Modular state structure for better organization
const createBattleState = () => ({
  player: null,
  boss: null,
  battleActive: false,
  turnCount: 0,
  playerTurn: true,
  battleLog: [],
  playerBarrier: 0,
  playerDodging: false,
  playerBurning: false,
  playerSlowed: false,
  bossStunned: false
})

const createCharacterState = () => ({
  paladins: [
    new Paladin({
      name: 'Sir Stellaris',
      title: 'Star Guardian',
      maxHealth: 120,
      attack: 28,
      defense: 22,
      holyPower: 40,
      level: 3,
      experience: 50,
      imageUrl: '/src/assets/img/knight-star-shield.jpg',
      description: 'A young paladin chosen by celestial forces. Wields a golden blade of light and star-emblazoned shield that radiates divine protection.',
      skills: ['Smite Evil', 'Divine Strike', 'Star Blessing'],
      inventory: ['Golden Sword of Light', 'Star Shield', 'Holy Water', 'Divine Charm']
    })
  ],
  archers: [
    new Archer({
      name: 'Sylvia',
      title: 'Forest Shadow',
      maxHealth: 85,
      attack: 32,
      defense: 12,
      range: 5,
      level: 2,
      experience: 75,
      imageUrl: '/src/assets/img/archer-forest.jpg',
      description: 'A cheerful but deadly archer who moves like the wind through the forest. Never misses her mark.',
      skills: ['Quick Shot', 'Rapid Fire'],
      inventory: ['Wooden Bow', 'Quiver of Arrows', 'Hunting Knife']
    })
  ],
  activeCharacter: null,
  playerTemplates: [],
  unlockedCharacters: ['paladin', 'knight'],
  characterCosts: {
    knight: 0,
    paladin: 0,
    mage: 200,
    archer: 150
  },
  selectedHero: null
})

const createGameProgressState = () => ({
  gold: 100,
  playerLevel: 1,
  highestLevel: 1,
  totalGoldEarned: 0,
  totalBattlesWon: 0,
  totalBattlesLost: 0,
  totalXPEarned: 0,
  currentQuest: null,
  completedQuests: [],
  currentLocation: 'town',
  visitedLocations: ['town'],
  gameDay: 1
})

const createEnemyState = () => ({
  bossTemplates: [],
  unlockedEnemies: ['giant_rat', 'forest_spider'],
  enemyCosts: {
    giant_rat: 0,
    forest_spider: 25,
    bandit_leader: 50,
    orc_warrior: 100,
    ice_elemental: 150,
    troll_shaman: 200,
    dragon: 300,
    necromancer: 400,
    demon_lord: 500,
    golem: 700,
    shadow_lord: 900,
    lich_king: 1200,
    dragon_king: 1500,
    void_emperor: 2000
  },
  defeatedBosses: [],
  bossDefeatedCount: {},
  selectedEnemy: null
})

const createGameState = () => ({
  gameSettings: {
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    autoSave: true,
    difficulty: 'normal',
    showTutorials: true
  },
  achievements: [
    {
      id: 'first_victory',
      name: 'First Victory',
      description: 'Win your first battle',
      unlocked: false,
      category: 'combat'
    },
    {
      id: 'boss_slayer',
      name: 'Boss Slayer',
      description: 'Defeat 5 different bosses',
      unlocked: false,
      category: 'combat'
    },
    {
      id: 'gold_hoarder',
      name: 'Gold Hoarder',
      description: 'Accumulate 1000 gold',
      unlocked: false,
      category: 'progression'
    },
    {
      id: 'level_10',
      name: 'Veteran Hero',
      description: 'Reach level 10',
      unlocked: false,
      category: 'progression'
    },
    {
      id: 'legendary_slayer',
      name: 'Legendary Slayer',
      description: 'Defeat a Legendary tier boss',
      unlocked: false,
      category: 'combat'
    }
  ],
  gameStats: {
    totalPlayTime: 0,
    sessionsPlayed: 0,
    lastPlayDate: null,
    firstPlayDate: null,
    favoriteCharacterClass: null,
    mostDefeatedBoss: null,
    longestWinStreak: 0,
    currentWinStreak: 0
  },
  gameItems: [
    {
      id: 'health-potion',
      name: 'Health Potion',
      type: 'consumable',
      effect: 'heal',
      value: 30,
      description: 'Restores 30 health points when consumed.',
      rarity: 'common'
    },
    {
      id: 'holy-water',
      name: 'Holy Water',
      type: 'consumable',
      effect: 'restore-holy-power',
      value: 20,
      description: 'Restores 20 holy power to a paladin.',
      rarity: 'uncommon'
    },
    {
      id: 'blessed-arrow',
      name: 'Blessed Arrow',
      type: 'consumable',
      effect: 'increase-attack',
      value: 10,
      description: 'Increases an archer\'s attack by 10 for the next battle.',
      rarity: 'uncommon'
    }
  ]
})

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  // Modular state organization
  ...createBattleState(),
  ...createCharacterState(),
  ...createGameProgressState(),
  ...createEnemyState(),
  ...createGameState(),

  // Error state management
  errorState: {
    lastError: null,
    errorCount: 0,
    criticalErrors: []
  },

  // ========================================
  // STATE MANAGEMENT METHODS WITH ERROR HANDLING
  // ========================================

  // Character Management with error handling
  setPlayerTemplates(templates) {
    try {
      if (!Array.isArray(templates)) {
        throw new Error('Templates must be an array')
      }
      this.playerTemplates = templates
      return true
    } catch (error) {
      this.handleError('setPlayerTemplates', error)
      return false
    }
  },

  selectHero(id) {
    try {
      if (!id) {
        throw new Error('Hero ID is required')
      }
      console.log('Selecting hero:', id)
      this.selectedHero = id
      return this.selectedHero
    } catch (error) {
      this.handleError('selectHero', error)
      return null
    }
  },

  unlockCharacter(id) {
    try {
      const cost = this.characterCosts[id]
      if (cost === undefined) {
        throw new Error(`Character ${id} not found in characterCosts`)
      }

      if (this.gold >= cost) {
        this.gold -= cost
        if (!this.unlockedCharacters.includes(id)) {
          this.unlockedCharacters.push(id)
        }
        this.saveGameData()
        return true
      }
      return false
    } catch (error) {
      this.handleError('unlockCharacter', error)
      return false
    }
  },

  // Gold Management with validation
  addGold(amount) {
    try {
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Gold amount must be a positive number')
      }
      this.gold += amount
      this.totalGoldEarned += amount
      this.checkAchievements()
      this.saveGameData()
      return this.gold
    } catch (error) {
      this.handleError('addGold', error)
      return this.gold
    }
  },

  spendGold(amount) {
    try {
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Gold amount must be a positive number')
      }
      if (this.gold >= amount) {
        this.gold -= amount
        this.saveGameData()
        return true
      }
      return false
    } catch (error) {
      this.handleError('spendGold', error)
      return false
    }
  },

  // Level Management with bounds checking
  levelUp() {
    try {
      const maxLevel = 20 // Define max level constant
      if (this.playerLevel >= maxLevel) {
        console.warn(`Player is already at maximum level ${maxLevel}`)
        return this.playerLevel
      }
      
      this.playerLevel++
      if (this.playerLevel > this.highestLevel) {
        this.highestLevel = this.playerLevel
      }
      this.checkAchievements()
      this.processAutoUnlocks()
      this.saveGameData()
      return this.playerLevel
    } catch (error) {
      this.handleError('levelUp', error)
      return this.playerLevel
    }
  },

  // Enemy Management with validation
  selectEnemy(id) {
    try {
      if (!id) {
        throw new Error('Enemy ID is required')
      }
      console.log('Selecting enemy:', id)
      this.selectedEnemy = id
      return this.selectedEnemy
    } catch (error) {
      this.handleError('selectEnemy', error)
      return null
    }
  },

  unlockEnemy(id) {
    try {
      const cost = this.enemyCosts[id]
      if (cost === undefined) {
        throw new Error(`Enemy ${id} not found in enemyCosts`)
      }
      
      if (this.gold >= cost) {
        this.gold -= cost
        if (!this.unlockedEnemies.includes(id)) {
          this.unlockedEnemies.push(id)
        }
        this.saveGameData()
        return true
      }
      return false
    } catch (error) {
      this.handleError('unlockEnemy', error)
      return false
    }
  },

  recordDefeat(enemyId) {
    try {
      if (!enemyId) {
        throw new Error('Enemy ID is required')
      }
      
      if (!this.defeatedBosses.includes(enemyId)) {
        this.defeatedBosses.push(enemyId)
      }

      // Track defeat count
      if (!this.bossDefeatedCount[enemyId]) {
        this.bossDefeatedCount[enemyId] = 0
      }
      this.bossDefeatedCount[enemyId]++

      this.totalBattlesWon++
      this.gameStats.currentWinStreak++
      if (this.gameStats.currentWinStreak > this.gameStats.longestWinStreak) {
        this.gameStats.longestWinStreak = this.gameStats.currentWinStreak
      }

      this.processAutoUnlocks()
      this.checkAchievements()
      this.saveGameData()
    } catch (error) {
      this.handleError('recordDefeat', error)
    }
  },

  recordLoss() {
    try {
      this.totalBattlesLost++
      this.gameStats.currentWinStreak = 0
      this.saveGameData()
    } catch (error) {
      this.handleError('recordLoss', error)
    }
  },

  // Boss system methods with error handling
  getBossesByTier(tier) {
    try {
      if (!tier) {
        throw new Error('Tier parameter is required')
      }
      return this.bossTemplates.filter(boss => boss && boss.tier === tier) || []
    } catch (error) {
      this.handleError('getBossesByTier', error)
      return []
    }
  },

  shouldAutoUnlock(bossId) {
    try {
      if (!bossId) {
        throw new Error('Boss ID is required')
      }
      
      const autoUnlockRules = {
        'forest_spider': () => this.defeatedBosses.includes('giant_rat'),
        'bandit_leader': () => this.defeatedBosses.includes('forest_spider'),
        'orc_warrior': () => this.playerLevel >= 4 && this.defeatedBosses.length >= 2,
        'ice_elemental': () => this.playerLevel >= 5 && this.defeatedBosses.includes('orc_warrior'),
        'troll_shaman': () => this.playerLevel >= 6 && this.defeatedBosses.includes('ice_elemental'),
        'dragon': () => this.playerLevel >= 7 && this.defeatedBosses.includes('troll_shaman'),
        'necromancer': () => this.playerLevel >= 8 && this.defeatedBosses.includes('dragon'),
        'demon_lord': () => this.playerLevel >= 9 && this.defeatedBosses.includes('necromancer'),
        'golem': () => this.playerLevel >= 11 && this.defeatedBosses.includes('demon_lord'),
        'shadow_lord': () => this.playerLevel >= 12 && this.defeatedBosses.includes('golem'),
        'lich_king': () => this.playerLevel >= 14 && this.defeatedBosses.includes('shadow_lord'),
        'dragon_king': () => this.playerLevel >= 16 && this.defeatedBosses.includes('lich_king'),
        'void_emperor': () => this.playerLevel >= 18 && this.defeatedBosses.includes('dragon_king')
      }

      const rule = autoUnlockRules[bossId]
      return rule ? rule() : false
    } catch (error) {
      this.handleError('shouldAutoUnlock', error)
      return false
    }
  },

  processAutoUnlocks() {
    try {
      const allBossIds = [
        'giant_rat', 'forest_spider', 'bandit_leader', 'orc_warrior', 'ice_elemental',
        'troll_shaman', 'dragon', 'necromancer', 'demon_lord', 'golem', 'shadow_lord',
        'lich_king', 'dragon_king', 'void_emperor'
      ]

      let newUnlocks = []

      allBossIds.forEach(bossId => {
        if (!this.unlockedEnemies.includes(bossId) && this.shouldAutoUnlock(bossId)) {
          this.unlockedEnemies.push(bossId)
          newUnlocks.push(bossId)
        }
      })

      if (newUnlocks.length > 0) {
        console.log('Auto-unlocked bosses:', newUnlocks)
        this.saveGameData()
      }

      return newUnlocks
    } catch (error) {
      this.handleError('processAutoUnlocks', error)
      return []
    }
  },

  getRecommendedBoss() {
    try {
      const availableBosses = this.bossTemplates.filter(boss =>
        boss && this.unlockedEnemies.includes(boss.id)
      )

      if (availableBosses.length === 0) return null

      const sortedByLevel = availableBosses
        .filter(boss => boss.level >= this.playerLevel - 2)
        .sort((a, b) => {
          const aDiff = Math.abs(a.level - this.playerLevel)
          const bDiff = Math.abs(b.level - this.playerLevel)
          return aDiff - bDiff
        })

      return sortedByLevel[0] || availableBosses[0]
    } catch (error) {
      this.handleError('getRecommendedBoss', error)
      return null
    }
  },

  getCombatRating() {
    try {
      let totalLevels = 0
      let characterCount = 0
      let totalStats = 0

      this.paladins.forEach(paladin => {
        if (paladin) {
          totalLevels += paladin.level || 1
          totalStats += (paladin.maxHealth || 0) + (paladin.attack || 0) + (paladin.defense || 0)
          characterCount++
        }
      })

      this.archers.forEach(archer => {
        if (archer) {
          totalLevels += archer.level || 1
          totalStats += (archer.maxHealth || 0) + (archer.attack || 0) + (archer.defense || 0)
          characterCount++
        }
      })

      const averageLevel = characterCount > 0 ? totalLevels / characterCount : 1
      const averageStats = characterCount > 0 ? totalStats / characterCount : 100

      return Math.floor(averageLevel * 10 + this.playerLevel * 5 + averageStats / 10)
    } catch (error) {
      this.handleError('getCombatRating', error)
      return 0
    }
  },

  // Achievement system with error handling
  checkAchievements() {
    try {
      this.achievements.forEach(achievement => {
        if (!achievement.unlocked) {
          let shouldUnlock = false

          switch (achievement.id) {
            case 'first_victory':
              shouldUnlock = this.totalBattlesWon >= 1
              break
            case 'boss_slayer':
              shouldUnlock = this.defeatedBosses.length >= 5
              break
            case 'gold_hoarder':
              shouldUnlock = this.gold >= 1000
              break
            case 'level_10':
              shouldUnlock = this.playerLevel >= 10
              break
            case 'legendary_slayer':
              shouldUnlock = this.defeatedBosses.some(bossId => {
                const boss = this.bossTemplates.find(b => b && b.id === bossId)
                return boss && boss.tier === 'Legendary'
              })
              break
          }

          if (shouldUnlock) {
            achievement.unlocked = true
            this.notifyAchievement(achievement)
          }
        }
      })
    } catch (error) {
      this.handleError('checkAchievements', error)
    }
  },

  notifyAchievement(achievement) {
    try {
      console.log(`🏆 Achievement Unlocked: ${achievement.name} - ${achievement.description}`)
      // In a real game, you'd show a notification popup here
    } catch (error) {
      this.handleError('notifyAchievement', error)
    }
  },

  // Error handling system
  handleError(context, error) {
    const errorInfo = {
      context,
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    }

    console.error(`[AppState Error in ${context}]:`, errorInfo)
    
    this.errorState.lastError = errorInfo
    this.errorState.errorCount++

    // Track critical errors that might break the game
    const criticalContexts = ['saveGameData', 'loadGameData', 'battleState']
    if (criticalContexts.some(ctx => context.includes(ctx))) {
      this.errorState.criticalErrors.push(errorInfo)
    }

    // Auto-recovery for certain errors
    this.attemptErrorRecovery(context, error)
  },

  attemptErrorRecovery(context, error) {
    try {
      switch (context) {
        case 'saveGameData':
          // Attempt backup save
          console.warn('Attempting backup save due to save error')
          setTimeout(() => this.saveGameData(), 1000)
          break
        case 'loadGameData':
          // Reset to safe defaults
          console.warn('Resetting to safe defaults due to load error')
          this.resetToSafeDefaults()
          break
        default:
          // Generic recovery - validate critical state
          this.validateCriticalState()
          break
      }
    } catch (recoveryError) {
      console.error('Error recovery failed:', recoveryError)
    }
  },

  validateCriticalState() {
    try {
      // Ensure critical values are valid
      if (typeof this.gold !== 'number' || this.gold < 0) {
        this.gold = 0
      }
      if (typeof this.playerLevel !== 'number' || this.playerLevel < 1) {
        this.playerLevel = 1
      }
      if (!Array.isArray(this.paladins)) {
        this.paladins = []
      }
      if (!Array.isArray(this.archers)) {
        this.archers = []
      }
    } catch (error) {
      console.error('Critical state validation failed:', error)
    }
  },

  resetToSafeDefaults() {
    try {
      Object.assign(this, createGameProgressState())
      console.log('Reset to safe defaults completed')
    } catch (error) {
      console.error('Failed to reset to safe defaults:', error)
    }
  },

  // Session tracking with error handling
  startSession() {
    try {
      this.gameStats.sessionsPlayed++
      this.gameStats.lastPlayDate = new Date().toISOString()

      if (!this.gameStats.firstPlayDate) {
        this.gameStats.firstPlayDate = new Date().toISOString()
      }

      this.saveGameData()
    } catch (error) {
      this.handleError('startSession', error)
    }
  },

  updatePlayTime(minutes) {
    try {
      if (typeof minutes !== 'number' || minutes < 0) {
        throw new Error('Play time must be a positive number')
      }
      this.gameStats.totalPlayTime += minutes
      this.saveGameData()
    } catch (error) {
      this.handleError('updatePlayTime', error)
    }
  },

  // Enhanced Save/Load Methods with better error handling
  saveGameData() {
    try {
      const gameData = {
        // Character data with null safety
        paladins: this.paladins.map(p => p ? ({
          id: p.id,
          name: p.name,
          title: p.title,
          maxHealth: p.maxHealth,
          currentHealth: p.currentHealth,
          attack: p.attack,
          defense: p.defense,
          holyPower: p.holyPower,
          level: p.level,
          experience: p.experience,
          imageUrl: p.imageUrl,
          description: p.description,
          skills: p.skills || [],
          inventory: p.inventory || [],
          isActive: p.isActive,
          characterClass: p.characterClass
        }) : null).filter(Boolean),

        archers: this.archers.map(a => a ? ({
          id: a.id,
          name: a.name,
          title: a.title,
          maxHealth: a.maxHealth,
          currentHealth: a.currentHealth,
          attack: a.attack,
          defense: a.defense,
          range: a.range,
          level: a.level,
          experience: a.experience,
          imageUrl: a.imageUrl,
          description: a.description,
          skills: a.skills || [],
          inventory: a.inventory || [],
          isActive: a.isActive,
          characterClass: a.characterClass
        }) : null).filter(Boolean),

        // Game progression
        gold: this.gold,
        playerLevel: this.playerLevel,
        highestLevel: this.highestLevel,
        totalGoldEarned: this.totalGoldEarned,
        totalBattlesWon: this.totalBattlesWon,
        totalBattlesLost: this.totalBattlesLost,
        totalXPEarned: this.totalXPEarned,

        // Unlocks and progression
        unlockedCharacters: this.unlockedCharacters || [],
        unlockedEnemies: this.unlockedEnemies || [],
        defeatedBosses: this.defeatedBosses || [],
        bossDefeatedCount: this.bossDefeatedCount || {},

        // Selections (can be null)
        selectedHero: this.selectedHero,
        selectedEnemy: this.selectedEnemy,

        // Game progress
        gameProgress: {
          currentQuest: this.currentQuest,
          completedQuests: this.completedQuests || [],
          currentLocation: this.currentLocation || 'town',
          visitedLocations: this.visitedLocations || ['town'],
          gameDay: this.gameDay || 1
        },

        // Settings and preferences
        gameSettings: this.gameSettings || {},

        // Achievements
        achievements: this.achievements || [],

        // Statistics
        gameStats: this.gameStats || {},

        // Save metadata
        saveVersion: '1.0',
        saveTimestamp: new Date().toISOString()
      }

      localStorage.setItem('bossBattleData', JSON.stringify(gameData))
      console.log('Game data saved successfully')
      return true
    } catch (error) {
      this.handleError('saveGameData', error)
      return false
    }
  },

  loadGameData() {
    try {
      const savedData = localStorage.getItem('bossBattleData')
      if (!savedData) {
        console.log('No saved game data found, using defaults')
        this.startSession()
        return false
      }

      const gameData = JSON.parse(savedData)

      // Validate save data structure
      if (!gameData || typeof gameData !== 'object') {
        throw new Error('Invalid save data structure')
      }

      // Load character data with validation
      if (Array.isArray(gameData.paladins)) {
        this.paladins = gameData.paladins.map(p => new Paladin(p))
      }
      if (Array.isArray(gameData.archers)) {
        this.archers = gameData.archers.map(a => new Archer(a))
      }

      // Load game progression with defaults
      this.gold = Math.max(0, gameData.gold || 100)
      this.playerLevel = Math.max(1, gameData.playerLevel || 1)
      this.highestLevel = Math.max(1, gameData.highestLevel || 1)
      this.totalGoldEarned = Math.max(0, gameData.totalGoldEarned || 0)
      this.totalBattlesWon = Math.max(0, gameData.totalBattlesWon || 0)
      this.totalBattlesLost = Math.max(0, gameData.totalBattlesLost || 0)
      this.totalXPEarned = Math.max(0, gameData.totalXPEarned || 0)

      // Load unlocks with defaults
      this.unlockedCharacters = Array.isArray(gameData.unlockedCharacters) 
        ? gameData.unlockedCharacters 
        : ['paladin', 'knight']
      this.unlockedEnemies = Array.isArray(gameData.unlockedEnemies) 
        ? gameData.unlockedEnemies 
        : ['giant_rat', 'forest_spider']
      this.defeatedBosses = Array.isArray(gameData.defeatedBosses) 
        ? gameData.defeatedBosses 
        : []
      this.bossDefeatedCount = gameData.bossDefeatedCount || {}

      // Load selections (can be null)
      this.selectedHero = gameData.selectedHero || null
      this.selectedEnemy = gameData.selectedEnemy || null

      // Load nested objects with defaults
      const defaultGameProgress = {
        currentQuest: null,
        completedQuests: [],
        currentLocation: 'town',
        visitedLocations: ['town'],
        gameDay: 1
      }
      this.gameProgress = { ...defaultGameProgress, ...(gameData.gameProgress || {}) }

      const defaultGameSettings = {
        soundEnabled: true,
        musicEnabled: true,
        animationsEnabled: true,
        autoSave: true,
        difficulty: 'normal',
        showTutorials: true
      }
      this.gameSettings = { ...defaultGameSettings, ...(gameData.gameSettings || {}) }

      // Load achievements with validation
      if (Array.isArray(gameData.achievements)) {
        this.achievements = gameData.achievements
      }

      // Load statistics with defaults
      const defaultGameStats = {
        totalPlayTime: 0,
        sessionsPlayed: 0,
        lastPlayDate: null,
        firstPlayDate: null,
        favoriteCharacterClass: null,
        mostDefeatedBoss: null,
        longestWinStreak: 0,
        currentWinStreak: 0
      }
      this.gameStats = { ...defaultGameStats, ...(gameData.gameStats || {}) }

      console.log('Game data loaded successfully')
      this.startSession()
      return true
    } catch (error) {
      this.handleError('loadGameData', error)
      console.warn('Using default game data due to corrupted save')
      this.startSession()
      return false
    }
  },

  // Utility Methods with validation
  isCharacterUnlocked(id) {
    try {
      return Array.isArray(this.unlockedCharacters) && this.unlockedCharacters.includes(id)
    } catch (error) {
      this.handleError('isCharacterUnlocked', error)
      return false
    }
  },

  getUnlockCost(id) {
    try {
      return this.characterCosts[id] || 0
    } catch (error) {
      this.handleError('getUnlockCost', error)
      return 0
    }
  },

  getBossDefeatedCount(bossId) {
    try {
      return this.bossDefeatedCount[bossId] || 0
    } catch (error) {
      this.handleError('getBossDefeatedCount', error)
      return 0
    }
  },

  getGameStats() {
    try {
      return {
        gold: this.gold,
        playerLevel: this.playerLevel,
        highestLevel: this.highestLevel,
        totalGoldEarned: this.totalGoldEarned,
        totalBattlesWon: this.totalBattlesWon,
        totalBattlesLost: this.totalBattlesLost,
        totalXPEarned: this.totalXPEarned,
        unlockedCharactersCount: this.unlockedCharacters.length,
        defeatedBossesCount: this.defeatedBosses.length,
        totalCharactersCount: this.playerTemplates.length,
        combatRating: this.getCombatRating(),
        winRate: this.totalBattlesWon + this.totalBattlesLost > 0 ?
          (this.totalBattlesWon / (this.totalBattlesWon + this.totalBattlesLost) * 100).toFixed(1) : 0,
        currentWinStreak: this.gameStats.currentWinStreak,
        longestWinStreak: this.gameStats.longestWinStreak
      }
    } catch (error) {
      this.handleError('getGameStats', error)
      return {}
    }
  },

  resetProgress() {
    try {
      // Reset all game data to defaults with error handling
      Object.assign(this, createCharacterState())
      Object.assign(this, createGameProgressState())
      Object.assign(this, createEnemyState())
      Object.assign(this, createBattleState())
      
      // Reset achievements
      this.achievements.forEach(achievement => {
        achievement.unlocked = false
      })

      // Reset game stats
      Object.assign(this.gameStats, {
        totalPlayTime: 0,
        sessionsPlayed: 0,
        lastPlayDate: null,
        firstPlayDate: null,
        favoriteCharacterClass: null,
        mostDefeatedBoss: null,
        longestWinStreak: 0,
        currentWinStreak: 0
      })

      this.saveGameData()
      console.log('Game progress has been reset')
      return 'Progress has been reset.'
    } catch (error) {
      this.handleError('resetProgress', error)
      return 'Failed to reset progress.'
    }
  },

  // Export/Import functionality with validation
  exportGameData() {
    try {
      const gameData = localStorage.getItem('bossBattleData')
      if (gameData) {
        return btoa(gameData) // Base64 encode for sharing
      }
      return null
    } catch (error) {
      this.handleError('exportGameData', error)
      return null
    }
  },

  importGameData(encodedData) {
    try {
      if (!encodedData || typeof encodedData !== 'string') {
        throw new Error('Invalid encoded data')
      }

      const decodedData = atob(encodedData) // Base64 decode
      const gameData = JSON.parse(decodedData)

      // Validate the data structure
      if (typeof gameData !== 'object' || gameData === null) {
        throw new Error('Invalid game data format')
      }

      // Additional validation for required fields
      if (gameData.gold === undefined || gameData.playerLevel === undefined) {
        throw new Error('Missing required game data fields')
      }

      // Backup current save before importing
      const currentSave = localStorage.getItem('bossBattleData')
      if (currentSave) {
        localStorage.setItem('bossBattleDataBackup', currentSave)
      }

      localStorage.setItem('bossBattleData', decodedData)
      this.loadGameData()
      return { success: true, message: 'Game data imported successfully!' }
    } catch (error) {
      this.handleError('importGameData', error)
      return { success: false, message: 'Failed to import game data: ' + error.message }
    }
  },

  // Get error information for debugging
  getErrorInfo() {
    return {
      lastError: this.errorState.lastError,
      errorCount: this.errorState.errorCount,
      criticalErrors: this.errorState.criticalErrors,
      hasErrors: this.errorState.errorCount > 0
    }
  },

  // Clear error state
  clearErrors() {
    this.errorState.lastError = null
    this.errorState.errorCount = 0
    this.errorState.criticalErrors = []
  }
})