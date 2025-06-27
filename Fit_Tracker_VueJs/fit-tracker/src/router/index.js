import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

// Shared
import Home           from '@/views/shared/Home.vue';
import Login          from '@/views/shared/Login.vue';
import Register       from '@/views/shared/Register.vue';
import NotFound       from '@/views/shared/NotFound.vue';
import Memberships    from '@/views/shared/Memberships.vue';

// User
import UserDashboard  from '@/views/user/Dashboard.vue';
import Workouts       from '@/views/user/Workouts.vue';
import WorkoutDetail  from '@/views/user/WorkoutDetail.vue';
import ClassDetail    from '@/views/user/ClassDetail.vue';
import Bookings       from '@/views/user/Bookings.vue';
import Cart           from '@/views/user/Cart.vue';
import Checkout       from '@/views/user/Checkout.vue';
import Orders         from '@/views/user/Orders.vue';
import OrderDetail    from '@/views/user/OrderDetail.vue';
import Payments       from '@/views/user/Payments.vue';
import Reviews        from '@/views/user/Reviews.vue';
import Products       from '@/views/user/Products.vue';
import ProductDetail  from '@/views/user/ProductDetail.vue';
import Classes        from '@/views/user/Classes.vue';

// Coach
import CoachDashboard   from '@/views/coach/CoachDashboard.vue';
import MyClasses        from '@/views/coach/MyClasses.vue';
import CoachClassDetail from '@/views/coach/ClassDetail.vue';
import ManageReviews    from '@/views/coach/ManageReviews.vue';

// Admin
import AdminUsers       from '@/views/admin/Users.vue';
import AdminWorkouts    from '@/views/admin/AdminWorkouts.vue';
import AdminClasses     from '@/views/admin/AdminClasses.vue';
import AdminProducts    from '@/views/admin/AdminProducts.vue';
import AdminMemberships from '@/views/admin/AdminMemberships.vue';
import AdminOrders      from '@/views/admin/AdminOrders.vue';
import AdminReviews     from '@/views/admin/AdminReviews.vue';
import AdminPayments    from "@/views/admin/AdminPayments.vue";

Vue.use(VueRouter);

const routes = [
    // Public
    { path: '/',            name: 'Home',          component: Home },
    { path: '/login',       name: 'Login',         component: Login },
    { path: '/register',    name: 'Register',      component: Register },
    { path: '/memberships', name: 'Memberships',   component: Memberships },
    { path: '/workouts',    name: 'Workouts',      component: Workouts },
    { path: '/classes',     name: 'Classes',       component: Classes },

    // Public Products
    { path: '/products',      name: 'Products',      component: Products },
    { path: '/products/:id',  name: 'ProductDetail', component: ProductDetail },

    // Top-level Cart & Checkout
    { path: '/cart',     name: 'Cart',     component: Cart,     meta: { requiresAuth: true } },
    { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },

    // User-scoped
    {
        path: '/user',
        component: { render: h => h('router-view') },
        meta: { requiresAuth: true, roles: ['USER','COACH','ADMIN'] },
        children: [
            { path: 'dashboard',   name: 'UserDashboard', component: UserDashboard },
            { path: 'workouts',    name: 'Workouts',      component: Workouts },
            { path: 'workout/:id', name: 'WorkoutDetail', component: WorkoutDetail },
            { path: 'class/:id',   name: 'ClassDetail',   component: ClassDetail },
            { path: 'classes',     name: 'Classes',       component: Classes },
            { path: 'bookings',    name: 'Bookings',      component: Bookings },
            { path: 'orders',      name: 'Orders',        component: Orders },
            { path: 'order/:id',   name: 'OrderDetail',   component: OrderDetail },
            { path: 'payments',    name: 'Payments',      component: Payments },
            { path: 'reviews',     name: 'Reviews',       component: Reviews },
            { path: 'products',    redirect: '/products' },
            { path: 'product/:id', name: 'UserProduct',   component: ProductDetail }
        ]
    },

    // Coach
    {
        path: '/coach',
        component: { render: h => h('router-view') },
        meta: { requiresAuth: true, roles: ['COACH','ADMIN'] },
        children: [
            { path: 'dashboard',      name: 'CoachDashboard',   component: CoachDashboard },
            { path: 'my-classes',     name: 'MyClasses',        component: MyClasses },
            { path: 'class/:id',      name: 'CoachClassDetail', component: CoachClassDetail },
            { path: 'manage-reviews', name: 'ManageReviews',    component: ManageReviews }
        ]
    },

    // Admin
    {
        path: '/admin',
        component: { render: h => h('router-view') },
        meta: { requiresAuth: true, roles: ['ADMIN'] },
        children: [
            { path: 'users',        name: 'AdminUsers',       component: AdminUsers },
            { path: 'workouts',     name: 'AdminWorkouts',    component: AdminWorkouts },
            { path: 'classes',      name: 'AdminClasses',     component: AdminClasses },
            { path: 'products',     name: 'AdminProducts',    component: AdminProducts },
            { path: 'memberships',  name: 'AdminMemberships', component: AdminMemberships },
            { path: 'orders',       name: 'AdminOrders',      component: AdminOrders },
            {path: 'payments',      name: 'AdminPayments',    component: AdminPayments },
            { path: 'reviews',      name: 'AdminReviews',     component: AdminReviews }
        ]
    },

    // 404
    { path: '*', name: 'NotFound', component: NotFound }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

// Auth guard (unchanged)
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!store.getters.isAuthenticated) {
            return next({ name: 'Login' });
        }
        const roles = to.matched.flatMap(r => r.meta.roles || []);
        if (roles.length && !roles.includes(store.getters.userRole)) {
            const dash = store.getters.userRole === 'ADMIN'
                ? 'AdminUsers'
                : store.getters.userRole === 'COACH'
                    ? 'CoachDashboard'
                    : 'UserDashboard';
            return next({ name: dash });
        }
    }
    next();
});

export default router;
