import ApiError from "../../utils/ApiError.js";
import * as departmentRepository from "./department.repository.js";

export const createDepartment = async (role, name) => {
  if (role !== "admin") {
    throw new ApiError(401, "Access Denied");
  }

  const existingDepartment =
    await departmentRepository.findDepartmentByName(name);

  if (existingDepartment.rows.length > 0) {
    throw new ApiError(400, "Department already exists");
  }

  const createdDepartment = await departmentRepository.createDepartment(name);

  return createdDepartment.rows[0];
};

export const getDepartment = async (
  userId,
  role,
  userDeptId,
  page,
  limit,
  status,
) => {
  const offset = (page - 1) * limit;

  let query = "";
  let values = [];
  let departments;

  if (role === "manager" || role === "employee") {
    departments = await departmentRepository.getDepartmentForManagerOrEmployee(
      userDeptId,
      limit,
      offset,
    );
  } else if (role === "admin") {
    departments = await departmentRepository.getDepartmentForAdmin(
      limit,
      offset,
    );
  }

  const count = await departmentRepository.departmentCount();

  return {
    page,
    limit,
    data: departments.rows,
    totalRecords: Number(count.rows[0].count),
  };
};

export const updateDepartment = async (id, name, status, role) => {
  const updatedDepartment = await departmentRepository.updateDepartment(
    name,
    status,
    id,
  );

  if (updatedDepartment.rows.length === 0) {
    throw new ApiError(404, "Department not found");
  }

  return updatedDepartment.rows[0];
};

export const deleteDepartment = async (id, role) => {
  if (role !== "admin") {
    throw new ApiError(401, "Access Denied");
  }

  const deletedDepartment = await departmentRepository.deleteDepartment(id);

  if (deletedDepartment.rows.length === 0) {
    throw new ApiError(404, "Department not found");
  }
};
