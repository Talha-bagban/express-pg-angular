import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorizeroles.middleware.js";
import { dashboard, getCalendarEvents } from "./dashboard.controller.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

const dashboardRoutes = Router();

dashboardRoutes.get(
  '/dashboard',
  verifyJWT,
  authorizeRoles("admin", "manager", "employee"),
  dashboard
)

dashboardRoutes.get(
  '/calendar/events',
  verifyJWT,
  getCalendarEvents
)

export default dashboardRoutes;