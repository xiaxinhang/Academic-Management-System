import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import coursesRouter from "./routes/courses.js";
import enrollmentsRouter from "./routes/enrollments.js";
import gradesRouter from "./routes/grades.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ message: "Edu API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/grades", gradesRouter);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: "服务器内部错误" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
