import pool from "../../config/db.js";

export const updateUser = async (
  firstname,
  lastname,
  email,
  status,
  userId,
) => {
  return await pool.query(
    `
        UPDATE users

        SET
          firstname = $1,
          lastname = $2,
          email = $3,
          status = $4
      
        WHERE id = $5
        `,
    [firstname, lastname, email, status, userId],
  );
};

export const getUpdatedUserById = async (userId) => {
  return await pool.query(
    `
            SELECT
            users.id,
            users.firstname,
            users.lastname,
            users.email,
            users.role,
            users.status,
            users.department_id,

            departments.name AS department

        FROM users

        LEFT JOIN departments
        ON departments.id = users.department_id

        WHERE users.id = $1
        `,
    [userId],
  );
};

export const getUserById = async (userId) => {
  return await pool.query(
    `
            SELECT *
            FROM users
            WHERE id = $1
        `,
    [userId],
  );
};

export const updatePassword = async (hashedPassword, userId) => {
  return await pool.query(
    `
            UPDATE users
            SET password = $1
            WHERE id = $2
        `,
    [hashedPassword, userId],
  );
};
