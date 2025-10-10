import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";

export const useAnalytics = () => {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const isLoading = useAnalyticsStore((state) => state.isLoading);
  const error = useAnalyticsStore((state) => state.error);
  const getCarViewsAnalytics = useAnalyticsStore(
    (state) => state.getCarViewsAnalytics
  );
  const getDealerAnalytics = useAnalyticsStore(
    (state) => state.getDealerAnalytics
  );

  useEffect(() => {
    getCarViewsAnalytics();
  }, []);

  useEffect(() => {
    getDealerAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error,
    getCarViewsAnalytics,
    getDealerAnalytics,
  };
};
