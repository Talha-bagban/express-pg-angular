import pool from "../../config/db.js";
import { BASE_TASK_QUERY } from "./task.queries.js";


export const createTask = async ( client,
  title,
  description,
  priority,
  assigned_to,
  created_by,
  project,
  due_date,
) => {
  return await client.query(
    `
          WITH new_task AS (
            INSERT INTO task (
            title,
            description,
            priority,
            assigned_to,
            created_by,
            project_id,
            due_date
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        ),
        activity_log AS (
            INSERT INTO task_activity_logs (
            task_id,
            user_id,
            action_type,
            message
            )
            SELECT
            id,
            $5,
            'Task created',
            'New Task created'
            FROM new_task
        )
        SELECT * FROM new_task;
        
        `,
    [title, description, priority, assigned_to, created_by, project, due_date],
  );
};

export const getTasks = async () => {
  return await pool.query(
    `
      ${BASE_TASK_QUERY}
      ORDER BY task.created_at DESC
    `,
  );
};

export const getManagerTasks = async (userId) => {
  return await pool.query(
    `
      ${BASE_TASK_QUERY}
       WHERE projects.created_by = $1
      ORDER BY task.created_at DESC
    `,
    [userId],
  );
};

export const getEmployeeTasks = async (userId) => {
  return await pool.query(
    `
      ${BASE_TASK_QUERY}
      WHERE assigned_to = $1
      ORDER BY task.created_at DESC
    `,
    [userId],
  );
};

export const getTaskByDetail = async (taskId) => {
  return await pool.query(
    `
    SELECT task.id, task.title, task.description, task.status, task.priority, task.due_date,
          task.assigned_to,
          assignedUser.firstname AS assigned_employee,

          task.created_by,
          createdUser.firstname AS created_employee,
          
          task.project_id,
          projects.title AS project_name

        FROM task

        JOIN users AS assignedUser
          ON assignedUser.id = task.assigned_to

        JOIN users AS createdUser
          ON createdUser.id = task.created_by

        LEFT JOIN projects
          ON projects.id = task.project_id

        WHERE task.id = $1
    `,
    [taskId],
  );
};

export const getTaskById = async (client,id) => {
  return await client.query(
    `
       SELECT *
        FROM task
        WHERE id = $1
    `,
    [id],
  );
};

export const updateTask = async (client,
  title,
  description,
  priority,
  assigned_to,
  project_id,
  due_date,
  status,
  id,
) => {
  return await client.query(
    `
      UPDATE task
          SET title = $1, description = $2, priority=$3, assigned_to=$4, project_id=$5 , due_date=$6 ,status=$7
          WHERE id = $8
          RETURNING *
    `,
    [
      title,
      description,
      priority,
      assigned_to,
      project_id,
      due_date,
      status,
      id,
    ],
  );
};

export const oldAssignedUser = async (client,oldTaskAssigned_to) => {
  return await client.query(
    `
     SELECT firstname
      FROM users
      WHERE id = $1
    `,
    [oldTaskAssigned_to],
  );
};

export const newAssignedUser = async (client, newTaskAssigned_to) => {
  return await client.query(
    `
        SELECT firstname
          FROM users
          WHERE id = $1
      `,
    [newTaskAssigned_to],
  );
};

export const isEmployeeTasks = async (id, userId) => {
  return await pool.query(
    `
      SELECT *
        FROM task

        WHERE id = $1
        AND assigned_to = $2
    `,
    [id, userId],
  );
};

export const updateTaskStatus = async (status, id) => {
  return await pool.query(
    ` 
    UPDATE task
      SET status = $1
      WHERE id = $2
      RETURNING *
    `,
    [status, id],
  );
};

export const employeeTask = async (userId) => {
  return await pool.query(
    `
      SELECT firstname
        FROM users
        WHERE id = $1
    `,
    [userId],
  );
};

export const selectTaskById = async (id) => {
  return await pool.query(
    `
      SELECT title, assigned_to 
        FROM task
        WHERE id = $1
    `,[id]
  )
}

export const userResult = async (userId) => {
  return await pool.query(
    `
       SELECT firstname, role 
        FROM users 
        WHERE id = $1
    `,[userId]
  )
}

export const deleteTask = async (id) => {
  return await pool.query(
    `
       DELETE FROM task
        WHERE id = $1
    `,[id]
  )
}

export const createTaskComment = async (userId, comment, taskId) => {
  return await pool.query(
    `
      INSERT INTO task_comments (comment,user_id,task_id)
          VALUES ($1,$2,$3 )
          RETURNING *
    `,[comment, userId, taskId]
  )
}

export const getTaskComment = async (taskId) => {
  return await pool.query(
    `
      SELECT task_comments.comment, task_comments.id, task_comments.created_at, task_comments.user_id,
      users.firstname AS comment_by , task_comments.task_id

       FROM task_comments

       JOIN users
       ON users.id = task_comments.user_id
       
       WHERE task_id = $1
       ORDER BY task_comments.created_at DESC
    `,[taskId]
  )
}

export const getTaskLogs = async (taskId) => {
  return await pool.query(
    `
       SELECT task_activity_logs.action_type, task_activity_logs.created_at, task_activity_logs.message,
        users.firstname AS updatedby 

        FROM task_activity_logs

        JOIN users
        ON users.id = task_activity_logs.user_id

        WHERE task_activity_logs.task_id = $1

        ORDER BY task_activity_logs.created_at DESC
    `, [taskId]
  )
}
