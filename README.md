# 简易教务管理系统（升级版）

## 新增能力
- 登录鉴权：JWT 登录、路由守卫
- 角色权限：`admin` 可管理课程/选课/成绩，`student` 仅查看本人选课与成绩
- 课程分页与搜索：支持 `page/pageSize/keyword`
- 前后端校验与错误提示
- 国际化：支持中文/英文切换（登录页与后台均可切换）
- UI 升级：登录居中卡片 + 后台侧边栏布局

## 默认账号
- 管理员：`admin / admin123`
- 学生：`stu001 / 123456`

## 启动
1. 执行 `backend/sql/init.sql`
2. 后端：
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```
3. 前端：
```bash
cd frontend
npm install
npm run dev
```

## 国际化说明
- 登录页右上角可切换 `中文 / EN`
- 登录后左侧栏也可切换语言
- 语言偏好会保存到 `localStorage(locale)`
