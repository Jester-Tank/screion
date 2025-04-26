<template>
  <div class="health-bar-component">
    <div class="health-bar">
      <div 
        class="health-bar-fill" 
        :style="{ 
          width: `${percentage}%`, 
          backgroundColor: getHealthColor 
        }"
      ></div>
      <div class="health-text">{{ currentValue }} / {{ maxValue }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentValue: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      required: true
    }
  },
  
  computed: {
    percentage() {
      return (this.currentValue / this.maxValue) * 100;
    },
    
    getHealthColor() {
      // Color based on health percentage
      if (this.percentage >= 75) {
        return '#4CAF50'; // Green
      } else if (this.percentage >= 50) {
        return '#FFEB3B'; // Yellow
      } else if (this.percentage >= 25) {
        return '#FF9800'; // Orange
      } else {
        return '#F44336'; // Red
      }
    }
  }
}
</script>

<style scoped>
.health-bar-component {
  width: 100%;
  margin: 8px 0;
}

.health-bar {
  width: 100%;
  height: 20px;
  background-color: #444;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.health-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  font-size: 0.8rem;
}
</style>