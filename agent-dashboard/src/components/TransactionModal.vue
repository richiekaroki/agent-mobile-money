<!-- src/components/TransactionModal.vue -->
<template>
  <div v-if="transaction" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Transaction Details</h2>
      <p><strong>Date:</strong> {{ transaction.date }}</p>
      <p><strong>Type:</strong> {{ transaction.type }}</p>
      <p><strong>Amount:</strong> {{ transaction.amount }} KES</p>
      <p><strong>Status:</strong> Completed</p>
      <button @click="close" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['transaction'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
