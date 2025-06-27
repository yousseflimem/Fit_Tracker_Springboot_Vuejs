<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Shopping Cart</h1>
    <div v-if="!cartItems.length" class="text-gray-600">Your cart is empty.</div>
    <div v-else class="space-y-4">
      <CartItem
          v-for="item in cartItems"
          :key="item.product.id"
          :item="item"
          @updated="noop"
          @remove="removeItem"
      />
      <div class="flex justify-end">
        <router-link
            to="/checkout"
            class="bg-accent text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CartItem from '@/components/user/CartItem.vue';
export default {
  components: { CartItem },
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    }
  },
  methods: {
    noop() {},              // no-op because Vuex store is reactive
    removeItem(productId) {
      this.$store.dispatch('removeFromCart', productId);
      this.$toast.success('Item removed');
    }
  }
};
</script>
