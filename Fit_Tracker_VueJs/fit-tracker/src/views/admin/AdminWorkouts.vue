<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Manage Workouts</h1>

    <!-- Form Toggle -->
    <div class="mb-4">
      <button
          v-if="!showForm"
          @click="openForm(null)"
          class="bg-accent text-white px-4 py-2 rounded"
      >
        Create Workout
      </button>
      <button
          v-else
          @click="showForm = false"
          class="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>

    <!-- Workout Form -->
    <WorkoutForm
        v-if="showForm"
        :workout="selected"
        @submitted="onSaved"
        @cancel="showForm = false"
    />

    <!-- Filters -->
    <div class="mb-4">
      <input
          v-model="keyword"
          @input="onSearchInput"
          placeholder="Search workouts…"
          class="border p-2 rounded w-full"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">Loading…</div>

    <!-- Empty -->
    <div v-else-if="workouts.length === 0" class="text-center py-8">
      No workouts found.
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AdminWorkoutCard
          v-for="w in workouts"
          :key="w.id"
          :workout="w"
          @edit="openForm"
          @delete="onDelete"
          @view-details="openDetails"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center space-x-2">
      <button
          :disabled="page === 0"
          @click="changePage(page - 1)"
          class="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <span>Page {{ page + 1 }} of {{ total }}</span>
      <button
          :disabled="page + 1 >= total"
          @click="changePage(page + 1)"
          class="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>

    <!-- Details Modal -->
    <Modal v-if="modalOpen" :title="detail.name" @close="modalOpen = false">
      <div class="space-y-4">
        <p><strong>Category:</strong> {{ detail.category }}</p>
        <p><strong>Duration:</strong> {{ detail.durationInMinutes }} minutes</p>
        <p><strong>Coach:</strong> {{ detail.coachName || 'N/A' }}</p>
        <div class="flex space-x-2 overflow-x-auto">
          <img
              v-for="(u, i) in detail.imageUrls"
              :key="i"
              :src="u"
              class="w-32 h-32 object-cover rounded"
              alt=""/>
        </div>
        <p v-if="detail.description">{{ detail.description }}</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import WorkoutForm from '@/components/admin/WorkoutForm.vue';
import AdminWorkoutCard from '@/components/admin/AdminWorkoutCard.vue';
import Modal from '@/components/shared/Modal.vue';
import WorkoutService from '@/services/workouts.js';

export default {
  components: {WorkoutForm, AdminWorkoutCard: AdminWorkoutCard, Modal},
  data() {
    return {
      workouts: [],
      loading: false,
      keyword: '',
      page: 0,
      total: 1,

      showForm: false,
      selected: null,

      modalOpen: false,
      detail: {}
    };
  },
  created() {
    this.fetchDebounced = debounce(this.fetch, 300);
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        const r = await WorkoutService.search({
          keyword: this.keyword,
          page: this.page,
          size: 9
        });
        this.workouts = r.content;
        this.total = r.totalPages;
      } catch (e) {
        alert(e.message);
      } finally {
        this.loading = false;
      }
    },
    onSearchInput() {
      this.page = 0;
      this.fetchDebounced();
    },
    openForm(w = null) {
      this.selected = w ? {...w} : null;
      this.showForm = true;
    },
    onSaved() {
      this.showForm = false;
      this.fetch();
    },
    async onDelete(w) {
      if (!confirm(`Delete ${w.name}?`)) return;
      try {
        await WorkoutService.delete(w.id);
        this.fetch();
      } catch (e) {
        alert(e.message);
      }
    },
    openDetails(id) {
      WorkoutService.getById(id)
          .then((x) => {
            this.detail = x;
            this.modalOpen = true;
          })
          .catch((e) => alert(e.message));
    },
    changePage(n) {
      this.page = n;
      this.fetch();
    }
  }
};
</script>
