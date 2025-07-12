// src/store/index.js
import { createStore } from 'vuex'
import { fetchMockTransactions } from '../api/transactions'

export default createStore({
  state: {
    transactions: [],
    agentProfile: {
      name: 'Agent Name',
      balance: 0,
      agentId: '',
      phone: '',
      location: '',
      joinDate: '',
      status: '',
    },
    notifications: [],
    dashboardStats: {
      totalBalance: 0,
      todayTransactions: 0,
      pendingTransactions: 0,
      commissionEarned: 0,
      monthlyTarget: 5000,
      dailyTarget: 50,
    },
    errors: [],
  },
  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions
    },
    addTransaction(state, transaction) {
      state.transactions.unshift(transaction)
      state.dashboardStats.todayTransactions += 1
      if (transaction.status === 'pending') {
        state.dashboardStats.pendingTransactions += 1
      }
    },
    updateTransaction(state, updatedTransaction) {
      const index = state.transactions.findIndex(t => t.id === updatedTransaction.id)
      if (index !== -1) {
        state.transactions.splice(index, 1, updatedTransaction)
      }
    },
    deleteTransaction(state, transactionId) {
      state.transactions = state.transactions.filter(t => t.id !== transactionId)
    },
    setAgentProfile(state, profile) {
      state.agentProfile = profile
    },
    updateAgentBalance(state, newBalance) {
      state.agentProfile.balance = newBalance
    },
    addNotification(state, notification) {
      const newNotification = {
        id: Date.now() + Math.random(),
        type: notification.type || 'info',
        title: notification.title || '',
        message: notification.message || notification,
        autoDismiss: notification.autoDismiss !== false,
        duration: notification.duration || 5000,
        createdAt: Date.now(),
      }
      state.notifications.push(newNotification)

      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(-10)
      }
    },
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(notification => notification.id !== id)
    },
    clearNotifications(state) {
      state.notifications = []
    },
    setDashboardStats(state, stats) {
      state.dashboardStats = { ...state.dashboardStats, ...stats }
    },
    addError(state, error) {
      state.errors.push({
        timestamp: new Date().toISOString(),
        message: error.message || 'Unknown error occurred',
        stack: error.stack || '',
        context: error.context || '',
      })
    },
    clearErrors(state) {
      state.errors = []
    },
  },
  actions: {
    async fetchTransactions({ commit, state }) {
      try {
        if (state.transactions.length === 0) {
          const transactions = await fetchMockTransactions()
          commit('setTransactions', transactions)

          const today = new Date().toISOString().split('T')[0]
          const todayTransactions = transactions.filter(t => t.date === today).length
          const pendingTransactions = transactions.filter(t => t.status === 'pending').length

          commit('setDashboardStats', {
            todayTransactions,
            pendingTransactions,
          })
        }
      } catch (error) {
        commit('addError', {
          message: 'Failed to fetch transactions',
          stack: error.stack,
          context: 'fetchTransactions action',
        })
        commit('addNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch transactions. Please try again later.',
          autoDismiss: true,
        })
        throw error
      }
    },

    async fetchAgentProfile({ commit }) {
      try {
        const userData = localStorage.getItem('mobicash_user_data') || localStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          commit('setAgentProfile', user)

          commit('setDashboardStats', {
            totalBalance: user.balance || 0,
            commissionEarned: 2150,
            monthlyTarget: 5000,
            dailyTarget: 50,
          })
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        const demoProfile = {
          name: 'Demo Agent',
          balance: 10000,
          agentId: 'AG000',
          phone: '+254 700 000 000',
          location: 'Kenya',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
        }
        commit('setAgentProfile', demoProfile)

        commit('setDashboardStats', {
          totalBalance: demoProfile.balance,
          commissionEarned: 2150,
          monthlyTarget: 5000,
          dailyTarget: 50,
        })
      } catch (error) {
        commit('addError', {
          message: 'Failed to fetch agent profile',
          stack: error.stack,
          context: 'fetchAgentProfile action',
        })
        commit('addNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch agent profile.',
          autoDismiss: true,
        })
        throw error
      }
    },

    async addTransaction({ commit, state }, transaction) {
      try {
        const enrichedTransaction = {
          ...transaction,
          id: transaction.id || Date.now(),
          createdAt: transaction.createdAt || new Date().toISOString(),
          status: transaction.status || 'completed',
        }

        commit('addTransaction', enrichedTransaction)

        const amount = parseFloat(transaction.amount)
        const currentBalance = state.agentProfile.balance
        let newBalance = currentBalance

        if (transaction.type === 'deposit') {
          newBalance += amount * 0.01
        } else if (transaction.type === 'withdrawal') {
          newBalance += amount * 0.005
        }

        commit('updateAgentBalance', newBalance)

        commit('addNotification', {
          type: 'success',
          title: 'Transaction Created',
          message: `${transaction.type} of KES ${amount.toLocaleString()} processed successfully.`,
          autoDismiss: true,
        })
      } catch (error) {
        commit('addError', {
          message: 'Failed to add transaction',
          stack: error.stack,
          context: JSON.stringify(transaction),
        })
        commit('addNotification', {
          type: 'error',
          title: 'Transaction Failed',
          message: 'Failed to create transaction. Please try again.',
          autoDismiss: true,
        })
        throw error
      }
    },

    updateTransaction({ commit }, transaction) {
      commit('updateTransaction', transaction)
      commit('addNotification', {
        type: 'info',
        title: 'Transaction Updated',
        message: 'Transaction has been updated successfully.',
        autoDismiss: true,
      })
    },

    deleteTransaction({ commit }, transactionId) {
      commit('deleteTransaction', transactionId)
      commit('addNotification', {
        type: 'warning',
        title: 'Transaction Deleted',
        message: 'Transaction has been deleted.',
        autoDismiss: true,
      })
    },

    logError({ commit }, error) {
      commit('addError', {
        message: error.message || 'Unknown error',
        stack: error.stack || '',
        context: error.context || '',
      })

      if (process.env.NODE_ENV === 'development') {
        logger.error(error.message, error)
      }
    },

    showNotification({ commit }, notification) {
      commit('addNotification', notification)
    },

    dismissNotification({ commit }, notificationId) {
      commit('removeNotification', notificationId)
    },

    clearAllNotifications({ commit }) {
      commit('clearNotifications')
    },

    clearAllErrors({ commit }) {
      commit('clearErrors')
    },
  },
  getters: {
    getTransactions: state => state.transactions,
    getTransactionById: state => id => {
      return state.transactions.find(transaction => transaction.id === id)
    },
    getTransactionsByType: state => type => {
      return state.transactions.filter(transaction => transaction.type === type)
    },
    getTransactionsByDateRange: state => (startDate, endDate) => {
      return state.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return transactionDate >= start && transactionDate <= end
      })
    },
    getAgentProfile: state => state.agentProfile,
    getNotifications: state => state.notifications,
    getDashboardStats: state => state.dashboardStats,
    getTotalTransactionAmount: state => type => {
      return state.transactions
        .filter(t => !type || t.type === type)
        .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
    },
    getRecentTransactions:
      state =>
        (limit = 5) => {
          return state.transactions
            .slice()
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, limit)
        },
    getErrors: state => state.errors,
  },
})
