// src/store/index.js
import { createStore } from 'vuex'
import { fetchMockTransactions } from '../api/transactions'

export default createStore({
  state: {
    transactions: [],
    agentProfile: {
      name: 'Agent Name',
      balance: 0,
    },
    notifications: [],
  },
  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions
    },
    addTransaction(state, transaction) {
      state.transactions.push(transaction)
    },
    setAgentProfile(state, profile) {
      state.agentProfile = profile
    },
    addNotification(state, message) {
      const newNotification = {
        id: Date.now(),  // Using timestamp as a simple unique ID
        message: message,
      }
      state.notifications.push(newNotification)
    },
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(notification => notification.id !== id)
    },
    clearNotifications(state) {
      state.notifications = []
    },
  },
  actions: {
    async fetchTransactions({ commit }) {
      try {
        const transactions = await fetchMockTransactions()
        commit('setTransactions', transactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        commit('addNotification', 'Failed to fetch transactions. Please try again later.')
      }
    },
    fetchAgentProfile({ commit }) {
      const mockProfile = { name: 'Richard Karoki', balance: 1000 }
      commit('setAgentProfile', mockProfile)
    },
    addTransaction({ commit }, transaction) {
      commit('addTransaction', transaction)
      commit('addNotification', 'New transaction added!')
    },
  },
  getters: {
    getTransactions: (state) => state.transactions,
    getAgentProfile: (state) => state.agentProfile,
  },
})

