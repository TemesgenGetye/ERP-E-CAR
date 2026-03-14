"use server";
import { API_URL } from "../config";

interface SignUpParams {
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
  description?: string;
}

export const signup = async (data: SignUpParams) => {
  try {
    const res = await fetch(`${API_URL}/auth/registration/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.non_field_errors?.[0] ||
        errorData?.email?.[0] ||
        errorData?.password1?.[0] ||
        errorData?.password2?.[0] ||
        (typeof errorData === "object" && errorData !== null
          ? Object.values(errorData).flat().find((v) => typeof v === "string")
          : null) ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }
    const user = await res.json();

    return user;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
