<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ agentName }}! Here's your account overview.</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button 
          @click="refreshData"
          :disabled="refreshing"
          class="btn btn-secondary flex items-center"
        >
          <svg :class="['w-4 h-4 mr-2', refreshing ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ refreshing ? 'Refreshing...' : 'Refresh' }}
        </button>
        <button 
          @click="showNewTransactionModal = true"
          class="btn btn-primary flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Transaction
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <QuickActions @action="handleQuickAction" />

    <!-- Financial Summary Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Skeleton cards for loading state -->
      <SkeletonCard v-if="loading" />
      <StatCard
        v-else
        title="Total Balance"
        :value="dashboardStats.totalBalance"
        subtitle="Available funds"
        valueColor="text-green-600"
        iconBg="bg-green-100"
        iconColor="text-green-600"
        :icon="WalletIcon"
        :change="{ type: 'increase', value: 12.5 }"
        tooltip="Your current available balance for transactions"
      />

      <SkeletonCard v-if="loading" />
      <StatCard
        v-else
        title="Today's Transactions"
        :value="dashboardStats.todayTransactions"
        subtitle="Completed today"
        valueColor="text-blue-600"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        :icon="CreditCardIcon"
        :change="{ type: 'increase', value: 8.2 }"
        :progress="{ current: dashboardStats.todayTransactions, target: 50, label: 'Daily Goal' }"
        progressColor="bg-blue-500"
      />

      <SkeletonCard v-if="loading" />
      <StatCard
        v-else
        title="Pending Transactions"
        :value="dashboardStats.pendingTransactions"
        subtitle="Awaiting processing"
        valueColor="text-yellow-600"
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
        :icon="ClockIcon"
        tooltip="Transactions waiting for approval or processing"
      />

      <SkeletonCard v-if="loading" />
      <StatCard
        v-else
        title="Commission Earned"
        :value="dashboardStats.commissionEarned"
        subtitle="This month"
        valueColor="text-purple-600"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        :icon="TrendingUpIcon"
        :change="{ type: 'increase', value: 15.3 }"
        :progress="{ current: dashboardStats.commissionEarned, target: 5000, label: 'Monthly Target' }"
        progressColor="bg-purple-500"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <!-- Agent Profile Section -->
      <div class="lg:col-span-1">
        <AgentProfile />
      </div>

      <!-- Activity Feed -->
      <div class="lg:col-span-1 xl:col-span-1">
        <ActivityFeed />
      </div>

      <!-- Recent Transactions -->
      <div class="lg:col-span-2 xl:col-span-1">
        <RecentTransactions />
      </div>
    </div>

    <!-- Transaction Overview Chart -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Transaction Overview</h2>
        <div class="flex space-x-2">
          <button 
            v-for="period in chartPeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200',
              selectedPeriod === period.value 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      <TransactionChart :period="selectedPeriod" />
    </div>

    <!-- New Transaction Modal -->
    <TransactionModal 
      v-if="showNewTransactionModal"
      @close="showNewTransactionModal = false"
      @success="handleTransactionSuccess"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import StatCard from '../components/StatCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import TransactionModal from '../components/TransactionModal.vue'
import QuickActions from '../components/QuickActions.vue'
import ActivityFeed from '../components/ActivityFeed.vue'

// Icons (you can replace these with actual icon components)
const WalletIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
  `
}

const CreditCardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>
  `
}

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const TrendingUpIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
    </svg>
  `
}

export default {
  name: 'DashboardView',
  components: {
    StatCard,
    SkeletonCard,
    TransactionModal,
    QuickActions,
    ActivityFeed,
    AgentProfile: () => import('../components/AgentProfile.vue'),
    TransactionChart: () => import('../components/TransactionChart.vue'),
    RecentTransactions: () => import('../components/RecentTransactions.vue'),
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    const refreshing = ref(false)
    const showNewTransactionModal = ref(false)
    const selectedPeriod = ref('7d')

    // Computed properties
    const dashboardStats = computed(() => store.getters.getDashboardStats)
    const agentProfile = computed(() => store.getters.getAgentProfile)
    const agentName = computed(() => agentProfile.value.name || 'Agent')

    const chartPeriods = [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
      { label: '90D', value: '90d' },
      { label: '1Y', value: '1y' }
    ]

    const loadDashboardData = async () => {
      try {
        // Fetch data from store
        await store.dispatch('fetchTransactions')
        await store.dispatch('fetchAgentProfile')
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to load dashboard data. Please try again.',
          autoDismiss: true
        })
      } finally {
        setTimeout(() => {
          loading.value = false
          refreshing.value = false
        }, 800)
      }
    }

    const refreshData = async () => {
      refreshing.value = true
      await loadDashboardData()
    }

    const handleQuickAction = (actionId) => {
      switch (actionId) {
        case 'new-transaction':
          showNewTransactionModal.value = true
          break
        case 'generate-report':
          store.dispatch('showNotification', {
            type: 'info',
            title: 'Report Generation',
            message: 'Report generation feature coming soon!',
            autoDismiss: true
          })
          break
        case 'customer-support':
          store.dispatch('showNotification', {
            type: 'info',
            title: 'Customer Support',
            message: 'Redirecting to customer support...',
            autoDismiss: true
          })
          break
        case 'settings':
          store.dispatch('showNotification', {
            type: 'info',
            title: 'Settings',
            message: 'Settings panel coming soon!',
            autoDismiss: true
          })
          break
      }
    }

    // Simulate data fetching
    onMounted(async () => {
      await loadDashboardData()
    })

    const handleTransactionSuccess = () => {
      showNewTransactionModal.value = false
      store.commit('addNotification', {
        type: 'success',
        title: 'Transaction Created',
        message: 'Your transaction has been successfully created.',
        autoDismiss: true,
        duration: 5000
      })
    }

    return { 
      loading,
      refreshing,
      dashboardStats,
      agentName,
      showNewTransactionModal,
      refreshData,
      handleQuickAction,
      selectedPeriod,
      chartPeriods,
      handleTransactionSuccess,
      WalletIcon,
      CreditCardIcon,
      ClockIcon,
      TrendingUpIcon
    }
  },
}
</script>