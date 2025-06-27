<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3 class="text-lg font-semibold mb-4">Edit Order #{{ order.id }}</h3>

      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Status</label>
        <select v-model="status" class="w-full p-2 border rounded">
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div class="flex justify-end space-x-2">
        <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button @click="save" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '@/services/orders.js';

export default {
  props: {
    order: { type: Object, required: true }
  },
  data() {
    return {
      status: this.order.status
    };
  },
  methods: {
    async save() {
      try {
        const updated = await OrderService.updateStatus(this.order.id, this.status);
        this.$toast.success('Order status updated');
        this.$emit('saved', updated);
      } catch {
        this.$toast.error('Failed to update order');
      }
    }
  }
};
</script>
