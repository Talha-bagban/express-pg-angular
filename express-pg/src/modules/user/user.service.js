import bcrypt from "bcrypt";
import * as userRepository from "./user.repository.js";
import { createNotification } from "../../helper/createNotification.helper.js";
import ApiError from "../../utils/ApiError.js";
import pool from "../../config/db.js";

export const getUsers = async (query) => {
  const { page = 1, limit = 5, search = "" } = query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;
  const searchValue = `%${search}%`;

  const users = await userRepository.getUsers(searchValue, limitNum, offset);

  const total = await userRepository.getUsersCount(searchValue);

  return {
    data: users.rows,

    total: Number(total.rows[0].count),

    page: pageNum,

    totalPages: Math.ceil(Number(total.rows[0].count) / limitNum),
  };
};

export const updateUser = async (id, firstname, email) => {
     const updateUser = await userRepository.updateUser(id, firstname, email);
     return updateUser.rows[0]
}

export const deleteUser = async (id) => {

    const deleteUser = await userRepository.deleteUser(id);

    if (deleteUser.rows.length === 0) {
        throw new ApiError(404, 'Employee not found')
    }

    return deleteUser.rows[0]
}

export const createEmployee = async (firstname, lastname, email, password, department_id ) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN")
        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await userRepository.createEmployee(client, firstname, lastname, email, hashedPassword, department_id);

        const employeeId = employee.rows[0].id;

        throw new ApiError(400, 'ROLLBACK')

        await createNotification(client,
            employeeId,
            `Welcome ${firstname}`,
            "Your account has been created",
        );
        await client.query("COMMIT");
        return employee.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const getAllEmployee = async (role, userDeptId) => {
    let result;

    if (role === "manager" || role === "employee") {
      result = await userRepository.getEmployeeForManager(userDeptId);
    } else if (role === "admin") {
      result = await userRepository.getEmployeeForAdmin()
    }

    return result.rows
}

export const updateEmployee = async () => {

     const employee = await userRepository.updateEmployee(id, firstname, lastname, email, department_id, status)

    if (employee.rows.length === 0) {
        throw new ApiError(404, 'Employee not found');
    }

    return employee.rows[0]
}

export const deleteEmployee = async (id) => {
    const employee = await userRepository.deleteEmployee(id);

    if (employee.rows.length === 0) {
        throw new ApiError(404, 'Employee not found');
    }
}

export const createManager = async (firstname, lastname, email, password, department_id, role) => {
    
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        if (role !== "admin") {
            throw new ApiError(401, 'Access Denied');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const manager = await userRepository.createManager(client, firstname, lastname, email, hashedPassword, department_id);

        throw new ApiError(401, 'roll back');

        const managerId = manager.rows[0].id;

        await createNotification(client,
        managerId,
        `Welcome ${firstname} `,
        "Your account has been created",
        );

        await client.query("COMMIT");

        return manager.rows[0]
        
    } catch (error) {
         await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const getAllManger = async (role, userDeptId) => {
    let result;

    if (role === "manager" || role === "employee") {
      result = await userRepository.getManagerForEmployee(userDeptId);
    } else if (role === "admin") {
        result = await userRepository.getManagerForAdmin();
    }

    return result.rows
}

export const updateManager = async (id, firstname, lastname, email, department_id, status, role) => {
    
    if (role !== "admin") {
        throw new ApiError(401, 'Access Denied');
    }

    const manager = await userRepository.updateManager(firstname, lastname, email, department_id, status, id);
    
    return manager.rows[0];

}

export const deleteManger = async (id, role) => {
    if (role !== "admin") {
        throw new ApiError(401, 'Access Denied');   
    }

    const manager = await userRepository.deleteManger(id);

    if (manager.rows.length === 0) {
        throw new ApiError(404, 'Manager not found'); 
    }

}