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
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signin } from "@/lib/auth/signin";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { initializeAuthState } from "@/lib/api";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, formState } = useForm();
  const { errors } = formState;
  const [err, setErr] = useState("");
  const { setUser } = useUserStore();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErr("");
      const user = await signin(data);
      if (!user.access) throw new Error("Error trying to log you in");
      setUser(user.user);
      initializeAuthState(user.user);
      router.push("/");
      data;
    } catch (err: any) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <Link
          href={"/"}
          className="flex items-center justify-center gap-2 mb-3 border-b pb-4"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/wheel.png"
              alt="wheel"
              width={100}
              height={100}
              className="w-full h-full"
            />
          </div>
          <h1>AUTO&mdash;DEALER</h1>
        </Link>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email", { required: "Email is required" })}
              onChange={() => setErr("")}
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
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="password"
                {...register("password", { required: "Password is required" })}
                onChange={() => setErr("")}
              />
              <span
                className="absolute right-5 top-[8px]"
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

          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col"
            )}
          ></div>
        </form>
      </CardContent>
    </Card>
  );
}
