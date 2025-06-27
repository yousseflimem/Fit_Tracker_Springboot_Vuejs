<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <h1 class="text-2xl font-bold text-primary mb-6">Register</h1>
    <form @submit.prevent="submit" class="bg-white p-6 rounded shadow-md">
      <div class="mb-4">
        <label for="username" class="block text-gray-700">Username</label>
        <input v-model="form.username" type="text" id="username" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700">Email</label>
        <input v-model="form.email" type="email" id="email" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700">Password</label>
        <input v-model="form.password" type="password" id="password" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="w-full bg-accent text-white py-2 rounded hover:bg-green-700">Register</button>
    </form>
    <p class="mt-4 text-center">
      Already have an account? <router-link to="/login" class="text-accent hover:underline">Login</router-link>
    </p>
  </div>
</template>

<script>
import AuthService from '@/services/auth.js';

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async submit() {
      try {
        await AuthService.register(this.form);
        this.$toast.success('Registration successful! Please login.');
        this.$router.push('/login');
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  },
};
</script>