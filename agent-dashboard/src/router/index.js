// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('mobicash_auth_token')
    const userData = localStorage.getItem('mobicash_user_data')

    if (!token || !userData) {
      return false
    }

    const user = JSON.parse(userData)
    if (user.expiresAt && Date.now() > user.expiresAt) {
      localStorage.removeItem('mobicash_auth_token')
      localStorage.removeItem('mobicash_user_data')
      localStorage.removeItem('mobicash_refresh_token')
      return false
    }

    return true
  } catch (_error) {
    // Prefix with underscore to indicate intentionally unused
    return false
  }
}

const requireAuth = (to, from, next) => {
  if (isAuthenticated()) {
    next()
  } else {
    localStorage.removeItem('mobicash_auth_token')
    localStorage.removeItem('mobicash_user_data')
    localStorage.removeItem('mobicash_refresh_token')

    next({
      path: '/auth',
      query: { redirect: to.fullPath },
    })
  }
}

const redirectIfAuth = (to, from, next) => {
  if (isAuthenticated()) {
    const redirectPath = to.query.redirect || '/'
    next(redirectPath)
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionsView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      title: 'Transactions',
    },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    beforeEnter: redirectIfAuth,
    meta: {
      requiresAuth: false,
      title: 'Sign In',
    },
  },
  {
    path: '/login',
    redirect: '/auth',
  },
  {
    path: '/signup',
    redirect: '/auth',
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('mobicash_auth_token')
      localStorage.removeItem('mobicash_user_data')
      localStorage.removeItem('mobicash_refresh_token')
      next('/auth')
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/')
      } else {
        next('/auth')
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - MobiCash Agent`
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      path: '/auth',
      query: { redirect: to.fullPath },
    })
    return
  }

  next()
})

router.afterEach(() => {
  // Navigation analytics could be added here if needed
})

export default router
