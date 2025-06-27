<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Manage Products</h1>

    <!-- Form Toggle -->
    <div class="mb-4">
      <button
          v-if="!showForm"
          @click="openForm(null)"
          class="bg-accent text-white px-4 py-2 rounded"
      >
        Create Product
      </button>
      <button
          v-else
          @click="showForm = false"
          class="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>

    <!-- Product Form -->
    <ProductForm
        v-if="showForm"
        :product="selected"
        @submitted="onSaved"
        @cancel="showForm = false"
    />

    <!-- Filters -->
    <div class="mb-4 flex items-center space-x-4">
      <input
          v-model="keyword"
          @input="onSearchInput"
          placeholder="Search…"
          class="border p-2 rounded flex-1"
      />
      <label class="flex items-center space-x-1">
        <input type="checkbox" v-model="lowStock" />
        <span>Low stock only</span>
      </label>
      <input
          v-if="lowStock"
          type="number"
          v-model.number="threshold"
          min="0"
          class="w-20 border p-2 rounded"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">Loading…</div>

    <!-- Empty -->
    <div v-else-if="products.length === 0" class="text-center py-8">
      No products found.
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AdminProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
          @edit="openForm"
          @delete="onDelete"
          @adjust-stock="onAdjust"
          @set-stock="onSet"
          @view-details="openDetails"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center space-x-2">
      <button
          :disabled="page === 0"
          @click="changePage(page - 1)"
          class="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <span>Page {{ page + 1 }} of {{ total }}</span>
      <button
          :disabled="page + 1 >= total"
          @click="changePage(page + 1)"
          class="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>

    <!-- Details Modal -->
    <Modal v-if="modalOpen" :title="detail.name" @close="modalOpen = false">
      <div class="space-y-4">
        <p><strong>Category:</strong> {{ detail.category }}</p>
        <p><strong>Price:</strong> ${{ detail.price.toFixed(2) }}</p>
        <p><strong>Stock:</strong> {{ detail.stock }}</p>
        <div class="flex space-x-2 overflow-x-auto">
          <img
              v-for="(u, i) in detail.imageUrls"
              :key="i"
              :src="u"
              class="w-32 h-32 object-cover rounded"
          />
        </div>
        <p v-if="detail.description">{{ detail.description }}</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import ProductForm from '@/components/admin/ProductForm.vue';
import AdminProductCard from '../../components/admin/AdminProductCard.vue';
import Modal from '@/components/shared/Modal.vue';
import ProductService from '@/services/products.js';

export default {
  components: { ProductForm, AdminProductCard, Modal },
  data() {
    return {
      products: [],
      loading: false,
      keyword: '',
      lowStock: false,
      threshold: 10,
      page: 0,
      total: 1,

      showForm: false,
      selected: null,

      modalOpen: false,
      detail: {}
    };
  },
  created() {
    this.fetchDebounced = debounce(this.fetch, 300);
    this.fetch();
  },
  watch: {
    lowStock() {
      this.page = 0;
      this.fetch();
    },
    threshold() {
      if (this.lowStock) {
        this.page = 0;
        this.fetch();
      }
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      try {
        let r;
        if (this.lowStock) {
          r = await ProductService.getLowStock({
            threshold: this.threshold,
            page: this.page,
            size: 9
          });
        } else {
          r = await ProductService.search({
            keyword: this.keyword,
            page: this.page,
            size: 9
          });
        }
        this.products = r.content;
        this.total = r.totalPages;
      } catch (e) {
        alert(e.message);
      } finally {
        this.loading = false;
      }
    },
    onSearchInput() {
      this.page = 0;
      this.fetchDebounced();
    },
    openForm(p = null) {
      this.selected = p ? { ...p } : null;
      this.showForm = true;
    },
    onSaved() {
      this.showForm = false;
      this.fetch();
    },
    async onDelete(p) {
      if (!confirm(`Delete ${p.name}?`)) return;
      try {
        await ProductService.delete(p.id);
        this.fetch();
      } catch (e) {
        alert(e.message);
      }
    },
    async onAdjust(p, d) {
      const prev = p.stock;
      p.stock += d;
      try {
        await ProductService.updateStock(p.id, d);
      } catch (e) {
        p.stock = prev;
        alert(e.message);
      }
    },
    async onSet(p) {
      const v = parseInt(prompt(`New stock for ${p.name}`, p.stock));
      if (isNaN(v)) return;
      const prev = p.stock;
      p.stock = v;
      try {
        await ProductService.setStock(p.id, v);
      } catch (e) {
        p.stock = prev;
        alert(e.message);
      }
    },
    openDetails(id) {
      ProductService.getById(id)
          .then((x) => {
            this.detail = x;
            this.modalOpen = true;
          })
          .catch((e) => alert(e.message));
    },
    changePage(n) {
      this.page = n;
      this.fetch();
    }
  }
};
</script>
