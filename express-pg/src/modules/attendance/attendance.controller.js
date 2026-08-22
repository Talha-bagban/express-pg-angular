import * as attendanceService from "./attendance.service.js";

const checkInAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { checkInDate } = req.body;

    const attendance = await attendanceService.checkInAttendance(
      userId,
      checkInDate,
    );

    return res.status(200).json({
      success: true,
      message: "Checked in successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

const checkOutAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { checkOutDate } = req.body;

    await attendanceService.checkOutAttendance(userId, checkOutDate);

    return res.status(200).json({
      success: true,
      message: "Checked Out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const attendance = await attendanceService.getAllAttendance(role, userId);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error on get all attendance",
    });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const attendance = await attendanceService.getTodayAttendance(userId);

    return res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  checkInAttendance,
  checkOutAttendance,
  getAllAttendance,
  getTodayAttendance,
};
