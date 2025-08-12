<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2z"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Smart Insights</h2>
          <p class="text-sm text-gray-600">AI-powered recommendations for your business</p>
        </div>
      </div>
      <button 
        @click="refreshInsights"
        :disabled="loading"
        class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <svg :class="['w-5 h-5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights List -->
    <div v-else class="space-y-4">
      <div
        v-for="insight in insights"
        :key="insight.id"
        :class="[
          'p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm cursor-pointer',
          getInsightClass(insight.type)
        ]"
        @click="handleInsightClick(insight)"
      >
        <div class="flex items-start space-x-3">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', getIconBgClass(insight.type)]">
            <component :is="getInsightIcon(insight.type)" :class="['w-4 h-4', getIconColorClass(insight.type)]" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-medium text-gray-900">{{ insight.title }}</h3>
              <span :class="['text-xs px-2 py-1 rounded-full', getPriorityClass(insight.priority)]">
                {{ insight.priority }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ insight.description }}</p>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button
                v-if="insight.action"
                @click.stop="executeAction(insight.action)"
                class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                {{ insight.action.label }}
              </button>
              <button
                @click.stop="dismissInsight(insight.id)"
                class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && insights.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
      <p class="text-gray-500">No new insights at the moment. Check back later for personalized recommendations.</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

// Insight Icons
const TrendIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>'
}

const AlertIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>'
}

const TipIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>'
}

const TargetIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
}

export default {
  name: 'SmartNotifications',
  setup() {
    const store = useStore()
    const loading = ref(true)
    const insights = ref([])

    const dashboardStats = computed(() => store.getters.getDashboardStats)
    const transactions = computed(() => store.getters.getTransactions)

    const generateInsights = () => {
      const generatedInsights = []
      const stats = dashboardStats.value
      const recentTransactions = transactions.value.slice(0, 10)

      // Performance insights
      if (stats.todayTransactions < stats.dailyTarget * 0.5) {
        generatedInsights.push({
          id: 'low-daily-performance',
          type: 'warning',
          priority: 'high',
          title: 'Daily Target Behind Schedule',
          description: `You're at ${stats.todayTransactions} transactions today. Consider promoting services to reach your ${stats.dailyTarget} daily target.`,
          action: {
            type: 'promote',
            label: 'View Tips'
          }
        })
      }

      // Commission opportunity
      if (stats.commissionEarned < stats.monthlyTarget * 0.3) {
        generatedInsights.push({
          id: 'commission-opportunity',
          type: 'tip',
          priority: 'medium',
          title: 'Commission Growth Opportunity',
          description: 'Focus on higher-value transactions to boost your monthly commission earnings.',
          action: {
            type: 'strategy',
            label: 'Learn More'
          }
        })
      }

      // Balance management
      if (stats.totalBalance > 50000) {
        generatedInsights.push({
          id: 'high-balance',
          type: 'trend',
          priority: 'low',
          title: 'High Balance Alert',
          description: 'Your balance is quite high. Consider optimizing your float management.',
          action: {
            type: 'balance',
            label: 'Manage Float'
          }
        })
      }

      // Achievement recognition
      if (stats.todayTransactions >= stats.dailyTarget) {
        generatedInsights.push({
          id: 'daily-target-achieved',
          type: 'success',
          priority: 'low',
          title: 'Daily Target Achieved! 🎉',
          description: 'Congratulations! You\'ve reached your daily transaction target.',
          action: {
            type: 'celebrate',
            label: 'Share Achievement'
          }
        })
      }

      // Transaction pattern insights
      const depositCount = recentTransactions.filter(t => t.type === 'deposit').length
      const withdrawalCount = recentTransactions.filter(t => t.type === 'withdrawal').length
      
      if (depositCount > withdrawalCount * 2) {
        generatedInsights.push({
          id: 'deposit-heavy',
          type: 'trend',
          priority: 'medium',
          title: 'Deposit-Heavy Pattern Detected',
          description: 'You\'re processing more deposits than withdrawals. This is great for liquidity!',
          action: {
            type: 'analyze',
            label: 'View Pattern'
          }
        })
      }

      return generatedInsights
    }

    const getInsightClass = (type) => {
      switch (type) {
        case 'warning': return 'bg-yellow-50 border-yellow-400'
        case 'tip': return 'bg-blue-50 border-blue-400'
        case 'trend': return 'bg-purple-50 border-purple-400'
        case 'success': return 'bg-green-50 border-green-400'
        default: return 'bg-gray-50 border-gray-400'
      }
    }

    const getIconBgClass = (type) => {
      switch (type) {
        case 'warning': return 'bg-yellow-100'
        case 'tip': return 'bg-blue-100'
        case 'trend': return 'bg-purple-100'
        case 'success': return 'bg-green-100'
        default: return 'bg-gray-100'
      }
    }

    const getIconColorClass = (type) => {
      switch (type) {
        case 'warning': return 'text-yellow-600'
        case 'tip': return 'text-blue-600'
        case 'trend': return 'text-purple-600'
        case 'success': return 'text-green-600'
        default: return 'text-gray-600'
      }
    }

    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getInsightIcon = (type) => {
      switch (type) {
        case 'warning': return AlertIcon
        case 'tip': return TipIcon
        case 'trend': return TrendIcon
        case 'success': return TargetIcon
        default: return TipIcon
      }
    }

    const refreshInsights = () => {
      loading.value = true
      setTimeout(() => {
        insights.value = generateInsights()
        loading.value = false
      }, 1000)
    }

    const handleInsightClick = (insight) => {
      store.dispatch('showNotification', {
        type: 'info',
        title: 'Insight Details',
        message: `Viewing details for: ${insight.title}`,
        autoDismiss: true
      })
    }

    const executeAction = (action) => {
      store.dispatch('showNotification', {
        type: 'info',
        title: 'Action Executed',
        message: `Executing: ${action.label}`,
        autoDismiss: true
      })
    }

    const dismissInsight = (insightId) => {
      insights.value = insights.value.filter(insight => insight.id !== insightId)
    }

    onMounted(() => {
      refreshInsights()
    })

    return {
      loading,
      insights,
      refreshInsights,
      handleInsightClick,
      executeAction,
      dismissInsight,
      getInsightClass,
      getIconBgClass,
      getIconColorClass,
      getPriorityClass,
      getInsightIcon
    }
  }
}
</script>