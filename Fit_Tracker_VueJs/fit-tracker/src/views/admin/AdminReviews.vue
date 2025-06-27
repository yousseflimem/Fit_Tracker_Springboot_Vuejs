<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Manage Reviews</h1>

    <ReviewTable
        :reviews="reviews"
        @delete="deleteReview"
    />

    <Pagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-changed="fetchReviews"
    />
  </div>
</template>

<script>
import ReviewTable from '@/components/admin/ReviewTable.vue';
import Pagination  from '@/components/shared/Pagination.vue';
import ReviewService from '@/services/reviews.js';

export default {
  components: { ReviewTable, Pagination },
  data() {
    return {
      reviews:     [],
      currentPage: 0,
      totalPages:  0,
      size:        10
    };
  },
  async created() {
    await this.fetchReviews(0);
  },
  methods: {
    async fetchReviews(page) {
      try {
        const pageData = await ReviewService.getAll(page, this.size);
        this.reviews      = pageData.content;
        this.totalPages   = pageData.totalPages;
        this.currentPage  = page;
      } catch {
        this.$toast.error('Failed to load reviews');
      }
    },

    async deleteReview(id) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await ReviewService.delete(id, user.id);
        this.$toast.success('Review deleted');
        // Refresh current page
        await this.fetchReviews(this.currentPage);
      } catch {
        this.$toast.error('Failed to delete review');
      }
    }
  }
};
</script>
