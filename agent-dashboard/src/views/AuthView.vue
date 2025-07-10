<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Branding -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">{{ appConfig.name }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ appConfig.tagline }}</p>
      </div>

      <!-- Auth Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Tab Navigation -->
        <div class="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          <button
            @click="activeTab = 'signin'"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'signin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 text-sm">{{ success }}</span>
          </div>
        </div>

        <!-- Sign In Form -->
        <form v-if="activeTab === 'signin'" @submit.prevent="handleSignIn" class="space-y-6">
          <div>
            <label for="signin-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="signin-email"
              v-model="signInForm.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="signin-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="signin-password"
                v-model="signInForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="Enter your password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="signInForm.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button type="button" class="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary flex items-center justify-center"
          >
            <div v-if="loading" class="spinner mr-2"></div>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Sign Up Form -->
        <form v-else @submit.prevent="handleSignUp" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="signup-firstname" class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="signup-firstname"
                v-model="signUpForm.firstName"
                type="text"
                required
                class="input-field"
                placeholder="First name"
                :disabled="loading"
              />
            </div>
            <div>
              <label for="signup-lastname" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="signup-lastname"
                v-model="signUpForm.lastName"
                type="text"
                required
                class="input-field"
                placeholder="Last name"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="signup-email"
              v-model="signUpForm.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="signup-phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="signup-phone"
              v-model="signUpForm.phone"
              type="tel"
              required
              class="input-field"
              placeholder="+254 700 000 000"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="signup-password"
                v-model="signUpForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="Create a password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2 text-xs">
                <div :class="['w-2 h-2 rounded-full', passwordStrength.length >= 8 ? 'bg-green-500' : 'bg-gray-300']"></div>
                <span :class="passwordStrength.length >= 8 ? 'text-green-600' : 'text-gray-500'">8+ characters</span>
              </div>
            </div>
          </div>

          <div>
            <label for="signup-confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              v-model="signUpForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field"
              placeholder="Confirm your password"
              :disabled="loading"
            />
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="signUpForm.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a> and 
              <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !isSignUpValid"
            class="w-full btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="loading" class="spinner mr-2"></div>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
          <div class="text-xs text-blue-700 space-y-1">
            <p><strong>Email:</strong> demo@agent.com</p>
            <p><strong>Password:</strong> demo123</p>
            <button 
              @click="fillDemoCredentials"
              class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Use demo credentials
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ appConfig.name }}. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import authService from '../services/authService'

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const activeTab = ref('signin')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const showPassword = ref(false)

    // App configuration
    const appConfig = ref({
      name: 'MobiCash Agent',
      tagline: 'Your Mobile Money Management Platform'
    })

    // Sign in form
    const signInForm = ref({
      email: '',
      password: '',
      rememberMe: false
    })

    // Sign up form
    const signUpForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })

    // Computed properties
    const passwordStrength = computed(() => signUpForm.value.password)
    
    const isSignUpValid = computed(() => {
      return (
        signUpForm.value.firstName &&
        signUpForm.value.lastName &&
        signUpForm.value.email &&
        signUpForm.value.phone &&
        signUpForm.value.password &&
        signUpForm.value.password === signUpForm.value.confirmPassword &&
        signUpForm.value.password.length >= 8 &&
        signUpForm.value.acceptTerms
      )
    })

    // Methods
    const clearMessages = () => {
      error.value = ''
      success.value = ''
    }

    const fillDemoCredentials = () => {
      signInForm.value.email = 'demo@agent.com'
      signInForm.value.password = 'demo123'
      activeTab.value = 'signin'
    }

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

    return {
      activeTab,
      loading,
      error,
      success,
      showPassword,
      appConfig,
      signInForm,
      signUpForm,
      passwordStrength,
      isSignUpValid,
      fillDemoCredentials,
      handleSignIn,
      handleSignUp,
      authService
    }
  }
}
</script>

<style scoped>
.spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin;
}
</style>