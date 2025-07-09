@@ .. @@
 // Auth guard
 const requireAuth = (to, from, next) => {
-  const token = localStorage.getItem('authToken')
-  if (token) {
+  const token = localStorage.getItem('mobicash_auth_token')
+  const userData = localStorage.getItem('mobicash_user_data')
+  
+  if (token && userData) {
+    try {
+      JSON.parse(userData) // Validate JSON
+      next()
+    } catch (error) {
+      // Clear invalid data
+      localStorage.removeItem('mobicash_auth_token')
+      localStorage.removeItem('mobicash_user_data')
+      localStorage.removeItem('mobicash_refresh_token')
+      next('/auth')
+    }
+  } else {
+    next('/auth')
+  }
+}
+
+const redirectIfAuth = (to, from, next) => {
+  const token = localStorage.getItem('mobicash_auth_token')
+  const userData = localStorage.getItem('mobicash_user_data')
+  
+  if (token && userData) {
     next()
   } else {
-    next('/auth')
+    next()
   }
 }
 
-const redirectIfAuth = (to, from, next) => {
-  const token = localStorage.getItem('authToken')
-  if (token) {
-    next('/')
-  } else {
-    next()
+// Global navigation guard for token validation
+const validateTokenOnNavigation = (to, from, next) => {
+  const token = localStorage.getItem('mobicash_auth_token')
+  
+  if (token) {
+    // In production, validate token with backend
+    // For now, just check if it exists and is not expired
+    const tokenAge = Date.now() - parseInt(localStorage.getItem('mobicash_token_timestamp') || '0')
+    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
+    
+    if (tokenAge > maxAge) {
+      // Token expired, clear and redirect
+      localStorage.removeItem('mobicash_auth_token')
+      localStorage.removeItem('mobicash_user_data')
+      localStorage.removeItem('mobicash_refresh_token')
+      
+      if (to.path !== '/auth') {
+        next('/auth')
+        return
+      }
+    }
   }
+  
+  next()
 }