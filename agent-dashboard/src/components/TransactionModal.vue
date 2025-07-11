<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="closeModal"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">New Transaction</h2>
      <button
        @click="closeModal"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Close modal"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="spinner"></div>
          <span class="ml-3 text-gray-600">Processing...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="text-red-800 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Transaction Form -->
        <form v-else @submit.prevent="submitTransaction" class="space-y-6">
          <!-- Transaction Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Transaction Type </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="newTransaction.type = 'deposit'"
                :class="[
                  'p-4 border-2 rounded-lg text-center transition-all duration-200',
                  newTransaction.type === 'deposit'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                <svg
                  class="w-6 h-6 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span class="text-sm font-medium">Deposit</span>
              </button>

              <button
                type="button"
                @click="newTransaction.type = 'withdrawal'"
                :class="[
                  'p-4 border-2 rounded-lg text-center transition-all duration-200',
                  newTransaction.type === 'withdrawal'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                <svg
                  class="w-6 h-6 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  ></path>
                </svg>
                <span class="text-sm font-medium">Withdrawal</span>
              </button>
            </div>
          </div>

          <!-- Amount Input -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
              Amount (KES)
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 text-sm">KES</span>
              </div>
              <input
                id="amount"
                v-model="newTransaction.amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                class="input-field pl-12"
                :class="{ 'border-red-500 focus:ring-red-500': amountError }"
                required
              />
            </div>
            <p v-if="amountError" class="mt-1 text-sm text-red-600">
              Please enter a valid amount greater than 0.
            </p>
          </div>

          <!-- Customer Phone (for deposits/withdrawals) -->
          <div>
            <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone Number
            </label>
            <input
              id="customerPhone"
              v-model="newTransaction.customerPhone"
              type="tel"
              placeholder="+254 700 000 000"
              class="input-field"
              required
            />
          </div>

          <!-- Date Picker -->
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
              Transaction Date
            </label>
            <input
              id="date"
              v-model="newTransaction.date"
              type="date"
              class="input-field"
              :max="today"
              required
            />
          </div>

          <!-- Notes (Optional) -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="newTransaction.notes"
              rows="3"
              placeholder="Add any additional notes..."
              class="input-field resize-none"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex space-x-3 pt-4">
            <button type="button" @click="closeModal" class="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isValid || submitting"
              class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center justify-center">
                <div class="spinner mr-2"></div>
                Processing...
              </span>
              <span v-else>Create Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransactionModal',
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore()

    // Form state
    const newTransaction = ref({
      type: '',
      amount: '',
      customerPhone: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    })

    // Component state
    const loading = ref(false)
    const submitting = ref(false)
    const error = ref(null)
    const amountError = ref(false)

    // Computed properties
    const today = computed(() => new Date().toISOString().split('T')[0])

    const isValid = computed(() => {
      return (
        newTransaction.value.type &&
        newTransaction.value.amount &&
        !isNaN(newTransaction.value.amount) &&
        parseFloat(newTransaction.value.amount) > 0 &&
        newTransaction.value.customerPhone &&
        newTransaction.value.date
      )
    })

    // Methods
    const closeModal = () => {
      emit('close')
    }

    const validateAmount = () => {
      const amount = parseFloat(newTransaction.value.amount)
      amountError.value = isNaN(amount) || amount <= 0
      return !amountError.value
    }

    const submitTransaction = async () => {
      if (!isValid.value || !validateAmount()) {
        return
      }

      submitting.value = true
      error.value = null

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const transactionData = {
          id: Date.now(), // Simple ID generation
          type: newTransaction.value.type,
          amount: parseFloat(newTransaction.value.amount).toFixed(2),
          customerPhone: newTransaction.value.customerPhone,
          date: newTransaction.value.date,
          notes: newTransaction.value.notes,
          status: 'completed',
          createdAt: new Date().toISOString(),
        }

        // Add to store
        await store.dispatch('addTransaction', transactionData)

        // Emit success event
        emit('success', transactionData)

        // Reset form
        resetForm()
      } catch (err) {
        error.value = 'Transaction submission failed. Please try again.'
        store.dispatch('logError', {
          message: 'Transaction submission error',
          error: err,
          context: {
            transactionData: newTransaction.value,
          },
        })
      } finally {
        submitting.value = false
      }
    }

    const resetForm = () => {
      newTransaction.value = {
        type: '',
        amount: '',
        customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      }
      amountError.value = false
      error.value = null
    }

    onMounted(() => {
      // Focus on first input when modal opens
      setTimeout(() => {
        const firstButton = document.querySelector('[data-transaction-type]')
        if (firstButton) firstButton.focus()
      }, 100)
    })

    return {
      newTransaction,
      loading,
      submitting,
      error,
      amountError,
      today,
      isValid,
      closeModal,
      submitTransaction,
      validateAmount,
    }
  },
}
</script>

<style scoped>
.spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin;
}
</style>
