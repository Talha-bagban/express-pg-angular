import pool from "../../config/db.js";

export const findDepartmentByName = async (name) => {
  return await pool.query(
    `
            SELECT FROM departments WHERE name = $1
        `,
    [name],
  );
};

export const createDepartment = async (name) => {
  return await pool.query(
    `
            INSERT INTO departments (name)
                VALUES ($1)
                RETURNING *
        `,
    [name],
  );
};

export const getDepartmentForManagerOrEmployee = async (
  userDeptId,
  limit,
  offset,
) => {
  return await pool.query(
    `
        SELECT * FROM departments
        
          WHERE departments.id = $1
          LIMIT $2
          OFFSET $3
          `,
    [userDeptId, limit, offset],
  );
};

export const getDepartmentForAdmin = async (limit, offset) => {
  return await pool.query(
    `
        SELECT * FROM departments
        ORDER BY created_at DESC

        LIMIT $1
        OFFSET $2
          `,
    [limit, offset],
  );
};

export const departmentCount = async () => {
  return await pool.query(
    `
        SELECT COUNT(*) FROM departments
    `,
  );
};

export const updateDepartment = async (name, status, id) => {
  return await pool.query(
    `
            UPDATE departments
            SET name = $1, status = $2
            WHERE id = $3
            RETURNING *
        `,
    [name, status, id],
  );
};

export const deleteDepartment = async (id) => {
  return await pool.query(
    `
           DELETE FROM departments WHERE id = $1 RETURNING * 
        `,
    [id],
  );
};
