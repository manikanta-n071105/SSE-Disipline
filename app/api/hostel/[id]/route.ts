import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET all hostel submissions for a student
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/"); 
    const id = parts[parts.length - 1]; 

    const hostels = await prisma.hostel.findMany({
      where: { hostelId: id }, 
    });

    return NextResponse.json(hostels);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch hostel submissions" },
      { status: 500 }
    );
  }
}

// PUT to update 'submit' (admin action)
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split("/").pop();
    if (!idStr) return NextResponse.json({ message: "ID not found" }, { status: 400 });

    const id = parseInt(idStr); // Hostel ID is Int
    const body = await req.json();

    const updated = await prisma.hostel.update({
      where: { id },
      data: { submit: body.submit },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: "PUT error", error: err.message }, { status: 500 });
  }
}

// PATCH to update comeoutTime, comeinTime, returned
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split("/").pop();
    if (!idStr) return NextResponse.json({ message: "ID not found" }, { status: 400 });

    const id = parseInt(idStr); // Hostel ID is Int
    const body = await req.json();
    const { comeoutTime, comeinTime, returned } = body;

    const updated = await prisma.hostel.update({
      where: { id },
      data: {
        ...(comeoutTime && { comeoutTime: new Date(comeoutTime) }),
        ...(comeinTime && { comeinTime: new Date(comeinTime) }),
        ...(returned !== undefined && { returned }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: "PATCH error", error: err.message }, { status: 500 });
  }
}
