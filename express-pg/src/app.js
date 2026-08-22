import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/user.route.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import { logger } from "./middlewares/logger.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", departmentRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", dashboardRoutes, apiLimiter);
app.use("/api/v1", attendanceRoutes);
app.use("/api/v1", leaveRoutes);

app.use(errorHandler);

export { app };
