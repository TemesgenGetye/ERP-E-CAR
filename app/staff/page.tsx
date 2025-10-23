"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Users, UserCheck, UserX } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDealerStaff } from "@/hooks/useDealerStaff";
import { CreateDealerStaffRequest } from "@/types";
import { toast } from "sonner";

export default function StaffPage() {
  const { staff, isLoading, error, createStaff, updateStaff, deleteStaff } =
    useDealerStaff();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateDealerStaffRequest>({
    user_email: "",
    role: "seller",
  });

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff(formData);
      setFormData({ user_email: "", role: "seller" });
      setShowCreateDialog(false);
      toast.success("Staff member added successfully");
    } catch (error) {
      toast.error("Failed to add staff member");
      console.error("Error creating staff:", error);
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      await updateStaff(editingStaff, formData);
      setEditingStaff(null);
      setFormData({ user_email: "", role: "seller" });
      toast.success("Staff member updated successfully");
    } catch (error) {
      toast.error("Failed to update staff member");
      console.error("Error updating staff:", error);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) {
      return;
    }

    try {
      await deleteStaff(id);
      toast.success("Staff member removed successfully");
    } catch (error) {
      toast.error("Failed to remove staff member");
      console.error("Error deleting staff:", error);
    }
  };

  const openEditDialog = (staffMember: any) => {
    setEditingStaff(staffMember.id);
    setFormData({
      user_email: staffMember.user.email,
      role: staffMember.role,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "seller":
        return "bg-blue-100 text-blue-800";
      case "accountant":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "seller":
        return <UserCheck className="h-4 w-4" />;
      case "accountant":
        return <UserX className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (initials: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-yellow-100 text-yellow-700",
      "bg-indigo-100 text-indigo-700",
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading staff...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your dealership staff members
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new seller or accountant to your dealership.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateStaff}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user_email">Email Address</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) =>
                      setFormData({ ...formData, user_email: e.target.value })
                    }
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "seller" | "accountant") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Staff Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              Active staff members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter((s) => s.role === "seller").length}
            </div>
            <p className="text-xs text-muted-foreground">Sales team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accountants</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter((s) => s.role === "accountant").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Finance team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No staff members
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first staff member.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((staffMember) => {
                const initials = getInitials(
                  staffMember.user.first_name,
                  staffMember.user.last_name
                );
                return (
                  <div
                    key={staffMember.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(
                          initials
                        )}`}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {staffMember.user.first_name}{" "}
                          {staffMember.user.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {staffMember.user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleIcon(staffMember.role)}
                          <Badge
                            className={`${getRoleColor(
                              staffMember.role
                            )} text-xs`}
                          >
                            {staffMember.role.charAt(0).toUpperCase() +
                              staffMember.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Added{" "}
                        {new Date(staffMember.assigned_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(staffMember)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStaff(staffMember.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editingStaff !== null}
        onOpenChange={() => setEditingStaff(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the role of this staff member.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStaff}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_user_email">Email Address</Label>
                <Input
                  id="edit_user_email"
                  type="email"
                  value={formData.user_email}
                  onChange={(e) =>
                    setFormData({ ...formData, user_email: e.target.value })
                  }
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "seller" | "accountant") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingStaff(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Staff Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
