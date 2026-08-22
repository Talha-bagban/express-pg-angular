import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { loginUser, registerUser } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { loginSchema } from "./auth.validation.js";
import { loginLimiter } from "../../middlewares/rateLimit.middleware.js";

const authRoutes = Router();

authRoutes.post("/createUser", verifyJWT, registerUser);

authRoutes.post("/loginUser", loginLimiter, validateRequest(loginSchema) ,loginUser);



export default authRoutes;