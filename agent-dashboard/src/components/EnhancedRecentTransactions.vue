<template>
  <div class="enhanced-recent-transactions">
    <h2>Recent Transactions</h2>
    <v-data-table
      :headers="headers"
      :items="transactions"
      :loading="loading"
      class="elevation-1"
      dense
    >
      <template v-slot:item-status="{ item }">
        <v-chip :color="statusColor(item.status)" dark>{{ item.status }}</v-chip>
      </template>
      <template #no-data>
        <v-alert type="info" border="left" color="blue lighten-4">
          No recent transactions found.
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "EnhancedRecentTransactions",
  data() {
    return {
      loading: false,
      headers: [
        { text: "Date", value: "date" },
        { text: "Type", value: "type" },
        { text: "Amount", value: "amount" },
        { text: "Status", value: "status" },
      ],
      transactions: [],
    };
  },
  mounted() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.transactions = [
          {
            date: "2024-06-01",
            type: "Deposit",
            amount: "₦10,000",
            status: "Success",
          },
          {
            date: "2024-06-02",
            type: "Withdrawal",
            amount: "₦5,000",
            status: "Pending",
          },
          {
            date: "2024-06-03",
            type: "Transfer",
            amount: "₦2,500",
            status: "Failed",
          },
        ];
        this.loading = false;
      }, 1000);
    },
    statusColor(status) {
      switch (status) {
        case "Success":
          return "green";
        case "Pending":
          return "orange";
        case "Failed":
          return "red";
        default:
          return "grey";
      }
    },
  },
};
</script>

<style scoped>
.enhanced-recent-transactions {
  padding: 16px;
}
</style>