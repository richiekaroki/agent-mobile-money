// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AuthView from '../views/AuthView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import authService from '../services/authService'

// Auth guard
const requireAuth = (to, from, next) => {
  if (authService.isAuthenticated()) {
    next()
  } else {
    next('/auth')
  }
}

const redirectIfAuth = (to, from, next) => {
  if (authService.isAuthenticated()) {
    next('/')
  } else {
    next()
  }
}