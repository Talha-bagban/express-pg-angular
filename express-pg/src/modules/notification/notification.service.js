import * as notificationRepository from "./notification.repository.js";

export const getNotifications = async (userId) => {
  const notifications = await notificationRepository.getNotifications(userId);

  const unreadNotificationCount = await notificationRepository.getUnreadCount(userId);

  return {
    data: notifications.rows,
    unreadCount: Number(unreadNotificationCount.rows[0].count),
  };
};

export const markAllNotificationsAsRead = async (userId) => {

  await notificationRepository.markNotificationsAsRead(userId);

}