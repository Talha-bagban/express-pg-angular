import * as dashboardService from "./dashboard.service.js";

const dashboard = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;
    const departmentId = req.user.department_id;
    
    const data = await dashboardService.dashboard(role, userId, departmentId);


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

const getCalendarEvents = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const events  = await dashboardService.getCalendarEvents(userRole, userId)

    return res.json({
      success: true,
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { dashboard, getCalendarEvents };
