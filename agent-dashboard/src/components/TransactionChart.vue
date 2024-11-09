<template>
  <div class="w-full h-96">
    <!-- Date Range Filters -->
    <div class="flex space-x-4 mb-4">
      <label>
        Start Date:
        <input type="date" v-model="startDate" @change="updateChart" class="p-2 border rounded" />
      </label>
      <label>
        End Date:
        <input type="date" v-model="endDate" @change="updateChart" class="p-2 border rounded" />
      </label>
    </div>

    <!-- Chart Display -->
    <canvas ref="transactionChart"></canvas>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useStore } from 'vuex'; // Import Vuex for state management

Chart.register(...registerables);

export default {
  name: 'TransactionChart',
  setup() {
    const store = useStore();
    const chartRef = ref(null);
    let chartInstance = null;

    // Date range filters
    const startDate = ref('');
    const endDate = ref('');

    // Fetch transactions from Vuex store
    const transactions = ref([]);
    onMounted(() => {
      transactions.value = store.getters.getTransactions; // Use Vuex getter
      generateChart(); // Initial chart generation
    });

    // Watch for changes in Vuex store data or filters
    watch(
      () => store.getters.getTransactions,
      (newTransactions) => {
        transactions.value = newTransactions;
        updateChart();
      }
    );

    // Filter transactions by date range and type
    const filteredTransactions = () => {
      return transactions.value.filter((transaction) => {
        const date = new Date(transaction.date);
        const isInDateRange = (!startDate.value || date >= new Date(startDate.value)) &&
                              (!endDate.value || date <= new Date(endDate.value));
        return isInDateRange;
      });
    };

    // Chart generation function
    const generateChart = () => {
      const ctx = chartRef.value.getContext('2d');

      // Destroy any existing chart
      if (chartInstance) {
        chartInstance.destroy();
      }

      const data = filteredTransactions();
      const dates = [...new Set(data.map((item) => item.date))]; // Unique dates for labels
      const deposits = dates.map((date) =>
        data
          .filter((item) => item.date === date && item.type === 'deposit')
          .reduce((acc, item) => acc + parseFloat(item.amount), 0)
      );
      const withdrawals = dates.map((date) =>
        data
          .filter((item) => item.date === date && item.type === 'withdrawal')
          .reduce((acc, item) => acc + parseFloat(item.amount), 0)
      );

      chartInstance = new Chart(ctx, {
        type: 'line', // Can be 'bar', 'pie', etc.
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Deposits',
              data: deposits,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Withdrawals',
              data: withdrawals,
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.3)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount (KES)',
              },
            },
          },
        },
      });
    };

    // Update chart whenever filters change
    const updateChart = () => {
      generateChart(); // Re-generate chart with filtered data
    };

    return { chartRef, startDate, endDate };
  },
};
</script>

<style scoped>
/* Optional: You can style the chart container here */
</style>
