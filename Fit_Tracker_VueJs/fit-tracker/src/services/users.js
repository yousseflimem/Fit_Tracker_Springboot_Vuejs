import axios from './axios';

export default {
    getAll() {
        return axios.get('/users').then(res => res.data);
    },

    getById(userId) {
        return axios.get(`/users/${userId}`).then(res => res.data);
    },

    async create(userData) {
        try {
            const response = await axios.post('/users', {
                username: userData.username.trim(),
                email: userData.email.trim(),
                password: userData.password.trim(),
                role: userData.role,
                profileImageUrl: (userData.profileImageUrl || '').trim(),
                membershipId: userData.membershipId || null
            });
            return response.data;
        } catch (error) {
            const errorData = error.response?.data || {};
            throw new Error(
                Object.entries(errorData)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join('\n') || 'User creation failed'
            );
        }
    },

    update(userId, userData) {
        const payload = {
            username: userData.username,
            email: userData.email,
            role: userData.role,
            profileImageUrl: userData.profileImageUrl,
            membershipId: userData.membershipId || null
        };

        if (userData.password?.trim()) {
            payload.password = userData.password;
        }

        return axios.put(`/users/${userId}`, payload).then(res => res.data);
    },

    delete(userId) {
        return axios.delete(`/users/${userId}`);
    },

    getCoaches() {
        return axios.get('/users/coaches')
            .then(res => res.data);
    },
};