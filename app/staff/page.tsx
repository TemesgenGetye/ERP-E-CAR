"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Users, UserCheck, UserX, Eye, EyeOff } from "lucide-react";
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
import { signup } from "@/lib/auth/signup";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

export default function StaffPage() {
  const { staff, isLoading, error, createStaff, updateStaff, deleteStaff } =
    useDealerStaff();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<number | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<number | null>(null);
  const [formData, setFormData] = useState<
    CreateDealerStaffRequest & {
      first_name: string;
      last_name: string;
      description: string;
      password1: string;
      password2: string;
    }
  >({
    user_email: "",
    role: "seller",
    first_name: "",
    last_name: "",
    description: "",
    password1: "",
    password2: "",
  });
  const { toast } = useToast();
  const { role: userRole } = useUserRole();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.user_email,
        password1: formData.password1,
        password2: formData.password2,
        description: formData.description,
      });

      await createStaff({
        user_email: formData.user_email,
        role: formData.role,
      });

      setFormData((prev) => ({
        ...prev,
        user_email: "",
        role: "seller",
        first_name: "",
        last_name: "",
        description: "",
        password1: "",
        password2: "",
      }));
      setShowCreateDialog(false);
      toast({ title: "Staff member added successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Failed to add staff member", variant: "destructive" });
      console.error("Error creating staff:", error);
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      await updateStaff(editingStaff, formData);
      setEditingStaff(null);
      setFormData((prev) => ({
        ...prev,
        user_email: "",
        role: "seller",
      }));
      toast({ title: "Staff member updated successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Failed to update staff member", variant: "destructive" });
      console.error("Error updating staff:", error);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaffId) return;
    try {
      await deleteStaff(deletingStaffId);
      setDeletingStaffId(null);
      toast({ title: "Staff member removed successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Failed to remove staff member", variant: "destructive" });
      console.error("Error deleting staff:", error);
    }
  };

  const openEditDialog = (staffMember: any) => {
    setEditingStaff(staffMember.id);
    setFormData((prev) => ({
      ...prev,
      user_email: staffMember.user.email,
      role: staffMember.role,
    }));
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
            {userRole === "dealer" && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
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
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Sales staff, Accountant, etc."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password1">Password</Label>
                    <div className="relative">
                      <Input
                        id="password1"
                        type={showPassword ? "text" : "password"}
                        value={formData.password1}
                        onChange={(e) =>
                          setFormData({ ...formData, password1: e.target.value })
                        }
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password2">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="password2"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.password2}
                        onChange={(e) =>
                          setFormData({ ...formData, password2: e.target.value })
                        }
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(
                      value: "seller" | "accountant" | "hr" | "finance",
                    ) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="z-[50001]">
                      <SelectItem value="seller">Sales</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
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
                  staffMember.user.last_name,
                );
                return (
                  <div
                    key={staffMember.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(
                          initials,
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
                              staffMember.role,
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
                        onClick={() => setDeletingStaffId(staffMember.id)}
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
                  <SelectContent className="z-[50001]">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingStaffId !== null} onOpenChange={() => setDeletingStaffId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletingStaffId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff} className="text-white">
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
