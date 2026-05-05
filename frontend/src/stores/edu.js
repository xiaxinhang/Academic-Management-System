import { defineStore } from "pinia";
import request from "../api/request";
import i18n from "../i18n";
const t = (key, args) => i18n.global.t(key, args);

export const useEduStore = defineStore("edu", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
    courses: [], coursesTotal: 0, coursesPage: 1, coursesPageSize: 8, coursesKeyword: "",
    courseOptions: [],
    students: [], users: [], enrollments: [], grades: [],
    dashboard: { courseCount: 0, studentCount: 0, enrollCount: 0, avgScore: 0 }, courseStats: [],
    logs: [], logsTotal: 0, logsPage: 1, logsPageSize: 10,
    errorMessage: "", successMessage: ""
  }),
  getters: { isAdmin: (s) => s.user?.role === "admin", isLoggedIn: (s) => Boolean(s.token) },
  actions: {
    setMessage(type, text) { if (type === "error") { this.errorMessage = text; this.successMessage = ""; } else { this.successMessage = text; this.errorMessage = ""; } },
    clearMessage() { this.errorMessage = ""; this.successMessage = ""; },
    async safeRun(fn) { try { this.clearMessage(); await fn(); } catch (e) { this.setMessage("error", e.message); } },
    async login(payload) { const { data } = await request.post("/auth/login", payload); this.token = data.token; this.user = data.user; localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); this.setMessage("success", t("msg.loginSuccess")); },
    logout() { this.token = ""; this.user = null; localStorage.removeItem("token"); localStorage.removeItem("user"); },

    async fetchDashboard() { const { data } = await request.get("/dashboard/summary"); this.dashboard = data; },
    async fetchCourseStats() { const { data } = await request.get("/dashboard/course-stats"); this.courseStats = data; },

    async fetchCourses() { const { data } = await request.get("/courses", { params: { page: this.coursesPage, pageSize: this.coursesPageSize, keyword: this.coursesKeyword } }); this.courses = data.list; this.coursesTotal = data.total; },
    async fetchCourseOptions() { const { data } = await request.get("/courses/options"); this.courseOptions = data; },
    async addCourse(payload) { await request.post("/courses", payload); this.setMessage("success", t("msg.addCourseSuccess")); await this.fetchCourses(); },
    async updateCourse(id, payload) { await request.put(`/courses/${id}`, payload); this.setMessage("success", t("msg.ok")); await this.fetchCourses(); },
    async deleteCourse(id) { await request.delete(`/courses/${id}`); this.setMessage("success", t("msg.deleteCourseSuccess")); await this.fetchCourses(); },

    async fetchStudents() { const { data } = await request.get("/students"); this.students = data; },
    async addStudent(payload) { await request.post("/students", payload); this.setMessage("success", t("msg.ok")); await this.fetchStudents(); },
    async updateStudent(id, payload) { await request.put(`/students/${id}`, payload); this.setMessage("success", t("msg.ok")); await this.fetchStudents(); },
    async deleteStudent(id) { await request.delete(`/students/${id}`); this.setMessage("success", t("msg.ok")); await this.fetchStudents(); },

    async fetchUsers() { const { data } = await request.get("/users"); this.users = data; },
    async addUser(payload) { await request.post("/users", payload); this.setMessage("success", t("msg.ok")); await this.fetchUsers(); },
    async updateUser(id, payload) { await request.put(`/users/${id}`, payload); this.setMessage("success", t("msg.ok")); await this.fetchUsers(); },
    async deleteUser(id) { await request.delete(`/users/${id}`); this.setMessage("success", t("msg.ok")); await this.fetchUsers(); },

    async fetchEnrollments() { const { data } = await request.get("/enrollments"); this.enrollments = data; },
    async addEnrollment(payload) { await request.post("/enrollments", payload); this.setMessage("success", t("msg.addEnrollmentSuccess")); await this.fetchEnrollments(); },
    async deleteEnrollment(id) { await request.delete(`/enrollments/${id}`); this.setMessage("success", t("msg.deleteEnrollmentSuccess")); await this.fetchEnrollments(); },

    async fetchGrades(studentNo = "") { const { data } = await request.get("/grades", { params: { studentNo } }); this.grades = data; },
    async saveGrade(payload) { await request.post("/grades", payload); this.setMessage("success", t("msg.saveGradeSuccess")); await this.fetchGrades(); },

    async fetchLogs() { const { data } = await request.get("/dashboard/logs", { params: { page: this.logsPage, pageSize: this.logsPageSize } }); this.logs = data.list; this.logsTotal = data.total; }
  }
});
