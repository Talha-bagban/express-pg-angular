import * as projectRepository from "./project.repository.js";
import { createNotification } from "../../helper/createNotification.helper.js";
import { createProjectLog } from "../../helper/projectLog.helper.js";
import ApiError from "../../utils/ApiError.js";

export const createProject = async (
  title,
  description,
  start_date,
  end_date,
  created_by,
  role,
  userDeptId,
) => {
  const newProject = await projectRepository.createNewProject(
    title,
    description,
    start_date,
    end_date,
    created_by,
  );

  const projectId = newProject.rows[0].id;

  await projectRepository.insertIntoActivityLog(projectId, created_by);

  const admins = await projectRepository.getAllAdmin();

  const project_created_by =
    await projectRepository.getProjectCreator(created_by);

  const created_by_Name = project_created_by.rows[0].firstname;

  await Promise.all(
    admins.rows.map((admin) =>
      createNotification(
        admin.id,
        "New Project Created",
        ` ${title} project has been created by ${created_by_Name} `,
      ),
    ),
  );

  return newProject.rows[0];
};

export const getProjects = async (userId, role) => {
  let result;

  if (role === "manager") {
    result = await projectRepository.getProjectsByManager(userId);
  } else if (role === "employee") {
    result = await projectRepository.getProjectsByemployee(userId);
  } else if (role === "admin") {
    result = await projectRepository.getProjectsByAdmin();
  }

  return result.rows;
};

export const getProjectById = async (id) => {
  const result = await projectRepository.getProjectById(id);

  const project = result.rows[0];

  const totalTasks = Number(project.total_tasks);
  const completedTasks = Number(project.completed_tasks);

  project.progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return project;
};

export const getProjectTasks = async (id) => {
  const tasks = await projectRepository.getTasksOfProject(id);

  return tasks.rows;
};

export const updateProject = async (
  id,
  title,
  description,
  status,
  start_date,
  end_date,
) => {
  // activity log
  const existingProject = await projectRepository.existingProjectById(id);

  const oldProject = existingProject.rows[0];
  // activity log end

  const result = await projectRepository.updateProject(
    title,
    description,
    status,
    start_date,
    end_date,
    id,
  );

  if (result.rows.length === 0) {
    throw new ApiError(400, "Project not found");
  }

  // activity log
  if (oldProject.status !== status) {
    await createProjectLog(
      id,
      req.user.id,
      "STATUS_UPDATED",
      `Status changed from ${oldProject.status} to ${status}`,
    );
  }
  if (oldProject.title !== title) {
    await createProjectLog(
      id,
      req.user.id,
      "TITLE_UPDATED",
      `Title changed from ${oldProject.title} to ${title}`,
    );
  }
  if (oldProject.description !== description) {
    await createProjectLog(
      id,
      req.user.id,
      "DESCRIPTION_UPDATED",
      `Description changed from ${oldProject.description} to ${description}`,
    );
  }
  // activity log end
};

export const deleteProject = async (id) => {
  const result = await projectRepository.deleteProjectById(id);

  if (result.rows.length === 0) {
    throw new ApiError(404, "Project not found");
  }
};

export const createProjectComment = async (userId, comment, projectId) => {
  const projectComment = await projectRepository.createProjectComment(
    userId,
    comment,
    projectId,
  );

  return projectComment.rows[0];
};

export const getProjectComments = async (projectId) => {
  const comments = await projectRepository.getProjectComments(projectId);

  return comments.rows;
};
export const getProjectLog = async (projectId) => {
  const logs = await projectRepository.getProjectLog(projectId);

  return logs.rows;
};
