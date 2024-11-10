<template>
  <div class="skeleton-card bg-gray-200 rounded-lg p-4 animate-pulse">
    <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div> <!-- Title placeholder -->
    <div class="h-8 bg-gray-300 rounded w-1/2"></div> <!-- Value placeholder -->
  </div>
</template>

<script>
export default {
  name: 'SkeletonCard',
}
</script>

<style scoped>
/* Skeleton card animation for loading */
@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.8;
  }
}

.skeleton-card {
  width: 100%;
  height: 150px; /* Adjust height to match your card's size */
}

.skeleton-card .bg-gray-300 {
  animation: pulse 1.5s infinite ease-in-out;
}
</style>
