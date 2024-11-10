<!--src/components/NotificationComponent.vue-->
<template>
  <div v-if="notifications.length" class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition transform duration-300 ease-in-out"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex justify-between items-center">
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)" class="ml-2 text-white hover:text-gray-300 focus:outline-none">
          &times;
        </button>
      </div>
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

    // Function to remove notification by id
    const removeNotification = (id) => {
      store.commit('removeNotification', id)
    }

    return { notifications, removeNotification }
  },
}
</script>

<style scoped>
/* Custom styles for transition and fade-out can go here */
</style>
