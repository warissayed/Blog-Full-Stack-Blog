import { create } from "zustand";

interface User {
  data: {
    _id: string;
    avatar: string;
    username: string;
    email: string;
  };
}

interface userState {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

export const setUserStore = create<userState>((set) => ({
  user: null,
  setUser: (useData) => set({ user: useData }),
  logoutUser: () => set({ user: null }),
}));

export default setUserStore;
