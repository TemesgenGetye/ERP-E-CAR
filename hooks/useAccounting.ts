import { useAccountingStore } from "@/store/accounting";
import { useEffect } from "react";

export const useAccounting = () => {
  const expenses = useAccountingStore((state) => state.expenses);
  const financialReports = useAccountingStore(
    (state) => state.financialReports
  );
  const isLoading = useAccountingStore((state) => state.isLoading);
  const error = useAccountingStore((state) => state.error);

  const fetchExpenses = useAccountingStore((state) => state.fetchExpenses);
  const createExpense = useAccountingStore((state) => state.createExpense);
  const updateExpense = useAccountingStore((state) => state.updateExpense);
  const deleteExpense = useAccountingStore((state) => state.deleteExpense);

  const fetchFinancialReports = useAccountingStore(
    (state) => state.fetchFinancialReports
  );
  const createFinancialReport = useAccountingStore(
    (state) => state.createFinancialReport
  );
  const updateFinancialReport = useAccountingStore(
    (state) => state.updateFinancialReport
  );
  const deleteFinancialReport = useAccountingStore(
    (state) => state.deleteFinancialReport
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchFinancialReports();
  }, [fetchFinancialReports]);

  return {
    expenses,
    financialReports,
    isLoading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchFinancialReports,
    createFinancialReport,
    updateFinancialReport,
    deleteFinancialReport,
  };
};
