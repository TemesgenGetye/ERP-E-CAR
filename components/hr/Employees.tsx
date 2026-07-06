"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { HREmployee, HROvertimeEntry, CreateHREmployeeRequest } from "@/types";
import { useSalaryCpts } from "@/hooks/payroll";
import { assignSalaryComponent } from "@/lib/payroll";
import { api, ApiError } from "@/lib/api";
import { useHRStore } from "@/store/hr";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface EmployeesProps {
  employees: HREmployee[];
  createEmployee: (employee: CreateHREmployeeRequest) => Promise<void>;
  updateEmployee: (
    id: number,
    employee: Partial<CreateHREmployeeRequest>,
  ) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

const emptyForm = (): CreateHREmployeeRequest => ({
  email: "",
  first_name: "",
  last_name: "",
  contact: "",
  position: "",
  hire_date: "",
  salary: null,
  is_active: true,
});

export function EmployeesComponent({
  employees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}: EmployeesProps) {
  const { toast } = useToast();
  const getEmployees = useHRStore((state) => state.getEmployees);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<HREmployee | null>(
    null,
  );
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<HREmployee | null>(
    null,
  );

  const [form, setForm] = useState<CreateHREmployeeRequest>(emptyForm());

  const [salaryForm, setSalaryForm] = useState({ component: "", amount: "" });

  const [overtimeForm, setOvertimeForm] = useState({
    overtime_type: "1.5",
    hours: "",
    approved: true,
    date: "",
  });
  const [isOvertimeSubmitting, setIsOvertimeSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { salaryCpts } = useSalaryCpts();
  const safeSalaryCpts = salaryCpts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          contact: form.contact,
          position: form.position,
          hire_date: form.hire_date,
          salary: form.salary,
          is_active: form.is_active,
        });
      } else {
        await createEmployee({
          email: form.email.trim(),
          first_name: form.first_name,
          last_name: form.last_name,
          contact: form.contact,
          position: form.position,
          hire_date: form.hire_date,
          salary: form.salary,
          is_active: form.is_active,
        });
      }
      const wasEditing = !!editingEmployee;
      setShowDialog(false);
      setEditingEmployee(null);
      setForm(emptyForm());
      setFieldErrors({});
      toast({
        title: "Success",
        description: wasEditing ? "Employee updated successfully." : "Employee created successfully.",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
        const flat: Record<string, string> = {};
        for (const [field, msgs] of Object.entries(error.fieldErrors)) {
          flat[field] = msgs[0];
          toast({ title: field.replace(/_/g, " "), description: msgs[0], variant: "destructive" });
        }
        setFieldErrors(flat);
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save employee.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (employee: HREmployee) => {
    setEditingEmployee(employee);
    const [firstName = "", ...rest] = employee.full_name.split(" ");
    setForm({
      email: employee.login_email,
      first_name: firstName,
      last_name: rest.join(" "),
      contact: "",
      position: employee.position,
      hire_date: employee.hire_date || "",
      salary: employee.salary,
      is_active: employee.is_active,
    });
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await deleteEmployee(deleteTargetId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleAssignSalary = (employee: HREmployee) => {
    setSelectedEmployee(employee);
    setSalaryForm({ component: "", amount: "" });
    setShowSalaryDialog(true);
  };

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !salaryForm.component || !salaryForm.amount)
      return;

    const alreadyAssigned = selectedEmployee.components.some(
      (c) => c.id === parseInt(salaryForm.component),
    );
    if (alreadyAssigned) {
      const componentName = safeSalaryCpts.find(
        (c: any) => String(c.id) === salaryForm.component,
      )?.name;
      toast({
        title: "Already Assigned",
        description: `${componentName ?? "This component"} is already assigned to ${selectedEmployee.full_name}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await assignSalaryComponent(
        selectedEmployee.id,
        parseInt(salaryForm.component),
        parseFloat(salaryForm.amount),
      );
      setShowSalaryDialog(false);
      setSelectedEmployee(null);
      setSalaryForm({ component: "", amount: "" });
      await getEmployees();
      toast({
        title: "Success",
        description: "Salary component assigned successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign salary component.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOvertime = (employee: HREmployee) => {
    setSelectedEmployee(employee);
    setOvertimeForm({
      overtime_type: "1.5",
      hours: "",
      approved: true,
      date: new Date().toISOString().split("T")[0],
    });
    setShowOvertimeDialog(true);
  };

  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !overtimeForm.hours || !overtimeForm.date) return;
    setIsOvertimeSubmitting(true);
    try {
      await api("/hr/overtime/", {
        method: "POST",
        body: {
          employee: selectedEmployee.id,
          overtime_type: overtimeForm.overtime_type,
          hours: overtimeForm.hours,
          approved: overtimeForm.approved,
          date: overtimeForm.date,
        },
        headers: { "Content-Type": "application/json" },
      } as any);
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
      toast({
        title: "Error",
        description: "Failed to create overtime.",
        variant: "destructive",
      });
    } finally {
      setIsOvertimeSubmitting(false);
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
        <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) setFieldErrors({}); }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEmployee(null);
                setForm(emptyForm());
              }}
            >
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
                  ? "Update this employee's details. Email cannot be changed."
                  : "Add a new employee by email, position, and hire date."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setFieldErrors((p) => ({ ...p, email: "" })); }}
                    required
                    disabled={!!editingEmployee}
                    className={fieldErrors.email ? "border-red-500" : ""}
                  />
                  {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      value={form.first_name}
                      onChange={(e) => { setForm({ ...form, first_name: e.target.value }); setFieldErrors((p) => ({ ...p, first_name: "" })); }}
                      required
                      className={fieldErrors.first_name ? "border-red-500" : ""}
                    />
                    {fieldErrors.first_name && <p className="text-xs text-red-500">{fieldErrors.first_name}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      value={form.last_name}
                      onChange={(e) => { setForm({ ...form, last_name: e.target.value }); setFieldErrors((p) => ({ ...p, last_name: "" })); }}
                      required
                      className={fieldErrors.last_name ? "border-red-500" : ""}
                    />
                    {fieldErrors.last_name && <p className="text-xs text-red-500">{fieldErrors.last_name}</p>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    placeholder="Phone number"
                    value={form.contact}
                    onChange={(e) => { setForm({ ...form, contact: e.target.value }); setFieldErrors((p) => ({ ...p, contact: "" })); }}
                    required
                    className={fieldErrors.contact ? "border-red-500" : ""}
                  />
                  {fieldErrors.contact && <p className="text-xs text-red-500">{fieldErrors.contact}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => { setForm({ ...form, position: e.target.value }); setFieldErrors((p) => ({ ...p, position: "" })); }}
                    required
                    className={fieldErrors.position ? "border-red-500" : ""}
                  />
                  {fieldErrors.position && <p className="text-xs text-red-500">{fieldErrors.position}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={form.hire_date}
                    onChange={(e) => { setForm({ ...form, hire_date: e.target.value }); setFieldErrors((p) => ({ ...p, hire_date: "" })); }}
                    required
                    className={fieldErrors.hire_date ? "border-red-500" : ""}
                  />
                  {fieldErrors.hire_date && <p className="text-xs text-red-500">{fieldErrors.hire_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary (optional)</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={form.salary ?? ""}
                    onChange={(e) => { setForm({ ...form, salary: e.target.value || null }); setFieldErrors((p) => ({ ...p, salary: "" })); }}
                    className={fieldErrors.salary ? "border-red-500" : ""}
                  />
                  {fieldErrors.salary && <p className="text-xs text-red-500">{fieldErrors.salary}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
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
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Name</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Email</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Position</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Hire Date</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Status</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Components</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Salary Cpt</th>
                <th className="text-left p-2 text-xs md:text-sm whitespace-nowrap">Overtime</th>
                <th className="text-right p-2 text-xs md:text-sm whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{employee.full_name}</td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {employee.email || employee.login_email}
                    </td>
                    <td className="p-2 text-sm">{employee.position}</td>
                    <td className="p-2 text-sm">
                      {employee.hire_date ? (
                        new Date(employee.hire_date).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={employee.is_active ? "default" : "secondary"}
                      >
                        {employee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">
                      {employee.components.length > 0 ? (
                        <div className="space-y-0.5">
                          {employee.components.map((c) => (
                            <div key={c.id} className="flex items-center gap-1">
                              <span>{c.component_name}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="font-medium text-green-700">
                                ETB {parseFloat(c.amount).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignSalary(employee)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    </td>
                    <td className="p-2 text-sm">
                      {(employee.overtime_entries ?? []).length > 0 ? (
                        <div className="space-y-1 mb-2">
                          {(employee.overtime_entries as HROvertimeEntry[]).map((entry) => (
                            <div key={entry.id} className="flex items-center gap-1 flex-wrap">
                              <span className="text-muted-foreground text-xs">{new Date(entry.date).toLocaleDateString()}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="font-medium">{entry.hours}h</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-xs">{entry.overtime_type}x</span>
                              <span className={`text-xs font-medium ${entry.approved ? "text-green-600" : "text-yellow-600"}`}>
                                {entry.approved ? "Approved" : "Pending"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground mb-2">—</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateOvertime(employee)}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </td>
                    <td className="p-2 text-right">
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
                            onClick={() => setDeleteTargetId(employee.id)}
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
              Assign a salary component to {selectedEmployee?.full_name ?? ""}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSalarySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Salary Component</Label>
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
                      <SelectItem
                        key={component.id}
                        value={String(component.id)}
                      >
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
              Create overtime record for {selectedEmployee?.full_name ?? ""}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOvertimeSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Overtime Type</Label>
                <Select
                  value={overtimeForm.overtime_type}
                  onValueChange={(value) =>
                    setOvertimeForm({ ...overtimeForm, overtime_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select overtime type" />
                  </SelectTrigger>
                  <SelectContent className="z-[50001]">
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="1.75">1.75x</SelectItem>
                    <SelectItem value="2.0">2.0x</SelectItem>
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
              <Button type="submit" disabled={isOvertimeSubmitting}>
                {isOvertimeSubmitting ? "Creating..." : "Create Overtime"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
