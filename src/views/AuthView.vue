<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Branding -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">{{ appConfig.name }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ appConfig.tagline }}</p>
      </div>

      <!-- Auth Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-shadow duration-300">
        <!-- Tab Navigation -->
        <div class="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          <button
            @click="switchTab('signin')"
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
            @click="switchTab('signup')"
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

        <!-- Alert Messages -->
        <div v-if="alert.show" :class="[
          'mb-6 rounded-lg p-4 border',
          alert.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        ]">
          <div class="flex items-center">
            <svg v-if="alert.type === 'error'" class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span :class="alert.type === 'error' ? 'text-red-800' : 'text-green-800'" class="text-sm">
              {{ alert.message }}
            </span>
          </div>
        </div>

        <!-- Sign In Form -->
        <form v-if="activeTab === 'signin'" @submit.prevent="handleSignIn" class="space-y-6">
          <div>
            <label for="signin-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="signin-email"
              v-model="signInForm.email"
              type="email"
              required
              autocomplete="email"
              :class="[
                'input-field',
                validationErrors.email ? 'border-red-500 focus:ring-red-500' : ''
              ]"
              placeholder="Enter your email"
              :disabled="loading"
              @blur="validateField('email', signInForm.email)"
            />
            <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
              {{ validationErrors.email }}
            </p>
          </div>

          <div>
            <label for="signin-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div class="relative">
              <input
                id="signin-password"
                v-model="signInForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                :class="[
                  'input-field pr-10',
                  validationErrors.password ? 'border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="Enter your password"
                :disabled="loading"
                @blur="validateField('password', signInForm.password)"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
                tabindex="-1"
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
            <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
              {{ validationErrors.password }}
            </p>
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
            <button 
              type="button" 
              @click="showForgotPassword = true"
              class="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading || !isSignInFormValid"
            class="w-full btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform duration-200"
          >
            <div v-if="loading" class="spinner mr-2"></div>
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Sign Up Form -->
        <form v-else @submit.prevent="handleSignUp" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="signup-firstname" class="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                id="signup-firstname"
                v-model="signUpForm.firstName"
                type="text"
                required
                autocomplete="given-name"
                :class="[
                  'input-field',
                  validationErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="First name"
                :disabled="loading"
                @blur="validateField('firstName', signUpForm.firstName)"
              />
              <p v-if="validationErrors.firstName" class="mt-1 text-sm text-red-600">
                {{ validationErrors.firstName }}
              </p>
            </div>
            <div>
              <label for="signup-lastname" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                id="signup-lastname"
                v-model="signUpForm.lastName"
                type="text"
                required
                autocomplete="family-name"
                :class="[
                  'input-field',
                  validationErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="Last name"
                :disabled="loading"
                @blur="validateField('lastName', signUpForm.lastName)"
              />
              <p v-if="validationErrors.lastName" class="mt-1 text-sm text-red-600">
                {{ validationErrors.lastName }}
              </p>
            </div>
          </div>

          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="signup-email"
              v-model="signUpForm.email"
              type="email"
              required
              autocomplete="email"
              :class="[
                'input-field',
                validationErrors.signupEmail ? 'border-red-500 focus:ring-red-500' : ''
              ]"
              placeholder="Enter your email"
              :disabled="loading"
              @blur="validateField('signupEmail', signUpForm.email)"
            />
            <p v-if="validationErrors.signupEmail" class="mt-1 text-sm text-red-600">
              {{ validationErrors.signupEmail }}
            </p>
          </div>

          <div>
            <label for="signup-phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              id="signup-phone"
              v-model="signUpForm.phone"
              type="tel"
              required
              autocomplete="tel"
              :class="[
                'input-field',
                validationErrors.phone ? 'border-red-500 focus:ring-red-500' : ''
              ]"
              placeholder="+254 700 000 000"
              :disabled="loading"
              @blur="validateField('phone', signUpForm.phone)"
            />
            <p v-if="validationErrors.phone" class="mt-1 text-sm text-red-600">
              {{ validationErrors.phone }}
            </p>
          </div>

          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div class="relative">
              <input
                id="signup-password"
                v-model="signUpForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                :class="[
                  'input-field pr-10',
                  validationErrors.signupPassword ? 'border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="Create a password"
                :disabled="loading"
                @input="validatePassword"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
                tabindex="-1"
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
            
            <!-- Password Strength Indicator -->
            <div v-if="signUpForm.password" class="mt-2">
              <div class="flex items-center space-x-2 mb-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      `bg-${passwordStrength.color}-500`
                    ]"
                    :style="{ width: `${passwordStrength.percentage}%` }"
                  ></div>
                </div>
                <span :class="`text-${passwordStrength.color}-600`" class="text-xs font-medium capitalize">
                  {{ passwordStrength.level }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div :class="passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="passwordRequirements.minLength" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  8+ characters
                </div>
                <div :class="passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="passwordRequirements.hasUpperCase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Uppercase
                </div>
                <div :class="passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="passwordRequirements.hasLowerCase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Lowercase
                </div>
                <div :class="passwordRequirements.hasNumbers ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="passwordRequirements.hasNumbers" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Numbers
                </div>
              </div>
            </div>
            
            <p v-if="validationErrors.signupPassword" class="mt-1 text-sm text-red-600">
              {{ validationErrors.signupPassword }}
            </p>
          </div>

          <div>
            <label for="signup-confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              id="signup-confirm-password"
              v-model="signUpForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              :class="[
                'input-field',
                validationErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
              ]"
              placeholder="Confirm your password"
              :disabled="loading"
              @blur="validateField('confirmPassword', signUpForm.confirmPassword)"
            />
            <p v-if="validationErrors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ validationErrors.confirmPassword }}
            </p>
          </div>

          <div class="flex items-start">
            <input
              id="terms"
              v-model="signUpForm.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-500 underline">Terms of Service</a> and 
              <a href="#" class="text-blue-600 hover:text-blue-500 underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !isSignUpFormValid"
            class="w-full btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform duration-200"
          >
            <div v-if="loading" class="spinner mr-2"></div>
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 class="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Demo Credentials
          </h4>
          <div class="text-xs text-blue-700 space-y-1">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Agent Account:</strong></p>
                <p>Email: demo@agent.com</p>
                <p>Password: demo123</p>
              </div>
              <div>
                <p><strong>Admin Account:</strong></p>
                <p>Email: admin@mobicash.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
            <button 
              @click="fillDemoCredentials"
              class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Use demo credentials
            </button>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showForgotPassword = false">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                v-model="forgotPasswordEmail"
                type="email"
                required
                class="input-field"
                placeholder="Enter your email"
              />
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="showForgotPassword = false"
                class="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 btn btn-primary"
              >
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ appConfig.name }}. All rights reserved.</p>
        <p class="mt-1">Secure • Reliable • Professional</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import authService from '../services/authService.js'

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const activeTab = ref('signin')
    const loading = ref(false)
    const showPassword = ref(false)
    const showForgotPassword = ref(false)
    const forgotPasswordEmail = ref('')

    // Alert system
    const alert = reactive({
      show: false,
      type: 'error',
      message: ''
    })

    // Validation errors
    const validationErrors = reactive({})

    // App configuration
    const appConfig = ref({
      name: 'MobiCash Agent',
      tagline: 'Professional Mobile Money Management Platform'
    })

    // Sign in form
    const signInForm = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    // Sign up form
    const signUpForm = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })

    // Password validation
    const passwordValidation = ref({
      isValid: false,
      strength: { level: 'weak', color: 'red', percentage: 0 },
      requirements: {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        hasSpecialChar: false
      }
    })

    // Computed properties
    const passwordStrength = computed(() => passwordValidation.value.strength)
    const passwordRequirements = computed(() => passwordValidation.value.requirements)
    
    const isSignInFormValid = computed(() => {
      return signInForm.email && signInForm.password && signInForm.password.length >= 6
    })
    
    const isSignUpFormValid = computed(() => {
      return (
        signUpForm.firstName &&
        signUpForm.lastName &&
        signUpForm.email &&
        signUpForm.phone &&
        signUpForm.password &&
        signUpForm.confirmPassword &&
        signUpForm.password === signUpForm.confirmPassword &&
        passwordValidation.value.isValid &&
        signUpForm.acceptTerms &&
        Object.keys(validationErrors).length === 0
      )
    })

    // Methods
    const showAlert = (type, message) => {
      alert.show = true
      alert.type = type
      alert.message = message
      
      if (type === 'success') {
        setTimeout(() => {
          alert.show = false
        }, 3000)
      }
    }

    const clearAlert = () => {
      alert.show = false
    }

    const switchTab = (tab) => {
      activeTab.value = tab
      clearAlert()
      Object.keys(validationErrors).forEach(key => {
        delete validationErrors[key]
      })
    }

    const validateField = (field, value) => {
      delete validationErrors[field]

      switch (field) {
        case 'email':
        case 'signupEmail':
          if (!authService.validateEmail(value)) {
            validationErrors[field] = 'Please enter a valid email address'
          }
          break
        case 'password':
          if (value.length < 6) {
            validationErrors[field] = 'Password must be at least 6 characters long'
          }
          break
        case 'firstName':
        case 'lastName':
          if (value.length < 2) {
            validationErrors[field] = `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters long`
          }
          break
        case 'phone':
          if (!authService.validatePhone(value)) {
            validationErrors[field] = 'Please enter a valid Kenyan phone number'
          }
          break
        case 'signupPassword':
          const validation = authService.validatePassword(value)
          if (!validation.isValid) {
            validationErrors[field] = 'Password must meet all requirements'
          }
          break
        case 'confirmPassword':
          if (value !== signUpForm.password) {
            validationErrors[field] = 'Passwords do not match'
          }
          break
      }
    }

    const validatePassword = () => {
      const validation = authService.validatePassword(signUpForm.password)
      passwordValidation.value = validation
      validateField('signupPassword', signUpForm.password)
    }

    const fillDemoCredentials = () => {
      signInForm.email = 'demo@agent.com'
      signInForm.password = 'demo123'
      activeTab.value = 'signin'
      clearAlert()
    }

    const handleSignIn = async () => {
      clearAlert()
      
      // Validate form
      validateField('email', signInForm.email)
      validateField('password', signInForm.password)
      
      if (Object.keys(validationErrors).length > 0) {
        showAlert('error', 'Please fix the errors below')
        return
      }

      loading.value = true

      try {
        const response = await authService.signIn(signInForm)
        
        // Update store
        store.commit('setAgentProfile', response.user)
        
        showAlert('success', response.message)
        
        setTimeout(() => {
          router.push('/')
        }, 1000)
        
      } catch (error) {
        showAlert('error', error.message)
      } finally {
        loading.value = false
      }
    }

    const handleSignUp = async () => {
      clearAlert()
      
      // Validate all fields
      validateField('firstName', signUpForm.firstName)
      validateField('lastName', signUpForm.lastName)
      validateField('signupEmail', signUpForm.email)
      validateField('phone', signUpForm.phone)
      validateField('signupPassword', signUpForm.password)
      validateField('confirmPassword', signUpForm.confirmPassword)
      
      if (Object.keys(validationErrors).length > 0) {
        showAlert('error', 'Please fix the errors below')
        return
      }

      loading.value = true

      try {
        const response = await authService.signUp(signUpForm)
        
        // Update store
        store.commit('setAgentProfile', response.user)
        
        showAlert('success', response.message)
        
        setTimeout(() => {
          router.push('/')
        }, 1500)
        
      } catch (error) {
        showAlert('error', error.message)
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = async () => {
      if (!authService.validateEmail(forgotPasswordEmail.value)) {
        showAlert('error', 'Please enter a valid email address')
        return
      }

      loading.value = true

      try {
        const response = await authService.requestPasswordReset(forgotPasswordEmail.value)
        showAlert('success', response.message)
        showForgotPassword.value = false
        forgotPasswordEmail.value = ''
      } catch (error) {
        showAlert('error', error.message)
      } finally {
        loading.value = false
      }
    }

    // Check if user is already authenticated
    onMounted(() => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser()
        if (user) {
          store.commit('setAgentProfile', user)
          router.push('/')
        }
      }
    })

    return {
      activeTab,
      loading,
      showPassword,
      showForgotPassword,
      forgotPasswordEmail,
      alert,
      validationErrors,
      appConfig,
      signInForm,
      signUpForm,
      passwordStrength,
      passwordRequirements,
      isSignInFormValid,
      isSignUpFormValid,
      switchTab,
      validateField,
      validatePassword,
      fillDemoCredentials,
      handleSignIn,
      handleSignUp,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin;
}

/* Custom focus styles */
.input-field:focus {
  @apply ring-2 ring-blue-500 border-transparent;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>