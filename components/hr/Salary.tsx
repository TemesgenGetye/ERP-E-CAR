"use client";

import { useState } from "react";
import { Plus, DollarSign, Edit, Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalaryCpts } from "@/hooks/payroll";
import { createSalaryComponent } from "@/lib/payroll";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface SalaryComponent {
  id: number;
  name: string;
  component_type: string;
}

export function SalaryComponent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: "",
    component_type: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const [editingComponent, setEditingComponent] =
    useState<SalaryComponent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { salaryCpts, isLoadingSalaryComponents, salaryCptErr } =
    useSalaryCpts();

  const safeSalaryCpts = salaryCpts || [];

  const handleCreateComponent = async () => {
    if (!newComponent.name.trim()) return;

    setIsCreating(true);
    try {
      await createSalaryComponent(
        newComponent.name,
        newComponent.component_type,
      );
      setNewComponent({ name: "", component_type: "" });
      setIsCreateModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["salary-components"] });
      toast({
        title: "Salary Component Created",
        variant: "success",
        description: `${newComponent.name} has been successfully created.`,
      });
    } catch (error) {
      console.error("Failed to create salary component:", error);
      toast({
        title: "Failed to Create Salary Component",
        variant: "destructive",
        description: "Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenEdit = (component: SalaryComponent) => {
    setEditingComponent({ ...component });
    setIsEditModalOpen(true);
  };

  const handleUpdateComponent = async () => {
    if (!editingComponent || !editingComponent.name.trim()) return;

    setIsUpdating(true);
    try {
      await api(`/hr/salary-components/${editingComponent.id}/`, {
        method: "PATCH",
        body: { name: editingComponent.name, component_type: editingComponent.component_type } as any,
      });
      setIsEditModalOpen(false);
      setEditingComponent(null);
      await queryClient.invalidateQueries({ queryKey: ["salary-components"] });
      toast({
        title: "Salary Component Updated",
        variant: "success",
        description: `${editingComponent.name} has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update salary component:", error);
      toast({
        title: "Failed to Update Salary Component",
        variant: "destructive",
        description: "Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComponent = async () => {
    if (deleteTargetId === null) return;

    setIsDeleting(true);
    try {
      await api(`/hr/salary-components/${deleteTargetId}/`, {
        method: "DELETE",
      });
      setDeleteTargetId(null);
      await queryClient.invalidateQueries({ queryKey: ["salary-components"] });
      toast({
        title: "Salary Component Deleted",
        variant: "success",
        description: "The salary component has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete salary component:", error);
      toast({
        title: "Failed to Delete Salary Component",
        variant: "destructive",
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getComponentTypeBadge = (type: string) => {
    return (
      <Badge
        variant={type === "earning" ? "default" : "secondary"}
        className={
          type === "earning"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <CardTitle>Salary Components</CardTitle>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Component
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Salary Component</DialogTitle>
                <DialogDescription>
                  Add a new salary component for payroll calculations.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateComponent();
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter component name"
                      value={newComponent.name}
                      onChange={(e) =>
                        setNewComponent({
                          ...newComponent,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="component_type">Type</Label>
                    <Select
                      value={newComponent.component_type}
                      onValueChange={(value) =>
                        setNewComponent({
                          ...newComponent,
                          component_type: value,
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select component type" />
                      </SelectTrigger>
                      <SelectContent className="z-[50001]">
                        <SelectItem value="earning">Earning</SelectItem>
                        <SelectItem value="deduction">Deduction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaryCptErr ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="mt-2 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h3 className="text-red-800 font-medium">
                          Error Loading Data
                        </h3>
                        <p className="text-red-600 text-sm">
                          Failed to fetch salary components. Please check your
                          connection and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : safeSalaryCpts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No salary components found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first salary component to get started
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              safeSalaryCpts?.map((component: SalaryComponent) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">
                    {component.name}
                  </TableCell>
                  <TableCell>
                    {getComponentTypeBadge(component.component_type)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleOpenEdit(component)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTargetId(component.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salary Component</DialogTitle>
            <DialogDescription>
              Update the name or type of this salary component.
            </DialogDescription>
          </DialogHeader>
          {editingComponent && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateComponent();
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter component name"
                    value={editingComponent.name}
                    onChange={(e) =>
                      setEditingComponent({
                        ...editingComponent,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-component_type">Type</Label>
                  <Select
                    value={editingComponent.component_type}
                    onValueChange={(value) =>
                      setEditingComponent({
                        ...editingComponent,
                        component_type: value,
                      })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent className="z-[50001]">
                      <SelectItem value="earning">Earning</SelectItem>
                      <SelectItem value="deduction">Deduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingComponent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteComponent}
        isLoading={isDeleting}
        title="Delete Salary Component"
        description="Are you sure you want to delete this salary component? This action cannot be undone."
      />
    </Card>
  );
}
