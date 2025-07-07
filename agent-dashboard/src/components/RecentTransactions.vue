<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        Recent Transactions
      </h2>
      <router-link 
        to="/transactions" 
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors duration-200"
      >
        View all
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="flex items-center space-x-4 p-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- No Transactions -->
    <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <p class="text-gray-500">No recent transactions</p>
    </div>

    <!-- Transaction List -->
    <div v-else class="space-y-1">
      <div 
        v-for="transaction in recentTransactions" 
        :key="transaction.id"
        class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
        @click="$emit('selectTransaction', transaction)"
      >
        <div class="flex items-center space-x-3">
          <!-- Transaction Icon -->
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            getTransactionIconClass(transaction.type)
          ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="transaction.type === 'deposit'" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M20 12H4"
              ></path>
            </svg>
          </div>

          <!-- Transaction Details -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 capitalize">
              {{ transaction.type }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(transaction.date) }}
            </p>
          </div>
        </div>

        <!-- Amount and Status -->
        <div class="text-right">
          <p :class="[
            'text-sm font-semibold',
            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </p>
          <span :class="[
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
            getStatusClass(transaction.status || 'completed')
          ]">
            {{ transaction.status || 'completed' }}
          </span>
        </div>

        <!-- Arrow Icon -->
        <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-2 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RecentTransactions',
  emits: ['selectTransaction'],
  setup() {
    const store = useStore()
    const loading = ref(true)

    const transactions = computed(() => store.getters.getTransactions)
    
    const recentTransactions = computed(() => {
      return transactions.value
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    })

    const getTransactionIconClass = (type) => {
      return type === 'deposit' 
        ? 'bg-green-100 text-green-600' 
        : 'bg-red-100 text-red-600'
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'failed':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        return 'Today'
      } else if (diffDays === 2) {
        return 'Yesterday'
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
    }

    const formatCurrency = (amount) => {
      return `KES ${parseFloat(amount).toLocaleString()}`
    }

    onMounted(async () => {
      try {
        if (transactions.value.length === 0) {
          await store.dispatch('fetchTransactions')
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 800)
      }
    })

    return {
      loading,
      recentTransactions,
      getTransactionIconClass,
      getStatusClass,
      formatDate,
      formatCurrency
    }
  }
}
</script>