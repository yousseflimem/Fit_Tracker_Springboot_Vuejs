<!-- src/components/shared/ProductCard.vue -->
<template>
  <router-link :to="`/products/${product.id}`" class="block">
    <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
          :src="product.imageUrls[0] || placeholder"
          alt="Product"
          class="w-full h-40 object-cover rounded"
      />
      <div class="p-2">
        <h3 class="text-lg font-semibold">{{ product.name }}</h3>
        <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>
        <button
            @click.stop="addToCart"
            :disabled="product.stock <= 0"
            class="mt-2 w-full bg-accent text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
        </button>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: { product: { type: Object, required: true } },
  data() {
    return { placeholder: 'https://via.placeholder.com/300' };
  },
  methods: {
    addToCart() {
      if (this.product.stock > 0) {
        this.$store.dispatch('addToCart', {
          product: { ...this.product },
          quantity: 1
        });
        // eslint-disable-next-line vue/no-mutating-props
        this.product.stock--; // optimistic local update
        this.$toast.success('Added to cart');
      }
    }
  }
};
</script>
