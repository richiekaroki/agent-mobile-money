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
        @click="editMode = !editMode"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
      >
        {{ editMode ? 'Cancel' : 'Edit' }}
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

    <!-- Profile Content -->
    <div v-else>
      <!-- Profile Header -->
      <div class="flex items-center space-x-4 mb-6">
        <div class="relative">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">{{ getInitials(agentProfile.name) }}</span>
          </div>
          <div :class="[
            'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white',
            agentProfile.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
          ]"></div>
        </div>
        
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">{{ agentProfile.name || 'Agent User' }}</h3>
          <p class="text-sm text-gray-500">Agent ID: {{ agentProfile.agentId || 'N/A' }}</p>
          <div class="flex items-center mt-1">
            <span :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              agentProfile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              <div :class="[
                'w-1.5 h-1.5 rounded-full mr-1',
                agentProfile.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
              ]"></div>
              {{ agentProfile.status || 'Unknown' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-if="editMode" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="editData.name"
            type="text"
            class="input-field"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="editData.phone"
            type="tel"
            class="input-field"
            placeholder="+254 700 000 000"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            v-model="editData.location"
            type="text"
            class="input-field"
            placeholder="City, Country"
          />
        </div>

        <div class="flex space-x-3 pt-4">
          <button 
            @click="saveProfile"
            :disabled="saving"
            class="flex-1 btn btn-primary disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button 
            @click="cancelEdit"
            class="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-else class="space-y-4">
        <!-- Profile Details -->
        <div class="grid grid-cols-1 gap-4">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Current Balance</span>
            <span class="text-sm font-semibold text-green-600">
              KES {{ formatCurrency(agentProfile.balance || 0) }}
            </span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Phone Number</span>
            <span class="text-sm font-medium text-gray-900">
              {{ agentProfile.phone || 'Not provided' }}
            </span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Location</span>
            <span class="text-sm font-medium text-gray-900">
              {{ agentProfile.location || 'Not provided' }}
            </span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Join Date</span>
            <span class="text-sm font-medium text-gray-900">
              {{ formatDate(agentProfile.joinDate) }}
            </span>
          </div>
          
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-600">Last Login</span>
            <span class="text-sm font-medium text-gray-900">
              {{ formatDateTime(agentProfile.lastLogin) }}
            </span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="pt-4 border-t border-gray-100">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="$emit('action', 'view-transactions')"
              class="flex items-center justify-center p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View History
            </button>
            
            <button 
              @click="$emit('action', 'generate-report')"
              class="flex items-center justify-center p-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import authService from '../services/authService'

export default {
  name: 'AgentProfile',
  emits: ['action'],
  setup() {
    const store = useStore()
    const loading = ref(true)
    const editMode = ref(false)
    const saving = ref(false)

    const agentProfile = computed(() => store.getters.getAgentProfile)
    
    const editData = ref({
      name: '',
      phone: '',
      location: ''
    })

    const getInitials = (name) => {
      if (!name) return 'A'
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const formatCurrency = (amount) => {
      return parseFloat(amount || 0).toLocaleString()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        return 'Today'
      } else if (diffDays === 2) {
        return 'Yesterday'
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`
      } else {
        return formatDate(dateString)
      }
    }

    const startEdit = () => {
      editData.value = {
        name: agentProfile.value.name || '',
        phone: agentProfile.value.phone || '',
        location: agentProfile.value.location || ''
      }
      editMode.value = true
    }

    const cancelEdit = () => {
      editMode.value = false
      editData.value = {
        name: '',
        phone: '',
        location: ''
      }
    }

    const saveProfile = async () => {
      saving.value = true
      
      try {
        const updatedProfile = {
          ...agentProfile.value,
          ...editData.value
        }
        
        // Update via auth service
        await authService.updateProfile(updatedProfile)
        
        // Update store
        store.commit('setAgentProfile', updatedProfile)
        
        // Show success notification
        store.dispatch('showNotification', {
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
          autoDismiss: true
        })
        
        editMode.value = false
      } catch (error) {
        console.error('Error updating profile:', error)
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update profile. Please try again.',
          autoDismiss: true
        })
      } finally {
        saving.value = false
      }
    }

    onMounted(async () => {
      try {
        await store.dispatch('fetchAgentProfile')
      } catch (error) {
        console.error('Error fetching agent profile:', error)
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
    })

    return {
      loading,
      editMode,
      saving,
      agentProfile,
      editData,
      getInitials,
      formatCurrency,
      formatDate,
      formatDateTime,
      startEdit,
      cancelEdit,
      saveProfile
    }
  }
}
</script>