@@ .. @@
     // Auto-dismiss notifications
     const setupAutoDismiss = () => {
       notifications.value.forEach(notification => {
         if (notification.autoDismiss && !progressIntervals.value.has(notification.id)) {
           const duration = notification.duration || 5000
           const interval = setInterval(() => {
             if (Date.now() - notification.createdAt >= duration) {
               removeNotification(notification.id)
             }
           }, 100)
           progressIntervals.value.set(notification.id, interval)
         }
       })
     }
 
+    // Watch for new notifications
+    watch(notifications, () => {
+      setupAutoDismiss()
+    }, { deep: true })
+
     onMounted(() => {
       setupAutoDismiss()
     })