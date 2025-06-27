<template>
  <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
    <img
        :src="workout.imageUrls[0] || placeholder"
        alt="Workout"
        class="w-full h-40 object-cover rounded"
    />
    <h3 class="mt-2 text-lg font-semibold">{{ workout.name }}</h3>
    <p class="text-gray-600">{{ workout.category }}</p>
    <div class="mt-4 flex justify-between items-center">
      <router-link
          :to="{ name: 'WorkoutDetail', params: { id: workout.id } }"
          class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        View
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    workout: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      placeholder: 'https://via.placeholder.com/300'
    };
  }
};
</script>
