import * as authService from "./auth.service.js";

const registerUser = async (req, res) => {
  try {
    const createdUser = await authService.registerUser(req.body);

    return res.json({
      success: true,
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser };


 // const existingUser = await pool.query(
    //   `SELECT users.*,
    //     departments.name AS department
    //     FROM users

    //     LEFT JOIN departments
    //     ON departments.id = users.department_id

    //   WHERE users.email = $1 `,
    //   [email],
    // );

    // if (existingUser.rows.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "User not found, Register first" });
    // }

    // const user = existingUser.rows[0];

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    // delete user.password;

    // const accessToken = jwt.sign(
    //   {
    //     id: user.id,
    //     role: user.role,
    //     department_id: user.department_id,
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   {
    //     expiresIn: "1d",
    //   },
    // );

    // io.on("connection", (socket) => {
    //   socket.on("join", (userId) => {
    //     socket.join(userId);
    //   });
    // });