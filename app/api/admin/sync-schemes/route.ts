import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/auth";
import { syncSchemesFromInternet } from "@/lib/scheme-sync";

export async function POST(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncSchemesFromInternet();
    return NextResponse.json(result);
  } catch (error) {
    console.error("sync-schemes error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to sync schemes."
      },
      { status: 500 }
    );
  }
}
