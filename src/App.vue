@@ .. @@
     const currentUser = computed(() => store.getters.getAgentProfile)

     const toggleMobileMenu = () => {
     }
@@ .. @@
         // Clear auth data
         localStorage.removeItem('authToken')
         localStorage.removeItem('userData')
-        localStorage.removeItem('userData')
+        localStorage.removeItem('mobicash_auth_token')
+        localStorage.removeItem('mobicash_user_data')
+        localStorage.removeItem('mobicash_refresh_token')
         
         // Clear store
         store.commit('setAgentProfile', {
         }
         )