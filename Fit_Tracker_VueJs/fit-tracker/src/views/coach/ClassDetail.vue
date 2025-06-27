<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">{{ classItem.name }}</h1>
    <div class="bg-white p-6 rounded shadow-md mb-6">
      <img :src="classItem.imageUrls[0] || 'https://via.placeholder.com/600'" alt="Class" class="w-full h-64 object-cover rounded mb-4" />
      <p class="text-gray-600 mb-2">Category: {{ classItem.category }}</p>
      <p class="text-gray-600 mb-2">Duration: {{ classItem.durationInMinutes }} minutes</p>
      <p class="text-gray-700">{{ classItem.description || 'No description available.' }}</p>
    </div>
    <ClassSchedule :sessions="classItem.sessions || []" />
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';
import ClassSchedule from '@/components/coach/ClassSchedule.vue';

export default {
  components: { ClassSchedule },
  data() {
    return {
      classItem: {},
    };
  },
  async created() {
    try {
      const response = await ClassService.getById(this.$route.params.id);
      this.classItem = response.data;
    } catch (error) {
      this.$toast.error('Failed to load class');
      this.$router.push('/coach/my-classes');
    }
  },
};
</script>