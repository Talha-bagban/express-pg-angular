export const getUserRole = () => {

  const savedUser = localStorage.getItem('user');

  if (!savedUser) return null;

  const user = JSON.parse(savedUser);

  return user.role;
};