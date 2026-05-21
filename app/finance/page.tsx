"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePayrollRuns } from "@/hooks/payrollRuns";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface PayrollRun {
  id: number;
  period: string;
  status: "draft" | "running" | "completed" | "failed";
  created_at: string;
}

export default function FinancePage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(
    undefined,
  );
  const { toast } = useToast();
  const { role } = useUserRole();
  const {
    payrollRuns,
    isLoadingPayrollRuns,
    payrollRunsError,
    createPayroll,
    runPayrollById,
    approvePayrollById,
    isCreatingPayroll,
    isRunningPayroll,
    isApprovingPayroll,
  } = usePayrollRuns();

  const isHR = role === "hr";
  const isDealer = role === "dealer";
  const isFinance = role === "finance";

  const handleCreatePayroll = async () => {
    if (!selectedPeriod) return;
    try {
      const period = format(selectedPeriod, "yyyy-MM-dd");
      await createPayroll(period);
      setShowCreateDialog(false);
      setSelectedPeriod(undefined);
      toast({
        title: "Payroll Created",
        variant: "success",
        description: `Payroll created for ${period}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to create payroll",
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };

  const handleRunPayroll = async (id: number) => {
    try {
      await runPayrollById(id);
      toast({
        title: "Payroll Run Started",
        variant: "success",
        description: "Payroll run started successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to run payroll",
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };

  const handleApprovePayroll = async (id: number) => {
    try {
      await approvePayrollById(id);
      toast({
        title: "Payroll Approved",
        variant: "success",
        description: "Payroll run approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to approve payroll",
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Play className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoadingPayrollRuns) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payroll data...</p>
      </div>
    );
  }

  if (payrollRunsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading payroll data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payroll Management
          </h1>
          <p className="text-muted-foreground">
            View and manage payroll runs and financial operations
          </p>
        </div>

        {/* Payroll Runs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payroll Runs</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage payroll processing schedules
              </p>
            </div>

            {/* Only Finance can create payroll */}
            {isFinance && (
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payroll
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Payroll Run</DialogTitle>
                    <DialogDescription>
                      Create a new payroll run for the current period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Select the period date for this payroll run.
                    </p>
                    {selectedPeriod && (
                      <p className="text-sm font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {format(selectedPeriod, "PPP")}
                      </p>
                    )}
                    <Calendar
                      mode="single"
                      selected={selectedPeriod}
                      onSelect={setSelectedPeriod}
                      className="rounded-md border mx-auto"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setSelectedPeriod(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePayroll}
                      disabled={isCreatingPayroll || !selectedPeriod}
                    >
                      {isCreatingPayroll ? "Creating..." : "Create Payroll"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRuns?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No payroll runs found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isFinance
                          ? "Create your first payroll run to get started"
                          : "No payroll runs available yet"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollRuns?.map((payroll: PayrollRun) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">
                        {payroll.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {new Date(payroll.period).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payroll.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {isDealer && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprovePayroll(payroll.id)}
                            disabled={isApprovingPayroll}
                            className="cursor-pointer"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {isApprovingPayroll ? "Approving..." : "Approve"}
                          </Button>
                        )}
                        {isHR && (
                          <Button
                            size="sm"
                            onClick={() => handleRunPayroll(payroll.id)}
                            disabled={
                              payroll.status !== "draft" || isRunningPayroll
                            }
                            className="cursor-pointer"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {isRunningPayroll ? "Running..." : "Run Payroll"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
