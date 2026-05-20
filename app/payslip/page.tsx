"use client";

import { FileText, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayslip } from "@/hooks/payslip";
import { useState } from "react";

interface PayslipLineItem {
  name: string;
  amount: string;
}

interface PayslipItem {
  employee: number;
  gross_earnings: string;
  total_deductions: string;
  net_salary: string;
  earnings: PayslipLineItem[];
  deductions: PayslipLineItem[];
}

export default function PayslipPage() {
  const { payslipData, isLoadingPayslip, payslipError, refetchPayslip } =
    usePayslip();
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `ETB ${num.toLocaleString()}`;
  };

  const downloadPayslip = async (payslip: PayslipItem, index: number) => {
    setDownloadingIndex(index);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageW, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("PAYSLIP", pageW / 2, 18, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Employee #${payslip.employee}`, pageW / 2, 30, { align: "center" });
      y = 55;

      // Earnings section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text("Earnings", 14, y);
      y += 6;
      doc.setDrawColor(22, 101, 52);
      doc.line(14, y, pageW - 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      payslip.earnings.forEach((item) => {
        doc.text(item.name, 18, y);
        doc.text(formatCurrency(item.amount), pageW - 14, y, { align: "right" });
        y += 7;
      });

      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, y, pageW - 28, 10, 2, 2, "F");
      doc.setTextColor(22, 101, 52);
      doc.text("Gross Earnings", 18, y + 7);
      doc.text(formatCurrency(payslip.gross_earnings), pageW - 14, y + 7, { align: "right" });
      y += 20;

      // Deductions section
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(185, 28, 28);
      doc.text("Deductions", 14, y);
      y += 6;
      doc.setDrawColor(185, 28, 28);
      doc.line(14, y, pageW - 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      payslip.deductions.forEach((item) => {
        doc.text(item.name, 18, y);
        doc.text(formatCurrency(item.amount), pageW - 14, y, { align: "right" });
        y += 7;
      });

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 241, 242);
      doc.roundedRect(14, y, pageW - 28, 10, 2, 2, "F");
      doc.setTextColor(185, 28, 28);
      doc.text("Total Deductions", 18, y + 7);
      doc.text(formatCurrency(payslip.total_deductions), pageW - 14, y + 7, { align: "right" });
      y += 20;

      // Net salary
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(14, y, pageW - 28, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Net Salary", 20, y + 11);
      doc.text(formatCurrency(payslip.net_salary), pageW - 20, y + 11, { align: "right" });

      doc.save(`payslip-employee-${payslip.employee}.pdf`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  if (isLoadingPayslip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payslip data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Payslip
          </h1>
          <p className="text-muted-foreground">
            View your payroll payslip information and earnings details
          </p>
        </div>

        {/* Error Display */}
        {payslipError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                <p className="text-red-600 text-sm">
                  Failed to fetch payslip data. Please check your connection and
                  try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6">
          <Button
            onClick={() => refetchPayslip()}
            disabled={isLoadingPayslip}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Payslip Data */}
        {payslipData?.length === 0 ? (
          <Card className="shadow-none bg-transparent">
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payslip Data</h3>
              <p className="text-muted-foreground">
                No payslip information available at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {payslipData?.map((payslip: PayslipItem, index: number) => (
              <Card key={index} className="shadow-none bg-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle>Employee #{payslip.employee}</CardTitle>
                    </div> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPayslip(payslip, index)}
                      disabled={downloadingIndex === index}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {downloadingIndex === index ? "Generating..." : "Download"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-3">
                        Earnings
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-green-50 rounded">
                          <span className="font-medium">Gross Earnings:</span>
                          <span className="font-bold text-green-700">
                            {formatCurrency(payslip.gross_earnings)}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded space-y-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            Earnings Details:
                          </p>
                          {payslip.earnings.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="font-medium">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-3">
                        Deductions
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span className="font-medium">Total Deductions:</span>
                          <span className="font-bold text-red-700">
                            {formatCurrency(payslip.total_deductions)}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded space-y-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            Deductions Details:
                          </p>
                          {payslip.deductions.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="font-medium">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-800">
                        Net Salary:
                      </span>
                      <span className="text-xl font-bold text-blue-800">
                        {formatCurrency(payslip.net_salary)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
