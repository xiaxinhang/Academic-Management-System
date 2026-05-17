import { defineStore } from "pinia";
import request from "../api/request";
import i18n from "../i18n";

const t = (key, args) => i18n.global.t(key, args);

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const useEduStore = defineStore("edu", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    courses: [],
    coursesTotal: 0,
    coursesPage: 1,
    coursesPageSize: 8,
    coursesKeyword: "",
    selectedCourseIds: [],
    courseOptions: [],
    students: [],
    studentsTotal: 0,
    studentsPage: 1,
    studentsPageSize: 8,
    studentsKeyword: "",
    selectedStudentIds: [],
    studentOptions: [],
    users: [],
    enrollments: [],
    enrollmentsTotal: 0,
    enrollmentsPage: 1,
    enrollmentsPageSize: 8,
    enrollmentsKeyword: "",
    grades: [],
    gradesTotal: 0,
    gradesPage: 1,
    gradesPageSize: 8,
    gradesKeyword: "",
    dashboard: { courseCount: 0, studentCount: 0, enrollCount: 0, avgScore: 0 },
    courseStats: [],
    topCourses: [],
    gradeDistribution: {},
    logTrend: [],
    logs: [],
    logsTotal: 0,
    logsPage: 1,
    logsPageSize: 10,
    errorMessage: "",
    successMessage: ""
  }),
  getters: {
    isAdmin: (s) => s.user?.role === "admin",
    isTeacher: (s) => s.user?.role === "teacher",
    isStudent: (s) => s.user?.role === "student",
    isLoggedIn: (s) => Boolean(s.token)
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
    async safeRun(fn) {
      try {
        this.loading = true;
        this.clearMessage();
        await fn();
        return true;
      } catch (e) {
        this.setMessage("error", e.message);
        return false;
      } finally {
        this.loading = false;
      }
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

    async fetchDashboard() {
      const { data } = await request.get("/dashboard/summary");
      this.dashboard = data;
    },
    async fetchCourseStats() {
      const { data } = await request.get("/dashboard/course-stats");
      this.courseStats = data;
    },
    async fetchTopCourses() {
      const { data } = await request.get("/dashboard/top-courses");
      this.topCourses = data;
    },
    async fetchGradeDistribution() {
      const { data } = await request.get("/dashboard/grade-distribution");
      this.gradeDistribution = data || {};
    },
    async fetchLogTrend() {
      if (!this.isAdmin) return;
      const { data } = await request.get("/dashboard/log-trend");
      this.logTrend = data;
    },

    async fetchCourses() {
      const { data } = await request.get("/courses", {
        params: { page: this.coursesPage, pageSize: this.coursesPageSize, keyword: this.coursesKeyword }
      });
      this.courses = data.list;
      this.coursesTotal = data.total;
    },
    async fetchCourseOptions() {
      const { data } = await request.get("/courses/options");
      this.courseOptions = data;
    },
    async addCourse(payload) {
      await request.post("/courses", payload);
      this.setMessage("success", t("msg.addCourseSuccess"));
      await this.fetchCourses();
    },
    async updateCourse(id, payload) {
      await request.put(`/courses/${id}`, payload);
      this.setMessage("success", t("msg.ok"));
      await this.fetchCourses();
    },
    async deleteCourse(id) {
      await request.delete(`/courses/${id}`);
      this.setMessage("success", t("msg.deleteCourseSuccess"));
      await this.fetchCourses();
    },
    async batchDeleteCourses() {
      await request.delete("/courses/batch", { data: { ids: this.selectedCourseIds } });
      this.selectedCourseIds = [];
      this.setMessage("success", t("msg.ok"));
      await this.fetchCourses();
    },
    async exportCourses() {
      const { data } = await request.get("/courses/export", { responseType: "blob" });
      saveBlob(data, "courses.csv");
    },

    async fetchStudents() {
      const { data } = await request.get("/students", {
        params: { page: this.studentsPage, pageSize: this.studentsPageSize, keyword: this.studentsKeyword }
      });
      this.students = data.list;
      this.studentsTotal = data.total;
    },
    async fetchStudentOptions() {
      const { data } = await request.get("/students/options");
      this.studentOptions = data;
    },
    async addStudent(payload) {
      await request.post("/students", payload);
      this.setMessage("success", t("msg.ok"));
      await this.fetchStudents();
    },
    async updateStudent(id, payload) {
      await request.put(`/students/${id}`, payload);
      this.setMessage("success", t("msg.ok"));
      await this.fetchStudents();
    },
    async deleteStudent(id) {
      await request.delete(`/students/${id}`);
      this.setMessage("success", t("msg.ok"));
      await this.fetchStudents();
    },
    async batchDeleteStudents() {
      await request.delete("/students/batch", { data: { ids: this.selectedStudentIds } });
      this.selectedStudentIds = [];
      this.setMessage("success", t("msg.ok"));
      await this.fetchStudents();
    },
    async exportStudents() {
      const { data } = await request.get("/students/export", { responseType: "blob" });
      saveBlob(data, "students.csv");
    },

    async fetchUsers() {
      const { data } = await request.get("/users");
      this.users = data;
    },
    async addUser(payload) {
      await request.post("/users", payload);
      this.setMessage("success", t("msg.ok"));
      await this.fetchUsers();
    },
    async updateUser(id, payload) {
      await request.put(`/users/${id}`, payload);
      this.setMessage("success", t("msg.ok"));
      await this.fetchUsers();
    },
    async deleteUser(id) {
      await request.delete(`/users/${id}`);
      this.setMessage("success", t("msg.ok"));
      await this.fetchUsers();
    },

    async fetchEnrollments() {
      const { data } = await request.get("/enrollments", {
        params: { page: this.enrollmentsPage, pageSize: this.enrollmentsPageSize, keyword: this.enrollmentsKeyword }
      });
      this.enrollments = data.list;
      this.enrollmentsTotal = data.total;
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
      const { data } = await request.get("/grades", {
        params: {
          page: this.gradesPage,
          pageSize: this.gradesPageSize,
          keyword: this.gradesKeyword,
          studentNo
        }
      });
      this.grades = data.list;
      this.gradesTotal = data.total;
    },
    async saveGrade(payload) {
      await request.post("/grades", payload);
      this.setMessage("success", t("msg.saveGradeSuccess"));
      await this.fetchGrades();
    },
    async exportGrades() {
      const { data } = await request.get("/grades/export", { responseType: "blob" });
      saveBlob(data, "grades.csv");
    },

    async fetchLogs() {
      const { data } = await request.get("/dashboard/logs", {
        params: { page: this.logsPage, pageSize: this.logsPageSize }
      });
      this.logs = data.list;
      this.logsTotal = data.total;
    }
  }
});
