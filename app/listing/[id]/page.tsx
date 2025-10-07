"use client";

import { useState } from "react";
import { ArrowLeft, Eye, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
const carData = {
  id: "1",
  name: "Volkswagen ID6",
  style: "Volkswagen",
  type: "Auto",
  color: "Orange",
  price: "$285,892",
  status: "Live",
  image: "/id6-orange.png",
  analytics: {
    visitors: 1247,
    favorited: 89,
  },
  interactions: [
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
    {
      id: 7,
      name: "Robert Taylor",
      email: "r.taylor@email.com",
      phone: "+1 (555) 789-0123",
      initials: "RT",
      status: "contacted",
    },
    {
      id: 8,
      name: "Jennifer Martinez",
      email: "j.martinez@email.com",
      phone: "+1 (555) 890-1234",
      initials: "JM",
      status: "contacted",
    },
  ],
};

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
  const [showAllUsers, setShowAllUsers] = useState(false);

  const [userStatuses, setUserStatuses] = useState(
    carData.interactions.reduce((acc, user) => {
      acc[user.id] = user.status;
      return acc;
    }, {} as Record<number, string>)
  );

  const displayedUsers = showAllUsers
    ? carData.interactions
    : carData.interactions.slice(0, 3);

  const handleStatusChange = (userId: number, newStatus: string) => {
    setUserStatuses((prev) => ({ ...prev, [userId]: newStatus }));
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
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button className="bg-zinc-800 hover:bg-zinc-900 text-white cursor-pointer">
            Edit Post
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-10 p-6 space-y-6">
        {/* Car Image and Basic Info */}
        <Card>
          <CardContent className="p-6 ">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {carData.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className={`${
                      carData.status === "Live"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }`}
                  >
                    {carData.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  {carData.price}
                </div>
              </div>
            </div>

            {/* Car Image */}
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img
                src={carData.image}
                alt={carData.name}
                className="w-[500px] h-auto object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="p-6">
          <CardTitle className="text-2xl font-semibold text-gray-900 mb-4">
            Analytics
          </CardTitle>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 shadow border rounded-md p-10">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {carData.analytics.visitors.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Visitors</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shadow border rounded-md p-10">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {carData.analytics.favorited}
                  </div>
                  <div className="text-sm text-gray-600">Favorited</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Interactions */}
        <Card className="col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
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

            {!showAllUsers && carData.interactions.length > 3 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllUsers(true)}
                  className="w-fit shadow-none border-none bg-gray-100 cursor-pointer"
                >
                  Show More ({carData.interactions.length - 3} more users)
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
