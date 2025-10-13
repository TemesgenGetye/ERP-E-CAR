import { useProfileStore } from "@/store/profile";
import { useEffect } from "react";

export const useProfile = () => {
  const dealer = useProfileStore((state) => state.dealer);
  const isLoading = useProfileStore((state) => state.isLoading);
  const error = useProfileStore((state) => state.error);
  const getDealer = useProfileStore((state) => state.getDealer);
  const updateDealer = useProfileStore((state) => state.updateDealer);

  useEffect(() => {
    getDealer();
  }, []);

  return {
    dealer,
    isLoading,
    error,
    getDealer,
    updateDealer,
  };
};
