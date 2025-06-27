<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-primary">My Classes</h2>
      <button
          class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          @click="openAddModal"
      >
        Add Class
      </button>
    </div>
    <table class="w-full table-auto border border-gray-200" v-if="classes.length">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 border">Title</th>
        <th class="px-4 py-2 border">Category</th>
        <th class="px-4 py-2 border">Description</th>
        <th class="px-4 py-2 border">Start Time</th>
        <th class="px-4 py-2 border">End Time</th>
        <th class="px-4 py-2 border">Duration</th>
        <th class="px-4 py-2 border">Capacity</th>
        <th class="px-4 py-2 border">Sessions</th>
        <th class="px-4 py-2 border">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cls in classes" :key="cls.id">
        <td class="px-4 py-2 border">{{ cls.title }}</td>
        <td class="px-4 py-2 border">{{ cls.category }}</td>
        <td class="px-4 py-2 border">{{ cls.description }}</td>
        <td class="px-4 py-2 border">{{ formatDate(cls.startTime) }}</td>
        <td class="px-4 py-2 border">{{ formatDate(cls.endTime) }}</td>
        <td class="px-4 py-2 border">{{ cls.durationInMinutes }} min</td>
        <td class="px-4 py-2 border">{{ cls.capacity }}</td>
        <td class="px-4 py-2 border">{{ cls.sessions?.length || 0 }}</td>
        <td class="px-4 py-2 border">
          <button
              class="text-blue-600 hover:underline mr-2"
              @click="openEditModal(cls)"
          >Edit</button>
          <button
              class="text-red-600 hover:underline"
              @click="deleteClass(cls.id)"
          >Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else class="text-gray-500">No classes found.</p>

    <ClassEditModal
        v-if="showModal"
        :classItem="editingClass"
        @close="closeModal"
        @save="handleSave"
    />
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import ClassEditModal from '@/components/coach/ClassEditModal.vue';
import moment from 'moment-timezone'

export default {
  components: { ClassEditModal },
  data() {
    return {
      classes: [],
      showModal: false,
      editingClass: null
    };
  },
  async created() {
    await this.fetchClasses();
  },
  methods: {
    async fetchClasses() {
      try {
        const coachId = this.$store.getters.userId;
        const response = await ClassService.getByCoach(coachId, { page: 0, size: 100 });
        this.classes = response.content || [];
      } catch (error) {
        this.$toast?.error?.('Failed to load classes') || alert('Failed to load classes');
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return moment(dateStr).tz('Europe/London').format();
    },
    openAddModal() {
      this.editingClass = null;
      this.showModal = true;
    },
    openEditModal(cls) {
      this.editingClass = cls;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async handleSave(form) {
      try {
        const payload = {
          ...form,
          coachId: this.$store.getters.userId
        };

        if (payload.startTime) {
          payload.startTime = moment(payload.startTime).format();
        }
        if (payload.endTime) {
          payload.endTime = moment(payload.endTime).format();
        }

        if (this.editingClass) {
          await ClassService.update(this.editingClass.id, payload);
          this.$toast?.success?.('Class updated');
        } else {
          await ClassService.create(payload);
          this.$toast?.success?.('Class added');
        }
        this.showModal = false;
        await this.fetchClasses();
      } catch (error) {
        this.$toast?.error?.('Failed to save class');
      }
    },
    async deleteClass(id) {
      if (confirm('Are you sure you want to delete this class?')) {
        try {
          await ClassService.delete(id);
          this.$toast?.success?.('Class deleted');
          await this.fetchClasses();
        } catch (error) {
          this.$toast?.error?.('Failed to delete class');
        }
      }
    }
  }
};
</script>