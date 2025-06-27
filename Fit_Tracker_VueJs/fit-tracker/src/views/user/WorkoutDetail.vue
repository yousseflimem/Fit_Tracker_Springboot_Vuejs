<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Workout Info -->
    <div v-if="!loadingWorkout">
      <h1 class="text-3xl font-bold text-primary mb-4">{{ workout.name }}</h1>
      <div class="bg-white p-6 rounded shadow-md mb-8">
        <img
            :src="workout.imageUrls?.[0] || placeholder"
            alt="Workout"
            class="w-full h-64 object-cover rounded mb-4"
        />
        <p class="text-gray-600 mb-2">Category: {{ workout.category }}</p>
        <p class="text-gray-600 mb-2">Duration: {{ workout.durationInMinutes }} minutes</p>
        <p class="text-gray-600 mb-2">Coach: {{ workout.coachName || 'N/A' }}</p> <!-- 👈 Add this line -->
        <p class="text-gray-700">{{ workout.description || 'No description.' }}</p>
      </div>

      <!-- Review List -->
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Reviews</h2>
        <ReviewList
            :reviews="reviews"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-changed="loadReviews"
            @delete="handleDeleteReview"
        />
      </div>

      <!-- New Review Form -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-xl font-semibold mb-4">Leave a Review</h3>
        <ReviewForm
            :workout-id="workout.id"
            @done="onReviewSubmitted"
        />
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-10">Loading workout...</div>
  </div>
</template>

<script>
import WorkoutService from '@/services/workouts.js';
import ReviewService from '@/services/reviews.js';
import ReviewList from '@/components/shared/ReviewList.vue';
import ReviewForm from '@/components/user/ReviewForm.vue';

export default {
  components: {ReviewList, ReviewForm},
  data() {
    return {
      workout: null,
      reviews: [],
      currentPage: 0,
      totalPages: 1,
      size: 5,
      loadingWorkout: true,
      placeholder: 'https://via.placeholder.com/600'
    };
  },
  async created() {
    try {
      this.workout = await WorkoutService.getById(this.$route.params.id);
    } catch {
      this.$toast.error('Failed to load workout');
      return this.$router.push('/workouts');
    } finally {
      this.loadingWorkout = false;
    }
    this.loadReviews(0);
  },
  methods: {
    async loadReviews(page) {
      this.currentPage = page;
      try {
        const {content, totalPages} = await ReviewService.getForWorkout(this.workout.id, {
          page, size: this.size
        });
        this.reviews = content;
        this.totalPages = totalPages;
      } catch {
        this.$toast.error('Failed to load reviews');
      }
    },
    // in WorkoutDetail.vue
    async handleDeleteReview(id) {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        await ReviewService.delete(id, user.id);
        this.$toast.success('Review deleted');
        this.loadReviews(this.currentPage);
      } catch {
        this.$toast.error('Failed to delete review');
      }
    },
    onReviewSubmitted() {
      this.loadReviews(0);
    }
  }
};
</script>