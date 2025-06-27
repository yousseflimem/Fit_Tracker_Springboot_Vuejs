<template>
  <form @submit.prevent="submit" class="grid gap-4 bg-white p-6 rounded shadow-md max-w-md mx-auto">
    <!-- Class selector -->
    <div>
      <label for="classId" class="block text-gray-700">Class</label>
      <select
          v-model.number="form.classId"
          id="classId"
          class="w-full p-2 border rounded"
          required
      >
        <option disabled value="">Select a class</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.title }} — {{ formatDate(c.startTime) }}
        </option>
      </select>
    </div>

    <!-- Booking date/time picker -->
    <div>
      <label for="bookingDate" class="block text-gray-700">Booking Date</label>
      <input
          v-model="form.bookingDate"
          type="datetime-local"
          id="bookingDate"
          class="w-full p-2 border rounded"
          :min="minDateTime"
      />
    </div>

    <div class="flex justify-end">
      <button
          type="submit"
          class="bg-accent text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          :disabled="!form.classId"
      >
        {{ isEdit ? 'Update' : 'Book' }}
      </button>
    </div>
  </form>
</template>

<script>
import BookingService from '@/services/bookings.js';
import ClassService   from '@/services/classes.js';
import { mapGetters } from 'vuex';

export default {
  name: 'BookingForm',
  props: {
    bookingData: { type: Object, default: null }
  },
  data() {
    return {
      classes: [],
      form: {
        classId:    null,
        bookingDate: ''
      }
    };
  },
  computed: {
    ...mapGetters(['userId']),
    isEdit() {
      return !!this.bookingData;
    },
    // Minimum datetime is now, so user can't pick a past date
    minDateTime() {
      return new Date().toISOString().slice(0, 16);
    }
  },
  async created() {
    // 1) Load classes for the dropdown
    try {
      const resp = await ClassService.getClasses({ page: 0, size: 100 });
      this.classes = resp.content;
    } catch (err) {
      this.$toast.error('Failed to load classes');
    }

    // 2) If editing, prefill form
    if (this.isEdit) {
      this.form.classId = this.bookingData.classId;
      this.form.bookingDate = this.bookingData.bookingDate
          ? new Date(this.bookingData.bookingDate).toISOString().slice(0, 16)
          : '';
    }
  },
  methods: {
    formatDate(dt) {
      return new Date(dt).toLocaleString();
    },
    async submit() {
      try {
        // Build payload: include userId from the store
        const payload = {
          userId:      this.userId,
          classId:     this.form.classId,
          bookingDate: this.form.bookingDate
              ? new Date(this.form.bookingDate).toISOString()
              : null
        };

        if (this.isEdit) {
          await BookingService.update(this.bookingData.id, payload);
          this.$emit('updated');
          this.$toast.success('Booking updated');
        } else {
          await BookingService.create(payload);
          this.$emit('created');
          this.$toast.success('Booked successfully');
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Booking failed';
        this.$toast.error(msg);
      }
    }
  }
};
</script>
