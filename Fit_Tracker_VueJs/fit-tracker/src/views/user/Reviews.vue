<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">My Reviews</h1>
    <ReviewList :reviews="reviews" />
    <Pagination :total-pages="totalPages" :current-page="currentPage" @page-changed="fetchReviews" />
  </div>
</template>

<script>
import Pagination from '@/components/shared/Pagination.vue';
import ReviewList from '@/components/shared/ReviewList.vue';
import ReviewService from '@/services/reviews.js';

export default {
  components: {Pagination, ReviewList },
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
        const response = await ReviewService.getByUserId(this.$store.getters.userId, page, 10);
        this.reviews = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = page;
      } catch (error) {
        this.$toast.error('Failed to load reviews');
      }
    },
  },
};
</script>