<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import authService from '../services/authService'

export default {
  name: 'AuthView',
  setup() {
    const handleSignIn = async () => {
      clearMessages()
      loading.value = true

      try {
        const result = await authService.signIn({
          email: signInForm.value.email,
          password: signInForm.value.password,
          rememberMe: signInForm.value.rememberMe
        })

        // Set user data in store
        store.commit('setAgentProfile', result.user)
        
        success.value = result.message + ' Redirecting...'
        
        // Show success notification
        store.dispatch('showNotification', {
          type: 'success',
          title: 'Welcome Back!',
          message: `Hello ${result.user.name}, you have successfully signed in.`,
          autoDismiss: true
        })
        
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const handleSignUp = async () => {
      clearMessages()
      
      if (signUpForm.value.password !== signUpForm.value.confirmPassword) {
        error.value = 'Passwords do not match'
        return
      }

      loading.value = true

      try {
        const result = await authService.signUp({
          firstName: signUpForm.value.firstName,
          lastName: signUpForm.value.lastName,
          email: signUpForm.value.email,
          phone: signUpForm.value.phone,
          password: signUpForm.value.password,
          confirmPassword: signUpForm.value.confirmPassword
        })

        // Set user data in store
        store.commit('setAgentProfile', result.user)
        
        success.value = result.message + ' Redirecting...'
        
        // Show success notification
        store.dispatch('showNotification', {
          type: 'success',
          title: 'Welcome to MobiCash!',
          message: `Account created successfully for ${result.user.name}. You can now start using the platform.`,
          autoDismiss: true,
          duration: 6000
        })
        
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    // Check if user is already authenticated
    onMounted(() => {
      const token = authService.getToken()
      const userData = authService.getCurrentUser()
      
      if (token && userData) {
        try {
          store.commit('setAgentProfile', userData)
          router.push('/')
        } catch (error) {
          // Clear invalid data
          authService.signOut()
        }
      }
    })
  }
}
</script>