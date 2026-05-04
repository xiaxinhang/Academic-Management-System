CREATE DATABASE IF NOT EXISTS edu_management DEFAULT CHARACTER SET utf8mb4;
USE edu_management;

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
  credit INT NOT NULL
);

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_no VARCHAR(50) NOT NULL UNIQUE,
  student_name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin','student') NOT NULL,
  student_id INT NULL,
  CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_enrollment (student_id, course_id),
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE grades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  UNIQUE KEY uniq_grade (student_id, course_id),
  CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO students (student_no, student_name) VALUES
('2023001', '张三'),
('2023002', '李四'),
('2023003', '王五');

INSERT INTO courses (course_code, course_name, teacher, credit) VALUES
('CS101', '程序设计基础', '陈老师', 3),
('CS102', '数据库原理', '刘老师', 4),
('CS103', '计算机网络', '赵老师', 3),
('CS104', '操作系统', '孙老师', 4),
('CS105', '软件工程', '马老师', 3),
('CS106', '算法设计', '黄老师', 4);

INSERT INTO users (username, password, role, student_id) VALUES
('admin', 'admin123', 'admin', NULL),
('stu001', '123456', 'student', 1),
('stu002', '123456', 'student', 2);
