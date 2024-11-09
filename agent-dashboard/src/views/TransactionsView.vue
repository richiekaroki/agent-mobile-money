<!-- src/views/TransactionsView.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Transactions</h1>

    <!-- Filters and Transaction List -->
    <TransactionList
      :startDate="startDate"
      :endDate="endDate"
      :typeFilter="selectedType"
      :page="currentPage"
      :transactionsPerPage="5"
      @selectTransaction="selectTransaction"
      @changePage="changePage"
    />

    <!-- Transaction Modal -->
    <TransactionModal
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @close="selectedTransaction = null"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import TransactionList from '../components/TransactionList.vue'
import TransactionModal from '../components/TransactionModal.vue'

export default {
  components: { TransactionList, TransactionModal },
  setup() {
    const selectedTransaction = ref(null)

    const selectTransaction = (transaction) => {
      selectedTransaction.value = transaction
    }

    const changePage = (newPage) => {
      currentPage.value = newPage
    }

    return { selectedTransaction, selectTransaction }
  },
}
</script>
