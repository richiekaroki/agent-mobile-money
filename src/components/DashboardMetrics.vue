<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Enhanced Balance Card with Trend -->
    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <h3 class="text-sm font-medium text-green-700">Available Balance</h3>
            <div class="relative group">
              <svg class="w-4 h-4 text-green-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Your current available balance for transactions
              </div>
            </div>
          </div>
          <div class="flex items-baseline space-x-2">
            <p class="text-2xl font-bold text-green-800">KES {{ formatCurrency(dashboardStats.totalBalance) }}</p>
            <div class="flex items-center text-xs">
              <svg class="w-3 h-3 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-700">12.5%</span>
            </div>
          </div>
          <p class="text-xs text-green-600 mt-1">vs last month</p>
        </div>
        <div class="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Enhanced Today's Transactions with Progress -->
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-700 mb-2">Today's Transactions</h3>
          <p class="text-2xl font-bold text-blue-800">{{ dashboardStats.todayTransactions }}</p>
          <div class="flex items-center text-xs text-blue-600 mt-1">
            <svg class="w-3 h-3 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>8.2% from yesterday</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
      </div>
      <!-- Progress Bar -->
      <div class="mt-4">
        <div class="flex justify-between text-xs text-blue-700 mb-1">
          <span>Daily Goal Progress</span>
          <span>{{ dashboardStats.todayTransactions }}/{{ dashboardStats.dailyTarget }}</span>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2">
          <div
            class="h-2 bg-blue-600 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min((dashboardStats.todayTransactions / dashboardStats.dailyTarget) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Enhanced Pending Transactions -->
    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-yellow-700 mb-2">Pending Transactions</h3>
          <p class="text-2xl font-bold text-yellow-800">{{ dashboardStats.pendingTransactions }}</p>
          <p class="text-xs text-yellow-600 mt-1">Awaiting processing</p>
        </div>
        <div class="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div v-if="dashboardStats.pendingTransactions > 0" class="mt-3">
        <button class="text-xs text-yellow-700 hover:text-yellow-800 font-medium">
          Review Pending →
        </button>
      </div>
    </div>

    <!-- Enhanced Commission Card with Monthly Progress -->
    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-purple-700 mb-2">Commission Earned</h3>
          <p class="text-2xl font-bold text-purple-800">KES {{ formatCurrency(dashboardStats.commissionEarned) }}</p>
          <div class="flex items-center text-xs text-purple-600 mt-1">
            <svg class="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>15.3% this month</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
      </div>
      <!-- Monthly Target Progress -->
      <div class="mt-4">
        <div class="flex justify-between text-xs text-purple-700 mb-1">
          <span>Monthly Target</span>
          <span>{{ formatCurrency(dashboardStats.commissionEarned) }}/{{ formatCurrency(dashboardStats.monthlyTarget) }}</span>
        </div>
        <div class="w-full bg-purple-200 rounded-full h-2">
          <div
            class="h-2 bg-purple-600 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min((dashboardStats.commissionEarned / dashboardStats.monthlyTarget) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'DashboardMetrics',
  setup() {
    const store = useStore()
    
    const dashboardStats = computed(() => store.getters.getDashboardStats)
    
    const formatCurrency = (amount) => {
      return parseFloat(amount || 0).toLocaleString()
    }
    
    return {
      dashboardStats,
      formatCurrency
    }
  }
}
</script>