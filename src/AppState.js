import { reactive } from 'vue'
import { Player } from './models/Player.js'
import { Boss } from './models/Boss.js'
import { Attack } from './models/Attack.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  /**@type {import('@bcwdev/auth0provider-client').Identity} */
  identity: null,
  /** @type {import('./models/Account.js').Account} user info from the database*/
  account: null,

  // Game State
  /** @type {Player|null} */
  player: null,

  /** @type {Boss|null} */
  boss: null,

  /** @type {boolean} */
  battleActive: false,

  /** @type {boolean} */
  playerTurn: false,

  /** @type {string[]} */
  battleLog: [],

  // Templates for character selection
  /** @type {Player[]} */
  playerTemplates: [
    new Player({
      id: 'knight',
      name: 'Knight',
      maxHealth: 120,
      attack: 12,
      defense: 8,
      speed: 4,
      imgUrl: 'https://placehold.co/200x200?text=Knight',
      attacks: [
        new Attack({
          id: 'slash',
          name: 'Slash',
          damage: 15,
          accuracy: 95,
          cooldown: 0,
          type: 'physical',
          description: 'A basic sword attack'
        }),
        new Attack({
          id: 'shield-bash',
          name: 'Shield Bash',
          damage: 10,
          accuracy: 90,
          cooldown: 2,
          type: 'physical',
          statusEffect: 'stun',
          statusEffectChance: 60,
          description: 'A bash with your shield that may stun the enemy'
        }),
        new Attack({
          id: 'heavy-blow',
          name: 'Heavy Blow',
          damage: 25,
          accuracy: 80,
          cooldown: 3,
          type: 'physical',
          description: 'A powerful but slow attack'
        }),
        new Attack({
          id: 'rally',
          name: 'Rally',
          damage: 0,
          accuracy: 100,
          cooldown: 4,
          type: 'support',
          selfHeal: 20,
          description: 'Restore some health to yourself'
        })
      ]
    }),
    new Player({
      id: 'mage',
      name: 'Mage',
      maxHealth: 80,
      attack: 18,
      defense: 4,
      speed: 6,
      imgUrl: 'https://placehold.co/200x200?text=Mage',
      attacks: [
        new Attack({
          id: 'fireball',
          name: 'Fireball',
          damage: 20,
          accuracy: 90,
          cooldown: 0,
          type: 'magical',
          statusEffect: 'burn',
          statusEffectChance: 40,
          description: 'A magical fireball that may burn the enemy'
        }),
        new Attack({
          id: 'ice-shard',
          name: 'Ice Shard',
          damage: 15,
          accuracy: 95,
          cooldown: 1,
          type: 'magical',
          statusEffect: 'weaken',
          statusEffectChance: 50,
          description: 'Magical ice that may reduce enemy defense'
        }),
        new Attack({
          id: 'arcane-blast',
          name: 'Arcane Blast',
          damage: 30,
          accuracy: 80,
          cooldown: 3,
          type: 'magical',
          description: 'A powerful magical attack'
        }),
        new Attack({
          id: 'heal',
          name: 'Heal',
          damage: 0,
          accuracy: 100,
          cooldown: 3,
          type: 'support',
          selfHeal: 30,
          description: 'Restore a moderate amount of health'
        })
      ]
    })
  ],

  // Boss templates
  /** @type {Boss[]} */
  bossTemplates: [
    new Boss({
      id: 'dragon',
      name: 'Ancient Dragon',
      maxHealth: 200,
      attack: 15,
      defense: 10,
      speed: 3,
      imgUrl: 'https://placehold.co/300x300?text=Dragon',
      description: 'A fearsome dragon with fire breath and thick scales',
      attacks: [
        new Attack({
          id: 'claw-attack',
          name: 'Claw Attack',
          damage: 15,
          accuracy: 90,
          cooldown: 0,
          type: 'physical',
          isBossAttack: true,
          description: 'A basic attack with sharp claws'
        }),
        new Attack({
          id: 'fire-breath',
          name: 'Fire Breath',
          damage: 25,
          accuracy: 85,
          cooldown: 2,
          type: 'magical',
          statusEffect: 'burn',
          statusEffectChance: 80,
          isBossAttack: true,
          description: 'A blast of fire that may burn the target'
        }),
        new Attack({
          id: 'tail-swipe',
          name: 'Tail Swipe',
          damage: 20,
          accuracy: 80,
          cooldown: 1,
          type: 'physical',
          statusEffect: 'stun',
          statusEffectChance: 40,
          isBossAttack: true,
          description: 'A powerful tail swipe that may stun the target'
        }),
        new Attack({
          id: 'dragon-rage',
          name: 'Dragon Rage',
          damage: 35,
          accuracy: 70,
          cooldown: 3,
          type: 'magical',
          isBossAttack: true,
          description: 'A devastating attack fueled by rage'
        })
      ]
    }),
    new Boss({
      id: 'necromancer',
      name: 'Dark Necromancer',
      maxHealth: 150,
      attack: 20,
      defense: 6,
      speed: 5,
      imgUrl: 'https://placehold.co/300x300?text=Necromancer',
      description: 'A sinister spellcaster with command over the dead',
      attacks: [
        new Attack({
          id: 'shadow-bolt',
          name: 'Shadow Bolt',
          damage: 18,
          accuracy: 95,
          cooldown: 0,
          type: 'magical',
          isBossAttack: true,
          description: 'A bolt of dark energy'
        }),
        new Attack({
          id: 'life-drain',
          name: 'Life Drain',
          damage: 15,
          accuracy: 90,
          cooldown: 2,
          type: 'magical',
          selfHeal: 10,
          isBossAttack: true,
          description: 'Drains life from the target to heal the caster'
        }),
        new Attack({
          id: 'curse',
          name: 'Curse',
          damage: 10,
          accuracy: 85,
          cooldown: 3,
          type: 'magical',
          statusEffect: 'weaken',
          statusEffectChance: 90,
          isBossAttack: true,
          description: 'A dark curse that weakens the target'
        }),
        new Attack({
          id: 'death-touch',
          name: 'Death Touch',
          damage: 30,
          accuracy: 75,
          cooldown: 4,
          type: 'magical',
          isBossAttack: true,
          description: 'A touch that causes immense pain'
        })
      ]
    })
  ]
})