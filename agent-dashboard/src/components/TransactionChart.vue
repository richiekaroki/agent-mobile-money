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

    // Date range filters (default to last 7 days)
    const startDate = ref(getDefaultStartDate())
    const endDate = ref(getDefaultEndDate())

    // Fetch transactions from Vuex store
    const transactions = ref([])

    // Fetch transactions from the store on mount
    onMounted(() => {
      transactions.value = store.getters.getTransactions // Fetch transactions
      generateChart() // Generate the chart after data is fetched
    })

    // Watch for changes in Vuex store data or filters
    watch([startDate, endDate], () => {
      updateChart() // Update chart whenever the date range changes
    })

    // Function to get default start date (7 days ago)
    function getDefaultStartDate() {
      const date = new Date()
      date.setDate(date.getDate() - 7) // Set to 7 days ago
      return date.toISOString().split('T')[0] // Return in YYYY-MM-DD format
    }

    // Function to get today's date as the default end date
    function getDefaultEndDate() {
      return new Date().toISOString().split('T')[0] // Return today's date
    }

    // Filter transactions by date range
    const filteredTransactions = () => {
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      return transactions.value.filter((transaction) => {
        const date = new Date(transaction.date)
        return date >= start && date <= end
      })
    }

    // Chart generation function
    const generateChart = () => {
      const ctx = chartRef.value.getContext('2d')

      if (chartInstance) {
        chartInstance.destroy() // Destroy previous chart instance
      }

      const data = filteredTransactions()
      const dates = [...new Set(data.map((item) => item.date))] // Unique dates
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
      generateChart() // Generate a new chart with the current date range
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
