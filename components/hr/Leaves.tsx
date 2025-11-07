"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
import { Leave, CreateLeaveRequest } from "@/types";
import { Employee } from "@/types";

interface LeavesProps {
  leaves: Leave[];
  employees: Employee[];
  createLeave: (leave: CreateLeaveRequest) => Promise<void>;
  updateLeave: (id: number, leave: Partial<CreateLeaveRequest>) => Promise<void>;
  deleteLeave: (id: number) => Promise<void>;
}

export function LeavesComponent({
  leaves,
  employees,
  createLeave,
  updateLeave,
  deleteLeave,
}: LeavesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);

  const [form, setForm] = useState<CreateLeaveRequest>({
    employee_email: "",
    start_date: "",
    end_date: "",
    reason: "",
    status: "pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLeave) {
        await updateLeave(editingLeave.id, form);
      } else {
        await createLeave(form);
      }
      setShowDialog(false);
      setEditingLeave(null);
      setForm({
        employee_email: "",
        start_date: "",
        end_date: "",
        reason: "",
        status: "pending",
      });
    } catch (error) {
      console.error("Error saving leave:", error);
      alert("Failed to save leave request. Please try again.");
    }
  };

  const handleEdit = (leave: Leave) => {
    setEditingLeave(leave);
    setForm({
      employee_email: leave.employee_email_display,
      start_date: leave.start_date,
      end_date: leave.end_date,
      reason: leave.reason,
      status: leave.status,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this leave request?")) {
      try {
        await deleteLeave(id);
      } catch (error) {
        console.error("Error deleting leave:", error);
        alert("Failed to delete leave request. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Leave Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee leave requests and approvals
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLeave(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLeave ? "Edit Leave Request" : "Request Leave"}
              </DialogTitle>
              <DialogDescription>
                {editingLeave
                  ? "Update leave request details below."
                  : "Fill in the leave request details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee_email">Employee Email</Label>
                  <Select
                    value={form.employee_email}
                    onValueChange={(value) =>
                      setForm({ ...form, employee_email: value })
                    }
                    required
                    disabled={!!editingLeave}
                  >
                    <SelectTrigger id="employee_email">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.user_email_display}>
                          {emp.full_name} - {emp.user_email_display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value as any })
                    }
                    required
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {editingLeave ? "Update" : "Submit"}
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
                <th className="text-left p-2">Employee</th>
                <th className="text-left p-2">Start Date</th>
                <th className="text-left p-2">End Date</th>
                <th className="text-left p-2">Reason</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Approved By</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{leave.employee_full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {leave.employee_email_display}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(leave.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-sm max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {leave.approved_by_email || "N/A"}
                    </td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(leave)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(leave.id)}
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
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No leave requests found. Submit a leave request to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

