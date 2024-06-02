import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const createToken = (
  jwtPayload: { name: string; email: string; userId: string },
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}

export const AuthUtils = {
  comparePasswords,
};
