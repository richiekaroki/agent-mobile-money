@@ .. @@
     const logout = () => {
       if (confirm('Are you sure you want to logout?')) {
         // Clear auth data
       }
     }
-        localStorage.removeItem('authToken')
-        localStorage.removeItem('userData')
+        localStorage.removeItem('mobicash_auth_token')
+        localStorage.removeItem('mobicash_user_data')
+        localStorage.removeItem('mobicash_refresh_token')
         
         // Clear store