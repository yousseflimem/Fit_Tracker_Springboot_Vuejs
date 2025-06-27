<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex flex-1">
      <AdminSidebar v-if="isAdmin && isAdminRoute" />
      <CoachSidebar v-if="isCoach && isCoachRoute" />
      <main :class="{ 'flex-1 p-6': true, 'ml-64': isAdmin && isAdminRoute || isCoach && isCoachRoute }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/shared/Navbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import CoachSidebar from '@/components/coach/CoachSidebar.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { Navbar, AdminSidebar, CoachSidebar },
  computed: {
    ...mapGetters(['userRole', 'isAuthenticated']),
    isAdmin() {
      return this.userRole === 'ADMIN';
    },
    isCoach() {
      return this.userRole === 'COACH';
    },
    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    },
    isCoachRoute() {
      return this.$route.path.startsWith('/coach');
    },
  },
  methods: {
    ...mapActions(['refreshUser']),
  },
  async created() {
    if (this.isAuthenticated) {
      try {
        await this.refreshUser();
      } catch (error) {
        this.$toast.error('Session expired, please log in again');
        this.$router.push('/login');
      }
    }
  },
};
</script>