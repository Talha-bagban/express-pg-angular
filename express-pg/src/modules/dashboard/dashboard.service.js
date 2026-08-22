import * as dashboardRepository from "./dashboard.repository.js";
// import redis from "../../config/redis.js";

export const dashboard = async (role, userId, departmentId) => {

  let result;
  // let cacheKey = "";
  
    if (role === "admin") {
      result = await dashboardRepository.adminDashboard();
      // cacheKey = `dashboard:admin:${userId}`;
      // console.log("Cache Key:", cacheKey);
    } else if (role === "manager") {
      result = await dashboardRepository.managerDashboard(userId, departmentId);
      // cacheKey = `dashboard:manager:${userId}`;
      // console.log("Cache Key:", cacheKey);
    } else if (role === "employee") {
      result = await dashboardRepository.employeeDashboard(userId);
      // cacheKey = `dashboard:employee:${userId}`;
      // console.log("Cache Key:", cacheKey);
    }

  // const cache = await redis.get(cacheKey);

  // if (cache) {
  //   console.log("📦 From Redis");
  //   return JSON.parse(cache);
  // }
  console.log("🗄️ From PostgreSQL");
  //  await redis.set(
  //     cacheKey,
  //     JSON.stringify(result.rows),
  //     {
  //       EX: 300, // 5 minutes
  //     }
  //   );
  
  return result.rows;
};

export const getCalendarEvents = async (userRole, userId) => {
  if (userRole === "admin") {
    return await dashboardRepository.getAdminEvents();
  } else if (userRole === "manager") {
    
    const manager = await dashboardRepository.getManagerDepartment(userId);

    const departmentId = manager.rows[0].department_id;

    return await dashboardRepository.getManagerEvents(departmentId);
  } else if (userRole === "employee") {
    return await dashboardRepository.getEmployeeEvents(userId);
  }
};
