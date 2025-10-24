"use server";
import { cookies } from "next/headers";

interface SignInParams {
  email: string;
  password: string;
}

export const signin = async (data: SignInParams) => {
  try {
    const res = await fetch(`${process.env.BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Something went wrong");
    const user = await res.json();
    if (!user.access)
      throw new Error("Error trying to log you in. Please try again.");
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
    console.log(process.env.BASE_API_URL);
    const res = await fetch(
      `${process.env.BASE_API_URL}/users/user-profiles/${id}`
    );
    if (!res.ok) throw new Error("Something went wrong");
    const user = await res.json();
    console.log(user);
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
