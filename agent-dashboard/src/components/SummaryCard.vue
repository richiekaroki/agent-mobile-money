<template>
  <div class="card card-hover group" :aria-label="ariaLabel" role="region">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <p :class="['text-2xl font-bold transition-colors duration-200', colorClass]">
          {{ formattedValue }}
        </p>
        <div v-if="subtitle" class="text-xs text-gray-500 mt-1">
          {{ subtitle }}
        </div>
      </div>

      <!-- Icon slot -->
      <div v-if="icon" class="ml-4">
        <div
          :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200',
            iconBgClass,
          ]"
        >
          <component :is="icon" :class="['w-6 h-6', iconColorClass]" />
        </div>
      </div>
    </div>

    <!-- Progress bar for percentage values -->
    <div v-if="showProgress && progressValue" class="mt-4">
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>Progress</span>
        <span>{{ progressValue }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          :class="['h-2 rounded-full transition-all duration-500', progressColorClass]"
          :style="{ width: `${Math.min(progressValue, 100)}%` }"
        ></div>
      </div>
    </div>

    <!-- Trend indicator -->
    <div v-if="trend" class="flex items-center mt-3 text-xs">
      <svg
        v-if="trend.direction === 'up'"
        class="w-3 h-3 mr-1 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <svg
        v-else-if="trend.direction === 'down'"
        class="w-3 h-3 mr-1 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span :class="trend.direction === 'up' ? 'text-green-600' : 'text-red-600'">
        {{ trend.value }}{{ trend.unit || '%' }} {{ trend.period || 'vs last month' }}
      </span>
    </div>

    <slot></slot>
    <!-- Optional slot for additional custom content -->
  </div>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    colorClass: {
      type: String,
      default: 'text-gray-900',
    },
    icon: {
      type: [String, Object],
      default: null,
    },
    iconBgClass: {
      type: String,
      default: 'bg-gray-100',
    },
    iconColorClass: {
      type: String,
      default: 'text-gray-600',
    },
    ariaLabel: {
      type: String,
      default: 'Summary Card',
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    progressColorClass: {
      type: String,
      default: 'bg-blue-500',
    },
    trend: {
      type: Object,
      default: null,
      // Expected format: { direction: 'up'|'down', value: '12.5', unit: '%', period: 'vs last month' }
    },
  },
  computed: {
    formattedValue() {
      if (typeof this.value === 'number') {
        return this.value.toLocaleString()
      } else if (this.value && this.value.includes('%')) {
        return this.value
      }
      return this.value
    },
  },
}
</script>

<style scoped>
.card:hover .group {
  transform: scale(1.02);
}
</style>
