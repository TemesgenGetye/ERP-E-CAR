import { useAccountingStore } from "@/store/accounting";
import { useEffect } from "react";

export const useAccounting = () => {
  const expenses = useAccountingStore((state) => state.expenses);
  const financialReports = useAccountingStore(
    (state) => state.financialReports
  );
  const carExpenses = useAccountingStore((state) => state.carExpenses);
  const exchangeRates = useAccountingStore((state) => state.exchangeRates);
  const revenues = useAccountingStore((state) => state.revenues);
  const isLoading = useAccountingStore((state) => state.isLoading);
  const error = useAccountingStore((state) => state.error);

  const fetchExpenses = useAccountingStore((state) => state.fetchExpenses);
  const createExpense = useAccountingStore((state) => state.createExpense);
  const updateExpense = useAccountingStore((state) => state.updateExpense);
  const deleteExpense = useAccountingStore((state) => state.deleteExpense);

  const fetchFinancialReports = useAccountingStore(
    (state) => state.fetchFinancialReports
  );
  const fetchFinancialReport = useAccountingStore(
    (state) => state.fetchFinancialReport
  );
  const createFinancialReport = useAccountingStore(
    (state) => state.createFinancialReport
  );
  const generateFinancialReport = useAccountingStore(
    (state) => state.generateFinancialReport
  );
  const updateFinancialReport = useAccountingStore(
    (state) => state.updateFinancialReport
  );
  const deleteFinancialReport = useAccountingStore(
    (state) => state.deleteFinancialReport
  );

  const fetchCarExpenses = useAccountingStore(
    (state) => state.fetchCarExpenses
  );
  const createCarExpense = useAccountingStore(
    (state) => state.createCarExpense
  );
  const updateCarExpense = useAccountingStore(
    (state) => state.updateCarExpense
  );
  const deleteCarExpense = useAccountingStore(
    (state) => state.deleteCarExpense
  );

  const fetchExchangeRates = useAccountingStore(
    (state) => state.fetchExchangeRates
  );
  const createExchangeRate = useAccountingStore(
    (state) => state.createExchangeRate
  );
  const updateExchangeRate = useAccountingStore(
    (state) => state.updateExchangeRate
  );
  const deleteExchangeRate = useAccountingStore(
    (state) => state.deleteExchangeRate
  );

  const fetchRevenues = useAccountingStore((state) => state.fetchRevenues);
  const createRevenue = useAccountingStore((state) => state.createRevenue);
  const updateRevenue = useAccountingStore((state) => state.updateRevenue);
  const deleteRevenue = useAccountingStore((state) => state.deleteRevenue);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchFinancialReports();
  }, [fetchFinancialReports]);

  useEffect(() => {
    fetchCarExpenses();
  }, [fetchCarExpenses]);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    fetchRevenues();
  }, [fetchRevenues]);

  return {
    expenses,
    financialReports,
    carExpenses,
    exchangeRates,
    revenues,
    isLoading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchFinancialReports,
    fetchFinancialReport,
    createFinancialReport,
    generateFinancialReport,
    updateFinancialReport,
    deleteFinancialReport,
    fetchCarExpenses,
    createCarExpense,
    updateCarExpense,
    deleteCarExpense,
    fetchExchangeRates,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
    fetchRevenues,
    createRevenue,
    updateRevenue,
    deleteRevenue,
  };
};
