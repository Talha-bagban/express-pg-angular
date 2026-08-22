// import { io, pool } from "../index.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { createTaskLog } from "../helper/taskLog.helper.js";
// import { createProjectLog } from "../helper/projectLog.helper.js";
// import { createNotification } from "../helper/createNotification.helper.js";

// const registerUser = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, role } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const create = await pool.query(
//       `
//                 INSERT INTO users (firstname, lastname, email, password, role)
//                 VALUES  ($1,$2,$3,$4,$5)
//                 RETURNING firstname, lastname, email, role
//             `,
//       [firstname, lastname, email, hashedPassword, role],
//     );
//     return res.json({
//       success: true,
//       data: create.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user" });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existingUser = await pool.query(
//       `SELECT users.*,
//         departments.name AS department
//         FROM users

//         LEFT JOIN departments
//         ON departments.id = users.department_id

//       WHERE users.email = $1 `,
//       [email],
//     );

//     if (existingUser.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "User not found, Register first" });
//     }

//     const user = existingUser.rows[0];

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     delete user.password;

//     const accessToken = jwt.sign(
//       {
//         id: user.id,
//         role: user.role,
//         department_id: user.department_id,
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       {
//         expiresIn: "1d",
//       },
//     );

//     io.on("connection", (socket) => {
//       socket.on("join", (userId) => {
//         socket.join(userId);
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       accessToken,
//       user,
//     });
//   } catch (error) {
//     console.log("Login Server Error", error);
//     res.status(500).json({ message: "Login Server Error" });
//   }
// };





// const getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 5, search = "" } = req.query;

//     const pageNum = Number(page);
//     const limitNum = Number(limit);

//     const offset = (pageNum - 1) * limitNum;
//     const searchValue = `%${search}%`;

//     const users = await pool.query(
//       `SELECT * FROM users
//             WHERE firstname ILIKE $1
//             ORDER BY id DESC
//             LIMIT $2 OFFSET $3`,
//       [searchValue, limit, offset],
//     );

//     const countRes = await pool.query(
//       `SELECT COUNT(*) FROM users WHERE firstname ILIKE $1`,
//       [searchValue],
//     );

//     const total = Number(countRes.rows[0].count);

//     return res.json({
//       success: true,
//       data: users.rows,
//       total,
//       page: pageNum,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { firstname, email } = req.body;

//     const updateUser = await pool.query(
//       `
//                 UPDATE users
//                 SET firstname = $1, email = $2
//                 WHERE id = $3
//                 RETURNING *
//             `,
//       [firstname, email, id],
//     );

//     return res.json({
//       success: true,
//       data: updateUser.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleteUser = await pool.query(` DELETE FROM users WHERE id = $1`, [
//       id,
//     ]);

//     if (deleteUser.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User deleted",
//       data: deleteUser.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Deleted failed " });
//   }
// };




// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { firstname, lastname, email, status } = req.body;

//     const result = await pool.query(
//       `
//         UPDATE users

//         SET
//           firstname = $1,
//           lastname = $2,
//           email = $3,
//           status = $4
      
//         WHERE id = $5
//       `,
//       [firstname, lastname, email, status, userId],
//     );
//     const updatedUser = await pool.query(
//       `
//       SELECT
//         users.id,
//         users.firstname,
//         users.lastname,
//         users.email,
//         users.role,
//         users.status,
//         users.department_id,

//         departments.name AS department

//       FROM users

//       LEFT JOIN departments
//       ON departments.id = users.department_id

//       WHERE users.id = $1
//     `,
//       [userId],
//     );

//     return res.status(200).json({
//       success: true,
//       data: updatedUser.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Updated user successfully",
//     });
//   }
// };

// const changeUserPassword = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { oldPassword, newPassword, renewPassword } = req.body;

//     if (newPassword !== renewPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     const userResult = await pool.query(
//       `
//           SELECT *
//           FROM users
//           WHERE id = $1
//         `,
//       [userId],
//     );
//     const user = userResult.rows[0];

//     const isMatch = await bcrypt.compare(oldPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Old password incorrect",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await pool.query(
//       `
//         UPDATE users

//         SET password = $1

//         WHERE id = $2
//       `,
//       [hashedPassword, userId],
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Password change failed",
//     });
//   }
// };




// const createDepartment = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const existingDept = await pool.query(
//       `SELECT FROM departments WHERE name = $1`,
//       [name],
//     );

//     if (existingDept.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "department already exists",
//       });
//     }

//     const createDepartment = await pool.query(
//       ` INSERT INTO departments (name)
//                 VALUES ($1)
//                 RETURNING *
//             `,
//       [name],
//     );

//     return res.status(201).json({
//       success: true,
//       data: createDepartment.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating department",
//     });
//   }
// };

// const getDepartment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;
//     const userDeptId = req.user.department_id;

//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const offset = (page - 1) * limit;

//     const status = req.query.status;

//     let query = "";
//     let values = [];

//     if (role === "manager" || role === "employee") {
//       query = `
//         SELECT * FROM departments
        
//           WHERE departments.id = $1
//           LIMIT $2
//           OFFSET $3
//       `;
//       values = [userDeptId, limit, offset];
//     } else if (role === "admin") {
//       query = `
//         SELECT * FROM departments
//         ORDER BY created_at DESC

//         LIMIT $1
//         OFFSET $2
//       `;
//       values = [limit, offset];
//     }

//     const result = await pool.query(query, values);

//     const totalResult = await pool.query(
//       `
//         SELECT COUNT(*) FROM departments
//       `,
//     );
//     const totalRecords = Number(totalResult.rows[0].count);

//     return res.status(200).json({
//       success: true,
//       page,
//       limit,
//       data: result.rows,
//       totalRecords,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching departments",
//     });
//   }
// };

// const updateDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, status } = req.body;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const result = await pool.query(
//       `
//         UPDATE departments
//         SET name = $1, status = $2
//         WHERE id = $3
//         RETURNING *
//       `,
//       [name, status, id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Department not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Update failed",
//     });
//   }
// };

// const deleteDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const deleteDept = await pool.query(
//       `DELETE FROM departments WHERE id = $1 RETURNING *`,
//       [id],
//     );

//     if (deleteDept.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Department not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "department deleted",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Deleted failed",
//     });
//   }
// };




// const createEmployee = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, department_id } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const create = await pool.query(
//       `
//           INSERT INTO users (firstname, lastname, email, password, role, department_id)
//           VALUES  ($1,$2,$3,$4,'employee',$5)
//           RETURNING id, firstname, lastname, email, role, department_id
//       `,
//       [firstname, lastname, email, hashedPassword, department_id],
//     );

//     const employeeId = create.rows[0].id;

//     await createNotification(
//       employeeId,
//       `Welcome ${firstname}`,
//       "Your account has been created",
//     );

//     return res.status(201).json({
//       success: true,
//       data: create.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error creating employee",
//     });
//   }
// };

// const getAllEmployee = async (req, res) => {
//   try {
//     const role = req.user.role;
//     const userDeptId = req.user.department_id;
//     let query = "";
//     let values = [];

//     if (role === "manager" || role === "employee") {
//       query = ` 
//            SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
//               users.department_id,
//                   departments.name AS department

//               FROM users

//               JOIN departments
//               ON departments.id = users.department_id

//               WHERE users.role  = 'employee' AND users.department_id = $1

//               ORDER BY users.created_at DESC
//         `;
//       values = [userDeptId];
//     } else if (role === "admin") {
//       query = `
//            SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
//             users.department_id,
//                 departments.name AS department

//             FROM users

//             JOIN departments
//             ON departments.id = users.department_id

//             WHERE users.role  = 'employee'

//             ORDER BY users.created_at DESC
//       `;
//     }

//     const allEmployee = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: allEmployee.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error get employee" });
//   }
// };

// const deleteEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleteEmployee = await pool.query(
//       `DELETE FROM users WHERE id = $1 RETURNING *`,
//       [id],
//     );

//     if (deleteEmployee.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Employee deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Deleted failed",
//     });
//   }
// };

// const updateEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { firstname, lastname, email, department_id, status } = req.body;

//     const updateEmployee = await pool.query(
//       `
//           UPDATE users
//           SET firstname = $1, lastname = $2 ,email = $3, department_id = $4, status = $5
//           WHERE id = $6
//           RETURNING *
//             `,
//       [firstname, lastname, email, department_id, status, id],
//     );
//     if (updateEmployee.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: updateEmployee.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Update failed" });
//   }
// };




// const createManager = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, department_id } = req.body;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const create = await pool.query(
//       `
//         INSERT INTO users (firstname, lastname, email, password, role, department_id)
//         VALUES  ($1,$2,$3,$4,'manager',$5)
//         RETURNING id, firstname, lastname, email, role, department_id
//       `,
//       [firstname, lastname, email, hashedPassword, department_id],
//     );

//     const managerId = create.rows[0].id;

//     await createNotification(
//       managerId,
//       `Welcome ${firstname} `,
//       "Your account has been created",
//     );

//     return res.status(201).json({
//       success: true,
//       data: create.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error creating manger",
//     });
//   }
// };

// const getAllManger = async (req, res) => {
//   try {
//     const role = req.user.role;
//     const userDeptId = req.user.department_id;
//     let query = "";
//     let values = [];

//     if (role === "manager" || role === "employee") {
//       query = `
//              SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
//                   users.department_id,
//                   departments.name AS department

//               FROM users

//               JOIN departments
//               ON departments.id = users.department_id

//               WHERE users.role  = 'manager' AND  users.department_id = $1

//               ORDER BY users.created_at DESC
//         `;
//       values = [userDeptId];
//     } else if (role === "admin") {
//       query = `
//            SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
//                   users.department_id,
//                   departments.name AS department

//               FROM users

//               JOIN departments
//               ON departments.id = users.department_id

//               WHERE users.role  = 'manager'

//               ORDER BY users.created_at DESC
//         `;
//     }

//     const allManager = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: allManager.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error getting manager" });
//   }
// };

// const updateManager = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { firstname, lastname, email, department_id, status } = req.body;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const result = await pool.query(
//       `
//       UPDATE users
//         SET firstname = $1, lastname = $2 ,email = $3, department_id = $4 , status=$5
//         WHERE id = $6
//         RETURNING *
//     `,
//       [firstname, lastname, email, department_id, status, id],
//     );
//     return res.status(201).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error creating manager",
//     });
//   }
// };

// const deleteManger = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const role = req.user.role;

//     if (role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied",
//       });
//     }

//     const deleteManager = await pool.query(
//       `DELETE FROM users WHERE id = $1 RETURNING *`,
//       [id],
//     );

//     if (deleteManager.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Manager not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Employee deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Deleted failed",
//     });
//   }
// };


// const getNotifications = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const result = await pool.query(
//       `
//         SELECT * FROM notifications
//         WHERE user_id = $1
//         ORDER BY created_at DESC
//       `,
//       [userId],
//     );

//     const unreadCount = await pool.query(
//       `
//       SELECT COUNT(*)
//       FROM notifications
//       WHERE user_id = $1
//       AND is_read = false
//     `,
//       [userId],
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//       unreadCount: Number(unreadCount.rows[0].count),
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error getting notifications" });
//   }
// };

// const markAllNotificationsAsRead = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const result = await pool.query(
//       `
//       UPDATE notifications
//       SET is_read = true
//       WHERE user_id = $1
//       AND is_read = false
//       `,
//       [userId],
//     );

//     return res.status(200).json({
//       success: true,
//       message: "All notifications marked as read",
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to update notifications" });
//   }
// };



// const createTask = async (req, res) => {
//   try {
//     const { title, description, priority, assigned_to, project, due_date } =
//       req.body;

//     const created_by = req.user.id;

//     const result = await pool.query(
//       `
//         INSERT INTO task (title, description, priority, assigned_to, created_by, project_id, due_date)
//         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
//       `,
//       [
//         title,
//         description,
//         priority,
//         assigned_to,
//         created_by,
//         project,
//         due_date,
//       ],
//     );
//     console.log(result);

//     const taskId = result.rows[0].id;
//     await pool.query(
//       `
//         INSERT INTO task_activity_logs (
//           task_id,
//           user_id,
//           action_type,
//           message
//         )
//         VALUES ($1, $2, $3, $4)
//       `,
//       [taskId, req.user.id, "Task created", "New Task created"],
//     );
//     await createNotification(
//       assigned_to,
//       'New Task Assigned',
//       `You have been assigned "${title}"`
//     )

//     return res.status(201).json({
//       success: true,
//       data: result.rows[0],
//     });

//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       success: false,
//       message: "Error creating task",
//     });
//   }
// };

// const createTask = async (req, res) => {
//   try {
//     const { title, description, priority, assigned_to, project, due_date } =
//       req.body;
      
//     const created_by = req.user.id;

//     const result = await pool.query(
//       `
//       WITH new_task AS (
//         INSERT INTO task (
//           title,
//           description,
//           priority,
//           assigned_to,
//           created_by,
//           project_id,
//           due_date
//         )
//         VALUES ($1,$2,$3,$4,$5,$6,$7)
//         RETURNING *
//       ),
//       activity_log AS (
//         INSERT INTO task_activity_logs (
//           task_id,
//           user_id,
//           action_type,
//           message
//         )
//         SELECT
//           id,
//           $5,
//           'Task created',
//           'New Task created'
//         FROM new_task
//       )
//       SELECT * FROM new_task;
//       `,
//       [
//         title,
//         description,
//         priority,
//         assigned_to,
//         created_by,
//         project,
//         due_date,
//       ],
//     );

//     const task = result.rows[0];

//     void createNotification(
//       assigned_to,
//       "New Task Assigned",
//       `You have been assigned "${title}"`,
//     );

//     return res.status(201).json({
//       success: true,
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error creating task",
//     });
//   }
// };

// const getAllTask = async (req, res) => {
//   try {
//     const page = 1;
//     const limit = 6;
//     const skip = (page - 1) * limit;
//     let query = `
//       SELECT task.id, task.title, task.description, task.status, task.priority, task.due_date,
//           task.assigned_to,
//           assignedUser.firstname AS assigned_employee,

//           task.created_by,
//           createdUser.firstname AS created_employee,
          
//           task.project_id,
//           projects.title AS project_name

//         FROM task

//         JOIN users AS assignedUser
//           ON assignedUser.id = task.assigned_to

//         JOIN users AS createdUser
//           ON createdUser.id = task.created_by

//         LEFT JOIN projects
//           ON projects.id = task.project_id`;
//     let values = [];

//     // employee
//     if (req.user.role === "employee") {
//       query += `
//         WHERE assigned_to = $1
//         ORDER BY task.created_at DESC
//       `;
//       values = [req.user.id];
//     } else if (req.user.role === "manager") {
//       query += `
//         WHERE projects.created_by = $1
//         ORDER BY task.created_at DESC
//       `;
//       values = [req.user.id];
//     }

//     // admin or manager
//     else if (req.user.role === "admin") {
//       query += `
//         ORDER BY task.created_at DESC
//       `;
//     }

//     const allTask = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: allTask.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "failed to get tasks" });
//   }
// };

// const getTaskById = async (req, res) => {
//   try {
//     const { id: taskId } = req.params;
//     // console.log(taskId);

//     const result = await pool.query(
//       `
//         SELECT task.id, task.title, task.description, task.status, task.priority, task.due_date,
//           task.assigned_to,
//           assignedUser.firstname AS assigned_employee,

//           task.created_by,
//           createdUser.firstname AS created_employee,
          
//           task.project_id,
//           projects.title AS project_name

//         FROM task

//         JOIN users AS assignedUser
//           ON assignedUser.id = task.assigned_to

//         JOIN users AS createdUser
//           ON createdUser.id = task.created_by

//         LEFT JOIN projects
//           ON projects.id = task.project_id

//         WHERE task.id = $1
//         `,
//       [taskId],
//     );

//     if (result.rows.length === 0) {
//       return res.json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching task details",
//     });
//   }
// };

// const getMyTasks = async (req, res) => {
//   try {
//     const employeeId = req.user.id;
//     const result = await pool.query(
//       `
//       SELECT * FROM task
//       WHERE id = $1
//       `, [employeeId]
//     )

//     return res.status(200).json({
//       success: true,
//       data: result.rows
//     })

//   } catch (error) {
//     return res.status(500).json({
//       success: false ,
//       message: 'Error fetching my tasks'
//     })
//   }
// }

// const updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       description,
//       priority,
//       assigned_to,
//       project_id,
//       due_date,
//       status,
//     } = req.body;

//     // activity log
//     const existingTask = await pool.query(
//       `
//         SELECT *
//         FROM task
//         WHERE id = $1
//       `,
//       [id],
//     );
//     const oldTask = existingTask.rows[0];
//     // activity log end

//     const result = await pool.query(
//       `
//         UPDATE task
//           SET title = $1, description = $2, priority=$3, assigned_to=$4, project_id=$5 , due_date=$6 ,status=$7
//           WHERE id = $8
//           RETURNING *
//       `,
//       [
//         title,
//         description,
//         priority,
//         assigned_to,
//         project_id,
//         due_date,
//         status,
//         id,
//       ],
//     );

//     if (result.rows.length === 0) {
//       return res.json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     // activity log
//     const taskId = result.rows[0].id;
//     const oldAssignedUser = await pool.query(
//       `
//           SELECT firstname
//           FROM users
//           WHERE id = $1
//         `,
//       [oldTask.assigned_to],
//     );
//     // console.log("oldAssignedUser", oldAssignedUser);

//     const newAssignedUser = await pool.query(
//       `
//           SELECT firstname
//           FROM users
//           WHERE id = $1
//         `,
//       [assigned_to],
//     );
//     // console.log("newAssignedUser", newAssignedUser);

//     if (oldTask.status !== status) {
//       await createTaskLog(
//         taskId,
//         req.user.id,
//         "STATUS_UPDATED",
//         `Status changed from ${oldTask.status} to ${status}`,
//       );
//       await createNotification(
//         oldTask.assigned_to,
//         "Status Updated",
//         `status from "${oldTask.status}" to "${status}" of "${oldTask.title}"`,
//       );
//     }
//     if (oldTask.priority !== priority) {
//       await createTaskLog(
//         taskId,
//         req.user.id,
//         "PRIORITY_UPDATE",
//         `Priority changed from ${oldTask.priority} to ${priority}`,
//       );
//       await createNotification(
//         oldTask.assigned_to,
//         "Priority Update",
//         `Priority changed from ${oldTask.priority} to ${priority} of "${oldTask.title}"`,
//       );
//     }
//     if (oldTask.assigned_to !== assigned_to) {
//       await createTaskLog(
//         taskId,
//         req.user.id,
//         "ASSIGNED_TO_UPDATE",
//         `Assigned to changed from ${oldAssignedUser.rows[0].firstname} to ${newAssignedUser.rows[0].firstname}`,
//       );
//       await createNotification(
//         assigned_to,
//         "Task Assigned",
//         `You have been assigned "${title}"`,
//       );
//     }
//     if (oldTask.title !== title) {
//       await createTaskLog(
//         taskId,
//         req.user.id,
//         "TITLE_UPDATED",
//         `Title changed from ${oldTask.title} to ${title}`,
//       );
//       await createNotification(
//         oldTask.assigned_to,
//         "Title Updated",
//         `Title changed from ${oldTask.title} to ${title}`,
//       );
//     }
//     if (oldTask.description !== description) {
//       await createTaskLog(
//         taskId,
//         req.user.id,
//         "DESCRIPTION_UPDATED",
//         `Description changed from ${oldTask.description} to ${description}`,
//       );
//       await createNotification(
//         oldTask.assigned_to,
//         "Description Updated",
//         `Description changed from ${oldTask.description} to ${description} of "${oldTask.title}"`,
//       );
//     }
//     // activity log end

//     return res.status(200).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Task update failed",
//     });
//   }
// };

// const updateTaskStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const userId = req.user.id;

//     // Check task belongs to employee
//     const existingTask = await pool.query(
//       `
//           SELECT *
//           FROM task

//           WHERE id = $1
//           AND assigned_to = $2
//         `,
//       [id, userId],
//     );

//     if (existingTask.rows.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     const oldTask = existingTask.rows[0];

//     // Update only status
//     const result = await pool.query(
//       `
//           UPDATE task

//           SET status = $1

//           WHERE id = $2

//           RETURNING *
//         `,
//       [status, id],
//     );

//     // Activity Log
//     if (oldTask.status !== status) {
//       await createTaskLog(
//         id,
//         userId,
//         "STATUS_UPDATED",
//         `Status changed from ${oldTask.status} to ${status}`,
//       );
//     }

//     const employee = await pool.query(
//       `
//       SELECT firstname
//       FROM users
//       WHERE id = $1
//       `,
//       [userId],
//     );

//     const employeeName = employee.rows[0].firstname;

//     await createNotification(
//       oldTask.created_by,
//       "Task Status Updated",
//       `${employeeName} change Task Status "${oldTask.status}" to "${status}"`,
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error updating task status",
//     });
//   }
// };

// const deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const taskResult = await pool.query(
//       `
//         SELECT title, assigned_to 
//         FROM task
//         WHERE id = $1
//       `,
//       [id],
//     );
//     const task = taskResult.rows[0];

//     const userResult = await pool.query(
//       `
//         SELECT firstname, role 
//         FROM users 
//         WHERE id = $1
//       `,
//       [req.user.id],
//     );
//     const deleteBy = userResult.rows[0];

//     await pool.query(
//       `
//         DELETE FROM task
//         WHERE id = $1
//       `,
//       [id],
//     );

//     await createNotification(
//       task.assigned_to,
//       "Task Removed",
//       `The task "${task.title}" has been removed by "${deleteBy.firstname}" (${deleteBy.role}) `,
//     );

//     return res.json({
//       success: true,
//       message: "Task deleted",
//     });
//   } catch (error) {
//     return res.json({
//       success: false,
//       message: "Task deleting failed",
//     });
//   }
// };





// const createProject = async (req, res) => {
//   try {
//     const { title, description, start_date, end_date } = req.body;
//     const created_by = req.user.id;
//     const role = req.user.role;
//     const userDeptId = req.user.department_id;

//     const result = await pool.query(
//       `
//         INSERT INTO projects (title, description, start_date, end_date, created_by)
//           VALUES ($1,$2,$3,$4,$5)
//         RETURNING *
//       `,
//       [title, description, start_date, end_date, created_by],
//     );

//     const projectId = result.rows[0].id;
//     await pool.query(
//       `
//         INSERT INTO project_activity_logs (
//           project_id,
//           user_id,
//           action_type,
//           message
//         )

//         VALUES ($1, $2, $3, $4)
//       `,
//       [projectId, req.user.id, "Task created", "New Task created"],
//     );

//     const admins = await pool.query(
//       `
//       SELECT id
//       FROM users
//       WHERE role = 'admin'
//       `,
//     );

//     const project_created_by = await pool.query(
//       `
//       SELECT firstname
//       FROM users
//       WHERE id = $1
//       `,
//       [created_by],
//     );
//     const created_by_Name = project_created_by.rows[0].firstname;

//     await Promise.all(
//       admins.rows.map((admin) =>
//         createNotification(
//           admin.id,
//           "New Project Created",
//           ` ${title} project has been created by ${created_by_Name} `,
//         ),
//       ),
//     );

//     return res.status(201).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server Error Creating Project",
//     });
//   }
// };

// const getProjects = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = "";
//     let values = [];

//     if (role === "manager") {
//       query = `
//             SELECT projects.id, projects.title, projects.description, projects.status, projects.start_date, projects.end_date,
//               projects.created_by,

//               users.firstname AS created_by 
            
//               FROM projects
//               JOIN users
//               ON users.id = projects.created_by

//               WHERE created_by = $1
//         `;
//       values = [userId];
//     } else if (role === "employee") {
//       query = `
//           SELECT DISTINCT
//             projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
//             projects.end_date, projects.created_at,
//             users.firstname AS created_by

//             FROM projects

//             JOIN users
//             ON users.id = projects.created_by

//             JOIN task
//               ON task.project_id = projects.id

//             WHERE task.assigned_to = $1 

//             ORDER BY projects.created_at DESC
//         `;
//       values = [userId];
//     } else if (role === "admin") {
//       query = `
//             SELECT projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
//             projects.end_date,
//             users.firstname AS created_by

//             FROM projects

//             JOIN users
//             ON users.id = projects.created_by

//             ORDER BY projects.created_at DESC
//         `;
//     }

//     const result = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error getting new project",
//     });
//   }
// };

// const getProjectById = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;
//     const result = await pool.query(
//       ` 
//         SELECT projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
//             projects.end_date,
//           users.firstname AS created_by,

//           COUNT(task.id) AS total_tasks,
//           COUNT(
//           CASE
//             WHEN task.status = 'completed'
//             THEN 1
//             END
//           ) AS completed_tasks
        
//           FROM projects

//           JOIN users
//           ON users.id = projects.created_by  

//           LEFT JOIN task
//           ON task.project_id = projects.id

//           WHERE projects.id = $1

//           GROUP BY
//             projects.id,
//             users.firstname
//       `,
//       [id],
//     );
//     const project = result.rows[0];

//     const totalTasks = Number(project.total_tasks);
//     const completedTasks = Number(project.completed_tasks);

//     project.progress =
//       totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

//     return res.status(200).json({
//       success: true,
//       data: project,
//       // data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "error getting project-details",
//     });
//   }
// };

// const getProjectTasks = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // console.log("id", id);
//     const result = await pool.query(
//       `
//         SELECT task.id, task.title, task.description, task.status, task.priority, 
//             task.project_id, projects.title AS project_name,
//             task.assigned_to, assignedUser.firstname AS assigned_employee,
//             task.created_by, createdUser.firstname AS created_employee,
//             task.due_date

//         FROM task

//         JOIN projects
//           ON projects.id = task.project_id

//         JOIN users AS assignedUser
//           ON assignedUser.id = task.assigned_to 
          
//         JOIN users AS createdUser
//           ON createdUser.id = task.created_by

//           WHERE task.project_id = $1 

//       `,
//       [id],
//     );
//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "error to get task by project",
//     });
//   }
// };

// const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, status, start_date, end_date } = req.body;

//     // activity log
//     const existingProject = await pool.query(
//       `
//         SELECT *
//           FROM projects
//           WHERE id = $1
//       `,
//       [id],
//     );
//     const oldProject = existingProject.rows[0];
//     // activity log end

//     const result = await pool.query(
//       `
//         UPDATE projects
//         SET title = $1, description = $2, status=$3, start_date=$4, end_date=$5
//             WHERE id = $6
//         RETURNING *
//       `,
//       [title, description, status, start_date, end_date, id],
//     );

//     if (result.rows.length === 0) {
//       return res.json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     // activity log
//     if (oldProject.status !== status) {
//       await createProjectLog(
//         id,
//         req.user.id,
//         "STATUS_UPDATED",
//         `Status changed from ${oldProject.status} to ${status}`,
//       );
//     }
//     if (oldProject.title !== title) {
//       await createProjectLog(
//         id,
//         req.user.id,
//         "TITLE_UPDATED",
//         `Title changed from ${oldProject.title} to ${title}`,
//       );
//     }
//     if (oldProject.description !== description) {
//       await createProjectLog(
//         id,
//         req.user.id,
//         "DESCRIPTION_UPDATED",
//         `Description changed from ${oldProject.description} to ${description}`,
//       );
//     }
//     // activity log end

//     return res.status(200).json({
//       success: true,
//       message: "Project Updated Successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Project not found",
//     });
//   }
// };

// const deleteProject = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `
//         DELETE FROM projects
//           WHERE id = $1
//           RETURNING *
//       `,
//       [id],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Project created successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server Error when Deleting Project",
//     });
//   }
// };





// const dashboard = async (req, res) => {
//   try {
//     const role = req.user.role;
//     let query = "";
//     let values = [];

//     if (role === "admin") {
//       query = `
//           SELECT
//             (SELECT COUNT(*) FROM departments) AS totalDepartments,
            
//             (SELECT COUNT(*) FROM users
//             WHERE role = 'manager') AS totalManagers,

//             (SELECT COUNT(*) FROM users
//             WHERE role = 'employee') AS totalEmployees,
            
//             (SELECT COUNT(*) FROM projects) AS totalProjects,
            
//             (SELECT COUNT(*) FROM task) AS totalTasks
//         `;
//     } else if (role === "manager") {
//       query = `
//            SELECT
//             (SELECT COUNT(*) FROM projects
//             WHERE created_by = $1) AS myProjects,

//             (SELECT COUNT(*) FROM task
//             WHERE created_by = $1) AS myTasks,

//             (SELECT COUNT(*) FROM task
//             WHERE created_by = $1 
//             AND status = 'completed') AS completedTasks,

//              (SELECT COUNT(*) FROM task
//             WHERE created_by = $1 
//             AND status = 'pending') AS pendingTasks,

//             (SELECT COUNT(*) FROM users
//             WHERE role  = 'employee' 
//             AND department_id = $2) AS departmentEmployees
//         `;
//       values = [req.user.id, req.user.department_id];
//     } else if (role === "employee") {
//       query = `
//           SELECT
//             (SELECT COUNT(*) FROM task
//             WHERE assigned_to = $1) AS assignedTasks,

//              (SELECT COUNT(*) FROM task
//             WHERE assigned_to = $1 
//             AND status = 'completed') AS completedTasks,

//             (SELECT COUNT(*) FROM task
//             WHERE assigned_to = $1 
//             AND status = 'pending') AS pendingTasks,

//             (SELECT COUNT(*) FROM task
//             WHERE assigned_to = $1
//             AND due_date BETWEEN NOW()
//             AND NOW() + INTERVAL '3  days'
//             AND status != 'COMPLETED') AS upcomingDeadlines

//         `;
//       values = [req.user.id];
//     }

//     const result = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error occur dashboard analytics",
//     });
//   }
// };



// task comment
// const createComment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { comment, taskId } = req.body;
//     // console.log("taskId", taskId);
//     const result = await pool.query(
//       `
//         INSERT INTO task_comments (comment,user_id,task_id)
//           VALUES ($1,$2,$3 )
//           RETURNING *
//       `,
//       [comment, userId, taskId],
//     );
//     return res.status(201).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error making comment",
//     });
//   }
// };

// const getComments = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const result = await pool.query(
//       `
//       SELECT task_comments.comment, task_comments.id, task_comments.created_at, task_comments.user_id,
//       users.firstname AS comment_by , task_comments.task_id

//        FROM task_comments

//        JOIN users
//        ON users.id = task_comments.user_id
       
//        WHERE task_id = $1
//        ORDER BY task_comments.created_at DESC
//     `,
//       [taskId],
//     );
//     res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "error fetching comments",
//     });
//   }
// };




// const getLog = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const result = await pool.query(
//       `
//         SELECT task_activity_logs.action_type, task_activity_logs.created_at, task_activity_logs.message,
//         users.firstname AS updatedby 

//         FROM task_activity_logs

//         JOIN users
//         ON users.id = task_activity_logs.user_id

//         WHERE task_activity_logs.task_id = $1

//         ORDER BY task_activity_logs.created_at DESC

//       `,
//       [taskId],
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "error occur during get logs",
//     });
//   }
// };

// const getProjectLog = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const result = await pool.query(
//       `
//         SELECT  project_activity_logs.action_type, project_activity_logs.created_at, project_activity_logs.message,
//           users.firstname AS updatedby

//         FROM project_activity_logs

//         JOIN users
//         ON users.id = project_activity_logs.user_id

//         WHERE project_id = $1

//         ORDER BY project_activity_logs.created_at DESC
//       `,
//       [projectId],
//     );
//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "error occur during get Project logs",
//     });
//   }
// };


// project comment
// const createProjectComment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { comment, projectId } = req.body;

//     const result = await pool.query(
//       `
//         INSERT INTO project_comments (comment, project_id, user_id)
//         VALUES ($1, $2, $3)
//           RETURNING *
//       `,
//       [comment, projectId, userId],
//     );
//     return res.status(201).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error making project comment",
//     });
//   }
// };

// const getProjectComments = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     // console.log("projectId", projectId);

//     const result = await pool.query(
//       `
//         SELECT project_comments.comment, project_comments.created_at, project_comments.user_id,
//         users.firstname AS comment_by
        
//         FROM project_comments

//         JOIN users
//         ON users.id = project_comments.user_id

//         WHERE project_id = $1

//         ORDER BY project_comments.created_at DESC

//       `,
//       [projectId],
//     );
//     res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "error fetching Project Comments",
//     });
//   }
// };



// const checkInAttendance = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { checkInDate } = req.body;

//     const existingAttendance = await pool.query(
//       `
//         SELECT * FROM attendance
//         WHERE user_id = $1
//         AND attendance_date = CURRENT_DATE
//       `,
//       [userId],
//     );

//     if (existingAttendance.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already checked in today",
//       });
//     }

//     const result = await pool.query(
//       `
//         INSERT INTO attendance(user_id, check_in, attendance_date)
//         VALUES ($1, $2, CURRENT_DATE)
//       `,
//       [userId, checkInDate],
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Checked in successfully",
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "error on check_in",
//     });
//   }
// };

// const checkOutAttendance = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { checkOutDate } = req.body;

//     const attendance = await pool.query(
//       `
//         SELECT * FROM attendance
//         WHERE user_id = $1
//         AND attendance_date = CURRENT_DATE
//       `,
//       [userId],
//     );

//     if (attendance.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please check In first",
//       });
//     }

//     if (attendance.rows[0].chech_out) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already checked out today",
//       });
//     }

//     const result = await pool.query(
//       `
//         UPDATE attendance
//         SET chech_out = $1
//         WHERE user_id = $2
//         AND attendance_date = CURRENT_DATE
//       `,
//       [checkOutDate, userId],
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Checked Out successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "error on check_out",
//     });
//   }
// };

// const getAllAttendance = async (req, res) => {
//   try {
//     const role = req.user.role;
//     const userId = req.user.id;

//     let query = "";
//     let values = [];
//     if (role === "admin") {
//       query = `
//         SELECT check_in, chech_out, attendance_date, 
//         users.firstname, users.lastname, users.role
//         FROM attendance

//         JOIN users
//         ON users.id = attendance.user_id
        
//         ORDER BY attendance.attendance_date DESC
//         `;
//     } else if (role === "manager") {
//       const manager = await pool.query(
//         `
//           SELECT department_id
//           FROM users
//           WHERE id = $1
//           `,
//         [userId],
//       );

//       const departmentId = manager.rows[0].department_id;
//       query = `
//           SELECT
//             attendance.*,
//             users.firstname,
//             users.lastname,
//             users.role

//           FROM attendance

//           JOIN users
//             ON users.id = attendance.user_id

//           WHERE users.department_id = $1

//           ORDER BY attendance.attendance_date DESC
//           `;
//       values = [departmentId];
//     } else if (role === "employee") {
//       query = `
//         SELECT check_in, chech_out, attendance_date, 
//         users.firstname, users.lastname, users.role
//         FROM attendance

//         JOIN users
//         ON users.id = attendance.user_id

//         WHERE users.id = $1
        
//         ORDER BY attendance.attendance_date DESC
//         `;
//       values = [userId];
//     }

//     const result = await pool.query(query, values);

//     const attendance = result.rows.map((row) => {
//       let hours = null;
//       if (row.check_in && row.chech_out) {
//         hours =
//           (new Date(row.chech_out) - new Date(row.check_in)) / (1000 * 60 * 60);
//       }
//       return {
//         ...row,
//         hours: hours?.toFixed(2),
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: attendance,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "error on get all attendance",
//     });
//   }
// };

// const getTodayAttendance = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `
//       SELECT  check_in, chech_out
//       FROM attendance
//       WHERE user_id = $1
//       AND attendance_date = CURRENT_DATE
//     `,
//       [req.user.id],
//     );
//     return res.json({
//       success: true,
//       data: result.rows[0] || null,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "error on get today's attendance",
//     });
//   }
// };




// const applyLeave = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { leave_type, start_date, end_date, reason } = req.body;

//     const result = await pool.query(
//       `
//         INSERT INTO leave_requests(user_id, leave_type, start_date, end_date, reason)
//         VALUES($1,$2,$3,$4,$5)
//       `,
//       [userId, leave_type, start_date, end_date, reason],
//     );

//     const user = await pool.query(
//       `
//       SELECT firstname
//       FROM users
//       WHERE id = $1
//       `,
//       [userId],
//     );
//     const firstName = user.rows[0].firstname;

//     const employee = await pool.query(
//       `
//         SELECT department_id
//         FROM users
//         WHERE id = $1
//         `,
//       [userId],
//     );

//     const departmentId = employee.rows[0].department_id;

//     const managers = await pool.query(
//       `
//       SELECT id
//       FROM users
//       WHERE role = 'manager'
//       AND department_id = $1
//       `,
//       [departmentId],
//     );

//     const admins = await pool.query(
//       `
//       SELECT id
//       FROM users
//       WHERE role = 'admin'
//       `,
//     );
//     const recipients = [...admins.rows, ...managers.rows];
//     await Promise.all(
//       recipients.map((user) =>
//         createNotification(
//           user.id,
//           "New Leave Request",
//           `${firstName} applied for ${leave_type} Leave`,
//         ),
//       ),
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.rows[0],
//       message: "leave applied successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "error in applying leave",
//     });
//   }
// };

// const myLeave = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const result = await pool.query(
//       `
//         SELECT leave_requests.* ,

//         approvedUser.firstname AS approved_by_name,
//         approvedUser.role AS approved_by_role

//         FROM leave_requests

//             LEFT JOIN users AS approvedUser
//             ON approvedUser.id = leave_requests.approved_by

//         WHERE user_id = $1 

//         ORDER BY leave_requests.created_at DESC
//       `,
//       [userId],
//     );
//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error to get leaves",
//     });
//   }
// };

// const leaves = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userRole = req.user.role;
//     let query = "";
//     let values = [];

//     if (userRole === "admin") {
//       query = `
//           SELECT leave_requests.* ,
//             users.firstname, users.lastname,

//             approvedUser.firstname AS approved_by_name,
//             approvedUser.role AS approved_by_role

//           FROM leave_requests

//           JOIN users
//           ON users.id = leave_requests.user_id

//            LEFT JOIN users AS approvedUser
//             ON approvedUser.id = leave_requests.approved_by

//           ORDER BY leave_requests.created_at DESC

//         `;
//     } else if (userRole === "manager") {
//       const manager = await pool.query(
//         `
//             SELECT department_id
//             FROM users
//             WHERE id = $1
//             `,
//         [userId],
//       );

//       const departmentId = manager.rows[0].department_id;

//       query = `
//           SELECT leave_requests.*,
//             users.firstname,
//             users.lastname,
//             users.role,

//           approvedUser.firstname AS approved_by_name,
//           approvedUser.role AS approved_by_role

//           FROM leave_requests

//           JOIN users
//           ON users.id = leave_requests.user_id

//           LEFT JOIN users AS approvedUser
//           ON approvedUser.id = leave_requests.approved_by

//           WHERE users.department_id = $1
          
//           ORDER BY leave_requests.created_at DESC
//         `;
//       values = [departmentId];
//     }
//     const result = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "error on get leaves",
//     });
//   }
// };

// const updateLeaveStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { status } = req.body;
//     const { leaveId } = req.params;

//     const leave = await pool.query(
//       `
//       SELECT user_id
//       FROM leave_requests
//       WHERE id = $1
//       `,
//       [leaveId],
//     );

//     if (leave.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Leave request not found",
//       });
//     }

//     if (leave.rows[0].user_id === userId) {
//       return res.status(403).json({
//         success: false,
//         message: `You cannot approve / reject your own leave request`,
//       });
//     }

//     const result = await pool.query(
//       `
//         UPDATE leave_requests
//         SET status = $1, approved_by = $3
//         WHERE id = $2
//         RETURNING *
//       `,
//       [status, leaveId, userId],
//     );
//     const approvedRejectedBy = await pool.query(
//       `
//         SELECT firstname, role
//         FROM users
//         WHERE id = $1
//       `,
//       [userId],
//     );
//     const by_name = approvedRejectedBy.rows[0].firstname;
//     const role = approvedRejectedBy.rows[0].role;

//     await createNotification(
//       leave.rows[0].user_id,
//       `Leave ${status}`,
//       `Your leave request has been  ${status} by ${by_name} (${role})`,
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Leave status update failed",
//     });
//   }
// };

// const updateleave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { leave_type, start_date, end_date, reason } = req.body;

//     const leave = await pool.query(
//       `
//         SELECT status
//         FROM leave_requests
//         WHERE id = $1
//       `, [id]
//     )
//     if(leave.rows[0].status !== 'pending'){
//       return res.status(400).json({
//         success: false,
//         message: 'Only pending leave requests can be edited'
//       })
//     }
//     const result = await pool.query(
//       ` 
//         UPDATE leave_requests
//         SET leave_type = $1, start_date = $2, end_date=$3, reason=$4
//         WHERE id = $5 
//       `, [leave_type, start_date, end_date, reason, id]
//     )
//     return res.status(200).json({
//       success: true,
//       message: "Leave Request Updated Successfully",
//     });

//   } catch (error) {
//      return res.status(500).json({
//       success: false,
//       message: "Leave Request Updating failed",
//     });
//   }
// }



// const getCalendarEvents = async (req, res) => {
//   try {
//     const userRole = req.user.role;

//     let task;
//     let leaves;
//     let projects;

//    if (userRole === 'admin'){
//      task = await pool.query(
//       ` 
//         SELECT id, title, due_date AS event_date, 'TASK' AS type
//         FROM task
//         WHERE due_date IS NOT NULL
//        `
//     );

//     leaves = await pool.query(
//       `
//         SELECT leave_requests.id, 
//         CONCAT(users.firstname, ' Leave') AS title,
//         start_date AS event_date,
//         'LEAVE' AS type

//         FROM leave_requests

//         JOIN users
//         ON users.id = leave_requests.user_id

//         WHERE leave_requests.status = 'approved'
//       `
//     );

//      projects = await pool.query(
//       `
//         SELECT id, title, end_date AS event_date, 'PROJECT' AS type
//         FROM projects
//         WHERE end_date IS NOT NULL
//       `
//     );
//    }
//    else if (userRole === 'manager'){

//     const manager = await pool.query(
//       `
//       SELECT department_id
//       FROM users
//       WHERE id = $1
//       `,
//       [req.user.id]
//     );

//     const departmentId =  manager.rows[0].department_id;

//     task = await pool.query(
//       `
//         SELECT task.id, task.title, task.due_date AS event_date, 'TASK' AS type
//         FROM task
        
//         JOIN users 
//         ON users.id = task.assigned_to

//         WHERE users.department_id = $1
//       `, [departmentId]
//     );

//     leaves = await pool.query(
//       `
//         SELECT leave_requests.id, 
//         CONCAT(users.firstname, ' Leave') AS title,
//         start_date AS event_date,
//         'LEAVE' AS type

//         FROM leave_requests

//         JOIN users
//         ON users.id = leave_requests.user_id

//         WHERE users.department_id = $1
//         AND leave_requests.status = 'approved'
//       `, [departmentId]
//     );

//     projects = await pool.query(
//       `
//         SELECT id, title, end_date AS event_date, 'PROJECT' AS type
//         FROM projects

//         WHERE end_date IS NOT NULL
//       `
//     );
    
//    }
//    else if (userRole === 'employee') {
//     const userId = req.user.id;
    
//      task = await pool.query(
//       ` 
//         SELECT id, title, due_date AS event_date, 'TASK' AS type
//         FROM task

//         WHERE task.assigned_to = $1
//        `, [userId]
//     );

//     leaves = await pool.query(
//       `
//         SELECT
//           leave_requests.id,
//           'My Leave' AS title,
//           start_date AS event_date,
//           'LEAVE' AS type

//         FROM leave_requests

//         WHERE leave_requests.user_id = $1
//         AND leave_requests.status = 'approved'
//       `, [userId]
//     );

//     projects = await pool.query(
//       `
//         SELECT DISTINCT
//           projects.id,
//           projects.title,
//           projects.end_date AS event_date,
//           'PROJECT' AS type

//         FROM projects

//         JOIN task ON task.project_id = projects.id

//         WHERE task.assigned_to = $1
//         AND projects.end_date IS NOT NULL
//       `, [userId]
//     );

//    }

//   return res.json({
//     success: true,
//     data: [
//       ...task.rows,
//       ...leaves.rows,
//       ...projects.rows
//     ]
//   });
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch calendar events'
//     });
//   }
// }



export {
  // registerUser,
  // loginUser,
  // getUsers,
  // updateUser,
  // deleteUser,

  // updateProfile,
  // changeUserPassword,

  
  // createDepartment,
  // getDepartment,
  // updateDepartment,
  // deleteDepartment,




  // createEmployee,
  // getAllEmployee,
  // deleteEmployee,
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
  // getProjects,
  // getProjectById,
  // getProjectTasks,
  // updateProject,
  // deleteProject,


  // dashboard,

  //  checkInAttendance,
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
 
  
  // getCalendarEvents
};
