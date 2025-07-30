<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { AppState } from './AppState.js'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    onMounted(() => {
      AppState.loadGameData()
    })
    return {}
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
.main-content {
  padding-top: 80px;
}
</style>