import {v4 as uuidv4} from 'uuid';

export function generateRandomNumber(len: number) {
  const token =
    Math.floor(Math.random() * (9 * 10 ** (len - 1))) + 10 ** (len - 1);
  return `${token}`;
}

export function generateRandomString(len: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = len; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateNewUUID() {
  return uuidv4();
}