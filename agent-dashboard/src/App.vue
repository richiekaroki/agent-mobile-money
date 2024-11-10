<!-- src/App.vue -->
<template>
  <div>
    <header class="p-4 bg-blue-600 text-white text-center">
      <h1 class="text-3xl font-semibold">Mobile Money Agent Dashboard</h1>
      <nav class="mt-4" role="navigation">
        <router-link to="/" class="px-4 py-2 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Go to Dashboard">Dashboard</router-link>
        <router-link to="/transactions" class="px-4 py-2 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Go to Transactions">Transactions</router-link>
      </nav>
    </header>

    <NotificationComponent />

    <main class="mt-6">
      <router-view />
    </main>
  </div>
</template>

<script>
import NotificationComponent from './components/NotificationComponent.vue'

export default {
  name: 'App',
  components: {
    NotificationComponent,
  },
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  display: flex;
  gap: 10px; /* Equivalent to space-x-2 */
}

nav a {
  text-decoration: none; /* Tailwind already does this with the 'no-underline' class */
}
</style>

