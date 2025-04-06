import { atom } from "jotai";

import axios from "axios";

export const authAtom = atom(null, (get, set, user) => {
  set(authAtom, user);
});

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const loginAtom = atom(
  null,
  async (
    get,
    set,
    { email, password }: { email: string; password: string }
  ) => {
    try {
      const response = await api.post("/api/auth/signin", { email, password });
      const user = response.data.data;
      set(authAtom, user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      return { success: false, error: errorMessage };
    }
  }
);

export const signupAtom = atom(
  null,
  async (get, set, { name, email, password }) => {
    try {
      const response = await api.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      const user = response.data.data;
      set(authAtom, user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Signup failed";
      return { success: false, error: errorMessage };
    }
  }
);

export const checkAuthAtom = atom(null, async (get, set) => {
  try {
    const response = await api.get("/api/auth/profile");
    const user = response.data.data;
    set(authAtom, user);
    return { success: true, user };
  } catch (error) {
    set(authAtom, null);
    return { success: false };
  }
});
