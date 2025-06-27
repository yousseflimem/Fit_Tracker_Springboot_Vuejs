import axios from './axios';

const AuthService = {
    async login({ username, password }) {
        const { data } = await axios.post('/auth/authenticate', { username, password });

        const user = {
            token: data.token,
            id: data.userId,
            username: data.username,
            role: data.role // Directly use the role from response
        };

        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },


    async register({ username, password, email }) {
        try {
            const { data } = await axios.post('/auth/register', { username, password, email });
            return data;
        } catch (error) {
            // Handle validation errors from backend
            const message = error.response?.data?.message || 'Registration failed';
            throw new Error(message);
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;
