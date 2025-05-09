<template>
  <div class="about-page container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="about-container">
          <h1>About Boss Battle</h1>
          <p class="lead">A turn-based boss battle game created with Vue.js</p>
          
          <div class="about-section">
            <h2>Game Overview</h2>
            <p>Boss Battle is a turn-based combat game where you choose a hero character and face off against powerful bosses. Each character and boss has unique abilities and stats, making for strategic gameplay.</p>
          </div>
          
          <div class="about-section">
            <h2>Features</h2>
            <ul>
              <li>Multiple character classes with different strengths and weaknesses</li>
              <li>Powerful bosses with unique attack patterns</li>
              <li>Status effects that change the flow of battle</li>
              <li>Boss phase transitions that increase the challenge</li>
              <li>Cooldown system for powerful abilities</li>
              <li>Experience system with leveling up</li>
            </ul>
          </div>
          
          <div class="about-section">
            <h2>Technical Details</h2>
            <p>Built with:</p>
            <ul>
              <li>Vue.js for reactive UI</li>
              <li>MVC architecture for clean code organization</li>
              <li>CSS animations for visual effects</li>
              <li>Modern JavaScript ES6+ features</li>
            </ul>
          </div>
          
          <div class="about-section">
            <h2>Future Plans</h2>
            <p>We're planning to expand the game with:</p>
            <ul>
              <li>More character classes and bosses</li>
              <li>Equipment system for further customization</li>
              <li>Campaign mode with multiple battles</li>
              <li>Multiplayer features</li>
              <li>Enhanced visual effects</li>
            </ul>
          </div>
          
          <div class="text-center mt-5">
            <router-link to="/" class="btn-return">Return to Game</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped lang="scss">
.about-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #232323;
  color: #fff;
}

.about-container {
  background-color: #333;
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #ff7700;
  margin-bottom: 0.5rem;
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

.lead {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  opacity: 0.8;
}

.about-section {
  margin-bottom: 2rem;
  
  h2 {
    color: #ff7700;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul {
    list-style-type: none;
    padding-left: 1rem;
    
    li {
      margin-bottom: 0.5rem;
      position: relative;
      padding-left: 1.5rem;
      
      &:before {
        content: '➤';
        color: #ff7700;
        position: absolute;
        left: 0;
      }
    }
  }
}

.btn-return {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: #ff7700;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ff9900;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 119, 0, 0.3);
  }
}
</style>