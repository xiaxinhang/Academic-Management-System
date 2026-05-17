CREATE DATABASE IF NOT EXISTS edu_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edu_management;

DROP TABLE IF EXISTS operation_logs;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_code VARCHAR(50) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  teacher VARCHAR(50) NOT NULL,
  credit INT NOT NULL,
  capacity INT NOT NULL DEFAULT 50,
  INDEX idx_courses_code (course_code),
  INDEX idx_courses_teacher (teacher)
);

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_no VARCHAR(50) NOT NULL UNIQUE,
  student_name VARCHAR(50) NOT NULL,
  class_name VARCHAR(50) NULL,
  grade_year INT NULL,
  INDEX idx_students_no (student_no)
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('admin','student','teacher') NOT NULL DEFAULT 'student',
  student_id INT NULL,
  INDEX idx_users_username (username),
  INDEX idx_users_student_id (student_id),
  CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_enrollment (student_id, course_id),
  INDEX idx_enrollments_student_id (student_id),
  INDEX idx_enrollments_course_id (course_id),
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE grades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  UNIQUE KEY uniq_grade (student_id, course_id),
  INDEX idx_grades_student_id (student_id),
  INDEX idx_grades_course_id (course_id),
  CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE operation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  action VARCHAR(30) NOT NULL,
  target VARCHAR(30) NOT NULL,
  detail VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_logs_user_id (user_id),
  INDEX idx_logs_created_at (created_at),
  CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO students (student_no, student_name, class_name, grade_year) VALUES
('2023001', '张三', '计算机1班', 2023),
('2023002', '李四', '计算机1班', 2023),
('2023003', '王五', '计算机2班', 2023),
('2023004', '赵六', '软件工程1班', 2023),
('2023005', '孙七', '软件工程1班', 2023);

INSERT INTO courses (course_code, course_name, teacher, credit, capacity) VALUES
('CS101', '程序设计基础', '陈老师', 3, 60),
('CS102', '数据库原理', '刘老师', 4, 55),
('CS103', '计算机网络', '赵老师', 3, 50),
('CS104', '操作系统', '孙老师', 4, 45),
('CS105', '软件工程', '马老师', 3, 50),
('CS106', '算法设计', '黄老师', 4, 40),
('CS107', '编译原理', '周老师', 3, 35);

-- admin123 / 123456 hashed with bcrypt.
INSERT INTO users (username, password_hash, role, student_id) VALUES
('admin', '$2b$10$TYw2DS9jeOmEiK9nUitqquqNHAHPZsb9wbZgOQ4479Sst270tEA6O', 'admin', NULL),
('stu001', '$2b$10$CyQ5VCpAfxasjZDQuBo3Cuq3Zy14FvDZadDr8CRcLUGXpAYax9gvu', 'student', 1),
('stu002', '$2b$10$CyQ5VCpAfxasjZDQuBo3Cuq3Zy14FvDZadDr8CRcLUGXpAYax9gvu', 'student', 2),
('stu003', '$2b$10$CyQ5VCpAfxasjZDQuBo3Cuq3Zy14FvDZadDr8CRcLUGXpAYax9gvu', 'student', 3);

INSERT INTO enrollments (student_id, course_id) VALUES
(1,1),(1,2),(2,2),(2,3),(3,1),(3,4),(4,5),(5,6);

INSERT INTO grades (student_id, course_id, score) VALUES
(1,1,92),(1,2,86),(2,2,79),(2,3,88),(3,1,90),(3,4,84),(4,5,91),(5,6,76);

INSERT INTO operation_logs (user_id, action, target, detail) VALUES
(1, 'INIT', 'SYSTEM', '初始化示例数据');
