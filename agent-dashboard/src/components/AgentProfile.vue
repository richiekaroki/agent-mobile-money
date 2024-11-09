<!-- src/components/AgentProfile.vue -->
<template>
  <div class="p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold">Agent Profile</h2>
    <p>Name: {{ profile.name }}</p>
    <p>Balance: {{ profile.balance }} KES</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AgentProfile',
  setup() {
    const store = useStore()
    const profile = computed(() => store.getters.getAgentProfile)

    onMounted(() => {
      store.dispatch('fetchAgentProfile')
    })

    return { profile }
  },
}
</script>
