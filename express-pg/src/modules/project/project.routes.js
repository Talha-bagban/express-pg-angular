import { Router } from "express";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { createProject, createProjectComment, deleteProject, getProjectById, getProjectComments, getProjectLog, getProjects, getProjectTasks, updateProject } from "./project.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { taskSchema } from "./project.validation.js";

const projectRoutes = Router();

projectRoutes.post(
  "/createProject",
  validateRequest(taskSchema),
  verifyJWT,
  authorizeRoles("admin", "manager"),
  createProject,
);

projectRoutes.get(
  "/getProjects",
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getProjects
);

projectRoutes.get(
  '/getProjectById/:id',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  getProjectById
)

projectRoutes.get(
  '/getProjectTasks/:id',
  verifyJWT,
  getProjectTasks
)

projectRoutes.patch(
  "/updateProject/:id",
  validateRequest(taskSchema),
  verifyJWT,
  authorizeRoles("admin", "manager"),
  updateProject,
);

projectRoutes.delete(
  "/deleteProject/:id",
  verifyJWT,
  authorizeRoles("admin", "manager"),
  deleteProject,
);

projectRoutes.post(
  '/createProjectComment',
  verifyJWT,
  createProjectComment
)

projectRoutes.get(
  '/getProjectComments/:projectId',
  verifyJWT,
  getProjectComments
)

projectRoutes.get(
  '/getProjectLog/:projectId',
  verifyJWT,
  getProjectLog
)

export default projectRoutes

