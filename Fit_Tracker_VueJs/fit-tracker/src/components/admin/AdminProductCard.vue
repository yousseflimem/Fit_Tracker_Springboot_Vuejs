<template>
  <div class="border rounded-lg p-4 shadow hover:shadow-lg relative">
    <!-- actions -->
    <div class="absolute top-2 right-2 flex space-x-1">
      <button @click="$emit('edit', product)" class="p-1 bg-blue-500 text-white rounded">✎</button>
      <button @click="$emit('delete', product)" class="p-1 bg-red-500 text-white rounded">🗑</button>
    </div>

    <!-- all images -->
    <div class="mb-2 flex space-x-2 overflow-x-auto">
      <img
          v-for="(url, i) in product.imageUrls"
          :key="i"
          :src="url || placeholder"
          class="w-24 h-24 object-cover rounded flex-shrink-0"
      />
    </div>

    <h3 class="text-lg font-semibold">{{ product.name }}</h3>
    <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>

    <!-- stock controls -->
    <div class="mt-2 flex items-center justify-between">
      <span>Stock: {{ product.stock }}</span>
      <div class="flex space-x-1">
        <button @click="$emit('adjust-stock', product, -1)" class="px-2 py-1 bg-gray-200 rounded">−</button>
        <button @click="$emit('adjust-stock', product, +1)" class="px-2 py-1 bg-gray-200 rounded">+</button>
        <button @click="$emit('set-stock', product)" class="px-2 py-1 bg-gray-200 rounded">set</button>
      </div>
    </div>

    <button
        @click="$emit('view-details', product.id)"
        class="mt-3 w-full text-sm text-blue-600 hover:underline"
    >View Details</button>
  </div>
</template>

<script>
export default {
  props: { product: { type: Object, required: true } },
  data() {
    return {
      placeholder: 'https://via.placeholder.com/150'
    };
  }
};
</script>
