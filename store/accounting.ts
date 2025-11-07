import { api } from "@/lib/api";
import { create } from "zustand";
import {
  Expense,
  FinancialReport,
  CarExpense,
  ExchangeRate,
  Revenue,
} from "@/types";

interface AccountingState {
  expenses: Expense[];
  financialReports: FinancialReport[];
  carExpenses: CarExpense[];
  exchangeRates: ExchangeRate[];
  revenues: Revenue[];
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
  fetchFinancialReport: (id: number) => Promise<FinancialReport>;
  createFinancialReport: (
    report: Omit<FinancialReport, "id" | "created_at">
  ) => Promise<void>;
  generateFinancialReport: (
    type: "profit_loss" | "balance_sheet",
    dealerId: number,
    month?: number,
    year?: number
  ) => Promise<void>;
  updateFinancialReport: (
    id: number,
    report: Partial<Omit<FinancialReport, "id" | "created_at">>
  ) => Promise<void>;
  deleteFinancialReport: (id: number) => Promise<void>;

  // Car Expense actions
  fetchCarExpenses: () => Promise<void>;
  createCarExpense: (expense: Omit<CarExpense, "id">) => Promise<void>;
  updateCarExpense: (
    id: number,
    expense: Partial<Omit<CarExpense, "id">>
  ) => Promise<void>;
  deleteCarExpense: (id: number) => Promise<void>;

  // Exchange Rate actions
  fetchExchangeRates: () => Promise<void>;
  createExchangeRate: (rate: Omit<ExchangeRate, "id">) => Promise<void>;
  updateExchangeRate: (
    id: number,
    rate: Partial<Omit<ExchangeRate, "id">>
  ) => Promise<void>;
  deleteExchangeRate: (id: number) => Promise<void>;

  // Revenue actions
  fetchRevenues: () => Promise<void>;
  createRevenue: (revenue: Omit<Revenue, "id">) => Promise<void>;
  updateRevenue: (
    id: number,
    revenue: Partial<Omit<Revenue, "id">>
  ) => Promise<void>;
  deleteRevenue: (id: number) => Promise<void>;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  expenses: [],
  financialReports: [],
  carExpenses: [],
  exchangeRates: [],
  revenues: [],
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
        body: expense as any,
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
        body: expense as any,
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
        body: report as any,
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

  fetchFinancialReport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<FinancialReport>(
        `/accounting/financial-reports/${id}/`,
        {
          method: "GET",
        }
      );
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  generateFinancialReport: async (type, dealerId, month, year) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("type", type);
      if (month) params.append("month", String(month));
      if (year) params.append("year", String(year));

      const res = await api<FinancialReport>(
        `/accounting/financial-reports/generate/?${params.toString()}`,
        {
          method: "POST",
          body: { type, dealer: dealerId, data: "" } as any,
        }
      );
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
          body: report as any,
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

  // Car Expense actions
  fetchCarExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<CarExpense[]>("/accounting/car-expenses/", {
        method: "GET",
      });
      set({ carExpenses: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCarExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<CarExpense>("/accounting/car-expenses/", {
        method: "POST",
        body: expense as any,
      });
      set((state) => ({
        carExpenses: [res, ...state.carExpenses],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCarExpense: async (id, expense) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<CarExpense>(`/accounting/car-expenses/${id}/`, {
        method: "PUT",
        body: expense as any,
      });
      set((state) => ({
        carExpenses: state.carExpenses.map((exp) =>
          exp.id === id ? res : exp
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCarExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/accounting/car-expenses/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        carExpenses: state.carExpenses.filter((exp) => exp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Exchange Rate actions
  fetchExchangeRates: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<ExchangeRate[]>("/accounting/exchange-rates/", {
        method: "GET",
      });
      set({ exchangeRates: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createExchangeRate: async (rate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<ExchangeRate>("/accounting/exchange-rates/", {
        method: "POST",
        body: rate as any,
      });
      set((state) => ({
        exchangeRates: [res, ...state.exchangeRates],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateExchangeRate: async (id, rate) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<ExchangeRate>(`/accounting/exchange-rates/${id}/`, {
        method: "PUT",
        body: rate as any,
      });
      set((state) => ({
        exchangeRates: state.exchangeRates.map((r) => (r.id === id ? res : r)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteExchangeRate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/accounting/exchange-rates/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        exchangeRates: state.exchangeRates.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Revenue actions
  fetchRevenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Revenue[]>("/accounting/revenues/", {
        method: "GET",
      });
      set({ revenues: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createRevenue: async (revenue) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Revenue>("/accounting/revenues/", {
        method: "POST",
        body: revenue as any,
      });
      set((state) => ({
        revenues: [res, ...state.revenues],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateRevenue: async (id, revenue) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Revenue>(`/accounting/revenues/${id}/`, {
        method: "PUT",
        body: revenue as any,
      });
      set((state) => ({
        revenues: state.revenues.map((r) => (r.id === id ? res : r)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteRevenue: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/accounting/revenues/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        revenues: state.revenues.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
