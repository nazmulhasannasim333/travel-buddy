import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const registerUser = async (
  name: string,
  email: string,
  password: string,
  profile: any
): Promise<any> => {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("Email already in use.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (prisma) => {
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    await prisma.userProfile.create({
      data: { userId: newUser.id, bio: profile.bio, age: profile.age },
    });

    return newUser;
  });

  //   const token = generateToken(user.id);

  return { ...user };
};

// const generateToken = (userId: string): string => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
//     expiresIn: process.env.EXPIRES_IN,
//   });
// };

const loginUser = async (email: string, password: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  const token = generateToken(user.id);

  // Omitting password from user data
  const { password: _, ...userData } = user;

  return { ...userData, token };
};

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "24h",
  });
};
export const userServices = {
  registerUser,
  loginUser
};
