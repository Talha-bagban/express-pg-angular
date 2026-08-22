import pool from "../../config/db.js";

export const createUser = async (
  firstname,
  lastname,
  email,
  role,
  hashedPassword,
) => {
  return await pool.query(
    `
         INSERT INTO users (firstname, lastname, email, role, password)
                VALUES  ($1,$2,$3,$4,$5)
                RETURNING firstname, lastname, email, role
        `,
    [firstname, lastname, email, role, hashedPassword],
  );
};

export const existingUser = async (email) => {
  return await pool.query(
    `
            SELECT users.*,
            departments.name AS department
            FROM users

            LEFT JOIN departments
            ON departments.id = users.department_id

            WHERE users.email = $1 
        `,
    [email],
  );
};
