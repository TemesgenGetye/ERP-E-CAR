"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExchangeRate } from "@/types";

interface ExchangeRateProps {
  exchangeRates: ExchangeRate[];
  createExchangeRate: (rate: Omit<ExchangeRate, "id">) => Promise<void>;
  updateExchangeRate: (
    id: number,
    rate: Partial<Omit<ExchangeRate, "id">>
  ) => Promise<void>;
  deleteExchangeRate: (id: number) => Promise<void>;
}

export function ExchangeRateComponent({
  exchangeRates,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
}: ExchangeRateProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);

  const [form, setForm] = useState<{
    rate: string;
    date: string;
  }>({
    rate: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form } as any;

      if (editingRate) {
        await updateExchangeRate(editingRate.id, payload);
      } else {
        await createExchangeRate(payload);
      }
      setShowDialog(false);
      setEditingRate(null);
      setForm({
        rate: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error saving exchange rate:", error);
    }
  };

  const handleEdit = (rate: ExchangeRate) => {
    setEditingRate(rate);
    setForm({
      rate: rate.rate,
      date: rate.date,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this exchange rate?")) {
      try {
        await deleteExchangeRate(id);
      } catch (error) {
        console.error("Error deleting exchange rate:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Exchange Rates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage USD/ETB exchange rates for currency conversion
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Exchange Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRate ? "Edit Exchange Rate" : "Add New Exchange Rate"}
              </DialogTitle>
              <DialogDescription>
                {editingRate
                  ? "Update the exchange rate details below."
                  : "Record a new USD/ETB exchange rate."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rate">Rate (USD to ETB)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={form.rate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rate: e.target.value,
                      })
                    }
                    placeholder="Enter exchange rate"
                    required
                  />
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
                    setEditingRate(null);
                    setForm({
                      rate: "",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRate ? "Update" : "Add"} Exchange Rate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exchangeRates.length > 0 ? (
            exchangeRates.map((rate) => (
              <div
                key={rate.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-lg">
                        1 USD = {parseFloat(rate.rate).toLocaleString()} ETB
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(rate.date).toLocaleDateString()}
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
                    <DropdownMenuItem onClick={() => handleEdit(rate)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(rate.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No exchange rates found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
