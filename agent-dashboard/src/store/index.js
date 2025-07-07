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
    dashboardStats: {
      totalBalance: 0,
      todayTransactions: 0,
      pendingTransactions: 0,
      commissionEarned: 0,
      monthlyTarget: 5000,
      dailyTarget: 50
    }
  },
  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions
    },
    addTransaction(state, transaction) {
      state.transactions.unshift(transaction) // Add to beginning for recent transactions
      // Update dashboard stats
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
        id: Date.now() + Math.random(), // More unique ID
        type: notification.type || 'info',
        title: notification.title || '',
        message: notification.message || notification, // Support both string and object
        autoDismiss: notification.autoDismiss !== false, // Default to true
        duration: notification.duration || 5000,
        createdAt: Date.now(),
      }
      state.notifications.push(newNotification)
      
      // Limit notifications to prevent memory issues
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
    }
  },
  actions: {
    async fetchTransactions({ commit, state }) {
      try {
        // Only fetch if we don't have transactions already
        if (state.transactions.length === 0) {
          const transactions = await fetchMockTransactions()
          commit('setTransactions', transactions)
          
          // Calculate dashboard stats from transactions
          const today = new Date().toISOString().split('T')[0]
          const todayTransactions = transactions.filter(t => t.date === today).length
          const pendingTransactions = transactions.filter(t => t.status === 'pending').length
          
          commit('setDashboardStats', {
            todayTransactions,
            pendingTransactions
          })
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        commit('addNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch transactions. Please try again later.',
          autoDismiss: true
        })
        throw error
      }
    },
    
    async fetchAgentProfile({ commit }) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockProfile = { 
          name: 'Richard Karoki', 
          balance: 45250,
          agentId: 'AG001',
          phone: '+254 700 123 456',
          location: 'Nairobi, Kenya',
          joinDate: '2023-01-15',
          status: 'active'
        }
        commit('setAgentProfile', mockProfile)
        
        // Update dashboard stats
        commit('setDashboardStats', {
          totalBalance: mockProfile.balance,
          commissionEarned: 2150,
          monthlyTarget: 5000,
          dailyTarget: 50
        })
      } catch (error) {
        console.error('Error fetching agent profile:', error)
        commit('addNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch agent profile.',
          autoDismiss: true
        })
        throw error
      }
    },
    
    addTransaction({ commit, state }, transaction) {
      try {
        // Add transaction with additional metadata
        const enrichedTransaction = {
          ...transaction,
          id: transaction.id || Date.now(),
          createdAt: transaction.createdAt || new Date().toISOString(),
          status: transaction.status || 'completed'
        }
        
        commit('addTransaction', enrichedTransaction)
        
        // Update agent balance based on transaction type
        const amount = parseFloat(transaction.amount)
        const currentBalance = state.agentProfile.balance
        let newBalance = currentBalance
        
        if (transaction.type === 'deposit') {
          newBalance += amount * 0.01 // 1% commission on deposits
        } else if (transaction.type === 'withdrawal') {
          newBalance += amount * 0.005 // 0.5% commission on withdrawals
        }
        
        commit('updateAgentBalance', newBalance)
        
        // Add success notification
        commit('addNotification', {
          type: 'success',
          title: 'Transaction Created',
          message: `${transaction.type} of KES ${amount.toLocaleString()} has been processed successfully.`,
          autoDismiss: true
        })
        
      } catch (error) {
        console.error('Error adding transaction:', error)
        commit('addNotification', {
          type: 'error',
          title: 'Transaction Failed',
          message: 'Failed to create transaction. Please try again.',
          autoDismiss: true
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
        autoDismiss: true
      })
    },
    
    deleteTransaction({ commit }, transactionId) {
      commit('deleteTransaction', transactionId)
      commit('addNotification', {
        type: 'warning',
        title: 'Transaction Deleted',
        message: 'Transaction has been deleted.',
        autoDismiss: true
      })
    },
    
    // Notification actions
    showNotification({ commit }, notification) {
      commit('addNotification', notification)
    },
    
    dismissNotification({ commit }, notificationId) {
      commit('removeNotification', notificationId)
    },
    
    clearAllNotifications({ commit }) {
      commit('clearNotifications')
    }
  },
  getters: {
    getTransactions: (state) => state.transactions,
    getTransactionById: (state) => (id) => {
      return state.transactions.find(transaction => transaction.id === id)
    },
    getTransactionsByType: (state) => (type) => {
      return state.transactions.filter(transaction => transaction.type === type)
    },
    getTransactionsByDateRange: (state) => (startDate, endDate) => {
      return state.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return transactionDate >= start && transactionDate <= end
      })
    },
    getAgentProfile: (state) => state.agentProfile,
    getNotifications: (state) => state.notifications,
    getDashboardStats: (state) => state.dashboardStats,
    getTotalTransactionAmount: (state) => (type) => {
      return state.transactions
        .filter(t => !type || t.type === type)
        .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
    },
    getRecentTransactions: (state) => (limit = 5) => {
      return state.transactions
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, limit)
    }
  },
})