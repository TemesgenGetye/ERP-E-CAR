"use client";

import { ArrowLeft, X, Plus, Check, Camera } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCarData } from "@/hooks/useCarData";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Car } from "@/types";

// Image interface
interface CarImage {
  image_file: string;
  is_feature: string;
  caption: string;
  file?: File; // Store the actual file object
}

// Form data interface matching API schema
interface CarFormData {
  dealer: number;
  broker: number | null;
  uploaded_images: CarImage[];
  make_ref: number;
  model_ref: number;
  make: string;
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
}

const getInitialFormData = (): CarFormData => ({
  dealer: 0,
  broker: null,
  uploaded_images: [],
  make_ref: 0,
  model_ref: 0,
  make: "",
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
});

export default function PostCarScreen() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<CarFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    dealer,
    getDealer,
    isLoading: isLoadingDealer,
    error: errorDealer,
  } = useProfile();

  const { makes, models, fetchMakes, fetchModels, postCar, isLoading } =
    useCarData();

  useEffect(() => {
    fetchMakes();
    if (!dealer) {
      getDealer();
    }
  }, []);

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

  const exteriorColors = [
    "black",
    "white",
    "red",
    "blue",
    "silver",
    "gray",
    "green",
    "yellow",
    "other",
  ];

  const interiorColors = ["black", "beige", "gray", "brown", "white", "other"];

  const fuelTypes: Array<"electric" | "hybrid" | "petrol" | "diesel"> = [
    "electric",
    "hybrid",
    "petrol",
    "diesel",
  ];

  const bodyTypes: Array<
    | "sedan"
    | "suv"
    | "truck"
    | "coupe"
    | "hatchback"
    | "convertible"
    | "wagon"
    | "van"
    | "other"
  > = [
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

  const drivetrainOptions: Array<"fwd" | "rwd" | "awd" | "4wd"> = [
    "fwd",
    "rwd",
    "awd",
    "4wd",
  ];

  const conditionOptions: Array<"new" | "used"> = ["new", "used"];

  const statusOptions: Array<
    | "available"
    | "reserved"
    | "sold"
    | "pending_inspection"
    | "under_maintenance"
    | "delivered"
    | "archived"
  > = [
    "available",
    "reserved",
    "sold",
    "pending_inspection",
    "under_maintenance",
    "delivered",
    "archived",
  ];

  const saleTypes: Array<"fixed_price" | "auction"> = [
    "fixed_price",
    "auction",
  ];

  const handleFieldChange = (field: keyof CarFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: keyof CarFormData) => {
    setFormData((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newImages: CarImage[] = files.map((file, index) => ({
      image_file: URL.createObjectURL(file),
      is_feature:
        formData.uploaded_images.length === 0 && index === 0 ? "True" : "False",
      caption: formData.description || "Caption",
      file: file, // Store the actual file object
    }));

    setFormData((prev) => ({
      ...prev,
      uploaded_images: [...prev.uploaded_images, ...newImages],
    }));
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.uploaded_images.filter(
      (_, i) => i !== index
    );

    if (
      formData.uploaded_images[index]?.is_feature === "True" &&
      updatedImages.length > 0
    ) {
      updatedImages[0].is_feature = "True";
    }

    setFormData((prev) => ({
      ...prev,
      uploaded_images: updatedImages,
    }));
  };

  const handleMakeSelect = async (makeId: number) => {
    const selectedMake = makes.find((m) => m.id === makeId);
    if (selectedMake) {
      setSelectedMakeId(makeId);
      setFormData((prev) => ({
        ...prev,
        make: selectedMake.name,
        make_ref: makeId,
        model: "",
        model_ref: 0,
      }));
      setSelectedModelId(null);
      await fetchModels(makeId);
    }
  };

  const handleModelSelect = (modelId: number) => {
    const selectedModel = models.find((m) => m.id === modelId);
    if (selectedModel) {
      setSelectedModelId(modelId);
      setFormData((prev) => ({
        ...prev,
        model: selectedModel.name,
        model_ref: modelId,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dealer) {
      toast({
        title: "Error",
        description: "Dealer information not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const carData = new FormData();

      // Add basic fields
      carData.append("dealer", dealer.id.toString());
      carData.append("make", formData.make);
      carData.append("model", formData.model);
      carData.append("make_ref", formData.make_ref.toString());
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

      // Add all boolean features
      const booleanFeatures = [
        "bluetooth",
        "heated_seats",
        "cd_player",
        "power_locks",
        "premium_wheels_rims",
        "winch",
        "alarm_anti_theft",
        "cooled_seats",
        "keyless_start",
        "body_kit",
        "navigation_system",
        "premium_lights",
        "cassette_player",
        "fog_lights",
        "leather_seats",
        "roof_rack",
        "dvd_player",
        "power_mirrors",
        "power_sunroof",
        "aux_audio_in",
        "brush_guard",
        "air_conditioning",
        "performance_tyres",
        "premium_sound_system",
        "heat",
        "vhs_player",
        "off_road_kit",
        "am_fm_radio",
        "moonroof",
        "racing_seats",
        "premium_paint",
        "spoiler",
        "power_windows",
        "sunroof",
        "climate_control",
        "parking_sensors",
        "rear_view_camera",
        "keyless_entry",
        "off_road_tyres",
        "satellite_radio",
        "power_seats",
        "tiptronic_gears",
        "dual_exhaust",
        "power_steering",
        "cruise_control",
        "all_wheel_steering",
        "front_airbags",
        "side_airbags",
        "n2o_system",
        "anti_lock_brakes",
      ];

      booleanFeatures.forEach((feature) => {
        const value = formData[feature as keyof CarFormData];
        carData.append(
          feature,
          value !== null && value !== undefined ? value.toString() : "false"
        );
      });

      // Add images with metadata
      formData.uploaded_images.forEach((image, index) => {
        if (image.file) {
          carData.append(`uploaded_images[${index}].image_file`, image.file);
          carData.append(
            `uploaded_images[${index}].is_featured`,
            image.is_feature
          );
          carData.append(`uploaded_images[${index}].caption`, image.caption);
        }
      });

      // Console log for debugging (FormData content)
      console.log("=== POSTING CAR DATA ===");
      console.log("Dealer ID:", dealer.id);
      console.log("Images count:", formData.uploaded_images.length);
      console.log("========================");

      const res = await postCar(carData);
      console.log("Response from car post:", res);

      toast({
        title: "Success",
        description: "Your car has been posted successfully!",
      });
      router.push("/listing");
    } catch (error) {
      console.error("Error posting car:", error);
      toast({
        title: "Error",
        description: "Failed to post car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredModels = selectedMakeId
    ? models.filter((model) => model.make && model.make.id === selectedMakeId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/listing">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Post Your Car</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full"
          >
            {isSubmitting ? "Posting..." : "Post Car for Sale"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Basic Information */}
        <section className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-black rounded border-2 border-black mr-3 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <Label className="mb-2">
                Make <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => handleMakeSelect(parseInt(val))}
                value={selectedMakeId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make.id} value={make.id.toString()}>
                      {make.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div>
              <Label className="mb-2">
                Model <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => handleModelSelect(parseInt(val))}
                value={selectedModelId?.toString()}
                disabled={!selectedMakeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <Label className="mb-2">
                Year <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="2023"
                value={formData.year}
                onChange={(e) =>
                  handleFieldChange("year", parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Price */}
            <div>
              <Label className="mb-2">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="65000"
                value={formData.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
              />
            </div>

            {/* Mileage */}
            <div>
              <Label className="mb-2">Mileage</Label>
              <Input
                type="number"
                placeholder="15000"
                value={formData.mileage}
                onChange={(e) =>
                  handleFieldChange("mileage", parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Exterior Color */}
            <div>
              <Label className="mb-2">
                Exterior Color <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange("exterior_color", val)
                }
                value={formData.exterior_color}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {exteriorColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interior Color */}
            <div>
              <Label className="mb-2">
                Interior Color <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange("interior_color", val)
                }
                value={formData.interior_color}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {interiorColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Engine */}
            <div>
              <Label className="mb-2">
                Engine <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="3.0L V6"
                value={formData.engine}
                onChange={(e) => handleFieldChange("engine", e.target.value)}
              />
            </div>

            {/* Body Type */}
            <div>
              <Label className="mb-2">
                Body Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange(
                    "body_type",
                    val as CarFormData["body_type"]
                  )
                }
                value={formData.body_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Drivetrain */}
            <div>
              <Label className="mb-2">
                Drivetrain <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange(
                    "drivetrain",
                    val as CarFormData["drivetrain"]
                  )
                }
                value={formData.drivetrain}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Drivetrain" />
                </SelectTrigger>
                <SelectContent>
                  {drivetrainOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <Label className="mb-2">Location</Label>
              <Input
                placeholder="New York, NY"
                value={formData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <Label className="mb-2">
                Fuel Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange(
                    "fuel_type",
                    val as CarFormData["fuel_type"]
                  )
                }
                value={formData.fuel_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sale Type */}
            <div>
              <Label className="mb-2">
                Sale Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  handleFieldChange(
                    "sale_type",
                    val as CarFormData["sale_type"]
                  )
                }
                value={formData.sale_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sale Type" />
                </SelectTrigger>
                <SelectContent>
                  {saleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auction End Date */}
            {formData.sale_type === "auction" && (
              <div>
                <Label className="mb-2">Auction End Date</Label>
                <Input
                  type="date"
                  value={formData.auction_end}
                  onChange={(e) =>
                    handleFieldChange("auction_end", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-black rounded border-2 border-black mr-3 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold">Photos</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {formData.uploaded_images.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={image.image_file}
                  alt={`car-${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                {image.is_feature === "True" && (
                  <div className="absolute -top-1 -left-1 bg-blue-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <Camera className="h-7 w-7 text-gray-400" />
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

        {/* Features */}
        <section className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-black rounded border-2 border-black mr-3 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold">Features</h2>
          </div>

          {Object.entries(featureCategories).map(([category, features]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={
                        formData[feature as keyof CarFormData] as boolean
                      }
                      onCheckedChange={() =>
                        handleFeatureToggle(feature as keyof CarFormData)
                      }
                    />
                    <Label htmlFor={feature} className="cursor-pointer">
                      {feature
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Description */}
        <section className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-black rounded border-2 border-black mr-3 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold">Description</h2>
          </div>
          <Textarea
            placeholder="Describe your car's condition, history, and any special features..."
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            rows={6}
          />
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="rounded-full px-8"
          >
            {isSubmitting ? "Posting..." : "Post Car for Sale"}
          </Button>
        </div>
      </form>
    </div>
  );
}
