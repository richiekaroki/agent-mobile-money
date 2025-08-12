<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Recent Transactions
        </h2>
        <p class="text-sm text-gray-600">Latest {{ recentTransactions.length }} transactions</p>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Filter Toggle -->
        <button
          @click="showFilters = !showFilters"
          :class="[
            'p-2 rounded-lg transition-colors duration-200',
            showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
        </button>
        
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
    </div>

    <!-- Quick Filters -->
    <div v-if="showFilters" class="mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in quickFilters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-full transition-all duration-200',
            activeFilter === filter.value
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
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
    <div v-else-if="filteredTransactions.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <p class="text-gray-500">No transactions found</p>
      <button
        @click="activeFilter = 'all'"
        class="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Clear filters
      </button>
    </div>

    <!-- Enhanced Transaction List -->
    <div v-else class="space-y-1">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200"
        @click="$emit('selectTransaction', transaction)"
      >
        <div class="flex items-center space-x-3">
          <!-- Enhanced Transaction Icon with Animation -->
          <div class="relative">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110',
              getTransactionIconClass(transaction.type)
            ]">
              <svg class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <!-- Status Indicator -->
            <div :class="[
              'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
              getStatusIndicatorClass(transaction.status || 'completed')
            ]"></div>
          </div>

          <!-- Enhanced Transaction Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <p class="text-sm font-medium text-gray-900 capitalize">
                {{ transaction.type }}
              </p>
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(transaction.status || 'completed')
              ]">
                {{ transaction.status || 'completed' }}
              </span>
            </div>
            <div class="flex items-center space-x-2 mt-1">
              <p class="text-xs text-gray-500">
                {{ formatDate(transaction.date) }}
              </p>
              <span class="text-gray-300">•</span>
              <p class="text-xs text-gray-500">
                ID: {{ transaction.id }}
              </p>
              <span v-if="transaction.customerPhone" class="text-gray-300">•</span>
              <p v-if="transaction.customerPhone" class="text-xs text-gray-500">
                {{ formatPhone(transaction.customerPhone) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Enhanced Amount and Actions -->
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p :class="[
              'text-sm font-semibold',
              transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
            ]">
              {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </p>
            <p class="text-xs text-gray-500">
              Commission: +{{ formatCurrency(calculateCommission(transaction)) }}
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              @click.stop="quickAction(transaction, 'view')"
              class="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              title="View Details"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            <button
              @click.stop="quickAction(transaction, 'receipt')"
              class="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
              title="Print Receipt"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
            </button>
          </div>

          <!-- Arrow Icon -->
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Transaction Summary -->
    <div v-if="!loading && filteredTransactions.length > 0" class="mt-6 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-lg font-semibold text-green-600">{{ transactionSummary.deposits }}</p>
          <p class="text-xs text-gray-600">Deposits</p>
        </div>
        <div>
          <p class="text-lg font-semibold text-red-600">{{ transactionSummary.withdrawals }}</p>
          <p class="text-xs text-gray-600">Withdrawals</p>
        </div>
        <div>
          <p class="text-lg font-semibold text-purple-600">{{ transactionSummary.commission }}</p>
          <p class="text-xs text-gray-600">Commission</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'EnhancedRecentTransactions',
  emits: ['selectTransaction'],
  setup(props, { emit }) {
    const store = useStore()
    const loading = ref(true)
    const showFilters = ref(false)
    const activeFilter = ref('all')

    const transactions = computed(() => store.getters.getTransactions)

    const quickFilters = [
      { label: 'All', value: 'all' },
      { label: 'Today', value: 'today' },
      { label: 'Deposits', value: 'deposit' },
      { label: 'Withdrawals', value: 'withdrawal' },
      { label: 'Pending', value: 'pending' }
    ]

    const recentTransactions = computed(() => {
      return transactions.value
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 8)
    })

    const filteredTransactions = computed(() => {
      let filtered = recentTransactions.value

      switch (activeFilter.value) {
        case 'today':
          const today = new Date().toISOString().split('T')[0]
          filtered = filtered.filter(t => t.date === today)
          break
        case 'deposit':
        case 'withdrawal':
          filtered = filtered.filter(t => t.type === activeFilter.value)
          break
        case 'pending':
          filtered = filtered.filter(t => (t.status || 'completed') === 'pending')
          break
      }

      return filtered
    })

    const transactionSummary = computed(() => {
      const deposits = filteredTransactions.value.filter(t => t.type === 'deposit')
      const withdrawals = filteredTransactions.value.filter(t => t.type === 'withdrawal')
      
      const depositAmount = deposits.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const withdrawalAmount = withdrawals.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const commission = deposits.reduce((sum, t) => sum + parseFloat(t.amount) * 0.01, 0) +
                        withdrawals.reduce((sum, t) => sum + parseFloat(t.amount) * 0.005, 0)

      return {
        deposits: `KES ${depositAmount.toLocaleString()}`,
        withdrawals: `KES ${withdrawalAmount.toLocaleString()}`,
        commission: `KES ${commission.toLocaleString()}`
      }
    })

    const getTransactionIconClass = (type) => {
      return type === 'deposit' 
        ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
        : 'bg-red-100 text-red-600 group-hover:bg-red-200'
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'failed': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getStatusIndicatorClass = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-500'
        case 'pending': return 'bg-yellow-500'
        case 'failed': return 'bg-red-500'
        default: return 'bg-gray-500'
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return 'Today'
      if (diffDays === 2) return 'Yesterday'
      if (diffDays <= 7) return `${diffDays - 1} days ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount) => {
      return `KES ${parseFloat(amount).toLocaleString()}`
    }

    const formatPhone = (phone) => {
      if (!phone) return 'N/A'
      return phone.replace(/(\+254)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
    }

    const calculateCommission = (transaction) => {
      const amount = parseFloat(transaction.amount)
      return transaction.type === 'deposit' ? amount * 0.01 : amount * 0.005
    }

    const quickAction = (transaction, action) => {
      switch (action) {
        case 'view':
          emit('selectTransaction', transaction)
          break
        case 'receipt':
          store.dispatch('showNotification', {
            type: 'info',
            title: 'Receipt',
            message: 'Receipt is being prepared...',
            autoDismiss: true
          })
          break
      }
    }

    onMounted(async () => {
      try {
        if (transactions.value.length === 0) {
          await store.dispatch('fetchTransactions')
        }
      } catch (error) {
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to load transactions',
          autoDismiss: true
        })
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 800)
      }
    })

    return {
      loading,
      showFilters,
      activeFilter,
      quickFilters,
      recentTransactions,
      filteredTransactions,
      transactionSummary,
      getTransactionIconClass,
      getStatusClass,
      getStatusIndicatorClass,
      formatDate,
      formatCurrency,
      formatPhone,
      calculateCommission,
      quickAction
    }
  }
}
</script>