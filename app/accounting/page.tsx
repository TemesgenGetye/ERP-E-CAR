"use client";

import {
  DollarSign,
  FileText,
  Calendar,
  Car,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounting } from "@/hooks/useAccounting";
import { useProfile } from "@/hooks/useProfile";
import { useCarData } from "@/hooks/useCarData";
import { useEffect } from "react";
import { GeneralExpense } from "@/components/accounting/GeneralExpense";
import { CarExpenseComponent } from "@/components/accounting/CarExpense";
import { ExchangeRateComponent } from "@/components/accounting/ExchangeRate";
import { FinancialReportComponent } from "@/components/accounting/FinancialReport";
import { RevenueComponent } from "@/components/accounting/Revenue";

export default function AccountingPage() {
  const {
    expenses,
    financialReports,
    carExpenses,
    exchangeRates,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    createFinancialReport,
    generateFinancialReport,
    fetchFinancialReport,
    updateFinancialReport,
    deleteFinancialReport,
    createCarExpense,
    updateCarExpense,
    deleteCarExpense,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
    revenues,
    createRevenue,
    updateRevenue,
    deleteRevenue,
  } = useAccounting();

  const { cars, fetchCars } = useCarData();
  const { dealer } = useProfile();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading accounting data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Accounting
          </h1>
          <p className="text-muted-foreground">
            Manage expenses and financial reports
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.abs(totalExpenses).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {Math.abs(
                  expenses
                    .filter(() => true)
                    .reduce(
                      (sum, expense) => sum + parseFloat(expense.amount),
                      0
                    )
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Current month expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialReports.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Financial reports generated
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="expenses">General Expenses</TabsTrigger>
            <TabsTrigger value="car-expenses">
              <Car className="h-4 w-4 mr-2" />
              Car Expenses
            </TabsTrigger>
            <TabsTrigger value="exchange-rates">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Exchange Rates
            </TabsTrigger>
            <TabsTrigger value="revenues">Revenues</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <GeneralExpense
              expenses={expenses}
              createExpense={createExpense}
              updateExpense={updateExpense}
              deleteExpense={deleteExpense}
              dealerId={dealer?.id}
            />
          </TabsContent>

          <TabsContent value="car-expenses">
            <CarExpenseComponent
              carExpenses={carExpenses}
              cars={cars}
              createCarExpense={createCarExpense}
              updateCarExpense={updateCarExpense}
              deleteCarExpense={deleteCarExpense}
              dealerId={dealer?.id}
            />
          </TabsContent>

          <TabsContent value="exchange-rates">
            <ExchangeRateComponent
              exchangeRates={exchangeRates}
              createExchangeRate={createExchangeRate}
              updateExchangeRate={updateExchangeRate}
              deleteExchangeRate={deleteExchangeRate}
            />
          </TabsContent>

          <TabsContent value="reports">
            <FinancialReportComponent
              financialReports={financialReports}
              createFinancialReport={createFinancialReport}
              generateFinancialReport={generateFinancialReport}
              fetchFinancialReport={fetchFinancialReport}
              updateFinancialReport={updateFinancialReport}
              deleteFinancialReport={deleteFinancialReport}
              dealerId={dealer?.id}
            />
          </TabsContent>

          <TabsContent value="revenues">
            <RevenueComponent
              revenues={revenues}
              createRevenue={createRevenue}
              updateRevenue={updateRevenue}
              deleteRevenue={deleteRevenue}
              dealerId={dealer?.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
