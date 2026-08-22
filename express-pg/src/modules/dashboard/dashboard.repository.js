import pool from "../../config/db.js";

export const adminDashboard = async () => {
  return await pool.query(
    `
            SELECT
            (SELECT COUNT(*) FROM departments) AS totalDepartments,
            
            (SELECT COUNT(*) FROM users
            WHERE role = 'manager') AS totalManagers,

            (SELECT COUNT(*) FROM users
            WHERE role = 'employee') AS totalEmployees,
            
            (SELECT COUNT(*) FROM projects) AS totalProjects,
            
            (SELECT COUNT(*) FROM task) AS totalTasks
        `,
  );
};

export const managerDashboard = async (userId, departmentId) => {
  return await pool.query(
    `
         SELECT
            (SELECT COUNT(*) FROM projects
            WHERE created_by = $1) AS myProjects,

            (SELECT COUNT(*) FROM task
            WHERE created_by = $1) AS myTasks,

            (SELECT COUNT(*) FROM task
            WHERE created_by = $1 
            AND status = 'completed') AS completedTasks,

             (SELECT COUNT(*) FROM task
            WHERE created_by = $1 
            AND status = 'pending') AS pendingTasks,

            (SELECT COUNT(*) FROM users
            WHERE role  = 'employee' 
            AND department_id = $2) AS departmentEmployees
        `,
    [userId, departmentId],
  );
};

export const employeeDashboard = async (userId) => {
  return await pool.query(
    `
        SELECT
            (SELECT COUNT(*) FROM task
            WHERE assigned_to = $1) AS assignedTasks,

             (SELECT COUNT(*) FROM task
            WHERE assigned_to = $1 
            AND status = 'completed') AS completedTasks,

            (SELECT COUNT(*) FROM task
            WHERE assigned_to = $1 
            AND status = 'pending') AS pendingTasks,

            (SELECT COUNT(*) FROM task
            WHERE assigned_to = $1
            AND due_date BETWEEN NOW()
            AND NOW() + INTERVAL '3  days'
            AND status != 'COMPLETED') AS upcomingDeadlines
            `,
    [userId],
  );
};

export const getAdminEvents = async () => {
  const task = await pool.query(
     ` 
        SELECT id, title, due_date AS event_date, 'TASK' AS type
        FROM task
        WHERE due_date IS NOT NULL
       `
  );
  const leaves = await pool.query(
    ` SELECT leave_requests.id, 
        CONCAT(users.firstname, ' Leave') AS title,
        start_date AS event_date,
        'LEAVE' AS type

        FROM leave_requests

        JOIN users
        ON users.id = leave_requests.user_id

        WHERE leave_requests.status = 'approved'
      `
  );
  const projects = await pool.query(
    ` SELECT id, title, end_date AS event_date, 'PROJECT' AS type
        FROM projects
        WHERE end_date IS NOT NULL
    `
  );

  return [ 
    ...task.rows,
    ...leaves.rows,
    ...projects.rows
  ]
};

export const getManagerDepartment = async (userId) => {
  return await pool.query(
    `
      SELECT department_id
      FROM users
      WHERE id = $1
    `,[userId]
  )
};

export const getManagerEvents = async (departmentId) => {
  const task = await pool.query(
    ` SELECT task.id, task.title, task.due_date AS event_date, 'TASK' AS type
        FROM task
        
        JOIN users 
        ON users.id = task.assigned_to

        WHERE users.department_id = $1`,[departmentId]
  );
  const leaves = await pool.query(
    ` SELECT leave_requests.id, 
        CONCAT(users.firstname, ' Leave') AS title,
        start_date AS event_date,
        'LEAVE' AS type

        FROM leave_requests

        JOIN users
        ON users.id = leave_requests.user_id

        WHERE users.department_id = $1
        AND leave_requests.status = 'approved'`,[departmentId]
  );
  const projects = await pool.query(
    `SELECT id, title, end_date AS event_date, 'PROJECT' AS type
        FROM projects

        WHERE end_date IS NOT NULL`
  );

  return [ 
    ...task.rows,
    ...leaves.rows,
    ...projects.rows
  ]
};

export const getEmployeeEvents = async (userId) => {

  const task = await pool.query(
    `
     SELECT id, title, due_date AS event_date, 'TASK' AS type
        FROM task

        WHERE task.assigned_to = $1
      `,[userId]
  )

  const leaves = await pool.query(
    ` SELECT
        leave_requests.id,
        'My Leave' AS title,
        start_date AS event_date,
        'LEAVE' AS type

      FROM leave_requests

      WHERE leave_requests.user_id = $1
      AND leave_requests.status = 'approved'
      `,[userId]
  )
  
  const projects = await pool.query(
    ` SELECT DISTINCT
        projects.id,
        projects.title,
        projects.end_date AS event_date,
        'PROJECT' AS type

      FROM projects

      JOIN task ON task.project_id = projects.id

      WHERE task.assigned_to = $1
      AND projects.end_date IS NOT NULL
      `,[userId]
  )
  
  return [ 
    ...task.rows,
    ...leaves.rows,
    ...projects.rows
  ]
}