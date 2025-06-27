<template>
  <div class="overflow-x-auto p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold text-primary mb-4">All Payments</h2>
    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="py-2 px-4 text-left">ID</th>
        <th class="py-2 px-4 text-left">Order</th>
        <th class="py-2 px-4 text-left">Amount</th>
        <th class="py-2 px-4 text-left">Date</th>
        <th class="py-2 px-4 text-left">Method</th>
        <th class="py-2 px-4 text-left">Card Last4</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="p in payments" :key="p.id" class="border-t">
        <td class="py-2 px-4">{{ p.id }}</td>
        <td class="py-2 px-4">{{ p.orderId }}</td>
        <td class="py-2 px-4">${{ p.amount.toFixed(2) }}</td>
        <td class="py-2 px-4">{{ formatDate(p.paymentDate) }}</td>
        <td class="py-2 px-4">{{ p.paymentMethod }}</td>
        <td class="py-2 px-4">•••• {{ p.cardLast4 }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PaymentService from '@/services/payments.js';

export default {
  name: 'PaymentsTable',
  data() {
    return {
      payments: []
    };
  },
  async created() {
    try {
      const page = await PaymentService.getAll(0, 100);
      this.payments = page.content;
    } catch {
      this.$toast.error('Failed to load payments');
    }
  },
  methods: {
    formatDate(d) {
      return new Date(d).toLocaleString();
    }
  }
};
</script>
