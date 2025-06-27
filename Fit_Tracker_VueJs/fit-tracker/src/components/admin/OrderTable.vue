<template>
  <div class="overflow-x-auto p-6 bg-white shadow rounded">
    <table class="w-full table-auto">
      <thead class="bg-gray-200">
      <tr>
        <th class="py-2 px-4 text-left">ID</th>
        <th class="py-2 px-4 text-left">User Email</th>
        <th class="py-2 px-4 text-left">Total</th>
        <th class="py-2 px-4 text-left">Status</th>
        <th class="py-2 px-4 text-left">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="o in orders" :key="o.id" class="border-t">
        <td class="py-2 px-4">{{ o.id }}</td>
        <td class="py-2 px-4">{{ o.userEmail }}</td>
        <td class="py-2 px-4">${{ o.totalAmount.toFixed(2) }}</td>
        <td class="py-2 px-4">{{ o.status }}</td>
        <td class="py-2 px-4 space-x-2">
          <button
              @click="$emit('update', o)"
              class="text-blue-500 hover:underline"
          >
            Update
          </button>
          <button
              @click="$emit('delete', o.id)"
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
  name: 'OrderTable',
  props: {
    orders: {
      type: Array,
      required: true
    }
  }
};
</script>
