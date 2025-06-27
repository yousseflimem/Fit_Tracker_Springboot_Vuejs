<template>
  <div class="overflow-x-auto p-6 bg-white shadow rounded">
    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="py-2 px-4 text-left">ID</th>
        <th class="py-2 px-4 text-left">User</th>
        <th class="py-2 px-4 text-left">Workout ID</th>
        <th class="py-2 px-4 text-left">Rating</th>
        <th class="py-2 px-4 text-left">Comment</th>
        <th class="py-2 px-4 text-left">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in reviews" :key="r.id" class="border-t">
        <td class="py-2 px-4">{{ r.id }}</td>
        <td class="py-2 px-4">{{ r.username }}</td>
        <td class="py-2 px-4">{{ r.workoutId }}</td>
        <td class="py-2 px-4">{{ r.rating }}</td>
        <td class="py-2 px-4">{{ r.comment }}</td>
        <td class="py-2 px-4">
          <button
              @click="$emit('delete', r.id)"
              class="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ReviewTable',
  props: {
    reviews: {
      type: Array,
      required: true
    }
  }
};
</script>
