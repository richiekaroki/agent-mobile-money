<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">MobiCash Agent</h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ isSignUp ? 'Create your agent account' : 'Sign in to your account' }}
        </p>
      </div>

      <!-- Auth Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- Error Display -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 text-sm">{{ successMessage }}</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Sign Up Fields -->
          <div v-if="isSignUp" class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.firstName }"
                placeholder="John"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.lastName }"
                placeholder="Doe"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="input-field"
              :class="{ 'border-red-500': errors.email }"
              placeholder="john@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Phone (Sign Up only) -->
          <div v-if="isSignUp">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="input-field"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="+254 700 000 000"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Enter your password"
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
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password (Sign Up only) -->
          <div v-if="isSignUp">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              class="input-field"
              :class="{ 'border-red-500': errors.confirmPassword }"
              placeholder="Confirm your password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Remember Me (Sign In only) -->
          <div v-if="!isSignUp" class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="rememberMe"
                v-model="formData.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="spinner mr-2"></div>
              {{ isSignUp ? 'Creating Account...' : 'Signing In...' }}
            </span>
            <span v-else>
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
          </button>
        </form>

        <!-- Toggle Sign Up/Sign In -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button
              @click="toggleMode"
              class="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              {{ isSignUp ? 'Sign in' : 'Sign up' }}
            </button>
          </p>
        </div>

        <!-- Demo Account Info -->
        <div v-if="!isSignUp" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Demo Account</h4>
          <p class="text-xs text-gray-600 mb-2">Use these credentials to try the demo:</p>
          <div class="text-xs text-gray-700">
            <p><strong>Email:</strong> demo@agent.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showForgotPassword = false">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-4">
              <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="resetEmail"
                v-model="resetEmail"
                type="email"
                required
                class="input-field"
                placeholder="Enter your email"
              />
            </div>
            <div class="flex space-x-3">
              <button type="button" @click="showForgotPassword = false" class="flex-1 btn btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="resetLoading" class="flex-1 btn btn-primary">
                {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AuthService from '../services/authService'

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter()
    const store = useStore()
    const authService = new AuthService()

    // Component state
    const isSignUp = ref(false)
    const loading = ref(false)
    const resetLoading = ref(false)
    const showPassword = ref(false)
    const showForgotPassword = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const resetEmail = ref('')

    // Form data
    const formData = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    })

    // Form errors
    const errors = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })

    // Clear errors
    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      error.value = ''
      successMessage.value = ''
    }

    // Validate form
    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (isSignUp.value) {
        if (!formData.firstName || formData.firstName.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters'
          isValid = false
        }

        if (!formData.lastName || formData.lastName.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters'
          isValid = false
        }

        if (!authService.validatePhone(formData.phone)) {
          errors.phone = 'Please enter a valid Kenyan phone number'
          isValid = false
        }

        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
          isValid = false
        }

        const passwordValidation = authService.validatePassword(formData.password)
        if (!passwordValidation.isValid) {
          errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
          isValid = false
        }
      }

      if (!authService.validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password is required'
        isValid = false
      }

      return isValid
    }

    // Handle form submission
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      loading.value = true
      clearErrors()

      try {
        let result

        if (isSignUp.value) {
          result = await authService.signUp(formData)
        } else {
          result = await authService.signIn({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
          })
        }

        if (result.success) {
          // Update store with user data
          store.commit('setAgentProfile', result.user)
          
          // Show success message
          successMessage.value = result.message
          
          // Show notification
          store.dispatch('showNotification', {
            type: 'success',
            title: isSignUp.value ? 'Account Created' : 'Welcome Back',
            message: result.message,
            autoDismiss: true
          })

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/')
          }, 1500)
        }
      } catch (err) {
        error.value = err.message || 'Authentication failed. Please try again.'
        
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Authentication Error',
          message: err.message || 'Authentication failed. Please try again.',
          autoDismiss: true
        })
      } finally {
        loading.value = false
      }
    }

    // Handle forgot password
    const handleForgotPassword = async () => {
      if (!authService.validateEmail(resetEmail.value)) {
        return
      }

      resetLoading.value = true

      try {
        const result = await authService.requestPasswordReset(resetEmail.value)
        
        if (result.success) {
          successMessage.value = result.message
          showForgotPassword.value = false
          resetEmail.value = ''
        }
      } catch (err) {
        error.value = err.message || 'Password reset failed'
      } finally {
        resetLoading.value = false
      }
    }

    // Toggle between sign up and sign in
    const toggleMode = () => {
      isSignUp.value = !isSignUp.value
      clearErrors()
      
      // Reset form data
      Object.keys(formData).forEach(key => {
        if (key === 'rememberMe') {
          formData[key] = false
        } else {
          formData[key] = ''
        }
      })
    }

    return {
      isSignUp,
      loading,
      resetLoading,
      showPassword,
      showForgotPassword,
      error,
      successMessage,
      resetEmail,
      formData,
      errors,
      handleSubmit,
      handleForgotPassword,
      toggleMode
    }
  }
}
</script>

<style scoped>
.spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin;
}
</style>