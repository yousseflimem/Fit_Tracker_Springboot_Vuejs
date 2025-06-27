<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">{{ gymClass?.title || 'Class Details' }}</h1>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="bg-white p-6 rounded shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Class details -->
        <div>
          <h2 class="text-xl font-semibold text-primary mb-2">Class Details</h2>
          <p><strong>Category:</strong> {{ gymClass.category || 'N/A' }}</p>
          <p><strong>Description:</strong> {{ gymClass.description || 'N/A' }}</p>
          <p><strong>Start Time:</strong> {{ formatDate(gymClass.startTime) }}</p>
          <p><strong>End Time:</strong> {{ formatDate(gymClass.endTime) }}</p>
          <p><strong>Duration:</strong> {{ gymClass.duration || 'N/A' }} minutes</p>
          <p><strong>Capacity:</strong> {{ gymClass.capacity || 'N/A' }}</p>
          <p><strong>Coach:</strong> {{ gymClass.coachName || 'Unknown' }}</p>
        </div>

        <!-- Images -->
        <div>
          <h2 class="text-xl font-semibold text-primary mb-2">Images</h2>
          <div v-if="gymClass.imageUrls?.length" class="flex flex-wrap gap-2">
            <img
                v-for="(url, idx) in gymClass.imageUrls"
                :key="idx"
                :src="url"
                alt="Class Image"
                class="w-32 h-32 object-cover rounded"
            />
          </div>
          <p v-else class="text-gray-500">No images available</p>
        </div>
      </div>

      <!-- Workouts section -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold text-primary mb-2">Workouts Included</h2>
        <div v-if="workoutDetails.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WorkoutCard
              v-for="workout in workoutDetails"
              :key="workout.id"
              :workout="workout"
          />
        </div>
        <p v-else class="text-gray-500">No workouts assigned to this class.</p>
      </div>

      <!-- Booking section -->
      <div class="mt-6 text-center">
        <button
            v-if="isAuthenticated"
            @click="bookClass"
            class="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
          Book this class now
        </button>
        <p v-else class="text-red-500">
          Please
          <router-link to="/login" class="text-accent hover:underline">log in</router-link>
          to book this class.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import WorkoutService from '@/services/workouts.js';
import BookingService from '@/services/bookings.js';
import WorkoutCard from '@/components/user/WorkoutCard.vue';
import {mapGetters} from 'vuex';

export default {
  components: {WorkoutCard},
  data() {
    return {
      workoutDetails: [],
      gymClass: null,
      loading: false,
      error: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId']),

  },
  methods: {
    async fetchClass() {
      this.loading = true;
      this.error = null;
      try {
        this.gymClass = await ClassService.getById(this.$route.params.id);

        if (this.gymClass.workouts?.length) {
          const workoutIds = this.gymClass.workouts.map(w => (typeof w === 'object' ? w.id : w));
          this.workoutDetails = await Promise.all(
              workoutIds.map(id => WorkoutService.getById(id))
          );
        } else {
          this.workoutDetails = [];
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load class';
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dt) {
      const date = new Date(dt);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
    },
    async bookClass() {
      try {
        if (!this.userId) {
          this.$toast.error('Please login to book a class.');
          return;
        }

        // Compute now + 5 minutes
        const inFiveMinutes = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const payload = {
          userId:     this.userId,
          classId:    this.gymClass.id,
          bookingDate: inFiveMinutes
        };

        console.log('📤 booking payload:', payload);
        await BookingService.create(payload);

        this.$toast.success('Class booked successfully!');
        this.$router.push('/user/bookings');
      } catch (error) {
        console.error('Booking error response:', error.response?.data);
        const msg = error.response?.data?.message || 'Booking failed';
        this.$toast.error(msg);
      }
    }
  },
  created() {
    this.fetchClass();
  }
};
</script>
