"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signin } from "@/lib/auth/signin";
import { useUserStore } from "@/store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { initializeAuthState, api } from "@/lib/api";
import { getDefaultRoute } from "@/lib/getDefaultRoute";
import { UserRole } from "@/hooks/useUserRole";
import { useQueryClient } from "@tanstack/react-query";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, formState } = useForm();
  const { errors } = formState;
  const [err, setErr] = useState("");
  const { setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const justRegistered = searchParams.get("registered") === "1";

  // Register fields with proper handlers
  const emailRegister = register("email", { required: "Email is required" });
  const passwordRegister = register("password", { required: "Password is required" });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErr("");
      const user = await signin(data);
      if (!user.access) throw new Error("Error trying to log you in");
      setUser(user.user);
      initializeAuthState(user.user);

      let userRole: UserRole = "dealer";

      try {
        if (user.user.is_staff) {
          userRole = "hr";
        } else {
          try {
            const dealer = await api<any>("/dealers/me/", { method: "GET" });
            if (dealer?.role) {
              const dealerRole = dealer.role.toLowerCase();
              if (
                dealerRole === "hr" ||
                dealerRole === "dealer" ||
                dealerRole === "accountant" ||
                dealerRole === "seller"
              ) {
                userRole = dealerRole as UserRole;
              }
            } else if (dealer) {
              userRole = "dealer";
            }
          } catch (dealerError) {
            try {
              const staff = await api<any[]>("/dealers/staff/", {
                method: "GET",
              });
              const currentUserStaff = staff.find(
                (s) => s.user.email === user.user.email,
              );
              if (currentUserStaff) {
                if (currentUserStaff.role === "accountant") {
                  userRole = "accountant";
                } else if (currentUserStaff.role === "seller") {
                  userRole = "seller";
                }
              }
            } catch (staffError) {}
          }
        }
      } catch (roleError) {
      }

      // Invalidate and refetch profile query after successful login
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      const defaultRoute = getDefaultRoute(userRole);
      router.push(defaultRoute);
    } catch (err: any) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <Link href={"/"} className="flex items-center justify-center gap-2 cursor-pointer">
          <Image
            src="/logo.svg"
            alt="hulucars"
            width={140}
            height={40}
            className="h-28 w-auto"
            priority
          />
        </Link>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
        {justRegistered && (
          <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-md px-3 py-2">
            Registration successful. Sign in with your new account.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...emailRegister}
              onChange={(e) => {
                emailRegister.onChange(e);
                setErr("");
              }}
            />
            {errors?.email && (
              <p className="text-red-400 text-sm">
                {errors?.email?.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="current-password"
                {...passwordRegister}
                onChange={(e) => {
                  passwordRegister.onChange(e);
                  setErr("");
                }}
              />
              <span
                className="absolute right-5 top-[8px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors?.password && (
              <p className="text-red-400 text-sm">
                {errors?.password?.message as string}
              </p>
            )}
          </div>
          {/* err */}
          {err && (
            <div className="flex gap-2">
              <p className="text-red-400 text-sm">{err}</p>
              <TriangleAlert className="text-red-400" size={18} />
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p> Login </p>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New dealer?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
