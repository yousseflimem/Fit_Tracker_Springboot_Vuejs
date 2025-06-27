<template>
  <div class="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white max-w-xs mx-auto sm:max-w-full sm:w-64">
    <img
        :src="gymClass.imageUrls?.[0] || placeholder"
        alt="Class Image"
        class="w-full h-40 object-cover rounded"
    />
    <h3 class="mt-2 text-lg font-semibold text-primary">{{ gymClass.title }}</h3>
    <p class="text-gray-600 text-sm mb-1">Coach: {{ gymClass.coachName || 'Unknown' }}</p>
    <p class="text-gray-500 text-sm mb-4 truncate" :title="gymClass.schedule || 'Schedule TBD'">{{ gymClass.schedule || 'Schedule TBD' }}</p>

    <div class="flex flex-col sm:flex-row gap-2">
      <router-link
          :to="{ name: 'ClassDetail', params: { id: gymClass.id } }"
          class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm text-center flex-1"
      >
        View Details
      </router-link>

      <button
          @click="bookClass"
          class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm flex-1"
      >
        Book
      </button>
    </div>
  </div>
</template>

<script>
import BookingService from '@/services/bookings.js';

export default {
  props: {
    gymClass: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      placeholder: 'https://via.placeholder.com/300'
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    async bookClass() {
      if (!this.isAuthenticated) {
        this.$toast.error('You must be logged in to book a class.');
        this.$router.push('/login');
        return;
      }
      try {
        // No need to send userId explicitly if backend uses token-based auth
        await BookingService.create({ classId: this.gymClass.id });
        this.$toast.success('Class booked successfully!');
      } catch (err) {
        // Show actual error message if available
        const msg = err.response?.data?.message || 'Booking failed. Please try again.';
        this.$toast.error(msg);
      }
    }
  }
};
</script>
