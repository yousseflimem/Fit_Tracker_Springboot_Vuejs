<template>
  <div class="bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col">
    <!-- Image Carousel -->
    <div class="relative mb-4">
      <div class="flex overflow-x-auto space-x-2 snap-x snap-mandatory scrollbar-hide">
        <img
            v-for="(url, index) in gymClass.imageUrls"
            :key="index"
            :src="url"
            alt="Class Image"
            class="w-full h-32 object-cover flex-shrink-0 snap-start rounded"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="flex-1">
      <h3 class="text-xl font-semibold mb-2">{{ gymClass.title }}</h3>
      <p class="text-gray-600 text-sm"><strong>Coach:</strong> {{ gymClass.coachName }}</p>
      <p class="text-gray-600 text-sm"><strong>Start:</strong> {{ formatDate(gymClass.startTime) }}</p>
      <p class="text-gray-600 text-sm"><strong>Duration:</strong> {{ gymClass.duration }} min</p>
    </div>

    <!-- Actions -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
          @click="$emit('edit', gymClass)"
          class="flex-1 bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
          @click="$emit('delete', gymClass)"
          class="flex-1 bg-red-500 text-white text-sm py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
      <button
          @click="$emit('view-details', gymClass.id)"
          class="flex-1 bg-gray-300 text-gray-800 text-sm py-1 rounded hover:bg-gray-400"
      >
        Details
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminClassCard',
  props: {
    gymClass: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dt) {
      return dt ? new Date(dt).toLocaleString() : 'N/A';
    }
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
