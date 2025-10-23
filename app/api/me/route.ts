import { cookies, headers } from "next/headers";

const api =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "https://online-car-market.onrender.com/api";

export async function GET() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh")?.value;

  // If no refresh token, return 401
  if (!refresh) {
    return Response.json(
      {
        ok: false,
        message: "No refresh token found",
      },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${api}/auth/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.refresh || !data.access) {
      throw new Error("Invalid token response");
    }

    // Set cookies with proper configuration
    cookieStore.set({
      name: "access",
      value: data.access,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set({
      name: "refresh",
      value: data.refresh,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Fetch user data
    const userResponse = await fetch(`${api}/auth/user/`, {
      headers: { Authorization: `Bearer ${data.access}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await userResponse.json();

    return Response.json(
      {
        ok: true,
        message: "Successfully refreshed tokens",
        user,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /me error:", err.message);

    // Clear cookies on error
    cookieStore.delete("access");
    cookieStore.delete("refresh");

    return Response.json(
      {
        ok: false,
        message: err.message,
      },
      { status: 401 }
    );
  }
}
