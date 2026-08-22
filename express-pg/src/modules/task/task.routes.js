import { Router } from "express";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { createComment, createTask, deleteTask, getAllTask, getComments, getLog, getTaskById, updateTask, updateTaskStatus } from "./task.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { taskSchema } from "./task.validation.js";

const taskRoutes = Router();

taskRoutes.post(
  "/createTask",
  validateRequest(taskSchema),
  verifyJWT,
  authorizeRoles("admin", "manager"),
  createTask,
);

taskRoutes.get(
  "/getAllTask",
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getAllTask,
);

taskRoutes.get(
  '/getTaskById/:id',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getTaskById
)

taskRoutes.patch(
  "/updateTask/:id",
  verifyJWT,
  authorizeRoles("admin", "manager"),
  updateTask,
);

taskRoutes.patch(
  '/updateTaskStatus/:id/status',
  verifyJWT,
  authorizeRoles("employee"),
  updateTaskStatus
)

taskRoutes.delete(
  "/deleteTask/:id",
  verifyJWT,
  authorizeRoles("admin", "manager"),
  deleteTask,
);

taskRoutes.post(
  '/createComment',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  createComment
)

taskRoutes.get(
  '/getComments/:taskId',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getComments
)

taskRoutes.get(
  '/getLog/:taskId',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getLog
)

export default taskRoutes;