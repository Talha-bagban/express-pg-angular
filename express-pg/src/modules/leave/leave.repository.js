import pool from "../../config/db.js";

export const createLeave = async (
  userId,
  leave_type,
  start_date,
  end_date,
  reason,
) => {
  return await pool.query(
    `
              INSERT INTO leave_requests(user_id, leave_type, start_date, end_date, reason)
            VALUES($1,$2,$3,$4,$5)
        `,
    [userId, leave_type, start_date, end_date, reason],
  );
};

export const getUserFirstName = async (userId) => {
  return await pool.query(
    `
            SELECT firstname
            FROM users
            WHERE id = $1
        `,
    [userId],
  );
};

export const getUserDepartmentId = async (userId) => {
  return await pool.query(
    `
            SELECT department_id
            FROM users
            WHERE id = $1   
        `,
    [userId],
  );
};

export const getManagerByDepartment = async (departmentId) => {
  return await pool.query(
    `
            SELECT id
            FROM users
            WHERE role = 'manager'
            AND department_id = $1 
        `,
    [departmentId],
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

export const getMyLeave = async (userId) => {
  return await pool.query(
    `
             SELECT leave_requests.* ,

            approvedUser.firstname AS approved_by_name,
            approvedUser.role AS approved_by_role

            FROM leave_requests

                LEFT JOIN users AS approvedUser
                ON approvedUser.id = leave_requests.approved_by

            WHERE user_id = $1 

            ORDER BY leave_requests.created_at DESC
        `,
    [userId],
  );
};

export const getAdminLeavesView = async () => {
  return await pool.query(
    `
              SELECT leave_requests.* ,
            users.firstname, users.lastname,

            approvedUser.firstname AS approved_by_name,
            approvedUser.role AS approved_by_role

          FROM leave_requests

          JOIN users
          ON users.id = leave_requests.user_id

           LEFT JOIN users AS approvedUser
            ON approvedUser.id = leave_requests.approved_by

          ORDER BY leave_requests.created_at DESC
        `,
  );
};

export const getManager = async (userId) => {
  return await pool.query(
    `
            SELECT department_id
            FROM users
            WHERE id = $1
        `,
    [userId],
  );
};

export const getManagerLeavesView = async (departmentId) => {
  return await pool.query(
    `
             SELECT leave_requests.*,
            users.firstname,
            users.lastname,
            users.role,

          approvedUser.firstname AS approved_by_name,
          approvedUser.role AS approved_by_role

          FROM leave_requests

          JOIN users
          ON users.id = leave_requests.user_id

          LEFT JOIN users AS approvedUser
          ON approvedUser.id = leave_requests.approved_by

          WHERE users.department_id = $1
          
          ORDER BY leave_requests.created_at DESC
        `,
    [departmentId],
  );
};

export const selectedLeave = async (client, leaveId) => {
  return await client.query(
    `
            SELECT user_id
            FROM leave_requests
            WHERE id = $1
        `,
    [leaveId],
  );
};

export const updateLeaveStatus = async (client , status, leaveId, userId) => {
  return await client.query(
    `
        UPDATE leave_requests
        SET status = $1, approved_by = $3
        WHERE id = $2
        RETURNING *
        `,
    [status, leaveId, userId],
  );
};

export const updateLeaveBy = async (client, userId) => {
  return await client.query(
    `
        SELECT firstname, role
        FROM users
        WHERE id = $1
        `,
    [userId],
  );
};

export const getLeaveStatus = async (id) => {
  return await pool.query(
    `
        SELECT status
        FROM leave_requests
        WHERE id = $1
    `,
    [id],
  );
};

export const updateLeave = async (
  leave_type,
  start_date,
  end_date,
  reason,
  id,
) => {
  return await pool.query(
    `
        UPDATE leave_requests
        SET leave_type = $1, start_date = $2, end_date=$3, reason=$4
        WHERE id = $5 
    `,
    [leave_type, start_date, end_date, reason, id],
  );
};
