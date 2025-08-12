<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      Quick Actions
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        v-for="action in actions"
        :key="action.id"
        @click="handleAction(action)"
        :class="[
          'flex flex-col items-center p-4 rounded-lg border-2 border-dashed transition-all duration-200 group relative',
          action.disabled
            ? 'border-gray-200 cursor-not-allowed opacity-50'
            : `border-gray-300 hover:border-${action.color}-500 hover:bg-${action.color}-50`
        ]"
        :disabled="action.disabled"
      >
        <component
          :is="action.icon"
          :class="[
            'w-8 h-8 mb-2 transition-colors duration-200',
            action.disabled
              ? 'text-gray-300'
              : `text-gray-400 group-hover:text-${action.color}-500`
          ]"
        />
        <span :class="[
          'text-sm font-medium transition-colors duration-200',
          action.disabled
            ? 'text-gray-400'
            : `text-gray-700 group-hover:text-${action.color}-700`
        ]">
          {{ action.label }}
        </span>

        <!-- Badge for notifications -->
        <div v-if="action.badge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {{ action.badge }}
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

// Action Icons
const NewTransactionIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>'
}

const ReportIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
}

const SupportIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
}

const SettingsIcon = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
}

export default {
  name: 'QuickActions',
  emits: ['action'],
  setup(props, { emit }) {
    const actions = ref([
      {
        id: 'new-transaction',
        label: 'New Transaction',
        icon: NewTransactionIcon,
        color: 'blue',
        disabled: false
      },
      {
        id: 'generate-report',
        label: 'Generate Report',
        icon: ReportIcon,
        color: 'green',
        disabled: false
      },
      {
        id: 'customer-support',
        label: 'Customer Support',
        icon: SupportIcon,
        color: 'purple',
        disabled: false,
        badge: 2
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: SettingsIcon,
        color: 'orange',
        disabled: false
      }
    ])

    const handleAction = (action) => {
      if (!action.disabled) {
        emit('action', action.id)
      }
    }

    return {
      actions,
      handleAction
    }
  }
}
</script>
