import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await requireRole([
      "EMPLOYEE",
      "MANAGER",
      "PROJECT_DIRECTOR",
    ]);

    const body = await req.json();

    const {
      leaveType,
      startDate,
      endDate,
      reason,
      responsibilityTo,
      isHalfDay = false,
    } = body;

    if (!leaveType || !startDate || !endDate || !reason || !responsibilityTo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: session.user.id,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isHalfDay,
        reason,
        responsibilityTo,
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: err.message }, { status });
  }
}
