import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/utils/api'

import HomePage from '../pages/HomePage.vue'
import ArticleListPage from '../pages/ArticleListPage.vue'
import ArticlePage from '../pages/ArticlePage.vue'
import BookPage from '../pages/BookPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    { path: '/', component: HomePage },
    { path: '/articles', component: ArticleListPage },
    { path: '/articles/:slug', component: ArticlePage },
    { path: '/about', component: AboutPage },
    { path: '/book', component: BookPage },

    // Admin routes
    { path: '/admin', component: AdminLogin },
    {
      path: '/admin/dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next('/admin')
  } else {
    next()
  }
})
