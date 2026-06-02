"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, TriangleAlert, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  registerDealerPublic,
  type RegisterDealerPayload,
} from "@/lib/dealersApi";

type SignupTextFields = Omit<RegisterDealerPayload, "business_license"> & {
  confirm_password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState<SignupTextFields>({
    email: "",
    password: "",
    confirm_password: "",
    company_name: "",
    license_number: "",
    tax_id: "",
    telebirr_account: "",
  });

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string>("");

  const update = (field: keyof SignupTextFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErr("");
  };

  const applyFile = (file: File) => {
    setLicenseFile(file);
    setLicensePreview(URL.createObjectURL(file));
    setErr("");
  };

  const clearLicense = () => {
    setLicenseFile(null);
    setLicensePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageItem = Array.from(items).find((item) =>
        item.type.startsWith("image/"),
      );
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (file) applyFile(file);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!form.email.trim()) { setErr("Email is required"); return; }
    if (!form.password) { setErr("Password is required"); return; }
    if (form.password !== form.confirm_password) { setErr("Passwords do not match"); return; }
    if (!form.company_name.trim()) { setErr("Company name is required"); return; }
    if (!form.license_number.trim()) { setErr("License number is required"); return; }
    if (!form.tax_id.trim()) { setErr("Tax ID is required"); return; }
    if (!form.telebirr_account.trim()) { setErr("Telebirr account is required"); return; }
    if (!licenseFile) { setErr("Business license image is required"); return; }

    setLoading(true);
    try {
      const payload: RegisterDealerPayload = {
        email: form.email.trim(),
        password: form.password,
        company_name: form.company_name.trim(),
        license_number: form.license_number.trim(),
        tax_id: form.tax_id.trim(),
        telebirr_account: form.telebirr_account.trim(),
        business_license: licenseFile,
      };
      await registerDealerPublic(payload);
      router.push("/signin?registered=1");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          <Image
            src="/logo.svg"
            alt="hulucars"
            width={140}
            height={40}
            className="h-28 w-auto"
            priority
          />
        </Link>
        <CardTitle className="text-lg md:text-xl">Create dealer account</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Register your dealership to access the ERP. After approval you can sign
          in with your email and password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company_name">Company name</Label>
            <Input
              id="company_name"
              placeholder="Your dealership name"
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="license_number">License number</Label>
              <Input
                id="license_number"
                placeholder="License #"
                value={form.license_number}
                onChange={(e) => update("license_number", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                placeholder="Tax ID"
                value={form.tax_id}
                onChange={(e) => update("tax_id", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telebirr_account">Telebirr account</Label>
            <Input
              id="telebirr_account"
              placeholder="Telebirr account / phone"
              value={form.telebirr_account}
              onChange={(e) => update("telebirr_account", e.target.value)}
              required
            />
          </div>

          {/* Business License Upload */}
          <div className="grid gap-2">
            <Label>
              Business license <span className="text-red-500">*</span>
            </Label>
            {licensePreview ? (
              <div className="relative w-full rounded-lg overflow-hidden border bg-muted">
                <img
                  src={licensePreview}
                  alt="Business license preview"
                  className="w-full max-h-48 object-contain"
                />
                <button
                  type="button"
                  onClick={clearLicense}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/30 rounded-lg py-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary">
                <Upload className="h-6 w-6" />
                <span className="text-sm font-medium">Click to upload or paste image</span>
                <span className="text-xs">PNG, JPG, WEBP</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) applyFile(file);
                  }}
                />
              </label>
            )}
            <p className="text-xs text-muted-foreground">
              Tip: You can paste an image directly with{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs font-mono">Ctrl+V</kbd>{" "}
              /{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs font-mono">⌘V</kbd>
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm_password">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirm_password}
                onChange={(e) => update("confirm_password", e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {err && (
            <div className="flex gap-2 items-start">
              <TriangleAlert className="text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{err}</p>
            </div>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
