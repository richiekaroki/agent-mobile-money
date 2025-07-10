<!-- src/App.vue -->
<template>
  <div v-if="!isAuthRoute" class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">{{ appConfig.name }}</h1>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-1" role="navigation">
            <router-link 
              to="/" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
              aria-label="Go to Dashboard"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              Dashboard
            </router-link>
            <router-link 
              to="/transactions" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/transactions' }"
              aria-label="Go to Transactions"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Transactions
            </router-link>
          </nav>

          <!-- User Menu and Mobile menu button -->
          <div class="flex items-center space-x-4">
            <!-- User Menu -->
            <div class="hidden md:flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                <p class="text-xs text-gray-500">{{ currentUser.agentId }}</p>
              </div>
              <button 
                @click="logout"
                class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Logout"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>

            <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200 animate-fade-in">
          <div class="flex flex-col space-y-2">
            <router-link 
              to="/" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path === '/' }"
              @click="closeMobileMenu"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              Dashboard
            </router-link>
            <router-link 
              to="/transactions" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path === '/transactions' }"
              @click="closeMobileMenu"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Transactions
            </router-link>
            
            <!-- Mobile User Info -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser.agentId }}</p>
                </div>
                <button 
                  @click="logout"
                  class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  title="Logout"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Notification Component -->
    <NotificationComponent />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
  
  <!-- Auth Route (Full Screen) -->
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    NotificationComponent,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const showMobileMenu = ref(false)

    // App configuration
    const appConfig = ref({
      name: 'MobiCash Agent'
    })

    // Computed properties
    const isAuthRoute = computed(() => route.path === '/auth')
    const currentUser = computed(() => store.getters.getAgentProfile)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    const logout = () => {
      if (confirm('Are you sure you want to logout?')) {
        // Clear auth data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('userData')
        
        // Clear store
        store.commit('setAgentProfile', {
          name: '',
          balance: 0,
          agentId: '',
          phone: '',
          location: '',
          joinDate: '',
          status: ''
        })
        
        // Redirect to auth
        router.push('/auth')
        
        // Show notification
        store.dispatch('showNotification', {
          type: 'info',
          title: 'Logged Out',
          message: 'You have been successfully logged out.',
          autoDismiss: true
        })
      }
    }
    return {
      appConfig,
      isAuthRoute,
      currentUser,
      showMobileMenu,
      toggleMobileMenu,
      closeMobileMenu,
      logout
      }
  }
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-all duration-200;
}

.nav-link-active {
  @apply text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700;
}

.mobile-nav-link {
  @apply flex items-center px-3 py-2 text-base font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-all duration-200;
}

.mobile-nav-link-active {
  @apply text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700;
}
</style>