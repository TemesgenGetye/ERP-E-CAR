import { api } from "@/lib/api";
import { create } from "zustand";

interface CarView {
  car_id: number;
  car_make: string;
  car_model: string;
  total_views: number;
}

interface ModelStats {
  make_name: string;
  model_name: string;
  total_sold: number;
  total_sales: number;
  avg_price: number;
}

interface DealerAnalytics {
  total_cars: number;
  sold_cars: number;
  average_price: number;
  model_stats: ModelStats[];
}

interface Analytics {
  carViews: CarView[];
  dealerAnalytics: DealerAnalytics | null;
}

interface AnalyticsState {
  analytics: Analytics;
  isLoading: boolean;
  error: string | null;
  getCarViewsAnalytics: () => Promise<void>;
  getDealerAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: {
    carViews: [],
    dealerAnalytics: null,
  },
  isLoading: false,
  error: null,
  getCarViewsAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<CarView[]>(
        "/inventory/car-views/dealer-analytics/",
        {
          method: "GET",
        }
      );
      set((state) => ({
        analytics: { ...state.analytics, carViews: res },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getDealerAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<DealerAnalytics>(
        "/inventory/cars/dealer-analytics/",
        {
          method: "GET",
        }
      );
      set((state) => ({
        analytics: { ...state.analytics, dealerAnalytics: res },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
