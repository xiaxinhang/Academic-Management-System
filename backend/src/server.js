import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import coursesRouter from "./routes/courses.js";
import enrollmentsRouter from "./routes/enrollments.js";
import gradesRouter from "./routes/grades.js";
import authRouter from "./routes/auth.js";
import studentsRouter from "./routes/students.js";
import usersRouter from "./routes/users.js";
import dashboardRouter from "./routes/dashboard.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { success } from "./utils/response.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  success(res, { uptime: process.uptime() }, "Edu API is running");
});

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/students", studentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
