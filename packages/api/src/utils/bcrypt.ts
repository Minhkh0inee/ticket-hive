import * as bcrypt from 'bcrypt';

const SALT_OR_ROUNDS = 12;

export async function hashingPassword(password: string) {
  const hashed = await bcrypt.hash(password, SALT_OR_ROUNDS);
  return hashed;
}

export async function IsMatchHashedPassword(
  password: string,
  hashedPassword: string,
) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
