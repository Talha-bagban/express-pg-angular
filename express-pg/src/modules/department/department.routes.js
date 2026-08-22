import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { createDepartment, deleteDepartment, getDepartment, updateDepartment } from "./department.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { departmentSchema } from "./department.validation.js";

const departmentRoutes = Router();

departmentRoutes.post(
  "/createDepartment",
  validateRequest(departmentSchema),
  verifyJWT,
  authorizeRoles("admin"),
  createDepartment,
);

departmentRoutes.get(
  "/getdepartments",
  verifyJWT,
  authorizeRoles("admin", "manager", 'employee'),
  getDepartment,
);

departmentRoutes.patch(
  "/updateDepartment/:id",
  validateRequest(departmentSchema),
  verifyJWT,
  authorizeRoles("admin"),
  updateDepartment,
);

departmentRoutes.delete(
  "/deleteDepartment/:id",
  verifyJWT,
  authorizeRoles("admin"),
  deleteDepartment,
);


export default departmentRoutes;