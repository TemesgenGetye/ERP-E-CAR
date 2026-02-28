"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardCheck, Calendar, User, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCarData } from "@/hooks/useCarData";
import { postCarInspection } from "@/lib/car";
import { useProfileDetail } from "@/hooks/useProfileDetail";

export default function CarInspectionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const carId = params.id as string;
  const { car, fetchCarById, isLoading } = useCarData();
  const { profile } = useProfileDetail();

  const [formData, setFormData] = useState({
    inspected_by: "",
    inspection_date: new Date().toISOString().split("T")[0],
    remarks: "",
    condition_status: "good" as "excellent" | "good" | "fair" | "poor",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (carId) {
      fetchCarById(carId);
    }
  }, [carId, fetchCarById]);

  useEffect(() => {
    // Set inspected_by to user's full name if available
    if (profile?.first_name && profile?.last_name) {
      setFormData((prev) => ({
        ...prev,
        inspected_by: `${profile.first_name} ${profile.last_name}`,
      }));
    } else if (profile?.email) {
      setFormData((prev) => ({
        ...prev,
        inspected_by: profile.email,
      }));
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.inspected_by.trim()) {
      newErrors.inspected_by = "Inspector name is required";
    }

    if (!formData.inspection_date) {
      newErrors.inspection_date = "Inspection date is required";
    }

    if (!formData.condition_status) {
      newErrors.condition_status = "Condition status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await postCarInspection({
        car_id: parseInt(carId),
        inspected_by: formData.inspected_by,
        inspection_date: formData.inspection_date,
        remarks: formData.remarks,
        condition_status: formData.condition_status,
      });

      toast({
        title: "Success",
        description: "Car inspection details have been saved successfully!",
      });

      // Navigate to car detail page
      router.push(`/listing/${carId}`);
    } catch (error: any) {
      console.error("Error submitting inspection:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save inspection details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionStatusOptions = [
    { value: "excellent", label: "Excellent", color: "text-green-600" },
    { value: "good", label: "Good", color: "text-blue-600" },
    { value: "fair", label: "Fair", color: "text-yellow-600" },
    { value: "poor", label: "Poor", color: "text-red-600" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Car not found</p>
        <Link href="/listing">
          <Button variant="outline">Back to Listing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/listing/${carId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Car Inspection Details</h1>
              <p className="text-sm text-muted-foreground">
                {car.year} {car.make} {car.model}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inspection Information Card */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Inspection Information</CardTitle>
                  <CardDescription>
                    Enter the inspection details for this vehicle
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Inspector Name */}
              <div className="space-y-2">
                <Label htmlFor="inspected_by" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Inspector Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inspected_by"
                  name="inspected_by"
                  value={formData.inspected_by}
                  onChange={handleChange}
                  placeholder="Enter inspector name"
                  className={errors.inspected_by ? "border-red-500" : ""}
                />
                {errors.inspected_by && (
                  <p className="text-sm text-red-500">{errors.inspected_by}</p>
                )}
              </div>

              {/* Inspection Date */}
              <div className="space-y-2">
                <Label htmlFor="inspection_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Inspection Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inspection_date"
                  name="inspection_date"
                  type="date"
                  value={formData.inspection_date}
                  onChange={handleChange}
                  className={errors.inspection_date ? "border-red-500" : ""}
                />
                {errors.inspection_date && (
                  <p className="text-sm text-red-500">{errors.inspection_date}</p>
                )}
              </div>

              {/* Condition Status */}
              <div className="space-y-2">
                <Label htmlFor="condition_status" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Condition Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.condition_status}
                  onValueChange={(value) =>
                    handleSelectChange("condition_status", value)
                  }
                >
                  <SelectTrigger
                    className={errors.condition_status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select condition status" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition_status && (
                  <p className="text-sm text-red-500">{errors.condition_status}</p>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter any additional remarks or notes about the inspection..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link href={`/listing/${carId}`}>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Saving..." : "Save Inspection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
