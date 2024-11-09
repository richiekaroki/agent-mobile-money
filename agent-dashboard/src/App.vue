<!-- src/App.vue -->
<template>
  <div>
    <header class="p-4 bg-blue-600 text-white text-center">
      <h1 class="text-3xl font-semibold">Mobile Money Agent Dashboard</h1>
      <nav class="mt-4">
        <router-link to="/" class="px-4 py-2 text-white hover:bg-blue-500">Dashboard</router-link>
        <router-link to="/transactions" class="px-4 py-2 text-white hover:bg-blue-500"
          >Transactions</router-link
        >
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
/* Add any App-specific styling here */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
}
</style>
