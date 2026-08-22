import { Router } from "express";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { applyLeave, leaves, myLeave, updateleave, updateLeaveStatus } from "./leave.controller.js";

const leaveRoutes = Router();

leaveRoutes.post("/applyLeave", verifyJWT, applyLeave);

leaveRoutes.get("/leave/my", verifyJWT, authorizeRoles("employee"), myLeave);

leaveRoutes.get("/leaves", verifyJWT, authorizeRoles("admin", "manager"), leaves);

leaveRoutes.patch(
  "/updateLeaveStatus/:leaveId/status",
  verifyJWT,
  authorizeRoles("admin", "manager"),
  updateLeaveStatus,
);

leaveRoutes.patch("/updateleave/:id", verifyJWT, updateleave);

export default leaveRoutes