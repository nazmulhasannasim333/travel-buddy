import { z } from "zod";

const UserCreateSchema = z.object({
  name: z.string().min(1, { message: "Name field is required" }),
  email: z.string().email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const UserLoginSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const userValidation = { UserCreateSchema, UserLoginSchema };
