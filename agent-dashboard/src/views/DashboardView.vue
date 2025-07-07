<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Page Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's your account overview.</p>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          @click="showNewTransactionModal = true"
          class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
        >
          <svg class="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">New Transaction</span>
        </button>
        
        <button class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
          <svg class="w-8 h-8 text-gray-400 group-hover:text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-700">Generate Report</span>
        </button>
        
        <button class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
          <svg class="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700 group-hover:text-purple-700">Customer Support</span>
        </button>
        
        <button class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
          <svg class="w-8 h-8 text-gray-400 group-hover:text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700 group-hover:text-orange-700">Settings</span>
        </button>
      </div>
    </div>

    <!-- Financial Summary Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Skeleton cards for loading state -->
      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Total Balance"
        :value="totalBalance"
        subtitle="Available funds"
        colorClass="text-green-600"
        iconBgClass="bg-green-100"
        iconColorClass="text-green-600"
        :icon="WalletIcon"
        :trend="{ direction: 'up', value: '12.5', period: 'vs last month' }"
        aria-label="Total Balance Card"
      />

      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Today's Transactions"
        :value="todayTransactions"
        subtitle="Completed today"
        colorClass="text-blue-600"
        iconBgClass="bg-blue-100"
        iconColorClass="text-blue-600"
        :icon="CreditCardIcon"
        :trend="{ direction: 'up', value: '8.2', period: 'vs yesterday' }"
        aria-label="Today's Transactions Card"
      />

      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Pending Transactions"
        :value="pendingTransactions"
        subtitle="Awaiting processing"
        colorClass="text-yellow-600"
        iconBgClass="bg-yellow-100"
        iconColorClass="text-yellow-600"
        :icon="ClockIcon"
        aria-label="Pending Transactions Card"
      />

      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Commission Earned"
        :value="commissionEarned"
        subtitle="This month"
        colorClass="text-purple-600"
        iconBgClass="bg-purple-100"
        iconColorClass="text-purple-600"
        :icon="TrendingUpIcon"
        :trend="{ direction: 'up', value: '15.3', period: 'vs last month' }"
        aria-label="Commission Earned Card"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Agent Profile Section -->
      <div class="lg:col-span-1">
        <div class="card">
          <AgentProfile />
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <router-link 
              to="/transactions" 
              class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View all
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          <RecentTransactions />
        </div>
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
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import SummaryCard from '../components/SummaryCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import TransactionModal from '../components/TransactionModal.vue'

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
    SummaryCard,
    SkeletonCard,
    TransactionModal,
    AgentProfile: () => import('../components/AgentProfile.vue'),
    TransactionChart: () => import('../components/TransactionChart.vue'),
    RecentTransactions: () => import('../components/RecentTransactions.vue'),
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    const showNewTransactionModal = ref(false)
    const selectedPeriod = ref('7d')

    // Dashboard data
    const totalBalance = ref('KES 0')
    const todayTransactions = ref(0)
    const pendingTransactions = ref(0)
    const commissionEarned = ref('KES 0')

    const chartPeriods = [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' },
      { label: '90D', value: '90d' },
      { label: '1Y', value: '1y' }
    ]

    // Simulate data fetching
    onMounted(async () => {
      try {
        // Fetch data from store
        await store.dispatch('fetchTransactions')
        await store.dispatch('fetchAgentProfile')
        
        // Simulate loading delay
        setTimeout(() => {
          totalBalance.value = 'KES 45,250'
          todayTransactions.value = 23
          pendingTransactions.value = 3
          commissionEarned.value = 'KES 2,150'
          loading.value = false
        }, 1500)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        loading.value = false
      }
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
      totalBalance, 
      todayTransactions, 
      pendingTransactions,
      commissionEarned,
      showNewTransactionModal,
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