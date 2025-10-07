"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { handleSubmit, register, formState, setError } = useForm();
  const { errors } = formState;

  const onSubmit = async () => {
    try {
    } catch (err: any) {
      setError("email", { message: "Something went wrong. Try again." });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Lightning bolt icon */}
          {/* <div className="rounded-full flex items-center justify-center gap-3 border px-2">
            <Image
              src={"/wheel.png"}
              alt="wheel"
              width={100}
              height={100}
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold">Auto&mdash;Dealer</span>
          </div> */}

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            Forgot Password?
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  {...register("email", { required: "Email is required" })}
                  className="pl-10 h-12 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
                {errors?.email && (
                  <p className="text-red-400 text-sm">
                    {errors?.email?.message as string}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-medium cursor-pointer"
            >
              Reset Password
            </Button>
          </form>

          {/* Back to login link */}
          <Link
            href="/signin"
            className="text-zinc-600 hover:text-zinc-700 text-sm font-medium"
          >
            Back to Signin
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
