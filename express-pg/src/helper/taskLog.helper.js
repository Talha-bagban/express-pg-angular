import pool from "../config/db.js";

export const createTaskLog = async (
  taskId,
  userId,
  actionType,
  message
) => {

  try {

    await pool.query(
      `
        INSERT INTO task_activity_logs (
          task_id,
          user_id,
          action_type,
          message
        )

        VALUES ($1, $2, $3, $4)
      `,
      [
        taskId,
        userId,
        actionType,
        message
      ]
    );

  } catch (error) {

    console.log(
      'Task log error:',
      error
    );
  }
};