import { api } from "@/lib/api";
import { create } from "zustand";

interface ProfileStore {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  contact: string;
  address: string;
  image: string;
}
interface Dealer {
  id: number;
  profile: Profile;
  role: string;
  company_name: string;
  license_number: string;
  tax_id: string;
  telebirr_account: string;
  is_verified: boolean;
}

interface DealerStore {
  dealer: Dealer | null;
  isLoading: boolean;
  error: string | null;
  getDealer: () => Promise<void>;
  updateDealer: (
    update: Partial<
      Pick<
        Dealer,
        "company_name" | "license_number" | "tax_id" | "telebirr_account"
      >
    >
  ) => Promise<void>;
}

export const useProfileStore = create<DealerStore>((set) => ({
  dealer: null,
  isLoading: false,
  error: null,

  getDealer: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Dealer>("/dealers/me/", {
        method: "GET",
      });
      set({ dealer: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.log(error);
    }
  },
  updateDealer: async (
    update: Partial<
      Pick<
        Dealer,
        "company_name" | "license_number" | "tax_id" | "telebirr_account"
      >
    >
  ) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Dealer>("/dealers/me/", {
        method: "PATCH",
        body: update as any,
      });
      set({ dealer: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.log(error);
    }
  },
}));
