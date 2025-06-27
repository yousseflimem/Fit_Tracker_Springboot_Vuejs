<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Manage Orders</h1>

    <OrderTable
        :orders="orders"
        @update="editOrder"
        @delete="deleteOrder"
    />

    <Pagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-changed="fetchOrders"
    />

    <!-- Inline edit modal -->
    <OrderEditForm
        v-if="editingOrder"
        :order="editingOrder"
        @saved="onOrderSaved"
        @cancel="editingOrder = null"
    />
  </div>
</template>

<script>
import OrderTable     from '@/components/admin/OrderTable.vue';
import Pagination     from '@/components/shared/Pagination.vue';
import OrderService   from '@/services/orders.js';
import OrderEditForm  from '@/components/admin/OrderEditForm.vue';

export default {
  components: { OrderTable, Pagination, OrderEditForm },

  data() {
    return {
      orders:       [],
      currentPage:  0,
      totalPages:   0,
      editingOrder: null
    };
  },

  async created() {
    await this.fetchOrders(0);
  },

  methods: {
    async fetchOrders(page) {
      try {
        const pageData = await OrderService.getAll(page, 10);
        this.orders      = pageData.content;
        this.totalPages  = pageData.totalPages;
        this.currentPage = page;
      } catch {
        this.$toast.error('Failed to load orders');
      }
    },

    editOrder(order) {
      // open the edit modal
      this.editingOrder = { ...order };
    },

    async deleteOrder(id) {
      try {
        await OrderService.delete(id);
        this.$toast.success(`Order #${id} deleted`);
        this.orders = this.orders.filter(o => o.id !== id);
      } catch {
        this.$toast.error('Failed to delete order');
      }
    },

    onOrderSaved(updatedOrder) {
      // replace the updated order in the list
      const idx = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (idx !== -1) this.orders.splice(idx, 1, updatedOrder);
      this.editingOrder = null;
    }
  }
};
</script>
