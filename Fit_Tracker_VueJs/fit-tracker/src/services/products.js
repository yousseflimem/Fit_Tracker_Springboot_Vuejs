import axios from './axios';

const ProductService = {
    async search({ keyword = '', page = 0, size = 10 } = {}) {
        try {
            const r = await axios.get('/products', {
                params: { keyword: keyword.trim(), page, size }
            });
            return {
                content: r.data.content,
                totalPages: r.data.totalPages,
                currentPage: r.data.number
            };
        } catch (e) {
            return this.handleError(e, 'Failed to fetch products');
        }
    },

    async getLowStock({ threshold = 10, page = 0, size = 10 } = {}) {
        try {
            const r = await axios.get('/products/low-stock', {
                params: { threshold, page, size }
            });
            return {
                content: r.data.content,
                totalPages: r.data.totalPages,
                number: r.data.number
            };
        } catch (e) {
            return this.handleError(e, 'Failed to fetch low‑stock products');
        }
    },

    async updateStock(id, delta) {
        try {
            const r = await axios.put(`/products/${id}/stock`, null, {
                params: { quantity: delta }
            });
            return r.data;
        } catch (e) {
            return this.handleError(e, 'Failed to update stock');
        }
    },

    async setStock(id, stock) {
        try {
            const r = await axios.put(`/products/${id}/stock/set`, null, {
                params: { stock }
            });
            return r.data;
        } catch (e) {
            return this.handleError(e, 'Failed to set stock');
        }
    },

    async create(payload) {
        try {
            const r = await axios.post('/products', payload);
            return r.data;
        } catch (e) {
            return this.handleError(e, 'Failed to create product');
        }
    },

    async update(id, payload) {
        try {
            const r = await axios.put(`/products/${id}`, payload);
            this.cache.delete(id);
            return r.data;
        } catch (e) {
            return this.handleError(e, 'Failed to update product');
        }
    },

    async delete(id) {
        try {
            await axios.delete(`/products/${id}`);
            this.cache.delete(id);
            return true;
        } catch (e) {
            return this.handleError(e, 'Failed to delete product');
        }
    },

    cache: new Map(),

    async getById(id) {
        if (this.cache.has(id)) return this.cache.get(id);
        try {
            const r = await axios.get(`/products/${id}`);
            this.cache.set(id, r.data);
            return r.data;
        } catch (e) {
            return this.handleError(e, 'Product not found');
        }
    },

    handleError(e, msg) {
        console.error(e);
        const d = e.response?.data;
        const m = d?.errors?.join('\n') || d?.message || msg;
        throw new Error(m);
    }
};

export default ProductService;
