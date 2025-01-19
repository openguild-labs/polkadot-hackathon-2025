export const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const UserError = {
  INVALID_USER_NAME: 'INVALID_USER_NAME',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
};
