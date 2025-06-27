<template>
  <div class="space-y-4">
    <div
        v-for="r in reviews"
        :key="r.id"
        class="bg-white p-4 rounded shadow flex justify-between"
    >
      <div>
        <p class="font-semibold text-primary">{{ r.username }}</p>
        <p class="text-gray-700">{{ r.comment }}</p>
      </div>
      <button
          v-if="r.userId === userId"
          @click="$emit('delete', r.id)"
          class="text-red-500 hover:underline"
      >
        Delete
      </button>
    </div>

    <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="page => $emit('page-changed', page)"
    />
  </div>
</template>

<script>
import Pagination from './Pagination.vue';
import ReviewService from '@/services/reviews.js';

export default {
  name: 'ReviewList',
  components: { Pagination },
  props: {
    reviews:       { type: Array, required: true },
    currentPage:   { type: Number, required: true },
    totalPages:    { type: Number, required: true },
    workoutId:     { type: Number, default: null }, // optional if you need it
  },
  computed: {
    userId() {
      const u = JSON.parse(localStorage.getItem('user'));
      return u?.id;
    }
  },

};
</script>
