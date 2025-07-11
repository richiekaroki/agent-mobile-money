<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
        </h2>
        <p class="text-gray-600">
          {{ isSignUp ? 'Join MobiCash Agent Network' : 'Sign in to your agent account' }}
        </p>
      </div>

      <!-- Demo Account Notice -->
      <div v-if="!isSignUp" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-blue-800 mb-1">Demo Account Available</h4>
            <p class="text-sm text-blue-700">
              Email: <code class="bg-blue-100 px-1 rounded">demo@agent.com</code><br>
              Password: <code class="bg-blue-100 px-1 rounded">demo123</code>
            </p>
          </div>
        </div>
      </div>

      <!-- Auth Form -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <!-- Error Display -->
        <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Success Display -->
        <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 text-sm">{{ success }}</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Sign Up Fields -->
          <div v-if="isSignUp" class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500 focus:ring-red-500': errors.firstName }"
                placeholder="John"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500 focus:ring-red-500': errors.lastName }"
                placeholder="Doe"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
              placeholder="agent@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Phone (Sign Up only) -->
          <div v-if="isSignUp">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:ring-red-500': errors.phone }"
              placeholder="+254 700 000 000"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            
            <!-- Password Strength Indicator (Sign Up only) -->
            <div v-if="isSignUp && formData.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    ]"
                    :style="{ width: `${passwordStrength.percentage}%` }"
                  ></div>
                </div>
                <span :class="[
                  'text-xs font-medium capitalize',
                  passwordStrength.color === 'red' ? 'text-red-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                ]">
                  {{ passwordStrength.level }}
                </span>
              </div>
              
              <!-- Password Requirements -->
              <div v-if="formData.password" class="mt-2 text-xs space-y-1">
                <div class="grid grid-cols-2 gap-1">
                  <div :class="passwordStrength.requirements?.minLength ? 'text-green-600' : 'text-red-600'">
                    ✓ 8+ characters
                  </div>
                  <div :class="passwordStrength.requirements?.hasUpperCase ? 'text-green-600' : 'text-red-600'">
                    ✓ Uppercase letter
                  </div>
                  <div :class="passwordStrength.requirements?.hasLowerCase ? 'text-green-600' : 'text-red-600'">
                    ✓ Lowercase letter
                  </div>
                  <div :class="passwordStrength.requirements?.hasNumbers ? 'text-green-600' : 'text-red-600'">
                    ✓ Number
                  </div>
                  <div :class="passwordStrength.requirements?.hasSpecialChar ? 'text-green-600' : 'text-red-600'">
                    ✓ Special character
                  </div>
                  <div :class="passwordStrength.requirements?.hasNoSpaces ? 'text-green-600' : 'text-red-600'">
                    ✓ No spaces
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirm Password (Sign Up only) -->
          <div v-if="isSignUp">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              class="input-field"
              :class="{ 'border-red-500 focus:ring-red-500': errors.confirmPassword }"
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
            :disabled="loading || !isFormValid"
            class="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <div v-if="loading" class="spinner mr-2"></div>
            {{ loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In') }}
          </button>
        </form>

        <!-- Toggle Sign Up/Sign In -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button
              type="button"
              @click="toggleMode"
              class="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showForgotPassword = false">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
          <p class="text-sm text-gray-600 mb-4">Enter your email address and we'll send you instructions to reset your password.</p>
          
          <form @submit.prevent="handleForgotPassword">
            <input
              v-model="forgotPasswordEmail"
              type="email"
              required
              class="input-field mb-4"
              placeholder="Enter your email"
            />
            <div class="flex space-x-3">
              <button type="button" @click="showForgotPassword = false" class="flex-1 btn btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="forgotPasswordLoading" class="flex-1 btn btn-primary">
                {{ forgotPasswordLoading ? 'Sending...' : 'Send Instructions' }}
              </button>
            </div>
          </form>
        </div>
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

    // Component state
    const isSignUp = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)
    const showForgotPassword = ref(false)
    const forgotPasswordLoading = ref(false)
    const forgotPasswordEmail = ref('')
    const error = ref('')
    const success = ref('')

    // Form data
    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    })

    // Form errors
    const errors = ref({})

    // Computed properties
    const passwordStrength = computed(() => {
      if (!formData.value.password) return { level: 'weak', color: 'red', percentage: 0 }
      const validation = authService.validatePassword(formData.value.password)
      return { ...validation.strength, requirements: validation.requirements }
    })

    const isFormValid = computed(() => {
      if (isSignUp.value) {
        return (
          formData.value.firstName &&
          formData.value.lastName &&
          formData.value.email &&
          formData.value.phone &&
          formData.value.password &&
          formData.value.confirmPassword &&
          formData.value.password === formData.value.confirmPassword &&
          Object.keys(errors.value).length === 0
        )
      } else {
        return formData.value.email && formData.value.password
      }
    })

    // Methods
    const validateForm = () => {
      errors.value = {}

      if (isSignUp.value) {
        // First name validation
        if (!formData.value.firstName || formData.value.firstName.length < 2) {
          errors.value.firstName = 'First name must be at least 2 characters'
        }

        // Last name validation
        if (!formData.value.lastName || formData.value.lastName.length < 2) {
          errors.value.lastName = 'Last name must be at least 2 characters'
        }

        // Phone validation
        if (!authService.validatePhone(formData.value.phone)) {
          errors.value.phone = 'Please enter a valid Kenyan phone number'
        }

        // Password validation
        const passwordValidation = authService.validatePassword(formData.value.password)
        if (!passwordValidation.isValid) {
          errors.value.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        }

        // Confirm password validation
        if (formData.value.password !== formData.value.confirmPassword) {
          errors.value.confirmPassword = 'Passwords do not match'
        }
      }

      // Email validation
      if (!authService.validateEmail(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = async () => {
      error.value = ''
      success.value = ''

      if (!validateForm()) {
        return
      }

      loading.value = true

      try {
        let result
        if (isSignUp.value) {
          result = await authService.signUp(formData.value)
          success.value = result.message
          
          // Auto-sign in after successful sign up
          setTimeout(async () => {
            try {
              const signInResult = await authService.signIn({
                email: formData.value.email,
                password: formData.value.password,
                rememberMe: true
              })
              
              // Update store with user data
              store.commit('setAgentProfile', signInResult.user)
              
              // Show success notification
              store.dispatch('showNotification', {
                type: 'success',
                title: 'Welcome!',
                message: `Account created successfully! Welcome to MobiCash, ${signInResult.user.name}!`,
                autoDismiss: true,
                duration: 6000
              })
              
              // Redirect to dashboard
              router.push('/')
            } catch (signInError) {
              console.error('Auto sign-in failed:', signInError)
              // Just show success message and let user sign in manually
              setTimeout(() => {
                isSignUp.value = false
                resetForm()
              }, 2000)
            }
          }, 1500)
        } else {
          result = await authService.signIn(formData.value)
          
          // Update store with user data
          store.commit('setAgentProfile', result.user)
          
          // Show success notification
          store.dispatch('showNotification', {
            type: 'success',
            title: 'Welcome Back!',
            message: `Successfully signed in. Welcome back, ${result.user.name}!`,
            autoDismiss: true
          })
          
          // Redirect to dashboard
          router.push('/')
        }
      } catch (err) {
        error.value = err.message
        console.error('Auth error:', err)
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = async () => {
      if (!authService.validateEmail(forgotPasswordEmail.value)) {
        error.value = 'Please enter a valid email address'
        return
      }

      forgotPasswordLoading.value = true
      error.value = ''

      try {
        await authService.requestPasswordReset(forgotPasswordEmail.value)
        success.value = 'Password reset instructions have been sent to your email'
        showForgotPassword.value = false
        forgotPasswordEmail.value = ''
      } catch (err) {
        error.value = err.message
      } finally {
        forgotPasswordLoading.value = false
      }
    }

    const toggleMode = () => {
      isSignUp.value = !isSignUp.value
      resetForm()
      error.value = ''
      success.value = ''
    }

    const resetForm = () => {
      formData.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      }
      errors.value = {}
    }

    // Check if user is already authenticated
    onMounted(() => {
      if (authService.isAuthenticated()) {
        router.push('/')
      }
    })

    return {
      isSignUp,
      loading,
      showPassword,
      showForgotPassword,
      forgotPasswordLoading,
      forgotPasswordEmail,
      error,
      success,
      formData,
      errors,
      passwordStrength,
      isFormValid,
      handleSubmit,
      handleForgotPassword,
      toggleMode,
      validateForm
    }
  }
}
</script>

<style scoped>
.spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin;
}
</style>