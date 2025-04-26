<template>
  <div class="battle-log">
    <h3 class="log-title">{{ title }}</h3>
    <div class="log-container">
      <div 
        v-for="(entry, index) in entries" 
        :key="index" 
        class="log-entry"
        :class="{ 'important': isImportant(entry) }"
      >
        {{ entry }}
      </div>
      <div v-if="entries.length === 0" class="empty-log">
        Battle has not yet begun...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    entries: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Battle Log'
    }
  },
  
  methods: {
    isImportant(entry) {
      // Identify important log entries (victories, defeats, level ups, etc.)
      const importantPhrases = [
        'defeated',
        'victorious',
        'level up',
        'enters a new phase',
        'battle started',
        'has been defeated'
      ];
      
      return importantPhrases.some(phrase => entry.toLowerCase().includes(phrase));
    },
  },
  
  mounted() {
    // Auto-scroll to bottom when new entries are added
    this.$watch('entries', () => {
      this.$nextTick(() => {
        const logContainer = this.$el.querySelector('.log-container');
        logContainer.scrollTop = logContainer.scrollHeight;
      });
    }, { deep: true });
  }
}
</script>

<style scoped>
.battle-log {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.log-title {
  padding: 8px 12px;
  margin: 0;
  background-color: #333;
  font-size: 1.2rem;
  border-bottom: 2px solid #555;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  background-color: #2a2a2a;
  padding: 8px;
  max-height: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.log-entry {
  padding: 6px 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-word;
  animation: fadeIn 0.3s ease;
}

.important {
  background-color: rgba(255, 119, 0, 0.2);
  font-weight: bold;
  border-left: 3px solid #ff7700;
}

.empty-log {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>