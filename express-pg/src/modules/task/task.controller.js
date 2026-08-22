import { createNotification } from "../../helper/createNotification.helper.js";
import { createTaskLog } from "../../helper/taskLog.helper.js";
import * as taskService from './task.service.js'


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

const createTask = async (req, res) => {
  try {
    const { title, description, priority, assigned_to, project, due_date } =  req.body;
      
    const created_by = req.user.id;

    // const result = await pool.query(
    //   `
    //   WITH new_task AS (
    //     INSERT INTO task (
    //       title,
    //       description,
    //       priority,
    //       assigned_to,
    //       created_by,
    //       project_id,
    //       due_date
    //     )
    //     VALUES ($1,$2,$3,$4,$5,$6,$7)
    //     RETURNING *
    //   ),
    //   activity_log AS (
    //     INSERT INTO task_activity_logs (
    //       task_id,
    //       user_id,
    //       action_type,
    //       message
    //     )
    //     SELECT
    //       id,
    //       $5,
    //       'Task created',
    //       'New Task created'
    //     FROM new_task
    //   )
    //   SELECT * FROM new_task;
    //   `,
    //   [
    //     title,
    //     description,
    //     priority,
    //     assigned_to,
    //     created_by,
    //     project,
    //     due_date,
    //   ],
    // );

    // const task = result.rows[0];

    // void createNotification(
    //   assigned_to,
    //   "New Task Assigned",
    //   `You have been assigned "${title}"`,
    // );

    const data = await taskService.createTask(title, description, priority, assigned_to, project, due_date, created_by);

    return res.status(201).json({
      success: true,
      data: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTask = async (req, res) => {
  try {
    const page = 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    const role = req.user.role;

    // let query = `
    //   SELECT task.id, task.title, task.description, task.status, task.priority, task.due_date,
    //       task.assigned_to,
    //       assignedUser.firstname AS assigned_employee,

    //       task.created_by,
    //       createdUser.firstname AS created_employee,
          
    //       task.project_id,
    //       projects.title AS project_name

    //     FROM task

    //     JOIN users AS assignedUser
    //       ON assignedUser.id = task.assigned_to

    //     JOIN users AS createdUser
    //       ON createdUser.id = task.created_by

    //     LEFT JOIN projects
    //       ON projects.id = task.project_id`;
    // let values = [];

    // // employee
    // if (req.user.role === "employee") {
    //   query += `
    //     WHERE assigned_to = $1
    //     ORDER BY task.created_at DESC
    //   `;
    //   values = [req.user.id];
    // } else if (req.user.role === "manager") {
    //   query += `
    //     WHERE projects.created_by = $1
    //     ORDER BY task.created_at DESC
    //   `;
    //   values = [req.user.id];
    // }

    // // admin or manager
    // else if (req.user.role === "admin") {
    //   query += `
    //     ORDER BY task.created_at DESC
    //   `;
    // }

    // const allTask = await pool.query(query, values);

    const allTask = await taskService.getAllTask(userId, role)

    return res.status(200).json({
      success: true,
      data: allTask,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const data = await taskService.getTaskById(taskId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      assigned_to,
      project_id,
      due_date,
      status,
    } = req.body;
    const userId = req.user.id;

    const data = await taskService.updateTask(id, title,
      description,
      priority,
      assigned_to,
      project_id,
      due_date,
      status,
      userId);

    return res.status(200).json({
      success: true,
      data: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const data = await taskService.updateTaskStatus(id, status, userId);

    return res.status(200).json({
      success: true,
      data: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await taskService.deleteTask(id, userId);

    return res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// task comment
const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment, taskId } = req.body;
    
    const data = await taskService.createComment(userId, comment, taskId);

    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error making comment",
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const data = await taskService.getComments(taskId);
    
   return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLog = async (req, res) => {
  try {
    const { taskId } = req.params;

    const data = await taskService.getLog(taskId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
    createComment,
    getComments,
    getLog
}