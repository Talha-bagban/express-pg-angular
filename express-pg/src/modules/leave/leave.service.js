import pool from "../../config/db.js";
import { createNotification } from "../../helper/createNotification.helper.js";
import ApiError from "../../utils/ApiError.js";
import * as leaveRepository from "./leave.repository.js";

export const applyLeave = async (
  userId,
  leave_type,
  start_date,
  end_date,
  reason,
) => {
  const client = await pool.connect();
  const LeaveCreated = await leaveRepository.createLeave(
    userId,
    leave_type,
    start_date,
    end_date,
    reason,
  );

  const user = await leaveRepository.getUserFirstName(userId);
  const firstName = user.rows[0].firstname;

  const employee = await leaveRepository.getUserDepartmentId(userId);

  const departmentId = employee.rows[0].department_id;

  const managers = await leaveRepository.getManagerByDepartment(departmentId);

  const admins = await leaveRepository.getAllAdmin();

  const recipients = [...admins.rows, ...managers.rows];
  await Promise.all(
    recipients.map((user) =>
      createNotification(client,
        user.id,
        "New Leave Request",
        `${firstName} applied for ${leave_type} Leave`,
      ),
    ),
  );

  return LeaveCreated.rows[0];
};

export const myLeave = async (userId) => {
  const leaves = await leaveRepository.getMyLeave(userId);

  return leaves.rows;
};

export const leaves = async (userId, userRole) => {
  let result;

  if (userRole === "admin") {
    result = await leaveRepository.getAdminLeavesView();
  } else if (userRole === "manager") {
    const manager = await leaveRepository.getManager(userId);

    const departmentId = manager.rows[0].department_id;

    result = await leaveRepository.getManagerLeavesView(departmentId);
  }
  return result.rows;
};

export const updateLeaveStatus = async (userId, status, leaveId) => {
  const client = await pool.connect();
  try {

    await client.query("BEGIN");
    const leave = await leaveRepository.selectedLeave(client,leaveId);

    if (leave.rows.length === 0) {
      throw new ApiError(404 ,"Leave request not found");
    }

    if (leave.rows[0].user_id === userId) {
      throw new ApiError(401 ,"You cannot approve / reject your own leave request");
    }

    const result = await leaveRepository.updateLeaveStatus( client , 
      status,
      leaveId,
      userId,
    );

    const approvedRejectedBy = await leaveRepository.updateLeaveBy(client, userId);

    const by_name = approvedRejectedBy.rows[0].firstname;
    const role = approvedRejectedBy.rows[0].role;

    await createNotification( client , 
      leave.rows[0].user_id,
      `Leave ${status}`,
      `Your leave request has been  ${status} by ${by_name} (${role})`,
    );
    
    await client.query("COMMIT");

    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error
  } finally {
    client.release();
  }
};

export const updateleave = async (
  id,
  leave_type,
  start_date,
  end_date,
  reason,
) => {
  const leaveStatus = await leaveRepository.getLeaveStatus(id);

  if (leaveStatus.rows[0].status !== "pending") {
    throw new ApiError(400 ,"Only pending leave requests can be edited");
  }

  const result = await leaveRepository.updateLeave(
    leave_type,
    start_date,
    end_date,
    reason,
    id,
  );

  return result;
};
