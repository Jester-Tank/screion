// src/router.js
import { createRouter, createWebHashHistory } from 'vue-router'

function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('HomePage')
  },
  {
    path: '/about',
    name: 'About',
    component: loadPage('AboutPage')
  },
  {
    path: '/characters',
    name: 'Characters',
    component: loadPage('CharacterPage')
  },
  {
    path: '/bosses',
    name: 'BossSelection',
    component: loadPage('BossSelectionPage')
  },
  {
    path: '/battle',
    name: 'Battle',
    component: loadPage('BattlePage')
  },
  {
    path: '/account',
    name: 'Account',
    component: loadPage('AccountPage')
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})