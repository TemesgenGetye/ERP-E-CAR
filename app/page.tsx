"use client";

import { useState } from "react";
import {
  Search,
  Settings,
  Bell,
  Filter,
  MoreHorizontal,
  Users,
  TrendingUp,
  Car,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Package,
  TestTube,
  Wrench,
  BarChart3,
  CreditCard,
  CarFront,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCarData } from "@/hooks/useCarData";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const salesData = [
    { month: "Jan", sales: 45, revenue: 1250000 },
    { month: "Feb", sales: 52, revenue: 1450000 },
    { month: "Mar", sales: 48, revenue: 1320000 },
    { month: "Apr", sales: 61, revenue: 1680000 },
    { month: "May", sales: 55, revenue: 1520000 },
    { month: "Jun", sales: 67, revenue: 1850000 },
  ];

  const {
    analytics,
    topSellers,
    highSaleCars,
    isLoading,
    error,
    getTopSellers,
    getHighSaleCars,
  } = useAnalytics();
  const { cars, fetchCars } = useCarData();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    getTopSellers();
    getHighSaleCars();
  }, [getTopSellers, getHighSaleCars]);

  const metrics = [
    {
      title: "Total Cars",
      value: analytics.dealerAnalytics?.total_cars.toString() || "0",
      positive: true,
      icon: CarFront,
      comparison: "vs last week",
    },
    {
      title: "Total Sold Cars",
      value: analytics.dealerAnalytics?.sold_cars.toString() || "0",
      positive: true,
      icon: Car,
      comparison: "vs last week",
    },
    {
      title: "Average Price",
      value: analytics.dealerAnalytics
        ? `$${analytics.dealerAnalytics.average_price.toLocaleString()}`
        : "$0",
      positive: true,
      icon: DollarSign,
      comparison: "vs last week",
    },
    {
      title: "Total Views",
      value: analytics.carViews
        .reduce((sum, car) => sum + car.total_views, 0)
        .toString(),
      positive: true,
      icon: TrendingUp,
      comparison: "vs last week",
    },
  ];

  const latestCar = cars.length > 0 ? cars[0] : null;

  const topCars = cars.slice(0, 4);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between w-full">
                      <span>{metric.title}</span>
                      <Icon className="w-6 h-6" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl font-bold">{metric.value}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sales & Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly sales volume and revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: { label: "Sales", color: "var(--chart-1)" },
                    revenue: { label: "Revenue", color: "var(--chart-2)" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="black" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Customer Segments */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Popular cars</CardTitle>
                <CardDescription>Distribution of popular cars</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    new: { label: "New Customers", color: "black" },
                    returning: { label: "Returning", color: "#222" },
                    referrals: { label: "Referrals", color: "#000" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        // fill="#8884d8"
                        dataKey="value"
                        label={({ segment, value }) => `${segment}: ${value}%`}
                      >
                        {customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card> */}

            <div className="h-full">
              {/* Latest Inventory */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Latest Inventory</CardTitle>
                  <Link
                    href={"/listing"}
                    className="group bg-zinc-800 hover:bg-zinc-900 text-white py-2 text-sm w-fit cursor-pointer flex gap-2 items-center px-3 rounded-full"
                  >
                    <span>View more</span>
                    <span className="group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </Link>
                </CardHeader>
                <CardContent>
                  {latestCar ? (
                    <>
                      <div
                        className="relative mb-4 cursor-pointer"
                        onClick={() => router.push(`/listing/${latestCar.id}`)}
                      >
                        <img
                          src={
                            latestCar.images && latestCar.images.length > 0
                              ? typeof latestCar.images[0] === "string"
                                ? latestCar.images[0]
                                : latestCar.images[0].image_url
                              : "/placeholder.svg"
                          }
                          alt={`${latestCar.year} ${latestCar.make} ${latestCar.model}`}
                          className="w-3/4 max-h-[225px] object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-black rounded-full p-2">
                          <CarFront className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-black/70">Model</p>
                          <h3 className="font-semibold">
                            {latestCar.year} {latestCar.make} {latestCar.model}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-black/70">Price</p>
                          <p className="font-semibold">
                            $
                            {parseFloat(
                              typeof latestCar.price === "string"
                                ? latestCar.price
                                : String(latestCar.price)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-black text-white rounded-full"
                        >
                          {latestCar.make}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-black text-white rounded-full capitalize"
                        >
                          {latestCar.body_type}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-black text-white rounded-full capitalize"
                        >
                          {latestCar.fuel_type}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-black text-white rounded-full uppercase"
                        >
                          {latestCar.drivetrain}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-black text-white rounded-full capitalize"
                        >
                          {latestCar.condition}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No cars in inventory yet
                      </p>
                      <Link href="/listing/new">
                        <Button>Add Your First Car</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Top selling cars */}
            <div className="h-full">
              <Card className="p-10 shadow-none h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Cars</h3>
                  {/* <div className="flex space-x-2 text-sm ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-black/70 cursor-pointer rounded-full bg-gray-100"
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 cursor-pointer rounded-full"
                    >
                      Week
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 cursor-pointer rounded-full"
                    >
                      Month
                    </Button>
                  </div> */}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 w-4">#</span>
                    <span className="text-sm text-gray-500 flex-1">
                      Make/model
                    </span>
                    <span className="text-sm text-gray-500">Year</span>
                    <span className="text-sm text-gray-500">Price</span>
                  </div>

                  {topCars.length > 0 ? (
                    topCars.map((car, index) => (
                      <div
                        key={car.id}
                        className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => router.push(`/listing/${car.id}`)}
                      >
                        <span className="text-sm w-4">{index + 1}</span>
                        <img
                          src={
                            car.images && car.images.length > 0
                              ? typeof car.images[0] === "string"
                                ? car.images[0]
                                : car.images[0].image_url
                              : "/placeholder.svg"
                          }
                          alt={`${car.make} ${car.model}`}
                          className="w-20 h-auto object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{car.make}</div>
                          <div className="text-xs text-gray-500">
                            {car.model}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {car.year}
                        </span>
                        <span className="text-sm text-gray-500">
                          $
                          {parseFloat(
                            typeof car.price === "string"
                              ? car.price
                              : String(car.price)
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No cars yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Top Sellers Section */}
            <div className="h-full">
              <Card className="p-6 shadow-none h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Top Sellers</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 w-4">#</span>
                    <span className="text-sm text-gray-500 flex-1">Email</span>
                    <span className="text-sm text-gray-500">Sales</span>
                    <span className="text-sm text-gray-500">Month/Year</span>
                  </div>

                  {topSellers.length > 0 ? (
                    topSellers.map((seller, index) => (
                      <div
                        key={`${seller.user_email}-${index}`}
                        className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-sm w-4">{index + 1}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {seller.user_email}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {seller.total_sales}
                        </span>
                        <span className="text-sm text-gray-500">
                          {seller.month}/{seller.year}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No top sellers data yet
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* High Sale Cars Section */}
          <div className="mt-6">
            <Card className="p-6 shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">High Sale Cars</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 w-4">#</span>
                  <span className="text-sm text-gray-500 flex-1">
                    Car Details
                  </span>
                  <span className="text-sm text-gray-500">Sale Count</span>
                  <span className="text-sm text-gray-500">Month/Year</span>
                </div>

                {highSaleCars.length > 0 ? (
                  highSaleCars.map((car, index) => (
                    <div
                      key={`${car.car_details}-${index}`}
                      className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-sm w-4">{index + 1}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {car.car_details}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {car.sale_count}
                      </span>
                      <span className="text-sm text-gray-500">
                        {car.month}/{car.year}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No high sale cars data yet
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
