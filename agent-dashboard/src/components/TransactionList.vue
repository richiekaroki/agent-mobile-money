<!-- src/components/TransactionList.vue -->
<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Transaction History</h2>

    <!-- Transaction List -->
    <ul v-if="filteredTransactions.length > 0">
      <li v-for="transaction in filteredTransactions" :key="transaction.id" class="mb-2">
        <div class="flex justify-between">
          <span>{{ transaction.date }}</span>
          <span>{{ transaction.type }}</span>
          <span>{{ transaction.amount }} KES</span>
        </div>
      </li>
    </ul>

    <!-- No transactions message -->
    <p v-else>No transactions found.</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TransactionList',
  props: {
    dateFilter: String,
    typeFilter: String,
  },
  setup(props) {
    const store = useStore();
    const transactions = computed(() => store.getters.getTransactions);

    // Apply filtering based on props
    const filteredTransactions = computed(() => {
      return transactions.value.filter((transaction) => {
        // Filter by date if dateFilter is provided
        const matchesDate = props.dateFilter ? transaction.date.includes(props.dateFilter) : true;

        // Filter by type if typeFilter is provided
        const matchesType = props.typeFilter ? transaction.type === props.typeFilter : true;

        return matchesDate && matchesType;
      });
    });

    return { filteredTransactions };
  },
};
</script>

<style scoped>
/* You can add some custom styles for the transaction list here */
</style>
