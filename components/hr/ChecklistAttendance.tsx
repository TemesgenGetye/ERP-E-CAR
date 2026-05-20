"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealerStaff, Attendance, CreateAttendanceRequest } from "@/types";
import { dealerStaffEmail, dealerStaffFullName } from "@/lib/dealerStaffDisplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ChecklistAttendanceProps {
  employees: DealerStaff[];
  attendances: Attendance[];
  createAttendance: (attendance: CreateAttendanceRequest) => Promise<void>;
  updateAttendance: (
    id: number,
    attendance: Partial<CreateAttendanceRequest>
  ) => Promise<void>;
  deleteAttendance: (id: number) => Promise<void>;
}

interface AttendanceData {
  [employeeEmail: string]: {
    [date: string]: {
      id: number;
      checked: boolean;
    };
  };
}

export function ChecklistAttendanceComponent({
  employees,
  attendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
}: ChecklistAttendanceProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [pendingCell, setPendingCell] = useState<string | null>(null);
  const { toast } = useToast();

  // Get number of days in the selected mont
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // Generate array of days (1 to daysInMonth, but cap at 30)
  const days = useMemo(() => {
    const maxDays = Math.min(daysInMonth, 30);
    return Array.from({ length: maxDays }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Get month name
  const monthName = useMemo(() => {
    return new Date(selectedYear, selectedMonth).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth, selectedYear]);

  // Format date as YYYY-MM-DD
  const formatDate = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  // Get day of week for the first day of the month
  const getDayOfWeek = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  // Load attendance data for the selected month
  useEffect(() => {
    const data: AttendanceData = {};

    // Filter attendances for the selected month
    const monthAttendances = attendances.filter((att) => {
      const attDate = new Date(att.date);
      return (
        attDate.getMonth() === selectedMonth &&
        attDate.getFullYear() === selectedYear
      );
    });

    // Build attendance data structure
    monthAttendances.forEach((att) => {
      const email = att.employee_email_display;
      if (!data[email]) {
        data[email] = {};
      }
      // Only mark as checked if status is "present"
      data[email][att.date] = {
        id: att.id,
        checked: att.status === "present",
      };
    });

    setAttendanceData(data);
  }, [attendances, selectedMonth, selectedYear]);

  // Handle checkbox change
  const handleCheckboxChange = async (
    employeeEmail: string,
    day: number,
    checked: boolean
  ) => {
    const date = formatDate(day);
    const cellKey = `${employeeEmail}-${date}`;
    const existingAttendance = attendanceData[employeeEmail]?.[date];

    // Optimistically update the UI
    setAttendanceData((prev) => ({
      ...prev,
      [employeeEmail]: {
        ...prev[employeeEmail],
        [date]: {
          id: existingAttendance?.id || 0,
          checked: checked,
        },
      },
    }));

    setPendingCell(cellKey);
    try {
      if (checked) {
        // Create new attendance record
        const defaultEntryTime = `${date}T09:00`;
        const defaultExitTime = `${date}T17:00`;

        await createAttendance({
          employee_email: employeeEmail,
          entry_time: defaultEntryTime,
          exit_time: defaultExitTime,
          date: date,
          status: "present",
          notes: "Checklist attendance",
        });
        toast({
          title: "Attendance saved",
          description: `${employeeEmail} marked present for ${date}`,
        });
      } else {
        // Delete the attendance record if it exists
        if (existingAttendance && existingAttendance.id) {
          await deleteAttendance(existingAttendance.id);
        }
        toast({
          title: "Attendance removed",
          description: `${employeeEmail} marked absent for ${date}`,
        });
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Revert the checkbox state on error
      setAttendanceData((prev) => ({
        ...prev,
        [employeeEmail]: {
          ...prev[employeeEmail],
          [date]: {
            id: existingAttendance?.id || 0,
            checked: !checked,
          },
        },
      }));
      toast({
        title: "Update failed",
        description: "Could not update attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPendingCell(null);
    }
  };

  // Navigate months
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const activeEmployees = employees;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monthly Attendance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track daily attendance with checkboxes for each day of the month
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[200px] justify-center">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {new Date(selectedYear, i).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="sticky left-0 z-10 bg-muted/50 border-r p-3 text-left font-semibold min-w-[200px]">
                        Employee Name
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="p-2 text-center font-medium text-xs border-r last:border-r-0 min-w-[40px]"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold">{day}</span>
                            <span className="text-muted-foreground text-[10px]">
                              {getDayOfWeek(day)}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="sticky left-0 z-10 bg-background border-r p-3 font-medium">
                          {dealerStaffFullName(employee)}
                        </td>
                        {days.map((day) => {
                          const date = formatDate(day);
                          const employeeEmail = dealerStaffEmail(employee);
                          const isChecked =
                            attendanceData[employeeEmail]?.[date]?.checked ||
                            false;

                          return (
                            <td
                              key={day}
                              className="p-2 text-center border-r last:border-r-0"
                            >
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={isChecked}
                                  disabled={
                                    pendingCell === `${employeeEmail}-${date}`
                                  }
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      employeeEmail,
                                      day,
                                      checked as boolean
                                    )
                                  }
                                  aria-label={`${dealerStaffFullName(employee)} - Day ${day}`}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No staff found. Add staff on the Employees tab to track attendance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
