import { create } from "zustand";

type UserStore = {
  email: string;
  first_name: string;
  last_name: string;
  description?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
};

type UserState = {
  user: UserStore;
  setUser: (user: UserStore) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: { email: "", first_name: "", last_name: "" },
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: { email: "", first_name: "", last_name: "" } }),
}));
