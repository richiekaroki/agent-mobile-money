<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
        </h1>
        <p class="text-gray-600">
          {{ isSignUp ? 'Join our agent network today' : 'Sign in to your agent dashboard' }}
        </p>
      </div>

      <!-- Demo Account Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-blue-900 mb-2">Demo Account</h3>
        <p class="text-sm text-blue-700 mb-2">Use these credentials to try the demo:</p>
        <div class="text-sm font-mono text-blue-800">
          <div>Email: demo@agent.com</div>
          <div>Password: demo123</div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sign Up Fields -->
        <div v-if="isSignUp" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              v-model="formData.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              v-model="formData.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <!-- Phone (Sign Up only) -->
        <div v-if="isSignUp">
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+254700000000"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="formData.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <!-- Confirm Password (Sign Up only) -->
        <div v-if="isSignUp">
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
        </div>

        <!-- Remember Me (Sign In only) -->
        <div v-if="!isSignUp" class="flex items-center">
          <input
            v-model="formData.rememberMe"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label class="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}
        </button>
      </form>

      <!-- Toggle Form -->
      <div class="text-center mt-6">
        <button
          @click="toggleForm"
          class="text-blue-600 hover:text-blue-500 text-sm"
        >
          {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/authService'

export default {
  name: 'AuthView',
  data() {
    return {
      isSignUp: false,
      isLoading: false,
      errorMessage: '',
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      }
    }
  },
  methods: {
    toggleForm() {
      this.isSignUp = !this.isSignUp
      this.errorMessage = ''
      this.resetForm()
    },

    resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      }
    },

    async handleSubmit() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        if (this.isSignUp) {
          const result = await authService.signUp(this.formData)
          if (result.success) {
            this.$store.dispatch('showNotification', {
              type: 'success',
              title: 'Account Created',
              message: result.message,
              autoDismiss: true
            })
            this.$router.push('/')
          }
        } else {
          const result = await authService.signIn({
            email: this.formData.email,
            password: this.formData.password,
            rememberMe: this.formData.rememberMe
          })
          if (result.success) {
            this.$store.dispatch('showNotification', {
              type: 'success',
              title: 'Welcome Back',
              message: result.message,
              autoDismiss: true
            })
            this.$router.push('/')
          }
        }
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  @apply min-h-screen bg-gray-50 flex items-center justify-center p-4;
}

.auth-card {
  @apply bg-white p-8 rounded-lg shadow-md w-full max-w-md;
}
</style>
