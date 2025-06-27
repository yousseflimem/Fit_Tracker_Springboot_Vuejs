<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">Manage Users</h1>
      <button
          v-if="isAdmin"
          @click="showCreateModal = true"
          class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Create New User
      </button>
    </div>

    <UserTable
        :users="users"
        @user-deleted="handleUserDeleted"
        @edit-user="handleEditUser"
    />

    <UserEditModal
        v-if="showEditModal"
        :user="selectedUser"
        :is-admin="isAdmin"
        @close="showEditModal = false"
        @user-updated="handleUserUpdated"
    />

    <UserEditModal
        v-if="showCreateModal"
        :is-admin="isAdmin"
        @close="showCreateModal = false"
        @user-created="handleUserCreated"
    />
  </div>
</template>

<script>
import UserTable from '@/components/admin/UserTable.vue';
import UserEditModal from '@/components/admin/UserEditModal.vue';

export default {
  components: { UserTable, UserEditModal },
  data() {
    return {
      users: [],
      showEditModal: false,
      showCreateModal: false,
      selectedUser: null
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.userRole === 'ADMIN';
    }
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.users = await this.$store.dispatch('fetchUsers');
      } catch (error) {
        this.$store.dispatch('showToast', {
          message: 'Failed to load users: ' + error.message,
          type: 'error'
        });
      }
    },
    handleEditUser(user) {
      this.selectedUser = user;
      this.showEditModal = true;
    },
    async handleUserUpdated() {
      await this.fetchUsers();
      this.showEditModal = false;
    },
    async handleUserCreated() {
      await this.fetchUsers();
      this.showCreateModal = false;
    },
    async handleUserDeleted() {
      await this.fetchUsers();
    }
  }
};
</script>