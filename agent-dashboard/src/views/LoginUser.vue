<!-- src/views/LoginUser.vue -->
<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <form @submit.prevent="loginUser">
      <input v-model="username" placeholder="Username" class="border px-2 py-1 rounded w-full mb-4" />
      <input type="password" v-model="password" placeholder="Password" class="border px-2 py-1 rounded w-full mb-4" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    loginUser() {
      if (this.username === 'admin' && this.password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        this.router.push('/');
      } else {
        alert('Invalid credentials');
      }
    },
  },
};
</script>
