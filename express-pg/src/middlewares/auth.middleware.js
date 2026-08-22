import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, Access token required",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decodedToken;
    // console.log('decodedToken: ',decodedToken)

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
