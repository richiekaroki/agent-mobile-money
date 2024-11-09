<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Centered Dashboard Heading -->
    <h1 class="text-4xl font-bold text-center mb-8 text-blue-600">Financial Dashboard</h1>

    <!-- Financial Summary Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
        <div class="text-lg font-semibold">Total Balance</div>
        <div class="text-2xl font-bold text-green-500">KES 25,000</div>
      </div>
      <div class="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
        <div class="text-lg font-semibold">Total Transactions</div>
        <div class="text-2xl font-bold text-blue-500">350</div>
      </div>
      <div class="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
        <div class="text-lg font-semibold">Pending Transactions</div>
        <div class="text-2xl font-bold text-yellow-500">5</div>
      </div>
    </div>

    <!-- Agent Profile Section -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow-md">
      <AgentProfile />
    </div>

    <!-- Transaction Overview Section with Chart -->
    <div class="p-4 bg-white rounded-lg shadow-md">
      <TransactionChart />
    </div>
  </div>
</template>

<script>
import AgentProfile from '../components/AgentProfile.vue';
import TransactionChart from '../components/TransactionChart.vue';

export default {
  name: 'DashboardView',
  components: {
    AgentProfile,
    TransactionChart,
  },
};
</script>

<style scoped>
/* Optional: You can style the grid layout here for a better responsive design */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
