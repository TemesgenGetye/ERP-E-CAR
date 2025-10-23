"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Eye, Heart, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarData } from "@/hooks/useCarData";
import { useParams, useRouter } from "next/navigation";

// Mock user interactions data - TODO: Replace with actual API data
const mockUserInteractions = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    initials: "JS",
    status: "contacted",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    initials: "SJ",
    status: "contacted",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 345-6789",
    initials: "MB",
    status: "Not contacted",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    initials: "ED",
    status: "Not contacted",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "+1 (555) 567-8901",
    initials: "DW",
    status: "Not contacted",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 (555) 678-9012",
    initials: "LA",
    status: "Not contacted",
  },
];

const getAvatarColor = (initials: string) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { car, isLoading, error, fetchCarById } = useCarData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [userStatuses, setUserStatuses] = useState(
    mockUserInteractions.reduce((acc, user) => {
      acc[user.id] = user.status;
      return acc;
    }, {} as Record<number, string>)
  );

  useEffect(() => {
    if (params.id) {
      fetchCarById(params.id as string);
    }
  }, [params.id, fetchCarById]);

  useEffect(() => {
    if (car?.images && car.images.length > 0) {
      setSelectedImage(0);
    }
  }, [car]);

  const displayedUsers = showAllUsers
    ? mockUserInteractions
    : mockUserInteractions.slice(0, 3);

  const handleStatusChange = (userId: number, newStatus: string) => {
    setUserStatuses((prev) => ({ ...prev, [userId]: newStatus }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading car details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push("/listing")}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Car not found</p>
      </div>
    );
  }

  const getImageUrl = (index: number) => {
    if (!car.images || car.images.length === 0) return "/placeholder.svg";
    const image = car.images[index];
    return typeof image === "string" ? image : image.image_url;
  };

  // Get features that are enabled
  const getEnabledFeatures = () => {
    const features: { name: string; value: boolean }[] = [
      { name: "Air Conditioning", value: car.air_conditioning },
      { name: "Bluetooth", value: car.bluetooth },
      { name: "Leather Seats", value: car.leather_seats },
      { name: "Heated Seats", value: car.heated_seats },
      { name: "Navigation System", value: car.navigation_system },
      { name: "Rear View Camera", value: car.rear_view_camera },
      { name: "Sunroof", value: car.sunroof },
      { name: "Moonroof", value: car.moonroof },
      { name: "Cruise Control", value: car.cruise_control },
      { name: "Keyless Entry", value: car.keyless_entry },
      { name: "Keyless Start", value: car.keyless_start },
      { name: "Power Windows", value: car.power_windows },
      { name: "Power Locks", value: car.power_locks },
      { name: "Power Seats", value: car.power_seats },
      { name: "Power Steering", value: car.power_steering },
      { name: "Premium Sound System", value: car.premium_sound_system },
      { name: "Premium Wheels/Rims", value: car.premium_wheels_rims },
      { name: "Anti-lock Brakes", value: car.anti_lock_brakes },
      { name: "Front Airbags", value: car.front_airbags },
      { name: "Side Airbags", value: car.side_airbags },
      { name: "Parking Sensors", value: car.parking_sensors },
      { name: "All Wheel Steering", value: car.all_wheel_steering },
    ];
    return features.filter((f) => f.value);
  };

  return (
    <div className="">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 bg-gray-100 cursor-pointer"
            onClick={() => router.push("/listing")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push(`/listing/${car.id}/edit`)}
            >
              Edit Post
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (confirm("Are you sure you want to delete this listing?")) {
                  // TODO: Implement delete functionality
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Car Images and Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h1>
                      {car.verification_status === "verified" && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {car.verification_status === "pending" && (
                        <Badge className="bg-yellow-500 text-white">
                          Pending Review
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`${
                          car.status === "available"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : car.status === "sold"
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {car.status.charAt(0).toUpperCase() +
                          car.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {car.condition}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-primary mt-2">
                      $
                      {parseFloat(
                        typeof car.price === "string"
                          ? car.price
                          : String(car.price)
                      ).toLocaleString()}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {car.sale_type === "fixed_price"
                        ? "Fixed Price"
                        : "Auction"}
                    </Badge>
                  </div>
                </div>

                {/* Main Car Image */}
                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                  <img
                    src={getImageUrl(selectedImage)}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Image Thumbnails */}
                {car.images && car.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {car.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
                        } hover:border-primary transition-colors`}
                      >
                        <img
                          src={typeof img === "string" ? img : img.image_url}
                          alt={`View ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="font-medium">{car.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Body Type</p>
                    <p className="font-medium capitalize">{car.body_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">
                      {car.mileage.toLocaleString()} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Type</p>
                    <p className="font-medium capitalize">{car.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Drivetrain</p>
                    <p className="font-medium uppercase">{car.drivetrain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engine</p>
                    <p className="font-medium">{car.engine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Exterior Color
                    </p>
                    <p className="font-medium capitalize flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: car.exterior_color }}
                      />
                      {car.exterior_color}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Interior Color
                    </p>
                    <p className="font-medium capitalize">
                      {car.interior_color}
                    </p>
                  </div>
                  {car.trim && (
                    <div>
                      <p className="text-sm text-muted-foreground">Trim</p>
                      <p className="font-medium">{car.trim}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {car.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Description
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {car.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Features & Options
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getEnabledFeatures().map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
                {getEnabledFeatures().length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No additional features listed
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Analytics and Info */}
          <div className="space-y-6">
            {/* Analytics */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Analytics
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {/* Mock data - replace with actual analytics */}0
                      </div>
                      <div className="text-sm text-gray-600">Visitors</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {/* Mock data - replace with actual analytics */}0
                      </div>
                      <div className="text-sm text-gray-600">Favorited</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listing Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Listing Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Posted</p>
                    <p className="font-medium">
                      {new Date(car.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(car.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <p className="font-medium">
                      {car.priority ? "High" : "Normal"}
                    </p>
                  </div>
                  {car.dealer_average_rating && (
                    <div>
                      <p className="text-muted-foreground">Dealer Rating</p>
                      <p className="font-medium">
                        {car.dealer_average_rating.toFixed(1)} / 5.0
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bids (for auction type) */}
            {car.sale_type === "auction" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Auction Bids
                  </h2>
                  {car.bids && car.bids.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {car.bids.length} bid(s) received
                      </p>
                      {car.auction_end && (
                        <p className="text-sm text-muted-foreground">
                          Ends: {new Date(car.auction_end).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No bids yet</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* User Interactions Section */}
        <Card className="mx-6 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User Interactions
            </h2>

            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-1">
                  <Checkbox />
                </div>
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email address</div>
                <div className="col-span-2">Phone</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {displayedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-1">
                      <Checkbox />
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(
                          user.initials
                        )}`}
                      >
                        {user.initials}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                    <div className="col-span-3 text-gray-600">{user.email}</div>
                    <div className="col-span-2 text-gray-600">{user.phone}</div>
                    <div className="col-span-2">
                      <Select
                        value={userStatuses[user.id]}
                        onValueChange={(value) =>
                          handleStatusChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="Not contacted">
                            Not Contacted
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!showAllUsers && mockUserInteractions.length > 3 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllUsers(true)}
                  className="w-fit shadow-none border-none bg-gray-100 cursor-pointer"
                >
                  Show More ({mockUserInteractions.length - 3} more users)
                </Button>
              </div>
            )}

            {showAllUsers && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllUsers(false)}
                  className="w-fit shadow-none border-none bg-gray-100 cursor-pointer"
                >
                  Show Less
                </Button>
              </div>
            )}

            {mockUserInteractions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No user interactions yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
