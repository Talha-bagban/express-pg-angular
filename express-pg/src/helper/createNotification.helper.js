// import { pool, io } from "../index.js";
import { io } from "../socket/socket.js";
import pool from "../config/db.js";

export const createNotification = async (client , userId, title, message) => {
  try {
    const result = await client.query(
      `
          INSERT INTO notifications (
              user_id,
              title,
              message
            )
            VALUES ($1,$2,$3)
            RETURNING *
        `,
      [userId, title, message],
    );

    const notification = result.rows[0];

    // console.log('Sending notification to:', userId);
    // console.log("sending socket - new-notification", notification);

    io.to(userId).emit("new-notification", notification);

    return notification;
  } catch (error) {
    console.log(error);

  }
};
