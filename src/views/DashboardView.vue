@@ .. @@
 <template>
   <div class="space-y-8 animate-fade-in">
     <!-- Page Header -->
-    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
+    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
       <div>
-        <h1 class="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
-        <p class="text-gray-600">Welcome back, {{ agentName }}! Here's your account overview.</p>
+        <div class="flex items-center space-x-3 mb-2">
+          <h1 class="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
+          <div class="flex items-center space-x-2">
+            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
+            <span class="text-sm text-green-600 font-medium">Live</span>
+          </div>
+        </div>
+        <p class="text-gray-600">Welcome back, {{ agentName }}! Here's your real-time account overview.</p>
       </div>
-      <div class="mt-4 md:mt-0 flex space-x-3">
+      <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
+        <!-- Quick Stats -->
+        <div class="flex items-center space-x-4 px-4 py-2 bg-white rounded-lg border border-gray-200">
+          <div class="text-center">
+            <p class="text-xs text-gray-500">Today</p>
+            <p class="text-sm font-semibold text-blue-600">{{ dashboardStats.todayTransactions }}</p>
+          </div>
+          <div class="w-px h-8 bg-gray-200"></div>
+          <div class="text-center">
+            <p class="text-xs text-gray-500">Balance</p>
+            <p class="text-sm font-semibold text-green-600">{{ formatCurrency(dashboardStats.totalBalance) }}</p>
+          </div>
+        </div>
+        
         <button
           @click="refreshData"
           :disabled="refreshing"
-          class="btn btn-secondary flex items-center"
+          class="btn btn-secondary flex items-center justify-center"
         >
           <svg
             :class="['w-4 h-4 mr-2', refreshing ? 'animate-spin' : '']"
@@ -32,7 +49,7 @@
           </svg>
           {{ refreshing ? 'Refreshing...' : 'Refresh' }}
         </button>
-        <button @click="showNewTransactionModal = true" class="btn btn-primary flex items-center">
+        <button @click="showNewTransactionModal = true" class="btn btn-primary flex items-center justify-center">
           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path
               stroke-linecap="round"
@@ -48,89 +65,8 @@
     <!-- Quick Actions -->
     <QuickActions @action="handleQuickAction" />
 
-    <!-- Financial Summary Section -->
-    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
-      <!-- Skeleton cards for loading state -->
-      <SkeletonCard v-if="loading" />
-      <StatCard
-        v-else
-        title="Total Balance"
-        :value="dashboardStats.totalBalance"
-        subtitle="Available funds"
-        valueColor="text-green-600"
-        iconBg="bg-green-100"
-        iconColor="text-green-600"
-        :icon="WalletIcon"
-        :change="{ type: 'increase', value: 12.5 }"
-        tooltip="Your current available balance for transactions"
-      />
-
-      <SkeletonCard v-if="loading" />
-      <StatCard
-        v-else
-        title="Today's Transactions"
-        :value="dashboardStats.todayTransactions"
-        subtitle="Completed today"
-        valueColor="text-blue-600"
-        iconBg="bg-blue-100"
-        iconColor="text-blue-600"
-        :icon="CreditCardIcon"
-        :change="{ type: 'increase', value: 8.2 }"
-        :progress="{ current: dashboardStats.todayTransactions, target: 50, label: 'Daily Goal' }"
-        progressColor="bg-blue-500"
-      />
-
-      <SkeletonCard v-if="loading" />
-      <StatCard
-        v-else
-        title="Pending Transactions"
-        :value="dashboardStats.pendingTransactions"
-        subtitle="Awaiting processing"
-        valueColor="text-yellow-600"
-        iconBg="bg-yellow-100"
-        iconColor="text-yellow-600"
-        :icon="ClockIcon"
-        tooltip="Transactions waiting for approval or processing"
-      />
-
-      <SkeletonCard v-if="loading" />
-      <StatCard
-        v-else
-        title="Commission Earned"
-        :value="dashboardStats.commissionEarned"
-        subtitle="This month"
-        valueColor="text-purple-600"
-        iconBg="bg-purple-100"
-        iconColor="text-purple-600"
-        :icon="TrendingUpIcon"
-        :change="{ type: 'increase', value: 15.3 }"
-        :progress="{
-          current: dashboardStats.commissionEarned,
-          target: 5000,
-          label: 'Monthly Target',
-        }"
-        progressColor="bg-purple-500"
-      />
-    </div>
+    <!-- Enhanced Dashboard Metrics -->
+    <DashboardMetrics v-if="!loading" />
 
     <!-- Main Content Grid -->
     <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
@@ -140,6 +76,11 @@
       </div>
 
       <!-- Activity Feed -->
+      <div class="lg:col-span-1 xl:col-span-1">
+        <SmartNotifications />
+      </div>
+
+      <!-- Recent Transactions -->
       <div class="lg:col-span-1 xl:col-span-1">
         <ActivityFeed />
        <EnhancedRecentTransactions @selectTransaction="viewTransactionDetails" />
@@ -151,25 +92,8 @@
     </div>
 
     <!-- Transaction Overview Chart -->
-    <div class="card">
-      <div class="flex items-center justify-between mb-6">
-        <h2 class="text-xl font-semibold text-gray-900">Transaction Overview</h2>
-        <div class="flex space-x-2">
-          <button
-            v-for="period in chartPeriods"
-            :key="period.value"
-            @click="selectedPeriod = period.value"
-            :class="[
-              'px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200',
-              selectedPeriod === period.value
-                ? 'bg-blue-100 text-blue-700'
-                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
-            ]"
-          >
-            {{ period.label }}
-          </button>
-        </div>
-      </div>
-      <TransactionChart :period="selectedPeriod" />
-    </div>
+    <!-- Enhanced Transaction Chart -->
+    <EnhancedTransactionChart />
 
     <!-- New Transaction Modal -->
     <TransactionModal
@@ -184,6 +108,9 @@
 import { computed, onMounted, ref } from 'vue'
 import { useStore } from 'vuex'
 import ActivityFeed from '../components/ActivityFeed.vue'

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction
    }

    const handleTransactionUpdated = () => {
      selectedTransaction.value = null
      refreshData()
    }

    <!-- Transaction Detail Modal -->
    <TransactionDetailModal
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @close="selectedTransaction = null"
      @updated="handleTransactionUpdated"
    />
+import DashboardMetrics from '../components/DashboardMetrics.vue'
+import EnhancedTransactionChart from '../components/EnhancedTransactionChart.vue'
import EnhancedRecentTransactions from '../components/EnhancedRecentTransactions.vue'
+import SmartNotifications from '../components/SmartNotifications.vue'
 import QuickActions from '../components/QuickActions.vue'
 import SkeletonCard from '../components/SkeletonCard.vue'
 import StatCard from '../components/StatCard.vue'
@@ -230,6 +157,9 @@
import TransactionDetailModal from '../components/TransactionDetailModal.vue'
   components: {
     StatCard,
     SkeletonCard,
+    DashboardMetrics,
+    EnhancedTransactionChart,
    EnhancedRecentTransactions,
+    SmartNotifications,
     TransactionModal,
    TransactionDetailModal,
@@ -240,7 +170,7 @@
   setup() {
     const _store = useStore() // Changed to _store since it's unused
     const loading = ref(true)
     const refreshing = ref(false)
     const showNewTransactionModal = ref(false)
    const selectedTransaction = ref(null)
-    const selectedPeriod = ref('7d')
 
     // Computed properties
     const dashboardStats = computed(() => _store.getters.getDashboardStats)
@@ -248,11 +178,9 @@
     const agentName = computed(() => agentProfile.value.name || 'Agent')
 
-    const chartPeriods = [
-      { label: '7D', value: '7d' },
-      { label: '30D', value: '30d' },
-      { label: '90D', value: '90d' },
-      { label: '1Y', value: '1y' },
-    ]
+    const formatCurrency = (amount) => {
+      return parseFloat(amount || 0).toLocaleString()
+    }
 
     const loadDashboardData = async () => {
@@ -318,9 +246,9 @@
       loading,
       refreshing,
       dashboardStats,
+      formatCurrency,
       agentName,
       showNewTransactionModal,
      selectedTransaction,
       refreshData,
       handleQuickAction,
-      selectedPeriod,
-      chartPeriods,
       handleTransactionSuccess,
      viewTransactionDetails,
      handleTransactionUpdated,
       WalletIcon,