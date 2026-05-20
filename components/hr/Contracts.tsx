"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
  CheckCircle,
  Upload,
  FileText,
  Download,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Contract, CreateContractRequest } from "@/types";
import { DealerStaff } from "@/types";
import { dealerStaffEmail, dealerStaffFullName } from "@/lib/dealerStaffDisplay";

interface ContractsProps {
  contracts: Contract[];
  employees: DealerStaff[];
  createContract: (contract: CreateContractRequest) => Promise<void>;
  updateContract: (
    id: number,
    contract: Partial<CreateContractRequest>
  ) => Promise<void>;
  deleteContract: (id: number) => Promise<void>;
  finalizeContract: (id: number, finalDocument: File) => Promise<void>;
  sendContractToEmployee: (id: number) => Promise<void>;
  uploadSignedContract: (id: number, signedDocument: File) => Promise<void>;
}

export function ContractsComponent({
  contracts,
  employees,
  createContract,
  updateContract,
  deleteContract,
  finalizeContract,
  sendContractToEmployee,
  uploadSignedContract,
}: ContractsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [showUploadSignedDialog, setShowUploadSignedDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const finalizeFileInputRef = useRef<HTMLInputElement>(null);
  const signedFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CreateContractRequest>({
    employee_email: "",
    employee_type: "permanent",
    job_title: "",
    contract_salary: "",
    transport_allowance: "",
    start_date: "",
    probation_end_date: "",
    end_date: "",
    terms: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await updateContract(editingContract.id, form);
      } else {
        await createContract(form);
      }
      setShowDialog(false);
      setEditingContract(null);
      resetForm();
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract. Please try again.");
    }
  };

  const resetForm = () => {
    setForm({
      employee_email: "",
      employee_type: "permanent",
      job_title: "",
      contract_salary: "",
      transport_allowance: "",
      start_date: "",
      probation_end_date: "",
      end_date: "",
      terms: "",
    });
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setForm({
      employee_email: contract.employee_email_display,
      employee_type: contract.employee_type,
      job_title: contract.job_title,
      contract_salary: contract.contract_salary,
      transport_allowance: contract.transport_allowance,
      start_date: contract.start_date,
      probation_end_date: contract.probation_end_date,
      end_date: contract.end_date,
      terms: contract.terms,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      try {
        await deleteContract(id);
      } catch (error) {
        console.error("Error deleting contract:", error);
        alert("Failed to delete contract. Please try again.");
      }
    }
  };

  const handleSendToEmployee = async (id: number) => {
    if (
      confirm("This will generate a PDF and send it to the employee. Continue?")
    ) {
      try {
        await sendContractToEmployee(id);
        alert("Contract sent to employee successfully!");
      } catch (error) {
        console.error("Error sending contract:", error);
        alert("Failed to send contract. Please try again.");
      }
    }
  };

  const handleFinalize = async () => {
    if (!selectedContractId || !finalizeFileInputRef.current?.files?.[0]) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      await finalizeContract(
        selectedContractId,
        finalizeFileInputRef.current.files[0]
      );
      setShowFinalizeDialog(false);
      setSelectedContractId(null);
      if (finalizeFileInputRef.current) {
        finalizeFileInputRef.current.value = "";
      }
      alert("Contract finalized successfully!");
    } catch (error) {
      console.error("Error finalizing contract:", error);
      alert("Failed to finalize contract. Please try again.");
    }
  };

  const handleUploadSigned = async () => {
    if (!selectedContractId || !signedFileInputRef.current?.files?.[0]) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      await uploadSignedContract(
        selectedContractId,
        signedFileInputRef.current.files[0]
      );
      setShowUploadSignedDialog(false);
      setSelectedContractId(null);
      if (signedFileInputRef.current) {
        signedFileInputRef.current.value = "";
      }
      alert("Signed contract uploaded successfully!");
    } catch (error) {
      console.error("Error uploading signed contract:", error);
      alert("Failed to upload signed contract. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "sent_to_employee":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canEdit = (contract: Contract) => {
    return contract.status === "draft";
  };

  const canDelete = (contract: Contract) => {
    return contract.status === "draft";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employment Contracts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee contracts and agreements
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingContract(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContract ? "Edit Contract" : "New Employment Contract"}
              </DialogTitle>
              <DialogDescription>
                {editingContract
                  ? "Update contract details below. Only draft contracts can be edited."
                  : "Fill in the contract details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee_email">Employee</Label>
                  <Select
                    value={form.employee_email}
                    onValueChange={(value) =>
                      setForm({ ...form, employee_email: value })
                    }
                    required
                    disabled={!!editingContract}
                  >
                    <SelectTrigger id="employee_email">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem
                          key={emp.id}
                          value={dealerStaffEmail(emp)}
                        >
                          {dealerStaffFullName(emp)} — {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employee_type">Employee Type</Label>
                    <Select
                      value={form.employee_type}
                      onValueChange={(value) =>
                        setForm({
                          ...form,
                          employee_type: value as
                            | "permanent"
                            | "contract"
                            | "temporary"
                            | "intern",
                        })
                      }
                      required
                    >
                      <SelectTrigger id="employee_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      value={form.job_title}
                      onChange={(e) =>
                        setForm({ ...form, job_title: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contract_salary">Contract Salary</Label>
                    <Input
                      id="contract_salary"
                      type="number"
                      step="0.01"
                      value={form.contract_salary}
                      onChange={(e) =>
                        setForm({ ...form, contract_salary: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transport_allowance">
                      Transport Allowance
                    </Label>
                    <Input
                      id="transport_allowance"
                      type="number"
                      step="0.01"
                      value={form.transport_allowance}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          transport_allowance: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="probation_end_date">
                      Probation End Date
                    </Label>
                    <Input
                      id="probation_end_date"
                      type="date"
                      value={form.probation_end_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          probation_end_date: e.target.value,
                        })
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={form.terms}
                    onChange={(e) =>
                      setForm({ ...form, terms: e.target.value })
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
                  onClick={() => {
                    setShowDialog(false);
                    setEditingContract(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContract ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Employee</th>
                <th className="text-left p-2">Job Title</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Start Date</th>
                <th className="text-left p-2">End Date</th>
                <th className="text-left p-2">Salary</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length > 0 ? (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">
                          {contract.employee_full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.employee_email_display}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm">{contract.job_title}</td>
                    <td className="p-2 text-sm capitalize">
                      {contract.employee_type}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(contract.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(contract.end_date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      ${parseFloat(contract.contract_salary).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit(contract) && (
                            <DropdownMenuItem
                              onClick={() => handleEdit(contract)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {contract.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleSendToEmployee(contract.id)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send to Employee
                            </DropdownMenuItem>
                          )}
                          {contract.status === "sent_to_employee" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedContractId(contract.id);
                                  setShowUploadSignedDialog(true);
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Signed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedContractId(contract.id);
                                  setShowFinalizeDialog(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Finalize
                              </DropdownMenuItem>
                            </>
                          )}
                          {contract.draft_document_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  contract.draft_document_url!,
                                  "_blank"
                                )
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Draft
                            </DropdownMenuItem>
                          )}
                          {contract.employee_signed_document_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  contract.employee_signed_document_url!,
                                  "_blank"
                                )
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Signed
                            </DropdownMenuItem>
                          )}
                          {contract.final_document_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  contract.final_document_url!,
                                  "_blank"
                                )
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Final
                            </DropdownMenuItem>
                          )}
                          {canDelete(contract) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(contract.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No contracts found. Create a new contract to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Finalize Dialog */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Contract</DialogTitle>
            <DialogDescription>
              Upload the final stamped PDF document to finalize this contract.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="final_document">Final Document (PDF)</Label>
              <Input
                id="final_document"
                type="file"
                accept=".pdf"
                ref={finalizeFileInputRef}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFinalizeDialog(false);
                setSelectedContractId(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleFinalize}>Finalize</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Signed Dialog */}
      <Dialog
        open={showUploadSignedDialog}
        onOpenChange={setShowUploadSignedDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Signed Contract</DialogTitle>
            <DialogDescription>
              Upload the signed contract document from the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="signed_document">Signed Document (PDF)</Label>
              <Input
                id="signed_document"
                type="file"
                accept=".pdf"
                ref={signedFileInputRef}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadSignedDialog(false);
                setSelectedContractId(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadSigned}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
