const api =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "https://online-car-market.onrender.com/api";

export async function GET() {
  try {
    // Get tokens from request headers instead of cookies
    const headers = await import("next/headers").then((m) => m.headers());
    const authHeader = headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        {
          ok: false,
          message: "No authorization header found",
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Fetch user data with the provided token
    const userResponse = await fetch(`${api}/auth/user/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await userResponse.json();

    return Response.json(
      {
        ok: true,
        message: "User data retrieved successfully",
        user,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /me error:", err.message);

    return Response.json(
      {
        ok: false,
        message: err.message,
      },
      { status: 401 }
    );
  }
}
