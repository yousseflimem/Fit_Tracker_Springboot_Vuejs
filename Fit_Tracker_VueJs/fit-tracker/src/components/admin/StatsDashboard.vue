<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 ml-64 p-6">
    <div class="bg-white p-6 rounded shadow-md">
      <h3 class="text-lg font-semibold text-primary">Total Users</h3>
      <p class="text-2xl">{{ stats.totalUsers }}</p>
    </div>
    <div class="bg-white p-6 rounded shadow-md">
      <h3 class="text-lg font-semibold text-primary">Total Orders</h3>
      <p class="text-2xl">{{ stats.totalOrders }}</p>
    </div>
    <div class="bg-white p-6 rounded shadow-md">
      <h3 class="text-lg font-semibold text-primary">Total Revenue</h3>
      <p class="text-2xl">${{ stats.totalRevenue.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>
import UserService  from '@/services/users.js';
import OrderService from '@/services/orders.js';

export default {
  data() {
    return { stats: { totalUsers:0, totalOrders:0, totalRevenue:0 } };
  },
  async created() {
    try {
      const u = await UserService.getAll({ page:0,size:1 });
      const o = await OrderService.getAll({ page:0,size:1000 });
      this.stats.totalUsers    = u.totalElements;
      this.stats.totalOrders   = o.totalElements;
      this.stats.totalRevenue  = o.content.reduce((sum, x) => sum + x.total, 0);
    } catch {
      this.$toast.open({ message:'Failed to load stats', type:'error' });
    }
  }
};
</script>
