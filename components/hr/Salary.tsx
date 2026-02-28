"use client";

import { useState } from "react";
import { Plus, DollarSign } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    salaryCpts,
    isLoadingSalaryComponents,
    salaryCptErr,
  } = useSalaryCpts();


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
      // Invalidate queries to refetch salary components
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaryCptErr ? (
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
            ) : safeSalaryCpts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
