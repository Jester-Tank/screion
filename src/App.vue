<template>
  <header>
    <Navbar />
  </header>
  
  <main>
    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState.js'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar }
}
</script>

<style lang="scss">
:root {
  --primary-color: #ff7700;
  --dark-bg: #232323;
  --darker-bg: #1a1a1a;
  --light-text: #ffffff;
  --card-bg: #333333;
}

body {
  background-color: var(--dark-bg);
  color: var(--light-text);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

// Route transitions
.route-enter-active,
.route-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #2a2a2a;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

// Reset default styles
button {
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
}

// Text selection
::selection {
  background-color: var(--primary-color);
  color: #fff;
}

// Battle page styles for the inline component
.battle-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #232323;
  color: #fff;
}

.battle-content {
  background-color: #333;
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.battle-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.player-info, .boss-info {
  flex: 1;
  text-align: center;
  padding: 1rem;
  
  h2 {
    color: #ff7700;
    margin-bottom: 1rem;
  }
}

.vs-indicator {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 2rem;
  color: #ff7700;
}

.battle-actions {
  text-align: center;
  margin: 2rem 0;
  
  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-shadow: 0 0 10px rgba(255, 119, 0, 0.5);
    animation: pulse 1.5s infinite;
  }
}

.attack-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.attack-btn {
  padding: 0.8rem 1.5rem;
  background-color: #2196F3;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
  }
}

.battle-over, .no-battle {
  text-align: center;
  padding: 2rem;
  
  h3 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #ff7700;
  }
}

.home-btn {
  padding: 0.8rem 2rem;
  background-color: #ff7700;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(255, 119, 0, 0.3);
  }
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #fff;
  z-index: 999;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}
</style>