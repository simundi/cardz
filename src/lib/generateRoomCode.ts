const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 6;

export const generateRoomCode = (): string => {
  const values = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(values, (v) => CHARS[v % CHARS.length]).join('');
};
