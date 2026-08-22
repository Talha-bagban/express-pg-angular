import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getNotifications, markAllNotificationsAsRead } from "./notification.controller.js";

const notificationRoutes = Router();

notificationRoutes.get(
  '/getNotifications',
  verifyJWT,
  getNotifications
)

notificationRoutes.patch(
  '/notifications/read-all',
  verifyJWT,
  markAllNotificationsAsRead
)

export default notificationRoutes;