<template>
  <div class="p-6 bg-gray-100 min-h-screen">
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
      @close="clearSelectedTransaction"
      aria-label="Transaction Details Modal"
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
    const currentPage = ref(1)
    const startDate = ref('')
    const endDate = ref('')
    const selectedType = ref('')

    const selectTransaction = (transaction) => {
      selectedTransaction.value = transaction
    }

    const changePage = (newPage) => {
      currentPage.value = newPage
    }

    const clearSelectedTransaction = () => {
      selectedTransaction.value = null
    }

    return {
      selectedTransaction,
      selectTransaction,
      currentPage,
      changePage,
      startDate,
      endDate,
      selectedType,
      clearSelectedTransaction
    }
  },
}
</script>
