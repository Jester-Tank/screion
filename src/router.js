import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import CharacterPage from './pages/CharacterPage.vue'
import BossSelectionPage from './pages/BossSelectionPage.vue'
import BattlePage from './pages/BattlePage.vue'
import AccountPage from './pages/AccountPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/characters',
    name: 'Characters',
    component: CharacterPage
  },
  {
    path: '/bosses',
    name: 'BossSelection',
    component: BossSelectionPage
  },
  {
    path: '/battle',
    name: 'Battle',
    component: BattlePage
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})