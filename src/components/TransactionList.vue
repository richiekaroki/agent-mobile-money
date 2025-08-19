@@ .. @@
     const fetchTransactions = async () => {
       try {
+        loading.value = true
         const data = await fetchMockTransactions()
         transactions.value = data
-      } catch (_err) {
-        // Changed to _err since it's unused
+      } catch (err) {
+        console.error('Failed to fetch transactions:', err)
         error.value = 'Failed to load transactions. Please try again later.'
       } finally {
         loading.value = false
       }
     }