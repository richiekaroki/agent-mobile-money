<!--src/components/NotificationComponent.vue-->
<template>
  <div v-if="notifications.length" class="fixed top-4 right-4 z-50">
    <div
      v-for="(message, index) in notifications"
      :key="index"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-2"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NotificationComponent',
  setup() {
    const store = useStore()
    const notifications = computed(() => store.state.notifications)

    return { notifications }
  },
}
</script>
