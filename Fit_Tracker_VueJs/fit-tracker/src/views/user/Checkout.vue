<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Checkout</h1>

    <div v-if="!orderId" class="text-center text-gray-500 py-10">
      Creating order...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-xl font-bold mb-4">Payment Details</h2>
        <PaymentForm
            :order-id="orderId"
            :amount="paymentAmount"
            @submitted="handlePayment"
        />
      </div>

      <OrderSummary :items="cartItems" :total="paymentAmount" />
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/orders.js';
import PaymentForm  from '@/components/user/PaymentForm.vue';
import OrderSummary from '@/components/user/OrderSummary.vue';

export default {
  components: { PaymentForm, OrderSummary },

  data() {
    return {
      orderId:       null,
      paymentAmount: 0,      // ← store the cart total here
    };
  },

  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    cartTotal() {
      return this.$store.getters.cartTotal;
    }
  },

  async created() {
    if (!this.cartItems.length) {
      this.$toast.error('Your cart is empty.');
      return this.$router.push('/cart');
    }

    // Capture the total *before* clearing the cart
    this.paymentAmount = this.cartTotal;

    try {
      const order = await OrderService.create({
        items: this.cartItems.map(i => ({
          productId: i.product.id,
          quantity:  i.quantity
        }))
      });
      this.orderId = order.id;

      // **DEFER** clearing the cart until after successful payment
    } catch (e) {
      this.$toast.error(e.response?.data?.message || 'Failed to create order');
      this.$router.push('/cart');
    }
  },

  methods: {
    async handlePayment(paymentRes) {
      if (paymentRes.status === 'COMPLETED') {
        this.$toast.success('Payment successful');
        this.$router.push('/orders');
        this.$store.dispatch('clearCart');
      } else {
        this.$toast.error(`Payment status: ${paymentRes.status}`);
      }
    }
  }
};
</script>
