import axios from './axios';
const API = '/orders';

export default {
    // Admin: get all orders
    async getAll(page = 0, size = 10) {
        const res = await axios.get(`${API}`, { params: { page, size } });
        return res.data;
    },

    // Get orders for current or specific user
    async getUserOrders({ userId = null, page = 0, size = 10 } = {}) {
        const url = userId
            ? `${API}/user?userId=${userId}&page=${page}&size=${size}`
            : `${API}/user?page=${page}&size=${size}`;
        const res = await axios.get(url);
        return res.data;
    },

    // Get order by ID
    async getById(id) {
        const res = await axios.get(`${API}/${id}`);
        return res.data;
    },

    // Create new order
    async create(payload) {
        const res = await axios.post(API, payload);
        return res.data;
    },

    // Update existing order
    async update(id, payload) {
        const res = await axios.put(`${API}/${id}`, payload);
        return res.data;
    },

    // Delete an order
    async delete(id) {
        await axios.delete(`${API}/${id}`);
    },

    // Cancel an order
    async cancel(id) {
        // hits PUT /api/orders/{id}/cancel (you'll need to add this endpoint in the backend)
        const res = await axios.put(`/orders/${id}/status`, { status: 'CANCELLED' });
        return res.data;
    },

    updateStatus(orderId, status) {
        return axios
            .put(`${API}/${orderId}/status`, { status })
            .then(res => res.data);
    }
};
