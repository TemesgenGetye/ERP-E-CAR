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
import { Revenue } from "@/types";

interface RevenueProps {
  revenues: Revenue[];
  createRevenue: (revenue: Omit<Revenue, "id">) => Promise<void>;
  updateRevenue: (
    id: number,
    revenue: Partial<Omit<Revenue, "id">>
  ) => Promise<void>;
  deleteRevenue: (id: number) => Promise<void>;
  dealerId?: number;
}

export function RevenueComponent({
  revenues,
  createRevenue,
  updateRevenue,
  deleteRevenue,
  dealerId,
}: RevenueProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Revenue | null>(null);

  const [form, setForm] = useState<{
    source: "car_sale" | "broker_payment" | string;
    amount: string;
    currency: "USD" | "ETB";
    converted_amount: string;
    created_at: string;
    description: string;
    dealer?: number;
  }>({
    source: "car_sale",
    amount: "",
    currency: "USD",
    converted_amount: "",
    created_at: new Date().toISOString(),
    description: "",
    dealer: dealerId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!dealerId) {
        alert("Dealer information is required.");
        return;
      }
      const payload = { ...form, dealer: dealerId } as any;
      if (editing) {
        await updateRevenue(editing.id, payload);
      } else {
        await createRevenue(payload);
      }
      setShowDialog(false);
      setEditing(null);
      setForm({
        source: "car_sale",
        amount: "",
        currency: "USD",
        converted_amount: "",
        created_at: new Date().toISOString(),
        description: "",
        dealer: dealerId,
      });
    } catch (error) {
      console.error("Error saving revenue:", error);
    }
  };

  const handleEdit = (rev: Revenue) => {
    setEditing(rev);
    setForm({
      source: (rev.source as any) || "car_sale",
      amount: rev.amount,
      currency: rev.currency as any,
      converted_amount: rev.converted_amount,
      created_at: rev.created_at,
      description: rev.description,
      dealer: dealerId,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this revenue entry?")) {
      try {
        await deleteRevenue(id);
      } catch (error) {
        console.error("Error deleting revenue:", error);
      }
    }
  };

  const totalETB = revenues.reduce((sum, r) => {
    const val = r.converted_amount ? parseFloat(r.converted_amount) : 0;
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenues</CardTitle>
          <p className="text-sm text-muted-foreground">
            Record revenues from car sales and broker payments
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Revenue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Revenue" : "Add Revenue"}
              </DialogTitle>
              <DialogDescription>
                {editing
                  ? "Update the revenue details."
                  : "Record a new revenue entry."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={form.source}
                    onValueChange={(value) =>
                      setForm({ ...form, source: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car_sale">Car Sale</SelectItem>
                      <SelectItem value="broker_payment">
                        Broker Payment
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                        setForm({ ...form, amount: e.target.value })
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
                        setForm({ ...form, currency: value as any })
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
                  <Label htmlFor="created_at">Date</Label>
                  <Input
                    id="created_at"
                    type="datetime-local"
                    value={form.created_at.slice(0, 16)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        created_at: new Date(e.target.value).toISOString(),
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="e.g., Sale of Car ID #1234"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setEditing(null);
                    setForm({
                      source: "car_sale",
                      amount: "",
                      currency: "USD",
                      converted_amount: "",
                      created_at: new Date().toISOString(),
                      description: "",
                      dealer: dealerId,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? "Update" : "Add"} Revenue
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">Total (ETB):</div>
          <div className="text-xl font-semibold">
            {totalETB.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="space-y-4">
          {revenues.length > 0 ? (
            revenues.map((rev) => (
              <div
                key={rev.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{rev.source}</Badge>
                      <span className="font-medium">
                        {rev.currency === "USD" ? "$" : "ETB "}
                        {Math.abs(parseFloat(rev.amount)).toLocaleString()}
                      </span>
                      {rev.converted_amount && (
                        <span className="text-sm text-muted-foreground">
                          (ETB{" "}
                          {Math.abs(
                            parseFloat(rev.converted_amount)
                          ).toLocaleString()}
                          )
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rev.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rev.created_at).toLocaleString()}
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
                    <DropdownMenuItem onClick={() => handleEdit(rev)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(rev.id)}
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
              <p className="text-muted-foreground">No revenues found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
