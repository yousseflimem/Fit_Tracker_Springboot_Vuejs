<template>
  <aside class="w-64 bg-primary text-white h-screen fixed">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav>
        <ul class="space-y-2">
          <li>
            <router-link
                to="/admin/users"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Users
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/workouts"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Workouts
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/classes"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Classes
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/products"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Products
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/memberships"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Memberships
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/orders"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Orders
            </router-link>
            <router-link
                to="/admin/payments"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Payments
            </router-link>
          </li>
          <li>
            <router-link
                to="/admin/reviews"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >
              Reviews
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
};
</script>