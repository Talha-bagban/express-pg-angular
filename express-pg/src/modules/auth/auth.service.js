import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { io } from "../../socket/socket.js";
import ApiError from "../../utils/ApiError.js";

export const registerUser = async (userData) => {
  const { firstname, lastname, email, password, role } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const created = await authRepository.createUser(
    firstname,
    lastname,
    email,
    role,
    hashedPassword,
  );

  return created.rows[0];
};

export const loginUser = async (email, password) => {
  console.time("DB");
  const existingUser = await authRepository.existingUser(email);
  console.timeEnd("DB");

  if (existingUser.rows.length === 0) {
    throw new ApiError(404, 'User not found, Register first');
  }

  const user = existingUser.rows[0];

  console.time("bcrypt");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.timeEnd("bcrypt");

  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid credentials');
  }

  delete user.password;

  console.time("JWT");
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      department_id: user.department_id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
  console.timeEnd("JWT");

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(userId);
    });
  });

  return{ user, accessToken}
};
