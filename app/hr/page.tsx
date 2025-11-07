"use client";

import { Users, Calendar, FileText, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHR } from "@/hooks/useHR";
import { EmployeesComponent } from "@/components/hr/Employees";
import { AttendancesComponent } from "@/components/hr/Attendances";
import { ContractsComponent } from "@/components/hr/Contracts";
import { LeavesComponent } from "@/components/hr/Leaves";

export default function HRPage() {
  const {
    employees,
    attendances,
    contracts,
    leaves,
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
    createLeave,
    updateLeave,
    deleteLeave,
  } = useHR();

  if (isLoading) {
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

  const activeEmployees = employees.filter((emp) => emp.is_active).length;
  const presentAttendances = attendances.filter(
    (att) => att.status === "present"
  ).length;
  const activeContracts = contracts.filter(
    (cont) => cont.status === "active"
  ).length;
  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Human Resource Management
          </h1>
          <p className="text-muted-foreground">
            Manage employees, attendance, contracts, and leave requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                {activeEmployees} active
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
          <TabsList className="mb-6">
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Calendar className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="contracts">
              <Briefcase className="h-4 w-4 mr-2" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="leaves">
              <FileText className="h-4 w-4 mr-2" />
              Leave Requests
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="contracts">
            <ContractsComponent
              contracts={contracts}
              employees={employees}
              createContract={createContract}
              updateContract={updateContract}
              deleteContract={deleteContract}
            />
          </TabsContent>

          <TabsContent value="leaves">
            <LeavesComponent
              leaves={leaves}
              employees={employees}
              createLeave={createLeave}
              updateLeave={updateLeave}
              deleteLeave={deleteLeave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
