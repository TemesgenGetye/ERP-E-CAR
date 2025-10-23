import { useSalesStore } from "@/store/sales";
import { useEffect } from "react";

export const useSales = () => {
  const sales = useSalesStore((state) => state.sales);
  const leads = useSalesStore((state) => state.leads);
  const isLoading = useSalesStore((state) => state.isLoading);
  const error = useSalesStore((state) => state.error);

  const fetchSales = useSalesStore((state) => state.fetchSales);
  const createSale = useSalesStore((state) => state.createSale);
  const updateSale = useSalesStore((state) => state.updateSale);
  const deleteSale = useSalesStore((state) => state.deleteSale);

  const fetchLeads = useSalesStore((state) => state.fetchLeads);
  const createLead = useSalesStore((state) => state.createLead);
  const updateLead = useSalesStore((state) => state.updateLead);
  const deleteLead = useSalesStore((state) => state.deleteLead);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    sales,
    leads,
    isLoading,
    error,
    fetchSales,
    createSale,
    updateSale,
    deleteSale,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
};
