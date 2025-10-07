"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const volunteers = [
  {
    id: 1,
    name: "Beza Tesfaye",
    email: "@beza.tesfaye@example.et",
    initial: "B",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 2,
    name: "Yonatan",
    email: "@yonatan@example.et",
    initial: "Y",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 3,
    name: "Wube",
    email: "@wube@example.et",
    initial: "W",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 4,
    name: "Bisrat Yohannes",
    email: "@bisrat.yohannes@example.et",
    initial: "B",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 5,
    name: "Mekdes",
    email: "@mekdes@example.et",
    initial: "M",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 6,
    name: "Ahadu Sefefe",
    email: "@ahadu.sefefe@example.et",
    initial: "A",
    status: "Active",
    enrolled: "July 3, 2018",
  },
  {
    id: 7,
    name: "Lidya Sefefe",
    email: "@lidya.sefefe@example.et",
    initial: "L",
    status: "Active",
    enrolled: "July 3, 2018",
  },
];

export default function page() {
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVolunteers(volunteers.map((v) => v.id));
    } else {
      setSelectedVolunteers([]);
    }
  };

  const handleSelectVolunteer = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedVolunteers([...selectedVolunteers, id]);
    } else {
      setSelectedVolunteers(selectedVolunteers.filter((vid) => vid !== id));
    }
  };

  const isAllSelected = selectedVolunteers.length === volunteers.length;
  const isIndeterminate =
    selectedVolunteers.length > 0 &&
    selectedVolunteers.length < volunteers.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          All Users
        </h1>
        <p className="text-muted-foreground">
          Manage users — monitor access & activities .
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-6 py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all volunteers"
                {...(isIndeterminate && { "data-state": "indeterminate" })}
              />
            </div>
            <div className="col-span-6">
              <span className="text-sm font-medium text-foreground">Name</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-foreground">
                Status
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-foreground">
                Enrolled
              </span>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedVolunteers.includes(volunteer.id)}
                    onCheckedChange={(checked) =>
                      handleSelectVolunteer(volunteer.id, checked as boolean)
                    }
                    aria-label={`Select ${volunteer.name}`}
                  />
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {volunteer.initial}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {volunteer.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {volunteer.email}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-700 text-primary-foreground hover:bg-green-700 rounded-full lowercase"
                  >
                    {volunteer.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">
                    {volunteer.enrolled}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagignation */}
        <div className="p-4" /* p-4*/>
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
