<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Main Heading Centered -->
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">Transactions</h1>

    <!-- New Transaction Section -->
    <div class="mb-8 p-6 bg-white rounded shadow-md">
      <h3 class="text-2xl font-semibold text-center mb-4">Create New Transaction</h3>
      <form @submit.prevent="submitTransaction" class="space-y-4">
        <div class="flex justify-between">
          <!-- Date Picker -->
          <input
            v-model="newTransaction.date"
            type="date"
            class="px-4 py-2 border rounded w-1/3"
            required
          />

          <!-- Amount Input -->
          <input
            v-model="newTransaction.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (KES)"
            class="px-4 py-2 border rounded w-1/3"
            required
          />

          <!-- Transaction Type Dropdown -->
          <select v-model="newTransaction.type" class="px-4 py-2 border rounded w-1/3" required>
            <option value="" disabled>Select Type</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Transaction
          </button>
        </div>
      </form>
    </div>

    <!-- Transaction History Section -->
    <div class="bg-white rounded shadow-md p-6">
      <h3 class="text-2xl font-semibold text-center mb-4">Transaction History</h3>

      <!-- Filter Controls -->
      <div class="mb-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <input
            v-model="startDate"
            type="date"
            class="px-4 py-2 border rounded"
            placeholder="Start Date"
          />
          <input
            v-model="endDate"
            type="date"
            class="px-4 py-2 border rounded"
            placeholder="End Date"
          />
        </div>

        <select v-model="typeFilter" class="px-4 py-2 border rounded">
          <option value="">All Types</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="deposit">Deposit</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center">Loading transactions...</div>

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
        >
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">{{ transaction.date }}</span>
            <span class="text-sm text-gray-600">{{ transaction.type }}</span>
            <span class="text-sm text-gray-600">{{ transaction.amount }} KES</span>
          </div>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center mt-4">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
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
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Next &#8594;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
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
  setup(props) {
    const transactions = ref([])
    const loading = ref(true)
    const currentPage = ref(props.page)

    // Filter states
    const startDate = ref('')
    const endDate = ref('')
    const typeFilter = ref('')

    // New transaction data (for creating a transaction)
    const newTransaction = ref({
      date: '',
      amount: '',
      type: '',
    })

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const data = await fetchMockTransactions()
        transactions.value = data
        loading.value = false
      } catch (error) {
        console.error('Error fetching transactions:', error)
        loading.value = false
      }
    }

    // Watch for page changes
    watch(
      () => props.page,
      (newPage) => {
        currentPage.value = newPage
      },
    )

    // Filtered transactions
    const filteredTransactions = computed(() => {
      return transactions.value.filter((transaction) => {
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
        emitPageChange()
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        emitPageChange()
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
      emitPageChange()
    }

    const emitPageChange = () => {
      this.$emit('changePage', currentPage.value)
    }

    // Submit new transaction
    const submitTransaction = () => {
      const { date, amount, type } = newTransaction.value
      if (date && amount && type) {
        const newTxn = {
          id: transactions.value.length + 1, // Assuming simple id generation
          date,
          amount: parseFloat(amount).toFixed(2),
          type,
        }
        transactions.value.push(newTxn) // Add transaction to list
        resetForm() // Reset form after submission
      } else {
        alert('Please fill out all fields.')
      }
    }

    // Reset form after submission
    const resetForm = () => {
      newTransaction.value = { date: '', amount: '', type: '' }
    }

    // Fetch transactions when component mounts
    onMounted(() => {
      fetchTransactions()
    })

    return {
      filteredTransactions,
      loading,
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
    }
  },
}
</script>

<style scoped>
/* Styling to make the layout clean and aligned */
h1 {
  font-size: 2.5rem;
}

h3 {
  font-size: 1.5rem;
}

input[type='date'],
input[type='number'],
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
