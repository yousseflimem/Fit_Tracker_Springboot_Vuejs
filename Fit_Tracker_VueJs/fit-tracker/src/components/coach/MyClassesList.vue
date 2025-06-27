<template>
  <div class="bg-white p-6 rounded shadow-md ml-64 mt-6">
    <h2 class="text-xl font-semibold mb-4 text-primary">My Workouts</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="w in workouts"
          :key="w.id"
          class="border rounded-lg p-4 shadow hover:shadow-lg transition"
      >
        <img
            :src="w.imageUrls?.[0] || placeholder"
            class="w-full h-32 object-cover rounded"
            alt="Workout"
        />
        <h3 class="mt-2 font-semibold">{{ w.name }}</h3>
        <p class="text-gray-600">{{ w.category }}</p>
        <div class="mt-4 flex justify-between">
          <router-link
              :to="{ name: 'WorkoutDetail', params: { id: w.id }}"
              class="text-blue-500 hover:underline"
          >Details</router-link>
          <button
              @click="deleteWorkout(w.id)"
              class="text-red-500 hover:underline"
          >Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WorkoutService from '@/services/workouts.js';

export default {
  name: 'MyWorkoutsList',
  data() {
    return {
      workouts: [],
      placeholder: 'https://via.placeholder.com/300'
    };
  },
  async created() {
    try {
      const userId = this.$store.getters.userId;
      const resp = await WorkoutService.getByCoach(userId, { page: 0, size: 100 });
      this.workouts = resp.content;
    } catch {
      this.$toast.open({ message: 'Failed to load workouts', type: 'error' });
    }
  },
  methods: {
    async deleteWorkout(id) {
      try {
        await WorkoutService.delete(id);
        this.workouts = this.workouts.filter(w => w.id !== id);
        this.$toast.open({ message: 'Workout deleted', type: 'success' });
      } catch {
        this.$toast.open({ message: 'Delete failed', type: 'error' });
      }
    }
  }
};
</script>
