<template>
  <div
    class="p-6 bg-white rounded-lg shadow-md flex items-center justify-between"
    :aria-label="ariaLabel"
    role="region"
  >
    <div class="text-lg font-semibold">{{ title }}</div>
    <div :class="['text-2xl font-bold', colorClass]">{{ formattedValue }}</div>
    <slot></slot> <!-- Optional slot for additional custom content -->
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
      type: [String, Number], // Allow both string and number
      required: true,
    },
    colorClass: {
      type: String,
      default: 'text-gray-500',
    },
    fontSize: {
      type: String,
      default: 'text-2xl', // Allow customization of font size
    },
    ariaLabel: {
      type: String,
      default: function() {
        return this.title || 'Summary Card'; // Use title if available for accessibility
      },
    },
  },
  computed: {
    // Compute the formatted value to handle number formatting or any special cases
    formattedValue() {
      if (typeof this.value === 'number') {
        return this.value.toLocaleString() // Adds commas for thousands
      } else if (this.value && this.value.includes('%')) {
        return this.value // Keep percentage values as they are
      }
      return this.value
    },
  },
}
</script>

<style scoped>
/* Optional hover effect if you want the card to be interactive */
div:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}
</style>
