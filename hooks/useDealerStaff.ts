import { useDealerStaffStore } from "@/store/dealerStaff";
import { useEffect } from "react";
import { useAuthGuard } from "./useAuthGuard";

export const useDealerStaff = () => {
  const staff = useDealerStaffStore((state) => state.staff);
  const isLoading = useDealerStaffStore((state) => state.isLoading);
  const error = useDealerStaffStore((state) => state.error);
  const { canMakeApiCalls } = useAuthGuard();

  const fetchStaff = useDealerStaffStore((state) => state.fetchStaff);
  const createStaff = useDealerStaffStore((state) => state.createStaff);
  const updateStaff = useDealerStaffStore((state) => state.updateStaff);
  const deleteStaff = useDealerStaffStore((state) => state.deleteStaff);
  const getStaffById = useDealerStaffStore((state) => state.getStaffById);

  useEffect(() => {
    if (canMakeApiCalls) {
      fetchStaff();
    }
  }, [fetchStaff, canMakeApiCalls]);

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
  };
};
