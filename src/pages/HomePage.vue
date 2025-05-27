<template>
  <div class="container-fluid home-page">
    <div class="row hero-section py-5">
      <div class="col-12 text-center">
        <h1 class="display-4">Heroes of the Realm</h1>
        <p class="lead">Begin your adventure with mighty heroes and face legendary bosses</p>
        <div class="hero-buttons mt-4">
          <router-link to="/characters" class="btn btn-primary btn-lg me-3">
            <i class="mdi mdi-account-group"></i> View Characters
          </router-link>
          <router-link to="/bosses" class="btn btn-danger btn-lg">
            <i class="mdi mdi-sword-cross"></i> Fight Bosses
          </router-link>
        </div>
      </div>
    </div>

    <!-- Game Stats -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-body">
            <h4 class="text-center mb-3">Your Progress</h4>
            <div class="row text-center">
              <div class="col-md-3 mb-3">
                <div class="stat-box">
                  <i class="mdi mdi-currency-usd text-warning display-6"></i>
                  <div class="stat-value">{{ gold }}</div>
                  <div class="stat-label">Gold</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-box">
                  <i class="mdi mdi-trophy text-success display-6"></i>
                  <div class="stat-value">{{ playerLevel }}</div>
                  <div class="stat-label">Level</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-box">
                  <i class="mdi mdi-skull text-danger display-6"></i>
                  <div class="stat-value">{{ defeatedBosses.length }}</div>
                  <div class="stat-label">Bosses Defeated</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-box">
                  <i class="mdi mdi-account-multiple text-info display-6"></i>
                  <div class="stat-value">{{ unlockedCharacters.length }}</div>
                  <div class="stat-label">Heroes Unlocked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Content -->
    <div class="row my-5">
      <div class="col-12 text-center mb-4">
        <h2>Choose Your Path</h2>
      </div>

      <!-- Characters Section -->
      <div class="col-md-6 mb-4">
        <div class="feature-card card h-100">
          <div class="card-header bg-primary text-white">
            <h4><i class="mdi mdi-account-group"></i> Heroes</h4>
          </div>
          <div class="card-body">
            <p>Choose from various hero classes, each with unique abilities and fighting styles:</p>
            <ul class="feature-list">
              <li><strong>Paladin:</strong> Divine warriors with holy powers and healing abilities</li>
              <li><strong>Knight:</strong> Heavily armored defenders with strong defensive capabilities</li>
              <li><strong>Mage:</strong> Masters of magic with devastating spells</li>
              <li><strong>Archer:</strong> Swift hunters with deadly precision attacks</li>
            </ul>
            <router-link to="/characters" class="btn btn-primary">
              Manage Characters
            </router-link>
          </div>
        </div>
      </div>

      <!-- Boss Battles Section -->
      <div class="col-md-6 mb-4">
        <div class="feature-card card h-100">
          <div class="card-header bg-danger text-white">
            <h4><i class="mdi mdi-sword-cross"></i> Boss Battles</h4>
          </div>
          <div class="card-body">
            <p>Test your skills against legendary foes and earn great rewards:</p>
            <ul class="feature-list">
              <li><strong>Ancient Fire Dragon:</strong> A fearsome beast with burning attacks</li>
              <li><strong>Dark Necromancer:</strong> Master of dark magic and life drain</li>
              <li><strong>Stone Titan Golem:</strong> Nearly indestructible construct</li>
              <li><strong>Inferno Dragon King:</strong> The ultimate challenge</li>
            </ul>
            <router-link to="/bosses" class="btn btn-danger">
              Enter Battle Arena
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Heroes -->
    <div class="row my-5" v-if="featuredCharacters.length > 0">
      <div class="col-12 text-center mb-4">
        <h2>Featured Heroes</h2>
      </div>

      <div class="col-md-6 mb-4" v-for="character in featuredCharacters" :key="character.id">
        <div class="character-preview card">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <img :src="character.imgUrl" :alt="character.name" class="character-image">
              </div>
              <div class="col-8">
                <h5>{{ character.name }}</h5>
                <p class="text-muted">{{ character.title }}</p>
                <p class="small">{{ character.description }}</p>
                <div class="character-stats">
                  <span class="badge bg-success me-1">HP: {{ character.maxHealth }}</span>
                  <span class="badge bg-danger me-1">ATK: {{ character.attack }}</span>
                  <span class="badge bg-primary">DEF: {{ character.defense }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Updates -->
    <div class="row my-5 py-4 bg-light rounded">
      <div class="col-md-8">
        <h3>Join the Adventure</h3>
        <p>Explore dangerous dungeons, defeat legendary monsters, and collect powerful artifacts.</p>
        <p>Battle through an ever-growing roster of challenging bosses, each with unique abilities and attack patterns.
          Earn gold to unlock new heroes and face even greater challenges!</p>
        <div class="mt-3">
          <router-link to="/bosses" class="btn btn-outline-danger me-2">
            Fight Bosses
          </router-link>
          <router-link to="/characters" class="btn btn-outline-primary">
            View All Characters
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            Latest Updates
          </div>
          <div class="card-body">
            <h6>Boss Battle System</h6>
            <p class="small">Epic boss battles with multi-phase encounters, status effects, and strategic combat!</p>

            <h6>Character Classes</h6>
            <p class="small">Four unique hero classes, each with distinct abilities and playstyles.</p>

            <h6>Progression System</h6>
            <p class="small">Level up, earn gold, and unlock new challenges as you progress.</p>
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

      // Get first few available character templates
      if (AppState.playerTemplates.length > 0) {
        return AppState.playerTemplates.slice(0, 2)
      }

      // Fallback to legacy characters if templates aren't loaded
      if (AppState.paladins.length > 0) {
        featured.push(AppState.paladins[0])
      }

      if (AppState.archers.length > 0) {
        featured.push(AppState.archers[0])
      }

      return featured
    })

    const gold = computed(() => AppState.gold)
    const playerLevel = computed(() => AppState.playerLevel)
    const defeatedBosses = computed(() => AppState.defeatedBosses)
    const unlockedCharacters = computed(() => AppState.unlockedCharacters)

    return {
      featuredCharacters,
      gold,
      playerLevel,
      defeatedBosses,
      unlockedCharacters
    }
  }
}
</script>

<style scoped lang="scss">
.home-page {
  .hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 80px 0;
    margin-bottom: 30px;
    border-radius: 10px;

    h1 {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
      font-weight: bold;
    }

    .lead {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    }
  }
}

.stat-box {
  padding: 1rem;

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.feature-list {
  list-style: none;
  padding-left: 0;

  li {
    padding: 0.25rem 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }
}

.character-preview {
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.character-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.character-stats {
  margin-top: 0.5rem;

  .badge {
    font-size: 0.7rem;
  }
}

.hero-buttons {
  .btn {
    margin: 0.25rem;
    padding: 0.75rem 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;

    i {
      margin-right: 0.5rem;
    }
  }
}

h2,
h3 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>