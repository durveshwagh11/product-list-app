import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,

  checkAuth: async () => {
    try {
      const response = await axios.get("/api/auth/me");
      set({ user: response.data.data });
    } catch {
      set({ user: null });
    }
  },

  // mode: "login" | "signup"; throws so the form can show the server message
  authenticate: async (mode, credentials) => {
    const response = await axios.post(`/api/auth/${mode}`, credentials);
    set({ user: response.data.data });
  },

  logout: async () => {
    await axios.post("/api/auth/logout");
    set({ user: null });
  },
}));
