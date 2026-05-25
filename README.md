# 教务管理系统 Pro

一个基于 **Vue3 + Node.js + Express + MySQL** 的全栈教务管理系统，覆盖登录认证、课程管理、学生管理、选课管理、成绩管理、用户权限、操作日志和数据可视化。项目采用 **JWT + RBAC** 权限模型、**RESTful API** 接口设计、**Axios + Pinia** 前端状态管理，并使用 **Element Plus** 与 **ECharts** 提升后台管理体验。

## 技术栈

- 前端：Vue3、JavaScript、Vite、Vue Router、Pinia、Axios、Vue I18n、Element Plus、ECharts
- 后端：Node.js、Express、MySQL、mysql2、JWT、bcrypt、dotenv、cors
- 工程能力：RESTful API、RBAC、统一响应、统一错误处理、参数校验、操作日志、CSV 导出

## 核心功能

- 登录认证：JWT 登录态、bcrypt 密码哈希、缺失 `JWT_SECRET` 时禁止启动
- 数据看板：课程数、学生数、选课数、平均成绩、热门课程 Top 5、成绩分布、操作日志趋势
- 课程管理：搜索、分页、新增、编辑、删除、批量删除、容量管理、CSV 导出
- 学生管理：搜索、分页、新增、编辑、删除、批量删除、CSV 导出
- 用户管理：管理员维护账号、角色与学生绑定关系
- 选课管理：防重复选课、课程容量校验、学生仅查看自己的选课
- 成绩管理：成绩录入与更新、0-100 参数校验、学生仅查看自己的成绩、CSV 导出
- 操作日志：记录登录、新增、修改、删除、选课、退课、成绩录入等关键操作
- 国际化：保留中文 / 英文菜单、按钮和提示文案


## 目录结构

```text
edu-management-system
├─ backend
│  ├─ sql/init.sql
│  └─ src
│     ├─ controllers
│     ├─ db
│     ├─ middleware
│     ├─ routes
│     ├─ services
│     └─ utils
├─ frontend
│  └─ src
│     ├─ api
│     ├─ i18n
│     ├─ router
│     ├─ stores
│     └─ views
└─ README.md
```

## 数据库设计

- `users`：用户表，包含 `username`、`password_hash`、`role`、`student_id`
- `students`：学生表，包含学号、姓名、班级、年级
- `courses`：课程表，包含课程编号、课程名称、教师、学分、容量
- `enrollments`：选课表，`student_id + course_id` 唯一约束
- `grades`：成绩表，`student_id + course_id` 唯一约束
- `operation_logs`：操作日志表，记录用户、动作、对象、详情和时间

## 启动步骤

1. 初始化数据库

```bash
mysql -u root -p < backend/sql/init.sql
```

2. 启动后端

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

默认访问地址：

- 前端：http://localhost:5173
- 后端：http://localhost:3001

## 默认账号

- 管理员：admin / admin123
- 学生：stu001 / 123456

## 接口示例

登录：

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

课程分页查询：

```http
GET /api/courses?page=1&pageSize=8&keyword=数据库
Authorization: Bearer <token>
```

录入成绩：

```http
POST /api/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 2,
  "score": 88
}
```

## 环境变量

`backend/.env`：

```env
PORT=3001
JWT_SECRET=edu_secret_2026
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=edu_management
```
