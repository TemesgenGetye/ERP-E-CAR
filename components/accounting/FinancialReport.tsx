"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { FinancialReport } from "@/types";

interface FinancialReportProps {
  financialReports: FinancialReport[];
  createFinancialReport: (
    report: Omit<FinancialReport, "id" | "created_at">
  ) => Promise<void>;
  generateFinancialReport: (
    type: "profit_loss" | "balance_sheet",
    dealerId: number,
    month?: number,
    year?: number
  ) => Promise<void>;
  fetchFinancialReport: (id: number) => Promise<FinancialReport>;
  updateFinancialReport: (
    id: number,
    report: Partial<Omit<FinancialReport, "id" | "created_at">>
  ) => Promise<void>;
  deleteFinancialReport: (id: number) => Promise<void>;
  dealerId?: number;
}

export function FinancialReportComponent({
  financialReports,
  createFinancialReport,
  generateFinancialReport,
  fetchFinancialReport,
  updateFinancialReport,
  deleteFinancialReport,
  dealerId,
}: FinancialReportProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingReport, setViewingReport] = useState<FinancialReport | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [form, setForm] = useState<{
    type: "profit_loss" | "balance_sheet";
    month: string;
    year: string;
  }>({
    type: "profit_loss",
    month: String(currentMonth),
    year: String(currentYear),
  });

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerId) {
      alert("Dealer information is required to generate reports.");
      return;
    }

    setIsGenerating(true);
    try {
      await generateFinancialReport(
        form.type,
        dealerId,
        parseInt(form.month),
        parseInt(form.year)
      );
      setShowDialog(false);
      setForm({
        type: "profit_loss",
        month: String(currentMonth),
        year: String(currentYear),
      });
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleView = async (reportId: number) => {
    try {
      setShowViewDialog(true);
      // Try to find report in the list first
      const existingReport = financialReports.find((r) => r.id === reportId);
      if (existingReport && existingReport.data) {
        setViewingReport(existingReport);
      } else {
        // If not found or data is missing, fetch it
        try {
          const report = await fetchFinancialReport(reportId);
          setViewingReport(report);
        } catch (fetchError) {
          // If fetch fails, still show the existing report if available
          if (existingReport) {
            setViewingReport(existingReport);
          } else {
            throw fetchError;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Failed to load report details.");
      setShowViewDialog(false);
    }
  };

  const handleDownload = async (report: FinancialReport) => {
    try {
      // Ensure we have the latest report data
      let reportData = report;
      if (!report.data) {
        reportData = await fetchFinancialReport(report.id);
      }

      // Parse the report data
      let parsedData: any;
      if (typeof reportData.data === "string") {
        try {
          parsedData = JSON.parse(reportData.data);
        } catch {
          // If it's not JSON, treat it as plain text
          parsedData = { content: reportData.data };
        }
      } else {
        parsedData = reportData.data;
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();

      // Prepare data for Excel
      let worksheetData: any[][] = [];

      // Add header rows
      worksheetData.push([
        `${reportData.type.replace("_", " ").toUpperCase()} REPORT`,
      ]);
      worksheetData.push([
        `Created: ${new Date(reportData.created_at).toLocaleDateString()}`,
      ]);
      worksheetData.push([]); // Empty row

      // Convert data to worksheet format
      if (typeof parsedData === "object" && parsedData !== null) {
        if (Array.isArray(parsedData)) {
          // If it's an array, create table format
          if (parsedData.length > 0) {
            const headers = Object.keys(parsedData[0]);
            worksheetData.push(headers);
            parsedData.forEach((row: any) => {
              worksheetData.push(headers.map((header) => row[header] ?? ""));
            });
          }
        } else {
          // If it's an object, create key-value pairs
          worksheetData.push(["Item", "Value"]);
          Object.entries(parsedData).forEach(([key, value]) => {
            const val =
              typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value);
            worksheetData.push([key, val]);
          });
        }
      } else {
        // Plain text content
        worksheetData.push(["Content"]);
        worksheetData.push([String(parsedData.content || parsedData)]);
      }

      // Create worksheet from data
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths for better readability
      const maxWidth = worksheetData.reduce((acc, row) => {
        row.forEach((cell, idx) => {
          const cellLength = String(cell || "").length;
          acc[idx] = Math.max(acc[idx] || 10, Math.min(cellLength, 50));
        });
        return acc;
      }, {} as Record<number, number>);

      worksheet["!cols"] = Object.keys(maxWidth).map((k) => ({
        wch: maxWidth[Number(k)],
      }));

      // Style the header row
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      if (range.s.r === 0) {
        worksheet["!rows"] = [{ hpt: 20 }];
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        reportData.type.replace("_", " ")
      );

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportData.type}_${
        new Date(reportData.created_at).toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteFinancialReport(id);
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Reports</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate and manage financial reports
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Financial Report</DialogTitle>
              <DialogDescription>
                Automatically generate a financial report based on your
                revenues, expenses, and car expenses for the selected period.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGenerate}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm({ ...form, type: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profit_loss">Profit & Loss</SelectItem>
                      <SelectItem value="balance_sheet">
                        Balance Sheet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="month">Month</Label>
                    <Select
                      value={form.month}
                      onValueChange={(value) =>
                        setForm({ ...form, month: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem key={month} value={String(month)}>
                              {new Date(2024, month - 1).toLocaleString(
                                "default",
                                { month: "long" }
                              )}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="2020"
                      max={currentYear + 1}
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setForm({
                      type: "profit_loss",
                      month: String(currentMonth),
                      year: String(currentYear),
                    });
                  }}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Report"}
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
                    <DropdownMenuItem onClick={() => handleView(report.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(report)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(report.id)}
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

      {/* View Report Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingReport?.type.replace("_", " ").toUpperCase()} Report
            </DialogTitle>
            <DialogDescription>
              Created:{" "}
              {viewingReport &&
                new Date(viewingReport.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {viewingReport ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getReportTypeColor(viewingReport.type)}>
                    {viewingReport.type.replace("_", " ")}
                  </Badge>
                </div>
                {viewingReport.data ? (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="whitespace-pre-wrap text-sm font-mono max-h-96 overflow-auto">
                      {typeof viewingReport.data === "string"
                        ? viewingReport.data
                        : JSON.stringify(viewingReport.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/30 text-center">
                    <p className="text-muted-foreground">
                      No data available for this report.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading report...</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                viewingReport && handleDownload(viewingReport);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
