import pool from "../../config/db.js";

export const createNewProject = async (
  title,
  description,
  start_date,
  end_date,
  created_by,
) => {
  return await pool.query(
    `
            INSERT INTO projects (title, description, start_date, end_date, created_by)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `,
    [title, description, start_date, end_date, created_by],
  );
};

export const insertIntoActivityLog = async (projectId, created_by) => {
  return await pool.query(
    `
        INSERT INTO project_activity_logs (
          project_id,
          user_id,
          action_type,
          message
        )

        VALUES ($1, $2, $3, $4)
        `,
    [projectId, created_by, "Task created", "New Task created"],
  );
};

export const getAllAdmin = async () => {
  return await pool.query(
    `
            SELECT id
            FROM users
            WHERE role = 'admin'
        `,
  );
};

export const getProjectCreator = async (created_by) => {
  return await pool.query(
    `
            SELECT firstname
            FROM users
            WHERE id = $1
        `,
    [created_by],
  );
};

export const getProjectsByManager = async (userId) => {
  return await pool.query(
    `
            SELECT projects.id, projects.title, projects.description, projects.status, projects.start_date, projects.end_date,
              projects.created_by,

              users.firstname AS created_by 
            
              FROM projects
              JOIN users
              ON users.id = projects.created_by

              WHERE created_by = $1
        `,
    [userId],
  );
};

export const getProjectsByemployee = async (userId) => {
  return await pool.query(
    `
            SELECT DISTINCT
            projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
            projects.end_date, projects.created_at,
            users.firstname AS created_by

            FROM projects

            JOIN users
            ON users.id = projects.created_by

            JOIN task
              ON task.project_id = projects.id

            WHERE task.assigned_to = $1 

            ORDER BY projects.created_at DESC
        `,
    [userId],
  );
};

export const getProjectsByAdmin = async () => {
  return await pool.query(
    `
             SELECT projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
            projects.end_date,
            users.firstname AS created_by

            FROM projects

            JOIN users
            ON users.id = projects.created_by

            ORDER BY projects.created_at DESC
        `,
  );
};

export const getProjectById = async (id) => {
  return await pool.query(
    `
        SELECT projects.id, projects.title, projects.description, projects.status, projects.created_by, projects.start_date, 
        projects.end_date,
        users.firstname AS created_by,

        COUNT(task.id) AS total_tasks,
        COUNT(
        CASE
        WHEN task.status = 'completed'
        THEN 1
        END
        ) AS completed_tasks
    
        FROM projects

        JOIN users
        ON users.id = projects.created_by  

        LEFT JOIN task
        ON task.project_id = projects.id

        WHERE projects.id = $1

        GROUP BY
        projects.id,
        users.firstname
        `,
    [id],
  );
};

export const getTasksOfProject = async (id) => {
  return await pool.query(
    `
            SELECT task.id, task.title, task.description, task.status, task.priority, 
            task.project_id, projects.title AS project_name,
            task.assigned_to, assignedUser.firstname AS assigned_employee,
            task.created_by, createdUser.firstname AS created_employee,
            task.due_date

            FROM task

            JOIN projects
            ON projects.id = task.project_id

            JOIN users AS assignedUser
            ON assignedUser.id = task.assigned_to 
            
            JOIN users AS createdUser
            ON createdUser.id = task.created_by

            WHERE task.project_id = $1 

        `,
    [id],
  );
};

export const existingProjectById = async (id) => {
  return await pool.query(
    `
            SELECT *
            FROM projects
            WHERE id = $1
        `,
    [id],
  );
};

export const updateProject = async (
  title,
  description,
  status,
  start_date,
  end_date,
  id,
) => {
  return await pool.query(
    `
            UPDATE projects
            SET title = $1, description = $2, status=$3, start_date=$4, end_date=$5
            WHERE id = $6
            RETURNING *
        `,
    [title, description, status, start_date, end_date, id],
  );
};

export const deleteProjectById = async (id) => {
  return await pool.query(
    `
            DELETE FROM projects
          WHERE id = $1
          RETURNING *
        `,
    [id],
  );
};

export const createProjectComment = async (comment, projectId, userId) => {
  return await pool.query(
    `
            INSERT INTO project_comments (comment, project_id, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
    [comment, projectId, userId],
  );
};

export const getProjectComments = async (projectId) => {
  return await pool.query(
    `
            SELECT project_comments.comment, project_comments.created_at, project_comments.user_id,
        users.firstname AS comment_by
        
        FROM project_comments

        JOIN users
        ON users.id = project_comments.user_id

        WHERE project_id = $1

        ORDER BY project_comments.created_at DESC
        `,
    [projectId],
  );
};

export const getProjectLog = async (projectId) => {
  return await pool.query(
    `
             SELECT  project_activity_logs.action_type, project_activity_logs.created_at, project_activity_logs.message,
            users.firstname AS updatedby

            FROM project_activity_logs

            JOIN users
            ON users.id = project_activity_logs.user_id

            WHERE project_id = $1

            ORDER BY project_activity_logs.created_at DESC
        `,
    [projectId],
  );
};
