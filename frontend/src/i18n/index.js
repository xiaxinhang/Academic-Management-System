import { createI18n } from "vue-i18n";

const messages = {
  zh: {
    common: {
      logout: "退出登录",
      search: "搜索",
      reset: "重置",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      create: "新增",
      update: "更新",
      export: "导出 CSV",
      batchDelete: "批量删除",
      actions: "操作",
      confirmDelete: "确认删除这条记录？",
      confirmBatchDelete: "确认删除选中的记录？",
      selectStudent: "请选择学生",
      selectCourse: "请选择课程",
      empty: "暂无数据",
      language: "语言"
    },
    nav: {
      dashboard: "数据看板",
      courses: "课程管理",
      students: "学生管理",
      users: "用户管理",
      enrollments: "选课管理",
      grades: "成绩管理",
      logs: "操作日志"
    },
    app: { title: "教务管理系统 Pro", roleAdmin: "管理员", roleStudent: "学生", roleTeacher: "教师" },
    login: {
      subtitle: "面向高校教务场景的全栈管理系统",
      intro: "覆盖课程、学生、选课、成绩、RBAC 权限、操作日志和数据可视化，适合作为 Vue3 + Node.js 全栈项目展示。",
      username: "用户名",
      password: "密码",
      submit: "登录",
      tips: "默认账号：admin / admin123；学生：stu001 / 123456"
    },
    dashboard: {
      title: "数据看板",
      c1: "课程总数",
      c2: "学生总数",
      c3: "选课总数",
      c4: "平均成绩",
      hot: "课程统计",
      topCourses: "课程选课人数 Top 5",
      gradeDistribution: "成绩分布",
      logTrend: "最近操作趋势"
    },
    courses: {
      title: "课程管理",
      searchPlaceholder: "搜索课程编号、名称或教师",
      code: "课程编号",
      name: "课程名称",
      teacher: "授课教师",
      credit: "学分",
      capacity: "容量",
      selected: "已选人数",
      add: "新增课程",
      edit: "编辑课程"
    },
    students: { title: "学生管理", searchPlaceholder: "搜索学号、姓名或班级", no: "学号", name: "姓名", className: "班级", gradeYear: "年级", add: "新增学生", edit: "编辑学生" },
    users: {
      title: "用户管理",
      username: "用户名",
      password: "密码",
      passwordTip: "编辑时留空则不修改密码",
      role: "角色",
      bindStudent: "绑定学生",
      add: "新增用户",
      edit: "编辑用户"
    },
    enrollments: {
      title: "选课管理",
      searchPlaceholder: "搜索学生或课程",
      add: "提交选课",
      studentNo: "学号",
      studentName: "姓名",
      courseName: "课程名",
      enrolledAt: "选课时间",
      drop: "退课"
    },
    grades: {
      title: "成绩管理",
      searchPlaceholder: "搜索学生或课程",
      queryByNo: "按学号精确查询",
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
      logout: "Log Out",
      search: "Search",
      reset: "Reset",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      export: "Export CSV",
      batchDelete: "Batch Delete",
      actions: "Actions",
      confirmDelete: "Delete this record?",
      confirmBatchDelete: "Delete selected records?",
      selectStudent: "Select Student",
      selectCourse: "Select Course",
      empty: "No Data",
      language: "Language"
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
    app: { title: "Edu Management Pro", roleAdmin: "Admin", roleStudent: "Student", roleTeacher: "Teacher" },
    login: {
      subtitle: "A full-stack academic administration system",
      intro: "Courses, students, enrollments, grades, RBAC, operation logs and visual analytics powered by Vue3 and Node.js.",
      username: "Username",
      password: "Password",
      submit: "Sign In",
      tips: "Default accounts: admin / admin123; student: stu001 / 123456"
    },
    dashboard: {
      title: "Dashboard",
      c1: "Courses",
      c2: "Students",
      c3: "Enrollments",
      c4: "Average Score",
      hot: "Course Statistics",
      topCourses: "Top 5 Enrolled Courses",
      gradeDistribution: "Grade Distribution",
      logTrend: "Recent Log Trend"
    },
    courses: {
      title: "Course Management",
      searchPlaceholder: "Search code, course or teacher",
      code: "Course Code",
      name: "Course Name",
      teacher: "Teacher",
      credit: "Credit",
      capacity: "Capacity",
      selected: "Selected",
      add: "Add Course",
      edit: "Edit Course"
    },
    students: { title: "Student Management", searchPlaceholder: "Search no, name or class", no: "Student No", name: "Name", className: "Class", gradeYear: "Grade Year", add: "Add Student", edit: "Edit Student" },
    users: {
      title: "User Management",
      username: "Username",
      password: "Password",
      passwordTip: "Leave blank to keep current password",
      role: "Role",
      bindStudent: "Bind Student",
      add: "Add User",
      edit: "Edit User"
    },
    enrollments: {
      title: "Enrollment Management",
      searchPlaceholder: "Search student or course",
      add: "Add Enrollment",
      studentNo: "Student No",
      studentName: "Name",
      courseName: "Course",
      enrolledAt: "Enrolled At",
      drop: "Drop"
    },
    grades: {
      title: "Grade Management",
      searchPlaceholder: "Search student or course",
      queryByNo: "Exact student no",
      editTitle: "Create / Update Grade",
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
