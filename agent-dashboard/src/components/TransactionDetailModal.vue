<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
    <div
      class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
          ]">
            <svg class="w-5 h-5" :class="transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h2 class="text-xl font-semibold text-gray-900 capitalize">{{ transaction.type }} Details</h2>
            <p class="text-sm text-gray-500">Transaction ID: {{ transaction.id }}</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Transaction Status -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Transaction Status</h3>
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getStatusClass(transaction.status || 'completed')
            ]">
              <div :class="[
                'w-2 h-2 rounded-full mr-2',
                getStatusDotClass(transaction.status || 'completed')
              ]"></div>
              {{ transaction.status || 'completed' }}
            </span>
          </div>

          <!-- Status Timeline -->
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div class="space-y-4">
              <div class="relative flex items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Transaction Initiated</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(transaction.createdAt || transaction.date) }}</p>
                </div>
              </div>

              <div class="relative flex items-center">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  (transaction.status || 'completed') === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                ]">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Transaction Completed</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(transaction.createdAt || transaction.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Amount Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Amount Information</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Transaction Amount:</span>
                <span :class="[
                  'text-sm font-semibold',
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Commission:</span>
                <span class="text-sm font-semibold text-purple-600">
                  +{{ formatCurrency(calculateCommission(transaction)) }}
                </span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-2">
                <span class="text-sm font-medium text-gray-700">Net Impact:</span>
                <span class="text-sm font-semibold text-blue-600">
                  +{{ formatCurrency(calculateCommission(transaction)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Customer Information</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Phone Number:</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ transaction.customerPhone || 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Transaction Type:</span>
                <span class="text-sm font-medium text-gray-900 capitalize">
                  {{ transaction.type }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Timeline -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Transaction Details</h4>
          <div class="bg-gray-50 rounded-lg p-4">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-gray-600">Transaction ID</dt>
                <dd class="text-sm font-medium text-gray-900">{{ transaction.id }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-600">Date & Time</dt>
                <dd class="text-sm font-medium text-gray-900">{{ formatDateTime(transaction.date) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-600">Reference</dt>
                <dd class="text-sm font-medium text-gray-900">REF{{ transaction.id }}{{ new Date().getFullYear() }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-600">Channel</dt>
                <dd class="text-sm font-medium text-gray-900">Agent Terminal</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Notes Section -->
        <div v-if="transaction.notes" class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Notes</h4>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-700">{{ transaction.notes }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="printReceipt"
            class="flex-1 btn btn-secondary flex items-center justify-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Receipt
          </button>

          <button
            v-if="(transaction.status || 'completed') === 'pending'"
            @click="cancelTransaction"
            class="flex-1 btn btn-danger flex items-center justify-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel Transaction
          </button>

          <button
            @click="closeModal"
            class="flex-1 btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'TransactionDetailModal',
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'updated'],
  setup(props, { emit }) {
    const store = useStore()

    const closeModal = () => {
      emit('close')
    }

    const formatCurrency = (amount) => {
      return `KES ${parseFloat(amount).toLocaleString()}`
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
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

    const getStatusDotClass = (status) => {
      switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
      }
    }

    const calculateCommission = (transaction) => {
      const amount = parseFloat(transaction.amount)
      return transaction.type === 'deposit' ? amount * 0.01 : amount * 0.005
    }

    const printReceipt = () => {
      store.dispatch('showNotification', {
        type: 'info',
        title: 'Receipt',
        message: 'Receipt is being prepared for printing...',
        autoDismiss: true
      })
    }

    const cancelTransaction = () => {
      if (confirm('Are you sure you want to cancel this transaction?')) {
        const updatedTransaction = { ...props.transaction, status: 'cancelled' }
        store.dispatch('updateTransaction', updatedTransaction)
        emit('updated')
      }
    }

    return {
      closeModal,
      formatCurrency,
      formatDateTime,
      getStatusClass,
      getStatusDotClass,
      calculateCommission,
      printReceipt,
      cancelTransaction
    }
  }
}
</script>