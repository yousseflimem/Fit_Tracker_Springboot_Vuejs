<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit User' : 'Create User' }}</h2>
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Username</label>
          <input v-model="form.username" type="text" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.username }">
          <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input v-model="form.email" type="email" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.email }">
          <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>

        <div class="mb-4" v-if="!isEditing">
          <label class="block text-gray-700 mb-2">Password</label>
          <input v-model="form.password" type="password" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.password }">
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <div class="mb-4" v-if="isAdmin">
          <label class="block text-gray-700 mb-2">Role</label>
          <select v-model="form.role" class="w-full p-2 border rounded">
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Profile Image URL</label>
          <input v-model="form.profileImageUrl" type="url" class="w-full p-2 border rounded"
                 :class="{ 'border-red-500': errors.profileImageUrl }">
          <span v-if="errors.profileImageUrl" class="text-red-500 text-sm">{{ errors.profileImageUrl }}</span>
        </div>

        <div class="flex justify-end mt-4">
          <button type="button" @click="$emit('close')" class="mr-2 px-4 py-2">Cancel</button>
          <button type="submit" class="bg-primary text-white px-4 py-2 rounded">
            {{ isEditing ? 'Save Changes' : 'Create User' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/users';

export default {
  props: {
    user: Object,
    isAdmin: Boolean
  },
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        role: 'USER',
        profileImageUrl: '',
        membershipId: null
      },
      roles: ['USER', 'COACH', 'ADMIN'],
      errors: {}
    };
  },
  computed: {
    isEditing() {
      return !!this.user;
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.form = {
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            membershipId: user.membershipId
          };
        }
      }
    }
  },
  methods: {
    async submit() {
      this.errors = {};

      // Frontend validation
      if (!this.form.username.trim()) {
        this.errors.username = 'Username is required';
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Invalid email format';
      }

      if (!this.isEditing) {
        const trimmedPassword = this.form.password.trim();
        if (!trimmedPassword) {
          this.errors.password = 'Password is required';
        } else if (trimmedPassword.length < 6) {
          this.errors.password = 'Password must be at least 6 characters';
        }
      }

      if (this.form.profileImageUrl &&
          !this.form.profileImageUrl.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))?$/)) {
        this.errors.profileImageUrl = 'Must be a valid image URL or empty';
      }

      if (Object.keys(this.errors).length > 0) return;

      try {
        // Proper payload definition with null checks
        const payload = {
          username: this.form.username.trim(),
          email: this.form.email.trim(),
          role: this.form.role,
          profileImageUrl: this.form.profileImageUrl?.trim() || '',
          membershipId: this.form.membershipId || null
        };

        // Add password only when needed
        if (this.isEditing) {
          if (this.form.password.trim()) {
            payload.password = this.form.password.trim();
          }
          await UserService.update(this.user.id, payload);
        } else {
          payload.password = this.form.password.trim();
          await UserService.create(payload);
        }

        this.$emit('close');
        this.$store.dispatch('showToast', {
          message: `User ${this.isEditing ? 'updated' : 'created'} successfully`,
          type: 'success'
        });
      } catch (error) {
        const backendError = error.response?.data;
        if (backendError) {
          Object.entries(backendError).forEach(([field, message]) => {
            this.errors[field] = message;
          });
        } else {
          this.$store.dispatch('showToast', {
            message: error.message || 'Operation failed',
            type: 'error'
          });
        }
      }
    }
  }
};
</script>