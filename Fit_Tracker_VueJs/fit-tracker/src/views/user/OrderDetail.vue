<template>
  <div>
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-10">
        <Spinner/>
      </div>

      <div v-else>
        <h1 class="text-2xl font-bold mb-4">Order #{{ order.id }}</h1>
        <p><strong>Date:</strong> {{ formatDate(order.orderDate) }}</p>
        <p>
          <strong>Status:</strong>
          <span
              :class="{
              'text-green-600': order.status === 'COMPLETED',
              'text-yellow-600': order.status === 'PENDING',
              'text-red-600': order.status === 'CANCELLED'
            }"
          >
            {{ order.status }}
          </span>
        </p>
        <p><strong>Total:</strong> ${{ order.totalAmount.toFixed(2) }}</p>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Items</h3>
          <ul class="list-disc ml-6 space-y-1">
            <li v-for="item in order.items" :key="item.productId">
              {{ item.productName }} × {{ item.quantity }}
              — ${{ (item.price * item.quantity).toFixed(2) }}
            </li>
          </ul>
        </div>

        <!-- Cancel button only if still pending -->
        <div class="mt-6">
          <button
              v-if="order.status === 'PENDING'"
              @click="cancelOrder()"
              :disabled="canceling"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            <span v-if="canceling">Cancelling…</span>
            <span v-else>Cancel Order</span>
          </button>

          <div  class="flex items-center space-x-4 mt-4">
            <router-link
                to="/user/orders"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to My Orders
            </router-link>

          </div>

        </div>
      </div>
    </div>

    <!-- Cancel button and payment section -->
    <div class="mt-6 space-y-4 container mx-auto px-4">
      <div v-if="order.status === 'PENDING'">
        <button
            @click="cancelOrder"
            :disabled="canceling"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          <span v-if="canceling">Cancelling…</span>
          <span v-else>Cancel Order</span>
        </button>

        <button
            @click="showPayment = !showPayment"
            class="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {{ showPayment ? 'Hide Payment' : 'Proceed to Payment' }}
        </button>

        <!-- Payment form -->
        <div v-if="showPayment" class="mt-6">
          <PaymentForm
              :order-id="order.id"
              :amount="order.totalAmount"
              @submitted="handlePaymentSuccess"
          />
        </div>
      </div>
      <!-- Show payment button even after completion if needed -->
      <div v-if="order.status !== 'PENDING'" class="flex items-center space-x-4 mt-4">
        <button
            @click="showPayment = !showPayment"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {{ showPayment ? 'Hide Payment' : 'Show Payment Details' }}
        </button>

        <!-- Payment form display -->
        <div v-if="showPayment" class="mt-4">
          <PaymentForm
              :order-id="order.id"
              :amount="order.totalAmount"
              @submitted="handlePaymentSuccess"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/orders.js';
import Spinner from '@/views/shared/Spinner.vue';
import PaymentForm from '@/components/user/PaymentForm.vue'; // Adjust path if needed

export default {
  components: {Spinner, PaymentForm},
  data() {
    return {
      order: null,
      loading: true,
      canceling: false,
      showPayment: false
    };
  },
  async created() {
    try {
      this.order = await OrderService.getById(this.$route.params.id);
    } catch {
      this.$toast.error('Failed to load order');
      return this.$router.push('/orders');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(d) {
      return new Date(d).toLocaleString();
    },
    async cancelOrder() {
      if (!confirm('Cancel this order?')) return;
      this.canceling = true;
      try {
        await OrderService.cancel(this.order.id);
        this.$toast.success('Order cancelled');
        this.order.status = 'CANCELLED';
        this.showPayment = false;
      } catch {
        this.$toast.error('Failed to cancel order');
      } finally {
        this.canceling = false;
      }
    },
    handlePaymentSuccess(payment) {
      this.$toast.success(`Payment successful with card ending in ${payment.cardLast4}`);
      this.order.status = 'COMPLETED';
      this.showPayment = false;
    }
  }
};
</script>

