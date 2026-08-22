import pool from "../../config/db.js";

export const getUsers = async (searchValue, limit, offset) => {
  return await pool.query(
    `
    SELECT id,
    firstname,
    lastname,
    email,
    role,
    department_id,
    status,
    created_at
    
    FROM users

    WHERE firstname ILIKE $1

    ORDER BY id DESC

    LIMIT $2 OFFSET $3
    `,
    [searchValue, limit, offset],
  );
};

export const getUsersCount = async (searchValue) => {
  return await pool.query(
    `
    SELECT COUNT(*)
    FROM users

    WHERE firstname ILIKE $1
    `,
    [searchValue],
  );
};

export const updateUser = async (id, firstname, email) => {
    return await pool.query(
        `
            UPDATE users
                SET firstname = $1, email = $2
                WHERE id = $3
                RETURNING *
        `,[firstname, email, id]
    )
}

export const deleteUser = async (id) => {
    return await pool.query(
        `
        DELETE FROM users WHERE id = $1
        `,[id]
    )
}

export const createEmployee = async (client, firstname, lastname, email, hashedPassword, department_id) => {
    return await client.query(
        `
         INSERT INTO users (firstname, lastname, email, password, role, department_id)
          VALUES  ($1,$2,$3,$4,'employee',$5)
          RETURNING id, firstname, lastname, email, role, department_id
        `,[firstname, lastname, email, hashedPassword, department_id]
    )
}

export const getEmployeeForAdmin = async () => {
    return await pool.query(
        `
            SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
            users.department_id,
                departments.name AS department

            FROM users

            JOIN departments
            ON departments.id = users.department_id

            WHERE users.role  = 'employee'

            ORDER BY users.created_at DESC
        `
    )
}

export const getEmployeeForManager = async (userDeptId) => {
    return await pool.query(
        `
             SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
              users.department_id,
                  departments.name AS department

              FROM users

              JOIN departments
              ON departments.id = users.department_id

              WHERE users.role  = 'employee' AND users.department_id = $1

              ORDER BY users.created_at DESC
        `,[userDeptId]
    )
}

export const updateEmployee = async (id, firstname, lastname, email, department_id, status) => {
    return await pool.query(
        `
        UPDATE users
          SET firstname = $1, lastname = $2 ,email = $3, department_id = $4, status = $5
          WHERE id = $6
          RETURNING *
        `,[firstname, lastname, email, department_id, status, id]
    )
}

export const deleteEmployee = async (id) => {
    return await pool.query(
        `
        DELETE FROM users WHERE id = $1 RETURNING *
        `,[id]
    )
}

export const createManager = async (client,firstname, lastname, email, hashedPassword, department_id) => {
    return await client.query(
        `
            INSERT INTO users (firstname, lastname, email, password, role, department_id)
            VALUES  ($1,$2,$3,$4,'manager',$5)
            RETURNING id, firstname, lastname, email, role, department_id
        `,[firstname, lastname, email, hashedPassword, department_id]
    )
}


export const getManagerForAdmin = async () => {
    return await pool.query(
        `
            SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
                  users.department_id,
                  departments.name AS department

              FROM users

              JOIN departments
              ON departments.id = users.department_id

              WHERE users.role  = 'manager'

              ORDER BY users.created_at DESC
        `
    )
}

export const getManagerForEmployee = async (userDeptId) => {
    return await pool.query(
        `
           SELECT users.id, users.firstname, users.lastname, users.email, users.role, users.status,
                  users.department_id,
                  departments.name AS department

              FROM users

              JOIN departments
              ON departments.id = users.department_id

              WHERE users.role  = 'manager' AND  users.department_id = $1

              ORDER BY users.created_at DESC
        `,[userDeptId]
    )
}

export const updateManager = async (firstname, lastname, email, department_id, status, id) => {
    return await pool.query(
        `
            UPDATE users
            SET firstname = $1, lastname = $2 ,email = $3, department_id = $4 , status=$5
            WHERE id = $6
            RETURNING *
        `,[firstname, lastname, email, department_id, status, id]
    )   
}

export const deleteManger = async (id) => {
    return await pool.query(
        `
        DELETE FROM users WHERE id = $1 RETURNING *
        `,[id]
    )
}