import pool from "../config/db.js";

export const createProjectLog = async (
  id,
  userId,
  actionType,
  message
) => {

  try {

    await pool.query(
      `
        INSERT INTO project_activity_logs (
          project_id,
          user_id,
          action_type,
          message
        )

        VALUES ($1, $2, $3, $4)
      `,
      [
        id,
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