import axios from './axios';

const ClassService = {
    async search({ keyword = '', page = 0, size = 10 } = {}) {
        const { data } = await axios.get('/classes/search', { params: { keyword, page, size } });
        return data;
    },

    async getById(id) {
        const { data } = await axios.get(`/classes/${id}`);
        return data;
    },

    async getByCoach(coachId, { page = 0, size = 10 } = {}) {
        const { data } = await axios.get(`/classes/by-coach/${coachId}`, { params: { page, size } });
        return data;
    },

    async create(classPayload) {
        const { data } = await axios.post('/classes', classPayload);
        return data;
    },

    async update(id, classPayload) {
        const { data } = await axios.put(`/classes/${id}`, classPayload);
        return data;
    },

    async delete(id) {
        await axios.delete(`/classes/${id}`);
    }
};

export default ClassService;
