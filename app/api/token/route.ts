export async function GET() {
  try {
    // Get tokens from request headers instead of cookies
    const headers = await import("next/headers").then((m) => m.headers());
    const authHeader = headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { ok: false, message: "No authorization header found" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    return Response.json(
      {
        ok: true,
        access: accessToken,
        refresh: null, // We'll handle refresh differently
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /token error:", err.message);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
