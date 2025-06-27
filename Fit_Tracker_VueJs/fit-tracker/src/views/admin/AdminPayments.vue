<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Payments</h1>

    <!-- Use the shared PaymentsTable component -->
    <PaymentsTable :payments="payments" />
  </div>
</template>

<script>
import PaymentService from '@/services/payments.js';
import PaymentsTable from "@/components/admin/PaymentTable.vue";

export default {
  components: {PaymentsTable},
  data() {
    return {
      payments: []
    };
  },
  async created() {
    try {
      const page = await PaymentService.getAll(0, 100);
      this.payments = page.content;
    } catch (e) {
      this.$toast.error('Failed to load payments');
    }
  }
};
</script>
