import { api } from "@/lib/api";
import { create } from "zustand";
import { Sale, Lead } from "@/types";

interface SalesState {
  sales: Sale[];
  leads: Lead[];
  isLoading: boolean;
  error: string | null;

  fetchSales: () => Promise<void>;
  createSale: (sale: Omit<Sale, "id" | "date">) => Promise<void>;
  updateSale: (
    id: number,
    sale: Partial<Omit<Sale, "id" | "date">>
  ) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  fetchLeads: () => Promise<void>;
  createLead: (lead: Omit<Lead, "id" | "created_at">) => Promise<void>;
  updateLead: (
    id: number,
    lead: Partial<Omit<Lead, "id" | "created_at">>
  ) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  leads: [],
  isLoading: false,
  error: null,

  fetchSales: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Sale[]>("/sales/", {
        method: "GET",
      });
      set({ sales: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createSale: async (sale) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Sale>("/sales/", {
        method: "POST",
        body: sale,
      });
      set((state) => ({
        sales: [res, ...state.sales],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateSale: async (id, sale) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Sale>(`/sales/${id}/`, {
        method: "PUT",
        body: sale,
      });
      set((state) => ({
        sales: state.sales.map((s) => (s.id === id ? res : s)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteSale: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/sales/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Lead actions
  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Lead[]>("/sales/leads/", {
        method: "GET",
      });
      set({ leads: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createLead: async (lead) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Lead>("/sales/leads/", {
        method: "POST",
        body: lead,
      });
      set((state) => ({
        leads: [res, ...state.leads],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateLead: async (id, lead) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Lead>(`/sales/leads/${id}/`, {
        method: "PUT",
        body: lead,
      });
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? res : l)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteLead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/sales/leads/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
