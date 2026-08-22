import pool from "../../config/db.js";

export const getTodayAttendance = async (userId) => {
  return await pool.query(
    `
      SELECT *
      FROM attendance
      WHERE user_id = $1
      AND attendance_date = CURRENT_DATE
    `,
    [userId],
  );
};

export const createAttendance = async (userId, checkInDate) => {
  return await pool.query(
    `
      INSERT INTO attendance(
        user_id,
        check_in,
        attendance_date
      )
      VALUES ($1,$2,CURRENT_DATE)
      RETURNING *
    `,
    [userId, checkInDate],
  );
};

export const updateCheckOutTime = async (checkOutDate, userId) => {
  return await pool.query(
    `
        UPDATE attendance
        SET chech_out = $1
        WHERE user_id = $2
        AND attendance_date = CURRENT_DATE
      `,
    [checkOutDate, userId],
  );
};

export const getAllAttendance = async () => {
  return await pool.query(
    `
     SELECT check_in, chech_out, attendance_date, 
        users.firstname, users.lastname, users.role
        FROM attendance

        JOIN users
        ON users.id = attendance.user_id
        
        ORDER BY attendance.attendance_date DESC
    `,
  );
};

export const getManagerDepartment = async (userId) => {
  return await pool.query(
    `
    SELECT department_id
    FROM users
    WHERE id = $1
    `,
    [userId],
  );
};

export const getManagerAttendance = async (departmentId) => {
  return await pool.query(
    `
     SELECT
        attendance.*,
        users.firstname,
        users.lastname,
        users.role

      FROM attendance

      JOIN users
        ON users.id = attendance.user_id

      WHERE users.department_id = $1

      ORDER BY attendance.attendance_date DESC
    `,
    [departmentId],
  );
};

export const getEmployeeAttendance = async (userId) => {
  return await pool.query(
    `
    SELECT check_in, chech_out, attendance_date, 
      users.firstname, users.lastname, users.role
      FROM attendance

      JOIN users
      ON users.id = attendance.user_id

      WHERE users.id = $1
      
      ORDER BY attendance.attendance_date DESC
    `,
    [userId],
  );
};
