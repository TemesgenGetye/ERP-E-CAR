"use server";
import { cookies } from "next/headers";
import { API_URL } from "../config";

interface SignInParams {
  email: string;
  password: string;
}

export const signin = async (data: SignInParams) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        body?.non_field_errors?.[0] ||
        body?.detail ||
        body?.message ||
        body?.error ||
        (typeof body === "object" && body !== null
          ? Object.values(body).flat().find((v) => typeof v === "string")
          : null) ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }

    const user = body;
    if (!user.access) {
      const errorMessage =
        user?.non_field_errors?.[0] ||
        user?.detail ||
        user?.message ||
        "Error trying to log you in. Please try again.";
      throw new Error(errorMessage as string);
    }
    const cookiess = await cookies();
    cookiess.set({
      name: "access",
      value: user.access,
      httpOnly: true, // 🔑 makes it HttpOnly
      secure: true, // only over HTTPS
      sameSite: "strict", // prevent CSRF
      path: "/", // send on all requests
      maxAge: 60 * 15, // 15 minutes
    });
    cookiess.set({
      name: "refresh",
      value: user.refresh,
      httpOnly: true, // 🔑 makes it HttpOnly
      secure: true, // only over HTTPS
      sameSite: "strict", // prevent CSRF
      path: "/", // send on all requests
      maxAge: 60 * 60 * 24 * 30, // 30d minutes
    });

    return user;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

export const getUser = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/users/user-profiles/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }
    const user = await res.json();
    // console.log(user);
    return user;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const cookie = await cookies();
    const access = cookie.get("access");
    const refresh = cookie.get("refresh");
    return { access, refresh };
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
