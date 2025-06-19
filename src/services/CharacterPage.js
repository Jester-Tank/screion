<template>
  <div class="container-fluid character-page">
    <div class="row">
      <div class="col-md-4">
        <h2>Available Heroes</h2>
        
        <div class="character-section">
          <h3 class="text-success">Paladins</h3>
          <div class="character-list">
            <div class="character-card">
              <div class="character-info">
                <h4>Test Paladin</h4>
                <p class="character-title">Holy Warrior - Level 1</p>
              </div>
            </div>
          </div>
          <button class="btn btn-primary mb-3">+ New Paladin</button>
        </div>
        
        <div class="character-section">
          <h3 class="text-info">Archers</h3>
          <div class="character-list">
            <div class="character-card">
              <div class="character-info">
                <h4>Test Archer</h4>
                <p class="character-title">Swift Hunter - Level 1</p>
              </div>
            </div>
          </div>
          <button class="btn btn-info mb-3">+ New Archer</button>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="character-details">
          <div class="character-header">
            <div class="character-title-section">
              <h1>Select a Character</h1>
              <h4 class="text-muted">Choose a hero from the left</h4>
              <p>Character details will appear here.</p>
            </div>
          </div>
          
          <div class="xp-section card mb-4">
            <div class="card-header">
              <h5>Experience Progress</h5>
            </div>
            <div class="card-body">
              <div class="progress mb-3" style="height: 25px;">
                <div class="progress-bar bg-warning progress-bar-striped" style="width: 50%">
                  50%
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <strong>Current XP:</strong> 50
                </div>
                <div class="col-md-4">
                  <strong>Next Level:</strong> 100 XP
                </div>
                <div class="col-md-4">
                  <strong>Total XP:</strong> 50
                </div>
              </div>
              
              <div class="mt-3">
                <button class="btn btn-warning me-2">
                  Train (+50 XP) - Cost: 5 Gold
                </button>
                <small class="text-muted">Training gives experience but costs gold</small>
              </div>
            </div>
          </div>
          
          <div class="stats-section">
            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5>Stats</h5>
                  </div>
                  <div class="card-body">
                    <div class="stat-row">
                      <span>Health:</span>
                      <span>100 / 100</span>
                    </div>
                    <div class="stat-row">
                      <span>Attack:</span>
                      <span>25</span>
                    </div>
                    <div class="stat-row">
                      <span>Defense:</span>
                      <span>20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5>Skills</h5>
                  </div>
                  <div class="card-body">
                    <p class="text-muted">
                      No special skills yet. Level up to learn new abilities!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons mt-4">
            <button class="btn btn-success me-2">
              Full Heal (10 Gold)
            </button>
            <button class="btn btn-danger">
              Fight Bosses
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacterPage'
}
</script>

<style scoped lang="scss">
.character-page {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.character-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #28a745;
    background-color: rgba(40, 167, 69, 0.1);
  }
}

.character-info {
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .character-title {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
}

.character-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}
</style>