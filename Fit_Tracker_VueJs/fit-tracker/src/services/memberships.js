import axios from './axios';

const MembershipService = {
    async getAll() {
        const { data } = await axios.get('/memberships');
        return data;
    },

    async getById(id) {
        const { data } = await axios.get(`/memberships/${id}`);
        return data;
    },

    async create(payload) {
        const { data } = await axios.post('/memberships', payload);
        return data;
    },

    async update(id, payload) {
        const { data } = await axios.put(`/memberships/${id}`, payload);
        return data;
    },

    async delete(id) {
        await axios.delete(`/memberships/${id}`);
    }
};

export default MembershipService;
