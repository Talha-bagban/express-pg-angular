import bcrypt from "bcrypt";
import * as profileRepository from "./profile.repository.js";
import ApiError from "../../utils/ApiError.js";

export const updateProfile = async (
  userId,
  firstname,
  lastname,
  email,
  status,
) => {
  await profileRepository.updateUser(
    firstname,
    lastname,
    email,
    status,
    userId,
  );

  const user = await profileRepository.getUpdatedUserById(userId);

  return user.rows[0];
};

export const changeUserPassword = async (
  userId,
  oldPassword,
  newPassword,
  renewPassword,
) => {
  if (newPassword !== renewPassword) {
    throw new ApiError(400 ,"Passwords do not match");
  }

  const userResult = await profileRepository.getUserById(userId);

  const user = userResult.rows[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400 ,"Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await profileRepository.updatePassword(hashedPassword, userId);
};
