<template>
  <div class="space-y-4">
    <div
        v-for="b in bookings"
        :key="b.id"
        class="bg-white p-4 rounded shadow flex justify-between items-center"
    >
      <div>
        <h4 class="font-semibold text-primary">{{ b.classTitle }}</h4>
        <p class="text-gray-600">{{ formatDate(b.bookingDate) }}</p>
        <p class="text-sm text-gray-500">Status: {{ b.status }}</p>
      </div>
      <div class="space-x-2">
        <button
            @click="$emit('edit', b)"
            class="text-blue-500 hover:underline"
        >Edit</button>
        <button
            @click="$emit('delete', b.id)"
            class="text-red-600 hover:underline"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bookings: { type: Array, required: true }
  },
  methods: {
    formatDate(dt) { return new Date(dt).toLocaleString(); }
  }
};
</script>
