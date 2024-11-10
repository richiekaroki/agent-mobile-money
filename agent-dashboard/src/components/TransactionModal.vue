<template>
  <div class="p-4 bg-white rounded shadow sm:max-w-md sm:w-full">
    <h2 class="text-xl font-bold mb-4">Transaction Modal</h2>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <!-- Transaction Form -->
    <div v-else>
      <form @submit.prevent="submitTransaction" class="space-y-4">
        <!-- Date Picker -->
        <div>
          <input
            v-model="newTransaction.date"
            type="date"
            class="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <!-- Amount Input -->
        <div>
          <input
            v-model="newTransaction.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (KES)"
            class="px-4 py-2 border rounded w-full"
            required
            :class="{'border-red-500': amountError}"
          />
          <span v-if="amountError" class="text-red-500 text-sm">Please enter a valid amount.</span>
        </div>

        <!-- Transaction Type Dropdown -->
        <div>
          <select
            v-model="newTransaction.type"
            class="px-4 py-2 border rounded w-full"
            required
          >
            <option value="" disabled>Select Type</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="!isValid"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransactionModal',
  setup() {
    const store = useStore()

    // Reactive state for the new transaction
    const newTransaction = ref({
      date: '',
      amount: '',
      type: '',
    })

    // Loading and error states
    const loading = ref(true)
    const error = ref(null)
    const amountError = ref(false)

    // Validation logic
    const isValid = computed(() => {
      return (
        newTransaction.value.date &&
        newTransaction.value.amount &&
        !isNaN(newTransaction.value.amount) &&
        newTransaction.value.type
      )
    })

    // Fetch transactions or agent profile on mount
    onMounted(async () => {
      try {
        await store.dispatch('fetchTransactions')
      } catch (e) {
        error.value = 'Failed to load transactions'
      } finally {
        loading.value = false
      }
    })

    // Submit the transaction
    const submitTransaction = () => {
      if (isValid.value) {
        try {
          // Add the new transaction to the store
          store.dispatch('addTransaction', newTransaction.value)
          resetForm()
        } catch (err) {
          console.error('Error submitting transaction:', err)
          error.value = 'Transaction submission failed. Please try again later.'
        }
      } else {
        if (isNaN(newTransaction.value.amount)) {
          amountError.value = true
        }
      }
    }

    // Reset form after successful submission
    const resetForm = () => {
      newTransaction.value = { date: '', amount: '', type: '' }
      amountError.value = false
    }

    return {
      newTransaction,
      loading,
      error,
      isValid,
      submitTransaction,
      amountError,
    }
  },
}
</script>

<style scoped>
/* Mobile-first styling */
h2 {
  font-size: 1.25rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (min-width: 640px) {
  h2 {
    font-size: 1.5rem;
  }
}
</style>
