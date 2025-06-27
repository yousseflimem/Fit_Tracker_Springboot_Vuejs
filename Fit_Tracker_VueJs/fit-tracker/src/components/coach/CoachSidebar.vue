<template>
  <aside class="w-64 bg-primary text-white h-screen fixed">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-6">Coach Dashboard</h2>
      <nav>
        <ul class="space-y-2">
          <li>
            <router-link
                to="/coach/dashboard"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >Dashboard</router-link>
          </li>
          <li>
            <router-link
                to="/coach/my-classes"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >My Classes</router-link>
          </li>
          <li>
            <router-link
                to="/coach/my-workouts"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >My Workouts</router-link>
          </li>
          <li>
            <router-link
                to="/coach/manage-reviews"
                class="block p-2 rounded hover:bg-accent"
                active-class="bg-accent"
            >Manage Reviews</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CoachSidebar'
};
</script>
