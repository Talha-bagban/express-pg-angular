import pool from "../../config/db.js";
import { createNotification } from "../../helper/createNotification.helper.js";
import * as leaveService from "./leave.service.js";

const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leave_type, start_date, end_date, reason } = req.body;

    const data = await leaveService.applyLeave(
      userId,
      leave_type,
      start_date,
      end_date,
      reason,
    );

    return res.status(200).json({
      success: true,
      data: data,
      message: "leave applied successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in applying leave",
    });
  }
};

const myLeave = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await leaveService.myLeave(userId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const leaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await leaveService.leaves(userId, userRole);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.body;
    const { leaveId } = req.params;

    const data = await leaveService.updateLeaveStatus(userId, status, leaveId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateleave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leave_type, start_date, end_date, reason } = req.body;

    await leaveService.updateleave(
      id,
      leave_type,
      start_date,
      end_date,
      reason,
    );

    return res.status(200).json({
      success: true,
      message: "Leave Request Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { applyLeave, myLeave, leaves, updateLeaveStatus, updateleave };
