import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access");
    cookieStore.delete("refresh");

    return NextResponse.json(
      {
        ok: true,
        message: "Successfully logged out.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      {
        ok: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
