import axios from 'axios';
import store from '@/store';
import router from '@/router';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 10000
});

instance.interceptors.request.use(config => {
    store.commit('SET_LOADING', true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

instance.interceptors.response.use(
    response => {
        store.commit('SET_LOADING', false);
        return response;
    },
    error => {
        store.commit('SET_LOADING', false);

        if (!error.response) {
            store.dispatch('showToast', {
                message: 'Network Error - Please check your internet connection',
                type: 'error'
            });
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        if (status === 401) {
            store.dispatch('logout');
            if (router.currentRoute.path !== '/login') {
                router.replace('/login');
            }
        } else if (status === 400) {
            const errors = data.errors || [];
            errors.forEach(err => {
                store.dispatch('showToast', {
                    message: `${err.field}: ${err.defaultMessage}`,
                    type: 'error'
                });
            });
        } else {
            store.dispatch('showToast', {
                message: data?.message || 'An unexpected error occurred',
                type: 'error'
            });
        }

        return Promise.reject(error);
    }
);

export default instance;