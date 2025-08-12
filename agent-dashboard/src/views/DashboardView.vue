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
          <svg
            :class="['w-4 h-4 mr-2', refreshing ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          {{ refreshing ? 'Refreshing...' : 'Refresh' }}
        </button>
        <button @click="showNewTransactionModal = true" class="btn btn-primary flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
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
        :progress="{
          current: dashboardStats.commissionEarned,
          target: 5000,
          label: 'Monthly Target',
        }"
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
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      <TransactionChart :period="selectedPeriod" />
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-if="showNewTransactionModal"
      @close="showNewTransactionModal = false"
      @transaction-added="handleTransactionSuccess"
    />

    <!-- Customer Support Modal -->
    <div v-if="showCustomerSupport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-screen overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Customer Support</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <CustomerSupport @notification="addNotification" />
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-screen overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Settings</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <Settings @notification="addNotification" />
        </div>
      </div>
    </div>

    <!-- Report Generation Modal -->
    <div v-if="showReportGeneration" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-screen overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Report Generation</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <ReportGeneration @notification="addNotification" />
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <NotificationComponent />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import ActivityFeed from '../components/ActivityFeed.vue'
import QuickActions from '../components/QuickActions.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import StatCard from '../components/StatCard.vue'
import TransactionModal from '../components/TransactionModal.vue'
import NotificationComponent from '../components/NotificationComponent.vue'
import CustomerSupport from '../components/CustomerSupport.vue'
import Settings from '../components/Settings.vue'
import ReportGeneration from '../components/ReportGeneration.vue'

// Icons (you can replace these with actual icon components)
const WalletIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
  `,
}

const CreditCardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>
  `,
}

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `,
}

const TrendingUpIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
    </svg>
  `,
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
    NotificationComponent,
    CustomerSupport,
    Settings,
    ReportGeneration,
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    const refreshing = ref(false)
    const showNewTransactionModal = ref(false)
    const showCustomerSupport = ref(false)
    const showSettings = ref(false)
    const showReportGeneration = ref(false)
    const selectedPeriod = ref('7d')

    // Computed properties
    const dashboardStats = computed(() => store.getters.getDashboardStats)
    const agentProfile = computed(() => store.getters.getAgentProfile)
    const agentName = computed(() => agentProfile.value.name || 'Agent')

    const chartPeriods = [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
      { label: '90D', value: '90d' },
      { label: '1Y', value: '1y' },
    ]

    const loadDashboardData = async () => {
      try {
        // Fetch data from store
        await store.dispatch('fetchTransactions')
        await store.dispatch('fetchAgentProfile')
      } catch (error) {
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Error Loading Data',
          message: 'Failed to load dashboard data. Please try again later.',
          autoDismiss: false,
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

    const handleQuickAction = actionId => {
      switch (actionId) {
        case 'deposit':
          showNewTransactionModal.value = true
          break
        case 'withdraw':
          showNewTransactionModal.value = true
          break
        case 'support':
          showCustomerSupport.value = true
          break
        case 'reports':
          showReportGeneration.value = true
          break
        case 'profile':
          store.dispatch('showNotification', {
            type: 'info',
            title: 'Profile Update',
            message: 'Profile update feature coming soon!',
            autoDismiss: true,
          })
          break
        case 'settings':
          showSettings.value = true
          break
      }
    }

    // Simulate data fetching
    onMounted(async () => {
      await loadDashboardData()
    })

    const handleTransactionSuccess = () => {
      showNewTransactionModal.value = false
      store.dispatch('showNotification', {
        type: 'success',
        title: 'Transaction Created',
        message: 'Your transaction has been successfully created.',
        autoDismiss: true,
        duration: 5000,
      })
      refreshData() // Refresh data to show the new transaction
    }

    const addNotification = (notification) => {
      store.dispatch('showNotification', notification)
    }

    const openTransactionModal = (type) => {
      showNewTransactionModal.value = true
      // The transaction modal will handle the type
    }

    const closeModal = () => {
      showCustomerSupport.value = false
      showSettings.value = false
      showReportGeneration.value = false
    }

    return {
      loading,
      refreshing,
      dashboardStats,
      agentName,
      showNewTransactionModal,
      showCustomerSupport,
      showSettings,
      showReportGeneration,
      refreshData,
      handleQuickAction,
      selectedPeriod,
      chartPeriods,
      handleTransactionSuccess,
      addNotification,
      openTransactionModal,
      closeModal,
      WalletIcon,
      CreditCardIcon,
      ClockIcon,
      TrendingUpIcon,
    }
  },
}
</script>
