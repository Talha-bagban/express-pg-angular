import * as taskRepository from "./task.repository.js";
import { createNotification } from "../../helper/createNotification.helper.js";
import { createTaskLog } from "../../helper/taskLog.helper.js";
import ApiError from "../../utils/ApiError.js";
import pool from "../../config/db.js";

export const createTask = async (
  title,
  description,
  priority,
  assigned_to,
  project,
  due_date,
  created_by,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await taskRepository.createTask(
      client,
      title,
      description,
      priority,
      assigned_to,
      created_by,
      project,
      due_date,
    );

    const task = result.rows[0];

    await createNotification(
      client,
      assigned_to,
      "New Task Assigned",
      `You have been assigned "${title}"`,
    );

    await client.query("COMMIT");

    return task;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllTask = async (userId, role) => {
  if (role === "employee") {
    const tasks = await taskRepository.getEmployeeTasks(userId);
    return tasks.rows;
  } else if (role === "manager") {
    const tasks = await taskRepository.getManagerTasks(userId);
    return tasks.rows;
  } else if (role === "admin") {
    const tasks = await taskRepository.getTasks();
    return tasks.rows;
  }
};

export const getTaskById = async (taskId) => {
  const task = await taskRepository.getTaskByDetail(taskId);

  if (task.rows.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return task.rows[0];
};

export const updateTask = async (
  id,
  title,
  description,
  priority,
  assigned_to,
  project_id,
  due_date,
  status,
  userId
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // activity log
    const existingTask = await taskRepository.getTaskById(client, id);

    const oldTask = existingTask.rows[0];
    // activity log end

    const result = await taskRepository.updateTask(client,
      title,
      description,
      priority,
      assigned_to,
      project_id,
      due_date,
      status,
      id,
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, "Task not found");
    }

    // activity log
    const taskId = result.rows[0].id;
    const oldAssignedUser = await taskRepository.oldAssignedUser(client,
      oldTask.assigned_to,
    );

    // console.log("oldAssignedUser", oldAssignedUser);

    const newAssignedUser = await taskRepository.newAssignedUser(client,assigned_to);
    // console.log("newAssignedUser", newAssignedUser);

    if (oldTask.status !== status) {
      await createTaskLog(
        taskId,
        userId,
        "STATUS_UPDATED",
        `Status changed from ${oldTask.status} to ${status}`,
      );
      await createNotification( client,
        oldTask.assigned_to,
        "Status Updated",
        `status from "${oldTask.status}" to "${status}" of "${oldTask.title}"`,
      );
    }
    if (oldTask.priority !== priority) {
      await createTaskLog(
        taskId,
        userId,
        "PRIORITY_UPDATE",
        `Priority changed from ${oldTask.priority} to ${priority}`,
      );
      await createNotification( client,
        oldTask.assigned_to,
        "Priority Update",
        `Priority changed from ${oldTask.priority} to ${priority} of "${oldTask.title}"`,
      );
    }
    if (oldTask.assigned_to !== assigned_to) {
      await createTaskLog(
        taskId,
        userId,
        "ASSIGNED_TO_UPDATE",
        `Assigned to changed from ${oldAssignedUser.rows[0].firstname} to ${newAssignedUser.rows[0].firstname}`,
      );
      await createNotification( client,
        assigned_to,
        "Task Assigned",
        `You have been assigned "${title}"`,
      );
    }
    if (oldTask.title !== title) {
      await createTaskLog(
        taskId,
        userId,
        "TITLE_UPDATED",
        `Title changed from ${oldTask.title} to ${title}`,
      );
      await createNotification( client,
        oldTask.assigned_to,
        "Title Updated",
        `Title changed from ${oldTask.title} to ${title}`,
      );
    }
    if (oldTask.description !== description) {
      await createTaskLog(
        taskId,
        userId,
        "DESCRIPTION_UPDATED",
        `Description changed from ${oldTask.description} to ${description}`,
      );
      await createNotification( client,
        oldTask.assigned_to,
        "Description Updated",
        `Description changed from ${oldTask.description} to ${description} of "${oldTask.title}"`,
      );
    }
    // activity log end

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error)
    await client.query("ROLLBACK");
     throw error;
  } finally {
    client.release();
  }
};

export const updateTaskStatus = async (id, status, userId) => {
  // Check task belongs to employee
  const existingTask = await taskRepository.isEmployeeTasks(id, userId);

  if (existingTask.rows.length === 0) {
    throw new ApiError(401, "Access denied");
  }

  const oldTask = existingTask.rows[0];

  // Update only status
  const result = await taskRepository.updateTaskStatus(status, id);

  // Activity Log
  if (oldTask.status !== status) {
    await createTaskLog(
      id,
      userId,
      "STATUS_UPDATED",
      `Status changed from ${oldTask.status} to ${status}`,
    );
  }

  const employee = await taskRepository.employeeTask(userId);

  const employeeName = employee.rows[0].firstname;

  await createNotification(
    oldTask.created_by,
    "Task Status Updated",
    `${employeeName} change Task Status "${oldTask.status}" to "${status}"`,
  );

  return result.rows[0];
};

export const deleteTask = async (id, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN")
    const taskResult = await taskRepository.selectTaskById(id);

      const task = taskResult.rows[0];

      const userResult = await taskRepository.userResult(userId);

      const deleteBy = userResult.rows[0];

      await taskRepository.deleteTask(id);

      await createNotification(
        client,
        task.assigned_to,
        "Task Removed",
        `The task "${task.title}" has been removed by "${deleteBy.firstname}" (${deleteBy.role}) `,
      );
      await client.query("COMMIT");
      
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }finally {
    client.release();
  }
};

export const createComment = async (userId, comment, taskId) => {
  const taskComment = await taskRepository.createTaskComment(
    userId,
    comment,
    taskId,
  );

  return taskComment.rows[0];
};

export const getComments = async (taskId) => {
  const result = await taskRepository.getTaskComment(taskId);

  return result.rows;
};

export const getLog = async (taskId) => {
  const logs = await taskRepository.getTaskLogs(taskId);

  return logs.rows;
};
