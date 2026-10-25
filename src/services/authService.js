import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { delay } from "./mockDb";

// Demo credentials, only used when VITE_USE_MOCK is not "false".
const DEMO_USER = { username: "admin", password: "admin123" };

// Backend contract: POST /auth/login  { username, password }  ->  { token, user }
export async function login(username, password) {
  if (USE_MOCK) {
    await delay(500);
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      return { token: "demo-token-" + Date.now(), user: { username } };
    }
    throw new Error("invalid_credentials");
  }
  const { data } = await axiosClient.post("/auth/login", { username, password });
  return { token: data.token, user: data.user ?? { username } };
}

export function saveSession({ token, user }) {
  localStorage.setItem("jb_token", token);
  localStorage.setItem("jb_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("jb_token");
  localStorage.removeItem("jb_user");
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("jb_user");
    const token = localStorage.getItem("jb_token");
    if (raw && token) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
}
