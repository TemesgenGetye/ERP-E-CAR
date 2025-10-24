import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access")?.value;
    const refresh = cookieStore.get("refresh")?.value;

    if (!access) {
      return Response.json(
        { ok: false, message: "No access token found" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        ok: true,
        access,
        refresh,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /token error:", err.message);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
