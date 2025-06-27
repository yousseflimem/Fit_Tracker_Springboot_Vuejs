<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h2 class="text-xl font-bold text-primary mb-4">Order Summary</h2>

    <div
        v-for="item in items"
        :key="item.product.id"
        class="flex justify-between mb-2"
    >
      <span>{{ item.product.name }} × {{ item.quantity }}</span>
      <span>{{ formatMoney(item.product.price * item.quantity) }}</span>
    </div>

    <div class="border-t pt-2 mt-2 flex justify-between font-semibold">
      <span>Total</span>
      <span>{{ formatMoney(total) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    items: {
      type: Array,
      required: true,
      validator(arr) {
        return arr.every(
            i =>
                i.product &&
                typeof i.product.price === 'number' &&
                typeof i.quantity === 'number'
        );
      }
    }
  },
  computed: {
    total() {
      return this.items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
      );
    }
  },
  methods: {
    formatMoney(amount) {
      return amount.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD'
      });
    }
  }
};
</script>
