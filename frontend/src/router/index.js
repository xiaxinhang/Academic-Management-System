import { createRouter, createWebHistory } from "vue-router";
import { useEduStore } from "../stores/edu";
import LoginView from "../views/LoginView.vue";
import CoursesView from "../views/CoursesView.vue";
import EnrollmentsView from "../views/EnrollmentsView.vue";
import GradesView from "../views/GradesView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/", redirect: "/courses" },
  { path: "/courses", component: CoursesView, meta: { auth: true } },
  { path: "/enrollments", component: EnrollmentsView, meta: { auth: true } },
  { path: "/grades", component: GradesView, meta: { auth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const store = useEduStore();
  if (to.meta.auth && !store.isLoggedIn) return "/login";
  if (to.path === "/login" && store.isLoggedIn) return "/courses";
  return true;
});

export default router;
