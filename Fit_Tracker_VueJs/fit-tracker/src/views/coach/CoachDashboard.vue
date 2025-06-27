<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">Coach Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold text-primary">Total Classes</h3>
        <p class="text-2xl text-gray-700">{{ stats.totalClasses }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold text-primary">Upcoming Sessions</h3>
        <p class="text-2xl text-gray-700">{{ stats.upcomingSessions }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';

export default {
  data() {
    return {
      stats: {
        totalClasses: 0,
        upcomingSessions: 0,
      },
    };
  },
  async created() {
    try {
      const response = await ClassService.getByCoachId(this.$store.getters.userId, 0, 100);
      const classes = response.data.content;
      this.stats.totalClasses = classes.length;
      this.stats.upcomingSessions = classes.reduce((sum, cls) => {
        return sum + (cls.sessions || []).filter(session => new Date(session.startTime) > new Date()).length;
      }, 0);
    } catch (error) {
      this.$toast.error('Failed to load dashboard');
    }
  },
};
</script>