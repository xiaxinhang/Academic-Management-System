import { createRouter, createWebHistory } from "vue-router";
import { useEduStore } from "../stores/edu";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import CoursesView from "../views/CoursesView.vue";
import StudentsView from "../views/StudentsView.vue";
import UsersView from "../views/UsersView.vue";
import EnrollmentsView from "../views/EnrollmentsView.vue";
import GradesView from "../views/GradesView.vue";
import LogsView from "../views/LogsView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView, meta: { auth: true } },
  { path: "/courses", component: CoursesView, meta: { auth: true } },
  { path: "/students", component: StudentsView, meta: { auth: true, admin: true } },
  { path: "/users", component: UsersView, meta: { auth: true, admin: true } },
  { path: "/enrollments", component: EnrollmentsView, meta: { auth: true } },
  { path: "/grades", component: GradesView, meta: { auth: true } },
  { path: "/logs", component: LogsView, meta: { auth: true, admin: true } }
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  const store = useEduStore();
  if (to.meta.auth && !store.isLoggedIn) return "/login";
  if (to.meta.admin && !store.isAdmin) return "/dashboard";
  if (to.path === "/login" && store.isLoggedIn) return "/dashboard";
  return true;
});

export default router;
