<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-900">Agent Profile</h2>
      <div class="text-sm text-gray-500">ID: {{ agentProfile.agentId }}</div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <div
          class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center"
        >
          <span class="text-xl font-bold text-white">
            {{ initials }}
          </span>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ agentProfile.name }}</h3>
          <p class="text-sm text-gray-600">{{ agentProfile.phone }}</p>
          <div class="flex items-center mt-1">
            <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {{ agentProfile.status }}
            </span>
          </div>
        </div>
      </div>

      <div class="border-t pt-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Location:</span>
            <p class="font-medium">{{ agentProfile.location }}</p>
          </div>
          <div>
            <span class="text-gray-600">Join Date:</span>
            <p class="font-medium">{{ formatDate(agentProfile.joinDate) }}</p>
          </div>
        </div>
      </div>

      <div class="border-t pt-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            KSh {{ formatCurrency(agentProfile.balance) }}
          </div>
          <div class="text-sm text-gray-600">Available Balance</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AgentProfile',
  setup() {
    const store = useStore()

    const agentProfile = computed(() => store.getters.getAgentProfile)

    const initials = computed(() => {
      const name = agentProfile.value.name || 'AG'
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    })

    const formatCurrency = amount => {
      return new Intl.NumberFormat('en-KE').format(amount || 0)
    }

    const formatDate = dateString => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    return {
      agentProfile,
      initials,
      formatCurrency,
      formatDate,
    }
  },
}
</script>
