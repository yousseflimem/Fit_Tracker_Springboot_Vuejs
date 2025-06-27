<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Workouts</h1>

    <div class="mb-4">
      <input
          v-model="search"
          type="text"
          placeholder="Search workouts..."
          class="w-full p-2 border rounded"
          @input="() => fetchWorkouts(0)"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <WorkoutCard
          v-for="workout in workouts"
          :key="workout.id"
          :workout="workout"
      />
    </div>

    <Pagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-changed="fetchWorkouts"
    />
  </div>
</template>

<script>
import Pagination  from '@/components/shared/Pagination.vue';
import WorkoutCard from '@/components/shared/WorkoutCard.vue';
import WorkoutService from '@/services/workouts.js';

export default {
  components: { Pagination, WorkoutCard },
  data() {
    return {
      workouts: [],
      search: '',
      currentPage: 0,
      totalPages: 0,
    };
  },
  async created() {
    await this.fetchWorkouts(0);
  },
  methods: {
    async fetchWorkouts(page = 0) {
      try {
        // call .search(), not .searchWorkouts
        const { content, totalPages } = await WorkoutService.search({
          keyword: this.search,
          page,
          size: 9
        });
        this.workouts    = content;
        this.totalPages  = totalPages;
        this.currentPage = page;
      } catch (error) {
        this.$toast.error('Failed to load workouts');
      }
    },
  },
};
</script>
