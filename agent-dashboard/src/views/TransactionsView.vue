<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Transaction Management</h1>
        <p class="text-gray-600">Monitor and manage all your mobile money transactions</p>
      </div>
      <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          @click="exportTransactions"
          class="btn btn-secondary flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Export
        </button>
        <button
          @click="showNewTransactionModal = true"
          class="btn btn-primary flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          New Transaction
        </button>
      </div>
    </div>

    <!-- Transaction Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Transactions"
        :value="transactionStats.total"
        subtitle="All time"
        valueColor="text-blue-600"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        :icon="TransactionIcon"
      />
      <StatCard
        title="Total Deposits"
        :value="formatCurrency(transactionStats.totalDeposits)"
        subtitle="This month"
        valueColor="text-green-600"
        iconBg="bg-green-100"
        iconColor="text-green-600"
        :icon="DepositIcon"
        :change="{ type: 'increase', value: 12.5 }"
      />
      <StatCard
        title="Total Withdrawals"
        :value="formatCurrency(transactionStats.totalWithdrawals)"
        subtitle="This month"
        valueColor="text-red-600"
        iconBg="bg-red-100"
        iconColor="text-red-600"
        :icon="WithdrawalIcon"
        :change="{ type: 'decrease', value: 3.2 }"
      />
      <StatCard
        title="Commission Earned"
        :value="formatCurrency(transactionStats.commission)"
        subtitle="This month"
        valueColor="text-purple-600"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        :icon="CommissionIcon"
        :change="{ type: 'increase', value: 8.7 }"
      />
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search transactions..."
            class="input-field pl-10"
          />
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select v-model="filters.type" class="input-field min-w-[140px]">
            <option value="">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>

          <select v-model="filters.status" class="input-field min-w-[140px]">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input
            v-model="filters.startDate"
            type="date"
            class="input-field"
            placeholder="Start Date"
          />

          <input v-model="filters.endDate" type="date" class="input-field" placeholder="End Date" />

          <button @click="clearFilters" class="btn btn-secondary whitespace-nowrap">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Transactions ({{ filteredTransactions.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Show:</span>
            <select v-model="itemsPerPage" class="text-sm border border-gray-300 rounded px-2 py-1">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center space-x-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
        <svg
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        <p class="text-gray-500 mb-6">
          Try adjusting your search criteria or create a new transaction.
        </p>
        <button @click="showNewTransactionModal = true" class="btn btn-primary">
          Create New Transaction
        </button>
      </div>

      <!-- Transaction Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Transaction
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                      transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      :class="transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  <div>
                    <div class="text-sm font-medium text-gray-900 capitalize">
                      {{ transaction.type }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ transaction.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ transaction.customerPhone || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  :class="[
                    'text-sm font-semibold',
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600',
                  ]"
                >
                  {{ transaction.type === 'deposit' ? '+' : '-'
                  }}{{ formatCurrency(transaction.amount) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusClass(transaction.status || 'completed'),
                  ]"
                >
                  {{ transaction.status || 'completed' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ formatDate(transaction.date) }}</div>
                <div class="text-xs text-gray-400">
                  {{ formatTime(transaction.createdAt || transaction.date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewTransaction(transaction)"
                    class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                  >
                    View
                  </button>
                  <button
                    @click="editTransaction(transaction)"
                    class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of
            {{ filteredTransactions.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-1 text-sm border rounded-md',
                  currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <TransactionDetailModal
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @close="selectedTransaction = null"
      @updated="handleTransactionUpdated"
    />

    <!-- New Transaction Modal -->
    <TransactionModal
      v-if="showNewTransactionModal"
      @close="showNewTransactionModal = false"
      @success="handleTransactionSuccess"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import StatCard from '../components/StatCard.vue'
import TransactionDetailModal from '../components/TransactionDetailModal.vue'
import TransactionModal from '../components/TransactionModal.vue'

// Icons
const TransactionIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
}

const DepositIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>',
}

const WithdrawalIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>',
}

const CommissionIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
}

export default {
  name: 'TransactionsView',
  components: {
    StatCard,
    TransactionModal,
    TransactionDetailModal,
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    const showNewTransactionModal = ref(false)
    const selectedTransaction = ref(null)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const filters = ref({
      type: '',
      status: '',
      startDate: '',
      endDate: '',
    })

    // Computed properties
    const transactions = computed(() => store.getters.getTransactions)

    const filteredTransactions = computed(() => {
      let filtered = transactions.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
          transaction =>
            transaction.id.toString().includes(query) ||
            (transaction.customerPhone &&
              transaction.customerPhone.toLowerCase().includes(query)) ||
            transaction.type.toLowerCase().includes(query)
        )
      }

      // Type filter
      if (filters.value.type) {
        filtered = filtered.filter(transaction => transaction.type === filters.value.type)
      }

      // Status filter
      if (filters.value.status) {
        filtered = filtered.filter(
          transaction => (transaction.status || 'completed') === filters.value.status
        )
      }

      // Date range filter
      if (filters.value.startDate) {
        filtered = filtered.filter(transaction => transaction.date >= filters.value.startDate)
      }
      if (filters.value.endDate) {
        filtered = filtered.filter(transaction => transaction.date <= filters.value.endDate)
      }

      return filtered.sort(
        (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      )
    })

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredTransactions.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i)
          pages.push('...', total)
        } else if (current >= total - 3) {
          pages.push(1, '...')
          for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
          pages.push(1, '...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...', total)
        }
      }

      return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
    })

    const transactionStats = computed(() => {
      const deposits = transactions.value.filter(t => t.type === 'deposit')
      const withdrawals = transactions.value.filter(t => t.type === 'withdrawal')

      return {
        total: transactions.value.length,
        totalDeposits: deposits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
        totalWithdrawals: withdrawals.reduce((sum, t) => sum + parseFloat(t.amount), 0),
        commission:
          deposits.reduce((sum, t) => sum + parseFloat(t.amount) * 0.01, 0) +
          withdrawals.reduce((sum, t) => sum + parseFloat(t.amount) * 0.005, 0),
      }
    })

    // Methods
    const formatCurrency = amount => {
      return `KES ${parseFloat(amount).toLocaleString()}`
    }

    const formatDate = dateString => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const formatTime = dateString => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const getStatusClass = status => {
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

    const clearFilters = () => {
      filters.value = {
        type: '',
        status: '',
        startDate: '',
        endDate: '',
      }
      searchQuery.value = ''
      currentPage.value = 1
    }

    const viewTransaction = transaction => {
      selectedTransaction.value = transaction
    }

    const editTransaction = transaction => {
      selectedTransaction.value = transaction
    }

    const exportTransactions = () => {
      store.dispatch('showNotification', {
        type: 'info',
        title: 'Export Started',
        message: 'Your transaction export is being prepared...',
        autoDismiss: true,
      })
    }

    const handleTransactionSuccess = () => {
      showNewTransactionModal.value = false
    }

    const handleTransactionUpdated = () => {
      selectedTransaction.value = null
    }

    // Watch for filter changes to reset pagination
    watch(
      [filters, searchQuery],
      () => {
        currentPage.value = 1
      },
      { deep: true }
    )

    // Load data on mount
    onMounted(async () => {
      try {
        await store.dispatch('fetchTransactions')
      } catch (_error) {
        // Changed to _error since it's unused
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Error Loading Transactions',
          message: 'Failed to load transactions. Please try again later.',
          autoDismiss: false,
        })
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 800)
      }
    })

    return {
      loading,
      showNewTransactionModal,
      selectedTransaction,
      searchQuery,
      currentPage,
      itemsPerPage,
      filters,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      visiblePages,
      transactionStats,
      formatCurrency,
      formatDate,
      formatTime,
      getStatusClass,
      clearFilters,
      viewTransaction,
      editTransaction,
      exportTransactions,
      handleTransactionSuccess,
      handleTransactionUpdated,
      TransactionIcon,
      DepositIcon,
      WithdrawalIcon,
      CommissionIcon,
    }
  },
}
</script>
<template>
  <div class="transactions-container">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
      <p class="text-gray-600">Manage and view all your transaction history</p>
    </div>

    <!-- Transaction List -->
    <div class="bg-white rounded-lg shadow">
      <TransactionList />
    </div>

    <!-- Transaction Modal -->
    <TransactionModal />

    <!-- Transaction Detail Modal -->
    <TransactionDetailModal />
  </div>
</template>

<script>
import TransactionList from '../components/TransactionList.vue'
import TransactionModal from '../components/TransactionModal.vue'
import TransactionDetailModal from '../components/TransactionDetailModal.vue'

export default {
  name: 'TransactionsView',
  components: {
    TransactionList,
    TransactionModal,
    TransactionDetailModal
  },
  async mounted() {
    try {
      // Ensure transactions are loaded
      await this.$store.dispatch('fetchTransactions')
    } catch (error) {
      console.error('Error loading transactions:', error)
      this.$store.dispatch('showNotification', {
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load transactions. Please refresh the page.',
        autoDismiss: true
      })
    }
  }
}
</script>

<style scoped>
.transactions-container {
  @apply p-6 max-w-7xl mx-auto;
}

@media (max-width: 768px) {
  .transactions-container {
    @apply p-4;
  }
}
</style>
