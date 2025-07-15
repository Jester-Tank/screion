import { reactive } from 'vue'
import { Paladin } from './models/Paladin.js'
import { Archer } from './models/Archer.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  // /** @type {import('@bcwdev/auth0provider-client').User} */
  // user: {},
  // /** @type {import('@bcwdev/auth0provider-client').Identity} */
  // identity: {},
  // /** @type {import('./models/Account.js').Account} */
  // account: '{}',

  /** @type {Paladin[]} */
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

  /** @type {Archer[]} */
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

  /** @type {Paladin|Archer|null} */
  activeCharacter: null,

  /** @type {Object[]} */
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
  ],

  /** @type {Object} */
  gameProgress: {
    currentQuest: null,
    completedQuests: [],
    currentLocation: 'town',
    visitedLocations: ['town'],
    gameDay: 1
  },

  // ========================================
  // CHARACTER SYSTEM STATE
  // ========================================

  // Character templates for battle system
  /** @type {import('./models/Player.js').Player[]} */
  playerTemplates: [],

  // Game progression data
  /** @type {number} */
  gold: 100,

  /** @type {number} */
  playerLevel: 1,

  /** @type {number} */
  highestLevel: 1,

  /** @type {number} */
  totalGoldEarned: 0,

  /** @type {number} */
  totalBattlesWon: 0,

  /** @type {number} */
  totalBattlesLost: 0,

  /** @type {number} */
  totalXPEarned: 0,

  // Character unlocking system
  /** @type {string[]} */
  unlockedCharacters: ['paladin', 'knight'],

  /** @type {Object} */
  characterCosts: {
    knight: 0,
    paladin: 0,
    mage: 200,
    archer: 150
  },

  // Hero selection for battle system
  /** @type {string|null} */
  selectedHero: null,

  // Enemy system data  
  /** @type {import('./models/Boss.js').Boss[]} */
  bossTemplates: [],

  /** @type {string[]} */
  unlockedEnemies: ['giant_rat', 'forest_spider'], // Start with easiest bosses

  /** @type {Object} */
  enemyCosts: {
    // Easy bosses (Level 1-3)
    giant_rat: 0,           // Free starter boss
    forest_spider: 25,      // Unlock after first victory
    bandit_leader: 50,      // 

    // Medium bosses (Level 4-6)
    orc_warrior: 100,       // Requires some progression
    ice_elemental: 150,     // 
    troll_shaman: 200,      // 

    // Hard bosses (Level 7-10)
    dragon: 300,            // Classic dragon
    necromancer: 400,       // Dark necromancer
    demon_lord: 500,        // Lesser demon lord

    // Extreme bosses (Level 11-15)
    golem: 700,             // Stone titan golem
    shadow_lord: 900,       // Shadow lord
    lich_king: 1200,        // The lich king

    // Legendary bosses (Level 16-20)
    dragon_king: 1500,      // Dragon king
    void_emperor: 2000      // Ultimate boss
  },

  /** @type {string[]} */
  defeatedBosses: [],

  /** @type {Object} */
  bossDefeatedCount: {}, // Track how many times each boss has been defeated

  /** @type {string|null} */
  selectedEnemy: null,

  // Battle state
  /** @type {Object} */
  battleState: {
    /** @type {import('./models/Player.js').Player|null} */
    player: null,
    /** @type {import('./models/Boss.js').Boss|null} */
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
  },

  // Game settings and preferences
  /** @type {Object} */
  gameSettings: {
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    autoSave: true,
    difficulty: 'normal', // easy, normal, hard
    showTutorials: true
  },

  // Achievement system
  /** @type {Object[]} */
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

  // Statistics tracking
  /** @type {Object} */
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

  // ========================================
  // STATE MANAGEMENT METHODS
  // ========================================

  // Character Management
  setPlayerTemplates(templates) {
    this.playerTemplates = templates
  },

  selectHero(id) {
    console.log('Selecting hero:', id)
    this.selectedHero = id
    return this.selectedHero
  },

  unlockCharacter(id) {
    const cost = this.characterCosts[id]
    if (!cost && cost !== 0) {
      console.error(`Character ${id} not found in characterCosts`)
      return false
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
  },

  // Gold Management
  addGold(amount) {
    this.gold += amount
    this.totalGoldEarned += amount
    this.checkAchievements()
    this.saveGameData()
    return this.gold
  },

  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount
      this.saveGameData()
      return true
    }
    return false
  },

  // Level Management
  levelUp() {
    this.playerLevel++
    if (this.playerLevel > this.highestLevel) {
      this.highestLevel = this.playerLevel
    }
    this.checkAchievements()
    this.processAutoUnlocks()
    this.saveGameData()
    return this.playerLevel
  },

  // Enemy Management
  selectEnemy(id) {
    console.log('Selecting enemy:', id)
    this.selectedEnemy = id
    return this.selectedEnemy
  },

  unlockEnemy(id) {
    const cost = this.enemyCosts[id]
    if (this.gold >= cost) {
      this.gold -= cost
      if (!this.unlockedEnemies.includes(id)) {
        this.unlockedEnemies.push(id)
      }
      this.saveGameData()
      return true
    }
    return false
  },

  recordDefeat(enemyId) {
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
  },

  recordLoss() {
    this.totalBattlesLost++
    this.gameStats.currentWinStreak = 0
    this.saveGameData()
  },

  // Boss system methods
  /**
   * Get bosses by difficulty tier
   * @param {string} tier - The difficulty tier
   * @returns {Boss[]} Bosses in that tier
   */
  getBossesByTier(tier) {
    return this.bossTemplates.filter(boss => boss.tier === tier)
  },

  /**
   * Check if a boss should be auto-unlocked based on player progress
   * @param {string} bossId - The boss ID to check
   * @returns {boolean} True if should be auto-unlocked
   */
  shouldAutoUnlock(bossId) {
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
  },

  /**
   * Process auto-unlocks for bosses
   */
  processAutoUnlocks() {
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
  },

  /**
   * Get recommended boss for player level
   * @returns {Boss|null} Recommended boss or null
   */
  getRecommendedBoss() {
    const availableBosses = this.bossTemplates.filter(boss =>
      this.unlockedEnemies.includes(boss.id)
    )

    if (availableBosses.length === 0) return null

    // Find boss closest to player level but not too easy
    const sortedByLevel = availableBosses
      .filter(boss => boss.level >= this.playerLevel - 2) // Don't recommend bosses that are too easy
      .sort((a, b) => {
        const aDiff = Math.abs(a.level - this.playerLevel)
        const bDiff = Math.abs(b.level - this.playerLevel)
        return aDiff - bDiff
      })

    return sortedByLevel[0] || availableBosses[0]
  },

  /**
   * Get player's combat rating based on character levels
   * @returns {number} Combat rating
   */
  getCombatRating() {
    let totalLevels = 0
    let characterCount = 0
    let totalStats = 0

    this.paladins.forEach(paladin => {
      totalLevels += paladin.level
      totalStats += paladin.maxHealth + paladin.attack + paladin.defense
      characterCount++
    })

    this.archers.forEach(archer => {
      totalLevels += archer.level
      totalStats += archer.maxHealth + archer.attack + archer.defense
      characterCount++
    })

    const averageLevel = characterCount > 0 ? totalLevels / characterCount : 1
    const averageStats = characterCount > 0 ? totalStats / characterCount : 100

    return Math.floor(averageLevel * 10 + this.playerLevel * 5 + averageStats / 10)
  },

  // Achievement system
  checkAchievements() {
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
              const boss = this.bossTemplates.find(b => b.id === bossId)
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
  },

  notifyAchievement(achievement) {
    console.log(`🏆 Achievement Unlocked: ${achievement.name} - ${achievement.description}`)
    // In a real game, you'd show a notification popup here
  },

  // Utility Methods
  isCharacterUnlocked(id) {
    return this.unlockedCharacters.includes(id)
  },

  getUnlockCost(id) {
    return this.characterCosts[id] || 0
  },

  getBossDefeatedCount(bossId) {
    return this.bossDefeatedCount[bossId] || 0
  },

  getGameStats() {
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
  },

  // Session tracking
  startSession() {
    this.gameStats.sessionsPlayed++
    this.gameStats.lastPlayDate = new Date().toISOString()

    if (!this.gameStats.firstPlayDate) {
      this.gameStats.firstPlayDate = new Date().toISOString()
    }

    this.saveGameData()
  },

  updatePlayTime(minutes) {
    this.gameStats.totalPlayTime += minutes
    this.saveGameData()
  },

  // Save/Load Methods
  saveGameData() {
    const gameData = {
      // Character data
      paladins: this.paladins.map(p => ({
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
        skills: p.skills,
        inventory: p.inventory,
        isActive: p.isActive,
        characterClass: p.characterClass
      })),
      archers: this.archers.map(a => ({
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
        skills: a.skills,
        inventory: a.inventory,
        isActive: a.isActive,
        characterClass: a.characterClass
      })),

      // Game progression
      gold: this.gold,
      playerLevel: this.playerLevel,
      highestLevel: this.highestLevel,
      totalGoldEarned: this.totalGoldEarned,
      totalBattlesWon: this.totalBattlesWon,
      totalBattlesLost: this.totalBattlesLost,
      totalXPEarned: this.totalXPEarned,

      // Unlocks and progression
      unlockedCharacters: this.unlockedCharacters,
      unlockedEnemies: this.unlockedEnemies,
      defeatedBosses: this.defeatedBosses,
      bossDefeatedCount: this.bossDefeatedCount,

      // Selections
      selectedHero: this.selectedHero,
      selectedEnemy: this.selectedEnemy,

      // Game progress
      gameProgress: this.gameProgress,

      // Settings and preferences
      gameSettings: this.gameSettings,

      // Achievements
      achievements: this.achievements,

      // Statistics
      gameStats: this.gameStats
    }

    try {
      localStorage.setItem('bossBattleData', JSON.stringify(gameData))
      console.log('Game data saved successfully')
    } catch (error) {
      console.error('Failed to save game data:', error)
    }
  },

  loadGameData() {
    const savedData = localStorage.getItem('bossBattleData')
    if (savedData) {
      try {
        const gameData = JSON.parse(savedData)

        // Load character data
        if (gameData.paladins) {
          this.paladins = gameData.paladins.map(p => new Paladin(p))
        }
        if (gameData.archers) {
          this.archers = gameData.archers.map(a => new Archer(a))
        }

        // Load game progression
        this.gold = gameData.gold || 100
        this.playerLevel = gameData.playerLevel || 1
        this.highestLevel = gameData.highestLevel || 1
        this.totalGoldEarned = gameData.totalGoldEarned || 0
        this.totalBattlesWon = gameData.totalBattlesWon || 0
        this.totalBattlesLost = gameData.totalBattlesLost || 0
        this.totalXPEarned = gameData.totalXPEarned || 0

        // Load unlocks
        this.unlockedCharacters = gameData.unlockedCharacters || ['paladin', 'knight']
        this.unlockedEnemies = gameData.unlockedEnemies || ['giant_rat', 'forest_spider']
        this.defeatedBosses = gameData.defeatedBosses || []
        this.bossDefeatedCount = gameData.bossDefeatedCount || {}

        // Load selections
        this.selectedHero = gameData.selectedHero || null
        this.selectedEnemy = gameData.selectedEnemy || null

        // Load game progress
        this.gameProgress = gameData.gameProgress || {
          currentQuest: null,
          completedQuests: [],
          currentLocation: 'town',
          visitedLocations: ['town'],
          gameDay: 1
        }

        // Load settings
        this.gameSettings = gameData.gameSettings || {
          soundEnabled: true,
          musicEnabled: true,
          animationsEnabled: true,
          autoSave: true,
          difficulty: 'normal',
          showTutorials: true
        }

        // Load achievements
        if (gameData.achievements) {
          this.achievements = gameData.achievements
        }

        // Load statistics
        this.gameStats = gameData.gameStats || {
          totalPlayTime: 0,
          sessionsPlayed: 0,
          lastPlayDate: null,
          firstPlayDate: null,
          favoriteCharacterClass: null,
          mostDefeatedBoss: null,
          longestWinStreak: 0,
          currentWinStreak: 0
        }

        console.log('Game data loaded successfully')
      } catch (error) {
        console.error('Error loading game data:', error)
        console.warn('Using default game data due to corrupted save')
      }
    } else {
      console.log('No saved game data found, using defaults')
    }

    // Start session tracking
    this.startSession()
  },

  resetProgress() {
    // Reset all game data to defaults
    this.paladins = [
      new Paladin({
        name: 'Sir Stellaris',
        title: 'Star Guardian',
        maxHealth: 120,
        attack: 28,
        defense: 22,
        holyPower: 40,
        level: 1,
        experience: 0,
        imageUrl: '/src/assets/img/knight-star-shield.jpg',
        description: 'A young paladin chosen by celestial forces.',
        skills: ['Smite Evil'],
        inventory: ['Golden Sword of Light', 'Star Shield']
      })
    ]

    this.archers = [
      new Archer({
        name: 'Sylvia',
        title: 'Forest Shadow',
        maxHealth: 85,
        attack: 32,
        defense: 12,
        range: 5,
        level: 1,
        experience: 0,
        imageUrl: '/src/assets/img/archer-forest.jpg',
        description: 'A cheerful but deadly archer.',
        skills: ['Quick Shot'],
        inventory: ['Wooden Bow', 'Quiver of Arrows']
      })
    ]

    this.activeCharacter = null
    this.gold = 100
    this.playerLevel = 1
    this.highestLevel = 1
    this.totalGoldEarned = 0
    this.totalBattlesWon = 0
    this.totalBattlesLost = 0
    this.totalXPEarned = 0
    this.unlockedCharacters = ['paladin', 'knight']
    this.unlockedEnemies = ['giant_rat', 'forest_spider']
    this.defeatedBosses = []
    this.bossDefeatedCount = {}
    this.selectedHero = null
    this.selectedEnemy = null

    // Reset achievements
    this.achievements.forEach(achievement => {
      achievement.unlocked = false
    })

    // Reset game stats
    this.gameStats = {
      totalPlayTime: 0,
      sessionsPlayed: 0,
      lastPlayDate: null,
      firstPlayDate: null,
      favoriteCharacterClass: null,
      mostDefeatedBoss: null,
      longestWinStreak: 0,
      currentWinStreak: 0
    }

    this.saveGameData()
    console.log('Game progress has been reset')
    return 'Progress has been reset.'
  },

  // Export/Import functionality
  exportGameData() {
    const gameData = localStorage.getItem('bossBattleData')
    if (gameData) {
      return btoa(gameData) // Base64 encode for sharing
    }
    return null
  },

  importGameData(encodedData) {
    try {
      const decodedData = atob(encodedData) // Base64 decode
      const gameData = JSON.parse(decodedData)

      // Validate the data structure
      if (gameData.gold !== undefined && gameData.playerLevel !== undefined) {
        localStorage.setItem('bossBattleData', decodedData)
        this.loadGameData()
        return { success: true, message: 'Game data imported successfully!' }
      } else {
        return { success: false, message: 'Invalid game data format' }
      }
    } catch (error) {
      return { success: false, message: 'Failed to import game data: ' + error.message }
    }
  },

  // Aliases for backward compatibility
  get player() { return this.battleState.player },
  set player(value) { this.battleState.player = value },

  get boss() { return this.battleState.boss },
  set boss(value) { this.battleState.boss = value },

  get battleActive() { return this.battleState.battleActive },
  set battleActive(value) { this.battleState.battleActive = value },

  get turnCount() { return this.battleState.turnCount },
  set turnCount(value) { this.battleState.turnCount = value },

  get playerTurn() { return this.battleState.playerTurn },
  set playerTurn(value) { this.battleState.playerTurn = value },

  get battleLog() { return this.battleState.battleLog },
  set battleLog(value) { this.battleState.battleLog = value },

  get playerBarrier() { return this.battleState.playerBarrier },
  set playerBarrier(value) { this.battleState.playerBarrier = value },

  get playerDodging() { return this.battleState.playerDodging },
  set playerDodging(value) { this.battleState.playerDodging = value },

  get playerBurning() { return this.battleState.playerBurning },
  set playerBurning(value) { this.battleState.playerBurning = value },

  get playerSlowed() { return this.battleState.playerSlowed },
  set playerSlowed(value) { this.battleState.playerSlowed = value },

  get bossStunned() { return this.battleState.bossStunned },
  set bossStunned(value) { this.battleState.bossStunned = value }
})