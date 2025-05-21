import { reactive } from 'vue'
import { Paladin } from './models/Paladin.js'
import { Archer } from './models/Archer.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  /** @type {import('@bcwdev/auth0provider-client').User} */
  user: {},
  /** @type {import('@bcwdev/auth0provider-client').Identity} */
  identity: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},

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
    gameDay: 1,
    gold: 100
  },

  // Character templates from CharacterService
  /** @type {import('./models/Player.js').Player[]} */
  playerTemplates: [],

  // Character unlocking data
  /** @type {string[]} */
  unlockedCharacters: ['paladin'],

  /** @type {Object} */
  characterCosts: {
    knight: 0,
    paladin: 0,
    mage: 200,
    archer: 150
  },

  // Enemy templates from EnemyService
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