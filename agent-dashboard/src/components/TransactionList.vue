<template>
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <!-- Main Heading Centered -->
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">Transactions</h1>

    <!-- Error Display -->
    <div v-if="error" class="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- New Transaction Section -->
    <div class="mb-8 p-4 sm:p-6 bg-white rounded shadow-md">
      <h3 class="text-xl sm:text-2xl font-semibold text-center mb-4">Create New Transaction</h3>
      <form @submit.prevent="submitTransaction" class="space-y-4">
        <div class="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <!-- Date Picker -->
          <input
            v-model="newTransaction.date"
            type="date"
            class="px-4 py-2 border rounded w-full sm:w-1/3"
            required
            aria-label="Transaction Date"
          />

          <!-- Amount Input -->
          <input
            v-model="newTransaction.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (KES)"
            class="px-4 py-2 border rounded w-full sm:w-1/3"
            required
            aria-label="Transaction Amount"
          />

          <!-- Transaction Type Dropdown -->
          <select
            v-model="newTransaction.type"
            class="px-4 py-2 border rounded w-full sm:w-1/3"
            required
            aria-label="Transaction Type"
          >
            <option value="" disabled>Select Type</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>

        <!-- Validation Message -->
        <div v-if="newTransaction.amount <= 0" class="text-red-600 text-sm">
          Amount must be greater than 0.
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Add Transaction"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>

    <!-- Transaction History Section -->
    <div class="bg-white rounded shadow-md p-4 sm:p-6">
      <h3 class="text-xl sm:text-2xl font-semibold text-center mb-4">Transaction History</h3>

      <!-- Filter Controls -->
      <div
        class="mb-4 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0"
      >
        <div class="flex space-x-4">
          <input
            v-model="startDate"
            type="date"
            class="px-4 py-2 border rounded w-full sm:w-1/3"
            placeholder="Start Date"
            aria-label="Start Date"
          />
          <input
            v-model="endDate"
            type="date"
            class="px-4 py-2 border rounded w-full sm:w-1/3"
            placeholder="End Date"
            aria-label="End Date"
          />
        </div>

        <select
          v-model="typeFilter"
          class="px-4 py-2 border rounded w-full sm:w-1/3 mt-4 sm:mt-0"
          aria-label="Transaction Type Filter"
        >
          <option value="">All Types</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="deposit">Deposit</option>
        </select>
      </div>

      <!-- Loading State with Spinner -->
      <div v-if="loading" class="text-center">
        <div class="spinner"></div>
        <p>Loading transactions...</p>
      </div>

      <!-- No Transactions Found State -->
      <div v-else-if="filteredTransactions.length === 0" class="text-center">
        No transactions found.
      </div>

      <!-- Transaction List -->
      <ul v-else>
        <li
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          class="mb-4 p-4 border-b cursor-pointer hover:bg-gray-50"
          @click="$emit('selectTransaction', transaction)"
          role="listitem"
          aria-label="Transaction"
        >
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">{{ formatDate(transaction.date) }}</span>
            <span class="text-sm text-gray-600 capitalize">{{ transaction.type }}</span>
            <span
              :class="[
                'text-sm font-semibold',
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ transaction.type === 'deposit' ? '+' : '-'
              }}{{ formatCurrency(transaction.amount) }}
            </span>
          </div>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center mt-4">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          aria-label="Previous Page"
        >
          &#8592; Previous
        </button>

        <!-- Page Numbers -->
        <div class="flex space-x-2 mx-4">
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'px-4 py-2 rounded',
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200',
            ]"
            @click="goToPage(page)"
            aria-label="Go to page {{ page }}"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          aria-label="Next Page"
        >
          Next &#8594;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { fetchMockTransactions } from '../api/transactions'

export default {
  name: 'TransactionList',
  props: {
    page: {
      type: Number,
      default: 1,
    },
    transactionsPerPage: {
      type: Number,
      default: 10,
    },
  },
  setup(props, { emit }) {
    const _store = useStore() // Changed to _store since it's unused
    const transactions = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentPage = ref(props.page)

    // Filter states
    const startDate = ref('')
    const endDate = ref('')
    const typeFilter = ref('')

    // New transaction data
    const newTransaction = ref({
      date: '',
      amount: '',
      type: '',
    })

    const fetchTransactions = async () => {
      try {
        const data = await fetchMockTransactions()
        transactions.value = data
      } catch (_err) {
        // Changed to _err since it's unused
        error.value = 'Failed to load transactions. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    const formatDate = dateString => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const formatCurrency = amount => {
      return `KES ${parseFloat(amount).toLocaleString()}`
    }

    // Filtered transactions
    const filteredTransactions = computed(() => {
      return transactions.value.filter(transaction => {
        const matchesDate =
          (!startDate.value || transaction.date >= startDate.value) &&
          (!endDate.value || transaction.date <= endDate.value)

        const matchesType = typeFilter.value ? transaction.type === typeFilter.value : true

        return matchesDate && matchesType
      })
    })

    // Paginate transactions
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * props.transactionsPerPage
      const end = currentPage.value * props.transactionsPerPage
      return filteredTransactions.value.slice(start, end)
    })

    // Total pages
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / props.transactionsPerPage)
    })

    // Pagination logic
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        emit('changePage', currentPage.value)
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        emit('changePage', currentPage.value)
      }
    }

    const goToPage = page => {
      currentPage.value = page
      emit('changePage', currentPage.value)
    }

    // Submit new transaction
    const submitTransaction = () => {
      const { date, amount, type } = newTransaction.value

      if (!date || !amount || !type) {
        error.value = 'Please fill out all required fields'
        return
      }

      if (parseFloat(amount) <= 0) {
        error.value = 'Amount must be greater than 0'
        return
      }

      const newTxn = {
        id: Date.now(),
        date,
        amount: parseFloat(amount).toFixed(2),
        type,
        status: 'completed',
        createdAt: new Date().toISOString(),
      }

      transactions.value.unshift(newTxn)
      newTransaction.value = { date: '', amount: '', type: '' }
      error.value = null
    }

    // Fetch transactions on mount
    onMounted(() => {
      fetchTransactions()
    })

    return {
      filteredTransactions,
      loading,
      error,
      paginatedTransactions,
      currentPage,
      totalPages,
      previousPage,
      nextPage,
      goToPage,
      startDate,
      endDate,
      typeFilter,
      newTransaction,
      submitTransaction,
      formatDate,
      formatCurrency,
    }
  },
}
</script>

<style scoped>
.spinner {
  border: 4px solid transparent;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
