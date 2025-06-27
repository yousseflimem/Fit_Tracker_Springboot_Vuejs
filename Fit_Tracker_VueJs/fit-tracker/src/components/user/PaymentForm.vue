<!-- src/components/PaymentForm.vue -->
<template>
  <form @submit.prevent="submit" class="bg-white p-6 rounded shadow-md space-y-4">
    <p class="text-gray-800">
      You're about to pay <strong>${{ amount.toFixed(2) }}</strong> for order #{{ orderId }}.
    </p>

    <div class="space-y-2">
      <label class="block text-sm font-medium">Card Number</label>
      <input
          v-model="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          class="w-full border rounded p-2"
          required
          pattern="(?:\d{4}\s?){3}\d{4}"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">Expiry (MM/YY)</label>
        <input
            v-model="expiry"
            type="text"
            placeholder="MM/YY"
            class="w-full border rounded p-2"
            required
            pattern="(0[1-9]|1[0-2])\/\d{2}"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">CVC</label>
        <input
            v-model="cvc"
            type="text"
            placeholder="123"
            class="w-full border rounded p-2"
            required
            pattern="\d{3}"
        />
      </div>
    </div>

    <button
        type="submit"
        class="w-full bg-accent text-white py-2 rounded hover:bg-green-700"
    >
      Confirm Payment
    </button>
  </form>
</template>

<script>
import PaymentService from '@/services/payments.js';

export default {
  name: 'PaymentForm',
  props: {
    orderId: { type: Number, required: true },
    amount:  { type: Number, required: true }
  },
  data() {
    return {
      cardNumber: '',
      expiry: '',
      cvc: ''
    };
  },
  methods: {
    async submit() {
      try {
        const payload = {
          orderId:       this.orderId,
          amount:        this.amount,
          paymentDate:   new Date().toISOString(),
          status:        'COMPLETED',
          cardNumber:    this.cardNumber.trim(),
          expiry:        this.expiry.trim(),
          cvc:           this.cvc.trim()
        };
        const res = await PaymentService.create(payload);
        // emit the full PaymentResponse so parent can check res.status
        this.$emit('submitted', res);
      } catch (e) {
        this.$toast.error(e.response?.data?.message || 'Payment failed');
      }
    }
  }
};
</script>
