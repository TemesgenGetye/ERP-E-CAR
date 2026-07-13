"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Trash2,
  FileUp,
  Filter,
  Settings2,
  ArrowRight,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import type { DealerStaff } from "@/types";
import { dealerStaffFullName } from "@/lib/dealerStaffDisplay";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSalaryCpts } from "@/hooks/payroll";
import type { EmployeeSalaryAssignment } from "@/lib/payroll";
import { useUserRole } from "@/hooks/useUserRole";
import { usePayrollRuns } from "@/hooks/payrollRuns";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import {
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface SalaryComponent {
  id: number;
  name: string;
  component_type: "earning" | "deduction";
}

// Overtime Type
interface Overtime {
  id: number;
  overtime_type: string;
  hours: string;
  approved: boolean;
  date: string;
  created_at: string;
  employee: number;
}

function AccountantPayrollView() {
  const {
    payrollRuns,
    isLoadingPayrollRuns,
    payrollRunsError,
  } = usePayrollRuns();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />Draft
          </Badge>
        );
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Play className="h-3 w-3 mr-1" />Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />Failed
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payroll Management</h1>
          <p className="text-muted-foreground">View payroll runs and financial operations</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Runs</CardTitle>
            <p className="text-sm text-muted-foreground">View payroll processing schedules</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!payrollRuns?.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No payroll runs available yet
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollRuns.map((payroll: any) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(payroll.period).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payroll.created_at).toLocaleString()}
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

export default function PayrollPage() {
  const { role, isLoading } = useUserRole();
  if (isLoading || !role) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-muted-foreground" size={28} />
    </div>
  );
  if (role === "accountant") return <AccountantPayrollView />;
  return <HRPayrollContent />;
}

function HRPayrollContent() {
  const { toast } = useToast();
  const hideCreates = false;
  const queryClient = useQueryClient();
  const { salaryCpts } = useSalaryCpts();

  const salaryComponents = (salaryCpts ?? []) as SalaryComponent[];

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [employeeSalaries, setEmployeeSalaries] = useState<
    EmployeeSalaryAssignment[]
  >([]);
  const [isLoadingPayrollGrid, setIsLoadingPayrollGrid] = useState(true);
  // Overtime State
  const [overtimeEntries, setOvertimeEntries] = useState<Overtime[]>([]);
  const [employees, setEmployees] = useState<DealerStaff[]>([]);
  const [isLoadingOvertime, setIsLoadingOvertime] = useState(false);
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [editingOvertime, setEditingOvertime] = useState<Overtime | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [overtimeForm, setOvertimeForm] = useState({
    overtime_type: "1.5",
    hours: "",
    approved: false,
    date: new Date().toISOString().split("T")[0],
    employee: "",
  });

  const handleSelectEmployee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    }
  };

  const componentById = useMemo(() => {
    const m = new Map<number, SalaryComponent>();
    for (const c of salaryComponents) {
      m.set(c.id, c);
    }
    return m;
  }, [salaryComponents]);

  const staffSalaryMetrics = useMemo(() => {
    const map = new Map<
      number,
      {
        basicSalary: number;
        extraEarnings: number;
        grossEarnings: number;
        overtimeHours: number;
        totalDeduction: number;
      }
    >();

    for (const staff of employees) {
      const lines = employeeSalaries.filter((l) => l.employee === staff.id);
      const earningLines: { amount: number; name: string }[] = [];
      let deduction = 0;

      for (const line of lines) {
        const c = componentById.get(line.component);
        const amt = parseFloat(String(line.amount));
        if (Number.isNaN(amt) || !c) continue;
        if (c.component_type === "deduction") {
          deduction += amt;
        } else {
          earningLines.push({ amount: amt, name: c.name || "" });
        }
      }

      let basic = 0;
      let extra = 0;
      if (earningLines.length === 1) {
        basic = earningLines[0].amount;
      } else if (earningLines.length > 1) {
        for (const el of earningLines) {
          if (/\b(basic|base)\b/i.test(el.name)) {
            basic += el.amount;
          } else {
            extra += el.amount;
          }
        }
        if (basic === 0) {
          basic = extra;
          extra = 0;
        }
      }

      const gross = basic + extra;
      const otHours = overtimeEntries
        .filter((o) => o.employee === staff.id && o.approved)
        .reduce((s, o) => s + (parseFloat(String(o.hours)) || 0), 0);

      map.set(staff.id, {
        basicSalary: basic,
        extraEarnings: extra,
        grossEarnings: gross,
        overtimeHours: otHours,
        totalDeduction: deduction,
      });
    }
    return map;
  }, [employees, employeeSalaries, componentById, overtimeEntries]);

  const filteredStaff = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((s) => {
      const name = dealerStaffFullName(s).toLowerCase();
      const email = s.user.email.toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        String(s.id).includes(q) ||
        String(s.user.id).includes(q)
      );
    });
  }, [employees, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalEmployees = filteredStaff.length;

  const totalAmount = useMemo(() => {
    return filteredStaff.reduce((sum, s) => {
      const m = staffSalaryMetrics.get(s.id);
      return sum + (m?.grossEarnings ?? 0);
    }, 0);
  }, [filteredStaff, staffSalaryMetrics]);

  const totalPages = Math.max(1, Math.ceil(totalEmployees / itemsPerPage));

  const pagedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(start, start + itemsPerPage);
  }, [filteredStaff, currentPage, itemsPerPage]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedEmployees(filteredStaff.map((s) => s.id));
      } else {
        setSelectedEmployees([]);
      }
    },
    [filteredStaff],
  );

  const isAllSelected =
    filteredStaff.length > 0 &&
    filteredStaff.every((s) => selectedEmployees.includes(s.id));

  const isIndeterminate =
    selectedEmployees.some((id) =>
      filteredStaff.some((s) => s.id === id),
    ) && !isAllSelected;

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const data = await api<DealerStaff[]>("/dealers/staff/", {
        method: "GET",
      });
      setEmployees(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employees",
        variant: "destructive",
      });
    }
  };

  const fetchEmployeeSalaries = async () => {
    try {
      const data = await api<
        EmployeeSalaryAssignment[] | { results: EmployeeSalaryAssignment[] }
      >("/hr/employee-salaries/", { method: "GET" });
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setEmployeeSalaries(list);
    } catch (error: any) {
      setEmployeeSalaries([]);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to fetch employee salary assignments",
        variant: "destructive",
      });
    }
  };

  // Fetch Overtime Entries
  const fetchOvertime = async () => {
    setIsLoadingOvertime(true);
    try {
      const data = await api<Overtime[]>("/hr/overtime/", {
        method: "GET",
      });
      setOvertimeEntries(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch overtime entries",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOvertime(false);
    }
  };

  // Create or Update Overtime Entry
  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hideCreates && !editingOvertime) {
      toast({
        title: "Not allowed",
        description: "Accountants cannot create overtime entries.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        overtime_type: overtimeForm.overtime_type,
        hours: overtimeForm.hours,
        approved: overtimeForm.approved,
        date: overtimeForm.date,
        employee: parseInt(overtimeForm.employee),
      };

      if (editingOvertime) {
        await api<Overtime>(`/hr/overtime/${editingOvertime.id}/`, {
          method: "PATCH",
          body: payload,
        } as any);
        toast({
          title: "Success",
          description: "Overtime entry updated successfully",
          variant: "success",
        });
      } else {
        await api<Overtime>("/hr/overtime/", {
          method: "POST",
          body: payload,
        } as any);
        toast({
          title: "Success",
          description: "Overtime entry created successfully",
          variant: "success",
        });
      }
      setShowOvertimeDialog(false);
      setEditingOvertime(null);
      setOvertimeForm({
        overtime_type: "1.5",
        hours: "",
        approved: false,
        date: new Date().toISOString().split("T")[0],
        employee: "",
      });
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save overtime entry",
        variant: "destructive",
      });
    }
  };

  // Delete Overtime Entry
  const handleDeleteOvertime = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api(`/hr/overtime/${deleteTargetId}/`, { method: "DELETE" });
      toast({
        title: "Success",
        description: "Overtime entry deleted successfully",
        variant: "success",
      });
      setDeleteTargetId(null);
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete overtime entry",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Edit Overtime
  const handleEditOvertime = (overtime: Overtime) => {
    setEditingOvertime(overtime);
    setOvertimeForm({
      overtime_type: overtime.overtime_type,
      hours: overtime.hours,
      approved: overtime.approved,
      date: overtime.date,
      employee: overtime.employee.toString(),
    });
    setShowOvertimeDialog(true);
  };

  // Toggle Approval
  const handleToggleApproval = async (overtime: Overtime) => {
    try {
      await api<Overtime>(`/hr/overtime/${overtime.id}/`, {
        method: "PATCH",
        body: { approved: !overtime.approved },
      } as any);
      toast({
        title: "Success",
        description: `Overtime entry ${!overtime.approved ? "approved" : "unapproved"} successfully`,
        variant: "success",
      });
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update approval status",
        variant: "destructive",
      });
    }
  };

  const handleSubmitPayroll = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Select at least one employee before submitting payroll.",
        variant: "destructive",
      });
      return;
    }

    const unassigned = selectedEmployees.filter((id) => {
      const m = staffSalaryMetrics.get(id);
      return !m || m.grossEarnings === 0;
    });

    if (unassigned.length > 0) {
      const names = unassigned.map((id) => {
        const s = employees.find((e) => e.id === id);
        return s ? dealerStaffFullName(s) : `Employee #${id}`;
      });
      const preview = names.slice(0, 3).join(", ");
      const extra = names.length > 3 ? ` and ${names.length - 3} more` : "";
      toast({
        title: "Missing salary assignments",
        description: `${preview}${extra} have no salary assigned. Assign salaries before submitting.`,
        variant: "destructive",
      });
      return;
    }

    // TODO: submit payroll API call
  };

  // Load staff, assignments, and overtime on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingPayrollGrid(true);
      try {
        await Promise.all([
          fetchEmployees(),
          fetchEmployeeSalaries(),
          fetchOvertime(),
        ]);
      } finally {
        if (!cancelled) setIsLoadingPayrollGrid(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Payroll Management
                </h1>
                <p className="text-muted-foreground">
                  Manage employee salaries, components, and overtime calculations
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Current Period</div>
              <div className="text-lg font-semibold text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees-salary" className="w-full">
          <TabsList className="mb-6 pt-4 px-4 h-fit flex justify-between items-center">
            <TabsTrigger
              value="employees-salary"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary cursor-pointer"
            >
              Employees Salary
            </TabsTrigger>
            <TabsTrigger
              value="overtime"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary cursor-pointer"
            >
              Overtime
            </TabsTrigger>
          </TabsList>

          {/* Employees Salary Tab */}
          <TabsContent value="employees-salary">
            {isLoadingPayrollGrid ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : null}
            {!isLoadingPayrollGrid && (
            <>
            {/* Top Control Bar */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employee by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Main Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      {/* Employee Details Header */}
                      <TableHead className="bg-background min-w-[200px]">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="mr-4"
                        />
                        Employee Details
                      </TableHead>
                      <TableHead className="bg-background min-w-[120px]">
                        ID
                      </TableHead>
                      <TableHead className="bg-background min-w-[200px]">
                        Name
                      </TableHead>

                      {/* Earnings Header */}
                      <TableHead
                        className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]"
                        colSpan={3}
                      >
                        <div className="flex items-center justify-between">
                          Earnings
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Basic salary
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Overtime
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Total salary
                      </TableHead>

                      {/* Additions Header */}
                      <TableHead className="bg-green-50 dark:bg-green-950/20 min-w-[150px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            Additions +
                            <Plus className="h-4 w-4" />
                          </div>
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-green-50 dark:bg-green-950/20 min-w-[150px]">
                        Total additions
                      </TableHead>

                      {/* Deductions Header */}
                      <TableHead className="bg-red-50 dark:bg-red-950/20 min-w-[150px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            Deductions +
                            <Plus className="h-4 w-4" />
                          </div>
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-red-50 dark:bg-red-950/20 min-w-[150px]">
                        Total deduction
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedStaff.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-muted-foreground py-12"
                        >
                          {employees.length === 0
                            ? "No dealer staff found. Add staff under Staff / HR first."
                            : "No staff match your search."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedStaff.map((staff) => {
                        const m = staffSalaryMetrics.get(staff.id);
                        const basic = m?.basicSalary ?? 0;
                        const extra = m?.extraEarnings ?? 0;
                        const gross = m?.grossEarnings ?? 0;
                        const otHrs = m?.overtimeHours ?? 0;
                        const ded = m?.totalDeduction ?? 0;
                        return (
                          <TableRow key={staff.id} className="border-b">
                            <TableCell className="bg-background">
                              <Checkbox
                                checked={selectedEmployees.includes(staff.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectEmployee(
                                    staff.id,
                                    checked as boolean,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="bg-background font-medium">
                              {staff.id}
                            </TableCell>
                            <TableCell className="bg-background">
                              <div className="flex flex-col">
                                <span>{dealerStaffFullName(staff)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {staff.user.email}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="bg-blue-50 dark:bg-blue-950/20"></TableCell>

                            <TableCell className="bg-blue-50 dark:bg-blue-950/20">
                              {basic.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="bg-blue-50 dark:bg-blue-950/20">
                              {otHrs > 0
                                ? `${otHrs.toFixed(1)} hrs`
                                : "—"}
                            </TableCell>
                            <TableCell className="bg-blue-50 dark:bg-blue-950/20 font-medium">
                              {gross.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>

                            <TableCell className="bg-green-50 dark:bg-green-950/20"></TableCell>

                            <TableCell className="bg-green-50 dark:bg-green-950/20 font-medium">
                              {extra.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>

                            <TableCell className="bg-red-50 dark:bg-red-950/20"></TableCell>

                            <TableCell className="bg-red-50 dark:bg-red-950/20">
                              <span className="font-medium">
                                {ded.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="border-t bg-muted/30 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                {/* Left side - Summary and Pagination */}
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      Total employees {totalEmployees}
                    </span>
                    {" • "}
                    <span className="font-medium">
                      Total gross (assigned earnings) ETB{" "}
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {1 + (currentPage - 1) * itemsPerPage}-
                      {Math.min(currentPage * itemsPerPage, totalEmployees)} of{" "}
                      {totalEmployees} results
                    </span>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          if (i === 0) {
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === 1 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                className="min-w-[40px]"
                              >
                                01
                              </Button>
                            );
                          } else if (i === 6 && totalPages > 7) {
                            return (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled
                                className="min-w-[40px]"
                              >
                                ...
                              </Button>
                            );
                          } else if (i === 6) {
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === totalPages
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                className="min-w-[40px]"
                              >
                                {String(totalPages).padStart(2, "0")}
                              </Button>
                            );
                          } else {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="min-w-[40px]"
                              >
                                {String(pageNum).padStart(2, "0")}
                              </Button>
                            );
                          }
                        },
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right side - Total and Submit */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ETB{" "}
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  {true && (
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      onClick={handleSubmitPayroll}
                    >
                      Submit payroll
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            </>
            )}
          </TabsContent>

          {/* Overtime Tab */}
          <TabsContent value="overtime">
            <Card className="border border-border rounded-lg bg-transparent overflow-hidden shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Overtime Entries</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage overtime entries for employees. Finance users may audit and approve.
                  </p>
                </div>
                <Dialog open={showOvertimeDialog} onOpenChange={setShowOvertimeDialog}>
                  {!hideCreates && (
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingOvertime(null);
                          setOvertimeForm({
                            overtime_type: "1.5",
                            hours: "",
                            approved: false,
                            date: new Date().toISOString().split("T")[0],
                            employee: "",
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Overtime Entry
                      </Button>
                    </DialogTrigger>
                  )}
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingOvertime
                          ? "Edit Overtime Entry"
                          : "Add New Overtime Entry"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingOvertime
                          ? "Update the overtime entry details below."
                          : "Create a new overtime entry for an employee."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOvertimeSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="employee">Employee</Label>
                          <Select
                            value={overtimeForm.employee}
                            onValueChange={(value) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                employee: value,
                              })
                            }
                            required
                          >
                            <SelectTrigger id="employee">
                              <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem
                                  key={employee.id}
                                  value={employee.id.toString()}
                                >
                                  {dealerStaffFullName(employee)} ({employee.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={overtimeForm.date}
                              onChange={(e) =>
                                setOvertimeForm({
                                  ...overtimeForm,
                                  date: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                              id="hours"
                              type="number"
                              step="0.5"
                              min="0"
                              value={overtimeForm.hours}
                              onChange={(e) =>
                                setOvertimeForm({
                                  ...overtimeForm,
                                  hours: e.target.value,
                                })
                              }
                              placeholder="e.g., 8.5"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="overtime_type">Overtime Type (Multiplier)</Label>
                          <Select
                            value={overtimeForm.overtime_type}
                            onValueChange={(value) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                overtime_type: value,
                              })
                            }
                          >
                            <SelectTrigger id="overtime_type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.5">1.5x (Time and a Half)</SelectItem>
                              <SelectItem value="2.0">2.0x (Double Time)</SelectItem>
                              <SelectItem value="2.5">2.5x</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="approved">Approved</Label>
                            <p className="text-xs text-muted-foreground">
                              Mark this overtime entry as approved
                            </p>
                          </div>
                          <Switch
                            id="approved"
                            checked={overtimeForm.approved}
                            onCheckedChange={(checked) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                approved: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowOvertimeDialog(false);
                            setEditingOvertime(null);
                            setOvertimeForm({
                              overtime_type: "1.5",
                              hours: "",
                              approved: false,
                              date: new Date().toISOString().split("T")[0],
                              employee: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingOvertime ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingOvertime ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : overtimeEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No overtime entries found
                    </p>
                    {!hideCreates && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingOvertime(null);
                          setOvertimeForm({
                            overtime_type: "1.5",
                            hours: "",
                            approved: false,
                            date: new Date().toISOString().split("T")[0],
                            employee: "",
                          });
                          setShowOvertimeDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Entry
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          {true && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overtimeEntries.map((entry) => {
                          const employee = employees.find(
                            (emp) => emp.id === entry.employee
                          );
                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {employee
                                  ? dealerStaffFullName(employee)
                                  : `Employee #${entry.employee}`}
                              </TableCell>
                              <TableCell>
                                {new Date(entry.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{entry.hours} hrs</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                                  {entry.overtime_type}x
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {true ? (
                                    <Switch
                                      checked={entry.approved}
                                      onCheckedChange={() =>
                                        handleToggleApproval(entry)
                                      }
                                    />
                                  ) : null}
                                  <span
                                    className={`text-xs ${
                                      entry.approved
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {entry.approved ? "Approved" : "Pending"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString()}
                              </TableCell>
                              {true && (
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditOvertime(entry)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDeleteTargetId(entry.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        onConfirm={handleDeleteOvertime}
        isLoading={isDeleting}
      />
    </div>
  );
}
