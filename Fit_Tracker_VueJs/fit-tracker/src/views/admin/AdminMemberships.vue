<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Manage Memberships</h1>
    <!-- Create Form -->
    <div class="bg-white p-6 rounded shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Membership</h2>
      <form @submit.prevent="createMembership">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-gray-700">Name</label>
            <input v-model="form.name" id="name" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label for="type" class="block text-gray-700">Type</label>
            <select v-model="form.type" id="type" class="w-full p-2 border rounded" required>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label for="price" class="block text-gray-700">Price</label>
            <input v-model.number="form.price" type="number" step="0.01" id="price" class="w-full p-2 border rounded" required />
          </div>
          <div>
            <label for="duration" class="block text-gray-700">Duration (days)</label>
            <input v-model.number="form.duration" type="number" id="duration" class="w-full p-2 border rounded" required />
          </div>
          <div class="md:col-span-2">
            <label for="description" class="block text-gray-700">Description</label>
            <textarea v-model="form.description" id="description" class="w-full p-2 border rounded" rows="4"></textarea>
          </div>
          <div>
            <label for="active" class="block text-gray-700">Active</label>
            <input v-model="form.active" type="checkbox" id="active" class="p-2" />
          </div>
        </div>
        <button type="submit" class="mt-4 bg-accent text-white py-2 px-4 rounded hover:bg-green-700">
          Create Membership
        </button>
      </form>
    </div>
    <!-- Membership List -->
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="bg-white p-6 rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">Membership List</h2>
      <table class="w-full table-auto">
        <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left">Name</th>
          <th class="p-2 text-left">Type</th>
          <th class="p-2 text-left">Price</th>
          <th class="p-2 text-left">Duration</th>
          <th class="p-2 text-left">Active</th>
          <th class="p-2 text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="membership in memberships" :key="membership.id">
          <td class="p-2">{{ membership.name }}</td>
          <td class="p-2">{{ membership.type }}</td>
          <td class="p-2">${{ membership.price.toFixed(2) }}</td>
          <td class="p-2">{{ membership.duration }} days</td>
          <td class="p-2">{{ membership.active ? 'Yes' : 'No' }}</td>
          <td class="p-2">
            <button
                @click="editMembership(membership)"
                class="text-blue-500 hover:underline mr-2"
            >
              Edit
            </button>
            <button
                @click="deleteMembership(membership.id)"
                class="text-red-500 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Edit Membership</h2>
        <form @submit.prevent="updateMembership">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="edit-name" class="block text-gray-700">Name</label>
              <input v-model="editForm.name" id="edit-name" class="w-full p-2 border rounded" required />
            </div>
            <div>
              <label for="edit-type" class="block text-gray-700">Type</label>
              <select v-model="editForm.type" id="edit-type" class="w-full p-2 border rounded" required>
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label for="edit-price" class="block text-gray-700">Price</label>
              <input v-model.number="editForm.price" type="number" step="0.01" id="edit-price" class="w-full p-2 border rounded" required />
            </div>
            <div>
              <label for="edit-duration" class="block text-gray-700">Duration (days)</label>
              <input v-model.number="editForm.duration" type="number" id="edit-duration" class="w-full p-2 border rounded" required />
            </div>
            <div>
              <label for="edit-description" class="block text-gray-700">Description</label>
              <textarea v-model="editForm.description" id="edit-description" class="w-full p-2 border rounded" rows="4"></textarea>
            </div>
            <div>
              <label for="edit-active" class="block text-gray-700">Active</label>
              <input v-model="editForm.active" type="checkbox" id="edit-active" class="p-2" />
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button
                type="button"
                @click="showEditModal = false"
                class="mr-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" class="bg-accent text-white py-2 px-4 rounded hover:bg-green-700">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MembershipService from '@/services/memberships.js';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      memberships: [],
      loading: false,
      error: null,
      form: {
        name: '',
        description: '',
        type: 'BASIC',
        price: 0,
        duration: 30,
        active: true,
      },
      editForm: null,
      showEditModal: false,
    };
  },
  computed: {
    ...mapGetters(['userRole']),
    isAdmin() {
      return this.userRole === 'ADMIN';
    },
  },
  methods: {
    async fetchMemberships() {
      this.loading = true;
      this.error = null;
      try {
        this.memberships = await MembershipService.getAll();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load memberships';
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async createMembership() {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      try {
        await MembershipService.create(this.form);
        this.$toast.success('Membership created successfully');
        this.form = { name: '', description: '', type: 'BASIC', price: 0, duration: 30, active: true };
        await this.fetchMemberships();
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to create membership');
      }
    },
    editMembership(membership) {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      this.editForm = { ...membership };
      this.showEditModal = true;
    },
    async updateMembership() {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      try {
        await MembershipService.update(this.editForm.id, this.editForm);
        this.$toast.success('Membership updated successfully');
        this.showEditModal = false;
        await this.fetchMemberships();
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to update_ALLOWED_ORIGINS membership');
      }
    },
    async deleteMembership(id) {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      if (!confirm('Are you sure you want to delete this membership?')) return;
      try {
        await MembershipService.delete(id);
        this.$toast.success('Membership deleted successfully');
        await this.fetchMemberships();
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to delete membership');
      }
    },
  },
  created() {
    if (!this.isAdmin) {
      this.$router.push('/');
      this.$toast.error('Unauthorized: Admin access required');
      return;
    }
    this.fetchMemberships();
  },
};
</script>