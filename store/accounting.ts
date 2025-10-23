import { api } from "@/lib/api";
import { create } from "zustand";
import { Expense, FinancialReport } from "@/types";

interface AccountingState {
  expenses: Expense[];
  financialReports: FinancialReport[];
  isLoading: boolean;
  error: string | null;

  // Expense actions
  fetchExpenses: () => Promise<void>;
  createExpense: (expense: Omit<Expense, "id" | "date">) => Promise<void>;
  updateExpense: (
    id: number,
    expense: Partial<Omit<Expense, "id" | "date">>
  ) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  // Financial Report actions
  fetchFinancialReports: () => Promise<void>;
  createFinancialReport: (
    report: Omit<FinancialReport, "id" | "created_at">
  ) => Promise<void>;
  updateFinancialReport: (
    id: number,
    report: Partial<Omit<FinancialReport, "id" | "created_at">>
  ) => Promise<void>;
  deleteFinancialReport: (id: number) => Promise<void>;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  expenses: [],
  financialReports: [],
  isLoading: false,
  error: null,

  // Expense actions
  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Expense[]>("/accounting/expenses/", {
        method: "GET",
      });
      set({ expenses: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Expense>("/accounting/expenses/", {
        method: "POST",
        body: expense,
      });
      set((state) => ({
        expenses: [res, ...state.expenses],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateExpense: async (id, expense) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Expense>(`/accounting/expenses/${id}/`, {
        method: "PUT",
        body: expense,
      });
      set((state) => ({
        expenses: state.expenses.map((exp) => (exp.id === id ? res : exp)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/accounting/expenses/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Financial Report actions
  fetchFinancialReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<FinancialReport[]>(
        "/accounting/financial-reports/",
        {
          method: "GET",
        }
      );
      set({ financialReports: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createFinancialReport: async (report) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<FinancialReport>("/accounting/financial-reports/", {
        method: "POST",
        body: report,
      });
      set((state) => ({
        financialReports: [res, ...state.financialReports],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateFinancialReport: async (id, report) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<FinancialReport>(
        `/accounting/financial-reports/${id}/`,
        {
          method: "PUT",
          body: report,
        }
      );
      set((state) => ({
        financialReports: state.financialReports.map((rep) =>
          rep.id === id ? res : rep
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteFinancialReport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/accounting/financial-reports/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        financialReports: state.financialReports.filter((rep) => rep.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
