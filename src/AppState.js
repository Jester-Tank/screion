// src/AppState.js
import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  // User data - Auth system data
  identity: null, // Identity from auth0
  account: null, // Account - user info from the database

  //#region GAME STATE
  // Core Game Stats
  gold: 0,
  playerLevel: 1,
  selectedHero: null,
  selectedEnemy: null,
  battleMode: false,
  difficulty: 'normal', // 'easy', 'normal', 'hard'

  // Items & Currency
  totalGoldEarned: 0,
  playerItems: [], // Array of items the player owns
  shopItems: [], // Array of items available in the shop

  // Unlocks & Progression
  unlockedCharacters: ['knight'],  // Start with only knight unlocked
  unlockedEnemies: ['dragon'],     // Start with only dragon unlocked
  defeatedBosses: [], // Track bosses defeated at least once
  highestLevel: 1,
  achievements: [], // Array of achievement IDs the player has earned

  // Costs for unlockables
  characterCosts: {
    mage: 100,
    archer: 250,
    paladin: 500
  },
  enemyCosts: {
    necromancer: 150,
    golem: 300,
    dragon_king: 600
  },
  //#endregion

  //#region BATTLE ENTITIES
  // Current battle entities
  player: null, // Current player instance in battle
  boss: null, // Current boss instance in battle

  // Templates (populated by services)
  playerTemplates: [], // Array of all possible character templates
  bossTemplates: [], // Array of all possible boss templates
  //#endregion

  //#region BATTLE STATE
  // Battle flow
  battleActive: false,
  playerTurn: true,
  turnCount: 0,
  battleLog: ['Prepare for battle!'],
  battleResult: null, // null, 'victory', 'defeat'

  // Status Effects
  bossStunned: false,
  playerBurning: false,
  playerSlowed: false,
  playerBarrier: 0,
  playerDodging: false,

  // Special battle state
  criticalMode: false, // Set to true when player or boss is below 20% health
  comboCounter: 0, // Tracks consecutive hits for combo system
  perfectBlock: false, // For timing-based block mechanic
  //#endregion

  //#region GAME SETTINGS
  // User preferences
  soundEnabled: true,
  musicEnabled: true,
  showTutorials: true,
  difficultyLevel: 'normal', // 'easy', 'normal', 'hard'
  animationSpeed: 'normal', // 'slow', 'normal', 'fast'
  textSpeed: 'normal', // 'slow', 'normal', 'fast'
  //#endregion

  //#region GAME STATISTICS
  // Player stats
  totalBattles: 0,
  victories: 0,
  defeats: 0,
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  longestBattle: 0, // Most turns in a battle
  quickestVictory: 999, // Least turns to win a battle
  favoriteBoss: null, // Most frequently battled boss
  favoriteCharacter: null, // Most frequently used character
  //#endregion

  //#region UI STATE
  // UI state variables
  currentScreen: 'home', // 'home', 'battle', 'shop', 'inventory', 'settings'
  shopCategory: 'all', // 'all', 'potions', 'equipment', 'special'
  inventoryFilter: 'all', // 'all', 'potions', 'equipment', 'special'
  notificationQueue: [], // Array of notifications to display
  helpTopicOpen: null, // Currently open help topic
  //#endregion

  //#region QUEST SYSTEM
  // Quest tracking
  activeQuests: [], // Array of currently active quests
  completedQuests: [], // Array of completed quest IDs
  dailyQuestRefresh: null, // Timestamp of last daily quest refresh
  weeklyQuestRefresh: null, // Timestamp of last weekly quest refresh
  questProgress: {}, // Object tracking progress of different quest objectives
  //#endregion

  //#region FUTURE EXPANSION
  // Variables for future features
  playerTeam: [], // For multi-character battles
  guildLevel: 1, // For guild/clan system
  worldMapProgress: {}, // For adventure/story mode
  arenaRank: 'bronze', // For PvP arena system
  seasonalEventActive: false, // For seasonal events
  //#endregion
})