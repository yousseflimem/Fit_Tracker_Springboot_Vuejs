<template>
  <div class="border rounded-lg p-2 shadow hover:shadow-md transition w-40">
    <img
        :src="workout.imageUrls?.[0] || placeholder"
        alt="Workout"
        class="w-full h-24 object-cover rounded"
    />
    <h3 class="mt-1 text-sm font-semibold truncate" :title="workout.name">{{ workout.name }}</h3>
    <p class="text-xs text-gray-600 truncate" :title="workout.category">{{ workout.category }}</p>
    <div class="mt-2 flex justify-between items-center text-xs">
      <router-link
          :to="{ name: 'WorkoutDetail', params: { id: workout.id } }"
          class="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600"
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
      placeholder: 'https://via.placeholder.com/150'
    };
  }
};
</script>
