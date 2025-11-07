"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Clock } from "lucide-react";
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
import { Attendance, CreateAttendanceRequest } from "@/types";
import { Employee } from "@/types";

interface AttendancesProps {
  attendances: Attendance[];
  employees: Employee[];
  createAttendance: (attendance: CreateAttendanceRequest) => Promise<void>;
  updateAttendance: (
    id: number,
    attendance: Partial<CreateAttendanceRequest>
  ) => Promise<void>;
  deleteAttendance: (id: number) => Promise<void>;
}

export function AttendancesComponent({
  attendances,
  employees,
  createAttendance,
  updateAttendance,
  deleteAttendance,
}: AttendancesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(
    null
  );

  const [form, setForm] = useState<CreateAttendanceRequest>({
    employee_email: "",
    entry_time: "",
    exit_time: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    status: "present",
    notes: "",
  });

  // Helper to get current time in ISO format for datetime-local input
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Quick action: Mark present with current time
  const handleQuickPresent = async (employeeEmail: string) => {
    const now = getCurrentTime();
    const today = new Date().toISOString().split("T")[0];

    try {
      await createAttendance({
        employee_email: employeeEmail,
        entry_time: now,
        exit_time: now, // Will be updated later
        date: today,
        status: "present",
        notes: "Quick check-in",
      });
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Failed to record attendance. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAttendance) {
        await updateAttendance(editingAttendance.id, form);
      } else {
        await createAttendance(form);
      }
      setShowDialog(false);
      setEditingAttendance(null);
      setForm({
        employee_email: "",
        entry_time: "",
        exit_time: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
        notes: "",
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    }
  };

  const handleEdit = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    // Convert ISO string to datetime-local format
    const formatDateTimeLocal = (isoString: string) => {
      return isoString.slice(0, 16);
    };

    setForm({
      employee_email: attendance.employee_email_display,
      entry_time: formatDateTimeLocal(attendance.entry_time),
      exit_time: formatDateTimeLocal(attendance.exit_time),
      date: attendance.date,
      status: attendance.status,
      notes: attendance.notes,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await deleteAttendance(id);
      } catch (error) {
        console.error("Error deleting attendance:", error);
        alert("Failed to delete attendance. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "on_leave":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate hours worked
  const calculateHours = (entry: string, exit: string) => {
    const entryDate = new Date(entry);
    const exitDate = new Date(exit);
    const diffMs = exitDate.getTime() - entryDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(1);
  };

  // Group attendance by date
  const attendanceByDate = attendances.reduce((acc, att) => {
    if (!acc[att.date]) {
      acc[att.date] = [];
    }
    acc[att.date].push(att);
    return acc;
  }, {} as Record<string, Attendance[]>);

  // Sort dates descending (most recent first)
  const sortedDates = Object.keys(attendanceByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track employee attendance and hours by day
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAttendance(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAttendance ? "Edit Attendance" : "Record Attendance"}
              </DialogTitle>
              <DialogDescription>
                {editingAttendance
                  ? "Update attendance record below."
                  : "Record employee attendance below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee_email">Employee</Label>
                  <Select
                    value={form.employee_email}
                    onValueChange={(value) =>
                      setForm({ ...form, employee_email: value })
                    }
                    required
                    disabled={!!editingAttendance}
                  >
                    <SelectTrigger id="employee_email">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((emp) => emp.is_active)
                        .map((emp) => (
                          <SelectItem
                            key={emp.id}
                            value={emp.user_email_display}
                          >
                            {emp.full_name} - {emp.position}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="entry_time">Check In</Label>
                    <Input
                      id="entry_time"
                      type="datetime-local"
                      value={form.entry_time}
                      onChange={(e) =>
                        setForm({ ...form, entry_time: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="exit_time">Check Out</Label>
                    <Input
                      id="exit_time"
                      type="datetime-local"
                      value={form.exit_time}
                      onChange={(e) =>
                        setForm({ ...form, exit_time: e.target.value })
                      }
                      required
                    />
                  </div>
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
                      <SelectItem value="present">✓ Present</SelectItem>
                      <SelectItem value="absent">✗ Absent</SelectItem>
                      <SelectItem value="late">⚠ Late</SelectItem>
                      <SelectItem value="on_leave">⏰ On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={2}
                    placeholder="Add any additional notes..."
                  />
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
                  {editingAttendance ? "Update" : "Record"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {attendances.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map((date) => {
              const dayAttendances = attendanceByDate[date];
              const presentCount = dayAttendances.filter(
                (att) => att.status === "present"
              ).length;
              const absentCount = dayAttendances.filter(
                (att) => att.status === "absent"
              ).length;
              const lateCount = dayAttendances.filter(
                (att) => att.status === "late"
              ).length;

              return (
                <div key={date} className="space-y-2">
                  {/* Date Header */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {presentCount}
                          </Badge>
                          <span>Present</span>
                        </span>
                        {lateCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {lateCount}
                            </Badge>
                            <span>Late</span>
                          </span>
                        )}
                        {absentCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              {absentCount}
                            </Badge>
                            <span>Absent</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {dayAttendances.length} Total
                    </Badge>
                  </div>

                  {/* Attendance List for this Day */}
                  <div className="space-y-2">
                    {dayAttendances.map((attendance) => (
                      <div
                        key={attendance.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {attendance.employee_full_name}
                            </h4>
                            <Badge
                              className={getStatusColor(attendance.status)}
                            >
                              {attendance.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(
                                  attendance.entry_time
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <span className="text-muted-foreground">→</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {new Date(
                                  attendance.exit_time
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-medium text-green-700">
                              {calculateHours(
                                attendance.entry_time,
                                attendance.exit_time
                              )}{" "}
                              hrs
                            </span>
                          </div>
                          {attendance.notes && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                              {attendance.notes}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(attendance)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(attendance.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No attendance records
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by recording your first attendance.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Attendance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
