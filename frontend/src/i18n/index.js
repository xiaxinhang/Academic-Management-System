import { createI18n } from "vue-i18n";

const messages = {
  zh: {
    common: {
      logout: "退出登录",
      search: "搜索",
      save: "保存",
      delete: "删除",
      prev: "上一页",
      next: "下一页",
      optional: "可选"
    },
    nav: { courses: "课程管理", enrollments: "选课管理", grades: "成绩查询" },
    app: { title: "教务管理系统", roleAdmin: "管理员", roleStudent: "学生" },
    login: {
      subtitle: "请登录后继续",
      username: "用户名",
      password: "密码",
      submit: "登录",
      tips: "管理员：admin/admin123 | 学生：stu001/123456"
    },
    courses: {
      title: "课程管理",
      searchPlaceholder: "搜索课程/教师",
      code: "课程编号",
      name: "课程名称",
      teacher: "授课教师",
      credit: "学分",
      add: "新增课程",
      pageInfo: "第 {page} 页 / 共 {total} 页",
      action: "操作"
    },
    enrollments: {
      title: "选课管理",
      add: "提交选课",
      studentId: "学生ID",
      courseId: "课程ID",
      studentNo: "学号",
      studentName: "姓名",
      courseName: "课程名",
      enrolledAt: "选课时间",
      drop: "退课"
    },
    grades: {
      title: "成绩查询",
      queryByNo: "按学号查询（可选）",
      editTitle: "录入/更新成绩",
      score: "成绩",
      save: "保存成绩"
    },
    msg: {
      loginSuccess: "登录成功",
      addCourseSuccess: "课程新增成功",
      deleteCourseSuccess: "课程删除成功",
      addEnrollmentSuccess: "选课成功",
      deleteEnrollmentSuccess: "退课成功",
      saveGradeSuccess: "成绩保存成功",
      courseFormInvalid: "请正确填写课程表单",
      enrollFormInvalid: "学生ID和课程ID必须大于0",
      gradeInvalid: "请检查成绩录入范围（0-100）"
    }
  },
  en: {
    common: {
      logout: "Log out",
      search: "Search",
      save: "Save",
      delete: "Delete",
      prev: "Prev",
      next: "Next",
      optional: "optional"
    },
    nav: { courses: "Courses", enrollments: "Enrollments", grades: "Grades" },
    app: { title: "Academic Management", roleAdmin: "Admin", roleStudent: "Student" },
    login: {
      subtitle: "Please sign in to continue",
      username: "Username",
      password: "Password",
      submit: "Sign in",
      tips: "Admin: admin/admin123 | Student: stu001/123456"
    },
    courses: {
      title: "Course Management",
      searchPlaceholder: "Search by course or teacher",
      code: "Course Code",
      name: "Course Name",
      teacher: "Teacher",
      credit: "Credit",
      add: "Add Course",
      pageInfo: "Page {page} / {total}",
      action: "Action"
    },
    enrollments: {
      title: "Enrollment Management",
      add: "Add Enrollment",
      studentId: "Student ID",
      courseId: "Course ID",
      studentNo: "Student No",
      studentName: "Name",
      courseName: "Course",
      enrolledAt: "Enrolled At",
      drop: "Drop"
    },
    grades: {
      title: "Grade Query",
      queryByNo: "Search by student no (optional)",
      editTitle: "Create/Update Grade",
      score: "Score",
      save: "Save Grade"
    },
    msg: {
      loginSuccess: "Login successful",
      addCourseSuccess: "Course added",
      deleteCourseSuccess: "Course deleted",
      addEnrollmentSuccess: "Enrollment added",
      deleteEnrollmentSuccess: "Enrollment deleted",
      saveGradeSuccess: "Grade saved",
      courseFormInvalid: "Please complete the course form correctly",
      enrollFormInvalid: "Student ID and Course ID must be greater than 0",
      gradeInvalid: "Score must be between 0 and 100"
    }
  }
};

const locale = localStorage.getItem("locale") || "zh";

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "zh",
  messages
});

export default i18n;
