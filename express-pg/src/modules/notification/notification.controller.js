import pool from "../../config/db.js";
import * as notificationService from "./notification.service.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, unreadCount } =
      await notificationService.getNotifications(userId);

    return res.status(200).json({
      success: true,
      data,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationService.markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getNotifications, markAllNotificationsAsRead };
