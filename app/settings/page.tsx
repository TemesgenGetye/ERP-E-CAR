"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Info, User } from "lucide-react";

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Alemayehu Gezahegne",
    email: "myemail@address.com",
    password: "••••••••••",
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">Edit your name, avatar etc.</p>
        </div>

        <Card className="border border-gray-200">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-black"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-gray-200 focus:border-black focus:ring-black py-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-black"
                  >
                    Email Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border-gray-200 focus:border-black focus:ring-black py-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-black"
                  >
                    Password
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      readOnly
                      className="border-gray-200 bg-gray-50 py-8"
                    />
                    <Button
                      variant="ghost"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4 relative h-fit">
                <Avatar className="w-24 h-24 bg-gray-200">
                  <AvatarFallback className="bg-gray-200">
                    <User className="w-12 h-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Button className="bg-black hover:bg-gray-800 text-white absolute bottom-0 left-[calc(50%-15px)] rounded-full">
                  <Camera />
                </Button>
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button className="text-red-500 mb-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                Delete account
              </Button>
              {/* <p className="text-gray-600 text-sm mb-1">
                You will receive an email to confirm your decision.
              </p>*/}
              <div className="flex items-center jusify-between gap-2">
                <span>
                  <Info size={18} className="" />
                </span>
                <p className="text-gray-600 text-sm ">
                  Please note, that all your data will be permanently erased.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white px-8">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
