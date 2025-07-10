@@ .. @@
     const logout = () => {
       if (confirm('Are you sure you want to logout?')) {
-        // Clear auth data
-        localStorage.removeItem('authToken')
-        localStorage.removeItem('userData')
+        // Use auth service to sign out
+        authService.signOut()
         
         // Clear store
         store.commit('setAgentProfile', {
@@ .. @@
 <script>
 import { ref, computed } from 'vue'
 import { useRoute, useRouter } from 'vue-router'
 import { useStore } from 'vuex'
 import NotificationComponent from './components/NotificationComponent.vue'
+import authService from './services/authService'
 
 export default {
   name: 'App',
@@ .. @@
     return {
       appConfig,
       isAuthRoute,
       currentUser,
       showMobileMenu,
       toggleMobileMenu,
       closeMobileMenu,
-      logout
+      logout,
+      authService
     }
   }
 }