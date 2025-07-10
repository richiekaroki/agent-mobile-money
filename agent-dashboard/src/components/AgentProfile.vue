<!-- src/components/AgentProfile.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Agent Profile
      </h2>
      <button 
        @click="showEditModal = true"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Edit
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse">
        <div class="flex items-center space-x-4 mb-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
            <div class="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button 
        @click="retryLoad"
        class="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Try Again
      </button>
    </div>

    <!-- Profile Content -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white text-xl font-bold">{{ getInitials(profile.name) }}</span>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900">{{ profile.name }}</h3>
          <p class="text-sm text-gray-500">Agent ID: {{ profile.agentId }}</p>
          <div class="flex items-center mt-1">
            <span :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              <div :class="[
                'w-1.5 h-1.5 rounded-full mr-1',
                profile.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              {{ profile.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Current Balance</p>
            <p class="text-2xl font-bold text-green-600">KES {{ formatCurrency(profile.balance) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
            <p class="mt-1 text-sm text-gray-900">{{ profile.email || 'Not provided' }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
            <p class="mt-1 text-sm text-gray-900">{{ profile.phone || 'Not provided' }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
            <p class="mt-1 text-sm text-gray-900">{{ profile.location || 'Not specified' }}</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Join Date</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(profile.joinDate) }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(profile.lastLogin) }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Verification</label>
            <div class="mt-1 flex items-center">
              <svg v-if="profile.verified" class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm text-gray-900">
                {{ profile.verified ? 'Verified' : 'Not Verified' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeEditModal">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button @click="closeEditModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <form @submit.prevent="updateProfile" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              v-model="editForm.phone"
              type="tel"
              class="input-field"
              placeholder="+254 700 000 000"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              v-model="editForm.location"
              type="text"
              class="input-field"
              placeholder="Your location"
            />
          </div>

          <div class="flex space-x-3 pt-4">
            <button type="button" @click="closeEditModal" class="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="updating" class="flex-1 btn btn-primary">
              <span v-if="updating">Updating...</span>
              <span v-else>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import authService from '../services/authService'

export default {
  name: 'AgentProfile',
  setup() {
    const store = useStore()
    const profile = computed(() => store.getters.getAgentProfile)
    const loading = ref(true)
    const error = ref(null)
    const showEditModal = ref(false)
    const updating = ref(false)

    const editForm = ref({
      name: '',
      phone: '',
      location: ''
    })

    // Methods
    const getInitials = (name) => {
      if (!name) return 'AG'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const formatCurrency = (amount) => {
      return parseFloat(amount || 0).toLocaleString()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'Not available'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return 'Not available'
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const retryLoad = async () => {
      loading.value = true
      error.value = null
      try {
        await store.dispatch('fetchAgentProfile')
      } catch (err) {
        error.value = 'Failed to load profile. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const closeEditModal = () => {
      showEditModal.value = false
      // Reset form
      editForm.value = {
        name: profile.value.name || '',
        phone: profile.value.phone || '',
        location: profile.value.location || ''
      }
    }

    const updateProfile = async () => {
      updating.value = true
      try {
        const result = await authService.updateProfile({
          name: editForm.value.name,
          phone: editForm.value.phone,
          location: editForm.value.location
        })

        if (result.success) {
          store.commit('setAgentProfile', result.user)
          store.dispatch('showNotification', {
            type: 'success',
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully.',
            autoDismiss: true
          })
          closeEditModal()
        }
      } catch (err) {
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Update Failed',
          message: err.message || 'Failed to update profile.',
          autoDismiss: true
        })
      } finally {
        updating.value = false
      }
    }

    // Initialize edit form when profile changes
    const initializeEditForm = () => {
      editForm.value = {
        name: profile.value.name || '',
        phone: profile.value.phone || '',
        location: profile.value.location || ''
      }
    }

    // Fetch agent profile on mount
    onMounted(async () => {
      try {
        // Check if we already have profile data
        if (!profile.value.name) {
          await store.dispatch('fetchAgentProfile')
        }
        initializeEditForm()
      } catch (err) {
        error.value = 'Failed to load profile. Please try again.'
        console.error('Profile load error:', err)
      } finally {
        loading.value = false
      }
    })

    return {
      profile,
      loading,
      error,
      showEditModal,
      updating,
      editForm,
      getInitials,
      formatCurrency,
      formatDate,
      formatDateTime,
      retryLoad,
      closeEditModal,
      updateProfile
    }
  }
}
</script>