<template>
  <div class="overflow-x-auto p-6">
    <table class="w-full bg-white shadow-md rounded">
      <thead class="bg-gray-200">
      <tr>
        <th class="py-2 px-4 text-left">ID</th>
        <th class="py-2 px-4 text-left">Username</th>
        <th class="py-2 px-4 text-left">Email</th>
        <th class="py-2 px-4 text-left">Role</th>
        <th class="py-2 px-4 text-left">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="u in users" :key="u.id" class="border-b">
        <td class="py-2 px-4">{{ u.id }}</td>
        <td class="py-2 px-4">{{ u.username }}</td>
        <td class="py-2 px-4">{{ u.email }}</td>
        <td class="py-2 px-4">{{ u.role }}</td>
        <td class="py-2 px-4 flex space-x-2">
          <button
              v-if="isAdmin"
              @click="$emit('edit-user', u)"
              class="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
              v-if="isAdmin"
              @click="deleteUser(u.id)"
              class="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import UserService from '@/services/users';

export default {
  props: ['users'],
  computed: {
    isAdmin() {
      return this.$store.getters.userRole === 'ADMIN';
    }
  },
  methods: {

    async deleteUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        // Add loading state
        this.$store.dispatch('showToast', {
          message: 'Deleting user...',
          type: 'info'
        });

        await UserService.delete(id);
        this.$emit('user-deleted');
        this.$store.dispatch('showToast', {
          message: 'User deleted successfully',
          type: 'success'
        });
      } catch (error) {
        console.error('Delete user error:', error);
        this.$store.dispatch('showToast', {
          message: error.response?.data?.message || 
                 error.response?.data?.error || 
                 'Failed to delete user. Please try again.',
          type: 'error'
        });
      }
    }
  }
};
</script>