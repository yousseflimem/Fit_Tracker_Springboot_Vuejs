<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Manage Classes</h1>
    <!-- Create Form -->
    <div class="bg-white p-6 rounded shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Class</h2>
      <ClassForm @class-created="fetchClasses" />
    </div>
    <!-- Classes List -->
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <table class="w-full table-auto bg-white rounded shadow-md">
        <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left">Title</th>
          <th class="p-2 text-left">Coach</th>
          <th class="p-2 text-left">Start Time</th>
          <th class="p-2 text-left">Duration</th>
          <th class="p-2 text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="gymClass in classes.content" :key="gymClass.id">
          <td class="p-2">{{ gymClass.title }}</td>
          <td class="p-2">{{ gymClass.coachName }}</td>
          <td class="p-2">{{ formatDate(gymClass.startTime) }}</td>
          <td class="p-2">{{ gymClass.duration }} minutes</td>
          <td class="p-2">
            <button @click="editClass(gymClass)" class="text-blue-500 hover:underline mr-2">Edit</button>
            <button @click="deleteClass(gymClass.id)" class="text-red-500 hover:underline">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <Pagination
          v-if="classes.totalPages > 1"
          :total-pages="classes.totalPages"
          :current-page="currentPage"
          @page-change="changePage"
      />
    </div>
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Edit Class</h2>
        <ClassForm :classData="editForm" @class-updated="handleClassUpdated" @cancel="showEditModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import ClassForm from '@/components/admin/ClassForm.vue';
import Pagination from '@/components/shared/Pagination.vue';
import { mapGetters } from 'vuex';

export default {
  components: { ClassForm, Pagination },
  data() {
    return {
      classes: { content: [], totalPages: 0 },
      currentPage: 0,
      pageSize: 10,
      loading: false,
      error: null,
      showEditModal: false,
      editForm: null,
    };
  },
  computed: {
    ...mapGetters(['userRole']),
    isAdmin() {
      return this.userRole === 'ADMIN';
    },
  },
  methods: {
    async fetchClasses() {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        this.$router.push('/');
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        this.classes = await ClassService.search('', this.currentPage, this.pageSize);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load classes';
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchClasses();
    },
    editClass(gymClass) {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      this.editForm = {
        ...gymClass,
        workoutIds: gymClass.workoutIds || [],
        imageUrls: gymClass.imageUrls || [],
      };
      this.showEditModal = true;
    },
    async deleteClass(id) {
      if (!this.isAdmin) {
        this.$toast.error('Unauthorized: Admin access required');
        return;
      }
      if (!confirm('Are you sure you want to delete this class?')) return;
      try {
        await ClassService.delete(id);
        this.$toast.success('Class deleted successfully');
        await this.fetchClasses();
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to delete class');
      }
    },
    async handleClassUpdated() {
      this.showEditModal = false;
      await this.fetchClasses();
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleString() : 'N/A';
    },
  },
  created() {
    if (!this.isAdmin) {
      this.$toast.error('Unauthorized: Admin access required');
      this.$router.push('/');
      return;
    }
    this.fetchClasses();
  },
};
</script>