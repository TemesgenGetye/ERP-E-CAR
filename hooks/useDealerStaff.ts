import { useDealerStaffStore } from "@/store/dealerStaff";
import { useEffect } from "react";

export const useDealerStaff = () => {
  const staff = useDealerStaffStore((state) => state.staff);
  const isLoading = useDealerStaffStore((state) => state.isLoading);
  const error = useDealerStaffStore((state) => state.error);

  const fetchStaff = useDealerStaffStore((state) => state.fetchStaff);
  const createStaff = useDealerStaffStore((state) => state.createStaff);
  const updateStaff = useDealerStaffStore((state) => state.updateStaff);
  const deleteStaff = useDealerStaffStore((state) => state.deleteStaff);
  const getStaffById = useDealerStaffStore((state) => state.getStaffById);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

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
