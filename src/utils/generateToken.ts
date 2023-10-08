import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
};

