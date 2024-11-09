<!-- src/views/DashboardView.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <AgentProfile />
    <div class="mt-6">
      <TransactionList />
    </div>
  </div>
</template>

<script>
import AgentProfile from '../components/AgentProfile.vue';
import TransactionList from '../components/TransactionList.vue';

export default {
  name: 'DashboardView',
  components: {
    AgentProfile,
    TransactionList,
  },
};
</script>

<style scoped>
/* Add any Dashboard-specific styles here */
</style>
