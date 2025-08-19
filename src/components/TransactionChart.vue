@@ .. @@
 <script>
 import { Chart, registerables } from 'chart.js'
-import { onMounted, ref, watch } from 'vue'
+import { onMounted, onUnmounted, ref, watch } from 'vue'
 import { useStore } from 'vuex'
 
 Chart.register(...registerables)
@@ .. @@
     const chartRef = ref(null)
     let chartInstance = null
 
+    // Cleanup chart on unmount
+    onUnmounted(() => {
+      if (chartInstance) {
+        chartInstance.destroy()
+      }
+    })
+
     // Date range filters (default to last 7 days)