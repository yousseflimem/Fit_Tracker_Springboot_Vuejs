<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Gym Classes</h1>

    <!-- Search -->
    <div class="mb-6">
      <input
          v-model="keyword"
          @input="onSearchInput"
          type="text"
          placeholder="Search classes by title or category..."
          class="w-full p-2 border rounded"
      />
    </div>

    <!-- Loading / Error / Content -->
    <div v-if="loading" class="text-center p-8">
      Loading classes...
    </div>
    <div v-else-if="error" class="text-red-500 text-center p-8">{{ error }}</div>
    <div v-else>
      <div v-if="classes.content.length === 0" class="text-gray-600 text-center p-8">
        No classes found matching your search criteria
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClassCard
            v-for="gymClass in classes.content"
            :key="gymClass.id"
            :gymClass="gymClass"
            @view-details="viewClassDetails"
        />
      </div>

      <!-- Pagination -->
      <Pagination
          v-if="classes.totalPages > 1"
          :total-pages="classes.totalPages"
          :current-page="classes.currentPage"
          @page-changed="changePage"
      />
    </div>
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import ClassCard from '@/components/shared/ClassCard.vue';
import Pagination from '@/components/shared/Pagination.vue';
import { debounce } from 'lodash';

export default {
  components: { ClassCard, Pagination },
  data() {
    return {
      keyword: '',
      classes: { content: [], totalPages: 0, currentPage: 0 },
      loading: false,
      error: null,
      search: '',
      currentPage: 0,
      totalPages: 0,
    };
  },
  created() {
    this.debouncedFetch = debounce(this.fetchClasses, 300);
    this.fetchClasses(0);
  },
  methods: {
    async fetchClasses(page = 0) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ClassService.search({
          keyword: this.keyword,
          page,
          size: 9
        });

        this.classes = response;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load classes';
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    onSearchInput() {
      this.fetchClasses(0);
      this.debouncedFetch(0);
    },

    changePage(newPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.fetchClasses(newPage);
    },

    viewClassDetails(id) {
      this.$router.push(`/user/class/${id}`);
    }
  }
};
</script>
