<template>
  <div class="account-page container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="account-container">
          <h1>Your Account</h1>
          
          <div v-if="account" class="account-info">
            <div class="profile-section">
              <div class="profile-picture">
                <img :src="account.picture" :alt="account.name">
              </div>
              <div class="profile-details">
                <h2>{{ account.name }}</h2>
                <p>{{ account.email }}</p>
              </div>
            </div>
            
            <div class="stats-section">
              <h3>Game Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Battles Won</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Battles Lost</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Highest Level</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Total Damage</div>
                </div>
              </div>
            </div>
            
            <div class="achievements-section">
              <h3>Achievements</h3>
              <div class="achievement-list">
                <div class="achievement-item locked">
                  <div class="achievement-icon">🏆</div>
                  <div class="achievement-details">
                    <div class="achievement-name">First Victory</div>
                    <div class="achievement-desc">Win your first battle</div>
                  </div>
                </div>
                <div class="achievement-item locked">
                  <div class="achievement-icon">🔥</div>
                  <div class="achievement-details">
                    <div class="achievement-name">Perfect Fight</div>
                    <div class="achievement-desc">Win a battle without taking damage</div>
                  </div>
                </div>
                <div class="achievement-item locked">
                  <div class="achievement-icon">⚡</div>
                  <div class="achievement-details">
                    <div class="achievement-name">Boss Slayer</div>
                    <div class="achievement-desc">Defeat all bosses</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="account-actions">
              <router-link to="/" class="btn-game">Back to Game</router-link>
              <button class="btn-logout" @click="logout">Logout</button>
            </div>
          </div>
          
          <div v-else class="login-prompt">
            <p>Please log in to view your account</p>
            <button class="btn-login" @click="login">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'
import { AuthService } from '../services/AuthService.js'

export default {
  name: 'AccountPage',
  setup() {
    return {
      account: computed(() => AppState.account),
      async login() {
        AuthService.loginWithPopup()
      },
      async logout() {
        AuthService.logout({ returnTo: window.location.origin })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.account-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #232323;
  color: #fff;
}

.account-container {
  background-color: #333;
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #ff7700;
  margin-bottom: 2rem;
  text-align: center;
  
  &:after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    background-color: #ff7700;
    margin: 1rem auto;
  }
}

// Profile Section
.profile-section {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #444;
}

.profile-picture {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1.5rem;
  border: 2px solid #ff7700;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-details {
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.7;
  }
}

// Stats Section
.stats-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #444;
  
  h3 {
    color: #ff7700;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background-color: #3a3a3a;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #ff7700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

// Achievements Section
.achievements-section {
  margin-bottom: 2rem;
  
  h3 {
    color: #ff7700;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  background-color: #3a3a3a;
  border-radius: 8px;
  padding: 1rem;
  
  &.locked {
    opacity: 0.6;
  }
}

.achievement-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.achievement-name {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.achievement-desc {
  font-size: 0.85rem;
  opacity: 0.8;
}

// Account Actions
.account-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-game, .btn-login, .btn-logout {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-game {
  background-color: #ff7700;
  color: white;
  text-decoration: none;
  
  &:hover {
    background-color: #ff9900;
    transform: translateY(-3px);
  }
}

.btn-login {
  background-color: #4CAF50;
  color: white;
  width: 100%;
  
  &:hover {
    background-color: #66BB6A;
    transform: translateY(-3px);
  }
}

.btn-logout {
  background-color: #F44336;
  color: white;
  
  &:hover {
    background-color: #EF5350;
    transform: translateY(-3px);
  }
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  
  p {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    opacity: 0.8;
  }
}

// Responsive
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .account-actions {
    flex-direction: column;
    gap: 1rem;
    
    .btn-game, .btn-logout {
      width: 100%;
      text-align: center;
    }
  }
}
</style>