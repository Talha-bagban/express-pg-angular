import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { changeUserPassword, updateProfile } from "./profile.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { changePassword, editProfileSchema } from "./profile.validation.js";

const profileRoutes = Router();

profileRoutes.patch(
  "/updateProfile/:id",
  validateRequest(editProfileSchema),
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  updateProfile,
);

profileRoutes.patch(
  "/changeUserPassword",
  validateRequest(changePassword),
  verifyJWT,
  changeUserPassword,
);

export default profileRoutes;
