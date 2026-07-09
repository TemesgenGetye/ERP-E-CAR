"use client";

import { FileText, Download, RefreshCw, User, Mail, Phone, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePayslip } from "@/hooks/payslip";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface PayslipLineItem {
  name: string;
  amount: string;
}

interface EmployeeInfo {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  contact: string;
  position: string;
  hire_date: string;
}

interface PayslipItem {
  employee: EmployeeInfo;
  payroll_run: number;
  processed_at: string;
  gross_earnings: string;
  total_deductions: string;
  net_salary: string;
  earnings: PayslipLineItem[];
  deductions: PayslipLineItem[];
}

function PayslipCard({
  payslip,
  downloadingIndex,
  index,
  onDownload,
}: {
  payslip: PayslipItem;
  downloadingIndex: number | null;
  index: number;
  onDownload: (payslip: PayslipItem, index: number) => void;
}) {
  const { employee } = payslip;

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `ETB ${num.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Card className="shadow-none bg-transparent">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-base">{employee.full_name || `${employee.first_name} ${employee.last_name}`.trim() || "—"}</p>
              <p className="text-sm text-muted-foreground capitalize">{employee.position}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
            <span>Payroll Run #{payslip.payroll_run}</span>
            <span>Processed: {formatDate(payslip.processed_at)}</span>
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => onDownload(payslip, index)}
              disabled={downloadingIndex === index}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadingIndex === index ? "Generating..." : "Download"}
            </Button>
          </div>
        </div>

        <Separator className="mt-4" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
          {employee.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
          {employee.contact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{employee.contact}</span>
            </div>
          )}
          {employee.hire_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Hired {formatDate(employee.hire_date)}</span>
            </div>
          )}
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
              <div className="p-3 bg-gray-50 rounded space-y-1">
                {payslip.earnings.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded">
                <span className="font-medium">Gross Earnings</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(payslip.gross_earnings)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Deductions
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded space-y-1">
                {payslip.deductions.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded">
                <span className="font-medium">Total Deductions</span>
                <span className="font-bold text-red-700">
                  {formatCurrency(payslip.total_deductions)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-800">Net Salary</span>
            <span className="text-xl font-bold text-blue-800">
              {formatCurrency(payslip.net_salary)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PayslipPage() {
  const {
    payslipData,
    isLoadingPayslip,
    isRefetchingPayslip,
    payslipError,
    refetchPayslip,
    allPayslipsData,
    isLoadingAllPayslips,
    isRefetchingAllPayslips,
    refetchAllPayslips,
  } = usePayslip();
  const { role } = useUserRole();
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("mine");

  const isFinance = role === "finance" || role === "accountant";

  const downloadPayslip = async (payslip: PayslipItem, index: number) => {
    setDownloadingIndex(index);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      let y = 20;

      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageW, 50, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("PAYSLIP", pageW / 2, 16, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(payslip.employee.full_name || `${payslip.employee.first_name} ${payslip.employee.last_name}`.trim(), pageW / 2, 27, { align: "center" });
      doc.setFontSize(9);
      doc.text(`${payslip.employee.position}  •  Payroll Run #${payslip.payroll_run}`, pageW / 2, 36, { align: "center" });
      doc.text(`Processed: ${new Date(payslip.processed_at).toLocaleDateString()}`, pageW / 2, 44, { align: "center" });
      y = 62;

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
        doc.text(
          `ETB ${parseFloat(item.amount).toLocaleString()}`,
          pageW - 14,
          y,
          { align: "right" }
        );
        y += 7;
      });

      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, y, pageW - 28, 10, 2, 2, "F");
      doc.setTextColor(22, 101, 52);
      doc.text("Gross Earnings", 18, y + 7);
      doc.text(
        `ETB ${parseFloat(payslip.gross_earnings).toLocaleString()}`,
        pageW - 14,
        y + 7,
        { align: "right" }
      );
      y += 20;

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
        doc.text(
          `ETB ${parseFloat(item.amount).toLocaleString()}`,
          pageW - 14,
          y,
          { align: "right" }
        );
        y += 7;
      });

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 241, 242);
      doc.roundedRect(14, y, pageW - 28, 10, 2, 2, "F");
      doc.setTextColor(185, 28, 28);
      doc.text("Total Deductions", 18, y + 7);
      doc.text(
        `ETB ${parseFloat(payslip.total_deductions).toLocaleString()}`,
        pageW - 14,
        y + 7,
        { align: "right" }
      );
      y += 20;

      doc.setFillColor(30, 64, 175);
      doc.roundedRect(14, y, pageW - 28, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Net Salary", 20, y + 11);
      doc.text(
        `ETB ${parseFloat(payslip.net_salary).toLocaleString()}`,
        pageW - 20,
        y + 11,
        { align: "right" }
      );

      const safeName = (payslip.employee.full_name || `employee-${payslip.employee.id}`).replace(/\s+/g, "-").toLowerCase();
      doc.save(`payslip-${safeName}-run${payslip.payroll_run}.pdf`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      refetchAllPayslips();
    } else {
      refetchPayslip();
    }
  };

  if (isLoadingPayslip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payslip data...</p>
      </div>
    );
  }

  const isRefreshing = activeTab === "mine" ? isRefetchingPayslip : isRefetchingAllPayslips;
  const handleRefresh = () =>
    activeTab === "mine" ? refetchPayslip() : refetchAllPayslips();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payslip</h1>
          <p className="text-muted-foreground">
            View payroll payslip information and earnings details
          </p>
        </div>

        {/* Error Display */}
        {payslipError && activeTab === "mine" && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                <p className="text-red-600 text-sm">
                  {(payslipError as Error).message}
                </p>
              </div>
            </div>
          </div>
        )}

        {isFinance ? (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="mine">My Payslip</TabsTrigger>
                <TabsTrigger value="all">All Payslips</TabsTrigger>
              </TabsList>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <TabsContent value="mine">
              {!payslipData ? (
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
                <PayslipCard
                  payslip={payslipData}
                  downloadingIndex={downloadingIndex}
                  index={0}
                  onDownload={downloadPayslip}
                />
              )}
            </TabsContent>

            <TabsContent value="all">
              {isLoadingAllPayslips ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-muted-foreground">Loading payslips...</p>
                </div>
              ) : !allPayslipsData || allPayslipsData.length === 0 ? (
                <Card className="shadow-none bg-transparent">
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Payslips</h3>
                    <p className="text-muted-foreground">
                      No payslips found.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allPayslipsData.map((payslip, i) => (
                    <PayslipCard
                      key={i}
                      payslip={payslip}
                      downloadingIndex={downloadingIndex}
                      index={i + 1}
                      onDownload={downloadPayslip}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Refresh Button */}
            <div className="mb-6">
              <Button
                onClick={() => refetchPayslip()}
                disabled={isRefetchingPayslip}
                variant="outline"
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefetchingPayslip ? "animate-spin" : ""}`}
                />
                {isRefetchingPayslip ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            {!payslipData ? (
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
              <PayslipCard
                payslip={payslipData}
                downloadingIndex={downloadingIndex}
                index={0}
                onDownload={downloadPayslip}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
