<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-6">User Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Active Bookings -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold text-primary">Active Bookings</h3>
        <p class="text-2xl text-gray-700">{{ stats.activeBookings }}</p>
        <router-link to="/user/bookings" class="text-accent hover:underline mt-2 inline-block">View Bookings</router-link>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold text-primary">Recent Orders</h3>
        <p class="text-2xl text-gray-700">{{ stats.recentOrders }}</p>
        <router-link to="/user/orders" class="text-accent hover:underline mt-2 inline-block">View Orders</router-link>
      </div>

      <!-- Membership Status -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold text-primary">Membership Status</h3>
        <p class="text-2xl text-gray-700">{{ stats.membershipStatus || 'None' }}</p>
        <router-link to="/memberships" class="text-accent hover:underline mt-2 inline-block">Manage Membership</router-link>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/cart" class="bg-accent text-white p-4 rounded text-center hover:bg-green-700">
        🛒 View Cart
      </router-link>
      <router-link to="/checkout" class="bg-accent text-white p-4 rounded text-center hover:bg-green-700">
        💳 Checkout
      </router-link>
      <router-link to="/user/payments" class="bg-accent text-white p-4 rounded text-center hover:bg-green-700">
        💰 Payments
      </router-link>
    </div>
  </div>
</template>

<script>
import BookingService from '@/services/bookings.js';
import OrderService from '@/services/orders.js';

export default {
  data() {
    return {
      stats: {
        activeBookings: 0,
        recentOrders: 0,
        membershipStatus: 'None',
      },
    };
  },
  async created() {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('/login');
      return;
    }

    try {
      const [bookingRes, orderRes] = await Promise.all([
        BookingService.getByUserId(this.$store.getters.userId, 0, 100),
        OrderService.getUserOrders({ page: 0, size: 100 }),
      ]);

      const bookings = bookingRes.data.content || [];
      const orders = orderRes.data.content || [];

      this.stats.activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
      this.stats.recentOrders = orders.length;

      const hasMembership = orders.some(order =>
          order.items.some(item => item.productName?.toLowerCase().includes('membership'))
      );

      this.stats.membershipStatus = hasMembership ? 'Active' : 'None';

    } catch (e) {
      this.$toast.error('Failed to load dashboard data');
    }
  }
};
</script>
