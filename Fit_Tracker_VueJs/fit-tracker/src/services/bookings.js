import axios from './axios';

const BookingService = {
    async create(bookingData) {
        // POST to /api/bookings
        const { data } = await axios.post('/bookings', bookingData);
        return data;
    },

    async getAll({ page = 0, size = 10 } = {}) {
        const { data } = await axios.get('/bookings', { params: { page, size } });
        return data;
    },

    async getByUser(userId) {
        const { data } = await axios.get(`/bookings/user/${userId}`);
        return data;
    },

    async update(id, bookingData) {
        const { data } = await axios.put(`/bookings/${id}`, bookingData);
        return data;
    },

    async delete(id) {
        await axios.delete(`/bookings/${id}`);
    },

    async countByClass(classId) {
        const { data } = await axios.get(`/bookings/count/${classId}`);
        return data;
    }
};

export default BookingService;
