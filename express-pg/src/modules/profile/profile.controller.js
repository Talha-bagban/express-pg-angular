import * as profileService from "./profile.service.js";

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, status } = req.body;
    const user = await profileService.updateProfile(
      userId,
      firstname,
      lastname,
      email,
      status,
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, renewPassword } = req.body;

    await profileService.changeUserPassword(
      userId,
      oldPassword,
      newPassword,
      renewPassword,
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { updateProfile, changeUserPassword };
