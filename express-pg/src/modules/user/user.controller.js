import * as userService from './user.service.js'


const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, email } = req.body;

    const data = await userService.updateUser(id, firstname, email);

    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await userService.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// employee
const createEmployee = async (req, res) => {
  try {
    const { firstname, lastname, email, password, department_id } = req.body;

    const data = await userService.createEmployee(firstname, lastname, email, password, department_id );

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

const getAllEmployee = async (req, res) => {
  try {
    const role = req.user.role;
    const userDeptId = req.user.department_id;
    
    const data = await userService.getAllEmployee(role, userDeptId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, department_id, status } = req.body;

   const data = await userService.updateEmployee(id, firstname, lastname, email, department_id, status);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await userService.deleteEmployee(id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// manager
const createManager = async (req, res) => {
  try {
    const { firstname, lastname, email, password, department_id } = req.body;
    const role = req.user.role;

    const data = await userService.createManager(firstname, lastname, email, password, department_id, role );

    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllManger = async (req, res) => {
  try {
    const role = req.user.role;
    const userDeptId = req.user.department_id;
    
    const data = await userService.getAllManger(role, userDeptId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, department_id, status } = req.body;
    const role = req.user.role;

    const data = await userService.updateManager(id, firstname, lastname, email, department_id, status, role);

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

const deleteManger = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    await userService.deleteManger(id, role);
    
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export {
  getUsers,
  updateUser,
  deleteUser,
  createEmployee,
  getAllEmployee,
  deleteEmployee,
  updateEmployee,
  createManager,
  getAllManger,
  updateManager,
  deleteManger
};
