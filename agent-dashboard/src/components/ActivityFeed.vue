<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Recent Activity
      </h2>
      <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Activity List -->
    <div v-else class="space-y-4">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', getActivityIconBg(activity.type)]">
          <component :is="getActivityIcon(activity.type)" :class="['w-4 h-4', getActivityIconColor(activity.type)]" />
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            <span class="font-medium">{{ activity.title }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ activity.description }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
        </div>
        
        <div v-if="activity.amount" :class="['text-sm font-semibold', getAmountColor(activity.type)]">
          {{ formatAmount(activity.amount, activity.type) }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && activities.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-gray-500">No recent activity</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

// Activity Icons
const TransactionIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>`
}

const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
}

const AlertIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>`
}

const CheckIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
}

export default {
  name: 'ActivityFeed',
  setup() {
    const loading = ref(true)
    const activities = ref([])

    const mockActivities = [
      {
        id: 1,
        type: 'deposit',
        title: 'Deposit Completed',
        description: 'Customer +254 700 123 456 deposited money',
        amount: 5000,
        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        id: 2,
        type: 'withdrawal',
        title: 'Withdrawal Processed',
        description: 'Customer +254 700 987 654 withdrew money',
        amount: 2500,
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        id: 3,
        type: 'login',
        title: 'Agent Login',
        description: 'You logged into the system',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 4,
        type: 'alert',
        title: 'Low Balance Warning',
        description: 'Your account balance is running low',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        id: 5,
        type: 'success',
        title: 'Daily Target Achieved',
        description: 'You have reached your daily transaction target',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ]

    const getActivityIcon = (type) => {
      switch (type) {
        case 'deposit':
        case 'withdrawal':
          return TransactionIcon
        case 'login':
          return UserIcon
        case 'alert':
          return AlertIcon
        case 'success':
          return CheckIcon
        default:
          return TransactionIcon
      }
    }

    const getActivityIconBg = (type) => {
      switch (type) {
        case 'deposit':
          return 'bg-green-100'
        case 'withdrawal':
          return 'bg-red-100'
        case 'login':
          return 'bg-blue-100'
        case 'alert':
          return 'bg-yellow-100'
        case 'success':
          return 'bg-green-100'
        default:
          return 'bg-gray-100'
      }
    }

    const getActivityIconColor = (type) => {
      switch (type) {
        case 'deposit':
          return 'text-green-600'
        case 'withdrawal':
          return 'text-red-600'
        case 'login':
          return 'text-blue-600'
        case 'alert':
          return 'text-yellow-600'
        case 'success':
          return 'text-green-600'
        default:
          return 'text-gray-600'
      }
    }

    const getAmountColor = (type) => {
      switch (type) {
        case 'deposit':
          return 'text-green-600'
        case 'withdrawal':
          return 'text-red-600'
        default:
          return 'text-gray-600'
      }
    }

    const formatAmount = (amount, type) => {
      const prefix = type === 'deposit' ? '+' : '-'
      return `${prefix}KES ${amount.toLocaleString()}`
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    }

    onMounted(() => {
      setTimeout(() => {
        activities.value = mockActivities
        loading.value = false
      }, 1000)
    })

    return {
      loading,
      activities,
      getActivityIcon,
      getActivityIconBg,
      getActivityIconColor,
      getAmountColor,
      formatAmount,
      formatTime
    }
  }
}
</script>