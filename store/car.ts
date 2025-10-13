import { api } from "@/lib/api";
import { create } from "zustand";
import { Car } from "@/types";

export interface Make {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
  make?: Make;
}

interface CarState {
  cars: Car[];
  car: Car | null;
  makes: Make[];
  models: Model[];
  isLoading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  fetchMakes: () => Promise<void>;
  fetchModels: (makeId?: number) => Promise<void>;
  postCar: (car: FormData) => Promise<void>;
  fetchFilteredCars: (filters: {
    fuel_type?: string;
    make?: string;
    make_ref?: number;
    model?: string;
    model_ref?: number;
    price_min?: number;
    price_max?: number;
    sale_type?: string;
  }) => Promise<Car[]>;
}

export const useCarStore = create<CarState>((set) => ({
  cars: [],
  car: null,
  makes: [],
  models: [],
  isLoading: false,
  error: null,

  fetchCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Car[]>("/inventory/user-cars/", {
        method: "GET",
      });
      set({ cars: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchCarById: async (id: string) => {
    set({ car: null, isLoading: true, error: null });
    try {
      const res = await api<Car>(`/inventory/user-cars/${id}`, {
        method: "GET",
      });
      set({ car: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMakes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Make[]>("/inventory/makes/", {
        method: "GET",
      });
      set({ makes: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchModels: async (makeId?: number) => {
    set({ isLoading: true, error: null, models: [] });
    try {
      const url = makeId
        ? `/inventory/models/?make=${makeId}`
        : "/inventory/models/";
      const res = await api<Model[]>(url, {
        method: "GET",
      });
      set({ models: res, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  postCar: async (car: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await api<Car>("/inventory/cars/", {
        method: "POST",
        body: car,
      });
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchFilteredCars: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.fuel_type) params.append("fuel_type", filters.fuel_type);
      if (typeof filters.make_ref === "number")
        params.append("make_ref", String(filters.make_ref));
      if (filters.make) params.append("make", filters.make);
      if (typeof filters.model_ref === "number")
        params.append("model_ref", String(filters.model_ref));
      if (filters.model) params.append("model", filters.model);
      if (typeof filters.price_min === "number")
        params.append("price_min", String(filters.price_min));
      if (typeof filters.price_max === "number")
        params.append("price_max", String(filters.price_max));
      if (filters.sale_type) params.append("sale_type", filters.sale_type);

      const url = `/inventory/cars/filter/${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await api<Car[]>(url, { method: "GET" });
      set({ cars: res, isLoading: false });
      return res;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },
}));
