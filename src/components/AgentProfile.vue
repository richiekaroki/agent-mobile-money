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
        class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Edit
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button 
        @click="loadProfile"
        class="mt-2 btn btn-secondary text-sm"
      >
        Try Again
      </button>
    </div>

    <!-- Profile data -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span class="text-white text-xl font-bold">
            {{ getInitials(profile.name) }}
          </span>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">{{ profile.name }}</h3>
          <p class="text-sm text-gray-600">Agent ID: {{ profile.agentId }}</p>
          <div class="flex items-center mt-1">
            <span :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              getStatusClass(profile.status)
            ]">
              <div :class="[
                'w-1.5 h-1.5 rounded-full mr-1',
                getStatusDotClass(profile.status)
              ]"></div>
              {{ profile.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-800">Current Balance</p>
            <p class="text-2xl font-bold text-green-900">
              KES {{ formatCurrency(profile.balance) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Email:</span>
              <span class="text-sm font-medium text-gray-900">{{ profile.email || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Phone:</span>
              <span class="text-sm font-medium text-gray-900">{{ profile.phone || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Location:</span>
              <span class="text-sm font-medium text-gray-900">{{ profile.location || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Account Information</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Join Date:</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(profile.joinDate) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Role:</span>
              <span class="text-sm font-medium text-gray-900 capitalize">{{ profile.role || 'Agent' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Verified:</span>
              <span :class="[
                'text-sm font-medium',
                profile.verified ? 'text-green-600' : 'text-red-600'
              ]">
                {{ profile.verified ? 'Yes' : 'No' }}
              </span>
            </div>
            <div v-if="profile.lastLogin" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Last Login:</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDateTime(profile.lastLogin) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeEditModal">
      <div 
        class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button 
            @click="closeEditModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateProfile" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
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
              placeholder="City, Country"
            />
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="flex-1 btn btn-primary disabled:opacity-50"
            >
              {{ updating ? 'Updating...' : 'Update Profile' }}
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
    const loading = ref(false)
    const error = ref(null)
    const showEditModal = ref(false)
    const updating = ref(false)

    const editForm = ref({
      name: '',
      phone: '',
      location: ''
    })

    const loadProfile = async () => {
      loading.value = true
      error.value = null
      
      try {
        await store.dispatch('fetchAgentProfile')
      } catch (err) {
        error.value = err.message || 'Failed to load profile'
      } finally {
        loading.value = false
      }
    }

    const getInitials = (name) => {
      if (!name) return 'AG'
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getStatusDotClass = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-500'
        case 'pending':
          return 'bg-yellow-500'
        case 'inactive':
          return 'bg-red-500'
        default:
          return 'bg-gray-500'
      }
    }

    const formatCurrency = (amount) => {
      return parseFloat(amount || 0).toLocaleString()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const openEditModal = () => {
      editForm.value = {
        name: profile.value.name || '',
        phone: profile.value.phone || '',
        location: profile.value.location || ''
      }
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editForm.value = {
        name: '',
        phone: '',
        location: ''
      }
    }

    const updateProfile = async () => {
      updating.value = true
      
      try {
        const result = await authService.updateProfile(editForm.value)
        
        // Update store
        store.commit('setAgentProfile', result.user)
        
        // Show success notification
        store.dispatch('showNotification', {
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
          autoDismiss: true
        })
        
        closeEditModal()
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

    // Load profile on mount
    onMounted(() => {
      if (!profile.value.name) {
        loadProfile()
      }
    })

    return {
      profile,
      loading,
      error,
      showEditModal,
      updating,
      editForm,
      loadProfile,
      getInitials,
      getStatusClass,
      getStatusDotClass,
      formatCurrency,
      formatDate,
      formatDateTime,
      openEditModal,
      closeEditModal,
      updateProfile
    }
  },
}
</script>