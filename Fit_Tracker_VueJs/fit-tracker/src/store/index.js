import Vue from 'vue';
import Vuex from 'vuex';
import AuthService from '@/services/auth';
import router from '@/router';
import UserService from "@/services/users";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        user: JSON.parse(localStorage.getItem('user')) || null,
        cart: JSON.parse(localStorage.getItem('cart')) || []
    },
    getters: {
        currentUser: state => state.user,
        isAuthenticated: state => !!state.user?.token,
        userRole: state => state.user?.role,
        userId: state => state.user?.id,
        isLoading: state => state.isLoading,
        cartItems: state => state.cart,
        cartTotal: state => state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    },
    mutations: {

        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_USER(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        CLEAR_AUTH(state) {
            state.user = null;
            localStorage.removeItem('user');
        },
        ADD_TO_CART(state, { product, quantity }) {
            const item = state.cart.find(i => i.product.id === product.id);
            if (item) item.quantity += quantity;
            else state.cart.push({ product, quantity });
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        UPDATE_CART_ITEM(state, { productId, quantity }) {
            state.cart = state.cart
                .map(i => i.product.id === productId ? { ...i, quantity } : i)
                .filter(i => i.quantity > 0);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        REMOVE_FROM_CART(state, productId) {
            state.cart = state.cart.filter(i => i.product.id !== productId);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        CLEAR_CART(state) {
            state.cart = [];
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }
    },
    actions: {
        async login({ commit }, creds) {
            try {
                const user = await AuthService.login(creds);
                commit('SET_USER', user);
                return user;
            } catch (error) {
                throw error;
            }
        },
        async fetchUsers({ commit }) {
            commit('SET_LOADING', true);
            try {
                const users = await UserService.getAll();
                return users;
            } catch (error) {
                this.dispatch('showToast', {
                    message: 'Failed to load users: ' + error.message,
                    type: 'error'
                });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async refreshUser({ commit, state }) {
            try {
                if (!state.user) return;
                const userData = await UserService.getById(state.user.id);
                commit('SET_USER', {
                    ...state.user,
                    ...userData
                });
            } catch (error) {
                this.dispatch('showToast', {
                    message: 'Failed to refresh user data',
                    type: 'error'
                });
            }
        },
        logout({ commit }) {
            AuthService.logout();
            commit('CLEAR_AUTH');
            router.push('/login');
        },
        showToast({ commit }, { message, type = 'error', duration = 3000 }) {
            Vue.$toast(message, {
                type: type.toLowerCase(),
                timeout: duration,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: 'button',
                icon: true,
                rtl: false
            });
        },
        addToCart({ commit }, payload) { commit('ADD_TO_CART', payload); },
        updateCartItem({ commit }, payload) { commit('UPDATE_CART_ITEM', payload); },
        removeFromCart({ commit }, id) { commit('REMOVE_FROM_CART', id); },
        clearCart({ commit }) { commit('CLEAR_CART'); }
    }
});