// src/services/payments.js
import axios from './axios';

// Base URL is /api/payments to match your @RequestMapping("/api/payments")
const API = '/payments';

export default {
    // Create a payment – now sends all DTO fields
    async create(payload) {
        const res = await axios.post(API, payload);
        return res.data;  // <-- this is your PaymentResponse, with .status
    },

    // Get payment by ID
    async getById(id) {
        const res = await axios.get(`${API}/${id}`);
        return res.data;
    },

    // User’s payments
    async getUserPayments(page = 0, size = 10, userId = null) {
        const params = { page, size };
        if (userId) params.userId = userId;  // admin case
        const res = await axios.get(`${API}/user`, { params });
        return res.data;
    },

    // Admin: all payments
    async getAll(page = 0, size = 10) {
        const res = await axios.get(API, { params: { page, size } });
        return res.data;
    },

    // Update payment (admin or owner)
    async update(id, payload) {
        // payload same shape as create
        const res = await axios.put(`${API}/${id}`, payload);
        return res.data;
    },

    // Delete payment
    async delete(id) {
        await axios.delete(`${API}/${id}`);
    }
};
