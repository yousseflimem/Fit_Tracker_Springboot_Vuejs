<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>

    <div v-if="loading" class="text-center py-10">
      <Spinner/>   <!-- assume you have a Spinner component -->
    </div>

    <div v-else-if="!orders.length" class="text-center py-10 text-gray-600">
      No orders found.
    </div>

    <ul v-else class="space-y-4">
      <li
          v-for="o in orders"
          :key="o.id"
          class="p-4 border rounded shadow flex justify-between items-start"
      >
        <div>
          <p><strong>Date:</strong> {{ formatDate(o.orderDate) }}</p>
          <p><strong>Status:</strong>
            <span
                :class="{
                'text-green-600': o.status === 'COMPLETED',
                'text-yellow-600': o.status === 'PENDING',
                'text-red-600': o.status === 'CANCELLED'
              }"
            >
              {{ o.status }}
            </span>
          </p>
          <p><strong>Total:</strong> ${{ o.totalAmount.toFixed(2) }}</p>
        </div>

        <div class="flex flex-col space-y-2">
          <router-link
              :to="{ name: 'OrderDetail', params: { id: o.id } }"
              class="text-accent underline"
          >
            View Details
          </router-link>

          <button
              v-if="o.status === 'PENDING'"
              @click="cancelOrder(o.id)"
              :disabled="canceling === o.id"
              class="text-red-600 hover:text-red-800 disabled:text-gray-400"
          >
            <span v-if="canceling === o.id">Cancelling…</span>
            <span v-else>Cancel Order</span>
          </button>
        </div>
      </li>
    </ul>

    <Pagination
        v-if="totalPages > 1"
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-changed="fetchOrders"
        class="mt-6"
    />
  </div>
</template>

<script>
import OrderService from '@/services/orders.js';
import Pagination from '@/components/shared/Pagination.vue';
import Spinner from '@/views/shared/Spinner.vue';

export default {
  components: {Pagination, Spinner},
  data() {
    return {
      orders: [],
      loading: true,
      canceling: null,
      currentPage: 0,
      totalPages: 0
    };
  },
  async created() {
    await this.fetchOrders(0);
  },
  methods: {
    async fetchOrders(page) {
      this.loading = true;
      try {
        const {content, totalPages} = await OrderService.getUserOrders({page, size: 10});
        this.orders = content;
        this.totalPages = totalPages;
        this.currentPage = page;
      } catch {
        this.$toast.error('Failed to load orders');
      } finally {
        this.loading = false;
      }
    },
    formatDate(d) {
      return new Date(d).toLocaleString();
    },
    async cancelOrder(id) {
      if (!confirm('Are you sure you want to cancel this order?')) return;
      this.canceling = id;
      try {
        await OrderService.cancel(id);
        this.$toast.success('Order cancelled');
        await this.fetchOrders(this.currentPage);
      } catch {
        this.$toast.error('Failed to cancel order');
      } finally {
        this.canceling = null;
      }
    }
  }
};
</script>
