import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../../modules/auth/stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../modules/auth/views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../../modules/auth/views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../../modules/dashboard/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard (Proteksi Hak Akses & Status Login)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Jika route memerlukan login dan user belum login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  // Jika route hanya untuk guest (login/register) dan user sudah login
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

export default router;

