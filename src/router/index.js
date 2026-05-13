import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Booking from '../views/Booking.vue'
import History from '../views/History.vue'
import AdminPanel from '../views/AdminPanel.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/lupa-kata-laluan', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/booking', name: 'Booking', component: Booking },
  { path: '/sejarah', name: 'History', component: History },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router