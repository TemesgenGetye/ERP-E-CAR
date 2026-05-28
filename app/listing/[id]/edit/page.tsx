"use client";

import {
  ArrowLeft,
  X,
  Plus,
  Check,
  Camera,
  ClipboardCheck,
  Trash2,
  Info,
} from "lucide-react";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useCarData } from "@/hooks/useCarData";
import { useRouter, useParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Car } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Image interface
interface CarImage {
  id?: number;
  image_url?: string;
  image_file?: string; // URL.createObjectURL(file)
  is_feature: string;
  caption: string;
  file?: File; // Store the actual file object for new uploads
}

// Form data interface matching API schema
interface CarFormData {
  dealer: number;
  broker: number | null;
  uploaded_images: CarImage[];
  existing_images: any[];
  make_ref: number;
  make: string;
  model_ref: number;
  model: string;
  year: number;
  price: string;
  mileage: number;
  fuel_type: "electric" | "hybrid" | "petrol" | "diesel";
  body_type:
    | "sedan"
    | "suv"
    | "truck"
    | "coupe"
    | "hatchback"
    | "convertible"
    | "wagon"
    | "van"
    | "other";
  exterior_color: string;
  interior_color: string;
  engine: string;
  drivetrain: "fwd" | "rwd" | "awd" | "4wd";
  condition: "new" | "used";
  trim: string;
  description: string;
  status:
    | "available"
    | "reserved"
    | "sold"
    | "pending_inspection"
    | "under_maintenance"
    | "delivered"
    | "archived";
  sale_type: "fixed_price" | "auction";
  auction_end: string;
  priority: boolean;
  location: string;

  // Features
  bluetooth: boolean;
  heated_seats: boolean;
  cd_player: boolean;
  power_locks: boolean;
  premium_wheels_rims: boolean;
  winch: boolean;
  alarm_anti_theft: boolean;
  cooled_seats: boolean;
  keyless_start: boolean;
  body_kit: boolean;
  navigation_system: boolean;
  premium_lights: boolean;
  cassette_player: boolean;
  fog_lights: boolean;
  leather_seats: boolean;
  roof_rack: boolean;
  dvd_player: boolean;
  power_mirrors: boolean;
  power_sunroof: boolean;
  aux_audio_in: boolean;
  brush_guard: boolean;
  air_conditioning: boolean;
  performance_tyres: boolean;
  premium_sound_system: boolean;
  heat: boolean;
  vhs_player: boolean;
  off_road_kit: boolean;
  am_fm_radio: boolean;
  moonroof: boolean;
  racing_seats: boolean;
  premium_paint: boolean;
  spoiler: boolean;
  power_windows: boolean;
  sunroof: boolean;
  climate_control: boolean;
  parking_sensors: boolean;
  rear_view_camera: boolean;
  keyless_entry: boolean;
  off_road_tyres: boolean;
  satellite_radio: boolean;
  power_seats: boolean;
  tiptronic_gears: boolean;
  dual_exhaust: boolean;
  power_steering: boolean;
  cruise_control: boolean;
  all_wheel_steering: boolean;
  front_airbags: boolean;
  side_airbags: boolean;
  n2o_system: boolean;
  anti_lock_brakes: boolean;

  // Inspection Fields
  engine_condition: string;
  transmission_condition: string;
  exterior_condition: string;
  interior_condition: string;
  tires_condition: string;
  brakes_condition: string;
  suspension_condition: string;
  electrical_condition: string;
  inspection_notes: string;
}

const featureCategories = {
  "Comfort & Convenience": [
    "bluetooth",
    "heated_seats",
    "cooled_seats",
    "power_seats",
    "power_windows",
    "power_locks",
    "power_mirrors",
    "keyless_entry",
    "keyless_start",
    "cruise_control",
    "climate_control",
    "air_conditioning",
    "heat",
    "power_steering",
  ],
  "Entertainment & Audio": [
    "cd_player",
    "dvd_player",
    "cassette_player",
    "vhs_player",
    "am_fm_radio",
    "satellite_radio",
    "aux_audio_in",
    "premium_sound_system",
    "navigation_system",
  ],
  "Exterior & Performance": [
    "premium_wheels_rims",
    "performance_tyres",
    "off_road_tyres",
    "premium_paint",
    "spoiler",
    "body_kit",
    "dual_exhaust",
    "tiptronic_gears",
    "all_wheel_steering",
  ],
  "Safety & Security": [
    "alarm_anti_theft",
    "front_airbags",
    "side_airbags",
    "anti_lock_brakes",
    "parking_sensors",
    "rear_view_camera",
  ],
  "Roof & Windows": ["sunroof", "moonroof", "power_sunroof"],
  "Interior & Seating": ["leather_seats", "racing_seats"],
  Lighting: ["premium_lights", "fog_lights"],
  "Storage & Utility": ["roof_rack", "brush_guard", "winch", "off_road_kit"],
  "Special Features": ["n2o_system"],
};

const getInitialFormData = (): CarFormData => ({
  dealer: 0,
  broker: null,
  uploaded_images: [],
  existing_images: [],
  make_ref: 0,
  make: "",
  model_ref: 0,
  model: "",
  year: new Date().getFullYear(),
  price: "",
  mileage: 0,
  fuel_type: "petrol",
  body_type: "sedan",
  exterior_color: "",
  interior_color: "",
  engine: "",
  drivetrain: "fwd",
  condition: "used",
  trim: "",
  description: "",
  status: "available",
  sale_type: "fixed_price",
  auction_end: "",
  priority: false,
  location: "",
  bluetooth: false,
  heated_seats: false,
  cd_player: false,
  power_locks: false,
  premium_wheels_rims: false,
  winch: false,
  alarm_anti_theft: false,
  cooled_seats: false,
  keyless_start: false,
  body_kit: false,
  navigation_system: false,
  premium_lights: false,
  cassette_player: false,
  fog_lights: false,
  leather_seats: false,
  roof_rack: false,
  dvd_player: false,
  power_mirrors: false,
  power_sunroof: false,
  aux_audio_in: false,
  brush_guard: false,
  air_conditioning: false,
  performance_tyres: false,
  premium_sound_system: false,
  heat: false,
  vhs_player: false,
  off_road_kit: false,
  am_fm_radio: false,
  moonroof: false,
  racing_seats: false,
  premium_paint: false,
  spoiler: false,
  power_windows: false,
  sunroof: false,
  climate_control: false,
  parking_sensors: false,
  rear_view_camera: false,
  keyless_entry: false,
  off_road_tyres: false,
  satellite_radio: false,
  power_seats: false,
  tiptronic_gears: false,
  dual_exhaust: false,
  power_steering: false,
  cruise_control: false,
  all_wheel_steering: false,
  front_airbags: false,
  side_airbags: false,
  n2o_system: false,
  anti_lock_brakes: false,
  engine_condition: "Good",
  transmission_condition: "Good",
  exterior_condition: "Good",
  interior_condition: "Good",
  tires_condition: "Good",
  brakes_condition: "Good",
  suspension_condition: "Good",
  electrical_condition: "Good",
  inspection_notes: "",
});

export default function EditCarScreen() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<CarFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<
    { id: number; image_url: string; is_feature: string; caption: string }[]
  >([]);
  const existingImagesInitialized = useRef(false);
  const [featuredSource, setFeaturedSource] = useState<"existing" | "new">(
    "new",
  );
  const [featuredExistingId, setFeaturedExistingId] = useState<number | null>(
    null,
  );
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const {
    car,
    makes,
    models,
    fetchMakes,
    fetchModels,
    fetchCarById,
    updateCar,
    deleteCar,
    isLoading,
  } = useCarData();

  const { dealer, getDealer } = useProfile();

  useEffect(() => {
    fetchMakes();
    if (id) {
      fetchCarById(id);
    }
    if (!dealer) {
      getDealer();
    }
  }, [id, fetchCarById, fetchMakes, getDealer, dealer]);

  useEffect(() => {
    if (!car || !makes.length) return;

    const formFields = { ...getInitialFormData(), ...car };

    // Backend returns make/model as strings only — resolve IDs from the loaded lists
    const resolvedMake = makes.find((m) => m.name === car.make);
    const makeRef = resolvedMake?.id ?? 0;

    setFormData({
      ...formFields,
      dealer: car.dealer || 0,
      price: String(parseInt(String(car.price))),
      uploaded_images: [],
      existing_images: car.images || [],
      description: car.description || "",
      trim: car.trim || "",
      location: car.location || "",
      auction_end: car.auction_end || "",
      status: car.status as any,
      condition:
        car.condition === "new" || car.condition === "used"
          ? car.condition
          : "used",
      make: car.make,
      model: car.model,
      make_ref: makeRef,
      model_ref: 0,
    });

    if (makeRef) {
      fetchModels(makeRef);
    }
  }, [car, makes, fetchModels]);

  // Initialize existing images once when car data first loads
  useEffect(() => {
    if (!car?.images || existingImagesInitialized.current) return;
    existingImagesInitialized.current = true;
    setExistingImages(
      car.images.map((img: any) => ({
        id: img.id,
        image_url: typeof img === "string" ? img : img.image_url,
        is_feature: img.is_featured ? "True" : "False",
        caption: img.caption || "",
      })),
    );
    const featured = car.images.find((img: any) => img.is_featured) as any;
    if (featured) {
      setFeaturedSource("existing");
      setFeaturedExistingId(featured.id);
    }
  }, [car]);

  // Resolve model_ref by name once models are loaded for the current make
  useEffect(() => {
    if (!car || !models.length) return;
    const resolvedModel = models.find((m) => m.name === car.model);
    if (resolvedModel) {
      setFormData((prev) => ({
        ...prev,
        model: resolvedModel.name,
        model_ref: resolvedModel.id,
      }));
    }
  }, [models, car]);

  const handleFieldChange = (field: keyof CarFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: keyof CarFormData) => {
    setFormData((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles = Array.from(items)
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (imageFiles.length === 0) return;
      const newImages: CarImage[] = imageFiles.map((file) => ({
        image_file: URL.createObjectURL(file),
        is_feature: "False",
        caption: "Pasted image",
        file,
      }));
      setFormData((prev) => ({
        ...prev,
        uploaded_images: [...prev.uploaded_images, ...newImages],
      }));
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newImages: CarImage[] = files
      .filter((file): file is File => file instanceof File)
      .map((file, index) => ({
        image_file: URL.createObjectURL(file),
        is_feature: "False",
        caption: formData.description || "Caption",
        file: file,
      }));

    setFormData((prev) => ({
      ...prev,
      uploaded_images: [...prev.uploaded_images, ...newImages],
    }));
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.uploaded_images.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, uploaded_images: updatedImages }));
    if (featuredSource === "new") {
      if (index === featuredImageIndex) {
        setFeaturedSource("existing");
        setFeaturedExistingId(existingImages[0]?.id ?? null);
        setFeaturedImageIndex(-1);
      } else if (index < featuredImageIndex) {
        setFeaturedImageIndex(featuredImageIndex - 1);
      }
    }
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
    if (featuredExistingId === imageId) {
      setFeaturedSource("new");
      setFeaturedExistingId(null);
      setFeaturedImageIndex(0);
    }
  };

  const setFeaturedNewImage = (index: number) => {
    setFeaturedSource("new");
    setFeaturedExistingId(null);
    setFeaturedImageIndex(index);
  };

  const setFeaturedExistingImage = (imageId: number) => {
    setFeaturedSource("existing");
    setFeaturedExistingId(imageId);
    setFeaturedImageIndex(-1);
  };

  const handleMakeSelect = async (makeId: number) => {
    const selectedMake = makes.find((m) => m.id === makeId);
    if (selectedMake) {
      setFormData((prev) => ({
        ...prev,
        make: selectedMake.name,
        make_ref: makeId,
        model: "",
        model_ref: 0,
      }));
      await fetchModels(makeId);
    }
  };

  const handleModelSelect = (modelId: number) => {
    const selectedModel = models.find((m) => m.id === modelId);
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        model: selectedModel.name,
        model_ref: modelId,
      }));
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteCar(id);
        toast({ title: "Deleted", description: "Car listing removed." });
        router.push("/listing");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealer?.id) {
      toast({
        title: "Error",
        description: "Dealer info missing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const carData = new FormData();
      carData.append("dealer", dealer.id.toString());
      carData.append("make", formData.make);
      carData.append("model", formData.model);
      if (formData.make_ref)
        carData.append("make_ref", formData.make_ref.toString());
      if (formData.model_ref)
        carData.append("model_ref", formData.model_ref.toString());
      carData.append("year", formData.year.toString());
      carData.append("price", formData.price);
      carData.append("mileage", formData.mileage.toString());
      carData.append("fuel_type", formData.fuel_type);
      carData.append("body_type", formData.body_type);
      carData.append("exterior_color", formData.exterior_color);
      carData.append("interior_color", formData.interior_color);
      carData.append("engine", formData.engine);
      carData.append("drivetrain", formData.drivetrain);
      carData.append("condition", formData.condition);
      carData.append("trim", formData.trim || "");
      carData.append("description", formData.description || "");
      carData.append("status", formData.status);
      carData.append("sale_type", formData.sale_type);
      carData.append("auction_end", formData.auction_end || "");
      carData.append("priority", formData.priority.toString());
      carData.append("location", formData.location || "");

      const booleanFeatures = Object.values(featureCategories).flat();
      booleanFeatures.forEach((feature) => {
        const value = formData[feature as keyof CarFormData];
        carData.append(feature, (value ?? false).toString());
      });

      // Deleted images
      deletedImageIds.forEach((id, index) => {
        carData.append(`delete_images[${index}]`, String(id));
      });

      // Existing images: send IDs so the backend preserves them
      existingImages.forEach((image, index) => {
        carData.append(`uploaded_images[${index}].id`, String(image.id));
        const isFeatured =
          featuredSource === "existing" && featuredExistingId === image.id;
        carData.append(
          `uploaded_images[${index}].is_featured`,
          isFeatured ? "True" : "False",
        );
      });

      // New uploads: append after existing
      formData.uploaded_images.forEach((image, index) => {
        if (image.file) {
          const globalIndex = existingImages.length + index;
          carData.append(
            `uploaded_images[${globalIndex}].image_file`,
            image.file,
          );
          const isFeatured =
            featuredSource === "new" && index === featuredImageIndex;
          carData.append(
            `uploaded_images[${globalIndex}].is_featured`,
            isFeatured ? "True" : "False",
          );
          carData.append(
            `uploaded_images[${globalIndex}].caption`,
            image.caption || "Image",
          );
        }
      });

      // Special: Append inspection data to description if backend lacks fields
      if (formData.inspection_notes || formData.engine_condition !== "Good") {
        const inspectionReport = `\n\n--- INSPECTION REPORT ---\nEngine: ${formData.engine_condition}\nTransmission: ${formData.transmission_condition}\nExterior: ${formData.exterior_condition}\nInterior: ${formData.interior_condition}\nNotes: ${formData.inspection_notes}`;
        carData.set(
          "description",
          (formData.description || "") + inspectionReport,
        );
      }

      await updateCar(id, carData);
      toast({
        title: "Success",
        description: "Listing updated!",
        variant: "success",
      });
      router.push(`/listing/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Update failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const fuelTypes = ["electric", "hybrid", "petrol", "diesel"];
  const bodyTypes = [
    "sedan",
    "suv",
    "truck",
    "coupe",
    "hatchback",
    "convertible",
    "wagon",
    "van",
    "other",
  ];
  const drivetrains = ["fwd", "rwd", "awd", "4wd"];
  const conditionLevels = ["Excellent", "Good", "Fair", "Poor", "Needs Repair"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Edit Car Listing</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full shadow-lg h-9"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Photos Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" /> Photos & Media
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Existing images from server */}
              {existingImages.map((image) => (
                <div
                  key={`existing-${image.id}`}
                  className="relative group aspect-[4/3] rounded-xl overflow-hidden border bg-gray-50"
                >
                  <img
                    src={image.image_url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-900 p-1.5 rounded-lg shadow-sm transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <Checkbox
                      checked={
                        featuredSource === "existing" &&
                        featuredExistingId === image.id
                      }
                      onCheckedChange={() => setFeaturedExistingImage(image.id)}
                      className="bg-white/90 border-2 border-gray-400"
                    />
                  </div>
                  {featuredSource === "existing" &&
                    featuredExistingId === image.id && (
                      <Badge className="absolute top-2 left-2 bg-primary/90">
                        Main
                      </Badge>
                    )}
                </div>
              ))}
              {/* New uploads */}
              {formData.uploaded_images.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group aspect-[4/3] rounded-xl overflow-hidden border bg-gray-50"
                >
                  <img
                    src={image.image_file}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-900 p-1.5 rounded-lg shadow-sm transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <Checkbox
                      checked={
                        featuredSource === "new" && featuredImageIndex === index
                      }
                      onCheckedChange={() => setFeaturedNewImage(index)}
                      className="bg-white/90 border-2 border-gray-400"
                    />
                  </div>
                  {featuredSource === "new" && featuredImageIndex === index && (
                    <Badge className="absolute top-2 left-2 bg-primary/90">
                      Main
                    </Badge>
                  )}
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center aspect-[4/3] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary">
                <Plus className="h-8 w-8" />
                <span className="text-xs font-medium mt-2">Add Photo</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Tip: You can paste images directly with{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs font-mono">
                Ctrl+V
              </kbd>{" "}
              /{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs font-mono">
                ⌘V
              </kbd>
            </p>
          </section>

          {/* Core Info */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Core Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Make</Label>
                <Select
                  value={formData.make_ref?.toString()}
                  onValueChange={(val) => handleMakeSelect(parseInt(val))}
                >
                  <SelectTrigger className="h-11 bg-gray-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={formData.model_ref?.toString()}
                  onValueChange={(val) => handleModelSelect(parseInt(val))}
                  disabled={!formData.make_ref}
                >
                  <SelectTrigger className="h-11 bg-gray-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models
                      .filter(
                        (m) =>
                          !formData.make_ref || m.make_id === formData.make_ref,
                      )
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (ETB)</Label>
                <Input
                  className="h-11 bg-gray-50/50"
                  value={formData.price}
                  onChange={(e) => handleFieldChange("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  className="h-11 bg-gray-50/50"
                  value={formData.year}
                  onChange={(e) =>
                    handleFieldChange("year", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Mileage (km)</Label>
                <Input
                  type="number"
                  className="h-11 bg-gray-50/50"
                  value={formData.mileage}
                  onChange={(e) =>
                    handleFieldChange("mileage", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select
                  value={formData.fuel_type}
                  onValueChange={(v) => handleFieldChange("fuel_type", v)}
                >
                  <SelectTrigger className="h-11 bg-gray-50/50 capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((f) => (
                      <SelectItem key={f} value={f} className="capitalize">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Type</Label>
                <Select
                  value={formData.body_type}
                  onValueChange={(v) => handleFieldChange("body_type", v)}
                >
                  <SelectTrigger className="h-11 bg-gray-50/50 capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((b) => (
                      <SelectItem key={b} value={b} className="capitalize">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Drivetrain</Label>
                <Select
                  value={formData.drivetrain}
                  onValueChange={(v) => handleFieldChange("drivetrain", v)}
                >
                  <SelectTrigger className="h-11 bg-gray-50/50 uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {drivetrains.map((d) => (
                      <SelectItem key={d} value={d} className="uppercase">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Car Features</h2>
            <div className="space-y-8">
              {Object.entries(featureCategories).map(([category, features]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Checkbox
                          id={feature}
                          checked={
                            formData[feature as keyof CarFormData] as boolean
                          }
                          onCheckedChange={() =>
                            handleFeatureToggle(feature as keyof CarFormData)
                          }
                        />
                        <Label
                          htmlFor={feature}
                          className="text-sm cursor-pointer capitalize"
                        >
                          {feature.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 font-heading">
              Public Description
            </h2>
            <Textarea
              rows={6}
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
          </section>
        </div>

        {/* Right Column: Inspection Section */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-2xl shadow-lg border-2 border-primary/20 sticky top-24">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Inspection</h2>
                  <p className="text-xs text-muted-foreground">
                    Internal Report
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Engine Condition", field: "engine_condition" },
                  { label: "Transmission", field: "transmission_condition" },
                  { label: "Exterior Body", field: "exterior_condition" },
                  { label: "Interior", field: "interior_condition" },
                  { label: "Tires & Wheels", field: "tires_condition" },
                  { label: "Brakes System", field: "brakes_condition" },
                ].map((item) => (
                  <div key={item.field} className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-gray-500">
                      {item.label}
                    </Label>
                    <Select
                      value={
                        formData[item.field as keyof CarFormData] as string
                      }
                      onValueChange={(v) =>
                        handleFieldChange(item.field as keyof CarFormData, v)
                      }
                    >
                      <SelectTrigger className="h-10 bg-gray-50 hover:bg-gray-100 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionLevels.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="space-y-2 pt-2">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">
                    Inspection Notes
                  </Label>
                  <Textarea
                    className="bg-gray-50 border-none py-3 min-h-[120px]"
                    placeholder="Detail any defects, wear, or upcoming maintenance needs..."
                    value={formData.inspection_notes}
                    onChange={(e) =>
                      handleFieldChange("inspection_notes", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current Status</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100 h-5"
                  >
                    {formData.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-medium">
                    {formData.priority ? "High" : "Normal"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
