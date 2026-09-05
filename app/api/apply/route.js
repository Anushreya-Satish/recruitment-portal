import { NextResponse } from "next/server";
import { saveApplication, getApplications } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, reason, departments } = body;

    // Backend Input Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Reason must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return NextResponse.json(
        { error: "At least one department must be selected." },
        { status: 400 }
      );
    }

    const savedRecord = saveApplication({ fullName, reason, departments });
    return NextResponse.json({ success: true, data: savedRecord }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = getApplications();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}