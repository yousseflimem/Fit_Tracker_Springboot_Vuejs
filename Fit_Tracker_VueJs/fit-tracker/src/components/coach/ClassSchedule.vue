<template>
  <div class="bg-white p-6 rounded shadow-md ml-64 mt-6">
    <h2 class="text-xl font-bold text-primary mb-4">Class Schedule</h2>
    <div v-if="sessions.length">
      <div
          v-for="s in sessions"
          :key="s.id"
          class="mb-4 border-b pb-2"
      >
        <p class="font-semibold">
          {{ formatDate(s.startTime) }} – {{ formatDate(s.endTime) }}
        </p>
        <p class="text-sm text-gray-500">Location: {{ s.location }}</p>
      </div>
    </div>
    <p v-else class="text-gray-600">No upcoming sessions.</p>
  </div>
</template>

<script>
import ClassService from '@/services/classes.js';

export default {
  name: 'ClassSchedule',
  data() {
    return {
      sessions: []
    };
  },
  async created() {
    try {
      const userId = this.$store.getters.userId;
      // assuming your backend returns sessions in classes/by-coach
      const resp = await ClassService.getByCoach(userId, { page: 0, size: 100 });
      // flatten all sessions from each class
      this.sessions = resp.content.flatMap(c => c.sessions || []);
    } catch {
      this.$toast.open({ message: 'Failed to load schedule', type: 'error' });
    }
  },
  methods: {
    formatDate(dt) {
      return new Date(dt).toLocaleString();
    }
  }
};
</script>
