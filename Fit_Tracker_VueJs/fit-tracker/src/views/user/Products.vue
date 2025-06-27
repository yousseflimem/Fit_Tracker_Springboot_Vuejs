<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Products</h1>
    <div class="mb-4">
      <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full p-2 border rounded"
          @input="onSearchInput"
      />
    </div>

    <div v-if="loading" class="text-center p-8">
      <spinner class="text-accent h-12 w-12 mx-auto" />
      <p class="mt-4 text-gray-600">Loading products...</p>
    </div>

    <template v-else>
      <div v-if="products.length === 0" class="text-gray-600 text-center p-8">
        No products found matching your search criteria
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @cart-updated="handleCartUpdate"
          />
        </div>
        <Pagination
            :total-pages="totalPages"
            :current-page="currentPage"
            @page-changed="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Pagination from '@/components/shared/Pagination.vue';
import ProductCard from '@/components/shared/ProductCard.vue';
import ProductService from '@/services/products.js';
import { debounce } from 'lodash';

export default {
  components: { Pagination, ProductCard },
  data() {
    return {
      products: [],
      search: '',
      currentPage: 0,
      totalPages: 0,
      loading: false,
      error: null
    };
  },
  created() {
    this.debouncedFetch = debounce(this.fetchProducts, 300);
    this.fetchProducts(0);
  },
  methods: {
    async fetchProducts(page = 0) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ProductService.search({
          keyword: this.search,
          page,
          size: 9
        });

        this.products = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;

      } catch (error) {
        this.error = error.message;
        this.$toast.error(this.error);
        console.error('Product fetch error:', error);
      } finally {
        this.loading = false;
      }
    },

    onSearchInput() {
      this.currentPage = 0;
      this.debouncedFetch(0);
    },

    handlePageChange(newPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.fetchProducts(newPage);
    },

    handleCartUpdate() {
      // Refresh product data after cart update
      this.fetchProducts(this.currentPage);
      this.$toast.success('Cart updated successfully!');
    }
  }
};
</script>