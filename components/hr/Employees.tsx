"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Clock,
  CheckCircle,
  ChevronDown,
  Plus,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Employee, CreateEmployeeRequest } from "@/types";
import { useSalaryCpts } from "@/hooks/payroll";
import { assignSalaryComponent, createOvertime } from "@/lib/payroll";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

interface EmployeesProps {
  employees: Employee[];
  createEmployee: (employee: CreateEmployeeRequest) => Promise<void>;
  updateEmployee: (
    id: number,
    employee: Partial<CreateEmployeeRequest>,
  ) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

export function EmployeesComponent({
  employees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}: EmployeesProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [form, setForm] = useState<CreateEmployeeRequest>({
    user_email: "",
    hire_date: "",
    position: "",
    salary: "",
    is_active: true,
  });

  const [salaryForm, setSalaryForm] = useState({
    component: "",
    amount: "",
  });

  const [overtimeForm, setOvertimeForm] = useState({
    overtime_type: "1.5",
    hours: "",
    approved: true,
    date: "",
  });

  const { salaryCpts } = useSalaryCpts();

  const safeSalaryCpts = salaryCpts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, form);
      } else {
        await createEmployee(form);
      }
      setShowDialog(false);
      setEditingEmployee(null);
      setForm({
        user_email: "",
        hire_date: "",
        position: "",
        salary: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Error",
        description: "Failed to save employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setForm({
      user_email: employee.user_email_display,
      hire_date: employee.hire_date,
      position: employee.position,
      salary: employee.salary,
      is_active: employee.is_active,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignSalary = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSalaryForm({ component: "", amount: "" });
    setShowSalaryDialog(true);
  };

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !salaryForm.component || !salaryForm.amount)
      return;

    try {
      await assignSalaryComponent(
        selectedEmployee.id,
        parseInt(salaryForm.component),
        parseFloat(salaryForm.amount),
      );
      setShowSalaryDialog(false);
      setSelectedEmployee(null);
      setSalaryForm({ component: "", amount: "" });
      toast({
        title: "Success",
        description: "Salary component assigned successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error assigning salary component:", error);
      toast({
        title: "Error",
        description: "Failed to assign salary component. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOvertime = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOvertimeForm({
      overtime_type: "1.5",
      hours: "",
      approved: true,
      date: new Date().toISOString().split("T")[0], // Today's date
    });
    setShowOvertimeDialog(true);
  };

  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !overtimeForm.hours || !overtimeForm.date) return;

    try {
      await createOvertime(
        selectedEmployee.id,
        overtimeForm.overtime_type,
        parseFloat(overtimeForm.hours),
        overtimeForm.approved,
        overtimeForm.date,
      );
      setShowOvertimeDialog(false);
      setSelectedEmployee(null);
      setOvertimeForm({
        overtime_type: "1.5",
        hours: "",
        approved: true,
        date: "",
      });
      toast({
        title: "Success",
        description: "Overtime created successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating overtime:", error);
      toast({
        title: "Error",
        description: "Failed to create overtime. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employees</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee records and information
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEmployee(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? "Update employee information below."
                  : "Fill in the employee details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user_email">Email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={form.user_email}
                    onChange={(e) =>
                      setForm({ ...form, user_email: e.target.value })
                    }
                    required
                    disabled={!!editingEmployee}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={form.hire_date}
                    onChange={(e) =>
                      setForm({ ...form, hire_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={form.salary}
                    onChange={(e) =>
                      setForm({ ...form, salary: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active Employee</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEmployee ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Position</th>
                <th className="text-left p-2">Hire Date</th>
                <th className="text-left p-2">Salary</th>
                <th className="text-left p-2">Salary Components</th>
                <th className="text-left p-2">Overtime</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {employee.full_name || employee.user_email_display}
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {employee.user_email_display}
                    </td>
                    <td className="p-2">{employee.position}</td>
                    <td className="p-2 text-sm">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                    <td className="p-2">ETB {employee.salary}</td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignSalary(employee)}
                        className="cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateOvertime(employee)}
                        className="cursor-pointer"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Add Overtime
                      </Button>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={employee.is_active ? "default" : "secondary"}
                      >
                        {employee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Salary Assignment Dialog */}
      <Dialog open={showSalaryDialog} onOpenChange={setShowSalaryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Salary Component</DialogTitle>
            <DialogDescription>
              Assign a salary component to{" "}
              {selectedEmployee?.full_name ||
                selectedEmployee?.user_email_display}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSalarySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="component">Salary Component</Label>
                <Select
                  value={salaryForm.component}
                  onValueChange={(value) =>
                    setSalaryForm({ ...salaryForm, component: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a salary component" />
                  </SelectTrigger>
                  <SelectContent className="z-[50001]">
                    {safeSalaryCpts?.map((component: any) => (
                      <SelectItem key={component.id} value={String(component.id)}>
                        {component.name} ({component.component_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={salaryForm.amount}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, amount: e.target.value })
                  }
                  required
                  className="w-fit"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSalaryDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign Component</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Overtime Dialog */}
      <Dialog open={showOvertimeDialog} onOpenChange={setShowOvertimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Overtime</DialogTitle>
            <DialogDescription>
              Create overtime record for{" "}
              {selectedEmployee?.full_name ||
                selectedEmployee?.user_email_display}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOvertimeSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="overtime_type">Overtime Type</Label>
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
                    <SelectValue placeholder="Select overtime type" />
                  </SelectTrigger>
                  <SelectContent className="z-50001">
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="1.75">1.75x</SelectItem>
                    <SelectItem value="2.0">2.0x </SelectItem>
                    <SelectItem value="2.5">2.5x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="Enter overtime hours"
                  value={overtimeForm.hours}
                  onChange={(e) =>
                    setOvertimeForm({ ...overtimeForm, hours: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={overtimeForm.date}
                  onChange={(e) =>
                    setOvertimeForm({ ...overtimeForm, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="approved"
                  checked={overtimeForm.approved}
                  onCheckedChange={(checked) =>
                    setOvertimeForm({ ...overtimeForm, approved: checked })
                  }
                />
                <Label htmlFor="approved">Approved</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOvertimeDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Overtime</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
