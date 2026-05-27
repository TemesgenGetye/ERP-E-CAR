"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useSales } from "@/hooks/useSales";
import { useToast } from "@/hooks/use-toast";
import { useCarData } from "@/hooks/useCarData";
import { fetchAllProfiles, fetchAllCars } from "@/lib/car";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { api } from "@/lib/api";
import { Sale, Lead, Car } from "@/types";
import { UserProfile } from "@/types/Profile";

type LeadStatus =
  | "inquiry"
  | "contacted"
  | "negotiation"
  | "closed"
  | "lost"
  | "cancelled";

export default function SalesPage() {
  const {
    sales,
    leads,
    isLoading,
    createSale,
    updateSale,
    deleteSale,
    createLead,
    updateLead,
    deleteLead,
    fetchLeads,
  } = useSales();

  const { toast } = useToast();
  const { cars: userCars } = useCarData();
  const [buyers, setBuyers] = useState<UserProfile[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);

  useEffect(() => {
    fetchAllProfiles()
      .then((profiles) => setBuyers(profiles.filter((p) => p.role === "buyer")))
      .catch(() => {});
    fetchAllCars()
      .then(setAllCars)
      .catch(() => {});
  }, []);

  const cars = allCars.length > 0 ? allCars : userCars;

  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [isSaleSubmitting, setIsSaleSubmitting] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<"sales" | "leads">("sales");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Sale form state
  const [saleForm, setSaleForm] = useState<{
    buyer: string;
    car: string;
    price: string;
  }>({
    buyer: "",
    car: "",
    price: "",
  });

  // Lead form state
  const [leadForm, setLeadForm] = useState<{
    name: string;
    contact: string;
    status: LeadStatus;
    assigned_sales: string;
    car: string;
  }>({
    name: "",
    contact: "",
    status: "inquiry",
    assigned_sales: "",
    car: "",
  });

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusLead, setStatusLead] = useState<Lead | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>("inquiry");
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "sale" | "lead";
    id: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingSale;
    setIsSaleSubmitting(true);
    try {
      if (isEditing) {
        await updateSale(editingSale!.id, {
          buyer: parseInt(saleForm.buyer),
          car: parseInt(saleForm.car),
          price: saleForm.price,
        });
      } else {
        await createSale({
          buyer: parseInt(saleForm.buyer),
          car: parseInt(saleForm.car),
          price: saleForm.price,
        });
      }
      toast({
        title: isEditing ? "Sale Updated" : "Sale Created",
        variant: "success",
        description: isEditing
          ? "The sale has been updated successfully."
          : "New sale has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save sale",
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setIsSaleSubmitting(false);
      setShowSaleDialog(false);
      setEditingSale(null);
      setSaleForm({ buyer: "", car: "", price: "" });
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await updateLead(editingLead.id, {
          name: leadForm.name,
          contact: leadForm.contact,
          status: leadForm.status,
          assigned_sales: leadForm.assigned_sales
            ? parseInt(leadForm.assigned_sales)
            : null,
          car: parseInt(leadForm.car),
        });
      } else {
        await createLead({
          name: leadForm.name,
          contact: leadForm.contact,
          status: leadForm.status,
          assigned_sales: leadForm.assigned_sales
            ? parseInt(leadForm.assigned_sales)
            : null,
          car: parseInt(leadForm.car),
        });
      }
      setShowLeadDialog(false);
      setEditingLead(null);
      setLeadForm({
        name: "",
        contact: "",
        status: "inquiry",
        assigned_sales: "",
        car: "",
      });
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setSaleForm({
      buyer: sale.buyer.toString(),
      car: sale.car.toString(),
      price: sale.price,
    });
    setShowSaleDialog(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      name: lead.name,
      contact: lead.contact,
      status: lead.status,
      assigned_sales: lead.assigned_sales?.toString() || "",
      car: lead.car.toString(),
    });
    setShowLeadDialog(true);
  };

  const handleDeleteSale = (id: number) =>
    setDeleteTarget({ type: "sale", id });
  const handleDeleteLead = (id: number) =>
    setDeleteTarget({ type: "lead", id });

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "sale") {
        await deleteSale(deleteTarget.id);
      } else {
        await deleteLead(deleteTarget.id);
      }
      toast({
        title: "Deleted",
        variant: "success",
        description: `${deleteTarget.type === "sale" ? "Sale" : "Lead"} deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleOpenStatusDialog = (lead: Lead) => {
    setStatusLead(lead);
    setSelectedStatus(lead.status);
    setShowStatusDialog(true);
  };

  const handleUpdateLeadStatus = async () => {
    if (!statusLead) return;
    setIsStatusSubmitting(true);
    try {
      await api(`/sales/leads/${statusLead.id}/update_status/`, {
        method: "PATCH",
        body: { status: selectedStatus } as any,
      });
      await fetchLeads();
      toast({
        title: "Status Updated",
        variant: "success",
        description: `Lead status changed to ${selectedStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setIsStatusSubmitting(false);
      setShowStatusDialog(false);
      setStatusLead(null);
    }
  };

  const getBuyerName = (id: number) => {
    const profile = buyers.find((b) => b.id === id);
    return profile ? `${profile.first_name} ${profile.last_name}` : `#${id}`;
  };

  const getCarLabel = (id: number) => {
    const car = cars.find((c) => c.id === id);
    return car ? `${car.year} ${car.make} ${car.model}` : `#${id}`;
  };

  const filteredLeads = leads.filter(
    (lead) => filterStatus === "all" || lead.status === filterStatus,
  );

  const totalSales = sales.reduce(
    (sum, sale) => sum + parseFloat(sale.price),
    0,
  );
  const totalLeads = leads.length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "inquiry":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeadStatusIcon = (status: string) => {
    switch (status) {
      case "inquiry":
        return <AlertCircle className="h-4 w-4" />;
      case "contacted":
        return <Phone className="h-4 w-4" />;
      case "negotiation":
        return <TrendingUp className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      case "lost":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading && sales.length === 0 && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sales Management
          </h1>
          <p className="text-muted-foreground">
            Manage sales, leads, and customer relationships
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.abs(totalSales).toLocaleString()} ETB
              </div>
              <p className="text-xs text-muted-foreground">
                {sales.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Potential customers
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Closed Deals
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedLeads}</div>
              <p className="text-xs text-muted-foreground">
                Successful conversions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalLeads > 0
                  ? Math.round((closedLeads / totalLeads) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Lead to sale conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "sales"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "leads"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Leads
            </button>
          </div>
        </div>

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Records</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track completed sales and transactions
                </p>
              </div>
              <Dialog open={showSaleDialog} onOpenChange={setShowSaleDialog}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sale
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSale ? "Edit Sale" : "Add New Sale"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSale
                        ? "Update the sale details below."
                        : "Record a new sale transaction."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="buyer">Buyer</Label>
                        <Select
                          value={saleForm.buyer}
                          onValueChange={(value) =>
                            setSaleForm({ ...saleForm, buyer: value })
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select buyer" />
                          </SelectTrigger>
                          <SelectContent>
                            {buyers.map((buyer) => (
                              <SelectItem
                                key={buyer.id}
                                value={buyer.id.toString()}
                              >
                                {buyer.first_name} {buyer.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="car">Car ID</Label>
                        <Select
                          value={saleForm.car}
                          onValueChange={(value) =>
                            setSaleForm({ ...saleForm, car: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select car" />
                          </SelectTrigger>
                          <SelectContent>
                            {cars
                              .filter((car) => car && car.id)
                              .map((car) => (
                                <SelectItem
                                  key={car.id}
                                  value={car.id.toString()}
                                >
                                  {car.year} {car.make} {car.model} - $
                                  {parseFloat(
                                    typeof car.price === "string"
                                      ? car.price
                                      : String(car.price || "0"),
                                  ).toLocaleString()}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price">Sale Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={saleForm.price}
                          onChange={(e) =>
                            setSaleForm({ ...saleForm, price: e.target.value })
                          }
                          placeholder="Enter sale price"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowSaleDialog(false);
                          setEditingSale(null);
                          setSaleForm({ buyer: "", car: "", price: "" });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaleSubmitting}>
                        {isSaleSubmitting
                          ? "Saving..."
                          : `${editingSale ? "Update" : "Add"} Sale`}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Sale #{sale.id}</span>
                            <span className="text-green-600 font-bold">
                              {Math.abs(
                                parseFloat(sale.price),
                              ).toLocaleString()}{" "}
                              ETB
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Buyer: {getBuyerName(sale.buyer)} | Car:{" "}
                            {getCarLabel(sale.car)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleEditSale(sale)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSale(sale.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No sales found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Leads</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage potential customers and sales opportunities
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 cursor-pointer">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="all">
                      All Status
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="inquiry">
                      Inquiry
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="contacted">
                      Contacted
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="negotiation">
                      Negotiation
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="closed">
                      Closed
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="lost">
                      Lost
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="cancelled">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showLeadDialog} onOpenChange={setShowLeadDialog}>
                  <DialogTrigger asChild></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingLead ? "Edit Lead" : "Add New Lead"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingLead
                          ? "Update the lead details below."
                          : "Add a new sales lead."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLeadSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={leadForm.name}
                            onChange={(e) =>
                              setLeadForm({ ...leadForm, name: e.target.value })
                            }
                            placeholder="Enter lead name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contact">Contact</Label>
                          <Input
                            id="contact"
                            value={leadForm.contact}
                            onChange={(e) =>
                              setLeadForm({
                                ...leadForm,
                                contact: e.target.value,
                              })
                            }
                            placeholder="Enter contact information"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={leadForm.status}
                            onValueChange={(value) =>
                              setLeadForm({ ...leadForm, status: value as any })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inquiry">Inquiry</SelectItem>
                              <SelectItem value="contacted">
                                Contacted
                              </SelectItem>
                              <SelectItem value="negotiation">
                                Negotiation
                              </SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assigned_sales">
                            Assigned Sales ID (Optional)
                          </Label>
                          <Input
                            id="assigned_sales"
                            type="number"
                            value={leadForm.assigned_sales}
                            onChange={(e) =>
                              setLeadForm({
                                ...leadForm,
                                assigned_sales: e.target.value,
                              })
                            }
                            placeholder="Enter assigned sales ID"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="car">Car ID</Label>
                          <Select
                            value={leadForm.car}
                            onValueChange={(value) =>
                              setLeadForm({ ...leadForm, car: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select car" />
                            </SelectTrigger>
                            <SelectContent>
                              {cars
                                .filter((car) => car && car.id)
                                .map((car) => (
                                  <SelectItem
                                    key={car.id}
                                    value={car.id.toString()}
                                  >
                                    {car.year} {car.make} {car.model}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowLeadDialog(false);
                            setEditingLead(null);
                            setLeadForm({
                              name: "",
                              contact: "",
                              status: "inquiry",
                              assigned_sales: "",
                              car: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingLead ? "Update" : "Add"} Lead
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <Badge className={getLeadStatusColor(lead.status)}>
                              <span className="flex items-center gap-1">
                                {getLeadStatusIcon(lead.status)}
                                {lead.status.replace("_", " ")}
                              </span>
                            </Badge>
                            <span className="font-medium">{lead.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.contact}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Car: {lead.car} | Created:{" "}
                            {new Date(lead.created_at).toLocaleDateString()}
                            {lead.assigned_sales &&
                              ` | Sales: ${lead.assigned_sales}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleEditLead(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleOpenStatusDialog(lead)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No leads found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.type === "sale" ? "Sale" : "Lead"}`}
        description={`This will permanently delete the ${deleteTarget?.type}. This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Update Lead Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
            <DialogDescription>
              Change the status for{" "}
              <span className="font-medium">{statusLead?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as LeadStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowStatusDialog(false);
                setStatusLead(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLeadStatus}
              disabled={isStatusSubmitting}
            >
              {isStatusSubmitting ? "Saving..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
