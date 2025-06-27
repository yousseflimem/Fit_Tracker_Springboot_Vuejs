<template>
  <div class="flex justify-center py-4">
    <button
        class="px-3 py-1 mx-1 border rounded hover:bg-gray-100"
        :disabled="currentPage===0"
        @click="$emit('page-changed', currentPage-1)"
    >Prev</button>

    <button
        v-for="n in totalPages"
        :key="n"
        class="px-3 py-1 mx-1 rounded"
        :class="n-1===currentPage ? 'bg-accent text-white' : 'border hover:bg-gray-100'"
        @click="$emit('page-changed', n-1)"
    >{{ n }}</button>

    <button
        class="px-3 py-1 mx-1 border rounded hover:bg-gray-100"
        :disabled="currentPage>=totalPages-1"
        @click="$emit('page-changed', currentPage+1)"
    >Next</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    totalPages:  { type: Number, required: true }
  }
};
</script>
