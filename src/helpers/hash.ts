import bcrypt, { genSalt, hash, compare } from "bcrypt";
import { createHash } from "crypto";

const saltRounds = 10;
export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, saltRounds);

  // console.log('hash: ', hash)
  if (!hashed) return;
  return hashed;
};

export const comparePassword = (plain: string, hashed: string) => {
  const match = bcrypt.compareSync(plain, hashed);
  return match;
};
