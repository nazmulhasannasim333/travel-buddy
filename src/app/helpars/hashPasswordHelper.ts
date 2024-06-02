import * as bcrypt from "bcrypt";

export const hashedPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};
