import { genSalt, hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return compare(password, hash);
};