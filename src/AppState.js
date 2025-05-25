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
  unlockedEnemies: ['dragon'],

  /** @type {Object} */
  enemyCosts: {
    dragon: 0,
    necromancer: 200,
    golem: 300,
    dragon_king: 500
  },

  /** @type {string[]} */
  defeatedBosses: [],

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
      this.saveGameData()
    }
  },

  // Utility Methods
  isCharacterUnlocked(id) {
    return this.unlockedCharacters.includes(id)
  },

  getUnlockCost(id) {
    return this.characterCosts[id] || 0
  },

  getGameStats() {
    return {
      gold: this.gold,
      playerLevel: this.playerLevel,
      highestLevel: this.highestLevel,
      totalGoldEarned: this.totalGoldEarned,
      unlockedCharactersCount: this.unlockedCharacters.length,
      defeatedBossesCount: this.defeatedBosses.length,
      totalCharactersCount: this.playerTemplates.length
    }
  },

  // Save/Load Methods
  saveGameData() {
    const gameData = {
      gold: this.gold,
      playerLevel: this.playerLevel,
      unlockedCharacters: this.unlockedCharacters,
      unlockedEnemies: this.unlockedEnemies,
      defeatedBosses: this.defeatedBosses,
      highestLevel: this.highestLevel,
      totalGoldEarned: this.totalGoldEarned,
      selectedHero: this.selectedHero,
      selectedEnemy: this.selectedEnemy
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
        this.gold = gameData.gold || 100
        this.playerLevel = gameData.playerLevel || 1
        this.unlockedCharacters = gameData.unlockedCharacters || ['paladin', 'knight']
        this.unlockedEnemies = gameData.unlockedEnemies || ['dragon']
        this.defeatedBosses = gameData.defeatedBosses || []
        this.highestLevel = gameData.highestLevel || 1
        this.totalGoldEarned = gameData.totalGoldEarned || 0
        this.selectedHero = gameData.selectedHero || null
        this.selectedEnemy = gameData.selectedEnemy || null
        console.log('Game data loaded successfully')
      } catch (error) {
        console.error('Error loading game data:', error)
        console.warn('Using default game data due to corrupted save')
      }
    } else {
      console.log('No saved game data found, using defaults')
    }
  },

  resetProgress() {
    this.gold = 100
    this.playerLevel = 1
    this.unlockedCharacters = ['paladin', 'knight']
    this.unlockedEnemies = ['dragon']
    this.defeatedBosses = []
    this.highestLevel = 1
    this.totalGoldEarned = 0
    this.selectedHero = null
    this.selectedEnemy = null
    this.saveGameData()
    console.log('Game progress has been reset')
    return 'Progress has been reset.'
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