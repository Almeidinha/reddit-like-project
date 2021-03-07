export const validEmail = (text: string) =>
  /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(text);
