<template>
  <div class="character-card" :class="{'paladin-card': character.characterClass === 'paladin', 'archer-card': character.characterClass === 'archer'}">
    <img :src="character.imageUrl" :alt="character.name" class="character-portrait">
    <div class="character-info">
      <h3>{{ character.name }}</h3>
      <h5>{{ character.title }}</h5>
      <p class="character-level">Level {{ character.level }}</p>
      
      <div class="stats-container">
        <div class="stat-item">
          <i class="mdi mdi-heart"></i> {{ character.maxHealth }}
        </div>
        <div class="stat-item">
          <i class="mdi mdi-sword"></i> {{ character.attack }}
        </div>
        <div class="stat-item">
          <i class="mdi mdi-shield"></i> {{ character.defense }}
        </div>
        <div v-if="character.characterClass === 'paladin'" class="stat-item">
          <i class="mdi mdi-white-balance-sunny"></i> {{ character.holyPower }}
        </div>
        <div v-if="character.characterClass === 'archer'" class="stat-item">
          <i class="mdi mdi-bullseye-arrow"></i> {{ character.range }}
        </div>
      </div>
      
      <div class="skills-preview">
        <span v-for="skill in character.skills.slice(0, 2)" :key="skill" class="skill-badge">
          {{ skill }}
        </span>
        <span v-if="character.skills.length > 2" class="skill-badge more">+{{ character.skills.length - 2 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    character: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.character-card {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  &.paladin-card {
    border-left: 5px solid #3b82f6;
    background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
  }
  
  &.archer-card {
    border-left: 5px solid #10b981;
    background: linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent);
  }
}

.character-portrait {
  width: 120px;
  height: 150px;
  object-fit: cover;
}

.character-info {
  padding: 15px;
  flex: 1;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  h5 {
    margin: 5px 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

.character-level {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f3f4f6;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
  margin: 5px 0;
}

.stats-container {
  display: flex;
  gap: 10px;
  margin: 5px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  
  i {
    font-size: 1rem;
  }
}

.skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.skill-badge {
  padding: 2px 8px;
  background-color: #e5e7eb;
  border-radius: 10px;
  font-size: 0.7rem;
  
  &.more {
    background-color: #d1d5db;
  }
}
</style>