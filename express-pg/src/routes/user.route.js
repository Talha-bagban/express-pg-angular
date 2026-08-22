import { Router } from "express";
import {

  // loginUser,
  // registerUser,

  
  // getUsers,
  // updateUser,
  // deleteUser,

  
  // updateProfile,
  // changeUserPassword,

  // createDepartment,
  // deleteDepartment,
  // getDepartment,
  // updateDepartment,


  // createEmployee,
  // deleteEmployee,
  // getAllEmployee,
  // updateEmployee,



  // createManager,
  // getAllManger,
  // updateManager,
  // deleteManger,

  
  // getNotifications,
  // markAllNotificationsAsRead,

  
  // createTask,
  // getAllTask,
  // getTaskById,
  // updateTask,
  // updateTaskStatus,
  // deleteTask,

  // createProject,
  // deleteProject,
  // getProjects,
  // updateProject,
  // getProjectById,
  // getProjectTasks,

  // dashboard,

  // checkInAttendance,
  // checkOutAttendance,
  // getAllAttendance,
  // getTodayAttendance,
  
  // applyLeave,
  // myLeave,
  // leaves,
  // updateLeaveStatus,
  // updateleave,

  // createComment,
  // getComments,
  // getLog,
  
  // createProjectComment,
  // getProjectComments,
  // getProjectLog,


  // getCalendarEvents,
  
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeroles.middleware.js";

const router = Router();

// router.post("/createUser", verifyJWT, registerUser);

// router.post("/loginUser", loginUser);

// router.get("/users", verifyJWT, authorizeRoles("admin"), getUsers);

// router.patch("/updateUser/:id", authorizeRoles("admin"), updateUser);

// router.delete("/users/:id", verifyJWT, authorizeRoles("admin"), deleteUser);

// router.patch('/updateProfile/:id', verifyJWT, authorizeRoles("admin", 'manager', 'employee'), updateProfile)

// router.patch('/changeUserPassword', verifyJWT, changeUserPassword)

// router.post(
//   "/createDepartment",
//   verifyJWT,
//   authorizeRoles("admin"),
//   createDepartment,
// );

// router.get(
//   "/getdepartments",
//   verifyJWT,
//   authorizeRoles("admin", "manager", 'employee'),
//   getDepartment,
// );

// router.patch(
//   "/updateDepartment/:id",
//   verifyJWT,
//   authorizeRoles("admin"),
//   updateDepartment,
// );

// router.delete(
//   "/deleteDepartment/:id",
//   verifyJWT,
//   authorizeRoles("admin"),
//   deleteDepartment,
// );

// router.post(
//   "/createEmployee",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   createEmployee,
// );

// router.get(
//   "/getAllEmployee",
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getAllEmployee,
// );

// router.delete(
//   "/deleteEmployee/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   deleteEmployee,
// );

// router.patch(
//   "/updateEmployee/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   updateEmployee,
// );

// router.post(
//   "/createManager",
//   verifyJWT,
//   authorizeRoles("admin"),
//   createManager,
// );

// router.get("/getAllManger", verifyJWT, authorizeRoles("admin", "manager", "employee"), getAllManger);

// router.patch('/updateManager/:id', verifyJWT, authorizeRoles("admin"), updateManager)

// router.delete('/deleteManger/:id', verifyJWT, authorizeRoles("admin"), deleteManger)

// router.post(
//   "/createTask",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   createTask,
// );

// router.get(
//   "/getAllTask",
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getAllTask,
// );

// router.get(
//   '/getTaskById/:id',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getTaskById
// )

// router.get('/getMyTasks', verifyJWT, authorizeRoles('employee'), getMyTasks)

// router.patch(
//   "/updateTask/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   updateTask,
// );

// router.patch(
//   '/updateTaskStatus/:id/status',
//   verifyJWT,
//   authorizeRoles("employee"),
//   updateTaskStatus
// )

// router.delete(
//   "/deleteTask/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   deleteTask,
// );

// router.post(
//   "/createProject",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   createProject,
// );

// router.get(
//   "/getProjects",
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getProjects
// );

// router.get(
//   '/getProjectById/:id',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getProjectById
// )

// router.get(
//   '/getProjectTasks/:id',
//   verifyJWT,
//   getProjectTasks
// )

// router.patch(
//   "/updateProject/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   updateProject,
// );

// router.delete(
//   "/deleteProject/:id",
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   deleteProject,
// );

// router.get(
//   '/dashboard',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   dashboard
// )

// router.post(
//   '/createComment',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   createComment
// )

// router.get(
//   '/getComments/:taskId',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getComments
// )

// router.get(
//   '/getLog/:taskId',
//   verifyJWT,
//   authorizeRoles("admin", "manager", "employee"),
//   getLog
// )

// router.get(
//   '/getProjectLog/:projectId',
//   verifyJWT,
//   getProjectLog
// )

// router.post(
//   '/createProjectComment',
//   verifyJWT,
//   createProjectComment
// )

// router.get(
//   '/getProjectComments/:projectId',
//   verifyJWT,
//   getProjectComments
// )

// router.get(
//   '/getNotifications',
//   verifyJWT,
//   getNotifications
// )

// router.patch(
//   '/notifications/read-all',
//   verifyJWT,
//   markAllNotificationsAsRead
// )

// router.post(
//   '/checkInAttendance',
//   verifyJWT,
//   checkInAttendance
// )

// router.post(
//   '/checkOutAttendance',
//   verifyJWT,
//   checkOutAttendance
// )

// router.get(
//   '/getAllAttendance',
//   verifyJWT,
//   getAllAttendance
// )

// router.get(
//   '/getTodayAttendance',
//   verifyJWT,
//   getTodayAttendance
// )

// router.post(
//   '/applyLeave',
//   verifyJWT,
//   applyLeave
// )

// router.get(
//   '/leave/my',
//   verifyJWT,
//   authorizeRoles("employee"),
//   myLeave
// )

// router.get(
//   '/leaves',
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   leaves
// )

// router.patch(
//   '/updateLeaveStatus/:leaveId/status',
//   verifyJWT,
//   authorizeRoles("admin", "manager"),
//   updateLeaveStatus
// )

// router.patch(
//   '/updateleave/:id',
//   verifyJWT,
//   updateleave
// )

// router.get(
//   '/calendar/events',
//   verifyJWT,
//   getCalendarEvents
// )


router.get("/testing", (req, res) => {
  res.json({ message: "connected..." });
});

export default router;
