<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'New' }} Product</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block mb-1">Name</label>
        <input v-model="form.name" class="w-full border p-2 rounded" required />
      </div>

      <!-- Category -->
      <div>
        <label class="block mb-1">Category</label>
        <input v-model="form.category" class="w-full border p-2 rounded" required />
      </div>

      <!-- Description -->
      <div>
        <label class="block mb-1">Description</label>
        <textarea v-model="form.description" class="w-full border p-2 rounded" rows="3"></textarea>
      </div>

      <!-- Price -->
      <div>
        <label class="block mb-1">Price</label>
        <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            class="w-full border p-2 rounded"
            required
        />
      </div>

      <!-- Stock -->
      <div>
        <label class="block mb-1">Stock</label>
        <input
            v-model.number="form.stock"
            type="number"
            class="w-full border p-2 rounded"
            required
        />
      </div>

      <!-- Image URLs: 5 separate fields -->
      <div>
        <label class="block mb-1">Image URL 1</label>
        <input v-model="form.imageUrls[0]" type="url" class="w-full border p-2 rounded" placeholder="https://example.com/img1.jpg" />
      </div>
      <div>
        <label class="block mb-1">Image URL 2</label>
        <input v-model="form.imageUrls[1]" type="url" class="w-full border p-2 rounded" placeholder="https://example.com/img2.jpg" />
      </div>
      <div>
        <label class="block mb-1">Image URL 3</label>
        <input v-model="form.imageUrls[2]" type="url" class="w-full border p-2 rounded" placeholder="https://example.com/img3.jpg" />
      </div>
      <div>
        <label class="block mb-1">Image URL 4</label>
        <input v-model="form.imageUrls[3]" type="url" class="w-full border p-2 rounded" placeholder="https://example.com/img4.jpg" />
      </div>
      <div>
        <label class="block mb-1">Image URL 5</label>
        <input v-model="form.imageUrls[4]" type="url" class="w-full border p-2 rounded" placeholder="https://example.com/img5.jpg" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 pt-4">
        <button @click="$emit('cancel')" type="button" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-accent text-white rounded">
          {{ isEdit ? 'Save' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import ProductService from '@/services/products.js';

export default {
  props: { product: { type: Object, default: null } },
  data() {
    return {
      form: {
        name: '',
        category: '',
        description: '',
        price: null,
        stock: null,
        imageUrls: ['', '', '', '', '']
      }
    };
  },
  computed: {
    isEdit() {
      return !!this.product;
    }
  },
  created() {
    if (this.isEdit) {
      this.form = {
        name: this.product.name,
        category: this.product.category,
        description: this.product.description || '',
        price: this.product.price,
        stock: this.product.stock,
        imageUrls: [
          this.product.imageUrls[0] || '',
          this.product.imageUrls[1] || '',
          this.product.imageUrls[2] || '',
          this.product.imageUrls[3] || '',
          this.product.imageUrls[4] || ''
        ]
      };
    }
  },
  methods: {
    async onSubmit() {
      const urls = this.form.imageUrls
          .map(u => u.trim())
          .filter(u => u);
      if (!urls.length) {
        return alert('Provide at least one image URL');
      }

      const payload = {
        name: this.form.name.trim(),
        category: this.form.category.trim(),
        description: this.form.description.trim() || null,
        price: parseFloat(this.form.price),
        stock: parseInt(this.form.stock),
        imageUrls: urls
      };

      try {
        if (this.isEdit) {
          await ProductService.update(this.product.id, payload);
        } else {
          await ProductService.create(payload);
        }
        this.$emit('submitted');
      } catch (e) {
        alert(e.message);
      }
    }
  }
};
</script>
