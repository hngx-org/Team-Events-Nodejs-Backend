import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.SECRET_KEY || "default_secret_key", {
    expiresIn: "1d",
  });
};

