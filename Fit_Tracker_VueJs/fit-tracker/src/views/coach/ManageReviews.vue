<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Manage Reviews</h1>
    <ReviewManagement
        :reviews="reviews"
        @delete="deleteReview"
    />
    <Pagination :total-pages="totalPages" :current-page="currentPage" @page-changed="fetchReviews" />
  </div>
</template>

<script>
import Pagination from '@/components/shared/Pagination.vue';
import ReviewManagement from '@/components/coach/ReviewManagement.vue';
import ReviewService from '@/services/reviews.js';
import ClassService from '@/services/classes.js';

export default {
  components: {Pagination, ReviewManagement },
  data() {
    return {
      reviews: [],
      currentPage: 0,
      totalPages: 0,
    };
  },
  async created() {
    await this.fetchReviews(0);
  },
  methods: {
    async fetchReviews(page) {
      try {
        const classResponse = await ClassService.getByCoachId(this.$store.getters.userId);
        const classIds = classResponse.data.content.map(cls => cls.id);
        const reviewPromises = classIds.map(id => ReviewService.getByClassId(id, page, 10));
        const responses = await Promise.all(reviewPromises);
        this.reviews = responses.flatMap(res => res.data.content);
        this.totalPages = Math.max(...responses.map(res => res.data.totalPages));
        this.currentPage = page;
      } catch (error) {
        this.$toast.error('Failed to load reviews');
      }
    },
    async deleteReview(id) {
      try {
        await ReviewService.delete(id);
        this.$toast.success('Review deleted');
        await this.fetchReviews(this.currentPage);
      } catch (error) {
        this.$toast.error('Failed to delete review');
      }
    },
  },
};
</script>