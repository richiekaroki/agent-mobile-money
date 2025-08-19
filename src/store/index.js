@@ .. @@
     addTransaction(state, transaction) {
       state.transactions.unshift(transaction)
-      state.dashboardStats.todayTransactions += 1
+      // Only increment if it's today's transaction
+      const today = new Date().toISOString().split('T')[0]
+      if (transaction.date === today) {
+        state.dashboardStats.todayTransactions += 1
+      }
       if (transaction.status === 'pending') {
         state.dashboardStats.pendingTransactions += 1
       }
     },