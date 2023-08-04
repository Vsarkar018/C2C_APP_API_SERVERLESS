import bcrypt from "bcrypt";
export const GenSalt = async () => {
  return await bcrypt.genSalt(10);
};
export const GetHashedPassowrd = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const ValidatePassaword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GetHashedPassowrd(enteredPassword, salt)) === savedPassword;
};
