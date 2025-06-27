<template>
  <div class="bg-white p-6 rounded shadow-md ml-64 mt-6">
    <h2 class="text-xl font-semibold mb-4 text-primary">Manage Reviews</h2>
    <div v-if="reviews.length" class="space-y-4">
      <div
          v-for="r in reviews"
          :key="r.id"
          class="border rounded p-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ r.user.username }}</p>
          <p class="text-gray-700">{{ r.comment }}</p>
          <p class="text-yellow-500">
            {{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}
          </p>
        </div>
        <button
            @click="deleteReview(r.id)"
            class="text-red-600 hover:text-red-800"
        >Delete</button>
      </div>
    </div>
    <p v-else class="text-gray-600">No reviews to manage.</p>
  </div>
</template>

<script>
import ReviewService from '@/services/reviews.js';

export default {
  name: 'ReviewManagement',
  data() {
    return {
      reviews: []
    };
  },
  async created() {
    try {
      const coachId = this.$store.getters.userId;
      // assuming backend supports fetching reviews by coach
      this.reviews = await ReviewService.getForUser(coachId, { page: 0, size: 100 });
    } catch {
      this.$toast.open({ message: 'Failed to load reviews', type: 'error' });
    }
  },
  methods: {
    async deleteReview(id) {
      try {
        await ReviewService.delete(id);
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.$toast.open({ message: 'Review deleted', type: 'success' });
      } catch {
        this.$toast.open({ message: 'Delete failed', type: 'error' });
      }
    }
  }
};
</script>
