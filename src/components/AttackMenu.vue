<template>
  <div class="attack-menu">
    <h3 class="menu-title">{{ title }}</h3>
    <div class="attacks-grid">
      <button v-for="attack in attacks" :key="attack.id" class="attack-button"
        :class="[attack.type, { disabled: attack.currentCooldown > 0 }]"
        :disabled="attack.currentCooldown > 0 || disabled" @click="$emit('attack-selected', attack)">
        <div class="attack-name">{{ attack.name }}</div>
        <div class="attack-details">
          <div class="attack-type">{{ formatType(attack.type) }}</div>
          <div class="attack-damage" v-if="attack.damage > 0">DMG: {{ attack.damage }}</div>
          <div class="attack-heal" v-if="attack.selfHeal > 0">HEAL: {{ attack.selfHeal }}</div>
        </div>
        <div class="attack-description">{{ attack.description }}</div>
        <div class="cooldown" v-if="attack.currentCooldown > 0">
          Cooldown: {{ attack.currentCooldown }}
        </div>
        <div class="status-effect" v-if="attack.statusEffect">
          May cause: {{ formatEffect(attack.statusEffect) }}
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttackMenu',
  props: {
    attacks: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Attacks'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    formatType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1)
    },

    formatEffect(effect) {
      const effects = {
        'burn': 'Burn 🔥',
        'poison': 'Poison ☠️',
        'stun': 'Stun ⚡',
        'weaken': 'Weaken 💔'
      }

      return effects[effect] || effect
    }
  }
}
</script>

<style scoped>
.attack-menu {
  margin-bottom: 20px;
}

.menu-title {
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.attacks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.attack-button {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #3f3f3f;
  cursor: pointer;
  text-align: left;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  min-height: 120px;
  position: relative;
  overflow: hidden;
}

.attack-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.attack-button.physical {
  background-color: #5D4037;
}

.attack-button.magical {
  background-color: #303F9F;
}

.attack-button.support {
  background-color: #388E3C;
}

.attack-button.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.attack-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.attack-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.attack-description {
  font-size: 0.8rem;
  opacity: 0.8;
  flex-grow: 1;
}

.cooldown {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 4px;
  font-size: 0.8rem;
  text-align: center;
  font-weight: bold;
}

.status-effect {
  font-size: 0.75rem;
  margin-top: 5px;
  font-style: italic;
}
</style>