export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};

export const authorizeAdminRole = () => {
  return authorizeRoles("admin");
};

export const authorizeAdminManagerRoles = () => {
  return authorizeRoles("admin", "manager");
};
