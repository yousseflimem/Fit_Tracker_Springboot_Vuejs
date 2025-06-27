<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">My Bookings</h1>

    <!-- BookingForm for create/edit -->
    <BookingForm
        v-if="showForm"
        :booking="selectedBooking"
        @submitted="fetchBookings"
        class="mb-6"
    />

    <!-- List of bookings -->
    <BookingList
        :bookings="bookings"
        @edit="editBooking"
        @delete="deleteBooking"
    />
  </div>
</template>

<script>
import BookingForm from '@/components/user/BookingForm.vue';
import BookingList from '@/components/user/BookingList.vue';
import BookingService from '@/services/bookings.js';

export default {
  components: {
    BookingForm,
    BookingList
  },
  data() {
    return {
      bookings: [],
      showForm: false,
      selectedBooking: null
    };
  },
  async created() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        // fetch all bookings for current user
        this.bookings = await BookingService.getByUser(this.$store.getters.userId);
        // reset form state
        this.showForm = false;
        this.selectedBooking = null;
      } catch (error) {
        this.$toast.error('Failed to load bookings');
      }
    },
    editBooking(booking) {
      this.selectedBooking = booking;
      this.showForm = true;
    },
    async deleteBooking(id) {
      try {
        await BookingService.delete(id);
        this.$toast.success('Booking cancelled');
        await this.fetchBookings();
      } catch (error) {
        this.$toast.error('Failed to cancel booking');
      }
    }
  }
};
</script>
