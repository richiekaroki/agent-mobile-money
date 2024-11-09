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
      <SummaryCard
        title="Total Balance"
        :value="totalBalance"
        colorClass="text-green-500"
        aria-label="Total Balance Card"
      />
      <SummaryCard
        title="Total Transactions"
        :value="totalTransactions"
        colorClass="text-blue-500"
        aria-label="Total Transactions Card"
      />
      <SummaryCard
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

    <!-- Transaction Overview Section with Chart and Date Filters -->
    <div class="p-4 bg-white rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Transaction Overview</h2>
      <TransactionChart />
    </div>
  </div>
</template>

<script>
import SummaryCard from '../components/SummaryCard.vue'

export default {
  name: 'DashboardView',
  components: {
    SummaryCard,
    AgentProfile: () => import('../components/AgentProfile.vue'),
    TransactionChart: () => import('../components/TransactionChart.vue'),
  },
  data() {
    return {
      totalBalance: 'KES 25,000',
      totalTransactions: 350,
      pendingTransactions: 5,
    }
  },
}
</script>

<style scoped>
/* Style the Transaction Overview section to match the rest of the dashboard layout */
.transaction-overview {
  max-width: 800px;
  margin: 0 auto;
}
</style>
