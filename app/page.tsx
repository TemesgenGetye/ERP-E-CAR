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

export default function page() {
  const metrics = [
    {
      title: "Total Cars",
      value: "5056",
      change: "+8.04%",
      positive: true,
      icon: CarFront,
      comparison: "vs last week",
    },
    // {
    //   title: "Total Users",
    //   value: "128",
    //   change: "-3.06%",
    //   positive: false,
    //   icon: Users,
    //   comparison: "vs last week",
    // },
    {
      title: "Total Sold Cars",
      value: "84",
      change: "+8.04%",
      positive: true,
      icon: Car,
      comparison: "vs last week",
    },
    {
      title: "Total Profit",
      value: "600,543,000",
      change: "+8.04%",
      positive: true,
      icon: DollarSign,
      comparison: "vs last week",
    },
  ];

  const salesData = [
    { month: "Jan", sales: 45, revenue: 1250000 },
    { month: "Feb", sales: 52, revenue: 1450000 },
    { month: "Mar", sales: 48, revenue: 1320000 },
    { month: "Apr", sales: 61, revenue: 1680000 },
    { month: "May", sales: 55, revenue: 1520000 },
    { month: "Jun", sales: 67, revenue: 1850000 },
  ];

  const customerData = [
    { segment: "Volkswagen", value: 35, color: "silver" },
    { segment: "BYD", value: 45, color: "black" },
    { segment: "Hyundai", value: 20, color: "#222" },
  ];

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
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`font-medium ${
                          metric.positive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {metric.change}
                      </span>
                      <span className="">{metric.comparison}</span>
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
                  <div className="relative mb-4">
                    <img
                      src="/id6-orange.png"
                      alt="Volkwagen ID6 Electric"
                      className="w-3/4 max-h-[225px] object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black rounded-full p-2">
                      <CarFront className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-black/70">Model</p>
                      <h3 className="font-semibold">Volkswagen ID6</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-black/70">Price</p>
                      <p className="font-semibold">5,000,000</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-black text-white rounded-full"
                    >
                      Vokswagen
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-black text-white rounded-full"
                    >
                      Smart AC
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-black text-white rounded-full"
                    >
                      Diesel
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-black text-white rounded-full"
                    >
                      Electric
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-black text-white rounded-full"
                    >
                      5
                    </Badge>
                  </div>
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

                  {[
                    {
                      name: "Volkswagen",
                      artist: "ID6",
                      album: "2023",
                      time: "5M",
                      img: "/id6-orange.png",
                    },
                    {
                      name: "BYD",
                      artist: "Song",
                      album: "2024",
                      time: "3.1M",
                      img: "/byd.png",
                    },
                    {
                      name: "Suzuki",
                      artist: "Dzire",
                      album: "2020",
                      time: "2.4M",
                      img: "/dzire.webp",
                    },
                    // {
                    //   name: "Toyota ",
                    //   artist: "Land Cruiser 70",
                    //   album: "2024",
                    //   time: "12M",
                    //   img: "/v8.png",
                    // },
                    {
                      name: "Jetour",
                      artist: "T1",
                      album: "2024",
                      time: "6M",
                      img: "/jetour.png",
                    },
                  ].map((car, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 py-2"
                    >
                      <span className="text-sm w-4">{index + 1}</span>
                      <Image
                        src={car.img}
                        alt={car.name + "-image"}
                        width={100}
                        height={100}
                        className="w-20 h-auto"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{car.name}</div>
                        <div className="text-xs text-gray-500">
                          {car.artist}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{car.album}</span>
                      <span className="text-sm text-gray-500">{car.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* New Inventory */}
          </div>
        </div>
      </div>
    </div>
  );
}
