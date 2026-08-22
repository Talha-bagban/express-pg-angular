import * as attendanceRepository from "./attendance.repository.js";
import ApiError from '../../utils/ApiError.js'

export const checkInAttendance = async (userId, checkInDate) => {
  const existingAttendance =
    await attendanceRepository.getTodayAttendance(userId);

  if (existingAttendance.rows.length > 0) {
    throw new ApiError(406, 'You have already checked in today');
  }

  const attendance = await attendanceRepository.createAttendance(
    userId,
    checkInDate,
  );

  return attendance.rows[0];
};

export const checkOutAttendance = async (userId, checkOutDate) => {
  const existingAttendance =
    await attendanceRepository.getTodayAttendance(userId);

  if (existingAttendance.rows.length === 0) {
    throw new ApiError(400, 'Please check In first');
  }

  if (existingAttendance.rows[0].chech_out) {
    throw new ApiError(406, 'You have already checked out today');
  }

  const updatedAttendance = await attendanceRepository.updateCheckOutTime(
    checkOutDate,
    userId,
  );

  return updatedAttendance.rows[0];
};

export const getAllAttendance = async (role, userId) => {
  let result;
  if (role === "admin") {
    result = await attendanceRepository.getAllAttendance();
  } else if (role === "manager") {
    const manager = await attendanceRepository.getManagerDepartment(userId);

    result = await attendanceRepository.getManagerAttendance(
      manager.rows[0].department_id,
    );
  } else if (role === "employee") {
    result = await attendanceRepository.getEmployeeAttendance(userId);
  }

  return result.rows.map((row) => {
    let hours = null;
    if (row.check_in && row.chech_out) {
      hours =
        (new Date(row.chech_out) - new Date(row.check_in)) / (1000 * 60 * 60);
    }
    return {
      ...row,
      hours: hours?.toFixed(2),
    };
  });
};

export const getTodayAttendance = async (userId) => {
  const attendance = await attendanceRepository.getTodayAttendance(userId);

  return attendance.rows[0] || null;
};
