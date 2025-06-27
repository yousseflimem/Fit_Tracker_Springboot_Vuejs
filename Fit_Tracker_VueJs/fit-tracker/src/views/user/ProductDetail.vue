<!-- src/views/user/ProductDetail.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">{{ product.name }}</h1>
    <div class="bg-white p-6 rounded shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
              :src="product.imageUrls[0] || 'https://via.placeholder.com/600'"
              alt="Product"
              class="w-full h-64 object-cover rounded mb-4"
          />
          <div class="flex space-x-2 overflow-x-auto">
            <img
                v-for="(u, i) in product.imageUrls.slice(1)"
                :key="i"
                :src="u"
                class="w-24 h-24 object-cover rounded"
            />
          </div>
        </div>
        <div>
          <p class="text-gray-600 mb-2">Price: ${{ product.price.toFixed(2) }}</p>
          <p class="text-gray-600 mb-2">Stock: {{ product.stock }}</p>
          <p class="text-gray-700 mb-4">
            {{ product.description || 'No description available.' }}
          </p>
          <button
              @click="addToCart"
              :disabled="product.stock <= 0"
              class="w-full bg-accent text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from '@/services/products.js';

export default {
  data() {
    return { product: null, loading: true };
  },
  async created() {
    try {
      // getById returns the product object directly
      this.product = await ProductService.getById(this.$route.params.id);
    } catch (e) {
      this.$toast.error('Failed to load product');
      this.$router.replace('/products');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    addToCart() {
      this.$store.dispatch('addToCart', {
        product: { ...this.product },
        quantity: 1
      });
      this.product.stock--;
      this.$toast.success('Added to cart');
    }
  }
};
</script>
