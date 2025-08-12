<!--src/components/NotificationComponent.vue-->
<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification-card',
          getNotificationClass(notification.type)
        ]"
        role="alert"
        aria-live="assertive"
      >
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0 mr-3">
            <svg
              v-if="notification.type === 'success'"
              class="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p v-if="notification.title" class="text-sm font-medium text-gray-900 mb-1">
              {{ notification.title }}
            </p>
            <p class="text-sm text-gray-700">
              {{ notification.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            aria-label="Close notification"
          >
            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <!-- Progress bar for auto-dismiss -->
        <div v-if="notification.autoDismiss" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-1">
            <div
              class="h-1 bg-gray-400 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${getProgressWidth(notification)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NotificationComponent',
  setup() {
    const store = useStore()
    const notifications = computed(() => store.state.notifications)
    const progressIntervals = ref(new Map())

    const removeNotification = (id) => {
      store.commit('removeNotification', id)
      if (progressIntervals.value.has(id)) {
        clearInterval(progressIntervals.value.get(id))
        progressIntervals.value.delete(id)
      }
    }

    const getNotificationClass = (type) => {
      const baseClasses = 'notification-card'
      switch (type) {
      case 'success':
        return `${baseClasses} notification-success`
      case 'error':
        return `${baseClasses} notification-error`
      case 'warning':
        return `${baseClasses} notification-warning`
      default:
        return `${baseClasses} notification-info`
      }
    }

    const getProgressWidth = (notification) => {
      if (!notification.autoDismiss) return 0
      const elapsed = Date.now() - notification.createdAt
      const duration = notification.duration || 5000
      return Math.max(0, 100 - (elapsed / duration) * 100)
    }

    // Auto-dismiss notifications
    const setupAutoDismiss = () => {
      notifications.value.forEach(notification => {
        if (notification.autoDismiss && !progressIntervals.value.has(notification.id)) {
          const duration = notification.duration || 5000
          const interval = setInterval(() => {
            if (Date.now() - notification.createdAt >= duration) {
              removeNotification(notification.id)
            }
          }, 100)
          progressIntervals.value.set(notification.id, interval)
        }
      })
    }

    onMounted(() => {
      setupAutoDismiss()
    })

    onUnmounted(() => {
      progressIntervals.value.forEach(interval => clearInterval(interval))
    })

    return {
      notifications,
      removeNotification,
      getNotificationClass,
      getProgressWidth
    }
  },
}
</script>

<style scoped>
.notification-card {
  @apply bg-white rounded-lg shadow-lg border p-4 transition-all duration-300 ease-in-out;
}

.notification-success {
  @apply border-l-4 border-green-500;
}

.notification-error {
  @apply border-l-4 border-red-500;
}

.notification-warning {
  @apply border-l-4 border-yellow-500;
}

.notification-info {
  @apply border-l-4 border-blue-500;
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
