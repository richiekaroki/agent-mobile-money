<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Centered Dashboard Heading -->
    <h1
      class="text-4xl font-bold text-center mb-8 text-blue-600"
      aria-label="Financial Dashboard Heading"
    >
      Financial Dashboard
    </h1>

    <!-- Financial Summary Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Skeleton cards for loading state -->
      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Total Balance"
        :value="totalBalance"
        colorClass="text-green-500"
        aria-label="Total Balance Card"
      />

      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Total Transactions"
        :value="totalTransactions"
        colorClass="text-blue-500"
        aria-label="Total Transactions Card"
      />

      <SkeletonCard v-if="loading" />
      <SummaryCard
        v-else
        title="Pending Transactions"
        :value="pendingTransactions"
        colorClass="text-yellow-500"
        aria-label="Pending Transactions Card"
      />
    </div>

    <!-- Agent Profile Section -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow-md">
      <AgentProfile />
    </div>

    <!-- Transaction Overview Section with Chart -->
    <div class="p-4 bg-white rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Transaction Overview</h2>
      <TransactionChart />
    </div>
  </div>
</template>

<script>
import SummaryCard from '../components/SummaryCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue' // Import SkeletonCard
import { ref, onMounted } from 'vue'

export default {
  name: 'DashboardView',
  components: {
    SummaryCard,
    SkeletonCard, // Register SkeletonCard
    AgentProfile: () => import('../components/AgentProfile.vue'),
    TransactionChart: () => import('../components/TransactionChart.vue'),
  },
  setup() {
    const totalBalance = ref('KES 25,000')
    const totalTransactions = ref(350)
    const pendingTransactions = ref(5)
    const loading = ref(true)

    // Simulate data fetching (remove this once actual API is integrated)
    onMounted(() => {
      setTimeout(() => {
        totalBalance.value = 'KES 30,000'
        totalTransactions.value = 450
        pendingTransactions.value = 2
        loading.value = false
      }, 2000) // Simulate delay
    })

    return { totalBalance, totalTransactions, pendingTransactions, loading }
  },
}
</script>

<style scoped>
/* Responsive font size and layout adjustments */
h1 {
  font-size: 2.5rem;
}

.skeleton-card {
  height: 150px; /* Same height as SummaryCard */
}

/* Media queries for responsive design */
@media (min-width: 640px) {
  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.25rem;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 3rem;
  }
}
</style>
