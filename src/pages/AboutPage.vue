<template>
  <div class="container-fluid about-page">
    <div class="row">
      <div class="col-12">
        <h1>About Heroes of the Realm</h1>
        <p class="lead">An epic adventure awaits!</p>
        
        <div class="row mt-4">
          <div class="col-md-6">
            <h3>Game Features</h3>
            <ul>
              <li>Multiple character classes (Paladins & Archers)</li>
              <li>Epic boss battles with unique phases</li>
              <li>Character progression and skill unlocking</li>
              <li>Strategic combat system</li>
              <li>Inventory management</li>
            </ul>
          </div>
          
          <div class="col-md-6">
            <h3>Character Classes</h3>
            <div class="mb-3">
              <h5 class="text-primary">Paladin</h5>
              <p>Divine warriors with holy powers and strong defense.</p>
            </div>
            <div>
              <h5 class="text-success">Archer</h5>
              <p>Swift hunters with deadly precision and ranged attacks.</p>
            </div>
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
  padding: 40px 20px;
}
</style>