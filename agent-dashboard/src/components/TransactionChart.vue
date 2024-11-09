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
import { Chart, registerables } from 'chart.js'
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

Chart.register(...registerables)

export default {
  name: 'TransactionChart',
  setup() {
    const store = useStore()
    const chartRef = ref(null)
    let chartInstance = null

    // Date range filters
    const startDate = ref('')
    const endDate = ref('')

    // Fetch transactions from Vuex store
    const transactions = ref([])

    // Fetch transactions from the store on mount
    onMounted(async () => {
      transactions.value = await store.getters.getTransactions // Make sure this resolves correctly
      generateChart() // Generate the chart after data is fetched
    })

    // Watch for changes in Vuex store data or filters
    watch(
      () => store.getters.getTransactions,
      async (newTransactions) => {
        transactions.value = await newTransactions // Await if the getter returns a promise
        updateChart()
      },
    )

    // Filter transactions by date range and type
    const filteredTransactions = () => {
      return transactions.value.filter((transaction) => {
        const date = new Date(transaction.date)
        const isInDateRange =
          (!startDate.value || date >= new Date(startDate.value)) &&
          (!endDate.value || date <= new Date(endDate.value))
        return isInDateRange
      })
    }

    // Chart generation function
    const generateChart = () => {
      const ctx = chartRef.value.getContext('2d')

      if (chartInstance) {
        chartInstance.destroy()
      }

      const data = filteredTransactions()
      const dates = [...new Set(data.map((item) => item.date))]
      const deposits = dates.map((date) =>
        data
          .filter((item) => item.date === date && item.type === 'deposit')
          .reduce((acc, item) => acc + parseFloat(item.amount), 0),
      )
      const withdrawals = dates.map((date) =>
        data
          .filter((item) => item.date === date && item.type === 'withdrawal')
          .reduce((acc, item) => acc + parseFloat(item.amount), 0),
      )

      chartInstance = new Chart(ctx, {
        type: 'line',
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
          maintainAspectRatio: false,
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
      })
    }

    // Update chart whenever filters change
    const updateChart = () => {
      generateChart()
    }

    return { chartRef, startDate, endDate }
  },
}
</script>

<style scoped>
/* Optional: Additional styles for the date picker and chart for alignment */
.w-full {
  max-width: 800px;
  margin: auto;
}
</style>
