import { create } from "zustand";

interface userState {
  user: string | null;
  setUser: (useData: string | null) => void;
  logoutUser: () => void;
}

export const setUserStore = create<userState>((set) => ({
  user: null,
  setUser: (useData) => set({ user: useData }),
  logoutUser: () => set({ user: null }),
}));

export default setUserStore;
