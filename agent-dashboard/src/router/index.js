// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AuthView from '../views/AuthView.vue'
import TransactionsView from '../views/TransactionsView.vue'
// Auth guard
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('authToken')
  const token = localStorage.getItem('authToken')
  if (token) {
    next()
  } else {
    next('/auth')
  }
}

const redirectIfAuth = (to, from, next) => {
  const token = localStorage.getItem('authToken')
  if (token) {
  }
  if (token) {
    next('/')
  } else {
    next()
  }
}

const routes = [
  { 
    path: '/', 
    name: 'Dashboard', 
    component: DashboardView,
    beforeEnter: requireAuth
  },
  { 
    path: '/transactions', 
    name: 'Transactions', 
    component: TransactionsView,
    beforeEnter: requireAuth
  },
  { 
    path: '/auth', 
    name: 'Auth', 
    component: AuthView,
    beforeEnter: redirectIfAuth
  },
  // Redirect old login route
  { 
    path: '/login', 
    redirect: '/auth'
  },
  // Catch all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
