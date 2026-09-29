// Password hashing for locally stored accounts (Web Crypto, SHA-256 with a per-user salt).
// Accounts live in the browser only; this keeps plain-text passwords out of
// localStorage but is not a substitute for a real authentication server.

export const newSalt = () => crypto.randomUUID();

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
