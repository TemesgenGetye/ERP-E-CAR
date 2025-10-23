"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Info, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function AccountSettingsPage() {
  const { dealer, isLoading, error, getDealer, updateDealer } = useProfile();

  const [formData, setFormData] = useState({
    company_name: "",
    license_number: "",
    tax_id: "",
    telebirr_account: "",
  });

  useEffect(() => {
    getDealer();
  }, []);

  useEffect(() => {
    if (dealer) {
      setFormData({
        company_name: dealer.company_name || "",
        license_number: dealer.license_number || "",
        tax_id: dealer.tax_id || "",
        telebirr_account: dealer.telebirr_account || "",
      });
    }
  }, [dealer]);

  const isSaveDisabled = useMemo(() => {
    if (!dealer) return true;
    return (
      formData.company_name === (dealer.company_name || "") &&
      formData.license_number === (dealer.license_number || "") &&
      formData.tax_id === (dealer.tax_id || "") &&
      formData.telebirr_account === (dealer.telebirr_account || "")
    );
  }, [dealer, formData]);

  const handleSave = async () => {
    if (!dealer) return;
    const payload: any = {};
    if (formData.company_name !== dealer.company_name)
      payload.company_name = formData.company_name;
    if (formData.license_number !== dealer.license_number)
      payload.license_number = formData.license_number;
    if (formData.tax_id !== dealer.tax_id) payload.tax_id = formData.tax_id;
    if (formData.telebirr_account !== dealer.telebirr_account)
      payload.telebirr_account = formData.telebirr_account;
    if (Object.keys(payload).length === 0) return;

    await updateDealer(payload);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">Update your dealer profile.</p>
          {isLoading && (
            <p className="text-gray-500 text-sm mt-1">Loading profile...</p>
          )}
        </div>

        <Card className="border border-gray-200">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="company_name"
                    className="text-sm font-medium text-black"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    disabled={isLoading}
                    className="border-gray-200 focus:border-black focus:ring-black py-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="license_number"
                    className="text-sm font-medium text-black"
                  >
                    License Number
                  </Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        license_number: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    className="border-gray-200 focus:border-black focus:ring-black py-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tax_id"
                    className="text-sm font-medium text-black"
                  >
                    Tax ID
                  </Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_id: e.target.value })
                    }
                    disabled={isLoading}
                    className="border-gray-200 focus:border-black focus:ring-black py-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="telebirr_account"
                    className="text-sm font-medium text-black"
                  >
                    Telebirr Account
                  </Label>
                  <Input
                    id="telebirr_account"
                    value={formData.telebirr_account}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telebirr_account: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    className="border-gray-200 focus:border-black focus:ring-black py-8"
                  />
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

            {/* Save helper text */}
            {error ? (
              <div className="mt-12 pt-8 border-t border-red-200">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={() =>
                  dealer &&
                  setFormData({
                    company_name: dealer.company_name || "",
                    license_number: dealer.license_number || "",
                    tax_id: dealer.tax_id || "",
                    telebirr_account: dealer.telebirr_account || "",
                  })
                }
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-black hover:bg-gray-800 text-white px-8"
                onClick={handleSave}
                disabled={isSaveDisabled || isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
