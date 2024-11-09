<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold">Agent Profile</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <p>
        Name: <span class="font-medium">{{ profile.name }}</span>
      </p>
      <p>
        Balance: <span class="font-medium">{{ profile.balance }} KES</span>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AgentProfile',
  setup() {
    const store = useStore()
    const profile = computed(() => store.getters.getAgentProfile)
    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      try {
        await store.dispatch('fetchAgentProfile')
      } catch (error) {
        error.value = 'Failed to load profile'
      } finally {
        loading.value = false
      }
    })

    return { profile, loading, error }
  },
}
</script>
