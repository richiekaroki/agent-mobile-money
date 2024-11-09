<template>
  <div class="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
    <div class="text-lg font-semibold">{{ title }}</div>
    <div :class="['text-2xl font-bold', colorClass]">{{ value }}</div>
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
      type: String,
      required: true,
    },
    colorClass: {
      type: String,
      default: 'text-gray-500',
    },
  },
};
</script>
