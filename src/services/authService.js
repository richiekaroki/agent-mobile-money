@@ .. @@
   // Enhanced session validation
   isAuthenticated() {
     try {
       const token = this.getToken()
       const user = this.getCurrentUser()
 
       if (!token || !user) {
         return false
       }
 
-      // Check if session has expired (optional, for enhanced security)
-      const userData = localStorage.getItem(this.userKey)
-      if (userData) {
-        const session = JSON.parse(userData)
-        if (session.expiresAt && Date.now() > session.expiresAt) {
-          this.signOut()
-          return false
-        }
-      }
+      // Check if session has expired
+      const sessionData = localStorage.getItem('mobicash_session_data')
+      if (sessionData) {
+        const session = JSON.parse(sessionData)
+        if (session.expiresAt && Date.now() > session.expiresAt) {
+          this.signOut()
+          return false
+        }
+      }
 
       return true
     } catch {