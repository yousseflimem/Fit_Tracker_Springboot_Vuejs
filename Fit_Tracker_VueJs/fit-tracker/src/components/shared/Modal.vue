<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-lg overflow-auto">
      <div class="flex justify-between items-center border-b px-4 py-2">
        <h3 class="font-semibold">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800">✕</button>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { title: String }
};
</script>
