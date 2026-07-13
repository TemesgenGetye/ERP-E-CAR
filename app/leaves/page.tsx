"use client";

import { useState, useMemo } from "react";
import { Plus, Briefcase, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useHR } from "@/hooks/useHR";
import { useUserStore } from "@/store/user";
import { useUserRole } from "@/hooks/useUserRole";
import { LeavesComponent } from "@/components/hr/Leaves";
import { useToast } from "@/hooks/use-toast";

export default function EmployeeLeavesPage() {
  const {
    leaves,
    employees,
    createLeave,
    updateLeave,
    deleteLeave,
    error,
  } = useHR();
  const { user } = useUserStore();
  const { role: userRole } = useUserRole();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const myLeaves = useMemo(() => {
    return leaves.filter(
      (leave) => leave.employee_email_display === user.email,
    );
  }, [leaves, user.email]);

  const stats = useMemo(() => {
    const data = userRole === "hr" ? leaves : myLeaves;
    return {
      total: data.length,
      approved: data.filter((l) => l.status === "approved").length,
      pending: data.filter((l) => l.status === "pending").length,
    };
  }, [leaves, myLeaves, userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createLeave({
        employee_email: user.email,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason,
        status: "pending",
      });
      toast({ title: "Leave Requested", variant: "success", description: "Leave request submitted successfully." });
    } catch (error) {
      toast({ title: "Request Failed", variant: "destructive", description: "Failed to submit leave request." });
    } finally {
      setIsSubmitting(false);
      setShowDialog(false);
      setForm({ start_date: "", end_date: "", reason: "" });
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === "hr" ? "Leave Management" : "My Leave Requests"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "hr"
              ? "Manage all employee leave requests and approvals"
              : "Request and track your leave status"}
          </p>
        </div>
        {userRole !== "hr" && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Fill in the details below to request leave.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
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
                      placeholder="Enter reason for leave..."
                      value={form.reason}
                      onChange={(e) =>
                        setForm({ ...form, reason: e.target.value })
                      }
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {userRole === "hr" ? (
        <LeavesComponent
          employees={employees}
          createLeave={createLeave}
          updateLeave={updateLeave}
          deleteLeave={deleteLeave}
        />
      ) : (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>My Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Dates</th>
                    <th className="text-left p-2">Reason</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.length > 0 ? (
                    myLeaves.map((leave) => (
                      <tr key={leave.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm">
                          <div className="font-medium">
                            {new Date(leave.start_date).toLocaleDateString()} -{" "}
                            {new Date(leave.end_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-2 text-sm max-w-xs">{leave.reason}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">
                          {leave.status === "denied" &&
                            leave.rejection_reason && (
                              <div className="text-red-600 text-xs italic">
                                Rejected: {leave.rejection_reason}
                              </div>
                            )}
                          {leave.status === "approved" && (
                            <div className="text-green-600 text-xs italic">
                              Approved by: {leave.approved_by_email || "HR"}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-muted-foreground"
                      >
                        You haven't requested any leaves yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
