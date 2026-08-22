import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { checkInAttendance, checkOutAttendance, getAllAttendance, getTodayAttendance } from "./attendance.controller.js";

const attendanceRoutes = Router();

attendanceRoutes.post(
  '/checkInAttendance',
  verifyJWT,
  checkInAttendance
)

attendanceRoutes.post(
  '/checkOutAttendance',
  verifyJWT,
  checkOutAttendance
)

attendanceRoutes.get(
  '/getAllAttendance',
  verifyJWT,
  getAllAttendance
)

attendanceRoutes.get(
  '/getTodayAttendance',
  verifyJWT,
  getTodayAttendance
)

export default attendanceRoutes;

