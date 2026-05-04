import { defineStore } from "pinia";
import request from "../api/request";
import i18n from "../i18n";

const t = (key, args) => i18n.global.t(key, args);

export const useEduStore = defineStore("edu", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
    courses: [],
    coursesTotal: 0,
    coursesPage: 1,
    coursesPageSize: 6,
    coursesKeyword: "",
    enrollments: [],
    grades: [],
    errorMessage: "",
    successMessage: ""
  }),
  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    setMessage(type, text) {
      if (type === "error") {
        this.errorMessage = text;
        this.successMessage = "";
      } else {
        this.successMessage = text;
        this.errorMessage = "";
      }
    },
    clearMessage() {
      this.errorMessage = "";
      this.successMessage = "";
    },
    async login(payload) {
      const { data } = await request.post("/auth/login", payload);
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      this.setMessage("success", t("msg.loginSuccess"));
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    async fetchCourses() {
      const { data } = await request.get("/courses", {
        params: { page: this.coursesPage, pageSize: this.coursesPageSize, keyword: this.coursesKeyword }
      });
      this.courses = data.list;
      this.coursesTotal = data.total;
    },
    async addCourse(payload) {
      await request.post("/courses", payload);
      this.setMessage("success", t("msg.addCourseSuccess"));
      await this.fetchCourses();
    },
    async deleteCourse(id) {
      await request.delete(`/courses/${id}`);
      this.setMessage("success", t("msg.deleteCourseSuccess"));
      await this.fetchCourses();
    },
    async fetchEnrollments() {
      const { data } = await request.get("/enrollments");
      this.enrollments = data;
    },
    async addEnrollment(payload) {
      await request.post("/enrollments", payload);
      this.setMessage("success", t("msg.addEnrollmentSuccess"));
      await this.fetchEnrollments();
    },
    async deleteEnrollment(id) {
      await request.delete(`/enrollments/${id}`);
      this.setMessage("success", t("msg.deleteEnrollmentSuccess"));
      await this.fetchEnrollments();
    },
    async fetchGrades(studentNo = "") {
      const { data } = await request.get("/grades", { params: { studentNo } });
      this.grades = data;
    },
    async saveGrade(payload) {
      await request.post("/grades", payload);
      this.setMessage("success", t("msg.saveGradeSuccess"));
      await this.fetchGrades();
    }
  }
});
