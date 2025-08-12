<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-1">Transaction Analytics</h2>
        <p class="text-sm text-gray-600">Track your transaction performance over time</p>
      </div>
      
      <!-- Chart Controls -->
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
        <!-- Chart Type Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            v-for="type in chartTypes"
            :key="type.value"
            @click="selectedChartType = type.value"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
              selectedChartType === type.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
        
        <!-- Time Period -->
        <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            v-for="period in timePeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
              selectedPeriod === period.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading chart data...</span>
      </div>
      
      <div v-else class="h-64 sm:h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Chart Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
      <div class="text-center">
        <p class="text-2xl font-bold text-green-600">{{ chartSummary.totalDeposits }}</p>
        <p class="text-xs text-gray-600">Total Deposits</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-red-600">{{ chartSummary.totalWithdrawals }}</p>
        <p class="text-xs text-gray-600">Total Withdrawals</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-blue-600">{{ chartSummary.avgTransaction }}</p>
        <p class="text-xs text-gray-600">Avg Transaction</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-purple-600">{{ chartSummary.commission }}</p>
        <p class="text-xs text-gray-600">Commission</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

Chart.register(...registerables)

export default {
  name: 'EnhancedTransactionChart',
  setup() {
    const store = useStore()
    const chartCanvas = ref(null)
    const loading = ref(true)
    const selectedChartType = ref('line')
    const selectedPeriod = ref('7d')
    let chartInstance = null

    const transactions = computed(() => store.getters.getTransactions)

    const chartTypes = [
      { label: 'Line', value: 'line' },
      { label: 'Bar', value: 'bar' },
      { label: 'Area', value: 'area' }
    ]

    const timePeriods = [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
      { label: '90D', value: '90d' }
    ]

    const getFilteredData = () => {
      const now = new Date()
      const days = selectedPeriod.value === '7d' ? 7 : selectedPeriod.value === '30d' ? 30 : 90
      const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
      
      return transactions.value.filter(t => new Date(t.date) >= startDate)
    }

    const chartSummary = computed(() => {
      const data = getFilteredData()
      const deposits = data.filter(t => t.type === 'deposit')
      const withdrawals = data.filter(t => t.type === 'withdrawal')
      
      const totalDeposits = deposits.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const totalWithdrawals = withdrawals.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const avgTransaction = data.length > 0 ? (totalDeposits + totalWithdrawals) / data.length : 0
      const commission = deposits.reduce((sum, t) => sum + parseFloat(t.amount) * 0.01, 0) +
                        withdrawals.reduce((sum, t) => sum + parseFloat(t.amount) * 0.005, 0)

      return {
        totalDeposits: `KES ${totalDeposits.toLocaleString()}`,
        totalWithdrawals: `KES ${totalWithdrawals.toLocaleString()}`,
        avgTransaction: `KES ${avgTransaction.toLocaleString()}`,
        commission: `KES ${commission.toLocaleString()}`
      }
    })

    const generateChartData = () => {
      const data = getFilteredData()
      const days = selectedPeriod.value === '7d' ? 7 : selectedPeriod.value === '30d' ? 30 : 90
      const labels = []
      const depositData = []
      const withdrawalData = []

      // Generate date labels
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

        const dayDeposits = data.filter(t => t.date === dateStr && t.type === 'deposit')
        const dayWithdrawals = data.filter(t => t.date === dateStr && t.type === 'withdrawal')

        depositData.push(dayDeposits.reduce((sum, t) => sum + parseFloat(t.amount), 0))
        withdrawalData.push(dayWithdrawals.reduce((sum, t) => sum + parseFloat(t.amount), 0))
      }

      return { labels, depositData, withdrawalData }
    }

    const createChart = async () => {
      if (!chartCanvas.value) return

      await nextTick()
      
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = chartCanvas.value.getContext('2d')
      const { labels, depositData, withdrawalData } = generateChartData()

      const config = {
        type: selectedChartType.value === 'area' ? 'line' : selectedChartType.value,
        data: {
          labels,
          datasets: [
            {
              label: 'Deposits',
              data: depositData,
              borderColor: '#10B981',
              backgroundColor: selectedChartType.value === 'area' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.8)',
              fill: selectedChartType.value === 'area',
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Withdrawals',
              data: withdrawalData,
              borderColor: '#EF4444',
              backgroundColor: selectedChartType.value === 'area' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.8)',
              fill: selectedChartType.value === 'area',
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: KES ${context.parsed.y.toLocaleString()}`
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(107, 114, 128, 0.1)'
              },
              ticks: {
                color: '#6B7280',
                callback: function(value) {
                  return 'KES ' + value.toLocaleString()
                }
              }
            }
          }
        }
      }

      chartInstance = new Chart(ctx, config)
      loading.value = false
    }

    watch([selectedChartType, selectedPeriod, transactions], () => {
      if (transactions.value.length > 0) {
        createChart()
      }
    }, { deep: true })

    onMounted(() => {
      if (transactions.value.length > 0) {
        createChart()
      } else {
        // Simulate loading
        setTimeout(() => {
          loading.value = false
        }, 1000)
      }
    })

    return {
      chartCanvas,
      loading,
      selectedChartType,
      selectedPeriod,
      chartTypes,
      timePeriods,
      chartSummary
    }
  }
}
</script>