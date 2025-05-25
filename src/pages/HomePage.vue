<template>
  <div class="container-fluid home-page">
    <div class="row hero-section py-5">
      <div class="col-12 text-center">
        <h1 class="display-4">Heroes of the Realm</h1>
        <p class="lead">Begin your adventure with mighty paladins and swift archers</p>
        <router-link to="/characters" class="btn btn-primary btn-lg mt-3">
          Enter the Realm
        </router-link>
      </div>
    </div>
    
    <div class="row my-5">
      <div class="col-12 text-center mb-4">
        <h2>Featured Heroes</h2>
      </div>
      
      <div class="col-md-6 mb-4" v-for="character in featuredCharacters" :key="character.id">
        <div class="character-preview card">
          <div class="card-body">
            <h5>{{ character.name }} - {{ character.title }}</h5>
            <p>{{ character.description }}</p>
            <span class="badge bg-primary">Level {{ character.level }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row my-5 py-4 bg-light rounded">
      <div class="col-md-6">
        <h3>Join the Adventure</h3>
        <p>Explore dangerous dungeons, defeat legendary monsters, and collect powerful artifacts.</p>
        <p>Choose your class:</p>
        <ul>
          <li><strong>Paladin:</strong> Divine warriors with holy powers and protective abilities</li>
          <li><strong>Archer:</strong> Swift hunters with deadly precision and ranged attacks</li>
        </ul>
        <router-link to="/characters" class="btn btn-outline-primary">
          View All Characters
        </router-link>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Latest Updates
          </div>
          <div class="card-body">
            <h5>New Adventure: The Star Forge</h5>
            <p>The celestial alignment has revealed an ancient forge of divine power. Paladins can now craft special star-blessed equipment!</p>
            
            <h5>Archer Skill Enhancement</h5>
            <p>Archers can now master the art of poison arrows and evasive maneuvers.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'

export default {
  setup() {
    const featuredCharacters = computed(() => {
      const featured = []
      
      if (AppState.paladins.length > 0) {
        featured.push(AppState.paladins[0])
      }
      
      if (AppState.archers.length > 0) {
        featured.push(AppState.archers[0])
      }
      
      return featured
    })
    
    return {
      featuredCharacters
    }
  }
}
</script>

<style scoped lang="scss">
.home-page {
  .hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                url('/src/assets/img/hero-background.jpg');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 80px 0;
    margin-bottom: 30px;
    border-radius: 10px;
    
    h1 {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
}

.character-preview {
  height: 100%;
}
</style>