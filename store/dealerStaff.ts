import { api } from "@/lib/api";
import { create } from "zustand";
import { DealerStaff, CreateDealerStaffRequest } from "@/types";

interface DealerStaffState {
  staff: DealerStaff[];
  isLoading: boolean;
  error: string | null;

  fetchStaff: () => Promise<void>;
  createStaff: (staff: CreateDealerStaffRequest) => Promise<void>;
  updateStaff: (
    id: number,
    staff: Partial<CreateDealerStaffRequest>
  ) => Promise<void>;
  deleteStaff: (id: number) => Promise<void>;
  getStaffById: (id: number) => DealerStaff | undefined;
}

export const useDealerStaffStore = create<DealerStaffState>((set, get) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<DealerStaff[]>("/dealers/staff/", {
        method: "GET",
      });
      set({ staff: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createStaff: async (staffData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<DealerStaff>("/dealers/staff/", {
        method: "POST",
        body: JSON.stringify(staffData),
      });
      set((state) => ({
        staff: [res, ...state.staff],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<DealerStaff>(`/dealers/staff/${id}/`, {
        method: "PUT",
        body: JSON.stringify(staffData),
      });
      set((state) => ({
        staff: state.staff.map((s) => (s.id === id ? res : s)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteStaff: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/dealers/staff/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        staff: state.staff.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getStaffById: (id) => {
    const state = get();
    return state.staff.find((s) => s.id === id);
  },
}));
