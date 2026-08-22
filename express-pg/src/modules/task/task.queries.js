export const BASE_TASK_QUERY = `
    SELECT task.id, task.title, task.description, task.status, task.priority, task.due_date,
        task.assigned_to,
        assignedUser.firstname AS assigned_employee,

        task.created_by,
        createdUser.firstname AS created_employee,
        
        task.project_id,
        projects.title AS project_name

      FROM task

      JOIN users AS assignedUser
        ON assignedUser.id = task.assigned_to

      JOIN users AS createdUser
        ON createdUser.id = task.created_by

      LEFT JOIN projects
        ON projects.id = task.project_id
`;