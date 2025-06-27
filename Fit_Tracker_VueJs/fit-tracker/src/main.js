import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/styles/tailwind.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.config.productionTip = false;

const toastOptions = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true
};

Vue.use(Toast, toastOptions);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');