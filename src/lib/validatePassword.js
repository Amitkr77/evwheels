// Mirrors the client-side rule in account/register/page.jsx — the server must
// enforce this independently since the API can be called directly, bypassing the form.
export function getPasswordError(password) {
  if (typeof password !== "string" || password.length < 8)
    return "Password must be at least 8 characters";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  return null;
}
