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
      create: "新增",
      update: "更新",
      selectStudent: "请选择学生",
      selectCourse: "请选择课程"
    },
    nav: {
      dashboard: "仪表盘",
      courses: "课程管理",
      students: "学生管理",
      users: "用户管理",
      enrollments: "选课管理",
      grades: "成绩管理",
      logs: "操作日志"
    },
    app: { title: "教务管理系统 Pro", roleAdmin: "管理员", roleStudent: "学生" },
    login: {
      subtitle: "请登录后继续",
      username: "用户名",
      password: "密码",
      submit: "登录",
      tips: "管理员：admin/admin123 | 学生：stu001/123456"
    },
    dashboard: { c1: "课程总数", c2: "学生总数", c3: "选课总数", c4: "平均成绩", hot: "课程统计" },
    courses: {
      title: "课程管理",
      searchPlaceholder: "搜索课程/教师",
      code: "课程编号",
      name: "课程名称",
      teacher: "授课教师",
      credit: "学分",
      add: "新增课程",
      action: "操作",
      pageInfo: "第 {page} 页 / 共 {total} 页"
    },
    students: { title: "学生管理", no: "学号", name: "姓名", className: "班级", gradeYear: "年级", add: "新增学生" },
    users: {
      title: "用户管理",
      username: "用户名",
      password: "密码",
      role: "角色",
      bindStudent: "绑定学生",
      add: "新增用户"
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
      title: "成绩管理",
      queryByNo: "按学号查询（管理员）",
      editTitle: "录入/更新成绩",
      score: "成绩",
      save: "保存成绩"
    },
    logs: { title: "操作日志", action: "动作", target: "对象", detail: "详情", operator: "操作人", time: "时间" },
    msg: {
      loginSuccess: "登录成功",
      addCourseSuccess: "课程新增成功",
      deleteCourseSuccess: "课程删除成功",
      addEnrollmentSuccess: "选课成功",
      deleteEnrollmentSuccess: "退课成功",
      saveGradeSuccess: "成绩保存成功",
      courseFormInvalid: "请正确填写课程表单",
      enrollFormInvalid: "学生和课程都必须选择",
      gradeInvalid: "请检查成绩录入范围（0-100）",
      ok: "操作成功"
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
      create: "Create",
      update: "Update",
      selectStudent: "Select student",
      selectCourse: "Select course"
    },
    nav: {
      dashboard: "Dashboard",
      courses: "Courses",
      students: "Students",
      users: "Users",
      enrollments: "Enrollments",
      grades: "Grades",
      logs: "Logs"
    },
    app: { title: "Edu Management Pro", roleAdmin: "Admin", roleStudent: "Student" },
    login: {
      subtitle: "Please sign in to continue",
      username: "Username",
      password: "Password",
      submit: "Sign in",
      tips: "Admin: admin/admin123 | Student: stu001/123456"
    },
    dashboard: { c1: "Courses", c2: "Students", c3: "Enrollments", c4: "Average Score", hot: "Course Statistics" },
    courses: {
      title: "Course Management",
      searchPlaceholder: "Search by course or teacher",
      code: "Course Code",
      name: "Course Name",
      teacher: "Teacher",
      credit: "Credit",
      add: "Add Course",
      action: "Action",
      pageInfo: "Page {page} / {total}"
    },
    students: { title: "Student Management", no: "Student No", name: "Name", className: "Class", gradeYear: "Grade", add: "Add Student" },
    users: {
      title: "User Management",
      username: "Username",
      password: "Password",
      role: "Role",
      bindStudent: "Bind Student",
      add: "Add User"
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
      title: "Grade Management",
      queryByNo: "Search by student no (admin)",
      editTitle: "Create/Update Grade",
      score: "Score",
      save: "Save Grade"
    },
    logs: { title: "Operation Logs", action: "Action", target: "Target", detail: "Detail", operator: "Operator", time: "Time" },
    msg: {
      loginSuccess: "Login successful",
      addCourseSuccess: "Course added",
      deleteCourseSuccess: "Course deleted",
      addEnrollmentSuccess: "Enrollment added",
      deleteEnrollmentSuccess: "Enrollment deleted",
      saveGradeSuccess: "Grade saved",
      courseFormInvalid: "Please complete the course form correctly",
      enrollFormInvalid: "Please select both student and course",
      gradeInvalid: "Score must be between 0 and 100",
      ok: "Success"
    }
  }
};

const locale = localStorage.getItem("locale") || "zh";

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: "zh",
  messages
});
