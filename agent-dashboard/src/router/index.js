// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginUser from '../views/LoginUser.vue'
import TransactionsView from '../views/TransactionsView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/transactions', name: 'Transactions', component: TransactionsView },
  { path: '/login', name: 'Login', component: LoginUser },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
