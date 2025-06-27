<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">My Payments</h1>

    <div v-if="!payments.length" class="text-gray-600">You have no payments yet.</div>
    <table v-else class="w-full bg-white rounded shadow table-auto">
      <thead>
      <tr class="bg-gray-100">
        <th class="p-2">Order ID</th>
        <th class="p-2">Amount</th>
        <th class="p-2">Method</th>
        <th class="p-2">Card End</th>
        <th class="p-2">Status</th>
        <th class="p-2">Paid At</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="p in payments" :key="p.id" class="border-t">
        <td class="p-2">{{ p.orderId }}</td>
        <td class="p-2">${{ p.amount.toFixed(2) }}</td>
        <td class="p-2">{{ p.paymentMethod }}</td>
        <td class="p-2">•••• {{ p.cardLast4 }}</td>
        <td class="p-2">{{ p.status }}</td>
        <td class="p-2">{{ formatDate(p.paymentDate) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PaymentService from '@/services/payments.js';

export default {
  data() {
    return { payments: [] };
  },
  async created() {
    try {
      const data = await PaymentService.getUserPayments();
      this.payments = data.content;
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
