"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

import Image from "next/image";
import { useState } from "react";

// ----------------------
// Form schema
// ----------------------
const carFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  make: z.string().min(2, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.string().min(1, "Condition is required"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  engine: z.string().min(1, "Engine info is required"),
  driveType: z.string().min(1, "Drive type is required"),
  bodyType: z.string().min(1, "Body type is required"),
  location: z.string().min(1, "Location is required"),
  vin: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  owners: z.string().optional(),
  serviceHistory: z.string().optional(),
  accidentHistory: z.string().optional(),
  registration: z.string().optional(),
  insurance: z.string().optional(),
  warranty: z.string().optional(),
  features: z.string().optional(),
  images: z.array(z.any()).optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

// ----------------------
// Select options
// ----------------------
const conditionOptions = ["New", "Used", "Certified Pre-Owned"];
const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "LPG"];
const transmissionOptions = ["Automatic", "Manual", "CVT", "Dual-Clutch"];
const driveTypeOptions = ["FWD", "RWD", "AWD/4WD"];
const bodyTypeOptions = ["Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Van"];
const currencyOptions = ["USD", "ETB", "EUR"];

export default function CarForm() {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = (data: CarFormValues) => {
    console.log("Car Data Submitted:", data);
    toast({
      title: "Car listing created",
      description: "Your car has been listed successfully.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-8 grid grid-cols-2 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between col-span-2">
        <Link href="/listing" className="cursor-pointer">
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button> */}
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="cursor-pointer rounded-full "
          >
            Submit Car
          </Button>
        </div>
      </div>

      {/* General Information */}
      <section className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Listing Title" {...form.register("title")} />
          <Input placeholder="Make" {...form.register("make")} />
          <Input placeholder="Model" {...form.register("model")} />
          <Input placeholder="Year" {...form.register("year")} />
          <Input placeholder="Mileage" {...form.register("mileage")} />
          <Select onValueChange={(val) => form.setValue("condition", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Pricing & Specifications */}
      <section className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Pricing & Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Price" {...form.register("price")} />
          <Select onValueChange={(val) => form.setValue("currency", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => form.setValue("fuelType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypeOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => form.setValue("transmission", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              {transmissionOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Engine (e.g. 2.0L Turbo)"
            {...form.register("engine")}
          />
          <Select onValueChange={(val) => form.setValue("driveType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Drive Type" />
            </SelectTrigger>
            <SelectContent>
              {driveTypeOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => form.setValue("bodyType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Body Type" />
            </SelectTrigger>
            <SelectContent>
              {bodyTypeOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Additional Details */}
      <section className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="VIN / Chassis Number" {...form.register("vin")} />
          <Input
            placeholder="Exterior Color"
            {...form.register("exteriorColor")}
          />
          <Input
            placeholder="Interior Color"
            {...form.register("interiorColor")}
          />
          <Input placeholder="Number of Doors" {...form.register("doors")} />
          <Input placeholder="Number of Seats" {...form.register("seats")} />
          <Input placeholder="Previous Owners" {...form.register("owners")} />
          <Input
            placeholder="Service History"
            {...form.register("serviceHistory")}
          />
          <Input
            placeholder="Accident History"
            {...form.register("accidentHistory")}
          />
          <Input
            placeholder="Registration Details"
            {...form.register("registration")}
          />
          <Input
            placeholder="Insurance Status"
            {...form.register("insurance")}
          />
          <Input placeholder="Warranty" {...form.register("warranty")} />
        </div>
        <Textarea
          placeholder="List features (comma separated: Airbags, Sunroof, Bluetooth, etc.)"
          {...form.register("features")}
          cols={7}
          rows={7}
          className="columns-7 rows-7"

        />
      </section>

      {/* Uploads */}
      <section className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Uploads</h2>
        <div className="flex flex-wrap gap-4">
          {images.map((file, idx) => (
            <div key={idx} className="relative w-32 h-32">
              <Image
                src={URL.createObjectURL(file)}
                alt={`car-${idx}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
          <label className="w-32 h-32 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100">
            <Plus className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-500">Add</span>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
