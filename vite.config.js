// Step 1: Check your vite.config.js and make sure it looks EXACTLY like this:

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})

// Step 2: If you have an eslint plugin imported, remove it completely
// Your file should NOT have any of these lines:
// import eslint from 'vite-plugin-eslint'  ❌ REMOVE
// eslint()  ❌ REMOVE

// Step 3: Check your package.json for eslint plugins and remove them:
// Look for these in your package.json devDependencies and remove them:
// "vite-plugin-eslint": "...",  ❌ REMOVE
// "@vue/eslint-config-standard": "...",  ❌ REMOVE
// "eslint": "...",  ❌ REMOVE
// "eslint-plugin-vue": "...",  ❌ REMOVE

// Step 4: Simple App.vue that will work: