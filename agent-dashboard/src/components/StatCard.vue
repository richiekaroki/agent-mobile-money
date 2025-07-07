<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
          <div v-if="tooltip" class="relative group/tooltip">
            <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {{ tooltip }}
            </div>
          </div>
        </div>
        
        <div class="flex items-baseline space-x-2">
          <p :class="['text-2xl font-bold', valueColor]">{{ formattedValue }}</p>
          <div v-if="change" class="flex items-center text-xs">
            <svg v-if="change.type === 'increase'" class="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else-if="change.type === 'decrease'" class="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span :class="change.type === 'increase' ? 'text-green-600' : 'text-red-600'">
              {{ change.value }}%
            </span>
          </div>
        </div>
        
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      
      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200', iconBg]">
        <component :is="icon" :class="['w-6 h-6', iconColor]" />
      </div>
    </div>
    
    <!-- Progress bar for goals/targets -->
    <div v-if="progress" class="mt-4">
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>{{ progress.label || 'Progress' }}</span>
        <span>{{ progress.current }}/{{ progress.target }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          :class="['h-2 rounded-full transition-all duration-500', progressColor]"
          :style="{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    subtitle: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    icon: { type: Object, required: true },
    iconBg: { type: String, default: 'bg-blue-100' },
    iconColor: { type: String, default: 'text-blue-600' },
    valueColor: { type: String, default: 'text-gray-900' },
    change: { type: Object, default: null }, // { type: 'increase'|'decrease', value: number }
    progress: { type: Object, default: null }, // { current: number, target: number, label: string }
    progressColor: { type: String, default: 'bg-blue-500' }
  },
  computed: {
    formattedValue() {
      if (typeof this.value === 'number') {
        return this.value.toLocaleString()
      }
      return this.value
    }
  }
}
</script>