<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Gym Classes</h1>
    <!-- Search Bar -->
    <div class="mb-6">
      <input
          v-model="keyword"
          @input="searchClasses"
          type="text"
          placeholder="Search classes by title or category..."
          class="w-full p-2 border rounded"
      />
    </div>
    <!-- Classes List -->
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ClassCard
          v-for="gymClass in classes.content"
          :key="gymClass.id"
          :classItem="gymClass"
      @view-details="viewClassDetails(gymClass.id)"
      />
    </div>
    <!-- Pagination -->
    <Pagination
        v-if="classes.totalPages > 1"
        :total-pages="classes.totalPages"
        :current-page="currentPage"
        @page-change="changePage"
    />
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import ClassCard from '@/components/shared/ClassCard.vue';
import Pagination from '@/components/shared/Pagination.vue';

export default {
  components: { ClassCard, Pagination },
  data() {
    return {
      keyword: '',
      classes: { content: [], totalPages: 0 },
      currentPage: 0,
      pageSize: 10,
      loading: false,
      error: null,
    };
  },
  methods: {
    async searchClasses() {
      this.loading = true;
      this.error = null;
      try {
        this.classes = await ClassService.search(this.keyword, this.currentPage, this.pageSize);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load classes';
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async changePage(page) {
      this.currentPage = page;
      await this.searchClasses();
    },
    viewClassDetails(classId) {
      this.$router.push(`/user/class/${classId}`);
    },
  },
  created() {
    this.searchClasses();
  },
};
</script>