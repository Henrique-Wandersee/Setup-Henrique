import { NextResponse } from "next/server";
import { reserveTicketsAction } from "@/app/actions/tickets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await reserveTicketsAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
