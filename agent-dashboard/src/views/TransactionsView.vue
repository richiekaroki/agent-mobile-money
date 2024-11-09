<!-- src/views/TransactionsView.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Transactions</h1>

    <!-- Filters Form -->
    <div class="mb-4 p-4 bg-white rounded shadow">
      <h2 class="text-lg font-semibold">Filter Transactions</h2>
      <div class="flex space-x-4 mt-4">
        <input
          type="date"
          v-model="dateFilter"
          placeholder="Select date"
          class="border px-2 py-1 rounded"
        />
        <select v-model="typeFilter" class="border px-2 py-1 rounded">
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>
    </div>

    <!-- Transaction List Component with Filters -->
    <TransactionList :dateFilter="dateFilter" :typeFilter="typeFilter" />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import TransactionList from '../components/TransactionList.vue';

export default {
  name: 'TransactionsView',
  components: {
    TransactionList,
  },
  data() {
    return {
      dateFilter: '',
      typeFilter: '',
    };
  },
  setup() {
    const store = useStore();

    // Fetch transactions when the component mounts
    onMounted(() => {
      store.dispatch('fetchTransactions');
    });
  },
};
</script>
