"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Grid3X3,
  Calendar,
  Car,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useCarData } from "@/hooks/useCarData";
import { useUserRole } from "@/hooks/useUserRole";

const sidebarItems = [
  { icon: Grid3X3, label: "Dashboard", active: true },
  { icon: Car, label: "Listing", active: false },
  { icon: Calendar, label: "Calendar", active: false },
  { icon: TrendingUp, label: "Deals", active: false },
  { icon: Users, label: "Tracking", active: false },
  { icon: BarChart3, label: "Active Bids", active: false },
  { icon: BarChart3, label: "Statistics", active: false },
  { icon: TrendingUp, label: "Transaction", active: false },
];

const otherMenuItems = [
  { icon: Search, label: "Search" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help Center" },
];

export default function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const { cars, isLoading, error, fetchCars } = useCarData();
  const router = useRouter();
  const { role: userRole } = useUserRole();

  const getDisplayPrice = (car: any) => {
    if (car.sale_type === "auction" && car.bids && car.bids.length > 0) {
      const highestBid = Math.max(
        ...car.bids
          .map((b: any) => parseFloat(b.amount))
          .filter((n: number) => !Number.isNaN(n)),
      );
      return highestBid;
    }
    const priceValue =
      typeof car.price === "string" ? parseFloat(car.price) : Number(car.price);
    return Number.isNaN(priceValue) ? 0 : priceValue;
  };

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Posted Cars
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Manage your car posts &mdash; Add, edit and delete cars.
              </p>

              {userRole !== "dealer" && (
                <Link
                  href={"/listing/new"}
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground py-2 text-sm w-fit cursor-pointer flex gap-2 items-center px-3 rounded-full"
                >
                  <span>Add New</span>
                  <span className="group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Available Cars Section */}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading cars...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars?.map((car) => (
              <Card
                key={car?.id}
                className="bg-none shadow-none overflow-hidden hover:shadow-sm transition-shadow cursor-pointer relative"
                onClick={() => router.push(`/listing/${car.id}`)}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="absolute top-2 right-2 z-50 cursor-pointer "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer bg-white/80 hover:bg-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="">
                    <DropdownMenuItem
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/listing/${car.id}`);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/listing/${car.id}/edit`);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            "Are you sure you want to delete this listing?",
                          )
                        ) {
                          // TODO: Implement delete functionality
                        }
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative">
                  {/* Status Badges */}
                  <img
                    src={car.featured_image}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-48 object-contain"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {car.year} {car.make} {car.model}
                  </h3>

                  {/* Car Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Body:</span>
                      <span className="text-foreground capitalize">
                        {car.body_type}
                      </span>
                    </div>
                  </div>

                  {/* Sale Type */}
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {car.sale_type === "fixed_price"
                        ? "Fixed Price"
                        : car.sale_type === "auction"
                          ? "Auction"
                          : car.sale_type}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {getDisplayPrice(car).toLocaleString()} ETB
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && !error && cars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No cars posted yet</p>
              <Link href="/listing/new">
                <Button>Add Your First Car</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
