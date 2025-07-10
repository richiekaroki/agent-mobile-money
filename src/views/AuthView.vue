@@ .. @@
 <script>
 import { ref, computed, onMounted } from 'vue'
 import { useRouter } from 'vue-router'
 import { useStore } from 'vuex'
+import authService from '../services/authService'
 
 export default {
   name: 'AuthView',
@@ .. @@
     const handleSignIn = async () => {
       clearMessages()
       loading.value = true
 
       try {
-        // Simulate API call
-        await new Promise(resolve => setTimeout(resolve, 1500))
-
-        // Demo credentials check
-        if (signInForm.value.email === 'demo@agent.com' && signInForm.value.password === 'demo123') {
-          // Set user data in store
-          const userData = {
-            id: 1,
-            name: 'Demo Agent',
-            email: 'demo@agent.com',
-            phone: '+254 700 123 456',
-            agentId: 'AG001',
-            location: 'Nairobi, Kenya',
-            joinDate: '2023-01-15',
-            status: 'active',
-            balance: 45250
-          }
-
-          store.commit('setAgentProfile', userData)
-          localStorage.setItem('authToken', 'demo-token-123')
-          localStorage.setItem('userData', JSON.stringify(userData))
-
-          success.value = 'Sign in successful! Redirecting...'
-          
-          setTimeout(() => {
-            router.push('/')
-          }, 1000)
-        } else {
-          throw new Error('Invalid email or password')
-        }
+        const result = await authService.signIn({
+          email: signInForm.value.email,
+          password: signInForm.value.password,
+          rememberMe: signInForm.value.rememberMe
+        })
+
+        // Set user data in store
+        store.commit('setAgentProfile', result.user)
+        
+        success.value = result.message + ' Redirecting...'
+        
+        // Show success notification
+        store.dispatch('showNotification', {
+          type: 'success',
+          title: 'Welcome Back!',
+          message: `Hello ${result.user.name}, you have successfully signed in.`,
+          autoDismiss: true
+        })
+        
+        setTimeout(() => {
+          router.push('/')
+        }, 1000)
       } catch (err) {
-        error.value = err.message || 'Sign in failed. Please try again.'
+        error.value = err.message
       } finally {
         loading.value = false
       }
@@ .. @@
     const handleSignUp = async () => {
       clearMessages()
       
       if (signUpForm.value.password !== signUpForm.value.confirmPassword) {
         error.value = 'Passwords do not match'
         return
       }
 
       loading.value = true
 
       try {
-        // Simulate API call
-        await new Promise(resolve => setTimeout(resolve, 2000))
-
-        // Create new user
-        const userData = {
-          id: Date.now(),
-          name: `${signUpForm.value.firstName} ${signUpForm.value.lastName}`,
-          email: signUpForm.value.email,
-          phone: signUpForm.value.phone,
-          agentId: `AG${String(Date.now()).slice(-3)}`,
-          location: 'Kenya',
-          joinDate: new Date().toISOString().split('T')[0],
-          status: 'active',
-          balance: 10000 // Starting balance
-        }
-
-        store.commit('setAgentProfile', userData)
-        localStorage.setItem('authToken', `token-${userData.id}`)
-        localStorage.setItem('userData', JSON.stringify(userData))
-
-        success.value = 'Account created successfully! Redirecting...'
+        const result = await authService.signUp({
+          firstName: signUpForm.value.firstName,
+          lastName: signUpForm.value.lastName,
+          email: signUpForm.value.email,
+          phone: signUpForm.value.phone,
+          password: signUpForm.value.password,
+          confirmPassword: signUpForm.value.confirmPassword
+        })
+
+        // Set user data in store
+        store.commit('setAgentProfile', result.user)
+        
+        success.value = result.message + ' Redirecting...'
+        
+        // Show success notification
+        store.dispatch('showNotification', {
+          type: 'success',
+          title: 'Welcome to MobiCash!',
+          message: `Account created successfully for ${result.user.name}. You can now start using the platform.`,
+          autoDismiss: true,
+          duration: 6000
+        })
         
         setTimeout(() => {
           router.push('/')
         }, 1000)
       } catch (err) {
-        error.value = err.message || 'Account creation failed. Please try again.'
+        error.value = err.message
       } finally {
         loading.value = false
       }
@@ .. @@
     // Check if user is already authenticated
     onMounted(() => {
-      const token = localStorage.getItem('authToken')
-      const userData = localStorage.getItem('userData')
+      const token = authService.getToken()
+      const userData = authService.getCurrentUser()
       
-      if (token && userData) {
+      if (token && userData) {
         try {
-          const user = JSON.parse(userData)
-          store.commit('setAgentProfile', user)
+          store.commit('setAgentProfile', userData)
           router.push('/')
         } catch (error) {
           // Clear invalid data
-          localStorage.removeItem('authToken')
-          localStorage.removeItem('userData')
+          authService.signOut()
         }
       }
     })