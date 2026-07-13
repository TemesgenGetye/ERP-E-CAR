"use client";

import {
  Users,
  Calendar,
  FileText,
  Briefcase,
  ClipboardCheck,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHR } from "@/hooks/useHR";
import { EmployeesComponent } from "@/components/hr/Employees";
import { AttendancesComponent } from "@/components/hr/Attendances";
import { ChecklistAttendanceComponent } from "@/components/hr/ChecklistAttendance";
import { ContractsComponent } from "@/components/hr/Contracts";
import { LeavesComponent } from "@/components/hr/Leaves";
import { SalaryComponent } from "@/components/hr/Salary";
import { useUserRole } from "@/hooks/useUserRole";
import { useLeaves } from "@/hooks/leaves";

export default function HRPage() {
  const {
    employees,
    attendances,
    contracts,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    createContract,
    updateContract,
    deleteContract,
    finalizeContract,
    sendContractToEmployee,
    uploadSignedContract,
    createLeave,
    updateLeave,
    deleteLeave,
  } = useHR();

  const { leaves } = useLeaves();

  const { isLoading: isUserRoleLoading } = useUserRole();


  // Only show loading screen on initial load (when no data exists yet)
  const isInitialLoad =
    isLoading &&
    employees.length === 0 &&
    attendances.length === 0 &&
    contracts.length === 0;

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading HR data...</p>
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

  const staffCount = employees.length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const presentAttendances = attendances.filter(
    (att) => att.status === "present" && att.date === todayStr,
  ).length;
  const activeContracts = contracts.filter(
    (cont) => cont.status === "active",
  ).length;
  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-3 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1">
            Human Resource Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage employees, attendance, contracts, and leave requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">
                {staffCount} staff member{staffCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Attendance Today
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentAttendances}</div>
              <p className="text-xs text-muted-foreground">Present today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Contracts
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                Employment agreements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Leaves
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <div className="overflow-x-auto mb-6">
            <TabsList className="border p-4 py-2 h-fit min-w-max">
              <TabsTrigger value="employees">
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Employees</span>
              </TabsTrigger>
              <TabsTrigger value="attendance">
                <Calendar className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="checklist-attendance">
                <ClipboardCheck className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Checklist</span>
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <Briefcase className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Contracts</span>
              </TabsTrigger>
              <TabsTrigger value="leaves">
                <FileText className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Leaves</span>
              </TabsTrigger>
              <TabsTrigger value="salary">
                <DollarSign className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Salary</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="employees">
            <EmployeesComponent
              employees={employees}
              createEmployee={createEmployee}
              updateEmployee={updateEmployee}
              deleteEmployee={deleteEmployee}
            />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendancesComponent
              attendances={attendances}
              employees={employees}
              createAttendance={createAttendance}
              updateAttendance={updateAttendance}
              deleteAttendance={deleteAttendance}
            />
          </TabsContent>

          <TabsContent value="checklist-attendance">
            <ChecklistAttendanceComponent
              employees={employees}
              attendances={attendances}
              createAttendance={createAttendance}
              updateAttendance={updateAttendance}
              deleteAttendance={deleteAttendance}
            />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsComponent
              contracts={contracts}
              employees={employees}
              createContract={createContract}
              updateContract={updateContract}
              deleteContract={deleteContract}
              finalizeContract={finalizeContract}
              sendContractToEmployee={sendContractToEmployee}
              uploadSignedContract={uploadSignedContract}
            />
          </TabsContent>

          <TabsContent value="leaves">
            <LeavesComponent
              employees={employees}
              createLeave={createLeave}
              updateLeave={updateLeave}
              deleteLeave={deleteLeave}
            />
          </TabsContent>

          <TabsContent value="salary">
            <SalaryComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
