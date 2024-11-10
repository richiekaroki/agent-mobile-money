<!-- src/views/AgentProfile.vue -->
<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold">Agent Profile</h2>

    <!-- Loading state -->
    <div v-if="loading" class="text-center text-blue-500">Loading...</div>

    <!-- Error state -->
    <div v-if="error" class="text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Profile data -->
    <div v-else>
      <p class="text-lg">
        Name: <span class="font-medium">{{ profile.name }}</span>
      </p>
      <p class="text-lg">
        Balance: <span class="font-medium">{{ profile.balance }} KES</span>
      </p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AgentProfile',
  setup() {
    const store = useStore()
    const profile = computed(() => store.getters.getAgentProfile)
    const loading = ref(true)
    const error = ref(null)

    // Fetch agent profile
    onMounted(async () => {
      try {
        await store.dispatch('fetchAgentProfile')
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load profile'
      } finally {
        loading.value = false
      }
    })

    return { profile, loading, error }
  },
}
</script>

<style scoped>
/* You can add custom styling here */
</style>
