<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <span class="game-logo">BOSS BATTLE</span>
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <!-- Battle link removed - now integrated in Homepage -->
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/account" class="nav-link">Account</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped lang="scss">
.navbar {
  background-color: #1a1a1a;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.game-logo {
  font-weight: bold;
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
  color: #ff7700;
  text-shadow: 0 0 5px rgba(255, 119, 0, 0.5);
}

.nav-link {
  color: #fff;
  margin: 0 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover, &.router-link-active {
    color: #ff7700;
  }
  
  &.router-link-exact-active {
    font-weight: bold;
    text-decoration: underline;
  }
}

.navbar-toggler {
  border-color: rgba(255, 119, 0, 0.5);
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(255, 119, 0, 0.25);
  }
}
</style>