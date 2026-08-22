import * as projectService from "./project.service.js";

const createProject = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    const created_by = req.user.id;
    const role = req.user.role;
    const userDeptId = req.user.department_id;

    const data = await projectService.createProject(
      title,
      description,
      start_date,
      end_date,
      created_by,
      role,
      userDeptId,
    );

    return res.status(201).json({
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

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const data = await projectService.getProjects(userId, role);

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

const getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project = await projectService.getProjectById(id);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await projectService.getProjectTasks(id);

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

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, start_date, end_date } = req.body;

    await projectService.updateProject(
      id,
      title,
      description,
      status,
      start_date,
      end_date,
    );

    return res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await projectService.deleteProject(id);

    return res.status(200).json({
      success: true,
      message: "Project Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// project comment
const createProjectComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment, projectId } = req.body;

    const data = await projectService.createProjectComment(
      userId,
      comment,
      projectId,
    );

    return res.status(201).json({
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

const getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await projectService.getProjectComments(projectId);

    res.status(200).json({
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

const getProjectLog = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await projectService.getProjectLog(projectId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error occur during get Project logs",
    });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  getProjectTasks,
  updateProject,
  deleteProject,
  createProjectComment,
  getProjectComments,
  getProjectLog,
};
