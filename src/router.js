import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import AccountPage from './pages/AccountPage.vue'
import CharactersPage from './pages/CharactersPage.vue'

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
    component: CharactersPage
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})