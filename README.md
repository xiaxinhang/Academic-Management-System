# 教务管理系统 Pro

## 扩展能力
- 仪表盘：课程/学生/选课/平均分统计 + 课程统计表
- 课程管理：分页、搜索、新增、编辑、删除
- 学生管理（管理员）：新增、编辑、删除
- 用户管理（管理员）：新增、编辑、删除、绑定学生
- 选课管理：查询、选课、退课（学生仅看本人）
- 成绩管理：查询、录入/更新（学生仅看本人）
- 操作日志（管理员）：记录对课程/学生/用户/选课/成绩的增删改
- JWT 鉴权 + 角色权限 + 国际化 + 响应式布局

## 启动
1. 执行 `backend/sql/init.sql`
2. 后端
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```
3. 前端
```bash
cd frontend
npm install
npm run dev
```

默认账号：
- admin / admin123
- stu001 / 123456
