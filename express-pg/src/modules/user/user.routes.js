import { Router } from "express";
import {
  authorizeRoles,
  authorizeAdminManagerRoles,
  authorizeAdminRole,
} from "../../middlewares/authorizeroles.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  createEmployee,
  createManager,
  deleteEmployee,
  deleteManger,
  deleteUser,
  getAllEmployee,
  getAllManger,
  getUsers,
  updateEmployee,
  updateManager,
  updateUser,
} from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { employeeSchema, managerSchema } from "./user.validation.js";

const userRoutes = Router();

userRoutes.use(verifyJWT);

userRoutes.get("/getAllManger", getAllManger);

userRoutes.use(authorizeAdminManagerRoles());

userRoutes.post(
  "/createEmployee",
  validateRequest(employeeSchema),
  createEmployee,
);

userRoutes.get("/getAllEmployee", getAllEmployee);

userRoutes.delete("/deleteEmployee/:id", deleteEmployee);

userRoutes.patch(
  "/updateEmployee/:id",
  validateRequest(employeeSchema),
  updateEmployee,
);

userRoutes.use(authorizeAdminRole());

userRoutes.get("/users", getUsers);

userRoutes.patch("/updateUser/:id", updateUser);

userRoutes.delete("/users/:id", deleteUser);

userRoutes.post(
  "/createManager",
  validateRequest(managerSchema),
  createManager,
);

userRoutes.patch(
  "/updateManager/:id",
  validateRequest(managerSchema),
  updateManager,
);

userRoutes.delete("/deleteManger/:id", deleteManger);

export default userRoutes;
