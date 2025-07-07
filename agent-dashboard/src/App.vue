<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
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
            <h1 class="text-xl font-semibold text-gray-900">Mobile Money Agent</h1>
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
</template>

<script>
import { ref } from 'vue'
import NotificationComponent from './components/NotificationComponent.vue'

export default {
  name: 'App',
  components: {
    NotificationComponent,
  },
  setup() {
    const showMobileMenu = ref(false)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    return {
      showMobileMenu,
      toggleMobileMenu,
      closeMobileMenu
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