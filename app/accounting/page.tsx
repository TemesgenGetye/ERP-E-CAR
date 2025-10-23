"use client";

import { useState } from "react";
import {
  Plus,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAccounting } from "@/hooks/useAccounting";
import { Expense, FinancialReport } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStore } from "@/store/profile";

export default function AccountingPage() {
  const {
    expenses,
    financialReports,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    createFinancialReport,
    updateFinancialReport,
    deleteFinancialReport,
  } = useAccounting();

  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingReport, setEditingReport] = useState<FinancialReport | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");
  const { dealer } = useProfile();

  const [expenseForm, setExpenseForm] = useState<{
    type: "maintenance" | "marketing" | "oprational" | "other";
    amount: string;
    description: string;
    dealer?: number;
  }>({
    type: "maintenance",
    amount: "",
    dealer: dealer?.id,
    description: "",
  });

  const [reportForm, setReportForm] = useState<{
    type: "profit_loss" | "balance_sheet" | "cash_flow";
    dealer?: number;
    data: string;
  }>({
    type: "profit_loss",
    dealer: dealer?.id,
    data: "",
  });

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let formDealer = expenseForm.dealer ?? dealer?.id;
      if (!formDealer) {
        await useProfileStore.getState().getDealer();
        formDealer = useProfileStore.getState().dealer?.id;
      }
      if (!formDealer) {
        alert(
          "Dealer information not loaded yet. Please refresh or try again shortly."
        );
        return;
      }
      const payload = { ...expenseForm, dealer: formDealer } as any;

      if (editingExpense) {
        await updateExpense(editingExpense.id, payload);
      } else {
        console.log(payload);
        await createExpense(payload);
      }
      setShowExpenseDialog(false);
      setEditingExpense(null);
      setExpenseForm({
        type: "maintenance",
        amount: "",
        description: "",
        dealer: dealer?.id,
      });
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...reportForm } as any;
      if (editingReport) {
        await updateFinancialReport(editingReport.id, payload);
      } else {
        await createFinancialReport(payload);
      }
      setShowReportDialog(false);
      setEditingReport(null);
      setReportForm({ type: "profit_loss", dealer: dealer?.id });
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      type: expense.type,
      amount: expense.amount,
      description: expense.description,
      dealer: dealer?.id,
    });
    setShowExpenseDialog(true);
  };

  const handleEditReport = (report: FinancialReport) => {
    setEditingReport(report);
    setReportForm({
      type: report.type,
      data: report.data,
      dealer: dealer?.id,
    });
    setShowReportDialog(true);
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteFinancialReport(id);
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) => filterType === "all" || expense.type === filterType
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      case "oprational":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "profit_loss":
        return "bg-green-100 text-green-800";
      case "balance_sheet":
        return "bg-blue-100 text-blue-800";
      case "cash_flow":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                    .filter(
                      (expense) =>
                        new Date(expense.date).getMonth() ===
                        new Date().getMonth()
                    )
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expenses Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expenses</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track and manage business expenses
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="oprational">Operational</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog
                  open={showExpenseDialog}
                  onOpenChange={setShowExpenseDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingExpense ? "Edit Expense" : "Add New Expense"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingExpense
                          ? "Update the expense details below."
                          : "Add a new expense to your records."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleExpenseSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={expenseForm.type}
                            onValueChange={(value) =>
                              setExpenseForm({
                                ...expenseForm,
                                type: value as any,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="oprational">
                                Operational
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={expenseForm.amount}
                            onChange={(e) =>
                              setExpenseForm({
                                ...expenseForm,
                                amount: e.target.value,
                              })
                            }
                            placeholder="Enter amount"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={expenseForm.description}
                            onChange={(e) =>
                              setExpenseForm({
                                ...expenseForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter description"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowExpenseDialog(false);
                            setEditingExpense(null);
                            setExpenseForm({
                              type: "maintenance",
                              amount: "",
                              description: "",
                              dealer: dealer?.id,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingExpense ? "Update" : "Add"} Expense
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getExpenseTypeColor(expense.type)}
                            >
                              {expense.type}
                            </Badge>
                            <span className="font-medium">
                              $
                              {Math.abs(
                                parseFloat(expense.amount)
                              ).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {expense.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No expenses found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Reports Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate and manage financial reports
                </p>
              </div>
              <Dialog
                open={showReportDialog}
                onOpenChange={setShowReportDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingReport ? "Edit Report" : "Add New Report"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingReport
                        ? "Update the report details below."
                        : "Add a new financial report."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleReportSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reportType">Type</Label>
                        <Select
                          value={reportForm.type}
                          onValueChange={(value) =>
                            setReportForm({ ...reportForm, type: value as any })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="profit_loss">
                              Profit & Loss
                            </SelectItem>
                            <SelectItem value="balance_sheet">
                              Balance Sheet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowReportDialog(false);
                          setEditingReport(null);
                          setReportForm({
                            type: "profit_loss",
                            dealer: dealer?.id,
                            data: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingReport ? "Update" : "Add"} Report
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialReports.length > 0 ? (
                  financialReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <Badge className={getReportTypeColor(report.type)}>
                              {report.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created:{" "}
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditReport(report)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reports found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
