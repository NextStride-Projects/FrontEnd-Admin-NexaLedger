// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get("tag");
  const redirectUrl = req.nextUrl.searchParams.get("redirect");

  if (!tag) {
    return NextResponse.json(
      { message: "Tag is required for revalidation." },
      { status: 400 }
    );
  }

  revalidateTag(tag);
  redirect(redirectUrl ?? "/")
}
