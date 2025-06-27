<template>
  <div class="flex items-center justify-between bg-white p-4 rounded shadow">
    <div class="flex items-center">
      <img
          :src="thumbnail"
          alt="Product image"
          class="w-24 h-24 object-contain rounded border"
      />
      <div class="ml-4">
        <h4 class="font-semibold text-primary">{{ item.product.name }}</h4>
        <p class="text-gray-600">{{ formatMoney(item.product.price) }} each</p>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <button
          @click="updateQty(item.quantity - 1)"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        –
      </button>
      <span class="w-6 text-center">{{ item.quantity }}</span>
      <button
          @click="updateQty(item.quantity + 1)"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ＋
      </button>
      <button
          @click="$emit('remove', item.product.id)"
          class="ml-4 text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      required: true,
      validator(o) {
        return (
            o.product &&
            typeof o.product.id === 'number' &&
            typeof o.product.price === 'number' &&
            typeof o.quantity === 'number'
        );
      }
    },
    placeholder: {
      type: String,
      default: 'https://via.placeholder.com/200'
    }
  },
  computed: {
    thumbnail() {
      return this.item.product.imageUrls?.[0] || this.placeholder;
    }
  },
  methods: {
    updateQty(newQty) {
      if (newQty < 1) return;
      const available = this.item.product.stock ?? Infinity;
      if (newQty > available) {
        this.$emit('error', 'Not enough stock available');
        return;
      }
      this.$emit('update-qty', {
        productId: this.item.product.id,
        quantity: newQty
      });
    },
    formatMoney(amount) {
      return amount.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD'
      });
    }
  }
};
</script>
