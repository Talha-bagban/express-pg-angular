import * as departmentService from "./department.service.js";

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const role = req.user.role;

    // if (role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access Denied",
    //   });
    // }

    // const existingDept = await pool.query(
    //   `SELECT FROM departments WHERE name = $1`,
    //   [name],
    // );

    // if (existingDept.rows.length > 0) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "department already exists",
    //   });
    // }

    // const createDepartment = await pool.query(
    //   ` INSERT INTO departments (name)
    //             VALUES ($1)
    //             RETURNING *
    //         `,
    //   [name],
    // );
    const createdDepartment = await departmentService.createDepartment(
      role,
      name,
    );

    return res.status(201).json({
      success: true,
      data: createdDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating department",
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const userDeptId = req.user.department_id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;

    // const offset = (page - 1) * limit;

    // const status = req.query.status;

    // let query = "";
    // let values = [];

    // if (role === "manager" || role === "employee") {
    //   query = `
    //     SELECT * FROM departments

    //       WHERE departments.id = $1
    //       LIMIT $2
    //       OFFSET $3
    //   `;
    //   values = [userDeptId, limit, offset];
    // } else if (role === "admin") {
    //   query = `
    //     SELECT * FROM departments
    //     ORDER BY created_at DESC

    //     LIMIT $1
    //     OFFSET $2
    //   `;
    //   values = [limit, offset];
    // }

    // const result = await pool.query(query, values);

    // const totalResult = await pool.query(
    //   `
    //     SELECT COUNT(*) FROM departments
    //   `,
    // );
    // const totalRecords = Number(totalResult.rows[0].count);

    const data = await departmentService.getDepartment(
      userId,
      role,
      userDeptId,
      page,
      limit,
      status,
    );

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const role = req.user.role;

    // if (role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access Denied",
    //   });
    // }

    // const result = await pool.query(
    //   `
    //     UPDATE departments
    //     SET name = $1, status = $2
    //     WHERE id = $3
    //     RETURNING *
    //   `,
    //   [name, status, id],
    // );

    // if (result.rows.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Department not found",
    //   });
    // }

    const data = departmentService.updateDepartment(id, name, status, role);

    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    await departmentService.deleteDepartment(id, role);

    return res.status(200).json({
      success: true,
      message: "department deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createDepartment, getDepartment, updateDepartment, deleteDepartment };
