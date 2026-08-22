import pool from "../../config/db.js";

export const getNotifications = async (userId) => {
  return await pool.query(
    `
             SELECT * FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
    [userId],
  );
};

export const getUnreadCount = async (userId) => {
  return await pool.query(
    `
             SELECT COUNT(*)
            FROM notifications
            WHERE user_id = $1
            AND is_read = false
        `,
    [userId],
  );
};

export const markNotificationsAsRead = async (userId) => {
  return await pool.query(
    `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1
      AND is_read = false
        `,
    [userId],
  );
};
