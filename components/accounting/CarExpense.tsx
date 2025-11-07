"use client";

import { useState, useMemo } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { CarExpense, Car } from "@/types";

interface CarExpenseProps {
  carExpenses: CarExpense[];
  cars: Car[];
  createCarExpense: (expense: Omit<CarExpense, "id">) => Promise<void>;
  updateCarExpense: (
    id: number,
    expense: Partial<Omit<CarExpense, "id">>
  ) => Promise<void>;
  deleteCarExpense: (id: number) => Promise<void>;
  dealerId?: number;
}

export function CarExpenseComponent({
  carExpenses,
  cars,
  createCarExpense,
  updateCarExpense,
  deleteCarExpense,
  dealerId,
}: CarExpenseProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CarExpense | null>(null);

  const [form, setForm] = useState<{
    description: string;
    amount: string;
    currency: "USD" | "ETB";
    converted_amount: string;
    date: string;
    dealer?: number;
    car: number | "";
  }>({
    description: "",
    amount: "",
    currency: "USD",
    converted_amount: "",
    date: new Date().toISOString().split("T")[0],
    dealer: dealerId,
    car: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!dealerId || !form.car) {
        alert("Please ensure dealer and car are selected before submitting.");
        return;
      }
      const payload = {
        ...form,
        dealer: dealerId,
        car: Number(form.car),
      } as any;

      if (editingExpense) {
        await updateCarExpense(editingExpense.id, payload);
      } else {
        await createCarExpense(payload);
      }
      setShowDialog(false);
      setEditingExpense(null);
      setForm({
        description: "",
        amount: "",
        currency: "USD",
        converted_amount: "",
        date: new Date().toISOString().split("T")[0],
        dealer: dealerId,
        car: "",
      });
    } catch (error) {
      console.error("Error saving car expense:", error);
    }
  };

  const handleEdit = (expense: CarExpense) => {
    setEditingExpense(expense);
    setForm({
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      converted_amount: expense.converted_amount,
      date: expense.date,
      dealer: dealerId,
      car: expense.car,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this car expense?")) {
      try {
        await deleteCarExpense(id);
      } catch (error) {
        console.error("Error deleting car expense:", error);
      }
    }
  };

  // Group expenses by car
  const expensesByCar = useMemo(() => {
    const grouped = new Map<number, CarExpense[]>();

    carExpenses.forEach((expense) => {
      if (!grouped.has(expense.car)) {
        grouped.set(expense.car, []);
      }
      grouped.get(expense.car)!.push(expense);
    });

    return grouped;
  }, [carExpenses]);

  // Calculate total for a car
  const getCarTotal = (expenses: CarExpense[]) => {
    return expenses.reduce((sum, expense) => {
      const amount = expense.converted_amount
        ? parseFloat(expense.converted_amount)
        : parseFloat(expense.amount);
      return sum + Math.abs(amount);
    }, 0);
  };

  // Get car info
  const getCarInfo = (carId: number) => {
    return cars.find((c) => c.id === carId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Car Expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track expenses related to specific cars (shipping, customs,
            transport)
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Car Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Car Expense" : "Add New Car Expense"}
              </DialogTitle>
              <DialogDescription>
                {editingExpense
                  ? "Update the car expense details below."
                  : "Record a new expense for a car."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="car">Car</Label>
                  <Select
                    value={String(form.car || "")}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        car: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a car" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map((car) => (
                        <SelectItem key={car.id} value={String(car.id)}>
                          {car.make} {car.model} ({car.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Shipping, Customs, Transport"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: e.target.value,
                        })
                      }
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={form.currency}
                      onValueChange={(value) =>
                        setForm({
                          ...form,
                          currency: value as "USD" | "ETB",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ETB">ETB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setEditingExpense(null);
                    setForm({
                      description: "",
                      amount: "",
                      currency: "USD",
                      converted_amount: "",
                      date: new Date().toISOString().split("T")[0],
                      dealer: dealerId,
                      car: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? "Update" : "Add"} Car Expense
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {carExpenses.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {Array.from(expensesByCar.entries()).map(([carId, expenses]) => {
              const car = getCarInfo(carId);
              const total = getCarTotal(expenses);
              const carName = car
                ? `${car.make} ${car.model} (${car.year})`
                : `Car #${carId}`;

              return (
                <AccordionItem key={carId} value={`car-${carId}`}>
                  <AccordionTrigger className="hover:no-underline px-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="text-base px-3 py-1"
                        >
                          {carName}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {expenses.length} expense
                          {expenses.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mr-8">
                        <span className="font-semibold text-lg">
                          Total: ETB{" "}
                          {total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2 pl-6">
                      {expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex flex-col w-full">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {expense.currency === "USD" ? "$" : "ETB "}
                                  {Math.abs(
                                    parseFloat(expense.amount)
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                                {expense.converted_amount && (
                                  <span className="text-sm text-muted-foreground">
                                    (ETB{" "}
                                    {Math.abs(
                                      parseFloat(expense.converted_amount)
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    )
                                  </span>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {expense.currency}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {expense.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Date:{" "}
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(expense)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(expense.id)}
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No car expenses found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
