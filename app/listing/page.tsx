"use client";

import { useState } from "react";
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

const cars = [
  {
    id: 1,
    name: "Volkswagen ID6",
    style: "Volkswagen",
    type: "Auto",
    color: "Orange",
    price: "285,892",
    image: "/id6-orange.png",
  },
  {
    id: 2,
    name: "Suzuki Dzire",
    style: "Dzire",
    type: "Petrol",
    color: "Dark Blue",
    price: "358,174",
    image: "/dzire.webp",
  },
  {
    id: 3,
    name: "Toyota V8",
    style: "V8",
    type: "Petrol",
    color: "Blue Black",
    price: "358,174",
    image: "/v8.png",
  },
  {
    id: 4,
    name: "BYD-Song",
    style: "Song",
    type: "Auto",
    color: "brown",
    price: "285,892",
    image: "/byd.png",
  },
  {
    id: 5,
    name: "Toyota Invincible",
    style: "Invincible",
    type: "Auto",
    color: "Brown",
    price: "425,000",
    image: "/invincible.png",
  },
  {
    id: 6,
    name: "Jetour-T1",
    style: "T1",
    type: "Auto",
    color: "Green",
    price: "195,500",
    image: "/jetour.png",
  },
];

export default function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
              <Link
                href={"/listing/new"}
                className="group bg-zinc-800 hover:bg-zinc-900 text-white py-2 text-sm w-fit cursor-pointer flex gap-2 items-center px-3 rounded-full"
              >
                <span>Add New</span>
                <span className="group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Available Cars Section */}

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <Card
                key={car.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-flow relative"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="absolute top-2 right-2 z-50 cursor-pointer "
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="">
                    <DropdownMenuItem
                      className=""
                      onClick={() => router.push(`/listing/${car.id}`)}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="">Export</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative">
                  {/* ✅ Status Badge */}
                  <div className="absolute top-2 left-2 z-50">
                    {index % 2 === 0 ? (
                      <Badge className="bg-green-300 text-green-700 rounded-full">
                        Live
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-300 text-yellow-700 rounded-full">
                        Pending Review
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      className="w-1/2 h-auto object-cover"
                    />
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-3">{car.name}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>
                      Style:{" "}
                      <span className="text-foreground">{car.style}</span>
                    </span>
                    <span>
                      Type: <span className="text-foreground">{car.type}</span>
                    </span>
                    <span>
                      Color:{" "}
                      <span className="text-foreground">{car.color}</span>
                    </span>
                  </div>
                  <div className="text-2xl font-bold">$ {car.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
